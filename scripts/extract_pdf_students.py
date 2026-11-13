import zlib, re, json, os

with open('public/assets/aistudio/Nomor_Urut_Peserta_Didik___Buku_Induk_56d72874.pdf', 'rb') as f:
    data = f.read()

streams = re.findall(rb'stream[\r\n]+(.*?)[\r\n]+endstream', data, re.DOTALL)
cmap = {}
dec = zlib.decompress(streams[34])
for bf in re.findall(rb'<([0-9a-fA-F]{4})>\s+<([0-9a-fA-F]{4})>', dec):
    cmap[int(bf[0], 16)] = chr(int(bf[1], 16))
for bfr in re.findall(rb'<([0-9a-fA-F]{4})>\s+<([0-9a-fA-F]{4})>\s+<([0-9a-fA-F]{4})>', dec):
    s_from = int(bfr[0], 16)
    s_to = int(bfr[1], 16)
    d_start = int(bfr[2], 16)
    for step in range(s_to - s_from + 1):
        cmap[s_from + step] = chr(d_start + step)

cmap[0x0086] = 'e'
cmap[0x0085] = 'd'
cmap[0x005E] = ''

def clean_txt(s):
    s = s.replace('\x86', 'e').replace('\x85', 'd').replace('\x11', "'").replace('\n', ' ')
    s = re.sub(r'\s+', ' ', s)
    return s.strip()

def get_page_items(s_bytes, cmap):
    items = []
    pattern = re.compile(rb'1\s+0\s+0\s+-1\s+([\d\.]+)\s+([\d\.]+)\s+Tm(.*?)(?=ET|\Z)', re.DOTALL)
    for m in pattern.finditer(s_bytes):
        x = float(m.group(1))
        y = float(m.group(2))
        block = m.group(3)
        words = []
        for h_m in re.finditer(rb'<([0-9a-fA-F]+)>\s*Tj', block):
            h = h_m.group(1).decode()
            w = ''
            for i in range(0, len(h), 4):
                c = int(h[i:i+4], 16)
                ch = cmap.get(c, '')
                if ch == '\x86': ch = 'e'
                if ch == '\x85': ch = 'd'
                w += ch
            words.append(w)
        full_text = ' '.join(words).strip()
        if full_text:
            items.append((x, y, full_text))
    return items

all_students = []
for page_idx in range(len(streams)):
    try:
        dec_stream = zlib.decompress(streams[page_idx])
        items = get_page_items(dec_stream, cmap)
        
        y_rows = []
        sorted_items = sorted(items, key=lambda it: it[1])
        for it in sorted_items:
            x, y, txt = it
            no_spaces = txt.replace(' ', '').lower()
            if y < 55:
                continue
            if 'http' in no_spaces or 'syntaxtrust' in no_spaces or 'nomorurut' in no_spaces:
                continue
            if 'mengetahui' in no_spaces or 'bojonegoro' in no_spaces or 'nomorurutp' in no_spaces:
                continue
            if txt in ['Nomor', 'Urut', 'NIPD', 'Nomor In…ukPesertaDi…ik', 'Nasional NISN', 'NamaPesertaDi…ik', 'L /P', 'Kelas/Fase']:
                continue
            if re.match(r'^\d+\s*\/\s*\d+$', txt): # page numbers like 30 / 31
                continue
            
            placed = False
            for row in y_rows:
                if abs(row['mean_y'] - y) <= 12:
                    row['items'].append(it)
                    row['mean_y'] = sum(i[1] for i in row['items']) / len(row['items'])
                    placed = True
                    break
            if not placed:
                y_rows.append({'mean_y': y, 'items': [it]})

        for row in sorted(y_rows, key=lambda r: r['mean_y']):
            row_items = sorted(row['items'], key=lambda it: it[0])
            col1 = ''.join([t for x, y, t in row_items if x < 65]).strip()
            col2 = ''.join([t for x, y, t in row_items if 65 <= x < 210]).strip()
            col3 = ''.join([t for x, y, t in row_items if 210 <= x < 390]).strip()
            col4 = ' '.join([t for x, y, t in row_items if 390 <= x < 810]).strip()
            col5 = ''.join([t for x, y, t in row_items if 810 <= x < 865]).strip()
            col6 = ' '.join([t for x, y, t in row_items if x >= 865]).strip()

            col1_clean = col1.replace(' ', '')
            if col1_clean.endswith('.') and col1_clean[:-1].isdigit():
                cls = clean_txt(col6).replace('Fase', 'Fase ')
                cls = re.sub(r'\s+', ' ', cls)
                all_students.append({
                    'reg': int(col1_clean[:-1]),
                    'nipd': clean_txt(col2).replace(' ', ''),
                    'nisn': clean_txt(col3).replace(' ', ''),
                    'fullName': clean_txt(col4),
                    'gender': clean_txt(col5),
                    'currentClass': cls
                })
    except Exception as e:
        pass

seen = set()
unique_students = []
for s in sorted(all_students, key=lambda x: x['reg']):
    if s['reg'] not in seen:
        seen.add(s['reg'])
        unique_students.append(s)

os.makedirs('public/data', exist_ok=True)
with open('public/data/nomor_urut_register_1144.json', 'w') as out_f:
    json.dump(unique_students, out_f, indent=2)

print(f'Done! Saved {len(unique_students)} records (1 to {unique_students[-1]["reg"] if unique_students else 0}) to public/data/nomor_urut_register_1144.json')
regs = set(d['reg'] for d in unique_students)
missing = [i for i in range(1, 1145) if i not in regs]
print('Missing:', len(missing), missing)

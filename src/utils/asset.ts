/**
 * Alamat aset publik yang aman untuk hosting di sub-folder (GitHub Pages: /nama-repo/).
 * Contoh: asset('/assets/logo-smkn-dander.png')
 */
export const asset = (path: string): string =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

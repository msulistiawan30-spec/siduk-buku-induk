import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initDriveSync } from './services/driveSync';

initDriveSync();

createRoot(document.getElementById('root')!).render(<App />);

import { createRoot } from 'react-dom/client';
import axios from 'axios';
import App from './App.tsx';
import { API_BASE } from '@/lib/api';
import './index.css';

axios.defaults.baseURL = API_BASE;

createRoot(document.getElementById("root")!).render(<App />);

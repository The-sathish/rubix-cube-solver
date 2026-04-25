import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import { PracticePage } from './pages/PracticePage';
import { MoveDetailPage } from './pages/MoveDetailPage';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/practice/:move" element={<MoveDetailPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

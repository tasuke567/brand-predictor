import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css'; // ← ✅ สำคัญมาก
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PredictionResult from './components/PredictionResult.tsx'; // ← ✅ สำคัญมาก
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> {/* ✅ ห่อไว้ตรงนี้ */}
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/result" element={<PredictionResult />} />

    </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

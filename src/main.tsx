import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/index.css'; 
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PredictionResult from './pages/PredictionResultPage.tsx'; // ✅ import หน้าใหม่ที่เราสร้างขึ้นมา
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     <ThemeProvider>
     <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/result" element={<PredictionResult />} />

    </Routes>
    </BrowserRouter>
     </ThemeProvider>
    
  </React.StrictMode>
);

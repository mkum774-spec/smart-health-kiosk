import React from 'react';
import ReactDOM from 'react-dom/client';
import { KioskProvider } from './context/KioskContext';
import { AppContent } from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <KioskProvider>
      <AppContent />
    </KioskProvider>
  </React.StrictMode>
);

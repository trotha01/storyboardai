import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './pages/Home';
import { Toaster } from 'react-hot-toast';
import './app.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <>
      <Home />
      <Toaster position="top-right" />
    </>
  </React.StrictMode>
);

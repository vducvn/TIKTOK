import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import AdminApp from './AdminApp.tsx';
import './index.css';

console.log("App starting initialization...");
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Root element not found!");
} else {
  const path = window.location.pathname;
  console.log("Current path:", path);
  
  if (path === '/admin-root-2026' || path === '/admin-panel-secret-master' || path === '/admin-jaynguyen2026' || path === '/admin-panel-secret-jaynguyen') {
    createRoot(rootElement).render(
      <StrictMode>
        <AdminApp />
      </StrictMode>,
    );
  } else {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  }
}

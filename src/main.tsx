import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from './components/theme-provider'
import './index.css'

window.onerror = (msg, url, line, col, error) => {
  console.error('Global error:', msg, 'line:', line, 'error:', error);
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="interq-admin-theme">
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)

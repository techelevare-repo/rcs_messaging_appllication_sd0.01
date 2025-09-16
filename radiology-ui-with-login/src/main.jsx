import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeColorProvider } from './ColorModeContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeColorProvider>
      <App />
    </ThemeColorProvider>
  </React.StrictMode>
);

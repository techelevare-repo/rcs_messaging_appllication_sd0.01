import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme.js';
import './styles/global.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ThemeProvider>
    </React.StrictMode>
);



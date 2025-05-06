import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import theme from './theme';
import App from './App.jsx';
import './index.css';

// Configurar las características futuras de React Router
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';
const router = NavigationContext.router;
if (router && typeof router.future === 'object') {
  router.future = {
    ...router.future,
    v7_startTransition: true,
    v7_relativeSplatPath: true
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

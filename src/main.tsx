import "rc-slider/assets/index.css";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import "./fonts/line-awesome-1.3.0/css/line-awesome.css";
import "./index.css";
import "./styles/index.scss";

import App from './App.tsx';
import { AuthProvider } from "./context/AuthContext.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)

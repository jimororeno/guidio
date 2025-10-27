import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./config/i18n/i18n"; // Importa la configuración de i18n
import "./css/UserDropdown.css";

import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import { AlertProvider } from "./contexts/AlertContext.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <AlertProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AlertProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
import { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";

// 1. Crear el contexto
export const ThemeContext = createContext();

// 2. Crear el proveedor del contexto
export const ThemeProvider = ({ children }) => {
  // Inicializar el estado del tema
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme;
    }
    // Detectar preferencia del sistema operativo
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  // Efecto para aplicar el tema al <body> y guardar en localStorage
  useEffect(() => {
    document.body.setAttribute("data-bs-theme", theme); // estándar en Bootstrap 5.3+
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Función para alternar el tema
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Hook personalizado para usar el tema fácilmente
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired, // si los children son elementos JSX (lo normal)
};

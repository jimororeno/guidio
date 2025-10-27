// /src/components/Alert/AlertContext.jsx
import { createContext, useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";

export const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = useCallback(
    (message, level = "primary", duration = 5000) => {
      const id = Date.now() + Math.random();
      setAlerts((prev) => [...prev, { id, message, level, duration }]);
    },
    []
  );

  const removeAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, removeAlert, alerts }}>
      {children}
    </AlertContext.Provider>
  );
};

AlertProvider.propTypes = {
  children: PropTypes.node.isRequired,
};


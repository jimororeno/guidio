// /src/components/Alert/AlertStack.jsx
import PropTypes from "prop-types";
import { useAlert } from "../contexts/AlertContext";
import { useEffect, useState } from "react";

const AlertStack = () => {
  const { alerts, removeAlert } = useAlert();

  return (
    <div
      style={{
        position: "fixed",
        top: "70px",
        right: "20px",
        zIndex: 1050,
        width: "300px",
      }}
    >
      {alerts.map(({ id, message, level, duration }) => (
        <AlertItem
          key={id}
          id={id}
          message={message}
          level={level}
          duration={duration}
          onClose={removeAlert}
        />
      ))}
    </div>
  );
};

export default AlertStack;

// Componente individual
const AlertItem = ({ id, message, level, duration, onClose }) => {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => handleClose(), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      onClose(id);
    }, 300); // duración de la transición
  };

  if (!visible) return null;

  return (
    <div
      className={`alert alert-${level} alert-dismissible mb-2 ${
        !exiting ? "fade show" : "fade"
      }`}
      role="alert"
      style={{
        transform: exiting ? "translateX(100%)" : "translateX(0)",
        transition: "all 0.3s ease",
      }}
    >
      {message}
      <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
    </div>
  );
};


AlertItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  message: PropTypes.string.isRequired,
  level: PropTypes.string,
  duration: PropTypes.number,
  onClose: PropTypes.func.isRequired,
};


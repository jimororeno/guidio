// /src/components/ConfirmModal.jsx

import PropTypes from "prop-types";

const ConfirmModal = ({ 
  show, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  level = "primary" // 🔹 Valor por defecto
}) => {
  if (!show) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          {/* 🔹 Cabecera con color dinámico */}
          <div className={`modal-header bg-${level} text-white`}>
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onCancel}
            ></button>
          </div>

          <div className="modal-body">
            <p>{message}</p>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn custom-btn-secondary fw-bold" onClick={onCancel}>
              Cancelar
            </button>
            {/* 🔹 Botón principal con el mismo color que el header */}
            <button type="button" className={`btn btn-${level} fw-bold`} onClick={onConfirm}>
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Opcional: validación de props
ConfirmModal.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  level: PropTypes.oneOf([
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
    "info",
    "dark",
    "light"
  ])
};

export default ConfirmModal;

import { useState } from "react";
import api from "../services/api";
import { useTranslation } from "react-i18next";
import { useAlert } from "../contexts/AlertContext";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const { t } = useTranslation();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const TIME_ALERT_SUCCESS = import.meta.env.VITE_TIME_ALERT_SUCCESS;

  // --- Validación de formulario en cliente ---
  const validateForm = () => {
    const newErrors = {};
    let valid = true;

    if (!email.trim()) {
      newErrors.email = t("email_required");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t("email_invalid");
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // --- Submit del formulario ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    if (!validateForm()) {
      setMessage(t("please_correct_errors"));
      return;
    }

    try {
      const response = await api.post("/users/forgot-password", { email });
      showAlert(response.data.message, "success", TIME_ALERT_SUCCESS);
      setEmail("");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          t("error_reset_request")
      );
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-md-center">
        <div className="col-md-6">
          <div className="card shadow mb-4">
            <div className="d-flex align-items-center mb-4 mt-3">
              {/* Botón de volver */}
              <button
                type="button"
                className="btn custom-btn-secondary d-flex align-items-center ms-3 fw-bold"
                onClick={() => navigate(-1)}
              >
                <i className="bi bi-caret-left"></i>
              </button>

              {/* Título centrado */}
              <h2 className="flex-grow-1 text-center fw-bold custom-title m-0">
                {t("reset_password_forgot")}
              </h2>

              {/* espacio simétrico para centrar el título */}
              <div style={{ width: "40px" }}></div>
            </div>

            <div className="card-body">
              {/* text-info     */}
              <div
                className="alert custom-bg-secondary-ligth-color"
                role="alert"
              >
                <p className="mb-0">{t("enter_email_reset_link")}</p>
              </div>

              {/* --- Mensajes de error --- */}
              {message && (
                <div
                  className={`alert ${
                    message.includes("enviado") || message.includes("sent")
                      ? "alert-success"
                      : "alert-danger"
                  }`}
                  role="alert"
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* --- Campo: Email --- */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    {t("email")}
                  </label>
                  <input
                    type="email"
                    className={`form-control custom-form-input ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    id="email"
                    placeholder={t("email")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {errors.email && (
                    <div className="invalid-feedback d-block">
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* --- Botón de envío --- */}
                <button type="submit" className="btn custom-btn-gradient w-100">
                  {t("send_reset_link")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

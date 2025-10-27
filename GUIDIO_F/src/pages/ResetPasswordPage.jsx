import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAlert } from "../contexts/AlertContext";
import userService from "../services/userService";

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showAlert } = useAlert();
  const TIME_ALERT_SUCCESS = import.meta.env.VITE_TIME_ALERT_SUCCESS;

  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  // --- Obtener token de la URL ---
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get("token");

    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setMessage(t("token_not_found"));
    }
    setLoading(false);
  }, [location.search, t]);

  // --- Validación de formulario en cliente ---
  const validateForm = () => {
    const newErrors = {};
    let valid = true;

    if (!newPassword.trim()) {
      newErrors.newPassword = t("new_password_required");
      valid = false;
    } else if (newPassword.length < 6) {
      newErrors.newPassword = t("password_min_length", { min: 6 });
      valid = false;
    }

    if (!confirmNewPassword.trim()) {
      newErrors.confirmNewPassword = t("confirm_new_password_required");
      valid = false;
    } else if (newPassword !== confirmNewPassword) {
      newErrors.confirmNewPassword = t("new_passwords_do_not_match");
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
      const response = await userService.resetPassword(token, newPassword);
      console.log("Reset password response:", response);
      showAlert(response.message, "success", TIME_ALERT_SUCCESS);
      setNewPassword("");
      setConfirmNewPassword("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          t("error_resetting_password")
      );
    }
  };

  // --- Spinner mientras se verifica token ---
  if (loading)
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border custom-text-primary-dark" role="status">
          <span className="visually-hidden">{t("loading")}</span>
        </div>
        <p>{t("verify_token")}</p>
      </div>
    );

  // --- Mensaje de token no encontrado ---
  if (!token)
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger" role="alert">
          {message}
        </div>
      </div>
    );

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
                onClick={() => navigate("/login")}
              >
                <i className="bi bi-caret-left"></i>
              </button>

              {/* Título centrado */}
              <h2 className="flex-grow-1 text-center fw-bold custom-title m-0">
                {t("reset_password")}
              </h2>

              {/* espacio simétrico para centrar el título */}
              <div style={{ width: "40px" }}></div>
            </div>

            <div className="card-body">
              {/* --- Mensajes de éxito o error --- */}
              {message && (
                <div
                  className={`alert ${
                    message.includes("exitosamente") ||
                    message.includes("successfully")
                      ? "alert-success"
                      : "alert-danger"
                  }`}
                  role="alert"
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* --- Campo: Nueva contraseña --- */}
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">
                    {t("new_password")}
                  </label>
                  <input
                    type="password"
                    className={`form-control custom-form-input ${
                      errors.newPassword ? "is-invalid" : ""
                    }`}
                    id="newPassword"
                    placeholder={t("new_password")}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      // 👇 elimina el error de este campo mientras escribe
                      if (errors.newPassword) {
                        setErrors((prev) => ({
                          ...prev,
                          newPassword: undefined,
                        }));
                      }
                    }}
                    required
                  />
                  {errors.newPassword && (
                    <div className="invalid-feedback d-block">
                      {errors.newPassword}
                    </div>
                  )}
                </div>

                {/* --- Campo: Confirmar nueva contraseña --- */}
                <div className="mb-3">
                  <label htmlFor="confirmNewPassword" className="form-label">
                    {t("confirm_new_password")}
                  </label>
                  <input
                    type="password"
                    className={`form-control custom-form-input ${
                      errors.confirmNewPassword ? "is-invalid" : ""
                    }`}
                    id="confirmNewPassword"
                    placeholder={t("confirm_new_password")}
                    value={confirmNewPassword}
                    onChange={(e) => {
                      setConfirmNewPassword(e.target.value);
                      // 👇 elimina el error de este campo mientras escribe
                      if (errors.confirmNewPassword) {
                        setErrors((prev) => ({
                          ...prev,
                          confirmNewPassword: undefined,
                        }));
                      }
                    }}
                    required
                  />

                  {errors.confirmNewPassword && (
                    <div className="invalid-feedback d-block">
                      {errors.confirmNewPassword}
                    </div>
                  )}
                </div>

                {/* --- Botón de envío --- */}
                <button type="submit" className="btn custom-btn-gradient w-100">
                  {t("reset_password")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

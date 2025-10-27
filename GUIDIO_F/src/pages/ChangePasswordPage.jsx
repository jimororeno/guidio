import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAlert } from "../contexts/AlertContext";
import { useNavigate } from "react-router-dom";
import userService from "../services/userService";
import { AuthContext } from "../contexts/AuthContext";


const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const { t } = useTranslation();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  
  const TIME_ALERT_SUCCESS = import.meta.env.VITE_TIME_ALERT_SUCCESS;

  // --- Validación de formulario en cliente ---
  const validateForm = () => {
    const newErrors = {};
    let valid = true;

    if (!currentPassword.trim()) {
      newErrors.currentPassword = t("current_password_required");
      valid = false;
    }

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
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    if (!validateForm()) {
      setMessage(t("please_correct_errors"));
      return;
    }

    try {
      const response = await userService.changePassword(
        currentPassword,
        newPassword
        );
      showAlert(response.message, "success", TIME_ALERT_SUCCESS);
      // Después de cambiar la contraseña, cerrar sesión y redirigir al login
      handleLogout();
      

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          t("error_resetting_password")
      );
    }
  };

   const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-md-center">
        <div className="col-md-6">
          <div className="card shadow mb-4">
            <div className="d-flex align-items-center mb-4 mt-3">
              {/* Botón de volver  */}
              <button
                type="button"
                className="btn custom-btn-secondary d-flex align-items-center ms-3 fw-bold"
                onClick={() => navigate(-1)}
              >
                <i className="bi bi-caret-left"></i>
              </button>

              {/* Título centrado */}
              <h2 className="flex-grow-1 text-center fw-bold custom-title m-0">
                {t("change_password")}
              </h2>

              {/* espacio para centrar el título */}
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

              <form onSubmit={handleChangePassword}>
                {/* --- Campo: Contraseña actual --- */}
                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label">
                    {t("current_password")}
                  </label>
                  <input
                    type="password"
                    className={`form-control custom-form-input ${
                      errors.currentPassword ? "is-invalid" : ""
                    }`}
                    id="currentPassword"
                    placeholder={t("current_password")}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                  {errors.currentPassword && (
                    <div className="invalid-feedback d-block">
                      {errors.currentPassword}
                    </div>
                  )}
                </div>

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
                    onChange={(e) => setNewPassword(e.target.value)}
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
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
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
                  {t("change_password")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;

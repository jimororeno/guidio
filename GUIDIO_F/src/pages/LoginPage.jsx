import { useState, useContext } from "react";
import authService from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../contexts/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({}); // 👈 para controlar errores de validación

  const { setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // --- Validación del formulario ---
  const validateForm = () => {
    const newErrors = {};
    let valid = true;

    // Validar email
    if (!email.trim()) {
      newErrors.email = t("email_required");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t("invalid_email_format");
      valid = false;
    }

    // Validar contraseña
    if (!password.trim()) {
      newErrors.password = t("password_required");
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      setMessage(t("please_correct_errors"));
      return;
    }

    try {
      await authService.login(email, password);
      setCurrentUser(authService.getCurrentUser());
      setIsSuccess(true);
      setMessage(t("login_successful"));
      navigate("/");
    } catch (error) {
      setIsSuccess(false);
      setMessage(
        (error.response && error.response.data?.message) ||
          error.message ||
          error.toString()
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-start justify-content-center min-vh-100 custom-login-container">
      <div className="card p-4 rounded-3 shadow custom-login-card mt-5">
        <h2 className="text-center fw-bold mb-4 custom-title">{t("sign_in")}</h2>

        {message && (
          <div
            className={`alert ${isSuccess ? "alert-success" : "alert-danger"}`}
            role="alert"
          >
            {message}
          </div>
        )}

         <form onSubmit={handleLogin} noValidate> {/* novalidate --> para que no se ejecute la validación nativa del navegador */}
          {/* --- Campo: Email --- */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              {t("email")}
            </label>
            <input
              type="email"
              id="email"
              className={`form-control custom-form-input ${
                errors.email ? "is-invalid" : ""
              }`}
              placeholder={t("email")}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                // Elimina el error al escribir
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
              required
            />
            {errors.email && (
              <div className="invalid-feedback d-block">{errors.email}</div>
            )}
          </div>

          {/* --- Campo: Contraseña --- */}
          <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label">
              {t("password")}
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className={`form-control custom-form-input pe-5 ${
                errors.password ? "is-invalid" : ""
              }`}
              placeholder={t("password")}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                // Elimina el error al escribir
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }
              }}
              required
            />
            <i
              className={`bi ${
                showPassword ? "bi-eye-slash" : "bi-eye"
              } position-absolute top-50 end-0 translate-middle-y me-3 mt-1`}
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              role="button"
            ></i>

            {errors.password && (
              <div className="invalid-feedback d-block">
                {errors.password}
              </div>
            )}

            <div className="text-end mt-1 small">
              <Link
                to="/forgot-password"
                className="text-decoration-none custom-text-primary-dark"
              >
                {t("forgot_password")}
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="btn custom-btn-gradient w-100 mb-3"
            disabled={loading}
          >
            {loading && (
              <span className="spinner-border spinner-border-sm me-2"></span>
            )}
            {t("login")}
          </button>
        </form>

        <div className="text-center">
          <Link
            to="/register"
            className="fw-bold text-decoration-none custom-signup-link"
          >
            {t("no_account_register")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

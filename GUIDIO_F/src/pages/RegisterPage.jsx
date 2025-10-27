import { useState } from "react";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAlert } from "../contexts/AlertContext";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const TIME_ALERT_SUCCESS = import.meta.env.VITE_TIME_ALERT_SUCCESS;

  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showAlert } = useAlert();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: null }); // limpia error al escribir
  };

  const validateForm = () => {
    const newErrors = {};

    // Username
    if (!formData.username.trim()) {
      newErrors.username = t("username_required");
    } else if (formData.username.length < 3) {
      newErrors.username = t("username_min");
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = t("email_required");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = t("email_invalid");
      }
    }

    // Password
    if (!formData.password.trim()) {
      newErrors.password = t("password_required");
    } else if (formData.password.length < 6) {
      newErrors.password = t("password_min");
    }

    // Confirm Password
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = t("confirm_required");
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("passwords_do_not_match");
    }

    return newErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await authService.register(formData.username, formData.email, formData.password);
      showAlert(t("registration_successful"), "success", TIME_ALERT_SUCCESS);
      setIsSuccess(true);
      navigate("/login");
    } catch (error) {
      setMessage(
        error.response?.data?.message || error.message || t("error_registering")
      );
      setIsSuccess(false);
    }
  };

  return (
    <div className="container mt-5 ">
      <div className="row justify-content-md-center">
        <div className="col-md-6">
          <div className="card shadow mb-4">
            <h2 className="text-center fw-bold mb-4 mt-3 custom-title">
              {t("register_user")}
            </h2>
            

            <div className="card-body">
              {message && (
                <div
                  className={`alert ${isSuccess ? "alert-success" : "alert-danger"}`}
                  role="alert"
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleRegister}>
                {/* Username */}
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">{t("username")}</label>
                  <input
                    type="text"
                    className={`form-control custom-form-input ${errors.username ? "is-invalid" : ""}`}
                    id="username"
                    placeholder={t("username")}
                    value={formData.username}
                    onChange={handleChange}
                  />
                  {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">{t("email")}</label>
                  <input
                    type="email"
                    className={`form-control custom-form-input ${errors.email ? "is-invalid" : ""}`}
                    id="email"
                    placeholder={t("email")}
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                {/* Password */}
                <div className="mb-3 position-relative">
                  <label htmlFor="password" className="form-label">{t("password")}</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-control custom-form-input pe-5 ${errors.password ? "is-invalid" : ""}`}
                    id="password"
                    placeholder={t("password")}
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <i
                    className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} position-absolute top-50 end-0 translate-middle-y me-3 mt-3`}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  ></i>
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                {/* Confirm Password */}
                <div className="mb-3 position-relative">
                  <label htmlFor="confirmPassword" className="form-label">{t("confirm_password")}</label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className={`form-control custom-form-input pe-5 ${errors.confirmPassword ? "is-invalid" : ""}`}
                    id="confirmPassword"
                    placeholder={t("confirm_password")}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <i
                    className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"} position-absolute top-50 end-0 translate-middle-y me-3 mt-3`}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  ></i>
                  {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                </div>

                <button type="submit" className="btn custom-btn-gradient w-100 mb-3">
                  {t("register")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

// /src/pages/SettingsPage.jsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import userService from "../services/userService";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import { useAlert } from "../contexts/AlertContext";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { showAlert } = useAlert();
  const TIME_ALERT_SUCCESS = import.meta.env.VITE_TIME_ALERT_SUCCESS;
  const TIME_ALERT_ERROR = import.meta.env.VITE_TIME_ALERT_ERROR;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [language, setLanguage] = useState(i18n.language || "en"); // 👈 estado local para idioma

  // 🔹 Cargar idioma guardado al montar
  useEffect(() => {
    const savedLanguage = localStorage.getItem("i18nextLng");
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
      setLanguage(savedLanguage);
    } else {
      setLanguage(i18n.language);
    }
  }, [i18n]);

  // 🔹 Cambio de idioma
  const handleLanguageChange = (event) => {
    const newLang = event.target.value;
    i18n.changeLanguage(newLang);
    setLanguage(newLang);
    localStorage.setItem("i18nextLng", newLang);
  };

  // 🔹 Cambio de tema
  const handleThemeChange = (event) => {
    const newTheme = event.target.value;
    setTheme(newTheme);
  };

  // 🔹 Eliminar cuenta
  const handleDeleteAccount = async () => {
    try {
      await userService.deleteMyAccount();
      authService.logout();

      showAlert(t("operation_success"), "success", TIME_ALERT_SUCCESS);

      setTimeout(() => {
        navigate("/login");
        window.location.reload();
      }, 500);
    } catch (err) {
      console.error("Error eliminando cuenta:", err);
      showAlert(t("error_deleting_account"), "danger", TIME_ALERT_ERROR);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow">
            <h2 className="text-center fw-bold mb-4 mt-3 custom-title">
              {t("settings_title")}
            </h2>

            <div className="card-body">
              {/* Idioma */}
              <div className="mb-4">
                <label htmlFor="language-select" className="form-label">
                  <strong>{t("language_label")}</strong>
                </label>
                <select
                  id="language-select"
                  className="form-select"
                  value={language} // 👈 usamos estado local
                  onChange={handleLanguageChange}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>

              {/* Tema */}
              <div className="mb-4">
                <label htmlFor="theme-select" className="form-label">
                  <strong>{t("theme_label")}</strong>
                </label>
                <select
                  id="theme-select"
                  className="form-select"
                  value={theme}
                  onChange={handleThemeChange}
                >
                  <option value="light">{t("light_mode")}</option>
                  <option value="dark">{t("dark_mode")}</option>
                </select>
              </div>

              {/* Eliminar cuenta */}
              <div className="mb-4">
                <label htmlFor="delete-account" className="form-label">
                  <strong>{t("delete_account")}</strong>
                  <p className="mt-2 text-muted small">
                    {t("delete_account_note")}
                  </p>
                </label>
                <div id="delete-account" className="text-center">
                  <button
                    className="btn btn-danger"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <i className="bi bi-trash"></i> {t("delete_account")}
                  </button>
                </div>

                {/* Modal de confirmación */}
                <ConfirmModal
                  show={showDeleteModal}
                  title={t("confirm_delete_title")}
                  message={t("delete_account_warning")}
                  onConfirm={handleDeleteAccount}
                  onCancel={() => setShowDeleteModal(false)}
                  level="danger"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

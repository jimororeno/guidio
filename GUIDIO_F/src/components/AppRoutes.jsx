import { Routes, Route, Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next"; // Necesario para t("page_not_found")
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";


// Importa todas tus páginas
import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import ChangePasswordPage from "../pages/ChangePasswordPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import UserProfilePage from "../pages/UserProfilePage";
import SettingsPage from "../pages/SettingsPage";
import ContactFormPage from "../pages/ContactFormPage";
import About from "../pages/About";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";

// Componente para rutas protegidas
const ProtectedRoute = ({ children, currentUser }) => {
  if (!currentUser) {
    // Si no hay usuario, redirige al login
    return <Navigate to="/login" replace />;
  }
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  currentUser: PropTypes.object, // currentUser ahora es una prop
};

const AppRoutes = () => {
  const { t } = useTranslation();
  const { currentUser } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/contact/" element={ <ContactFormPage />} />
      <Route path="/about/" element={ <About />} />
      <Route path="/privacy/" element={ <PrivacyPolicyPage />} />
      {/* Rutas Protegidas */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute currentUser={currentUser}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/change-password"
        element={
          <ProtectedRoute currentUser={currentUser}>
            <ChangePasswordPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/:userId"
        element={
          <ProtectedRoute currentUser={currentUser}>
            <UserProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/"
        element={
          <ProtectedRoute currentUser={currentUser}>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      
      {/* Ruta 404 */}
      <Route
        path="*"
        element={<h2 className="text-center mt-5">{t("page_not_found")}</h2>}
      />
    </Routes>
  );
};


export default AppRoutes;

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import userService from "../services/userService"; // Servicio para obtener datos del usuario

// URL base para las imágenes, similar a la que usas para eventos
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const UserProfilePage = () => {
  const { userId } = useParams(); // Obtiene el ID del usuario de la URL
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [user, setUser] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setError(t("no_user_id_provided"));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 1. Obtener los datos del usuario
        const userResponse = await userService.getUserProfile(userId);
        setUser(userResponse.data);
        console.log("User data fetched:", userResponse.data);

        setProfilePictureUrl(
          user?.picture
            ? `${BACKEND_URL}/${user.picture}`
            : "/default-profile-user.png"
        );
      } catch (err) {
        console.error("Error fetching user profile:", err);
        if (err.response && err.response.status === 404) {
          setError(t("user_not_found"));
        } else {
          setError(t("error_loading_user_profile"));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, navigate, t]); // El efecto se ejecuta cuando cambia el ID de usuario

  // --- Renderizado Condicional de Estados de Carga/Error ---
  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border custom-text-primary-dark" role="status">
          <span className="visually-hidden">{t("loading")}</span>
        </div>
        <p className="mt-2">{t("loading_user_profile")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button
          className="btn custom-btn-secondary  fw-bold "
          onClick={() => navigate(-1)}
        >
          {t("go_back")}
        </button>
      </div>
    );
  }

  // Si no se encuentra el usuario
  if (!user) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-warning" role="alert">
          {t("user_not_found")}
        </div>
        <button
          className="btn custom-btn-secondary fw-bold"
          onClick={() => navigate(-1)}
        >
          {t("go_back")}
        </button>
      </div>
    );
  }

  // --- JSX de la Página de Perfil ---
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow mb-4">
            <div className="d-flex align-items-center mb-4 mt-3">
              {/* Botón de volver  */}
              <button
                type="button"
                className="btn custom-btn-secondary d-flex align-items-center ms-3"
                onClick={() => navigate(-1)}
              >
                <i className="bi bi-caret-left"></i>
              </button>

              {/* Título centrado */}
              <h2 className="flex-grow-1 text-center fw-bold custom-title m-0">
                {t("user_profile_title")}
              </h2>

              {/* espacio para centrar el título */}
              <div style={{ width: "40px" }}></div>
            </div>

            <div className="card-body text-center custom-">
              {/* Sección de la Foto de Perfil */}
              <div className="profile-photo-container">
                <img
                  src={profilePictureUrl}
                  alt={t("profile_picture")}
                  className="rounded-circle mb-3"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-profile-user.png";
                  }}
                />
              </div>
              <h3 className="mb-1 custom-normal-text fw-bold">
                {user.username}
              </h3>
              {/* Bio del Usuario */}
              <p className="custom-normal-text  fst-italic">
                {user.bio || t("no_bio_available")}
              </p>

              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;

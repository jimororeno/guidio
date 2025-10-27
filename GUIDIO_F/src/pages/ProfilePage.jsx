import { useEffect, useState, useRef, useContext } from "react";
import { useTranslation } from "react-i18next";
import userService from "../services/userService";
import { useAlert } from "../contexts/AlertContext";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ProfilePage = () => {
  const { t } = useTranslation();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success"); // success / danger
  const TIME_ALERT_SUCCESS = import.meta.env.VITE_TIME_ALERT_SUCCESS;

  const { currentUser } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState(null);

  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // --- Cargar perfil ---
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await userService.getUserProfile(currentUser.id);
        const data = response.data;

        setUsername(data.username || "");
        setEmail(data.email || "");
        setBio(data.bio || "");
        setProfilePictureUrl(
          data.picture
            ? `${BACKEND_URL}/${data.picture}`
            : "/default-profile-user.png"
        );
      } catch (err) {
        console.error(err);
        setMessage(t("error_loading_profile"));
        setMessageType("danger");
      } finally {
        setLoading(false);
      }
    };

    if (!currentUser) {
      navigate("/login");
      return;
    }

    fetchProfile();
  }, [t]);

  // --- Limpiar URL temporal al cambiar imagen ---
  useEffect(() => {
    return () => {
      if (profilePictureUrl && profilePictureUrl.startsWith("blob:")) {
        URL.revokeObjectURL(profilePictureUrl);
      }
    };
  }, [profilePictureUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (profilePictureUrl.startsWith("blob:"))
        URL.revokeObjectURL(profilePictureUrl);
      setProfilePictureFile(file);
      setProfilePictureUrl(URL.createObjectURL(file));
    }
  };

  // --- Validación de formulario ---
  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = t("username_required");
    } else if (username.trim().length < 3) {
      newErrors.username = t("username_min_length", { min: 3 });
    } else if (username.trim().length > 255) {
      newErrors.username = t("username_max_length", { max: 255 });
    }

    if (!email.trim()) {
      newErrors.email = t("email_required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t("email_invalid");
    }

    if (bio.trim().length > 500) {
      newErrors.bio = t("bio_max_length", { max: 500 });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!validateForm()) {
      setMessage(t("please_correct_errors"));
      setMessageType("danger");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("bio", bio);
      if (profilePictureFile) formData.append("picture", profilePictureFile);

      const response = await userService.updateProfile(
        currentUser.id,
        formData
      );

      setUsername(response.username || "");
      setEmail(response.email || "");
      setBio(response.bio || "");
      setProfilePictureUrl(
        response.picture
          ? `${BACKEND_URL}/${response.picture}`
          : "/default-profile-user.png"
      );
      setProfilePictureFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      //TODO: actualizar el usuario en el contexto AuthContext también
      //authService.updateCurrentUser(updatedData);
      showAlert(
        t("profile_updated_successfully"),
        "success",
        TIME_ALERT_SUCCESS
      );
      setErrors({});
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        t("error_updating_profile");
      setMessage(errorMessage);
      setMessageType("danger");
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div
          className="spinner-border custom-text-primary-dark"
          role="status"
        ></div>
        <p>{t("loading_profile")}</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-md-center">
        <div className="col-md-10">
          <div className="card shadow mb-4">
            <h2 className="text-center fw-bold mb-4 mt-3 custom-title">
              {t("profile")}
            </h2>

            <div className="card-body">
              {message && (
                <div className={`alert alert-${messageType}`} role="alert">
                  {message}
                </div>
              )}
              <form onSubmit={handleUpdateProfile}>
                {/* Imagen */}
                <div className="mb-4 text-center">
                  <img
                    src={profilePictureUrl}
                    alt={t("profile_picture")}
                    className="rounded-circle mb-3"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                      border: "0",
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-profile-user.png";
                    }}
                  />
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                  <small className="form-text text-muted">
                    {t("upload_profile_picture_tip")}
                  </small>
                </div>

                {/* Username */}
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    {t("username")}
                  </label>
                  <input
                    type="text"
                    id="username"
                    className={`form-control custom-form-input ${
                      errors.username ? "is-invalid" : ""
                    }`}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  {errors.username && (
                    <div className="invalid-feedback">{errors.username}</div>
                  )}
                </div>

                {/* Email */}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                {/* Bio */}
                <div className="mb-3">
                  <label htmlFor="bio" className="form-label">
                    {t("bio")}
                  </label>
                  <textarea
                    id="bio"
                    className={`form-control custom-form-input ${
                      errors.bio ? "is-invalid" : ""
                    }`}
                    rows="3"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder={t("write_your_bio")}
                  ></textarea>
                  {errors.bio && (
                    <div className="invalid-feedback">{errors.bio}</div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn custom-btn-gradient w-100 mb-3"
                >
                  {t("update_profile")}
                </button>
              </form>

              <div className="text-center">
                <Link
                  to="/profile/change-password"
                  className="btn custom-btn-secondary w-100 fw-bold  custom-button-lg"
                >
                  {t("change_password")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

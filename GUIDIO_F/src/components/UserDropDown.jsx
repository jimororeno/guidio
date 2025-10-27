import { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../contexts/AuthContext";
import PropTypes from "prop-types";


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const UserDropdown = ({ handleCloseMenu }) => {
  const { t } = useTranslation();
  const { logout, currentUser } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const handleClick = () => {
    setIsDropdownOpen(false);
    handleCloseMenu();
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const getInitials = (username) => {
    if (!username) return "UU";
    const parts = username.split(" ");
    return parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : username.substring(0, 2).toUpperCase();
  };

  if (!currentUser) {
    return (
      <li className="nav-item">
        <Link className="nav-link" to="/login">
          {t("login")}
        </Link>
      </li>
    );
  }

  const profileImageSrc = currentUser.picture
    ? `${BACKEND_URL}/${currentUser.picture}`
    : null;

  return (
    <li className="nav-item dropdown" ref={dropdownRef}>
      <button
        className="nav-link d-flex align-items-center p-0 ms-2"
        onClick={toggleDropdown}
        aria-expanded={isDropdownOpen}
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        {profileImageSrc ? (
          <img
            src={profileImageSrc}
            alt={currentUser.username || t("profile_picture")}
            className="rounded-circle user-avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "./default-profile-user.png";
            }}
          />
        ) : (
          <div className="user-initials rounded-circle d-flex justify-content-center align-items-center">
            {getInitials(currentUser.username)}
          </div>
        )}
        <span className={`arrow ${isDropdownOpen ? "open" : ""}`}>▼</span>
      </button>

      <ul className={`dropdown-menu dropdown-animated ${isDropdownOpen ? "show" : ""}`}>
        <li>
          <Link className="dropdown-item" to="/profile" onClick={handleClick}>
            <i className="bi bi-person me-2"></i> {t("my_profile")}
          </Link>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <Link className="dropdown-item" to="/settings" onClick={handleClick}>
            <i className="bi bi-gear me-2"></i> {t("settings")}
          </Link>
        </li>
        <li>
          <button className="dropdown-item" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i> {t("logout")}
          </button>
        </li>
      </ul>
    </li>
  );
};

UserDropdown.propTypes = {
  handleCloseMenu: PropTypes.func.isRequired,
};

export default UserDropdown;

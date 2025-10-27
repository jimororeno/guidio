import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UserDropdown from "./UserDropDown";
import logo from "../assets/logo/logo.png";
import { IoIosLogIn } from "react-icons/io";
import { AuthContext } from "../contexts/AuthContext";

const NavBar = () => {
  const { t } = useTranslation();
  const { currentUser } = useContext(AuthContext);

  // Estado para controlar el menú colapsable
  const [isOpen, setIsOpen] = useState(false);

  // Función para cerrar el menú
  const handleCloseMenu = () => setIsOpen(false);

  // Función para alternar el menú
  const handleToggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary navbar-custom">
      <div className="container-fluid">
        <Link
          className="navbar-brand d-flex align-items-center"
          to="/"
          style={{ gap: "8px" }}
          onClick={handleCloseMenu}
        >
          <img
            src={logo}
            alt="Logo"
            className="d-inline-block align-top"
            style={{ height: "100px", width: "auto" }}
          />
        </Link>

        {/* Botón hamburguesa */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={handleToggleMenu}
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapse controlado por estado */}
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">

            {/* login */}
            {!currentUser && (
              <li className="nav-item mx-lg-2">
                <Link className="nav-link btn custom-btn-primary" to="/login" onClick={handleCloseMenu}>
                  <IoIosLogIn size="20" />
                  <span className="ms-2">{t("login")}</span>
                </Link>
              </li>
            )}

            {/* user dropdown */}
            {currentUser && (
              <li className="nav-item" >
                <UserDropdown  handleCloseMenu={handleCloseMenu}/>
              </li>
            )}

            
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

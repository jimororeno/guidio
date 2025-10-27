import { Link } from "react-router-dom";
import logo from "../assets/logo/logo.png"; 
import { useTranslation } from "react-i18next";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="form-label pt-4 pb-3 mt-5 ">
      <div className="container">
        <div className="row align-items-center">
          {/* Logo y nombre */}
          <div className="col-md-4 text-center text-md-start mb-3 mb-md-0">
            <Link
              to="/"
              className="text-decoration-none  d-flex align-items-center justify-content-center justify-content-md-start"
            >
              <img
                src={logo}
                alt="custom Logo"
                className="me-2"
                style={{ height: "40px" }}
              />
              <span className="fw-bold custom-normal-text">{import.meta.env.VITE_APP_NAME}</span>
            </Link>
          </div>

          {/* Enlaces rápidos */}
          <div className="col-md-4 text-center mb-3 mb-md-0">
            <Link to="/about" className="custom-normal-text text-decoration-none me-3">
              {t("about_us")}
            </Link>
            <Link
              to="/contact"
              className="custom-normal-text text-decoration-none me-3"
            >
              {t("contact_us")}
            </Link>
            <Link to="/privacy" className="custom-normal-text text-decoration-none">
              {t("privacy_policy")}
            </Link>
          </div>

          {/* Copyright */}
          <div className="col-md-4 text-center text-md-end">
            <small>
              © {currentYear} {import.meta.env.VITE_APP_NAME} - {t("all_rights_reserved")}
            </small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

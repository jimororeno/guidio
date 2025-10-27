import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRunning } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const HomePage = () => {
  const { t } = useTranslation();
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="container mt-5">
      {/* 🌟 HERO SECTION con animación y fondo responsive */}
      <motion.div
        className="hero-section text-center text-white mb-5 shadow-sm d-flex flex-column justify-content-center align-items-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://images.pexels.com/photos/2526878/pexels-photo-2526878.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940')`,
          backgroundSize: "cover",
          backgroundPosition: "center 35%",
          borderRadius: "1rem",
          minHeight: "clamp(300px, 50vh, 450px)",
          padding: "clamp(2rem, 5vw, 4rem) 1rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <h1
          className="fw-bold mb-3"
          style={{
            textShadow: "2px 2px 6px rgba(0,0,0,0.7)",
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
          }}
        >
          {t("welcome_message")}
        </h1>

        <p
          className="lead mb-3"
          style={{
            maxWidth: "650px",
            textShadow: "1px 1px 4px rgba(0,0,0,0.6)",
            lineHeight: "1.6",
            fontSize: "clamp(1rem, 2vw, 1.25rem)",
            padding: "0 1rem",
          }}
        >
          {t("slogan")}
        </p>

        {!currentUser && (
          <p
            className="mt-2"
            style={{
              textShadow: "1px 1px 4px rgba(0,0,0,0.6)",
              fontWeight: "500",
              fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
              padding: "0 1rem",
            }}
          >
            {t("no_account_register")}
          </p>
        )}

        <div
          className="mt-4 d-flex flex-wrap justify-content-center gap-3"
          style={{ rowGap: "1rem" }}
        >
          <Link to="/bibs" className="btn custom-btn-primary btn-lg fw-bold">
            {t("explore_bibs")}
          </Link>
          {!currentUser && (
            <Link to="/login" className="btn custom-btn-secondary btn-lg fw-bold">
              {t("login")}
            </Link>
          )}
        </div>
      </motion.div>

       {/* 🏃 FEATURES SECTION */}
      <div className="row text-center mt-5">
        <div className="col-md-4 mb-4">
          <i className="bi bi-calendar-event display-5 custom-text-primary-dark"></i>
          <h5 className="mt-3">{t("discover_events")}</h5>
          <p className="text-muted">{t("discover_events_desc")}</p>
        </div>
        <div className="col-md-4 mb-4">
          <FaRunning className="display-5 custom-text-primary-dark" />
          <h5 className="mt-3">{t("track_bibs")}</h5>
          <p className="text-muted">{t("track_bibs_desc")}</p>
        </div>
        <div className="col-md-4 mb-4">
          <i className="bi bi-trophy display-5 custom-text-primary-dark"></i>
          <h5 className="mt-3">{t("join_community")}</h5>
          <p className="text-muted">{t("join_community_desc")}</p>
        </div>
      </div>
      
    </div>
  );
};

export default HomePage;

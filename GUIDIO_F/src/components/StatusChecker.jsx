import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import authService from "../services/authService";
import image from "../assets/backend-down.png";

const StatusChecker = ({ children }) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState("loading"); // "loading" | "ok" | "down"
  const TIME_STATUS_CHECK = import.meta.env.VITE_TIME_STATUS_CHECK;

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const result = await authService.checkBackend();
        setStatus(result.ok ? "ok" : "down");
      } catch (error) {
        setStatus("down");
      }
    };

    // Chequeo inicial
    checkBackendStatus();

    // Chequeo cada 60 segundos
    const intervalId = setInterval(checkBackendStatus, TIME_STATUS_CHECK);
    return () => clearInterval(intervalId);
  }, []);

  if (status === "loading") {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border custom-text-primary-dark" role="status">
          <span className="visually-hidden">{t("loading")}</span>
        </div>
      </div>
    );
  }

  if (status === "down") {
    return (
      <div className="container text-center mt-5">
        <img
          src={image}
          alt={t("backend_down_alt")}
          style={{ width: "150px", marginBottom: "20px" }}
        />
        <div className="">
          <span className="custom-backend-down">
            {t("backend_down_message")}
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

StatusChecker.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StatusChecker;

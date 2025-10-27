import { useTranslation } from "react-i18next";

const PrivacyPolicyPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card shadow p-4">
            <h2 className="text-center fw-bold mb-4 custom-title">
              {t("privacy_title")}
            </h2>

            <div className="custom-text">
              <p>{t("privacy_intro")}</p>

              <h5 className="fw-bold mt-4">{t("privacy_data_title")}</h5>
              <p>{t("privacy_data_text")}</p>

              <h5 className="fw-bold mt-4">{t("privacy_use_title")}</h5>
              <p>{t("privacy_use_text")}</p>

              <h5 className="fw-bold mt-4">{t("privacy_share_title")}</h5>
              <p>{t("privacy_share_text")}</p>

              <h5 className="fw-bold mt-4">{t("privacy_security_title")}</h5>
              <p>{t("privacy_security_text")}</p>

              <h5 className="fw-bold mt-4">{t("privacy_rights_title")}</h5>
              <p>{t("privacy_rights_text")}</p>

              <h5 className="fw-bold mt-4">{t("privacy_cookies_title")}</h5>
              <p>{t("privacy_cookies_text")}</p>

              <h5 className="fw-bold mt-4">{t("privacy_changes_title")}</h5>
              <p>{t("privacy_changes_text")}</p>

              <h5 className="fw-bold mt-4">{t("privacy_contact_title")}</h5>
              <p>{t("privacy_contact_text")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;

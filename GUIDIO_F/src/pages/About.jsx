import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow p-4 custom-card">
            <h2 className="text-center fw-bold mb-4 custom-title">
              {t("who_we_are_title")}
            </h2>

            <p className="lead text-center mb-4">
              {t("who_we_are_intro")}
            </p>

            <div className="custom-body-text">
              <p>{t("who_we_are_paragraph_1")}</p>
              <p>{t("who_we_are_paragraph_2")}</p>
              <p>{t("who_we_are_paragraph_3")}</p>
              <p>{t("who_we_are_paragraph_4")}</p>
              <p className="fw-semibold text-center mt-4">
                {t("who_we_are_conclusion")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

import { useState } from "react";
import { useTranslation } from "react-i18next";
import contactService from "../services/contactService";
import { useAlert } from "../contexts/AlertContext";

const ContactFormPage = () => {
  const { t } = useTranslation();
  const { showAlert } = useAlert();

  const TIME_ALERT_SUCCESS = import.meta.env.VITE_TIME_ALERT_SUCCESS;
  const TIME_ALERT_ERROR = import.meta.env.VITE_TIME_ALERT_ERROR;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const MAX_MESSAGE_LENGTH = 1000;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    setErrors({ ...errors, [id]: null }); // limpiar error al escribir
  };

  const validateForm = () => {
    const newErrors = {};
    let valid = true;

    if (!formData.name.trim()) {
      newErrors.name = t("name_required");
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = t("email_required");
      valid = false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = t("email_invalid");
      valid = false;
    }

    if (!formData.subject.trim()) {
      newErrors.subject = t("subject_required");
      valid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = t("message_required");
      valid = false;
    } else if (formData.message.length > MAX_MESSAGE_LENGTH) {
      newErrors.message = t("message_max_length", { max: MAX_MESSAGE_LENGTH });
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await contactService.sendContact(formData);
      showAlert(t("contact_sent_success"), "success", TIME_ALERT_SUCCESS);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      showAlert(t("contact_sent_error"), "danger", TIME_ALERT_ERROR);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow p-4">
            <h2 className="text-center fw-bold mb-4 custom-title">
              {t("contact_us")}
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Nombre */}
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  {t("name")}
                </label>
                <input
                  type="text"
                  id="name"
                  className={`form-control custom-form-input ${
                    errors.name ? "is-invalid" : ""
                  }`}
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
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
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              {/* Asunto */}
              <div className="mb-3">
                <label htmlFor="subject" className="form-label">
                  {t("subject")}
                </label>
                <input
                  type="text"
                  id="subject"
                  className={`form-control custom-form-input ${
                    errors.subject ? "is-invalid" : ""
                  }`}
                  value={formData.subject}
                  onChange={handleChange}
                />
                {errors.subject && (
                  <div className="invalid-feedback">{errors.subject}</div>
                )}
              </div>

              {/* Mensaje */}
              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  {t("message")}
                </label>
                <textarea
                  id="message"
                  className={`form-control custom-form-input ${
                    errors.message ? "is-invalid" : ""
                  }`}
                  rows="5"
                  maxLength={MAX_MESSAGE_LENGTH}
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
                <div className="d-flex justify-content-between mt-1">
                  {errors.message && (
                    <div className="text-danger small">{errors.message}</div>
                  )}
                  <div className="text-muted small">
                    {formData.message.length}/{MAX_MESSAGE_LENGTH}
                  </div>
                </div>
              </div>

              {/* Botón enviar */}
              <button
                type="submit"
                className="btn custom-btn-gradient w-100"
                disabled={loading}
              >
                {loading ? (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                ) : (
                  t("send_message")
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactFormPage;

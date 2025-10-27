import api from "./api"; // Importa la instancia de Axios configurada


const SECCION_URL = '/contact';

const sendContact  = async (formData) => {
  try {
    // formData: { name, email, subject, message }
  const response = await api.post(`${SECCION_URL}`, formData);
  return response.data;
  } catch (error) {
    throw error.response.data.message || error.message;
  }
};

const contactService = {
  sendContact,
};

export default contactService;

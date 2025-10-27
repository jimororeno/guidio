import api from "./api"; // Importa la instancia de Axios configurada

const SECCION_URL = "/users";

const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`${SECCION_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error getUserProfile in service:  ${userId}:`, error);
    throw error;
  }
};

const deleteMyAccount = async () => {
  try {
    const res = await api.delete(`${SECCION_URL}/me`);
    return res.data;
  } catch (error) {
    console.error(`Error deleting user`, error);
    throw error;
  }
};

const updateProfile = async (userId, formData) => {
  try {
    const response = await api.put(`${SECCION_URL}/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Profile updated successfully:", response.data);
    return response.data.data; // devuelve toda la respuesta con data
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error.response?.data || error;
  }
};

const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put(`${SECCION_URL}/change-password/`, {
      currentPassword,
      newPassword,
    });
    console.log("Profile updated successfully:", response.data);
    return response.data; // devuelve toda la respuesta con data
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error.response?.data || error;
  }
};

const resetPassword = async (token, newPassword) => {
  console.log("Resetting password with token:", token);
  try {
    const response = await api.post(`${SECCION_URL}/reset-password/`, {
      token,
      newPassword,
    });
    return response.data; 
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error.response?.data || error;
  }
};

const userService = {
  getUserProfile,
  deleteMyAccount,
  updateProfile,
  changePassword,
  resetPassword
};

export default userService;

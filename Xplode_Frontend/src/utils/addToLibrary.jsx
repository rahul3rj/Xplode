import axios from "./axios";

export const addToLibrary = async (gameData) => {
  try {
    const response = await axios.post("/library/add", gameData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getUserLibrary = async () => {
  try {
    const response = await axios.get("/library");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Redirect to login if not authenticated
export const requireAuth = () => {
  if (!isAuthenticated()) {
    window.location.href = '/login';
    return false;
  }
  return true;
};
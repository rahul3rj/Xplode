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

export const removeFromLibrary = async (steamAppId) => {
  try {
    const response = await axios.post(`/library/remove/${steamAppId}`);
    return response.data; // axios automatically parses JSON
  } catch (error) {
    console.error('Remove from library error:', error);
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

export const addToFavorite = async (gameData) => {
  try {
    const response = await axios.post("/favorite/add", gameData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getUserFavorite = async () => {
  try {
    const response = await axios.get("/favorite");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const removeFromFavorite = async (steamAppId) => {
  try {
    const response = await axios.post(`/favorite/remove/${steamAppId}`);
    return response.data; // axios automatically parses JSON
  } catch (error) {
    console.error('Remove from Favorite error:', error);
    throw error.response?.data || error.message;
  }
};
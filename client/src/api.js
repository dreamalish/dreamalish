import api from "../api"; // adjust path if needed

api.get("/api/dreams");


const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || ""
});

export default api;

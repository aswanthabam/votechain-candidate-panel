import axios from "axios";

export const api_url = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const publicRouter = axios.create({
  baseURL: api_url,
});

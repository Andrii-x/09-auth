import axios from "axios";

const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_URL ?? "https://notehub-public.goit.study"
).replace(/\/+$/, "");

const api = axios.create({
  baseURL: `${apiBaseUrl}/api`,
  withCredentials: true,
});

export default api;

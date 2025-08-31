import axios, { type AxiosInstance } from "axios";

import { COINGECKO_BASE_URL, COINGECKO_API_KEY } from "./config";

const api: AxiosInstance = axios.create({
  baseURL: COINGECKO_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(COINGECKO_API_KEY ? { "x-cg-demo-api-key": COINGECKO_API_KEY } : {}),
  },
});

export default api;

import { apiBaseUrl } from "./base";

const getToken = () => localStorage.getItem("token");

const jsonFetch = async (path, { method = "GET", body, auth = true } = {}) => {
  if (!apiBaseUrl) {
    const error = new Error("Missing REACT_APP_API_URL");
    error.status = 0;
    throw error;
  }
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${apiBaseUrl}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.message || "Request failed";
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
};

export const addToCartApi = ({ productId, quantity }) =>
  jsonFetch("/cart", {
    method: "POST",
    body: { productId, id: productId, quantity },
    auth: true,
  });

export const getCartApi = () => jsonFetch("/cart", { method: "GET", auth: true });

export const removeFromCartApi = (productId) =>
  jsonFetch(`/cart/${encodeURIComponent(productId)}`, { method: "DELETE", auth: true });

export const clearCartApi = () => jsonFetch("/cart", { method: "DELETE", auth: true });

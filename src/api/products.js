import { apiBaseUrl } from "./base";

export const getProductsApi = async () => {
  if (!apiBaseUrl) {
    const error = new Error("Missing REACT_APP_API_URL");
    error.status = 0;
    throw error;
  }
  const response = await fetch(`${apiBaseUrl}/products`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.message || "Failed to load products";
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return Array.isArray(data) ? data : data.products || [];
};

export const deleteProductImageApi = async (productId, token) => {
  if (!apiBaseUrl) {
    const error = new Error("Missing REACT_APP_API_URL");
    error.status = 0;
    throw error;
  }
  if (!productId) {
    const error = new Error("Product ID is required");
    error.status = 0;
    throw error;
  }

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await fetch(`${apiBaseUrl}/deleteimage/${productId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
    },
  });
  
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.message || "Failed to delete product image";
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  
  return data;
};

export const apiBaseUrl = String(process.env.REACT_APP_API_URL || "")
  .trim()
  .replace(/^"|"$/g, "")
  .replace(/\/$/, "");


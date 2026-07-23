// Story Forge.AI backend configuration.
// Change this only if your Render backend URL changes.
const API_BASE_URL = "https://story-forge-ai-backend.onrender.com";

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  let data = {};
  try { data = await response.json(); } catch (_) {}

  if (!response.ok) {
    throw new Error(data.detail || data.error || `Server error: ${response.status}`);
  }
  return data;
}

const API = {
  signup: (username, email, password) =>
    apiRequest("/signup", { method: "POST", body: JSON.stringify({ username, email, password }) }),

  login: (username, password) =>
    apiRequest("/login", { method: "POST", body: JSON.stringify({ username, password }) }),

  forgotPassword: (email) =>
    apiRequest("/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),

  verifyEmail: (email) =>
    apiRequest("/verify-email", { method: "POST", body: JSON.stringify({ email }) })
};

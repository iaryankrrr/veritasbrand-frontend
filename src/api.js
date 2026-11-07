// All backend calls live here. Change BASE_URL if the server moves.
export const BASE_URL = "https://veritasbrand-backend.onrender.com";

async function request(path, options = {}) {
  const res = await fetch(BASE_URL + path, options);
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || (typeof data === "string" && data) || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export const registerUser = (username, password, role) =>
  request("/api/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, role }),
  });

// NOTE: the multipart field name is assumed to be "file". Ask backend if it differs.
export const uploadDocument = (userId, file) => {
  const form = new FormData();
  form.append("file", file);
  return request(`/api/documents/upload/${userId}`, { method: "POST", body: form });
};

// NOTE: body shape assumed to be { status: "APPROVED" | "REJECTED" }. Confirm with backend.
export const updateStatus = (id, status) =>
  request(`/api/documents/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

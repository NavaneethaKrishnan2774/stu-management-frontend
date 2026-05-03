const BASE_URL = "http://127.0.0.1:8000/";

const normalizeToken = (token) => {
  if (!token || token === "null" || token === "undefined") {
    return null;
  }

  const trimmed = token.toString().trim();
  if (/^Bearer\s+/i.test(trimmed)) {
    return trimmed.replace(/^Bearer\s+/i, "");
  }

  return trimmed;
};

const API = {
  post: async (endpoint, body, token) => {
    const headers = {};
    let payload = body;
    const normalizedToken = normalizeToken(token);

    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
      payload = JSON.stringify(body);
    }
    if (normalizedToken) {
      headers.Authorization = `Bearer ${normalizedToken}`;
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: payload,
    });

    const text = await res.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch (parseError) {
      data = { error: text || res.statusText };
    }

    if (!res.ok) {
      const message = data.detail || data.non_field_errors?.[0] || data.error || res.statusText || "Request failed";
      const error = new Error(message);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  },

  put: async (endpoint, body, token) => {
    const headers = {};
    let payload = body;
    const normalizedToken = normalizeToken(token);

    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
      payload = JSON.stringify(body);
    }
    if (normalizedToken) {
      headers.Authorization = `Bearer ${normalizedToken}`;
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers,
      body: payload,
    });

    const text = await res.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch (parseError) {
      data = { error: text || res.statusText };
    }

    if (!res.ok) {
      const message = data.detail || data.non_field_errors?.[0] || data.error || res.statusText || "Request failed";
      const error = new Error(message);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  },

  delete: async (endpoint, token) => {
    const headers = {};
    const normalizedToken = normalizeToken(token);
    if (normalizedToken) {
      headers.Authorization = `Bearer ${normalizedToken}`;
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers,
    });

    const text = await res.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch (parseError) {
      data = { error: text || res.statusText };
    }

    if (!res.ok) {
      const message = data.detail || data.non_field_errors?.[0] || data.error || res.statusText || "Request failed";
      const error = new Error(message);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  },

  get: async (endpoint, params, token) => {
    const headers = {};
    const normalizedToken = normalizeToken(token);
    if (normalizedToken) {
      headers.Authorization = `Bearer ${normalizedToken}`;
    }

    // Build query string from params if provided
    let url = `${BASE_URL}${endpoint}`;
    if (params && typeof params === 'object') {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          queryParams.append(key, params[key]);
        }
      });
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
    }

    const res = await fetch(url, {
      headers,
    });

    const text = await res.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch (parseError) {
      data = { error: text || res.statusText };
    }

    if (!res.ok) {
      const message = data.detail || data.non_field_errors?.[0] || data.error || res.statusText || "Request failed";
      const error = new Error(message);
      error.status = res.status;
      error.data = data;
      throw error;
    }
    return data;
  },
};

export { normalizeToken };
export default API;
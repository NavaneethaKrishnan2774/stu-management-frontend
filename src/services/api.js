const BASE_URL = "http://127.0.0.1:8000/";

const API = {
  post: async (endpoint, body) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      const message = data.detail || data.non_field_errors?.[0] || data.error || "Request failed";
      const error = new Error(message);
      error.data = data;
      throw error;
    }

    return data;
  },

  get: async (endpoint, token) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      const message = data.detail || data.non_field_errors?.[0] || data.error || "Request failed";
      const error = new Error(message);
      error.data = data;
      throw error;
    }
    return data;
  },
};

export default API;


// src/components/Login/auth.api.js
const API_BASE = import.meta.env.VITE_API_URL;

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";
const ROLE_KEY = "role";

const buildUrl = (path) => {
  const base = (API_BASE || "").replace(/\/+$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
};

const jsonHeaders = {
  "Content-Type": "application/json",
};

const parseResponse = async (res) => {
  let data = null;
  try {
    data = await res.json();
  } catch (error) {
    data = null;
  }

  if (!res.ok) {
    const message = data?.detail || data?.error || data?.message || "Request failed";
    throw new Error(message);
  }

  return data;
};

export const setAuthTokens = (data) => {
  console.log("🔐 Setting auth tokens:", Object.keys(data));
  const access = data.access || data.accessToken || data.token;
  const refresh = data.refresh || data.refreshToken;
  const user = data.user;
  const role = data.role;

  if (access) {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    console.log("✅ Access token saved");
  } else {
    console.error("❌ No access token found in response:", data);
    throw new Error("Authentication failed: No access token received from server.");
  }

  if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  if (role) localStorage.setItem(ROLE_KEY, role);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuthTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ROLE_KEY);
};

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
export const getCurrentUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const login = async ({ email, password }) => {
  const res = await fetch(buildUrl("/api/accounts/login/"), {  // <-- add /api
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ email, password }),
  });
  const data = await parseResponse(res);
  setAuthTokens(data);
  return data;
};

export const googleLogin = async ({ token }) => {
  const res = await fetch(buildUrl("/api/accounts/google-login/"), {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ token }),
  });
  const data = await parseResponse(res);
  setAuthTokens(data);
  return data;
};

export const register = async ({ username, email, phone_number, password, confirm_password }) => {
  const res = await fetch(buildUrl("/accounts/register/"), {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ username, email, phone_number, password, confirm_password }),
  });
  return parseResponse(res);
};

export const verifyOtp = async ({ email, otp }) => {
  const res = await fetch(buildUrl("/accounts/verify-otp/"), {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ email, otp }),
  });
  const data = await parseResponse(res);
  setAuthTokens(data);
  return data;
};

export const resendOtp = async ({ email }) => {
  const res = await fetch(buildUrl("/accounts/register/resend-otp/"), {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ email }),
  });
  return parseResponse(res);
};

export const forgotPassword = async ({ email }) => {
  const res = await fetch(buildUrl("/api/accounts/password/forgot/"), {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ email }),
  });
  return parseResponse(res);
};
export const resetPassword = async ({ email, otp, new_password }) => {
  const res = await fetch(buildUrl("/api/accounts/password/reset/"), {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ email, otp, new_password }),
  });
  const data = await parseResponse(res);
  setAuthTokens(data);
  return data;
};



export const logout = async () => {
  const refresh = getRefreshToken();
  if (refresh) {
    try {
      await fetch(buildUrl("/accounts/logout/"), {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify({ refresh }),
      });
    } catch (error) {
      // ignore network/logout errors
    }
  }
  clearAuthTokens();
};

// // src/api/auth.api.js
// const API_BASE = import.meta.env.VITE_API_URL;

// /**
//  * Get access token from localStorage
//  */
// export function getAccessToken() {
//   return localStorage.getItem("accessToken");
// }

// /**
//  * Clear authentication tokens
//  */
// export const clearAuthTokens = () => {
//   localStorage.removeItem('accessToken');
//   localStorage.removeItem('refreshToken');
//   localStorage.removeItem('role');
//   localStorage.removeItem('user');
// };
// const buildUrl = (path) => {
//   const base = (API_BASE || "").replace(/\/+$/, "");
//   const suffix = path.startsWith("/") ? path : `/${path}`;
//   return `${base}${suffix}`;
// };
// /**
//  * Get refresh token from localStorage
//  */
// export function getRefreshToken() {
//   return localStorage.getItem("refreshToken");
// }

// /**
//  * Check if user is authenticated
//  */
// export function isAuthenticated() {
//   return Boolean(getAccessToken());
// }

// /**
//  * Get current user data
//  */
// export function getCurrentUser() {
//   try {
//     const user = localStorage.getItem("user");
//     return user ? JSON.parse(user) : null;
//   } catch (error) {
//     console.error("Failed to parse user data:", error);
//     return null;
//   }
// }

// /**
//  * Login with email and password
//  */
// export const login = async ({ email, password }) => {
//   const res = await fetch(buildUrl("/accounts/login/"), {
//     method: "POST",
//     headers: jsonHeaders,
//     body: JSON.stringify({ email, password }),
//   });
//   const data = await parseResponse(res);
//   setAuthTokens(data);
//   return data;
// };
// /**
//  * Google OAuth Login
//  */
// // auth.api.js
// export const googleLogin = async ({ token }) => {
//   const res = await fetch(buildUrl("api/accounts/google-login/"), {
//     method: "POST",
//     headers: jsonHeaders,
//     body: JSON.stringify({ token }),
//   });
//   const data = await parseResponse(res);
  
//   // ✅ CRITICAL: This stores all tokens + user data
//   setAuthTokens(data);
  
//   return data;
// };


// /**
//  * Register new user
//  */
// export async function register(formData) {
//   const response = await fetch(`${API_URL}/api/accounts/register/`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(formData),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.detail || data.message || "Registration failed");
//   }

//   return data;
// }

// /**
//  * Verify OTP
//  */
// export async function verifyOtp({ email, otp }) {
//   const response = await fetch(`${API_URL}/api/accounts/verify-otp/`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, otp }),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.detail || data.message || "Invalid OTP");
//   }

//   return data;
// }

// /**
//  * Resend OTP
//  */
// export async function resendOtp({ email }) {
//   const response = await fetch(`${API_URL}/api/accounts/resend-otp/`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email }),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.detail || data.message || "Failed to resend OTP");
//   }

//   return data;
// }

// /**
//  * Request password reset code
//  */
// export async function forgotPassword({ email }) {
//   const response = await fetch(`${API_URL}/api/accounts/forgot-password/`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email }),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.detail || data.message || "Failed to send reset code");
//   }

//   return data;
// }

// /**
//  * Reset password with OTP
//  */
// export async function resetPassword({ email, otp, new_password }) {
//   const response = await fetch(`${API_URL}/api/accounts/reset-password/`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, otp, new_password }),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.detail || data.message || "Failed to reset password");
//   }

//   return data;
// }

// /**
//  * Logout user
//  */
// export async function logout() {
//   const refreshToken = getRefreshToken();

//   try {
//     if (refreshToken) {
//       await fetch(`${API_URL}/api/accounts/logout/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${getAccessToken()}`,
//         },
//         body: JSON.stringify({ refresh: refreshToken }),
//       });
//     }
//   } catch (error) {
//     console.error("Logout API call failed:", error);
//   } finally {
//     // Always clear local storage
//     clearAuthTokens();
//   }
// }

// /**
//  * Refresh access token
//  */
// export async function refreshAccessToken() {
//   const refreshToken = getRefreshToken();

//   if (!refreshToken) {
//     throw new Error("No refresh token available");
//   }

//   try {
//     const response = await fetch(`${API_URL}/api/accounts/token/refresh/`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ refresh: refreshToken }),
//     });

//     if (!response.ok) {
//       throw new Error("Token refresh failed");
//     }

//     const data = await response.json();
//     localStorage.setItem("accessToken", data.access);
    
//     return data.access;
//   } catch (error) {
//     await logout();
//     throw error;
//   }
// }

// const API_BASE = import.meta.env.VITE_API_URL;

// const ACCESS_TOKEN_KEY = "accessToken";
// const REFRESH_TOKEN_KEY = "refreshToken";
// const USER_KEY = "user";
// const ROLE_KEY = "role";

// const buildUrl = (path) => {
//   const base = (API_BASE || "").replace(/\/+$/, "");
//   const suffix = path.startsWith("/") ? path : `/${path}`;
//   return `${base}${suffix}`;
// };

// const jsonHeaders = {
//   "Content-Type": "application/json",
// };

// const parseResponse = async (res) => {
//   let data = null;
//   try {
//     data = await res.json();
//   } catch (error) {
//     data = null;
//   }

//   if (!res.ok) {
//     const message = data?.detail || data?.error || data?.message || "Request failed";
//     throw new Error(message);
//   }

//   return data;
// };

// export const setAuthTokens = ({ access, refresh, user, role }) => {
//   if (access) localStorage.setItem(ACCESS_TOKEN_KEY, access);
//   if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
//   if (role) localStorage.setItem(ROLE_KEY, role);
//   if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
// };

// export const clearAuthTokens = () => {
//   localStorage.removeItem(ACCESS_TOKEN_KEY);
//   localStorage.removeItem(REFRESH_TOKEN_KEY);
//   localStorage.removeItem(USER_KEY);
//   localStorage.removeItem(ROLE_KEY);
// };

// export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
// export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

// export const login = async ({ email, password }) => {
//   const res = await fetch(buildUrl("/api/accounts/login/"), {
//     method: "POST",
//     headers: jsonHeaders,
//     body: JSON.stringify({ email, password }),
//   });
//   const data = await parseResponse(res);
//   setAuthTokens(data);
//   return data;
// };

// export const googleLogin = async ({ token }) => {
//   const res = await fetch(buildUrl("/api/accounts/google-login/"), {  // ✅ Added /api/
//     method: "POST",
//     headers: jsonHeaders,
//     body: JSON.stringify({ token }),
//   });
//   const data = await parseResponse(res);
//   setAuthTokens(data);
//   return data;
// };


// export const register = async ({ username, email, phone_number, password, confirm_password }) => {
//   const res = await fetch(buildUrl("/accounts/register/"), {
//     method: "POST",
//     headers: jsonHeaders,
//     body: JSON.stringify({ username, email, phone_number, password, confirm_password }),
//   });
//   return parseResponse(res);
// };

// export const verifyOtp = async ({ email, otp }) => {
//   const res = await fetch(buildUrl("/accounts/verify-otp/"), {
//     method: "POST",
//     headers: jsonHeaders,
//     body: JSON.stringify({ email, otp }),
//   });
//   const data = await parseResponse(res);
//   setAuthTokens(data);
//   return data;
// };

// export const resendOtp = async ({ email }) => {
//   const res = await fetch(buildUrl("/accounts/register/resend-otp/"), {
//     method: "POST",
//     headers: jsonHeaders,
//     body: JSON.stringify({ email }),
//   });
//   return parseResponse(res);
// };

// export const forgotPassword = async ({ email }) => {
//   const res = await fetch(buildUrl("/accounts/password/forgot/"), {
//     method: "POST",
//     headers: jsonHeaders,
//     body: JSON.stringify({ email }),
//   });
//   return parseResponse(res);
// };


// export function getCurrentUser() {
//   try {
//     const user = localStorage.getItem("user");
//     return user ? JSON.parse(user) : null;
//   } catch (error) {
//     console.error("Failed to parse user data:", error);
//     return null;
//   }
// }
// export const resetPassword = async ({ email, otp, new_password }) => {
//   const res = await fetch(buildUrl("/accounts/password/reset/"), {
//     method: "POST",
//     headers: jsonHeaders,
//     body: JSON.stringify({ email, otp, new_password }),
//   });
//   const data = await parseResponse(res);
//   setAuthTokens(data);
//   return data;
// };

// export const logout = async () => {
//   const refresh = getRefreshToken();
//   if (refresh) {
//     try {
//       await fetch(buildUrl("/accounts/logout/"), {
//         method: "POST",
//         headers: jsonHeaders,
//         body: JSON.stringify({ refresh }),
//       });
//     } catch (error) {
//       // ignore network/logout errors
//     }
//   }
//   clearAuthTokens();
// };



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

export const setAuthTokens = ({ access, refresh, user, role }) => {
  if (access) localStorage.setItem(ACCESS_TOKEN_KEY, access);
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
  const res = await fetch(buildUrl("/accounts/login/"), {
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
  const res = await fetch(buildUrl("/accounts/password/forgot/"), {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ email }),
  });
  return parseResponse(res);
};

export const resetPassword = async ({ email, otp, new_password }) => {
  const res = await fetch(buildUrl("/accounts/password/reset/"), {
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

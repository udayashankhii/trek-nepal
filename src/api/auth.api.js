// src/api/auth.api.js
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Get access token from localStorage
 */
export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

/**
 * Clear authentication tokens
 */
export const clearAuthTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
};

/**
 * Get refresh token from localStorage
 */
export function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return Boolean(getAccessToken());
}

/**
 * Get current user data
 */
export function getCurrentUser() {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Failed to parse user data:", error);
    return null;
  }
}

/**
 * Login with email and password
 */
export async function login({ email, password }) {
  const response = await fetch(`${API_URL}/api/accounts/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || data.message || "Invalid credentials");
  }

  // Store tokens and user data
  localStorage.setItem("accessToken", data.access);
  localStorage.setItem("refreshToken", data.refresh);
  localStorage.setItem("role", data.role || "user");
  
  // Store user data if available
  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  } else {
    localStorage.setItem("user", JSON.stringify({ email }));
  }

  return data;
}

/**
 * Google OAuth Login
 */
export async function googleLogin({ token }) {
  const response = await fetch(`${API_URL}/api/accounts/google-login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || data.message || "Google login failed");
  }

  // Store tokens and user data
  localStorage.setItem("accessToken", data.access);
  localStorage.setItem("refreshToken", data.refresh);
  localStorage.setItem("role", data.role || "user");
  
  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
}

/**
 * Register new user
 */
export async function register(formData) {
  const response = await fetch(`${API_URL}/api/accounts/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || data.message || "Registration failed");
  }

  return data;
}

/**
 * Verify OTP
 */
export async function verifyOtp({ email, otp }) {
  const response = await fetch(`${API_URL}/api/accounts/verify-otp/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || data.message || "Invalid OTP");
  }

  return data;
}

/**
 * Resend OTP
 */
export async function resendOtp({ email }) {
  const response = await fetch(`${API_URL}/api/accounts/resend-otp/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || data.message || "Failed to resend OTP");
  }

  return data;
}

/**
 * Request password reset code
 */
export async function forgotPassword({ email }) {
  const response = await fetch(`${API_URL}/api/accounts/forgot-password/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || data.message || "Failed to send reset code");
  }

  return data;
}

/**
 * Reset password with OTP
 */
export async function resetPassword({ email, otp, new_password }) {
  const response = await fetch(`${API_URL}/api/accounts/reset-password/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp, new_password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || data.message || "Failed to reset password");
  }

  return data;
}

/**
 * Logout user
 */
export async function logout() {
  const refreshToken = getRefreshToken();

  try {
    if (refreshToken) {
      await fetch(`${API_URL}/api/accounts/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
    }
  } catch (error) {
    console.error("Logout API call failed:", error);
  } finally {
    // Always clear local storage
    clearAuthTokens();
  }
}

/**
 * Refresh access token
 */
export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await fetch(`${API_URL}/api/accounts/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    const data = await response.json();
    localStorage.setItem("accessToken", data.access);
    
    return data.access;
  } catch (error) {
    await logout();
    throw error;
  }
}

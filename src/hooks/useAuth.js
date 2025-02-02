import { useState } from "react";

function useAuth() {
  // Initialize the user state from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Initialize the token state from localStorage
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  // Backend API base URL
  const API_BASE_URL = "http://localhost:5205/api/Auth";

  // Function to handle login
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login?api-version=1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Handle non-200 responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Login failed.");
      }

      const data = await response.json();

      // Ensure user object contains required properties
      if (!data.userId || !data.token || !data.roles) {
        throw new Error("Invalid login response: missing userId, token, or roles.");
      }

      // Save user info and token in localStorage
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);

      // Update state
      setUser(data);
      setToken(data.token);

      return data; // Return user data
    } catch (error) {
      console.error("Login error:", error.message);
      throw error;
    }
  };

  // Function to logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Function to get userId
  const getUserId = () => user?.userId || null;

  // Function to get authentication token
  const getToken = () => token;

  // Function to check if user has a specific role
  const hasRole = (role) => user?.roles?.includes(role);

  return { user, token, login, logout, getUserId, getToken, hasRole };
}

export default useAuth;

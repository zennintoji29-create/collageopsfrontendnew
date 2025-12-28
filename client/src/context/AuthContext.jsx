import { createContext, useState, useEffect, useContext } from "react";
import axios from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // LOGIN
  const login = async (email, password) => {
    try {
      const res = await axios.post("/auth/login", {
        email,
        password,
      });

      // BACKEND RETURNS: { token, user }
      const { token, user } = res.data;

      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Invalid email or password",
      };
    }
  };

  // REGISTER
  const register = async (userData) => {
    try {
      const res = await axios.post("/auth/register", userData);

      const { token, user } = res.data;

      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Registration failed",
      };
    }
  };

  // LOGOUT (frontend-only, backend has no logout route)
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import { createContext, useState, useEffect } from "react";
import api from "../services/api.js";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(null);

  useEffect(() => {
    if (token) {
      api.get("/auth/me")
        .then(({ data }) => setUsername(data.name))
        .catch(() => {});
    }
  }, [token]);

  function login(newToken, newRefreshToken) {
    localStorage.setItem("token", newToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    setToken(newToken);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setToken(null);
    setUsername(null);
  }

  return (
    <AuthContext.Provider value={{ token, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
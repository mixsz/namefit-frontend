import { useState, useEffect } from "react";
import api from "../services/api.js";
import { AuthContext } from "./authContext.js";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(null);
  const [avatarId, setAvatarId] = useState(null);

  useEffect(() => {
    if (token) {
      api
        .get("/auth/me")
        .then(({ data }) => {
          setUsername(data.name);
          setAvatarId(data.avatarId ?? null);
        })
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
    setAvatarId(null);
  }

  function updateUser(partial) {
    if (partial.name !== undefined) setUsername(partial.name);
    if (partial.avatarId !== undefined) setAvatarId(partial.avatarId);
  }

  return (
    <AuthContext.Provider
      value={{ token, username, avatarId, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
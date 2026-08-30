import { useState, useEffect } from "react";
import api from "../services/api.js";
import { AuthContext } from "./authContext.js";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(null);
  const [avatarId, setAvatarId] = useState(null);
  const [role, setRole] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoadingUser(false);
      return;
    }

    let cancelled = false;
    let attempt = 0;
    let timeoutId;

    async function fetchMe() {
      try {
        const { data } = await api.get("/auth/me");
        if (cancelled) return;
        setUsername(data.name);
        setAvatarId(data.avatarId ?? null);
        setRole(data.role ?? null);
        setLoadingUser(false);
      } catch (error) {
        if (cancelled) return;

        if (!error.response) {
          attempt++;
          const delay = Math.min(1000 * 2 ** attempt, 10000);
          timeoutId = setTimeout(fetchMe, delay);
        } else {
          setLoadingUser(false);
        }
      }
    }

    fetchMe();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [token]);

  function login(newToken, newRefreshToken) {
    localStorage.setItem("token", newToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    setToken(newToken);
    setLoadingUser(true);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setToken(null);
    setUsername(null);
    setAvatarId(null);
    setRole(null);
    setLoadingUser(false);
  }

  function updateUser(partial) {
    if (partial.name !== undefined) setUsername(partial.name);
    if (partial.avatarId !== undefined) setAvatarId(partial.avatarId);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        username,
        avatarId,
        role,
        loadingUser,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
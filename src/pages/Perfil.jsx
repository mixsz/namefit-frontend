import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import PerfilView from "../components/PerfilView.jsx";

export default function Perfil() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const { logout } = useAuth();
  const { showToast } = useToast();

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setConnectionError(false);
    try {
      const { data } = await api.get("/user/profile");
      setProfile(data);
    } catch (error) {
      if (error.code === "ERR_NETWORK") setConnectionError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  async function handleSaveName(newName) {
    try {
      const { data } = await api.put("/user/name", { name: newName });
      setProfile((prev) => ({ ...prev, name: data.name }));
      showToast("Nome atualizado", "success");
    } catch (error) {
      const message = error.response?.data || "Erro ao atualizar nome";
      showToast(
        typeof message === "string" ? message : "Erro ao atualizar nome",
        "error",
      );
      throw error;
    }
  }

  async function handleSaveAvatar(avatarId) {
    try {
      const { data } = await api.put("/user/avatar", { avatarId });
      setProfile((prev) => ({ ...prev, avatarId: data.avatarId }));
      showToast("Avatar atualizado", "success");
    } catch (error) {
      const message = error.response?.data || "Erro ao atualizar avatar";
      showToast(
        typeof message === "string" ? message : "Erro ao atualizar avatar",
        "error",
      );
      throw error;
    }
  }

  async function handleSavePassword({ currentPassword, newPassword }) {
    await api.put("/user/password", { currentPassword, newPassword });
    showToast("Senha atualizada", "success");
  }

  function handleLogout() {
    logout();
  }

  return (
    <PerfilView
      data={profile}
      loading={loading}
      connectionError={connectionError}
      onRetry={fetchProfile}
      onSaveName={handleSaveName}
      onSaveAvatar={handleSaveAvatar}
      onSavePassword={handleSavePassword}
      onLogout={handleLogout}
    />
  );
}

import api from "../services/api";
import LoginForm from "../components/LoginForm";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleLogin({ email, password }) {
    setError(null);

    try {
      const { data } = await api.post("/auth/login", { email, password });
      login(data.token, data.refreshToken);
      navigate("/home");
    } catch (err) {
      if (err.response?.status === 429) {
        setError(
          err.response.data?.message ??
            "Muitas tentativas. Tente novamente em instantes.",
        );
        return;
      }

      if (
        err.response?.status === 401 ||
        err.response?.status === 403 ||
        err.response?.status === 400
      ) {
        const remaining = err.response.headers?.["x-ratelimit-remaining"];
        if (remaining !== undefined && Number(remaining) <= 2) {
          setError(
            Number(remaining) === 0
              ? `E-mail ou senha incorretos. Resta ${Number(remaining) + 1} tentativa.`
              : `E-mail ou senha incorretos. Restam ${Number(remaining) + 1} tentativas.`,
          );
        } else {
          setError("E-mail ou senha incorretos.");
        }
      } else {
        setError("Ocorreu um erro inesperado. Tente novamente mais tarde.");
      }
    }
  }

  return <LoginForm onSubmit={handleLogin} error={error} />;
}

export default Login;

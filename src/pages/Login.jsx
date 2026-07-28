import api from "../services/api";
import LoginForm from "../components/LoginForm";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

function Login() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleLogin({ email, password }) {
    setError(null);

    if (email === "a" && password === "a") {
      // atalho dps remover!!!!!!!!!!!!!!!!!!
      try {
        const { data } = await axios.post("http://localhost:8080/auth/login", {
          email: "bola@email.com",
          password: "Bola123!",
        });
        login(data.token, data.refreshToken);
        navigate("/home");
      } catch (error) {
        console.error("erro atalho login:", error);
      }
      return;
    }

    try {
      const { data } = await api.post("/auth/login", { email, password });
      login(data.token, data.refreshToken);
      navigate("/home");
    } catch (err) {
      if (
        err.response?.status === 401 ||
        err.response?.status === 403 ||
        err.response?.status === 400
      ) {
        setError("E-mail ou senha incorretos.");
      } else {
        setError("Ocorreu um erro inesperado. Tente novamente mais tarde.");
      }
    }
  }

  return <LoginForm onSubmit={handleLogin} error={error} />;
}

export default Login;

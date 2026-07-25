import CadastroForm from "../components/CadastroForm";
import api from "../services/api";
import { useState } from "react";

function Cadastro() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function handleCadastro({ name, email, password, confirmPassword }) {
    setError(null);
    setSuccess(null);
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    try {
      const { data } = await api.post("auth/register", {
        name,
        email,
        password,
        confirmPassword,
      });
      setSuccess("Cadastro realizado com sucesso! Você já pode fazer login.");
    } catch (err) {
      if (err.response?.status === 400) {
        const data = err.response.data;
        const mensagens =
          typeof data === "string" ? data : Object.values(data).join("\n");
        setError(mensagens);
      } else {
        setError("Erro ao realizar cadastro. Tente novamente.");
      }
    }
  }

  return (
    <CadastroForm onSubmit={handleCadastro} error={error} success={success} />
  );
}

export default Cadastro;

import { useState } from "react";
import { ORANGE, BG, PANEL, FIELD, BORDER, TEXT, MUTED } from "../theme.js";
import { Eye, EyeOff, Dumbbell, User, Mail, Lock, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const BENEFITS = [
  "Treinos personalizados para o seu objetivo",
  "Acompanhe sua evolução em tempo real",
  "Foco no treino, não na complicação",
];

function CadastroForm({ onSubmit, error, success }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (success) {
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  }, [success]);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    if (onSubmit) {
      Promise.resolve(
        onSubmit({ name, email, password, confirmPassword }),
      ).finally(() => setLoading(false));
    }
  }

  const fieldWrap = {
    background: FIELD,
    border: "1.5px solid " + BORDER,
    color: TEXT,
  };

  function focusOn(e) {
    e.currentTarget.style.borderColor = ORANGE;
  }
  function focusOff(e) {
    e.currentTarget.style.borderColor = BORDER;
  }

  return (
    <div
      className="min-h-screen w-full flex relative"
      style={{ background: BG, fontFamily: "'Barlow', sans-serif" }}
    >
      <div className="fixed inset-0 lg:hidden">
        <img
          src="/gym.avif"
          alt="academia"
          className="absolute inset-0 h-full w-full object-cover object-bottom"
          style={{ opacity: 0.32 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(12,10,8,0.35) 0%, rgba(12,10,8,0.75) 45%, rgba(12,10,8,0.97) 80%)",
          }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 lg:px-16 py-10 lg:py-12 relative z-10 overflow-hidden">
        <div
          className="hidden lg:block absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, #221c17 0%, #0c0a08 80%)",
          }}
        />

        <div className="relative z-10 w-full max-w-[460px]">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#161210]/80 to-[#0e0b09]/80 backdrop-blur-md shadow-[0_24px_60px_rgba(0,0,0,0.5)] px-6 pt-10 pb-6 sm:px-8 sm:pt-12 sm:pb-8 lg:rounded-none lg:border-0 lg:bg-none lg:backdrop-blur-none lg:shadow-none lg:p-0">
            <div className="flex lg:hidden items-center justify-center gap-3 mb-12">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: ORANGE }}
              >
                <Dumbbell size={28} color={BG} strokeWidth={2.5} />
              </div>
              <span
                className="text-4xl font-extrabold tracking-widest"
                style={{
                  color: TEXT,
                  fontFamily: "'Barlow Condensed', sans-serif",
                }}
              >
                NAME<span style={{ color: ORANGE }}>FIT</span>
              </span>
            </div>

            <div className="mb-8 text-center lg:text-left">
              <h2
                className="font-extrabold leading-none"
                style={{
                  color: TEXT,
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: "clamp(2rem, 6vw, 2.6rem)",
                  letterSpacing: "-0.01em",
                }}
              >
                CRIE SUA CONTA
              </h2>
              <p
                className="mt-3 text-sm leading-relaxed"
                style={{ color: MUTED }}
              >
                Leva menos de um minuto! Comece a acompanhar seus treinos hoje
                mesmo.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
              noValidate
            >
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="nome"
                  className="text-xs font-bold uppercase tracking-[0.15em]"
                  style={{ color: "#a09890" }}
                >
                  Nome completo
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: MUTED }}
                  />
                  <input
                    id="nome"
                    type="text"
                    autoComplete="name"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full rounded-xl pl-12 pr-5 py-3.5 sm:py-4 text-sm outline-none transition-all"
                    style={fieldWrap}
                    onFocus={focusOn}
                    onBlur={focusOff}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-xs font-bold uppercase tracking-[0.15em]"
                  style={{ color: "#a09890" }}
                >
                  E-mail
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: MUTED }}
                  />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl pl-12 pr-5 py-3.5 sm:py-4 text-sm outline-none transition-all"
                    style={fieldWrap}
                    onFocus={focusOn}
                    onBlur={focusOff}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="senha"
                    className="text-xs font-bold uppercase tracking-[0.15em]"
                    style={{ color: "#a09890" }}
                  >
                    Senha
                  </label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: MUTED }}
                    />
                    <input
                      id="senha"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full rounded-xl pl-12 pr-11 py-3.5 sm:py-4 text-sm outline-none transition-all"
                      style={fieldWrap}
                      onFocus={focusOn}
                      onBlur={focusOff}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-opacity opacity-40 hover:opacity-80"
                      style={{ color: "#9ca3af" }}
                      tabIndex={-1}
                      aria-label={
                        showPassword ? "Ocultar senha" : "Mostrar senha"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="confirmarSenha"
                    className="text-xs font-bold uppercase tracking-[0.15em]"
                    style={{ color: "#a09890" }}
                  >
                    Confirmar senha
                  </label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: MUTED }}
                    />
                    <input
                      id="confirmarSenha"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full rounded-xl pl-12 pr-11 py-3.5 sm:py-4 text-sm outline-none transition-all"
                      style={fieldWrap}
                      onFocus={focusOn}
                      onBlur={focusOff}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-opacity opacity-40 hover:opacity-80"
                      style={{ color: "#9ca3af" }}
                      tabIndex={-1}
                      aria-label={
                        showConfirmPassword ? "Ocultar senha" : "Mostrar senha"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="min-h-[10px]">
                {error && (
                  <p
                    className="text-sm notranslate whitespace-pre-line"
                    translate="no"
                    style={{ color: "#ef4444" }}
                  >
                    {error}
                  </p>
                )}
                {success && (
                  <p
                    className="text-sm notranslate"
                    translate="no"
                    style={{ color: "#67b75c" }}
                  >
                    {success}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 sm:py-4 rounded-full font-extrabold text-sm tracking-[0.18em] uppercase transition-all mt-0"
                style={{
                  background: loading ? "#cc3a12" : ORANGE,
                  color: "#0c0a08",
                  boxShadow: loading ? "none" : "0 2px 8px rgba(0,0,0,0.35)",
                  transform: loading ? "scale(0.98)" : "scale(1)",
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = "#ff6b42";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0,0,0,0.4)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = ORANGE;
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(0,0,0,0.35)";
                  }
                }}
              >
                {loading ? "Cadastrando..." : "Criar conta"}
              </button>
            </form>

            <p className="text-center text-sm mt-7" style={{ color: MUTED }}>
              Já possui conta?{"  "}
              <Link
                to="/login"
                className="font-medium transition-colors underline"
                style={{ color: ORANGE }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#ff6b42")}
                onMouseOut={(e) => (e.currentTarget.style.color = ORANGE)}
              >
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div
        className="hidden lg:flex flex-col justify-between w-[58%] relative overflow-hidden p-14"
        style={{ background: PANEL }}
      >
        <img
          src="/gym.avif"
          alt="academia"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.22 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(200deg, rgba(255,77,28,0.14) 0%, rgba(12,10,8,0.6) 50%, rgba(12,10,8,0.97) 100%)",
          }}
        />
        <div
          className="absolute -left-20 top-0 h-full w-48 opacity-[0.07]"
          style={{ background: ORANGE, transform: "skewX(-8deg)" }}
        />

        <div className="relative z-10 flex items-center gap-3 justify-end">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: ORANGE }}
          >
            <Dumbbell size={22} color="#0c0a08" strokeWidth={2.5} />
          </div>
          <span
            className="text-[1.6rem] font-extrabold tracking-widest"
            style={{
              color: "#ffffff",
              fontFamily: "'Barlow Condensed', sans-serif",
            }}
          >
            NAME<span style={{ color: ORANGE }}>FIT</span>
          </span>
        </div>

        <div className="relative z-10 ml-auto max-w-md">
          <h1
            className="font-extrabold leading-[0.92] mb-8"
            style={{
              color: TEXT,
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "clamp(3rem, 4.8vw, 4.8rem)",
            }}
          >
            COMECE
            <br />
            SUA
            <br />
            <span style={{ color: ORANGE }}>JORNADA</span>
          </h1>

          <ul className="flex flex-col gap-3">
            {BENEFITS.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(255,77,28,0.15)" }}
                >
                  <Check size={14} color={ORANGE} strokeWidth={3} />
                </span>
                <span className="text-sm" style={{ color: "#c9c2bb" }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CadastroForm;

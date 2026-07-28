import { useState } from "react";
import { Eye, EyeOff, Dumbbell, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import {ORANGE, BG, PANEL, FIELD, BORDER, TEXT, MUTED} from "../theme.js";

function LoginForm({ onSubmit, error }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    if (onSubmit) {
      Promise.resolve(onSubmit({ email, password })).finally(() =>
        setLoading(false),
      );
    }
  }

  return (
    <div
      className="min-h-screen w-full flex"
      style={{ background: BG, fontFamily: "'Barlow', sans-serif" }}
    >
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
              "linear-gradient(160deg, rgba(255,77,28,0.12) 0%, rgba(12,10,8,0.6) 50%, rgba(12,10,8,0.97) 100%)",
          }}
        />
        <div
          className="absolute -right-20 top-0 h-full w-48 opacity-[0.07]"
          style={{ background: ORANGE, transform: "skewX(-8deg)" }}
        />

        <div className="relative z-10 flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: ORANGE }}
          >
            <Dumbbell size={22} color="#0c0a08" strokeWidth={2.5} />
          </div>
          <span
            className="text-[1.6rem] font-extrabold tracking-widest"
            style={{
              color: TEXT,
              fontFamily: "'Barlow Condensed', sans-serif",
            }}
          >
            NAME<span style={{ color: ORANGE }}>FIT</span>
          </span>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-5">
            <Flame size={14} fill={ORANGE} color={ORANGE} />
            <span
              className="text-xs font-bold uppercase tracking-[0.2em]"
              style={{ color: ORANGE }}
            >
              Sem desculpas. Sem limites.
            </span>
          </div>
          <h1
            className="font-extrabold leading-[0.92]"
            style={{
              color: TEXT,
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "clamp(3.5rem, 5.5vw, 5.5rem)",
            }}
          >
            FORJE
            <br />
            O MELHOR
            <br />
            <span style={{ color: ORANGE }}>DE VOCÊ</span>
          </h1>
        </div>
      </div>

      <div
        className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 lg:px-20 py-12 relative"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, #221c17 0%, #0c0a08 80%)",
        }}
      >
        <div className="relative z-10 w-full max-w-[420px]">
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: ORANGE }}
            >
              <Dumbbell size={20} color={BG} strokeWidth={2.5} />
            </div>
            <span
              className="text-2xl font-extrabold tracking-widest"
              style={{
                color: TEXT,
                fontFamily: "'Barlow Condensed', sans-serif",
              }}
            >
              NAME<span style={{ color: ORANGE }}>FIT</span>
            </span>
          </div>

          <div className="mb-10">
            <h2
              className="font-extrabold leading-tight"
              style={{
                color: TEXT,
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "2.8rem",
                letterSpacing: "-0.01em",
              }}
            >
              HORA DE TREINAR
            </h2>
            <p className="mt-2 text-sm" style={{ color: MUTED }}>
              Acesse sua conta para continuar acompanhando seus treinos.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
            noValidate
          >
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-xs font-bold uppercase tracking-[0.15em]"
                style={{ color: "#a09890" }}
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl px-5 py-4 text-sm outline-none transition-all"
                style={{
                  background: FIELD,
                  border: "1.5px solid " + BORDER,
                  color: TEXT,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = ORANGE;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = BORDER;
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-xs font-bold uppercase tracking-[0.15em]"
                style={{ color: "#a09890" }}
              >
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl px-5 py-4 pr-12 text-sm outline-none transition-all"
                  style={{
                    background: FIELD,
                    border: "1.5px solid " + BORDER,
                    color: TEXT,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = ORANGE;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = BORDER;
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-opacity opacity-40 hover:opacity-80"
                  style={{ color: "#9ca3af" }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="min-h-[20px]">
              {error && (
                <p className="text-sm" style={{ color: "#ef4444" }}>
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full font-extrabold text-sm tracking-[0.18em] uppercase transition-all mt-3"
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
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="text-center text-sm mt-8" style={{ color: MUTED }}>
            Não possui conta?{"  "}
            <Link
              to="/cadastro"
              className="font-medium transition-colors underline"
              style={{ color: ORANGE }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#ff6b42")}
              onMouseOut={(e) => (e.currentTarget.style.color = ORANGE)}
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;

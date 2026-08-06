import { ORANGE, PANEL, BORDER, TEXT, MUTED } from "../theme.js";
import { WifiOff } from "lucide-react";

function ConnectionErrorState({ onRetry }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl"
        style={{ background: PANEL, border: "1px solid " + BORDER }}
      >
        <WifiOff size={38} color={ORANGE} strokeWidth={2.2} />
      </div>
      <h1
        className="font-extrabold"
        style={{
          color: TEXT,
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: "clamp(2rem, 5vw, 3rem)",
          lineHeight: 1,
        }}
      >
        NÃO FOI POSSÍVEL CONECTAR
      </h1>
      <p className="mt-3 max-w-md text-sm" style={{ color: MUTED }}>
        Não conseguimos falar com o servidor agora. Verifique sua conexão e
        tente novamente.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-extrabold uppercase tracking-[0.18em] transition-all"
        style={{
          background: ORANGE,
          color: "#0c0a08",
          boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = "#ff6b42";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.4)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = ORANGE;
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.35)";
        }}
      >
        Tentar novamente
      </button>
    </div>
  );
}

export default ConnectionErrorState;
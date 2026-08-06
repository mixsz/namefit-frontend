import { ORANGE, TEXT, MUTED } from "../theme.js";
import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <main
      className="flex min-h-screen w-full flex-col items-center justify-start text-center px-6"
      style={{
        background:
          "radial-gradient(circle at 50% -10%, #201a15 0%, #0c0a08 60%)",
        fontFamily: "'Barlow', sans-serif",
        paddingTop: "18vh",
      }}
    >
      <span
        className="font-extrabold leading-none"
        style={{
          color: ORANGE,
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: "clamp(5rem, 14vw, 9rem)",
          opacity: 0.9,
        }}
      >
        404
      </span>

      <h1
        className="font-extrabold mt-2"
        style={{
          color: TEXT,
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
          lineHeight: 1,
        }}
      >
        PÁGINA NÃO ENCONTRADA
      </h1>

      <p className="mt-3 max-w-md text-sm" style={{ color: MUTED }}>
        O link que você acessou não existe ou foi movido.
      </p>

      <Link
        to="/"
        className="mt-6 text-sm font-bold uppercase tracking-[0.08em] transition-colors"
        style={{ color: ORANGE }}
        onMouseOver={(e) => (e.currentTarget.style.color = "#ff6b42")}
        onMouseOut={(e) => (e.currentTarget.style.color = ORANGE)}
      >
        Voltar ao início
      </Link>
    </main>
  );
}

export default ErrorPage;

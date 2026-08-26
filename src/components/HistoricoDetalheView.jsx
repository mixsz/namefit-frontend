import { useState } from "react";
import { ORANGE, PANEL, BORDER, TEXT, MUTED } from "../theme";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Check,
  Dumbbell,
  History,
  Repeat,
  Layers,
  Weight,
} from "lucide-react";
import MuscleIcon from "./MuscleIcon";
import ConnectionErrorState from "./ConnectionErrorState.jsx";
import { useNavigate } from "react-router-dom";

const MONTHS = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const base = `${date.getDate()} de ${MONTHS[date.getMonth()]}`;
  return date.getFullYear() === now.getFullYear()
    ? base
    : `${base} de ${date.getFullYear()}`;
}

function formatTime(dateString) {
  const date = new Date(dateString);
  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;
}

function durationMinutes(start, end) {
  if (!start || !end) return null;
  return Math.round((new Date(end) - new Date(start)) / 60000);
}

function val(value, unit = "", spaced = true) {
  if (value === null || value === undefined || value === "") return "—";
  return spaced ? `${value} ${unit}` : `${value}${unit}`;
}

function SectionLabel({ children }) {
  return (
    <p
      className="mb-3 text-xs font-bold uppercase tracking-[0.15em]"
      style={{ color: MUTED }}
    >
      {children}
    </p>
  );
}

function BackLink({ label = "Voltar" }) {
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate("/historico")}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="inline-flex items-center gap-2 py-2 pr-4 pl-2 text-sm font-bold uppercase tracking-[0.08em] transition-all"
      style={{ color: hover ? ORANGE : MUTED, background: "transparent" }}
    >
      <ArrowLeft size={18} strokeWidth={2.5} />
      {label}
    </button>
  );
}

function MetricCard({ icon, value, label }) {
  return (
    <div
      className="flex items-center gap-3 overflow-hidden rounded-2xl px-4 py-4"
      style={{
        background:
          "radial-gradient(140% 600% at 100% -130%, rgba(255,110,50,0.06) 0%, rgba(180,60,15,0.02) 20%, #171310 45%, #0e0b09 100%)",
        backgroundClip: "padding-box",
        border: "1.5px solid " + BORDER,
      }}
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{
          background: "rgba(255,77,28,0.12)",
          border: "1.5px solid rgba(255,77,28,0.25)",
        }}
      >
        <span style={{ color: ORANGE, display: "flex" }}>{icon}</span>
      </div>
      <div className="relative min-w-0" style={{ top: "-3px" }}>
        <p
          className="mt-1 text-xs font-bold uppercase tracking-[0.12em]"
          style={{ color: MUTED }}
        >
          {label}
        </p>
        <p
          className="truncate font-bold leading-none"
          style={{
            color: TEXT,
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "1.5rem",
          }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function ExerciseRow({ exercise }) {
  const { done, name, muscleGroup, sets, reps, weight } = exercise;

  return (
    <div
      className="flex items-center gap-3.5 overflow-hidden rounded-2xl px-5 py-3.5"
      style={{
        background: done
          ? "linear-gradient(130deg, #0e0b09 -5%, #161210 28%, #161210 40%, rgba(240,90,20,0.15) 65%, rgba(160,45,10,0.13) 75%, #161210 88%, #0e0b09 100%)"
          : PANEL,
        backgroundClip: "padding-box",
        border: "1px solid " + "rgba(255,255,255,0.04)",
        opacity: done ? 1 : 0.65,
      }}
    >
      <div className="relative shrink-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl">
          <MuscleIcon group={muscleGroup} size={40} />
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <h3
          className="truncate text-lg font-bold leading-tight"
          style={{
            color: done ? TEXT : MUTED,
            fontFamily: "'Barlow Condensed', sans-serif",
            letterSpacing: "0.01em",
          }}
        >
          {name}
        </h3>

        {done ? (
          <div
            className="mt-1.5 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs"
            style={{ color: MUTED, fontFamily: "'Barlow', sans-serif" }}
          >
            <span
              className="inline-flex items-center gap-1.5"
              style={{ minWidth: 62 }}
            >
              <Layers size={13} className="shrink-0" />
              {val(sets, "séries")}
            </span>
            <span
              className="inline-flex items-center gap-1.5"
              style={{ minWidth: 64 }}
            >
              <Repeat size={13} className="shrink-0" />
              {val(reps, "reps")}
            </span>
            <span
              className="inline-flex items-center gap-1.5"
              style={{ minWidth: 56 }}
            >
              <Weight size={13} className="shrink-0" />
              {val(weight, "kg", false)}
            </span>
          </div>
        ) : (
          <p
            className="mt-1.5 text-sm"
            style={{ color: MUTED, fontFamily: "'Barlow', sans-serif" }}
          >
            Não confirmado
          </p>
        )}
      </div>

      {done && (
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
          style={{
            background: "rgba(255,77,28,0.04)",
            border: "1.5px solid rgba(255,77,28,0.25)",
          }}
        >
          <Check size={18} color={ORANGE} strokeWidth={1} />
        </span>
      )}
    </div>
  );
}

function NotFoundState() {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl px-6 py-16 text-center"
      style={{ background: PANEL, border: "1.5px solid " + BORDER }}
    >
      <div
        className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{
          background: "rgba(255,77,28,0.1)",
          border: "1.5px solid rgba(255,77,28,0.25)",
        }}
      >
        <History size={28} color={ORANGE} />
      </div>
      <h2
        className="text-2xl font-bold"
        style={{ color: TEXT, fontFamily: "'Barlow Condensed', sans-serif" }}
      >
        Sessão não encontrada
      </h2>
      <p className="mt-2 max-w-sm text-sm" style={{ color: MUTED }}>
        Essa sessão não existe ou não está mais disponível no seu histórico.
      </p>
      <div className="mt-6">
        <BackLink />
      </div>
    </div>
  );
}

function HistoricoDetalheView({ data = {} }) {
  const status = data.status ?? "success";
  const session = data.session ?? null;

  const minutes = session
    ? durationMinutes(session.startTime, session.endTime)
    : null;

  const exercises = session
    ? [...session.exercises].sort((a, b) => {
        if (a.done !== b.done) return a.done ? -1 : 1;
        return a.position - b.position;
      })
    : [];

  return (
    <main
      className="min-h-screen w-full"
      style={{
        background:
          "radial-gradient(1400px circle at 50% -10%, #201a15 0%, #0c0a08 60%)",
        fontFamily: "'Barlow', sans-serif",
        paddingTop: "var(--header-height, 90px)",
      }}
    >
      <div className="mx-auto w-full max-w-6xl px-6 pb-24 md:px-10">
        {status === "loading" ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <p style={{ color: MUTED }}>Carregando sessão...</p>
          </div>
        ) : status === "error" ? (
          <ConnectionErrorState onRetry={data.onRetry} />
        ) : status === "notFound" || !session ? (
          <NotFoundState />
        ) : (
          <>
            <div className="mb-6">
              <BackLink label="Voltar" />
            </div>

            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-3">
                <h1
                  className="font-bold leading-[0.95]"
                  style={{
                    color: TEXT,
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {session.workoutName}
                </h1>
                {session.deleted && (
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em]"
                    style={{
                      color: "#c98a76",
                      background: "transparent",
                      border: "1px solid rgba(200,90,50,0.3)",
                    }}
                  >
                    Treino excluído
                  </span>
                )}
              </div>

              <div
                className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm"
                style={{ color: MUTED }}
              >
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={14} />
                  {formatDate(session.startTime)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={14} />
                  {formatTime(session.startTime)} –{" "}
                  {formatTime(session.endTime)}
                </span>
              </div>
            </header>

            <section className="mb-7">
              <SectionLabel>Resumo da sessão</SectionLabel>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <MetricCard
                  icon={<Clock size={18} />}
                  value={minutes != null ? `${minutes}min` : "—"}
                  label="Duração"
                />
                <MetricCard
                  icon={<Check size={18} />}
                  value={`${session.done}`}
                  label="Exercícios confirmados"
                />
                <MetricCard
                  icon={<Dumbbell size={18} />}
                  value={session.planned}
                  label="Exercícios no treino"
                />
              </div>
            </section>

            <section>
              <SectionLabel>Exercícios</SectionLabel>
              <ul className="flex flex-col gap-3">
                {exercises.map((exercise) => (
                  <li key={exercise.id}>
                    <ExerciseRow exercise={exercise} />
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

export default HistoricoDetalheView;

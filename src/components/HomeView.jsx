import { useState } from "react";
import { ORANGE, BG, PANEL, FIELD, BORDER, MUTED, TEXT } from "../theme";
import {
  Dumbbell,
  Flame,
  FlameKindling,
  CalendarCheck,
  History,
  Zap,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Target,
  Plus,
  ListPlus,
  WifiOff,
} from "lucide-react";
import { Link } from "react-router-dom";
import ConnectionErrorState from "./ConnectionErrorState.jsx";

function HomeView({ data }) {
  const {
    username,
    hasWorkout,
    trained,
    todayWorkoutName,
    weekCount,
    lastWorkout,
    streak,
    suggestion,
    loading,
    connectionError,
    onRetry,
  } = data;

  return (
    <main
      className="min-h-screen w-full"
      style={{
        background:
          "radial-gradient(circle at 50% -10%, #201a15 0%, #0c0a08 60%)",
        fontFamily: "'Barlow', sans-serif",
        paddingTop: "90px",
      }}
    >
      <div className="mx-auto w-full max-w-6xl px-6 pb-16 md:px-10">
        {loading ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <p style={{ color: MUTED }}>Carregando...</p>
          </div>
        ) : connectionError ? (
          <ConnectionErrorState onRetry={onRetry} />
        ) : !hasWorkout ? (
          <EmptyState />
        ) : (
          <>
            <header className="mb-8">
              <h1
                className="font-bold leading-[0.95]"
                style={{
                  color: TEXT,
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
                  letterSpacing: "-0.01em",
                }}
              >
                Olá, {username}!
              </h1>
              <p className="mt-2 text-sm" style={{ color: MUTED }}>
                Cada treino conta. O esforço de hoje é o resultado de amanhã!
              </p>
            </header>

            <StatusCard trained={trained} todayWorkoutName={todayWorkoutName} />

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Link to="/historico" className="block h-full">
                <MetricCard
                  icon={<CalendarCheck size={20} />}
                  value={weekCount}
                  unit="treinos"
                  label="Nesta semana"
                />
              </Link>

              <Link
                to={`/historico/${lastWorkout.id}`}
                className="block h-full"
              >
                <MetricCard
                  icon={<History size={20} />}
                  value={lastWorkout.name}
                  label={
                    lastWorkout.daysAgo === 0
                      ? "Último treino · hoje"
                      : `Último treino · há ${lastWorkout.daysAgo} ${
                          lastWorkout.daysAgo === 1 ? "dia" : "dias"
                        }`
                  }
                  compact
                />
              </Link>

              <MetricCard
                icon={
                  trained ? (
                    <Flame size={20} fill={ORANGE} color={ORANGE} />
                  ) : (
                    <FlameKindling size={20} />
                  )
                }
                value={streak}
                unit={streak === 1 ? "dia" : "dias"}
                label="Sequência ativa"
                labelColor={trained ? ORANGE : undefined}
                hoverable={false}
              />

              <SuggestionCard suggestion={suggestion} />
            </div>

            <BuildWorkoutCard />
          </>
        )}
      </div>
    </main>
  );
}

function BuildWorkoutCard() {
  const [hover, setHover] = useState(false);
  return (
    <Link
      to="/treinos"
      state={{ openCreate: true }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative mt-6 flex flex-col overflow-hidden rounded-2xl p-6 transition-all md:flex-row md:items-center md:justify-between md:p-8"
      style={{
        background:
          "linear-gradient(180deg, #141210 0%, #17130f 70%, rgba(255,77,28,0.12) 100%)",
        border: "1px solid transparent",
        backgroundClip: "padding-box",
        boxShadow: hover
          ? "0 0 0 1px rgba(255,77,28,0.45)"
          : "0 0 0 1px rgba(255,255,255,0.06)",
      }}
    >
      <div className="relative z-10 flex items-start gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
          style={{ background: ORANGE }}
        >
          <ListPlus size={24} color={BG} strokeWidth={2.5} />
        </div>
        <div>
          <h3
            className="font-bold"
            style={{
              color: TEXT,
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "1.9rem",
              lineHeight: 1,
            }}
          >
            Monte seu próprio treino
          </h3>
          <p className="mt-2 max-w-md text-sm" style={{ color: MUTED }}>
            Escolha os exercícios, defina séries e repetições e crie a rotina
            perfeita para os seus treinos.
          </p>
        </div>
      </div>

      <span
        className="relative z-10 mt-6 inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-extrabold uppercase tracking-[0.05em] transition-all md:mt-0"
        style={{
          background: hover ? ORANGE : "transparent",
          color: hover ? BG : ORANGE,
          border: "1.5px solid " + ORANGE,
        }}
      >
        <Plus size={16} strokeWidth={2.5} />
        Criar treino
      </span>
    </Link>
  );
}

function StatusCard({ trained, todayWorkoutName }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6 md:p-8"
      style={{
        background:
          "linear-gradient(270deg, #141210 0%, #17130f 85%, rgba(255,77,28,0.08) 100%)",
        border: "1px solid " + BORDER,
      }}
    >
      <div
        className="absolute -right-16 -top-10 h-48 w-48 rounded-full opacity-[0.08]"
        style={{ background: ORANGE }}
      />
      <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
            style={{
              background: trained ? "rgba(255,77,28,0.14)" : ORANGE,
            }}
          >
            {trained ? (
              <CheckCircle2 size={24} color={ORANGE} strokeWidth={2.5} />
            ) : (
              <Dumbbell size={24} color={BG} strokeWidth={2.5} />
            )}
          </div>
          <div>
            <h2
              className="font-medium"
              style={{
                color: TEXT,
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "1.7rem",
                lineHeight: 1.1,
              }}
            >
              {trained ? "Você já treinou hoje!" : "Ainda não treinou hoje..."}
            </h2>
            <p className="mt-1 text-sm" style={{ color: MUTED }}>
              {trained
                ? `O treino ${todayWorkoutName} foi insano!`
                : "Que tal começar agora? A consistência transforma esforço em resultado!"}
            </p>
          </div>
        </div>

        {!trained && (
          <Link
            to="/treinos"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-extrabold uppercase tracking-[0.05em] transition-all"
            style={{
              background: ORANGE,
              color: BG,
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
            Ir para Treinos
            <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        )}
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  value,
  unit,
  label,
  labelColor,
  highlight,
  compact,
  hoverable = true,
}) {
  const [hover, setHover] = useState(false);
  const active = hoverable && hover;
  return (
    <div
      onMouseEnter={() => hoverable && setHover(true)}
      onMouseLeave={() => hoverable && setHover(false)}
      className="h-full rounded-2xl p-5 transition-all"
      style={{
        background: PANEL,
        border: "1px solid " + (active ? "rgba(255,77,28,0.35)" : BORDER),
        transform: active ? "translateY(-2px)" : "translateY(0)",
        boxShadow: active ? "0 8px 24px rgba(0,0,0,0.35)" : "none",
      }}
    >
      <div
        className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
        style={{
          background: highlight ? ORANGE : FIELD,
          color: highlight ? BG : ORANGE,
        }}
      >
        {icon}
      </div>
      <div className="flex items-baseline gap-2">
        <span
          className="font-bold"
          style={{
            color: TEXT,
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: compact ? "1.5rem" : "2.4rem",
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        {unit && (
          <span className="text-sm font-semibold" style={{ color: MUTED }}>
            {unit}
          </span>
        )}
      </div>
      <p
        className="mt-2 text-xs font-bold uppercase tracking-[0.12em]"
        style={{ color: labelColor || MUTED }}
      >
        {label}
      </p>
    </div>
  );
}

function SuggestionCard({ suggestion }) {
  const [hover, setHover] = useState(false);
  return (
    <Link
      to="/exercicios"
      state={{ searchQuery: suggestion.name }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative flex flex-col items-start justify-between gap-4 overflow-hidden rounded-2xl p-6 transition-all sm:flex-row sm:col-span-2 lg:col-span-3"
      style={{
        background:
          "linear-gradient(120deg, #141210 0%, #141210 55%, rgba(255,77,28,0.12) 100%)",
        border: "1px solid " + (hover ? "rgba(255,77,28,0.45)" : "#1a1a1a"),
        backgroundClip: "padding-box",
        minHeight: "150px",
      }}
    >
      <div className="relative z-10">
        <span
          className="flex items-center gap-2 text-sm font-bold tracking-[0.1em] pb-1"
          style={{ color: ORANGE }}
        >
          <Sparkles size={16} fill={ORANGE} color={ORANGE} />
          Sugestão de exercício
        </span>
        <h3
          className="mt-2 font-extrabold"
          style={{
            color: TEXT,
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "2rem",
            lineHeight: 1,
          }}
        >
          {suggestion.name.toUpperCase()}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <Target size={15} color={ORANGE} />
          <span className="text-sm font-semibold" style={{ color: MUTED }}>
            {suggestion.muscleGroup}
          </span>
        </div>
      </div>

      <span
        className="relative z-10 inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold uppercase tracking-[0.05em] transition-all self-center"
        style={{
          background: hover ? ORANGE : "transparent",
          color: hover ? BG : ORANGE,
          border: "1.5px solid " + ORANGE,
        }}
      >
        Ver exercício
        <ArrowRight size={16} strokeWidth={2.5} />
      </span>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl"
        style={{ background: PANEL, border: "1px solid " + BORDER }}
      >
        <Dumbbell size={38} color={ORANGE} strokeWidth={2.2} />
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
        VOCÊ AINDA NÃO TEM TREINOS REGISTRADOS
      </h1>
      <p className="mt-3 max-w-md text-sm" style={{ color: MUTED }}>
        Comece agora a montar sua rotina e acompanhe cada evolução por aqui.
      </p>
      <Link
        to="/treinos"
        state={{ openCreate: true }}
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-extrabold uppercase tracking-[0.18em] transition-all"
        style={{
          background: ORANGE,
          color: BG,
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
        Criar meu primeiro treino
        <ArrowRight size={16} strokeWidth={2.5} />
      </Link>
    </div>
  );
}

export default HomeView;

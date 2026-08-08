import { useState } from "react";
import { ORANGE, BG, PANEL, FIELD, BORDER, MUTED, TEXT } from "../theme";
import {
  Dumbbell,
  Flame,
  FlameKindling,
  CalendarCheck,
  History,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Target,
  Plus,
  ListPlus,
} from "lucide-react";
import { Link } from "react-router-dom";
import ConnectionErrorState from "./ConnectionErrorState.jsx";
import MuscleIcon from "./MuscleIcon";

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

function HomeView({ data }) {
  const {
    username,
    hasWorkout,
    trained,
    todayWorkoutName,
    weekCount,
    lastWorkout,
    streak,
    trainedThisWeek,
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
      <div className="mx-auto w-full max-w-6xl px-6 pb-24 md:px-10">
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
            <header className="mb-10">
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
              <div
                className="my-3"
                style={{
                  width: 28,
                  height: 2,
                  background: ORANGE,
                  borderRadius: 2,
                }}
              />
              <p className="text-sm" style={{ color: MUTED }}>
                Cada treino conta. O esforço de hoje é o resultado de amanhã!
              </p>
            </header>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex h-full flex-col gap-4 sm:col-span-2">
                <div className="flex-1">
                  <StatusCard
                    trained={trained}
                    todayWorkoutName={todayWorkoutName}
                  />
                </div>
                <div className="flex-1">
                  <MiniWeekCalendar trainedWeekDays={data.trainedWeekDays} />
                </div>
              </div>
              <div>
                <StreakCard streak={streak} trained={trainedThisWeek} />
              </div>
            </div>

            <section className="mt-8">
              <SectionLabel>Estatísticas</SectionLabel>
              <div className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Link to="/historico" className="block h-full">
                  <SmallMetricCard
                    icon={<CalendarCheck size={18} />}
                    value={weekCount}
                    unit="treinos"
                    label="Nesta semana"
                    showDivider={false}
                    bg="linear-gradient(135deg, rgba(200,60,10,0.16) 0%, rgba(140,35,5,0.06) 30%, #161210 60%, #0e0b09 120%)"
                  />
                </Link>

                <Link
                  to={`/historico/${lastWorkout.id}`}
                  className="block h-full"
                >
                  <SmallMetricCard
                    icon={<History size={18} />}
                    value={lastWorkout.name}
                    label={
                      lastWorkout.daysAgo === 0
                        ? "Último treino · hoje"
                        : `Último treino · há ${lastWorkout.daysAgo} ${
                            lastWorkout.daysAgo === 1 ? "dia" : "dias"
                          }`
                    }
                    compact
                    bg="linear-gradient(225deg, rgba(200,60,10,0.16) 0%, rgba(140,35,5,0.06) 30%, #161210 60%, #0e0b09 120%)"
                  />
                </Link>
              </div>
            </section>

            <section className="mt-12">
              <SectionLabel>Sugestão de agora</SectionLabel>
              <SuggestionCard suggestion={suggestion} />
            </section>

            <section className="mt-12">
              <SectionLabel>Monte algo novo</SectionLabel>
              <BuildWorkoutCard />
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function StreakCard({ streak, trained }) {
  const accent = trained ? ORANGE : MUTED;
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const fraction = Math.min(streak / 12, 1);
  const dashoffset = circumference * (1 - fraction);

  return (
    <div
      className="relative h-full flex flex-col overflow-hidden rounded-2xl p-5 transition-all"
      style={{
        background:
          "linear-gradient(310deg, rgba(200,60,10,0.16) 0%, rgba(140,35,5,0.15) 0%, #161210 40%, #0e0b09 210%)",
        backgroundClip: "padding-box",
        border: "1px solid " + BORDER,
        minHeight: "100%",
      }}
    >
      <div className="mt-3">
        <h3
          className="font-bold uppercase leading-none"
          style={{
            color: trained ? ORANGE : TEXT,
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "1.4rem",
            letterSpacing: "0.01em",
          }}
        >
          Ofensiva semanal
        </h3>
        <p className="mt-2 text-sm" style={{ color: MUTED }}>
          {trained
            ? "Você conseguiu essa semana, continue treinando!"
            : "Treine hoje para manter sua sequência viva."}
        </p>
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center py-3">
        <div className="relative flex h-32 w-32 items-center justify-center">
          <svg
            width="128"
            height="128"
            viewBox="0 0 128 128"
            className="absolute inset-0 -rotate-90"
          >
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke={BORDER}
              strokeWidth="6"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke={accent}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashoffset}
              style={{
                transition: "stroke-dashoffset 0.6s ease",
              }}
            />
          </svg>
          <div className="flex flex-col items-center">
            <span
              className="font-bold leading-none"
              style={{
                color: trained ? ORANGE : TEXT,
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "2.4rem",
                lineHeight: 1,
              }}
            >
              {streak}
            </span>
            <span
              className="text-sm font-semibold"
              style={{ color: trained ? "rgba(255,150,90,0.8)" : MUTED }}
            >
              {streak === 1 ? "semana" : "semanas"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusCard({ trained, todayWorkoutName }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => !trained && setHover(true)}
      onMouseLeave={() => !trained && setHover(false)}
      className="h-full relative overflow-hidden rounded-2xl p-6 md:p-7 transition-all"
      style={{
        background:
          "linear-gradient(0deg, rgba(200,60,10,0.13) 0%, rgba(140,35,5,0.02) 30%, #161210 60%, #0e0b09 300%)",
        backgroundClip: "padding-box",
        border: "1.4px solid " + (hover ? "rgba(255,77,28,0.45)" : BORDER),
        boxShadow: hover ? "0 8px 24px rgba(0,0,0,0.35)" : "none",
      }}
    >
      <div className="relative z-10 flex h-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all"
            style={{
              background: trained
                ? "rgba(255,77,28,0.14)"
                : hover
                  ? ORANGE
                  : FIELD,
              border: trained
                ? "1px solid rgba(255,77,28,0.3)"
                : hover
                  ? "none"
                  : "1px solid " + BORDER,
            }}
          >
            {trained ? (
              <CheckCircle2 size={24} color={ORANGE} strokeWidth={2.5} />
            ) : (
              <Dumbbell
                size={24}
                color={hover ? BG : ORANGE}
                strokeWidth={2.5}
              />
            )}
          </div>
          <div>
            <h2
              className="font-bold"
              style={{
                color: TEXT,
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "1.7rem",
                lineHeight: 1.1,
              }}
            >
              {trained ? "Você já treinou hoje!" : "Ainda não treinou hoje..."}
            </h2>
            <p className="mt-2 text-sm" style={{ color: MUTED }}>
              {trained
                ? `O treino ${todayWorkoutName} foi insano!`
                : "Que tal começar agora? A consistência transforma esforço em resultado!"}
            </p>
          </div>
        </div>

        {!trained && (
          <Link
            to="/treinos"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-extrabold uppercase tracking-[0.05em] transition-all"
            style={{
              background: hover ? ORANGE : "transparent",
              color: hover ? BG : ORANGE,
              border: "1.5px solid " + ORANGE,
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

function SmallMetricCard({
  icon,
  value,
  unit,
  label,
  labelColor,
  compact,
  hoverable = true,
  showDivider = true,
  bg,
}) {
  const [hover, setHover] = useState(false);
  const active = hoverable && hover;
  return (
    <div
      onMouseEnter={() => hoverable && setHover(true)}
      onMouseLeave={() => hoverable && setHover(false)}
      className="h-full rounded-2xl p-5 transition-all"
      style={{
        background:
          bg ||
          "linear-gradient(135deg, rgba(200,60,10,0.16) 0%, rgba(140,35,5,0.06) 30%, #161210 60%, #0e0b09 100%)",
        backgroundClip: "padding-box",
        border: "1px solid " + (active ? "rgba(255,77,28,0.35)" : BORDER),
        boxShadow: active ? "0 8px 24px rgba(0,0,0,0.35)" : "none",
        transform: active ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      <div
        className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl transition-all"
        style={{
          background: active ? ORANGE : FIELD,
          color: active ? BG : ORANGE,
          border: active ? "none" : "1px solid " + BORDER,
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
            fontSize: compact ? "1.4rem" : "2rem",
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        {unit && (
          <span className="text-xs font-semibold" style={{ color: MUTED }}>
            {unit}
          </span>
        )}
      </div>
      {showDivider && (
        <div
          className="my-2"
          style={{
            width: 18,
            height: 2,
            background: labelColor || "rgba(255,77,28,0.22)",
            borderRadius: 2,
          }}
        />
      )}
      <p
        className={
          showDivider
            ? "text-xs font-bold uppercase tracking-[0.12em]"
            : "mt-2 text-xs font-bold uppercase tracking-[0.12em]"
        }
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
      className="group relative flex flex-col items-start justify-between gap-4 overflow-hidden rounded-2xl p-6 transition-all sm:flex-row sm:items-center"
      style={{
        background:
          "linear-gradient(70deg, rgba(200,60,10,0.14) 0%, rgba(140,35,5,0.11) 35%, #161210 65%, #0e0b09 100%)",
        border: "1px solid " + (hover ? "rgba(255,77,28,0.45)" : BORDER),
        backgroundClip: "padding-box",
        boxShadow: hover ? "0 8px 24px rgba(0,0,0,0.35)" : "none",
        minHeight: "150px",
      }}
    >
      <div className="relative z-10 flex items-center gap-6 min-w-0">
        <div
          className="hidden shrink-0 sm:flex h-16 w-16 items-center justify-center rounded-xl"
          style={{
            background: FIELD,
            border: "1px solid " + BORDER,
          }}
        >
          <MuscleIcon group={suggestion.muscleGroup} size={55} />
        </div>

        <div>
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
              {suggestion.muscleGroupLabel}
            </span>
          </div>
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

function BuildWorkoutCard() {
  const [hover, setHover] = useState(false);
  return (
    <Link
      to="/treinos"
      state={{ openCreate: true }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex flex-col gap-5 overflow-hidden rounded-2xl p-7 transition-all md:flex-row md:items-center md:justify-between"
      style={{
        background:
          "linear-gradient(250deg, rgba(200,60,10,0.14) 0%, rgba(140,35,5,0.11) 35%, #161210 65%, #0e0b09 120%)",
        backgroundClip: "padding-box",
        border: "1px solid " + (hover ? "rgba(255,77,28,0.45)" : BORDER),
        boxShadow: hover ? "0 8px 24px rgba(0,0,0,0.35)" : "none",
        transition: "all 0.2s ease",
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all"
          style={{
            background: hover ? ORANGE : FIELD,
            border: hover ? "none" : "1px solid " + BORDER,
          }}
        >
          <ListPlus size={24} color={hover ? BG : ORANGE} strokeWidth={2.5} />
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
          <div
            className="my-2"
            style={{
              width: 22,
              height: 2,
              background: ORANGE,
              borderRadius: 2,
            }}
          />
          <p className="max-w-md text-sm" style={{ color: MUTED }}>
            Escolha os exercícios, defina séries e repetições e crie a rotina
            perfeita para os seus treinos.
          </p>
        </div>
      </div>

      <span
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-extrabold uppercase tracking-[0.05em] transition-all"
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
      <div
        className="my-4"
        style={{ width: 28, height: 2, background: ORANGE, borderRadius: 2 }}
      />
      <p className="max-w-md text-sm" style={{ color: MUTED }}>
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

const WEEKDAY_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

function MiniWeekCalendar({ trainedWeekDays = [] }) {
  const todayIndex = (() => {
    const d = new Date().getDay();
    return d === 0 ? 6 : d - 1;
  })();

  const trainedCount = trainedWeekDays.filter(Boolean).length;

  return (
    <div
      className="flex h-full flex-col justify-center rounded-2xl p-5"
      style={{
        background:
          "linear-gradient(180deg, rgba(200,60,10,0.04) 0%, rgba(140,35,5,0.06) 10%, #161210 30%, #0e0b09 300%)",
        backgroundClip: "padding-box",
        border: "1px solid " + BORDER,
      }}
    >
      <div className="mb-5 flex items-center justify-between">
        <p
          className="text-xs font-bold uppercase tracking-[0.15em]"
          style={{ color: TEXT }}
        >
          Sua semana
        </p>
        <p className="text-xs font-bold" style={{ color: ORANGE }}>
          {trainedCount}/7
        </p>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {WEEKDAY_LABELS.map((label, i) => (
          <span
            key={i}
            className="text-center text-[9px] font-bold uppercase tracking-[0.03em]"
            style={{ color: i === todayIndex ? ORANGE : MUTED }}
          >
            {label}
          </span>
        ))}
      </div>

      <div className="relative mt-2">
        <div
          className="absolute top-1/2 h-px -translate-y-1/2"
          style={{
            left: "calc(100%/14)",
            right: "calc(100%/14)",
            background: BORDER,
          }}
        />

        <div className="relative z-10 grid grid-cols-7 gap-1">
          {WEEKDAY_LABELS.map((label, i) => {
            const trained = trainedWeekDays[i];
            const isToday = i === todayIndex;
            return (
              <div key={i} className="flex items-center justify-center">
                <span
                  className="h-7 w-7 rounded-full transition-all"
                  style={{
                    background: trained
                      ? "linear-gradient(160deg, #ff6b42 0%, " +
                        ORANGE +
                        " 50%)"
                      : "#161210",
                    border: isToday
                      ? "1.5px solid " + ORANGE
                      : "1px solid " + BORDER,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HomeView;

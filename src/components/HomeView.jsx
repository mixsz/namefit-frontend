import { useState } from "react";
import { ORANGE, BG, PANEL, FIELD, BORDER, MUTED, TEXT } from "../theme";
import {
  Dumbbell,
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
    activeWorkout,
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
    onGoToTreinos,
  } = data;

  return (
    <main
      className="min-h-screen w-full"
      style={{
        background:
          "radial-gradient(circle at 50% -10%, #201a15 0%, #0c0a08 60%)",
        fontFamily: "'Barlow', sans-serif",
        backgroundAttachment: "fixed",
        paddingTop: "var(--header-height, 90px)",
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
            <header className="mb-6 sm:mb-10">
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

            <section className="sm:hidden sm:mt-0 mt-8">
              <SectionLabel>Seu dia</SectionLabel>
              <StatusCard
                trained={trained}
                todayWorkoutName={todayWorkoutName}
                onGoToTreinos={onGoToTreinos}
                activeWorkout={activeWorkout}
              />
            </section>

            <section className="mt-7 sm:hidden">
              <SectionLabel>Frequência</SectionLabel>
              <div className="flex flex-col gap-3">
                <StreakCard streak={streak} trained={trainedThisWeek} />
                <MiniWeekCalendar trainedWeekDays={data.trainedWeekDays} />
              </div>
            </section>

            <div className="hidden sm:grid sm:grid-cols-3 sm:gap-4">
              <div className="flex h-full flex-col gap-4 sm:col-span-2">
                <div className="flex-1">
                  <StatusCard
                    trained={trained}
                    todayWorkoutName={todayWorkoutName}
                    onGoToTreinos={onGoToTreinos}
                    activeWorkout={activeWorkout}
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

            <section className="mt-9 sm:mt-8">
              <SectionLabel>Estatísticas</SectionLabel>
              <div className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Link
                  to="/historico"
                  state={{ period: "WEEK" }}
                  className="block h-full"
                >
                  <SmallMetricCard
                    icon={<CalendarCheck size={18} />}
                    value={weekCount}
                    unit="treinos"
                    label="Nesta semana"
                    showDivider={false}
                    bg="radial-gradient(140% 600% at 100% -130%, rgba(255,110,50,0.06) 0%, rgba(180,60,15,0.02) 25%, #161210 50%, #0e0b09 90%)"
                  />
                </Link>
                <Link
                  to={`/historico/${lastWorkout.id}`}
                  className="block h-full min-w-0"
                >
                  <SmallMetricCard
                    icon={<History size={18} />}
                    value={lastWorkout.name || "Nenhum"}
                    label={
                      !lastWorkout.id
                        ? "Último treino"
                        : lastWorkout.daysAgo === 0
                          ? "Último treino · hoje"
                          : `Último treino · há ${lastWorkout.daysAgo} ${
                              lastWorkout.daysAgo === 1 ? "dia" : "dias"
                            }`
                    }
                    compact
                    bg="radial-gradient(140% 600% at 100% 240%, rgba(255,110,50,0.06) 0%, rgba(180,60,15,0.02) 25%, #161210 50%, #0e0b09 90%)"
                  />
                </Link>
              </div>
            </section>

            <section className="mt-9 sm:mt-8">
              <SectionLabel>Sugestão de agora</SectionLabel>
              <SuggestionCard suggestion={suggestion} />
            </section>

            <section className="mt-9 sm:mt-8">
              <SectionLabel>Monte algo novo</SectionLabel>
              <BuildWorkoutCard
                onGoToTreinos={onGoToTreinos}
                activeWorkout={activeWorkout}
              />
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
      className="relative h-full flex flex-col overflow-hidden rounded-2xl p-4 sm:p-5 transition-all"
      style={{
        background: trained
          ? "linear-gradient(310deg, rgba(255,86,28,0.23) 0%, rgba(180,60,15,0.14) 30%, #161210 60%, #0e0b09 100%)"
          : "linear-gradient(310deg, rgba(255,86,28,0.14) 0%, rgba(140,35,5,0.06) 0%, #161210 45%, #0e0b09 10000%)",
        backgroundClip: "padding-box",
        border: "1px solid " + BORDER,
        minHeight: "100%",
      }}
    >
      <div className="flex sm:hidden flex-row items-start gap-4">
        <div className="flex-1 pt-1">
          <h3
            className="font-bold uppercase leading-none"
            style={{
              color: trained ? ORANGE : TEXT,
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "1rem",
              letterSpacing: "0.01em",
            }}
          >
            Ofensiva semanal
          </h3>
          <p className="mt-2 text-xs" style={{ color: MUTED }}>
            {trained
              ? "Você conseguiu essa semana, continue treinando!"
              : "Treine hoje para manter sua sequência viva."}
          </p>
        </div>
        <div className="relative z-10 flex shrink-0 items-center justify-center">
          <div className="relative flex h-24 w-24 items-center justify-center">
            <svg
              width="100%"
              height="100%"
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
            <div className="flex flex-col items-center leading-none">
              <span
                className="font-bold leading-none"
                style={{
                  color: trained ? ORANGE : TEXT,
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: "1.35rem",
                }}
              >
                {streak}
              </span>
              <span
                className="font-semibold leading-none"
                style={{
                  color: trained ? "rgba(255,150,90,0.8)" : MUTED,
                  fontSize: "0.7rem",
                  marginTop: "3px",
                }}
              >
                {streak === 1 ? "semana" : "semanas"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden sm:contents">
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
    </div>
  );
}

function StatusCard({
  trained,
  todayWorkoutName,
  onGoToTreinos,
  activeWorkout,
}) {
  const [hover, setHover] = useState(false);
  const clickable = !trained;
  const blocked = clickable && !!activeWorkout;

  return (
    <div
      onMouseEnter={() => clickable && !blocked && setHover(true)}
      onMouseLeave={() => clickable && !blocked && setHover(false)}
      onClick={() => clickable && onGoToTreinos?.()}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (clickable && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onGoToTreinos?.();
        }
      }}
      className="h-full relative overflow-hidden rounded-2xl p-4 sm:p-6 md:p-7 transition-all"
      style={{
        cursor: clickable ? "pointer" : "default",
        opacity: blocked ? 0.5 : 1,
        background: trained
          ? "radial-gradient(140% 130% at 50% -10%, rgba(255,86,28, 0.09) 0%, rgba(140,35,5,0.05) 30%, #161210 55%, #0e0b09 100%)"
          : "radial-gradient(140% 130% at 50% -10%, rgba(255,86,28," +
            (hover ? "0.07" : "0.0") +
            ") 0%, rgba(140,35,5," +
            (hover ? "0.05" : "0.0") +
            ") 30%, #161210 55%, #0e0b09 100%)",
        backgroundClip: "padding-box",
        border:
          "1.4px solid " +
          (hover && !blocked ? "rgba(255,77,28,0.45)" : BORDER),
        boxShadow: hover && !blocked ? "0 8px 24px rgba(0,0,0,0.35)" : "none",
      }}
    >
      <div className="relative z-10 flex h-full min-w-0 flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          <div
            className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl transition-all"
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
          <div className="min-w-0">
            <h2
              className="font-bold text-[1.1rem] sm:text-[1.7rem]"
              style={{
                color: TEXT,
                fontFamily: "'Barlow Condensed', sans-serif",
                lineHeight: 1.1,
              }}
            >
              {trained ? "Você já treinou hoje!" : "Ainda não treinou hoje..."}
            </h2>
            <p
              className="mt-2 break-words text-xs sm:text-sm"
              style={{ color: MUTED }}
            >
              {trained
                ? `O treino ${todayWorkoutName} foi concluído. Mais um passo na sua evolução!`
                : "Que tal começar agora? A consistência transforma esforço em resultado!"}
            </p>
          </div>
        </div>

        {clickable && (
          <span
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-extrabold uppercase tracking-[0.05em] transition-all"
            style={{
              background: hover ? ORANGE : "transparent",
              color: hover ? BG : ORANGE,
              border: "1.5px solid " + ORANGE,
            }}
          >
            Ir para Treinos
            <ArrowRight size={16} strokeWidth={2.5} />
          </span>
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
        boxShadow: active ? "0 8px 24px rgba(0,0,0,0.12)" : "none",
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
      <div className="-mb-2 -ml-1 flex min-w-0 items-baseline gap-2">
        <span
          className="truncate pb-2 pl-1 font-bold"
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
            width: 21,
            height: 2,
            background: labelColor || "rgba(255,77,28,0.50)",
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
      className="group relative flex flex-col items-start justify-between gap-4 overflow-hidden rounded-2xl p-5 sm:p-6 transition-all sm:flex-row sm:items-center min-h-[120px] sm:min-h-[150px]"
      style={{
        background:
          "linear-gradient(40deg, #0e0b09 0%, #161210 28%, #161210 30%, rgba(240,90,20,0.15) 55%, rgba(160,45,10,0.13) 65%, #161210 80%, #0e0b09 95%)",
        border: "1px solid " + (hover ? "rgba(255,77,28,0.45)" : BORDER),
        backgroundClip: "padding-box",
        boxShadow: hover ? "0 8px 24px rgba(0,0,0,0.35)" : "none",
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
            className="mt-1 sm:mt-2 font-extrabold text-[1.4rem] sm:text-[2rem]"
            style={{
              color: TEXT,
              fontFamily: "'Barlow Condensed', sans-serif",
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
        className="relative z-10 inline-flex w-[70%] sm:w-auto shrink-0 items-center justify-center gap-2 rounded-full px-5 py-2 sm:px-6 sm:py-2.5 text-sm font-extrabold uppercase tracking-[0.05em] transition-all self-center"
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

function BuildWorkoutCard({ onGoToTreinos, activeWorkout }) {
  const [hover, setHover] = useState(false);
  const blocked = !!activeWorkout;

  return (
    <button
      type="button"
      onClick={() => onGoToTreinos?.({ openCreate: true })}
      onMouseEnter={() => !blocked && setHover(true)}
      onMouseLeave={() => !blocked && setHover(false)}
      className="flex w-full flex-col gap-4 sm:gap-5 overflow-hidden rounded-2xl p-5 sm:p-7 text-left transition-all md:flex-row md:items-center md:justify-between"
      style={{
        opacity: blocked ? 0.5 : 1,
        background:
          "linear-gradient(320deg, #0e0b09 0%, #161210 28%, #161210 30%, rgba(240,90,20,0.15) 55%, rgba(160,45,10,0.13) 65%, #161210 80%, #0e0b09 95%)",
        backgroundClip: "padding-box",
        border:
          "1px solid " + (hover && !blocked ? "rgba(255,77,28,0.45)" : BORDER),
        boxShadow: hover && !blocked ? "0 8px 24px rgba(0,0,0,0.35)" : "none",
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
            className="font-bold text-[1.4rem] sm:text-[1.9rem]"
            style={{
              color: TEXT,
              fontFamily: "'Barlow Condensed', sans-serif",
              lineHeight: 1,
            }}
          >
            Monte seu próprio treino
          </h3>
          <div
            className="my-1.5 sm:my-2"
            style={{
              width: 22,
              height: 0.5,
              background: "transparent",
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
        className="inline-flex w-[70%] sm:w-auto shrink-0 items-center justify-center gap-2 self-center rounded-full px-5 py-2 sm:px-6 sm:py-2.5 text-sm font-extrabold uppercase tracking-[0.05em] transition-all"
        style={{
          background: hover ? ORANGE : "transparent",
          color: hover ? BG : ORANGE,
          border: "1.5px solid " + ORANGE,
        }}
      >
        <Plus size={16} strokeWidth={2.5} />
        Criar treino
      </span>
    </button>
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
        background: "linear-gradient(180deg, #161210 0%, #0e0b09 140%)",
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
                  className="h-5 w-5 rounded-full transition-all"
                  style={{
                    background: trained
                      ? "linear-gradient(320deg, #ff6b42 0%, " +
                        ORANGE +
                        " 60%)"
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

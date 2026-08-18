import { useState, useRef, useEffect } from "react";
import { ORANGE, BG, PANEL, FIELD, BORDER, TEXT, MUTED } from "../theme";
import {
  ChevronDown,
  Check,
  ChevronRight,
  History,
  Clock,
  Dumbbell,
  CalendarDays,
} from "lucide-react";
import ConnectionErrorState from "./ConnectionErrorState";
import { useLocation, useNavigate } from "react-router-dom";

const PERIODS = [
  { key: "ALL", label: "Todos" },
  { key: "TODAY", label: "Hoje" },
  { key: "WEEK", label: "Esta semana" },
  { key: "MONTH", label: "Este mês" },
  { key: "6M", label: "6 meses" },
  { key: "1Y", label: "1 ano" },
];

const DELETED_OPTION = "__DELETED__";

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

function formatDate(date) {
  const now = new Date();
  const base = `${date.getDate()} de ${MONTHS[date.getMonth()]}`;
  return date.getFullYear() === now.getFullYear()
    ? base
    : `${base} de ${date.getFullYear()}`;
}

function HistoricoView({ data = {} }) {
  const {
    sessions = [],
    workouts: workoutsList = [],
    loading = false,
    connectionError = false,
    onRetry,
    period = "ALL",
    onPeriodChange,
    workoutId = "ALL",
    onWorkoutIdChange,
    includeDeleted = false,
    onIncludeDeletedChange,
    totalElements = 0,
    hasMore = false,
    onLoadMore,
  } = data;

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.period) {
      onPeriodChange?.(location.state.period);
    }
  }, []);

  const onlyDeleted = workoutId === DELETED_OPTION;
  const hasFilters = period !== "ALL" || workoutId !== "ALL" || includeDeleted;
  const hasAnyHistory = sessions.length > 0 || hasFilters;

  function clearFilters() {
    onPeriodChange?.("ALL");
    onWorkoutIdChange?.("ALL");
    onIncludeDeletedChange?.(false);
  }

  function handleOpenSession(session) {
    navigate(`/historico/${session.id}`);
  }

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
      {loading ? (
        <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
          <div className="flex min-h-[60vh] items-center justify-center">
            <p style={{ color: MUTED }}>Carregando histórico...</p>
          </div>
        </div>
      ) : connectionError ? (
        <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
          <ConnectionErrorState onRetry={onRetry} />
        </div>
      ) : (
        <div className="mx-auto w-full max-w-6xl px-6 pb-24 md:px-10">
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
              Histórico
            </h1>
            <p className="mt-2 text-sm" style={{ color: MUTED }}>
              Acompanhe sua evolução através dos treinos concluídos!
            </p>
          </header>

          {!hasAnyHistory ? (
            <EmptyState onClear={clearFilters} hasFilters={false} />
          ) : (
            <>
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-4">
                <div className="w-full sm:max-w-[190px]">
                  <Dropdown
                    label="Período"
                    icon={<CalendarDays size={15} />}
                    value={period}
                    onChange={(v) => onPeriodChange?.(v)}
                    options={PERIODS.map((p) => ({
                      value: p.key,
                      label: p.label,
                    }))}
                  />
                </div>

                <div className="w-full sm:max-w-[210px]">
                  <Dropdown
                    label="Treino"
                    icon={<Dumbbell size={15} />}
                    value={workoutId}
                    onChange={(v) => onWorkoutIdChange?.(v)}
                    options={[
                      { value: "ALL", label: "Todos os treinos" },
                      ...workoutsList
                        .filter((w) => !w.deleted)
                        .map((w) => ({ value: w.id, label: w.title })),
                      {
                        value: DELETED_OPTION,
                        label: "Treinos excluídos",
                        deletedOption: true,
                      },
                    ]}
                  />
                </div>
              </div>

              <div className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                <p
                  className="text-xs font-bold uppercase tracking-[0.12em]"
                  style={{ color: MUTED }}
                >
                  <span style={{ color: ORANGE }}>{totalElements}</span>{" "}
                  {totalElements === 1
                    ? "sessão encontrada"
                    : "sessões encontradas"}
                </p>

                <div style={{ transform: "translateX(-15px)" }}>
                  <Toggle
                    checked={onlyDeleted ? true : includeDeleted}
                    disabled={onlyDeleted}
                    onChange={(v) => onIncludeDeletedChange?.(v)}
                  />
                </div>
              </div>

              {/* Lista */}
              {sessions.length === 0 ? (
                <EmptyState onClear={clearFilters} hasFilters={hasFilters} />
              ) : (
                <>
                  <ul className="flex flex-col gap-3">
                    {sessions.map((session) => (
                      <li key={session.id}>
                        <SessionRow
                          session={session}
                          onClick={() => handleOpenSession(session)}
                        />
                      </li>
                    ))}
                  </ul>

                  {hasMore && (
                    <div className="mt-8 flex justify-center">
                      <button
                        type="button"
                        onClick={onLoadMore}
                        className="rounded-full px-6 py-3 text-sm font-bold uppercase tracking-[0.05em] transition-all"
                        style={{
                          background: "transparent",
                          color: MUTED,
                          border: "1.5px solid " + BORDER,
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.color = ORANGE;
                          e.currentTarget.style.borderColor = ORANGE;
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.color = MUTED;
                          e.currentTarget.style.borderColor = BORDER;
                        }}
                      >
                        Carregar mais
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </main>
  );
}

function SessionRow({ session, onClick }) {
  const [hover, setHover] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      className="relative flex w-full items-center gap-4 overflow-hidden rounded-2xl px-5 py-4 text-left transition-all"
      style={{
        background:
          "radial-gradient(120% 140% at 100% 50%, rgba(200,90,40,0.20) 0%, rgba(140,60,30,0.10) 35%, #17130f 65%, #0e0b09 100%)",
        backgroundClip: "padding-box",
        border:
          "1.5px solid " +
          (hover ? "rgba(255,77,28,0.45)" : "rgba(255,255,255,0.04)"),
      }}
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
        style={{
          background: "rgba(255,77,28,0.12)",
          border: "1.5px solid rgba(255,77,28,0.25)",
        }}
      >
        <Dumbbell size={20} color={ORANGE} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className="truncate text-lg font-bold leading-tight"
            style={{
              color: TEXT,
              fontFamily: "'Barlow Condensed', sans-serif",
              letterSpacing: "0.01em",
            }}
          >
            {session.title}
          </h3>
          {session.deleted && (
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] ml-3"
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
          className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs"
          style={{ color: MUTED }}
        >
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={13} />
            {formatDate(session.date)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check size={13} />
            {session.done} de {session.planned} exercícios
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={13} />
            {session.minutes != null ? `${session.minutes}min` : "—"}
          </span>
        </div>
      </div>

      <ChevronRight size={20} color={hover ? ORANGE : MUTED} />
    </button>
  );
}

function Toggle({ checked, disabled, onChange }) {
  return (
    <div
      className="inline-flex items-center gap-2.5 text-sm"
      style={{ opacity: disabled ? 0.45 : 1 }}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className="relative inline-flex shrink-0 rounded-full outline-none transition-all disabled:cursor-not-allowed"
        style={{
          width: 38,
          height: 21,
          background: checked ? "rgba(255,77,28,0.16)" : FIELD,
          border: "1px solid " + (checked ? "transparent" : BORDER),
          boxShadow: "none",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <span
          className="absolute top-1/2 rounded-full transition-all"
          style={{
            width: 15,
            height: 15,
            background: checked ? ORANGE : MUTED,
            left: checked ? 19 : 3,
            transform: "translateY(-50%)",
          }}
        />
      </button>
      <span style={{ color: checked ? "#e2764a" : MUTED, fontWeight: 600 }}>
        Incluir treinos excluídos
      </span>
    </div>
  );
}

function EmptyState({ onClear, hasFilters }) {
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
        Nenhuma sessão encontrada
      </h2>
      <p className="mt-2 max-w-sm text-sm" style={{ color: MUTED }}>
        {hasFilters
          ? "Nenhum treino concluído foi encontrado com os filtros selecionados."
          : "Assim que você concluir um treino, ele aparece aqui."}
      </p>
      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-6 rounded-full px-6 py-3 text-sm font-extrabold uppercase tracking-[0.05em] transition-all"
          style={{
            background: ORANGE,
            color: BG,
            boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
          }}
        >
          Limpar filtros
        </button>
      )}
    </div>
  );
}

function Dropdown({ label, value, onChange, options, placeholder, icon }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function handleEsc(e) {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc, true);
    };
  }, [open]);

  return (
    <div className="flex flex-col gap-2" ref={ref}>
      <span
        className="pl-1 text-xs font-bold uppercase tracking-[0.15em]"
        style={{ color: MUTED }}
      >
        {label}
      </span>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-2 rounded-2xl px-3.5 py-2.5 text-left text-sm outline-none transition-all"
          style={{
            background: "#141210",
            border: "1.5px solid " + (open ? ORANGE : BORDER),
            color: selected ? TEXT : MUTED,
          }}
        >
          <span className="flex min-w-0 items-center gap-2 truncate">
            {icon && (
              <span style={{ color: ORANGE, display: "flex" }}>{icon}</span>
            )}
            <span className="truncate">
              {selected ? selected.label : placeholder || "Selecione"}
            </span>
          </span>
          <ChevronDown
            size={16}
            color={open ? ORANGE : MUTED}
            style={{
              transition: "transform 0.18s ease",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>

        {open && (
          <div
            className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-2xl"
            style={{
              background: "linear-gradient(180deg, #17130f 0%, #141210 100%)",
              border: "1.5px solid " + BORDER,
              boxShadow: "0 16px 40px rgba(0,0,0,0.55)",
            }}
          >
            <ul
              role="listbox"
              className="nf-scroll max-h-52 overflow-y-auto py-1.5"
            >
              {options.map((opt) => {
                const isSelected = opt.value === value;
                const textColor = isSelected
                  ? ORANGE
                  : opt.deletedOption
                    ? "#c98a76"
                    : TEXT;
                return (
                  <li
                    key={String(opt.value)}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <button
                      type="button"
                      data-selected={isSelected}
                      onClick={() => {
                        onChange(opt.value);
                        setOpen(false);
                      }}
                      className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors"
                      style={{
                        color: textColor,
                        background: isSelected
                          ? "rgba(255,77,28,0.12)"
                          : "transparent",
                        fontWeight: isSelected ? 700 : 500,
                      }}
                      onMouseOver={(e) => {
                        if (!isSelected)
                          e.currentTarget.style.background =
                            "rgba(255,255,255,0.05)";
                      }}
                      onMouseOut={(e) => {
                        if (!isSelected)
                          e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <span className="truncate">{opt.label}</span>
                      {isSelected && (
                        <Check size={16} color={ORANGE} strokeWidth={2.6} />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoricoView;

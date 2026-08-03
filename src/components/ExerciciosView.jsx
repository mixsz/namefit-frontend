import { useState, useMemo, useEffect, useRef } from "react";
import { ORANGE, BG, PANEL, FIELD, BORDER, TEXT, MUTED } from "../theme";
import {
  Search,
  X,
  Plus,
  Dumbbell,
  SlidersHorizontal,
  ChevronDown,
  Check,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import MuscleIcon from "./MuscleIcon";

const CATEGORIES = [
  { key: "PEITO", label: "Peito", icon: "CHEST", groups: ["CHEST"] },
  {
    key: "COSTAS",
    label: "Costas",
    icon: "LATS",
    groups: ["LATS", "MIDDLE_BACK", "LOWER_BACK", "TRAPS"],
  },
  { key: "OMBROS", label: "Ombros", icon: "SHOULDERS", groups: ["SHOULDERS"] },
  { key: "BICEPS", label: "Bíceps", icon: "BICEPS", groups: ["BICEPS"] },
  { key: "TRICEPS", label: "Tríceps", icon: "TRICEPS", groups: ["TRICEPS"] },
  {
    key: "ANTEBRACO",
    label: "Antebraço",
    icon: "FOREARMS",
    groups: ["FOREARMS"],
  },
  {
    key: "ABDOMEN",
    label: "Abdômen",
    icon: "ABDOMINALS",
    groups: ["ABDOMINALS"],
  },
  {
    key: "PERNAS",
    label: "Pernas",
    icon: "QUADRICEPS",
    groups: [
      "QUADRICEPS",
      "HAMSTRINGS",
      "GLUTES",
      "ABDUCTORS",
      "ADDUCTORS",
      "CALVES",
    ],
  },
  { key: "PESCOCO", label: "Pescoço", icon: "NECK", groups: ["NECK"] },
];

function normalize(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function matchesQuery(exercise, query) {
  if (!query) return true;
  const q = normalize(query);
  return (
    normalize(exercise.name).includes(q) ||
    normalize(exercise.muscleGroupLabel).includes(q)
  );
}

function ExerciciosView({ data, onAddToWorkout }) {
  const { exercises = [], workouts = [], loading } = data;
  const location = useLocation();
  const navigate = useNavigate();

  const [query, setQuery] = useState(location.state?.searchQuery ?? "");
  const [activeCategory, setActiveCategory] = useState(null);
  const [modalExercise, setModalExercise] = useState(null);

  useEffect(() => {
    if (location.state?.searchQuery) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, []);

  const category = CATEGORIES.find((c) => c.key === activeCategory);
  const activeGroups = category ? category.groups : null;

  const filtered = useMemo(() => {
    return exercises.filter((ex) => {
      const byCategory = activeGroups
        ? activeGroups.includes(ex.muscleGroup)
        : true;
      return byCategory && matchesQuery(ex, query);
    });
  }, [exercises, activeGroups, query]);

  const hasFilters = Boolean(query) || Boolean(activeCategory);

  function clearFilters() {
    setQuery("");
    setActiveCategory(null);
  }

  return (
    <main
      className="flex w-full flex-col overflow-hidden"
      style={{
        height: "100vh",
        background:
          "radial-gradient(circle at 50% -10%, #201a15 0%, #0c0a08 60%)",
        fontFamily: "'Barlow', sans-serif",
        paddingTop: "90px",
      }}
    >
      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <p style={{ color: MUTED }}>Carregando exercícios...</p>
        </div>
      ) : (
        <>
          <div className="mx-auto w-full max-w-6xl shrink-0 px-6 md:px-10">
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
                Exercícios
              </h1>
              <p className="mt-2 text-sm" style={{ color: MUTED }}>
                Explore o catálogo, filtre por grupo muscular e adicione o que
                quiser aos seus treinos.
              </p>
            </header>

            <SearchField value={query} onChange={setQuery} />

            <CategoryChips
              active={activeCategory}
              onToggle={(key) =>
                setActiveCategory((prev) => (prev === key ? null : key))
              }
            />

            <ResultsCount count={filtered.length} />
          </div>

          <div className="mx-auto flex w-full max-w-6xl min-h-0 flex-1 flex-col px-6 pb-6 md:px-10">
            <div className="nf-scroll min-h-0 flex-1 overflow-y-auto pb-8 pt-1">
              {filtered.length === 0 ? (
                <NoResults hasFilters={hasFilters} onClear={clearFilters} />
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((exercise) => (
                    <ExerciseCard
                      key={exercise.id}
                      exercise={exercise}
                      onAdd={() => setModalExercise(exercise)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {modalExercise && (
            <AddToWorkoutModal
              exercise={modalExercise}
              workouts={workouts}
              onClose={() => setModalExercise(null)}
              onAddToWorkout={onAddToWorkout}
            />
          )}
        </>
      )}
    </main>
  );
}

function SearchField({ value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all"
      style={{
        background: FIELD,
        border: "1.5px solid " + (focused ? ORANGE : BORDER),
      }}
    >
      <Search size={18} color={focused ? ORANGE : MUTED} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Buscar por exercício ou grupo muscular..."
        className="w-full bg-transparent text-sm outline-none"
        style={{ color: TEXT }}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Limpar busca"
          className="rounded-md p-1 opacity-50 transition-opacity hover:opacity-90"
          style={{ color: MUTED }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

function CategoryChips({ active, onToggle }) {
  return (
    <div className="mt-5 flex flex-wrap gap-2.5">
      {CATEGORIES.map((cat) => {
        const isActive = active === cat.key;
        return (
          <button
            key={cat.key}
            type="button"
            onClick={() => onToggle(cat.key)}
            aria-pressed={isActive}
            className="inline-flex items-center gap-2 rounded-full py-2 pl-2 pr-4 text-sm transition-all"
            style={{
              background: isActive ? "rgba(255,77,28,0.14)" : PANEL,
              border: "1.5px solid " + (isActive ? ORANGE : BORDER),
              color: isActive ? ORANGE : "#c9c4bf",
              fontWeight: isActive ? 700 : 550,
            }}
            onMouseOver={(e) => {
              if (!isActive)
                e.currentTarget.style.borderColor = "rgba(255,77,28,0.4)";
            }}
            onMouseOut={(e) => {
              if (!isActive) e.currentTarget.style.borderColor = BORDER;
            }}
          >
            <MuscleIcon group={cat.icon} size={26} />
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}

function ResultsCount({ count }) {
  return (
    <p
      className="mb-4 mt-6 text-xs font-bold uppercase tracking-[0.12em]"
      style={{ color: MUTED }}
    >
      <span style={{ color: ORANGE }}>{count}</span>{" "}
      {count === 1 ? "exercício encontrado" : "exercícios encontrados"}
    </p>
  );
}

function ExerciseCard({ exercise, onAdd }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex h-full flex-col justify-between rounded-2xl p-5 transition-all"
      style={{
        background: PANEL,
        border: "1px solid " + (hover ? "rgba(255,77,28,0.35)" : BORDER),
        boxShadow: hover ? "0 8px 24px rgba(0,0,0,0.35)" : "none",
      }}
    >
      <div className="flex items-center gap-4">
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
          style={{ background: FIELD }}
        >
          <MuscleIcon group={exercise.muscleGroup} size={44} />
        </span>
        <div className="min-w-0">
          <h3
            className="truncate font-bold"
            style={{
              color: TEXT,
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "1.4rem",
              lineHeight: 1.1,
            }}
          >
            {exercise.name}
          </h3>
          <span
            className="mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-[0.05em]"
            style={{
              background: "transparent",
              color: "#e8956a",
              border: "1px solid rgba(255,77,28,0.2)",
            }}
          >
            {exercise.muscleGroupLabel}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold uppercase tracking-[0.03em] transition-all"
        style={{
          background: hover ? ORANGE : "transparent",
          color: hover ? BG : ORANGE,
          border: "1.5px solid " + ORANGE,
        }}
      >
        <Plus size={16} strokeWidth={2.5} />
        Adicionar ao treino
      </button>
    </div>
  );
}

function NoResults({ hasFilters, onClear }) {
  return (
    <div
      className="mt-2 flex flex-col items-center justify-center rounded-2xl py-16 text-center"
      style={{ background: PANEL, border: "1px solid " + BORDER }}
    >
      <div
        className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{ background: FIELD, border: "1px solid " + BORDER }}
      >
        <SlidersHorizontal size={28} color={ORANGE} strokeWidth={2.2} />
      </div>
      <h2
        className="font-extrabold"
        style={{
          color: TEXT,
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
          lineHeight: 1,
        }}
      >
        NENHUM EXERCÍCIO ENCONTRADO
      </h2>
      <p className="mt-3 max-w-sm text-sm" style={{ color: MUTED }}>
        Tente ajustar a busca ou remover os filtros de categoria para ver mais
        opções.
      </p>
      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-6 text-sm font-bold uppercase tracking-[0.08em] transition-colors"
          style={{ color: ORANGE }}
        >
          Limpar filtros
        </button>
      )}
    </div>
  );
}

function AddToWorkoutModal({ exercise, workouts, onClose, onAddToWorkout }) {
  const hasWorkouts = workouts.length > 0;

  const [workoutId, setWorkoutId] = useState(() => {
    const firstAvailable = workouts.find(
      (w) => !w.exerciseIds?.includes(exercise.id),
    );
    return firstAvailable?.id ?? "";
  });
  const [sets, setSets] = useState(4);
  const [reps, setReps] = useState(12);

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    await onAddToWorkout({ workoutId, exerciseId: exercise.id, sets, reps });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={"Adicionar " + exercise.name + " ao treino"}
        className="w-full max-w-md rounded-2xl p-6"
        style={{
          background: "linear-gradient(180deg, #141210 0%, #17130f 100%)",
          border: "1px solid " + BORDER,
          boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
        }}
      >
        <div className="mb-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{ background: FIELD }}
            >
              <MuscleIcon group={exercise.muscleGroup} size={34} />
            </span>
            <div>
              <h2
                className="font-bold"
                style={{
                  color: TEXT,
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: "1.5rem",
                  lineHeight: 1,
                }}
              >
                {exercise.name}
              </h2>
              <span className="text-xs font-semibold" style={{ color: ORANGE }}>
                {exercise.muscleGroupLabel}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-lg p-1.5 transition-colors"
            style={{ color: MUTED }}
            onMouseOver={(e) => (e.currentTarget.style.color = TEXT)}
            onMouseOut={(e) => (e.currentTarget.style.color = MUTED)}
          >
            <X size={20} />
          </button>
        </div>

        {!hasWorkouts ? (
          <EmptyWorkouts onClose={onClose} />
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Dropdown
              label="Treino"
              value={workoutId}
              onChange={setWorkoutId}
              placeholder="Selecione um treino"
              options={workouts.map((w) => ({
                value: w.id,
                label: w.title,
                disabled: w.exerciseIds?.includes(exercise.id),
                hint: w.exerciseIds?.includes(exercise.id)
                  ? "já adicionado"
                  : null,
              }))}
            />

            <div className="grid grid-cols-2 gap-4">
              <Dropdown
                label="Séries"
                value={sets}
                onChange={setSets}
                options={range(1, 8).map((n) => ({
                  value: n,
                  label: String(n),
                }))}
              />
              <Dropdown
                label="Repetições"
                value={reps}
                onChange={setReps}
                options={range(1, 30).map((n) => ({
                  value: n,
                  label: String(n),
                }))}
              />
            </div>

            <div className="mt-1 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full px-5 py-3 text-sm font-bold uppercase tracking-[0.05em] transition-all"
                style={{
                  background: "transparent",
                  color: MUTED,
                  border: "1.5px solid " + BORDER,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = TEXT;
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = MUTED;
                  e.currentTarget.style.borderColor = BORDER;
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!workoutId}
                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-extrabold uppercase tracking-[0.05em] transition-all disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  background: ORANGE,
                  color: BG,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
                }}
              >
                Adicionar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function range(min, max) {
  return Array.from({ length: max - min + 1 }, (_, i) => min + i);
}

function Dropdown({ label, value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const listRef = useRef(null);

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

  useEffect(() => {
    if (open && listRef.current) {
      const list = listRef.current;
      const active = list.querySelector("[data-selected='true']");
      if (active) {
        list.scrollTop =
          active.offsetTop - list.clientHeight / 2 + active.clientHeight / 2;
      }
    }
  }, [open]);

  return (
    <div className="flex flex-col gap-2" ref={ref}>
      <span
        className="text-xs font-bold uppercase tracking-[0.15em]"
        style={{ color: "#a09890" }}
      >
        {label}
      </span>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-sm outline-none transition-all"
          style={{
            background: FIELD,
            border: "1.5px solid " + (open ? ORANGE : BORDER),
            color: selected ? TEXT : MUTED,
          }}
        >
          <span className="truncate">
            {selected ? selected.label : placeholder || "Selecione"}
          </span>
          <ChevronDown
            size={18}
            color={open ? ORANGE : MUTED}
            style={{
              transition: "transform 0.18s ease",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>

        {open && (
          <div
            className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-xl"
            style={{
              background: "#1b1712",
              border: "1.5px solid " + BORDER,
              boxShadow: "0 16px 40px rgba(0,0,0,0.55)",
            }}
          >
            <ul
              ref={listRef}
              role="listbox"
              className="nf-scroll max-h-52 overflow-y-auto py-1.5 pr-2"
            >
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <li
                    key={String(opt.value)}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <button
                      type="button"
                      data-selected={isSelected}
                      disabled={opt.disabled}
                      onClick={() => {
                        if (opt.disabled) return;
                        onChange(opt.value);
                        setOpen(false);
                      }}
                      className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors disabled:cursor-not-allowed"
                      style={{
                        color: opt.disabled
                          ? "#6b645d"
                          : isSelected
                            ? ORANGE
                            : TEXT,
                        background: isSelected
                          ? "rgba(255,77,28,0.12)"
                          : "transparent",
                        fontWeight: isSelected ? 700 : 500,
                      }}
                      onMouseOver={(e) => {
                        if (!opt.disabled && !isSelected)
                          e.currentTarget.style.background =
                            "rgba(255,255,255,0.05)";
                      }}
                      onMouseOut={(e) => {
                        if (!isSelected)
                          e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <span className="flex items-center gap-2 truncate">
                        {opt.label}
                        {opt.hint && (
                          <span
                            className="text-xs font-semibold"
                            style={{ color: "#6b645d" }}
                          >
                            ({opt.hint})
                          </span>
                        )}
                      </span>
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

function EmptyWorkouts({ onClose }) {
  return (
    <div className="flex flex-col items-center py-4 text-center">
      <div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{ background: FIELD, border: "1px solid " + BORDER }}
      >
        <Dumbbell size={26} color={ORANGE} strokeWidth={2.2} />
      </div>
      <p className="text-sm" style={{ color: TEXT, fontWeight: 600 }}>
        Você ainda não tem treinos criados.
      </p>
      <p className="mt-1.5 max-w-xs text-sm" style={{ color: MUTED }}>
        Crie um treino para poder adicionar exercícios a ele.
      </p>
      <Link
        to="/treinos"
        state={{ openCreate: true }}
        onClick={onClose}
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-[0.08em] transition-colors"
        style={{ color: ORANGE }}
      >
        Criar meu primeiro treino →
      </Link>
    </div>
  );
}

export default ExerciciosView;

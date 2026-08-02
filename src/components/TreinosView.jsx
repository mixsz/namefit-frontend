import { useState, useRef, useEffect, useMemo } from "react";
import { ORANGE, BG, PANEL, FIELD, BORDER, TEXT, MUTED } from "../theme.js";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Dumbbell,
  Plus,
  Search,
  MoreVertical,
  Play,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";

function TreinosView({ data }) {
  const {
    workouts = [],
    onCreate,
    onStart,
    onDelete,
    onReorder,
    loading,
  } = data;
  const location = useLocation();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const ordered = useMemo(
    () => [...workouts].sort((a, b) => a.position - b.position),
    [workouts],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ordered;
    return ordered.filter((w) => w.title.toLowerCase().includes(q));
  }, [ordered, query]);

  useEffect(() => {
    if (location.state?.openCreate) {
      setModalOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, []);

  const isEmpty = !loading && workouts.length === 0;

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
            <p style={{ color: MUTED }}>Carregando treinos...</p>
          </div>
        ) : isEmpty ? (
          <EmptyState onCreate={() => setModalOpen(true)} />
        ) : (
          <>
            <header className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <h1
                  className="font-bold leading-[0.95]"
                  style={{
                    color: TEXT,
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Seus treinos
                </h1>
                <p className="mt-2 text-sm" style={{ color: MUTED }}>
                  Você tem{" "}
                  <span style={{ color: ORANGE, fontWeight: 500 }}>
                    {workouts.length}
                  </span>{" "}
                  {workouts.length === 1 ? "treino" : "treinos"} montados.
                  Organize a ordem e comece quando quiser.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-extrabold uppercase tracking-[0.05em] transition-all"
                style={{
                  background: ORANGE,
                  color: BG,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#ff6b42";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.4)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = ORANGE;
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(0,0,0,0.35)";
                }}
              >
                <Plus size={16} strokeWidth={2.5} />
                Criar treino
              </button>
            </header>

            <SearchField value={query} onChange={setQuery} />

            {filtered.length === 0 ? (
              <NoResults query={query} onClear={() => setQuery("")} />
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((workout, index) => (
                  <WorkoutCard
                    key={index}
                    workout={workout}
                    isFirst={index === 0}
                    isLast={index === filtered.length - 1}
                    onStart={onStart}
                    onRequestDelete={setDeleteTarget}
                    onReorder={onReorder}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {modalOpen && (
        <CreateWorkoutModal
          onClose={() => setModalOpen(false)}
          onCreate={(title) => {
            onCreate?.(title);
            setModalOpen(false);
          }}
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          workout={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            onDelete?.(deleteTarget.id);
            setDeleteTarget(null);
          }}
        />
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
        placeholder="Buscar treino pelo nome..."
        className="w-full bg-transparent text-sm outline-none"
        style={{ color: TEXT }}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Limpar busca"
          className="p-1 rounded-md transition-opacity opacity-50 hover:opacity-90"
          style={{ color: MUTED }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

function WorkoutCard({
  workout,
  isFirst,
  isLast,
  onStart,
  onRequestDelete,
  onReorder,
}) {
  const [hover, setHover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    function handleEsc(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative flex h-full flex-col justify-between rounded-2xl p-5 transition-all"
      style={{
        background: PANEL,
        border:
          "1px solid " + (hover || menuOpen ? "rgba(255,77,28,0.35)" : BORDER),
        boxShadow: hover ? "0 8px 24px rgba(0,0,0,0.35)" : "none",
      }}
    >
      <div className="flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl transition-all"
          style={{
            background: hover ? ORANGE : FIELD,
            color: hover ? BG : ORANGE,
          }}
        >
          <Dumbbell size={22} strokeWidth={2.4} />
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label={"Ações do treino " + workout.title}
            className="flex h-9 w-9 items-center justify-center rounded-lg transition-all"
            style={{
              background: menuOpen ? FIELD : "transparent",
              color: menuOpen ? ORANGE : MUTED,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = ORANGE;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = menuOpen ? ORANGE : MUTED;
            }}
          >
            <MoreVertical size={18} />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl py-2"
              style={{
                background: "linear-gradient(0deg, #141210 90%, #17130f 100%)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid " + BORDER,
                boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
              }}
            >
              <DropdownItem
                icon={<Play size={16} />}
                label="Iniciar"
                onClick={() => {
                  setMenuOpen(false);
                  onStart?.(workout.id);
                }}
              />
              <Link
                to={`/treinos/${workout.id}`}
                state={{ isEditing: true }}
                onClick={() => setMenuOpen(false)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-normal transition-colors"
                style={{ color: TEXT, background: "transparent" }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = FIELD;
                  e.currentTarget.style.color = ORANGE;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = TEXT;
                }}
              >
                <Pencil size={16} />
                Editar
              </Link>

              <DropdownItem
                icon={<Trash2 size={16} />}
                label="Excluir"
                danger
                onClick={() => {
                  setMenuOpen(false);
                  onRequestDelete?.(workout);
                }}
              />
            </div>
          )}
        </div>
      </div>
      <Link to={`/treinos/${workout.id}`} className="mt-5 block">
        <h3
          className="font-bold"
          style={{
            color: TEXT,
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "1.7rem",
            lineHeight: 1.05,
          }}
        >
          {workout.title}
        </h3>
      </Link>

      <div
        className="mt-5 flex items-center justify-between pt-4"
        style={{ borderTop: "1px solid " + BORDER }}
      >
        <div className="flex items-center gap-2">
          <ReorderButton
            direction="up"
            disabled={isFirst}
            onClick={() => onReorder?.(workout.id, "up")}
          />
          <ReorderButton
            direction="down"
            disabled={isLast}
            onClick={() => onReorder?.(workout.id, "down")}
          />
        </div>

        <Link
          to={`/treinos/${workout.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[0.08em] transition-colors"
          style={{ color: hover ? ORANGE : MUTED }}
        >
          Abrir
          <ArrowRight size={14} strokeWidth={2.5} />
        </Link>
      </div>
    </div>
  );
}

function ReorderButton({ direction, disabled, onClick }) {
  const Icon = direction === "up" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "up" ? "Mover para tras" : "Mover para frente"}
      className={
        "flex h-8 w-8 items-center justify-center rounded-lg transition-all " +
        (disabled
          ? "cursor-not-allowed opacity-50 text-[#6b6460]"
          : "cursor-pointer text-[#6b6460] hover:text-[#FF4D1C]")
      }
      style={{ background: FIELD }}
    >
      <Icon size={16} strokeWidth={2.5} />
    </button>
  );
}

function DropdownItem({ icon, label, danger, onClick }) {
  const baseColor = danger ? "#ef4444" : TEXT;
  const hoverBg = danger ? "rgba(239,68,68,0.1)" : FIELD;
  const hoverColor = danger ? "#ef4444" : ORANGE;

  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-normal transition-colors"
      style={{ color: baseColor, background: "transparent" }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = hoverBg;
        e.currentTarget.style.color = hoverColor;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = baseColor;
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function NoResults({ query, onClear }) {
  return (
    <div
      className="mt-10 flex flex-col items-center justify-center rounded-2xl py-16 text-center"
      style={{ background: PANEL, border: "1px solid " + BORDER }}
    >
      <Search size={30} color={MUTED} />
      <p className="mt-4 text-sm" style={{ color: MUTED }}>
        Nenhum treino encontrado para{" "}
        <span style={{ color: TEXT, fontWeight: 700 }}>{`"${query}"`}</span>.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-4 text-sm font-bold uppercase tracking-[0.08em] transition-colors"
        style={{ color: ORANGE }}
      >
        Limpar busca
      </button>
    </div>
  );
}

function EmptyState({ onCreate }) {
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
        VOCÊ AINDA NÃO TEM TREINOS
      </h1>
      <p className="mt-3 max-w-md text-sm" style={{ color: MUTED }}>
        Crie seu primeiro treino, escolha os exercícios e comece a acompanhar
        cada evolução por aqui.
      </p>
      <button
        type="button"
        onClick={onCreate}
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
        <Plus size={16} strokeWidth={2.5} />
        Criar meu primeiro treino
      </button>
    </div>
  );
}

function CreateWorkoutModal({ onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    function handleEsc(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onCreate(trimmed);
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
        aria-label="Criar novo treino"
        className="w-full max-w-md overflow-hidden rounded-2xl p-6"
        style={{
          background: "linear-gradient(180deg, #141210 0%, #17130f 100%)",
          border: "1px solid " + BORDER,
          boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
        }}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: ORANGE }}
            >
              <Plus size={20} color={BG} strokeWidth={2.5} />
            </div>
            <h2
              className="font-bold"
              style={{
                color: TEXT,
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "1.6rem",
                lineHeight: 1,
              }}
            >
              Novo treino
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: MUTED }}
            onMouseOver={(e) => (e.currentTarget.style.color = TEXT)}
            onMouseOut={(e) => (e.currentTarget.style.color = MUTED)}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="workout-name"
              className="text-xs font-bold uppercase tracking-[0.15em]"
              style={{ color: "#a09890" }}
            >
              Nome do treino
            </label>
            <input
              id="workout-name"
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Ex: Peito e Tríceps"
              className="w-full rounded-xl px-5 py-4 text-sm outline-none transition-all"
              style={{
                background: FIELD,
                border: "1.5px solid " + (focused ? ORANGE : BORDER),
                color: TEXT,
              }}
            />
          </div>

          <div className="flex items-center justify-end gap-3">
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
              disabled={!title.trim()}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-extrabold uppercase tracking-[0.05em] transition-all"
              style={{
                background: title.trim() ? ORANGE : "#3a2a22",
                color: title.trim() ? BG : "#7a6a60",
                cursor: title.trim() ? "pointer" : "not-allowed",
                boxShadow: title.trim() ? "0 2px 8px rgba(0,0,0,0.35)" : "none",
              }}
              onMouseOver={(e) => {
                if (title.trim()) e.currentTarget.style.background = "#ff6b42";
              }}
              onMouseOut={(e) => {
                if (title.trim()) e.currentTarget.style.background = ORANGE;
              }}
            >
              <Plus size={16} strokeWidth={2.5} />
              Criar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmDeleteModal({ workout, onClose, onConfirm }) {
  const cancelRef = useRef(null);

  useEffect(() => {
    cancelRef.current?.focus();
    function handleEsc(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-desc"
        className="w-full max-w-md overflow-hidden rounded-2xl p-6"
        style={{
          background: PANEL,
          border: "1px solid " + BORDER,
          boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
        }}
      >
        <div className="flex flex-col items-center text-center">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{
              background: "rgba(185,28,28,0.12)",
              color: "#dc2626",
            }}
          >
            <AlertTriangle size={20} strokeWidth={2.4} />
          </div>

          <h2
            id="confirm-delete-title"
            className="mt-3 font-bold"
            style={{
              color: TEXT,
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "1.7rem",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            Excluir treino
          </h2>

          <p
            id="confirm-delete-desc"
            className="mt-3 max-w-xs text-center text-sm leading-relaxed"
            style={{
              color: "#a39d97",
            }}
          >
            Deseja realmente excluir o treino{" "}
            <span
              style={{
                color: ORANGE,
              }}
            >
              {workout.title}
            </span>
            ?
            <br />
            <span style={{ color: "#a39d97" }}>
              Essa ação não pode ser desfeita.
            </span>
          </p>
        </div>

        <div className="mt-5 flex justify-center gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onClose}
            className="w-32 rounded-full px-4 py-2.5 text-sm font-bold uppercase tracking-[0.05em] transition-all"
            style={{
              background: "#171412",
              color: MUTED,
              border: "1.5px solid rgba(255,255,255,0.12)",
              boxShadow: "0 2px 5px rgba(0,0,0,0.25)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = TEXT;
              e.currentTarget.style.background = "#211d19";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = MUTED;
              e.currentTarget.style.background = "#171412";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
            }}
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex w-32 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-extrabold uppercase tracking-[0.05em] transition-all"
            style={{
              background: "#a61b1b",
              color: "#fff",
              boxShadow: "0 3px 7px rgba(0,0,0,0.1)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#8f1717";
              e.currentTarget.style.boxShadow = "0 4px 9px rgba(0,0,0,0.25)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#a61b1b";
              e.currentTarget.style.boxShadow = "0 3px 7px rgba(0,0,0,0.18)";
            }}
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

export default TreinosView;

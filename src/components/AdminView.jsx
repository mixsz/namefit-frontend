import { useState, useEffect, useRef } from "react";
import { ORANGE, BG, PANEL, FIELD, BORDER, TEXT, MUTED } from "../theme";
import {
  Search,
  X,
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertTriangle,
} from "lucide-react";
import { CATEGORIES } from "../constants/exerciseCategories.js";
import ConnectionErrorState from "./ConnectionErrorState";

const MUSCLE_GROUPS = [
  { value: "ABDOMINALS", label: "Abdominal" },
  { value: "ABDUCTORS", label: "Abdutores" },
  { value: "ADDUCTORS", label: "Adutores" },
  { value: "BICEPS", label: "Bíceps" },
  { value: "CALVES", label: "Panturrilha" },
  { value: "CHEST", label: "Peito" },
  { value: "FOREARMS", label: "Antebraço" },
  { value: "GLUTES", label: "Glúteos" },
  { value: "HAMSTRINGS", label: "Posterior de coxa" },
  { value: "LATS", label: "Latíssimo" },
  { value: "LOWER_BACK", label: "Lombar" },
  { value: "MIDDLE_BACK", label: "Dorsal médio" },
  { value: "NECK", label: "Pescoço" },
  { value: "QUADRICEPS", label: "Quadríceps" },
  { value: "TRAPS", label: "Trapézio" },
  { value: "TRICEPS", label: "Tríceps" },
  { value: "SHOULDERS", label: "Ombros" },
];

function muscleLabel(value) {
  return MUSCLE_GROUPS.find((m) => m.value === value)?.label ?? value;
}

function AdminView({ data }) {
  const {
    exercises = [],
    loading,
    connectionError,
    onRetry,
    query = "",
    onQueryChange,
    category,
    onCategoryChange,
    page = 0,
    totalPages = 1,
    totalElements = 0,
    onPageChange,
    onCreate,
    onUpdate,
    onDelete,
  } = data;

  const [formOpen, setFormOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  function openCreate() {
    setEditingExercise(null);
    setFormOpen(true);
  }

  function openEdit(exercise) {
    setEditingExercise(exercise);
    setFormOpen(true);
  }

  async function handleFormSubmit(formData) {
    if (editingExercise) {
      await onUpdate(editingExercise.id, formData);
    } else {
      await onCreate(formData);
    }
    setFormOpen(false);
    setEditingExercise(null);
  }

  async function handleConfirmDelete() {
    await onDelete(deleteTarget.id);
    setDeleteTarget(null);
  }

  function handlePageChange(newPage) {
    onPageChange?.(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (loading) {
    return (
      <main
        className="min-h-screen w-full"
        style={{
          background:
            "radial-gradient(circle at 50% -10%, #201a15 0%, #0c0a08 60%)",
          backgroundAttachment: "fixed",
          fontFamily: "'Barlow', sans-serif",
          paddingTop: "var(--header-height, 90px)",
        }}
      >
        <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
          <div className="flex min-h-[60vh] items-center justify-center">
            <p style={{ color: MUTED }}>Carregando exercícios...</p>
          </div>
        </div>
      </main>
    );
  }

  if (connectionError) {
    return (
      <main
        className="min-h-screen w-full"
        style={{
          background:
            "radial-gradient(circle at 50% -10%, #201a15 0%, #0c0a08 60%)",
          backgroundAttachment: "fixed",
          fontFamily: "'Barlow', sans-serif",
          paddingTop: "calc(var(--header-height, 90px) + 28px)",
        }}
      >
        <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
          <ConnectionErrorState onRetry={onRetry} />
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen w-full"
      style={{
        background:
          "radial-gradient(circle at 50% -10%, #201a15 0%, #0c0a08 60%)",
        backgroundAttachment: "fixed",
        fontFamily: "'Barlow', sans-serif",
        paddingTop: "calc(var(--header-height, 90px) + 28px)",
      }}
    >
      <div className="mx-auto w-full max-w-6xl px-6 pb-24 md:px-10">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p
              className="mb-1 text-xs font-bold uppercase tracking-[0.2em]"
              style={{ color: MUTED }}
            >
              Painel administrativo
            </p>
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
              Crie, edite e remova exercícios do catálogo.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex shrink-0 items-center gap-2 rounded-full px-6 py-3 text-sm font-extrabold uppercase tracking-[0.05em] transition-all"
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
            Novo exercício
          </button>
        </header>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <SearchField
              value={query}
              onChange={onQueryChange}
              onClear={() => onQueryChange?.("")}
            />
          </div>
          <div className="sm:w-[220px]">
            <CategoryDropdown value={category} onChange={onCategoryChange} />
          </div>
        </div>

        <p
          className="mb-4 mt-6 text-xs font-bold uppercase tracking-[0.12em]"
          style={{ color: MUTED, marginLeft: 6 }}
        >
          <span style={{ color: ORANGE }}>{totalElements}</span>{" "}
          {totalElements === 1
            ? "exercício encontrado"
            : "exercícios encontrados"}
        </p>

        {exercises.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div
              className="overflow-hidden rounded-2xl"
              style={{ border: "1px solid " + BORDER }}
            >
              <div
                className="hidden grid-cols-[1fr_160px_160px] gap-4 px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] sm:grid"
                style={{ background: FIELD, color: MUTED }}
              >
                <span>Exercício</span>
                <span className="text-center">Grupo muscular</span>
                <div className="flex justify-end pr-1">
                  <span className="w-[80px] text-center">Ações</span>
                </div>
              </div>

              <ul>
                {exercises.map((exercise, index) => (
                  <li
                    key={exercise.id}
                    className="flex flex-col gap-3 px-5 py-4 sm:grid sm:grid-cols-[1fr_160px_160px] sm:items-center sm:gap-4"
                    style={{
                      borderTop: index === 0 ? "none" : "1px solid " + BORDER,
                      background: PANEL,
                    }}
                  >
                    <div className="min-w-0">
                      <p
                        className="truncate font-semibold"
                        style={{ color: TEXT }}
                      >
                        {exercise.name}
                      </p>
                      <p
                        className="mt-0.5 truncate text-xs"
                        style={{ color: MUTED }}
                      >
                        {exercise.description}
                      </p>
                    </div>

                    <div className="flex sm:justify-center">
                      <span
                        className="text-xs font-bold uppercase tracking-[0.05em]"
                        style={{ color: "#959595" }}
                      >
                        {exercise.muscleGroupLabel ??
                          muscleLabel(exercise.muscleGroup)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 sm:justify-end sm:pr-1">
                      <button
                        type="button"
                        onClick={() => openEdit(exercise)}
                        aria-label={"Editar " + exercise.name}
                        className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
                        style={{
                          color: MUTED,
                          background: FIELD,
                          border: "1px solid " + BORDER,
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.color = ORANGE)
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.color = MUTED)
                        }
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(exercise)}
                        aria-label={"Excluir " + exercise.name}
                        className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
                        style={{
                          color: MUTED,
                          background: FIELD,
                          border: "1px solid " + BORDER,
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.color = "#ef4444")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.color = MUTED)
                        }
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {formOpen && (
        <ExerciseFormModal
          exercise={editingExercise}
          onClose={() => {
            setFormOpen(false);
            setEditingExercise(null);
          }}
          onSubmit={handleFormSubmit}
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          exercise={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </main>
  );
}

function SearchField({ value, onChange, onClear }) {
  const [focused, setFocused] = useState(false);
  return (
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all h-[38px] sm:h-[46px]"
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
        placeholder="Buscar exercício por nome..."
        className="w-full bg-transparent text-sm outline-none"
        style={{ color: TEXT }}
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
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

function CategoryDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = CATEGORIES.find((c) => c.key === value);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-xl px-4 py-3 text-left text-sm outline-none transition-all"
        style={{
          background: FIELD,
          border: "1.5px solid " + (open ? ORANGE : BORDER),
          color: selected ? TEXT : MUTED,
        }}
        onMouseOver={(e) => {
          if (!open) e.currentTarget.style.borderColor = "rgba(255,77,28,0.4)";
        }}
        onMouseOut={(e) => {
          if (!open) e.currentTarget.style.borderColor = BORDER;
        }}
      >
        <span className="truncate">
          {selected ? selected.label : "Todos os grupos"}
        </span>
        <ChevronDown size={16} color={open ? ORANGE : MUTED} />
      </button>

      {open && (
        <div
          className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-xl"
          style={{
            background: "linear-gradient(180deg, #17130f 0%, #141210 100%)",
            border: "1.5px solid " + BORDER,
            boxShadow: "0 16px 40px rgba(0,0,0,0.55)",
          }}
        >
          <ul className="nf-scroll max-h-64 overflow-y-auto py-1.5">
            <li>
              <button
                type="button"
                onClick={() => {
                  onChange(null);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors"
                style={{
                  color: !value ? ORANGE : TEXT,
                  background: !value ? "rgba(255,77,28,0.12)" : "transparent",
                  fontWeight: !value ? 700 : 500,
                }}
                onMouseOver={(e) => {
                  if (value)
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                }}
                onMouseOut={(e) => {
                  if (value) e.currentTarget.style.background = "transparent";
                }}
              >
                Todos os grupos
                {!value && <Check size={16} color={ORANGE} strokeWidth={2.6} />}
              </button>
            </li>
            {CATEGORIES.map((cat) => (
              <li key={cat.key}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(cat.key);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors"
                  style={{
                    color: value === cat.key ? ORANGE : TEXT,
                    background:
                      value === cat.key
                        ? "rgba(255,77,28,0.12)"
                        : "transparent",
                    fontWeight: value === cat.key ? 700 : 500,
                  }}
                  onMouseOver={(e) => {
                    if (value !== cat.key)
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.05)";
                  }}
                  onMouseOut={(e) => {
                    if (value !== cat.key)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  {cat.label}
                  {value === cat.key && (
                    <Check size={16} color={ORANGE} strokeWidth={2.6} />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ExerciseFormModal({ exercise, onClose, onSubmit }) {
  const isEditing = !!exercise;
  const [name, setName] = useState(exercise?.name ?? "");
  const [muscleGroup, setMuscleGroup] = useState(exercise?.muscleGroup ?? "");
  const [description, setDescription] = useState(exercise?.description ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [groupOpen, setGroupOpen] = useState(false);
  const groupRef = useRef(null);

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (!groupOpen) return;
    function handleClickOutside(e) {
      if (groupRef.current && !groupRef.current.contains(e.target))
        setGroupOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [groupOpen]);

  const selectedGroup = MUSCLE_GROUPS.find((m) => m.value === muscleGroup);
  const isValid = name.trim() && muscleGroup && description.trim();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid || saving) return;
    setError(null);
    setSaving(true);
    try {
      await onSubmit({
        name: name.trim(),
        muscleGroup,
        description: description.trim(),
      });
    } catch (err) {
      const message =
        typeof err.response?.data === "string"
          ? err.response.data
          : "Erro ao salvar. Tente novamente.";
      setError(message);
    } finally {
      setSaving(false);
    }
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
        aria-label={isEditing ? "Editar exercício" : "Novo exercício"}
        className="w-full max-w-md rounded-2xl p-6"
        style={{
          background: "linear-gradient(180deg, #141210 0%, #17130f 100%)",
          border: "1px solid " + BORDER,
          boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
        }}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2
            className="font-bold"
            style={{
              color: TEXT,
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "1.5rem",
            }}
          >
            {isEditing ? "Editar exercício" : "Novo exercício"}
          </h2>
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span
              className="text-xs font-bold uppercase tracking-[0.15em]"
              style={{ color: "#a09890" }}
            >
              Nome
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Supino reto"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{
                background: FIELD,
                border: "1.5px solid " + BORDER,
                color: TEXT,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = ORANGE)}
              onBlur={(e) => (e.currentTarget.style.borderColor = BORDER)}
            />
          </div>

          <div className="flex flex-col gap-2" ref={groupRef}>
            <span
              className="text-xs font-bold uppercase tracking-[0.15em]"
              style={{ color: "#a09890" }}
            >
              Grupo muscular
            </span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setGroupOpen((v) => !v)}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm outline-none transition-all"
                style={{
                  background: FIELD,
                  border: "1.5px solid " + (groupOpen ? ORANGE : BORDER),
                  color: selectedGroup ? TEXT : MUTED,
                }}
              >
                <span>{selectedGroup ? selectedGroup.label : "Selecione"}</span>
                <ChevronDown size={16} color={groupOpen ? ORANGE : MUTED} />
              </button>

              {groupOpen && (
                <div
                  className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-xl"
                  style={{
                    background:
                      "linear-gradient(180deg, #17130f 0%, #141210 100%)",
                    border: "1.5px solid " + BORDER,
                    boxShadow: "0 16px 40px rgba(0,0,0,0.55)",
                  }}
                >
                  <ul className="nf-scroll max-h-52 overflow-y-auto py-1.5">
                    {MUSCLE_GROUPS.map((m) => (
                      <li key={m.value}>
                        <button
                          type="button"
                          onClick={() => {
                            setMuscleGroup(m.value);
                            setGroupOpen(false);
                          }}
                          className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors"
                          style={{
                            color: muscleGroup === m.value ? ORANGE : TEXT,
                            background:
                              muscleGroup === m.value
                                ? "rgba(255,77,28,0.12)"
                                : "transparent",
                            fontWeight: muscleGroup === m.value ? 700 : 500,
                          }}
                          onMouseOver={(e) => {
                            if (muscleGroup !== m.value)
                              e.currentTarget.style.background =
                                "rgba(255,255,255,0.05)";
                          }}
                          onMouseOut={(e) => {
                            if (muscleGroup !== m.value)
                              e.currentTarget.style.background = "transparent";
                          }}
                        >
                          {m.label}
                          {muscleGroup === m.value && (
                            <Check size={16} color={ORANGE} strokeWidth={2.6} />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span
              className="text-xs font-bold uppercase tracking-[0.15em]"
              style={{ color: "#a09890" }}
            >
              Descrição
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descrição de como executar o exercício"
              rows={3}
              className="w-full resize-none rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{
                background: FIELD,
                border: "1.5px solid " + BORDER,
                color: TEXT,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = ORANGE)}
              onBlur={(e) => (e.currentTarget.style.borderColor = BORDER)}
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: "#ef4444" }}>
              {error}
            </p>
          )}

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
              disabled={!isValid || saving}
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-extrabold uppercase tracking-[0.05em] transition-all disabled:opacity-50"
              style={{
                background: ORANGE,
                color: BG,
                boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
              }}
              onMouseOver={(e) => {
                if (!isValid || saving) return;
                e.currentTarget.style.background = "#ff6b42";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.4)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = ORANGE;
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.35)";
              }}
            >
              {saving
                ? "Salvando..."
                : isEditing
                  ? "Salvar alterações"
                  : "Criar exercício"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmDeleteModal({ exercise, onCancel, onConfirm }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const cancelRef = useRef(null);

  useEffect(() => {
    cancelRef.current?.focus();
    function handleEsc(e) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onCancel]);

  async function handleConfirm() {
    setError(null);
    setDeleting(true);
    try {
      await onConfirm();
    } catch (err) {
      const message =
        typeof err.response?.data === "string"
          ? err.response.data
          : "Erro ao excluir exercício.";
      setError(message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-exercise-title"
        aria-describedby="confirm-delete-exercise-desc"
        className="w-full max-w-md rounded-2xl p-7"
        style={{
          background: "linear-gradient(180deg, #141210 0%, #17130f 100%)",
          border: "1px solid " + BORDER,
          boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
        }}
      >
        <div className="flex flex-col items-center text-center">
          <div
            className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
            style={{
              background: "rgba(220,38,38,0.04)",
              border: "1px solid rgba(220,38,38,0.04)",
              color: "#c45454",
            }}
          >
            <AlertTriangle size={22} strokeWidth={1.75} />
          </div>

          <h2
            id="confirm-delete-exercise-title"
            className="font-bold"
            style={{
              color: TEXT,
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "1.5rem",
              lineHeight: 1,
              letterSpacing: "-0.01em",
            }}
          >
            Excluir exercício
          </h2>

          <div
            id="confirm-delete-exercise-desc"
            className="mt-3 flex max-w-xs flex-col items-center gap-2"
          >
            <p
              className="text-center text-sm leading-relaxed"
              style={{ color: MUTED }}
            >
              Deseja realmente excluir{" "}
              <span style={{ color: ORANGE }}>{exercise.name}</span> do
              catálogo? Essa ação não pode ser desfeita.
            </p>
            <p
              className="text-center text-xs leading-relaxed"
              style={{ color: "#6f6b66" }}
            >
              O exercício só será removido se não estiver sendo utilizado em
              nenhum treino.
            </p>
          </div>

          {error && (
            <p
              className="mt-3 max-w-xs text-center text-sm"
              style={{ color: "#ef4444" }}
            >
              {error}
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="w-32 rounded-full px-4 py-2.5 text-sm font-bold uppercase tracking-[0.05em] transition-all disabled:opacity-50"
            style={{
              background: "rgba(255,255,255,0.04)",
              color: TEXT,
              border: "1.5px solid rgba(255,255,255,0.14)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.24)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
            }}
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={deleting}
            className="inline-flex w-32 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-extrabold uppercase tracking-[0.05em] transition-all disabled:opacity-50"
            style={{
              background: "rgba(239,68,68,0.1)",
              color: "#ef4444",
              border: "1.5px solid rgba(239,68,68,0.35)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.20)";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.55)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.1)";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.35)";
            }}
          >
            {deleting ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="mt-2 flex flex-col items-center justify-center rounded-2xl py-16 text-center"
      style={{ background: PANEL, border: "1px solid " + BORDER }}
    >
      <p className="text-sm" style={{ color: MUTED }}>
        Nenhum exercício encontrado.
      </p>
    </div>
  );
}

function Pagination({ page = 0, totalPages = 1, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-10 flex items-center justify-center gap-3">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        aria-label="Página anterior"
        className="flex h-8 w-8 items-center justify-center rounded-full transition-colors disabled:opacity-30 text-[var(--pg-muted)] bg-[var(--pg-field)] hover:enabled:text-[var(--pg-orange)] hover:enabled:bg-[var(--pg-orange-bg)]"
        style={{
          "--pg-muted": MUTED,
          "--pg-field": FIELD,
          "--pg-orange": ORANGE,
          "--pg-orange-bg": "rgba(255,77,28,0.14)",
        }}
      >
        <ChevronLeft size={16} />
      </button>
      <span className="text-sm font-semibold" style={{ color: TEXT }}>
        {page + 1} / {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
        aria-label="Próxima página"
        className="flex h-8 w-8 items-center justify-center rounded-full transition-colors disabled:opacity-30 text-[var(--pg-muted)] bg-[var(--pg-field)] hover:enabled:text-[var(--pg-orange)] hover:enabled:bg-[var(--pg-orange-bg)]"
        style={{
          "--pg-muted": MUTED,
          "--pg-field": FIELD,
          "--pg-orange": ORANGE,
          "--pg-orange-bg": "rgba(255,77,28,0.14)",
        }}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export default AdminView;

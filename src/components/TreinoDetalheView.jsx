import { useState, useEffect, useRef } from "react";
import { ORANGE, BG, PANEL, FIELD, BORDER, TEXT, MUTED } from "../theme";
import {
  ArrowLeft,
  Play,
  Pencil,
  Trash2,
  Plus,
  ChevronUp,
  ChevronDown,
  Info,
  X,
  AlertTriangle,
  Save,
  Search,
  Check,
  Dumbbell,
} from "lucide-react";
import MuscleIcon from "./MuscleIcon";

import { Link } from "react-router-dom";

function TreinoDetalheView({ data }) {
  const {
    workout,
    onSave,
    onCancel,
    onDelete,
    onAddExercise,
    onStartWorkout,
    onOpenExercise,
    startInEdit = false,
    loading,
  } = data;

  const [isEditing, setIsEditing] = useState(startInEdit);

  const [draftTitle, setDraftTitle] = useState(workout?.title ?? "");
  const [draftExercises, setDraftExercises] = useState(
    () => workout?.exercises?.map((e) => ({ ...e })) ?? [],
  );

  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    setDraftTitle(workout?.title ?? "");
    setDraftExercises(workout?.exercises?.map((e) => ({ ...e })) ?? []);
  }, [workout]);

  function enterEdit() {
    setDraftTitle(workout?.title ?? "");
    setDraftExercises(workout?.exercises?.map((e) => ({ ...e })) ?? []);
    setIsEditing(true);
  }

  function handleSave() {
    onSave?.({
      id: workout.id,
      title: draftTitle.trim() || workout.title,
      exercises: draftExercises,
    });
    setIsEditing(false);
  }

  function updateField(exId, field, value) {
    setDraftExercises((prev) =>
      prev.map((e) => (e.id === exId ? { ...e, [field]: value } : e)),
    );
  }

  function removeExercise(exId) {
    setDraftExercises((prev) => prev.filter((e) => e.id !== exId));
    setDeleteTarget(null);
  }

  function moveExercise(index, direction) {
    setDraftExercises((prev) => {
      const next = [...prev];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function hasChanges(workout, draftTitle, draftExercises) {
    if (draftTitle.trim() !== (workout?.title ?? "")) return true;
    const original = workout?.exercises ?? [];
    if (original.length !== draftExercises.length) return true;
    return original.some((ex, i) => {
      const d = draftExercises[i];
      return !d || d.id !== ex.id || d.sets !== ex.sets || d.reps !== ex.reps;
    });
  }

  function handleCancel() {
    const changed = hasChanges(workout, draftTitle, draftExercises);
    setDraftTitle(workout?.title ?? "");
    setDraftExercises(workout?.exercises?.map((e) => ({ ...e })) ?? []);
    setIsEditing(false);
    onCancel?.(changed);
  }
  const [pickerOpen, setPickerOpen] = useState(false);

  const viewExercises = workout?.exercises ?? [];

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
      <div className="mx-auto w-full max-w-4xl px-6 pb-16 md:px-10">
        {loading ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <p style={{ color: MUTED }}>Carregando treino...</p>
          </div>
        ) : (
          <>
            <BackLink isEditing={isEditing} onExitEdit={handleCancel} />
            {isEditing ? (
              <EditHeader value={draftTitle} onChange={setDraftTitle} />
            ) : (
              <ViewHeader title={workout?.title} onEdit={enterEdit} />
            )}

            <section className="mt-8">
              {isEditing ? (
                <EditTable
                  exercises={draftExercises}
                  onChangeField={updateField}
                  onMoveUp={(index) => moveExercise(index, "up")}
                  onMoveDown={(index) => moveExercise(index, "down")}
                  onRequestDelete={(ex) => setDeleteTarget(ex)}
                />
              ) : (
                <ViewTable
                  exercises={viewExercises}
                  onOpenExercise={onOpenExercise}
                />
              )}

              {isEditing && (
                <button
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold uppercase tracking-[0.05em] transition-all"
                  style={{
                    background: "transparent",
                    color: ORANGE,
                    border: "1.5px solid " + ORANGE,
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "rgba(255,77,28,0.1)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <Plus size={16} strokeWidth={2.5} />
                  Adicionar exercício
                </button>
              )}
            </section>

            {isEditing ? (
              <EditActions onSave={handleSave} onCancel={handleCancel} />
            ) : (
              <ViewActions onStart={() => onStartWorkout?.(workout.id)} />
            )}
          </>
        )}
      </div>

      {deleteTarget && (
        <ConfirmDeleteModal
          exercise={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => removeExercise(deleteTarget.id)}
        />
      )}
      {pickerOpen && (
        <ExercisePickerModal
          exercises={data.availableExercises ?? []}
          existingIds={draftExercises.map((e) => e.exerciseId)}
          onClose={() => setPickerOpen(false)}
          onConfirm={(exercise) => {
            setDraftExercises((prev) => [
              ...prev,
              {
                id: "temp-" + exercise.id + "-" + Date.now(),
                exerciseId: exercise.id,
                name: exercise.name,
                sets: 4,
                reps: 12,
              },
            ]);
            setPickerOpen(false);
          }}
        />
      )}
    </main>
  );
}

function BackLink({ isEditing, onExitEdit }) {
  const [hover, setHover] = useState(false);

  const sharedClass =
    "inline-flex items-center gap-2 py-2 pr-4 pl-2 text-sm font-bold uppercase tracking-[0.08em] transition-all";
  const sharedStyle = {
    color: hover ? ORANGE : MUTED,
    background: "transparent",
  };

  if (isEditing) {
    return (
      <button
        type="button"
        onClick={onExitEdit}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={sharedClass}
        style={sharedStyle}
      >
        <ArrowLeft size={18} strokeWidth={2.5} />
        Voltar
      </button>
    );
  }

  return (
    <Link
      to="/treinos"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={sharedClass}
      style={sharedStyle}
    >
      <ArrowLeft size={18} strokeWidth={2.5} />
      Voltar
    </Link>
  );
}

function ViewHeader({ title, onEdit }) {
  const [hover, setHover] = useState(false);
  return (
    <header className="mt-5 flex items-end justify-between gap-4">
      <h1
        className="font-bold leading-[0.95]"
        style={{
          color: TEXT,
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h1>

      <button
        type="button"
        onClick={onEdit}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold uppercase tracking-[0.05em] transition-all"
        style={{
          background: hover ? "rgba(255,77,28,0.1)" : "transparent",
          color: hover ? ORANGE : MUTED,
          border: "1.5px solid " + (hover ? ORANGE : BORDER),
        }}
      >
        <Pencil size={15} strokeWidth={2.5} />
        Editar
      </button>
    </header>
  );
}

function EditHeader({ value, onChange }) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  return (
    <header className="mt-5">
      <label
        htmlFor="treino-nome"
        className="text-xs font-bold uppercase tracking-[0.15em]"
        style={{ color: "#a09890" }}
      >
        Nome do treino
      </label>
      <div className="mt-2">
        <input
          id="treino-nome"
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Nome do treino"
          className="w-full rounded-xl bg-transparent px-4 py-3 outline-none transition-all"
          style={{
            color: TEXT,
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "clamp(1.9rem, 4.5vw, 2.8rem)",
            lineHeight: 1,
            background: FIELD,
            border: "1.5px solid " + (focused ? ORANGE : BORDER),
          }}
        />
      </div>
    </header>
  );
}

const EDIT_COLUMNS = "40px 482px 64px 3px 80px 1fr 30px";
function EditTable({
  exercises,
  onChangeField,
  onMoveUp,
  onMoveDown,
  onRequestDelete,
}) {
  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{ border: "1px solid " + BORDER }}
    >
      <div
        className="grid items-center gap-3 px-5 py-3 text-xs font-bold uppercase tracking-[0.12em]"
        style={{
          background: FIELD,
          color: MUTED,
          gridTemplateColumns: EDIT_COLUMNS,
        }}
      >
        <div style={{ gridColumn: "1 / 3" }}>Exercício</div>
        <div className="text-center">Séries</div>
        <div />
        <div className="text-center whitespace-nowrap">Repetições</div>
        <div />
        <div />
      </div>

      {exercises.length === 0 ? (
        <div
          className="px-5 py-10 text-center text-sm"
          style={{ background: PANEL, color: MUTED }}
        >
        </div>
      ) : (
        exercises.map((ex, i) => (
          <div
            key={i}
            className="grid items-center gap-3 px-5 py-3.5"
            style={{
              background: PANEL,
              gridTemplateColumns: EDIT_COLUMNS,
              borderTop: i === 0 ? "none" : "1px solid " + BORDER,
            }}
          >
            <button
              type="button"
              onClick={() => onRequestDelete(ex)}
              aria-label={"Remover " + ex.name}
              className="flex h-9 w-9 items-center justify-center rounded-lg transition-all"
              style={{ background: FIELD, color: "#ef4444" }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(239,68,68,0.14)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = FIELD;
              }}
            >
              <Trash2 size={16} strokeWidth={2.4} />
            </button>

            <div className="min-w-0">
              <span
                className="truncate font-bold"
                style={{
                  color: TEXT,
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: "1.3rem",
                  lineHeight: 1.1,
                  display: "block",
                }}
              >
                {ex.name}
              </span>
            </div>

            <NumberInput
              value={ex.sets}
              onChange={(v) => onChangeField(ex.id, "sets", v)}
              ariaLabel={"Séries de " + ex.name}
            />
            <div />

            <NumberInput
              value={ex.reps}
              onChange={(v) => onChangeField(ex.id, "reps", v)}
              ariaLabel={"Repetições de " + ex.name}
            />
            <div />

            <div className="flex flex-col gap-0.5">
              <ReorderArrow
                direction="up"
                disabled={i === 0}
                onClick={() => onMoveUp(i)}
              />
              <ReorderArrow
                direction="down"
                disabled={i === exercises.length - 1}
                onClick={() => onMoveDown(i)}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function ViewTable({ exercises, onOpenExercise }) {
  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{ border: "1px solid " + BORDER }}
    >
      <div
        className="grid items-center gap-3 px-5 py-3 text-xs font-bold uppercase tracking-[0.12em]"
        style={{
          background: FIELD,
          color: MUTED,
          gridTemplateColumns: "1fr 72px 88px",
        }}
      >
        <span>Exercício</span>
        <span className="text-center">Séries</span>
        <span className="text-center">Repetições</span>
      </div>

      {exercises.length === 0 ? (
        <div
          className="flex flex-col items-center gap-3 px-5 py-12 text-center"
          style={{ background: PANEL }}
        >
          <Dumbbell size={28} color={MUTED} strokeWidth={2} />
          <p className="text-sm font-medium" style={{ color: TEXT }}>
            Nenhum exercício neste treino ainda.
          </p>
          <p className="text-xs" style={{ color: MUTED }}>
            Clique em "Editar" para adicionar exercícios e poder iniciar o
            treino.
          </p>
        </div>
      ) : (
        exercises.map((ex, i) => (
          <div
            key={ex.id}
            className="grid items-center gap-3 px-5 py-3.5"
            style={{
              background: PANEL,
              gridTemplateColumns: "1fr 72px 88px",
              borderTop: i === 0 ? "none" : "1px solid " + BORDER,
            }}
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <button
                type="button"
                onClick={() =>
                  onOpenExercise
                    ? onOpenExercise(ex.exerciseId ?? ex.id)
                    : console.log("[v0] abrir detalhe do exercício:", ex.name)
                }
                aria-label={"Ver detalhes de " + ex.name}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all"
                style={{ background: FIELD, color: ORANGE }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(255,77,28,0.18)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = FIELD;
                }}
              >
                <Info size={15} strokeWidth={2.5} />
              </button>
              <span
                className="truncate font-bold"
                style={{
                  color: TEXT,
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: "1.35rem",
                  lineHeight: 1.1,
                }}
              >
                {ex.name}
              </span>
            </div>

            <span
              className="text-center font-bold"
              style={{
                color: TEXT,
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "1.4rem",
              }}
            >
              {ex.sets}
            </span>
            <span
              className="text-center font-bold"
              style={{
                color: TEXT,
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "1.4rem",
              }}
            >
              {ex.reps}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

function NumberInput({ value, onChange, ariaLabel }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type="number"
      min={1}
      inputMode="numeric"
      aria-label={ariaLabel}
      value={value}
      onChange={(e) => {
        const n = parseInt(e.target.value, 10);
        onChange(Number.isNaN(n) ? "" : n);
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className="w-full rounded-lg px-2 py-2.5 text-center text-sm font-bold outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0"
      style={{
        background: FIELD,
        border: "1.5px solid " + (focused ? ORANGE : BORDER),
        color: TEXT,
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: "1.2rem",
      }}
    />
  );
}

function ReorderArrow({ direction, disabled, onClick }) {
  const Icon = direction === "up" ? ChevronUp : ChevronDown;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "up" ? "Mover para cima" : "Mover para baixo"}
      className={
        "flex h-6 w-9 items-center justify-center rounded-md transition-all " +
        (disabled
          ? "cursor-not-allowed opacity-40 text-[#4a453f]"
          : "cursor-pointer text-[#c9c4bf] hover:text-[#FF4D1C]")
      }
      style={{ background: "transparent" }}
    >
      <Icon size={18} strokeWidth={2.6} />
    </button>
  );
}

function EmptyRows() {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl py-12 text-center"
      style={{ background: PANEL, border: "1px dashed " + BORDER }}
    >
      <p className="text-sm" style={{ color: MUTED }}>
        Nenhum exercício neste treino ainda.
      </p>
    </div>
  );
}

function ViewActions({ onStart }) {
  return (
    <div className="mt-10 flex justify-center">
      <button
        type="button"
        onClick={onStart}
        className="inline-flex items-center justify-center gap-2.5 rounded-full px-56 py-4 text-base font-extrabold uppercase tracking-[0.05em] transition-all"
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
        <Play size={20} strokeWidth={2.5} fill={BG} />
        Iniciar treino
      </button>
    </div>
  );
}

function EditActions({ onSave, onCancel }) {
  const [cancelHover, setCancelHover] = useState(false);
  return (
    <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
      <button
        type="button"
        onClick={onCancel}
        onMouseEnter={() => setCancelHover(true)}
        onMouseLeave={() => setCancelHover(false)}
        className="inline-flex items-center justify-center rounded-full px-6 py-4 text-sm font-bold uppercase tracking-[0.05em] transition-all"
        style={{
          background: cancelHover ? "rgba(239,68,68,0.16)" : "transparent",
          color: "#ef4444",
          border: "1.5px solid #ef4444",
        }}
      >
        Cancelar
      </button>
      <button
        type="button"
        onClick={onSave}
        className="inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-4 text-base font-extrabold uppercase tracking-[0.01em] transition-all"
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
        <Save size={18} strokeWidth={2.5} />
        Salvar alterações
      </button>
    </div>
  );
}

function ConfirmDeleteModal({ exercise, onClose, onConfirm }) {
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
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-exercise-title"
        aria-describedby="confirm-delete-exercise-desc"
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
            id="confirm-delete-exercise-title"
            className="mt-3 font-bold"
            style={{
              color: TEXT,
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "1.7rem",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            Remover exercício
          </h2>

          <p
            id="confirm-delete-exercise-desc"
            className="mt-3 max-w-xs text-center text-sm leading-relaxed"
            style={{
              color: "#a39d97",
            }}
          >
            Deseja realmente remover{" "}
            <span
              style={{
                color: ORANGE,
              }}
            >
              {exercise.name}
            </span>{" "}
            deste treino?
            <br />
            <span style={{ color: "#a39d97" }}>
              A alteração só será aplicada ao salvar.
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
              background: "#ad2424",
              color: "#fff",
              boxShadow: "0 3px 7px rgba(0,0,0,0.18)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#8f1717";
              e.currentTarget.style.boxShadow = "0 4px 9px rgba(0,0,0,0.25)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#ad2424";
              e.currentTarget.style.boxShadow = "0 3px 7px rgba(0,0,0,0.18)";
            }}
          >
            Remover
          </button>
        </div>
      </div>
    </div>
  );
}

function ExercisePickerModal({ exercises, existingIds, onClose, onConfirm }) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const filtered = exercises.filter((ex) => {
    const q = normalize(query);
    if (!q) return true;
    return (
      normalize(ex.name).includes(q) ||
      normalize(ex.muscleGroupLabel ?? "").includes(q)
    );
  });

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  function handleConfirm() {
    const exercise = exercises.find((ex) => ex.id === selectedId);
    if (exercise) onConfirm(exercise);
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
        aria-label="Escolher exercício"
        className="flex w-full max-w-md flex-col overflow-hidden rounded-2xl"
        style={{
          maxHeight: "80vh",
          background:
            "radial-gradient(circle at 50% -100%, #241d17 0%, #100d0a 75%)",
          border: "1px solid " + BORDER,
          boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
        }}
      >
        <div className="flex items-center justify-between p-6 pb-4">
          <h2
            className="font-bold"
            style={{
              color: TEXT,
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "1.6rem",
              lineHeight: 1,
            }}
          >
            Adicionar exercício
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

        <div className="px-6">
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all"
            style={{ background: FIELD, border: "1.5px solid " + BORDER }}
          >
            <Search size={18} color={MUTED} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar exercício..."
              className="w-full bg-transparent text-sm outline-none"
              style={{ color: TEXT }}
              autoFocus
            />
          </div>
        </div>

        <ul className="nf-scroll mt-4 flex-1 overflow-y-auto px-3 pb-2">
          {filtered.length === 0 ? (
            <li
              className="px-3 py-10 text-center text-sm"
              style={{ color: MUTED }}
            >
              Nenhum exercício encontrado.
            </li>
          ) : (
            filtered.map((ex) => {
              const disabled = existingIds.includes(ex.id);
              const isSelected = selectedId === ex.id;
              return (
                <li key={ex.id}>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => setSelectedId(ex.id)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all disabled:cursor-not-allowed"
                    style={{
                      background: isSelected
                        ? "rgba(255,77,28,0.12)"
                        : "transparent",
                      border:
                        "1.5px solid " + (isSelected ? ORANGE : "transparent"),
                      opacity: disabled ? 0.4 : 1,
                    }}
                    onMouseOver={(e) => {
                      if (!disabled && !isSelected)
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.05)";
                    }}
                    onMouseOut={(e) => {
                      if (!isSelected)
                        e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: FIELD }}
                    >
                      <MuscleIcon group={ex.muscleGroup} size={30} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className="block truncate font-bold"
                        style={{
                          color: TEXT,
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontSize: "1.1rem",
                          lineHeight: 1.1,
                        }}
                      >
                        {ex.name}
                      </span>
                      <span
                        className="text-xs"
                        style={{
                          color: disabled ? "#6b645d" : "#a39d97",
                        }}
                      >
                        {disabled ? "já adicionado" : ex.muscleGroupLabel}
                      </span>
                    </span>
                    {isSelected && (
                      <Check size={18} color={ORANGE} strokeWidth={2.6} />
                    )}
                  </button>
                </li>
              );
            })
          )}
        </ul>

        <div
          className="flex items-center justify-end gap-3 p-6 pt-4"
          style={{ borderTop: "1px solid " + BORDER }}
        >
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-5 py-3 text-sm font-bold uppercase tracking-[0.05em] transition-all"
            style={{
              background: "transparent",
              color: MUTED,
              border: "1.5px solid " + BORDER,
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedId}
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
      </div>
    </div>
  );
}

function normalize(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default TreinoDetalheView;

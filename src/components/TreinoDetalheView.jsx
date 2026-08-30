import { useState, useEffect, useRef } from "react";
import { ORANGE, BG, PANEL, FIELD, BORDER, TEXT, MUTED } from "../theme";
import {
  ArrowLeft,
  Play,
  Pencil,
  Trash2,
  Plus,
  Lock,
  ChevronUp,
  ChevronDown,
  Info,
  X,
  AlertTriangle,
  Save,
  Search,
  Check,
  Dumbbell,
  Minus,
  LogOut,
} from "lucide-react";

import MuscleIcon from "./MuscleIcon";

import { Link, useBlocker } from "react-router-dom";
import ConnectionErrorState from "./ConnectionErrorState.jsx";
import ExercicioDetalhe from "./ExercicioDetalhe.jsx";
import { useToast } from "../hooks/useToast.js";
import { MAX_EXERCISES_PER_WORKOUT } from "../constants/limits.js";

function TreinoDetalheView({ data }) {
  const {
    workout,
    onSave,
    onCancel,
    onStartWorkout,
    startInEdit = false,
    loading,
    connectionError,
    onRetry,
    otherWorkoutTitles = [],
    activeWorkout,
  } = data;

  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(startInEdit);
  const blocked = !!activeWorkout;

  const [draftTitle, setDraftTitle] = useState(workout?.title ?? "");
  const [draftExercises, setDraftExercises] = useState(
    () => workout?.exercises?.map((e) => ({ ...e })) ?? [],
  );

  const isDuplicateTitle = otherWorkoutTitles.some(
    (t) => t.trim().toLowerCase() === draftTitle.trim().toLowerCase(),
  );

  function warnBlocked() {
    showToast("Finalize seu treino em andamento antes de fazer isso", "info");
  }

  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    setDraftTitle(workout?.title ?? "");
    setDraftExercises(workout?.exercises?.map((e) => ({ ...e })) ?? []);
  }, [workout]);

  function enterEdit() {
    if (blocked) {
      warnBlocked();
      return;
    }
    setDraftTitle(workout?.title ?? "");
    setDraftExercises(workout?.exercises?.map((e) => ({ ...e })) ?? []);
    setIsEditing(true);
  }

  async function handleSave() {
    if (draftTitle.trim().length === 0) return;
    await onSave?.({
      id: workout.id,
      title: draftTitle.trim(),
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

  const [discardModalOpen, setDiscardModalOpen] = useState(false);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isEditing &&
      hasChanges(workout, draftTitle, draftExercises) &&
      currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      setDiscardModalOpen(true);
    }
  }, [blocker.state]);

  function handleCancel() {
    const changed = hasChanges(workout, draftTitle, draftExercises);
    if (changed) {
      setDiscardModalOpen(true);
      return;
    }
    setIsEditing(false);
    onCancel?.(false);
  }

  function confirmDiscard() {
    setDraftTitle(workout?.title ?? "");
    setDraftExercises(workout?.exercises?.map((e) => ({ ...e })) ?? []);
    setIsEditing(false);
    setDiscardModalOpen(false);
    onCancel?.(true);
    if (blocker.state === "blocked") {
      blocker.proceed();
    }
  }

  async function handleSaveFromModal() {
    if (draftTitle.trim().length === 0 || isDuplicateTitle) return;
    await handleSave();
    setDiscardModalOpen(false);
    if (blocker.state === "blocked") {
      blocker.proceed();
    }
  }

  function handleCloseDiscardModal() {
    setDiscardModalOpen(false);
    if (blocker.state === "blocked") {
      blocker.reset();
    }
  }

  const [pickerOpen, setPickerOpen] = useState(false);
  const [detailExercise, setDetailExercise] = useState(null);

  const viewExercises = workout?.exercises ?? [];

  return (
    <main
      className="min-h-screen w-full"
      style={{
        background:
          "radial-gradient(circle at 50% -10%, #201a15 0%, #0c0a08 60%)",
        fontFamily: "'Barlow', sans-serif",
        paddingTop: "var(--header-height, 90px)",
      }}
    >
      <div className="mx-auto w-full max-w-4xl px-6 pb-16 md:px-10">
        {loading ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <p style={{ color: MUTED }}>Carregando treino...</p>
          </div>
        ) : connectionError ? (
          <ConnectionErrorState onRetry={onRetry} />
        ) : (
          <>
            <BackLink isEditing={isEditing} onExitEdit={handleCancel} />
            {isEditing ? (
              <EditHeader
                value={draftTitle}
                onChange={setDraftTitle}
                isDuplicate={isDuplicateTitle}
              />
            ) : (
              <ViewHeader
                title={workout?.title}
                onEdit={enterEdit}
                blocked={blocked}
              />
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
                  onOpenExercise={(exerciseId) => {
                    const full = (data.availableExercises ?? []).find(
                      (ex) => ex.id === exerciseId,
                    );
                    if (full) setDetailExercise(full);
                  }}
                />
              )}

              {isEditing && (
                <div className="mt-4 flex justify-start">
                  <button
                    type="button"
                    onClick={() => {
                      if (draftExercises.length >= MAX_EXERCISES_PER_WORKOUT) {
                        showToast(
                          `Você só pode ter no máximo ${MAX_EXERCISES_PER_WORKOUT} exercícios por treino`,
                          "info",
                        );
                        return;
                      }
                      setPickerOpen(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-[0.05em] transition-all sm:px-5 sm:py-3 sm:text-sm"
                    style={{
                      background: "transparent",
                      color: ORANGE,
                      border: "1.5px solid " + ORANGE,
                      opacity:
                        draftExercises.length >= MAX_EXERCISES_PER_WORKOUT
                          ? 0.5
                          : 1,
                    }}
                    onMouseOver={(e) => {
                      if (draftExercises.length >= MAX_EXERCISES_PER_WORKOUT)
                        return;
                      e.currentTarget.style.background = "rgba(255,77,28,0.1)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {draftExercises.length >= MAX_EXERCISES_PER_WORKOUT ? (
                      <Lock size={14} strokeWidth={2.5} />
                    ) : (
                      <Plus size={14} strokeWidth={2.5} />
                    )}
                    {draftExercises.length >= MAX_EXERCISES_PER_WORKOUT
                      ? "Limite atingido"
                      : "Adicionar exercício"}
                  </button>
                </div>
              )}
            </section>

            {isEditing ? (
              <EditActions
                onSave={handleSave}
                onCancel={handleCancel}
                disabled={
                  draftTitle.trim().length === 0 ||
                  isDuplicateTitle ||
                  !hasChanges(workout, draftTitle, draftExercises)
                }
              />
            ) : (
              <ViewActions
                onStart={() => {
                  if (blocked) {
                    warnBlocked();
                    return;
                  }
                  onStartWorkout?.(workout.id);
                }}
                disabled={viewExercises.length === 0}
                blocked={blocked}
              />
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
          isFull={draftExercises.length >= MAX_EXERCISES_PER_WORKOUT}
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
      {detailExercise && (
        <ExercicioDetalhe
          exercise={detailExercise}
          onClose={() => setDetailExercise(null)}
        />
      )}
      {discardModalOpen && (
        <DiscardChangesModal
          onClose={handleCloseDiscardModal}
          onSave={handleSaveFromModal}
          onDiscard={confirmDiscard}
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

function ViewHeader({ title, onEdit, blocked }) {
  const [hover, setHover] = useState(false);
  return (
    <header className="mt-5 flex items-end justify-between gap-4">
      <h1
        className="ml-2 font-bold leading-[0.95] sm:ml-0"
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
        onMouseEnter={() => !blocked && setHover(true)}
        onMouseLeave={() => !blocked && setHover(false)}
        className="inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold uppercase tracking-[0.05em] transition-all"
        style={{
          opacity: blocked ? 0.5 : 1,
          background: hover && !blocked ? "rgba(255,77,28,0.1)" : "transparent",
          color: hover && !blocked ? ORANGE : MUTED,
          border: "1.5px solid " + (hover && !blocked ? ORANGE : BORDER),
        }}
      >
        <Pencil size={15} strokeWidth={2.5} />
        Editar
      </button>
    </header>
  );
}

function EditHeader({ value, onChange, isDuplicate }) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const isEmpty = value.trim().length === 0;

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
          className="w-full rounded-xl bg-transparent px-4 py-3 outline-none transition-all"
          style={{
            color: TEXT,
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "clamp(1.9rem, 4.5vw, 2.8rem)",
            lineHeight: 1,
            background: FIELD,
            border:
              "1.5px solid " +
              (isEmpty ? "#ef4444" : focused ? ORANGE : BORDER),
          }}
        />
        {isEmpty && (
          <p
            className="mt-1.5 text-xs font-medium"
            style={{ color: "#ef4444" }}
          >
            O nome do treino não pode ficar vazio.
          </p>
        )}
        {!isEmpty && isDuplicate && (
          <p
            className="mt-1.5 text-xs font-medium"
            style={{ color: "#ef4444" }}
          >
            Já existe um treino com esse nome.
          </p>
        )}
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
        className="hidden items-center gap-3 px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] sm:grid"
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

      {exercises.length > 0 && (
        <div
          className="flex items-center gap-2 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.08em] sm:hidden"
          style={{ background: FIELD, color: MUTED }}
        >
          <div className="w-8 shrink-0" />
          <div className="min-w-0 flex-1">Exercício</div>
          <div className="w-11 shrink-0 text-center">Séries</div>
          <div className="w-11 shrink-0 text-center">Reps</div>
          <div className="w-6 shrink-0" />
        </div>
      )}

      {exercises.length === 0 ? (
        <div
          className="px-5 py-10 text-center text-sm"
          style={{ background: PANEL, color: MUTED }}
        ></div>
      ) : (
        exercises.map((ex, i) => (
          <div key={i}>
            <div
              className="flex items-center gap-2 px-4 py-2.5 sm:hidden"
              style={{
                background:
                  "radial-gradient(180% 600% at 100% -130%, rgba(255,110,50,0.06) 0%, rgba(180,60,15,0.02) 20%, #171310 45%, #0e0b09 100%)",
                borderTop: i === 0 ? "none" : "1px solid " + BORDER,
              }}
            >
              <button
                type="button"
                onClick={() => onRequestDelete(ex)}
                aria-label={"Remover " + ex.name}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all"
                style={{ background: "transparent", color: "#dc2626" }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = "#ff7a7a";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = "#dc2626";
                }}
              >
                <Trash2 size={17} strokeWidth={2.4} />
              </button>

              <span
                className="min-w-0 flex-1 truncate font-bold"
                style={{
                  color: TEXT,
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: "0.95rem",
                  lineHeight: 1.1,
                }}
              >
                {ex.name}
              </span>

              <div className="w-11 shrink-0">
                <NumberInput
                  value={ex.sets}
                  onChange={(v) => onChangeField(ex.id, "sets", v)}
                  ariaLabel={"Séries de " + ex.name}
                  max={30}
                  compact
                />
              </div>

              <div className="w-11 shrink-0">
                <NumberInput
                  value={ex.reps}
                  onChange={(v) => onChangeField(ex.id, "reps", v)}
                  ariaLabel={"Repetições de " + ex.name}
                  max={30}
                  compact
                />
              </div>

              <div className="flex w-6 shrink-0 flex-col gap-0.5">
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

            <div
              className="hidden items-center gap-3 px-5 py-3.5 sm:grid"
              style={{
                background:
                  "radial-gradient(180% 600% at 100% -130%, rgba(255,110,50,0.06) 0%, rgba(180,60,15,0.02) 20%, #171310 45%, #0e0b09 100%)",
                gridTemplateColumns: EDIT_COLUMNS,
                borderTop: i === 0 ? "none" : "1px solid " + BORDER,
              }}
            >
              <div
                className="-ml-3 flex min-w-0 items-center gap-1"
                style={{ gridColumn: "1 / 3" }}
              >
                <button
                  type="button"
                  onClick={() => onRequestDelete(ex)}
                  aria-label={"Remover " + ex.name}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all"
                  style={{ background: "transparent", color: "#dc2626" }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = "#ff7a7a";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = "#dc2626";
                  }}
                >
                  <Trash2 size={20} strokeWidth={2.4} />
                </button>

                <span
                  className="truncate font-bold"
                  style={{
                    color: TEXT,
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: "1.3rem",
                    lineHeight: 1.1,
                  }}
                >
                  {ex.name}
                </span>
              </div>

              <NumberInput
                value={ex.sets}
                onChange={(v) => onChangeField(ex.id, "sets", v)}
                ariaLabel={"Séries de " + ex.name}
                max={30}
              />
              <div />

              <NumberInput
                value={ex.reps}
                onChange={(v) => onChangeField(ex.id, "reps", v)}
                ariaLabel={"Repetições de " + ex.name}
                max={30}
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
              background:
                "radial-gradient(180% 600% at 100% -130%, rgba(255,110,50,0.06) 0%, rgba(180,60,15,0.02) 20%, #171310 45%, #0e0b09 100%)",
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
                className=" -ml-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all"
                style={{ background: "transparent", color: ORANGE }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = "#ff8f5c";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = ORANGE;
                }}
              >
                <Info size={17} strokeWidth={2.5} />
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

function NumberInput({
  value,
  onChange,
  ariaLabel,
  max = 30,
  compact = false,
}) {
  const [focused, setFocused] = useState(false);

  const numericValue = typeof value === "number" ? value : 0;
  const atMax = numericValue >= max;
  const atMin = numericValue <= 1;

  function increment() {
    const n = Math.min(max, numericValue + 1);
    onChange(n);
  }

  function decrement() {
    const n = Math.max(1, numericValue - 1);
    onChange(n);
  }

  return (
    <div className="relative">
      <input
        type="number"
        min={1}
        max={max}
        inputMode="numeric"
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === "") {
            onChange("");
            return;
          }
          const n = parseInt(raw, 10);
          if (Number.isNaN(n)) return;
          onChange(Math.min(max, Math.max(1, n)));
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={
          "w-full rounded-lg text-center text-sm font-bold outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0 " +
          (compact ? "py-1.5 px-1" : "py-2.5 pl-2 pr-6")
        }
        style={{
          background: FIELD,
          border: "1.5px solid " + (focused ? ORANGE : BORDER),
          color: TEXT,
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: "1.2rem",
        }}
      />
      {!compact && (
        <div className="absolute right-1 top-1/2 hidden -translate-y-1/2 flex-col gap-0.5 sm:flex">
          <button
            type="button"
            tabIndex={-1}
            onClick={increment}
            disabled={atMax}
            aria-label="Aumentar"
            className="flex h-3.5 w-4 items-center justify-center rounded-sm transition-colors disabled:opacity-30"
            style={{ background: "rgba(255,255,255,0.06)", color: "#c9c4bf" }}
            onMouseOver={(e) => {
              if (!atMax) e.currentTarget.style.color = ORANGE;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = "#c9c4bf";
            }}
          >
            <Plus size={10} strokeWidth={3} />
          </button>
          <button
            type="button"
            tabIndex={-1}
            onClick={decrement}
            disabled={atMin}
            aria-label="Diminuir"
            className="flex h-3.5 w-4 items-center justify-center rounded-sm transition-colors disabled:opacity-30"
            style={{ background: "rgba(255,255,255,0.06)", color: "#c9c4bf" }}
            onMouseOver={(e) => {
              if (!atMin) e.currentTarget.style.color = ORANGE;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = "#c9c4bf";
            }}
          >
            <Minus size={10} strokeWidth={3} />
          </button>
        </div>
      )}
    </div>
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
          ? "opacity-40 text-[#4a453f]"
          : "cursor-pointer text-[#c9c4bf] hover:text-[#FF4D1C]")
      }
      style={{ background: "transparent" }}
    >
      <Icon size={18} strokeWidth={2.6} />
    </button>
  );
}

function ViewActions({ onStart, disabled, blocked }) {
  const isDisabled = disabled || blocked;
  return (
    <div className="mt-10 flex justify-center">
      <button
        type="button"
        onClick={onStart}
        className="inline-flex items-center justify-center gap-2 rounded-full px-12 py-3 text-sm font-extrabold uppercase tracking-[0.05em] transition-all sm:gap-2.5 sm:px-56 sm:py-4 sm:text-base"
        style={{
          background: ORANGE,
          color: BG,
          opacity: isDisabled ? 0.5 : 1,
          boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
        }}
        onMouseOver={(e) => {
          if (isDisabled) return;
          e.currentTarget.style.background = "#ff6b42";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.4)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = ORANGE;
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.35)";
        }}
      >
        <Play size={18} strokeWidth={2.5} fill={BG} className="sm:hidden" />
        <Play
          size={20}
          strokeWidth={2.5}
          fill={BG}
          className="hidden sm:block"
        />
        Iniciar treino
      </button>
    </div>
  );
}

function EditActions({ onSave, onCancel, disabled }) {
  const [cancelHover, setCancelHover] = useState(false);
  return (
    <div className="mt-10 flex items-center justify-end gap-3">
      <button
        type="button"
        onClick={onCancel}
        onMouseEnter={() => setCancelHover(true)}
        onMouseLeave={() => setCancelHover(false)}
        className="inline-flex items-center justify-center rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-[0.05em] transition-all sm:px-6 sm:py-4 sm:text-sm"
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
        disabled={disabled}
        className="disabled:opacity-50 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-extrabold uppercase tracking-[0.01em] transition-all sm:gap-2.5 sm:px-6 sm:py-4 sm:text-base"
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
        <Save size={15} strokeWidth={2.5} className="sm:hidden" />
        <Save size={18} strokeWidth={2.5} className="hidden sm:block" />
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
        className="relative w-full max-w-md overflow-hidden rounded-2xl p-6"
        style={{
          background: "linear-gradient(180deg, #141210 0%, #17130f 100%)",
          border: "1px solid " + BORDER,
          boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
        }}
      >
        <div
          className="absolute left-2 top-2 flex h-10 w-10 items-center justify-center rounded-lg"
          style={{
            background: "transparent",
            color: "#dc2626",
          }}
        >
          <AlertTriangle size={26} strokeWidth={2} />
        </div>

        <div className="flex flex-col items-center pt-1 text-center">
          <h2
            id="confirm-delete-exercise-title"
            className="font-bold"
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
            <span style={{ color: ORANGE }}>{exercise.name}</span> deste treino?
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
            onClick={onConfirm}
            className="inline-flex w-32 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-extrabold uppercase tracking-[0.05em] transition-all"
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
            Remover
          </button>
        </div>
      </div>
    </div>
  );
}

function ExercisePickerModal({
  exercises,
  existingIds,
  isFull,
  onClose,
  onConfirm,
}) {
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
          height: "80vh",
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
              placeholder="Buscar exercício ou grupo muscular..."
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
                    disabled={disabled || isFull}
                    onClick={() => setSelectedId(ex.id)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all"
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
            disabled={!selectedId || isFull}
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

function DiscardChangesModal({ onSave, onDiscard, onClose }) {
  const primaryRef = useRef(null);

  useEffect(() => {
    primaryRef.current?.focus();
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
        role="dialog"
        aria-modal="true"
        aria-labelledby="discard-modal-title"
        className="relative w-full max-w-md overflow-hidden rounded-2xl p-6"
        style={{
          background: "linear-gradient(180deg, #141210 0%, #17130f 100%)",
          border: "1px solid " + BORDER,
          boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg transition-all"
          style={{ background: "transparent", color: MUTED }}
          onMouseOver={(e) => (e.currentTarget.style.color = TEXT)}
          onMouseOut={(e) => (e.currentTarget.style.color = MUTED)}
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div className="flex items-start gap-3 pr-8">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
            style={{ background: "rgba(255,77,28,0.14)", color: ORANGE }}
          >
            <LogOut size={20} strokeWidth={2.3} />
          </div>
          <div>
            <h2
              id="discard-modal-title"
              className="font-bold"
              style={{
                color: TEXT,
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "1.7rem",
                lineHeight: 1.05,
              }}
            >
              Salvar alterações?
            </h2>
            <p className="mt-1.5 text-sm" style={{ color: MUTED }}>
              Você tem alterações não salvas neste treino. Salve para manter o
              progresso ou descarte para sair sem salvar.
            </p>
          </div>
        </div>

        <div className="my-5" style={{ borderTop: "1px solid " + BORDER }} />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onDiscard}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold uppercase tracking-[0.05em] transition-all"
            style={{
              background: "transparent",
              color: "#ef4444",
              border: "1.5px solid rgba(239,68,68,0.5)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.1)";
              e.currentTarget.style.borderColor = "#ef4444";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.5)";
            }}
          >
            <Trash2 size={16} strokeWidth={2.4} />
            Descartar
          </button>

          <button
            ref={primaryRef}
            type="button"
            onClick={onSave}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-extrabold uppercase tracking-[0.05em] transition-all"
            style={{
              background: ORANGE,
              color: BG,
              boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#ff6b42")}
            onMouseOut={(e) => (e.currentTarget.style.background = ORANGE)}
          >
            <Save size={18} strokeWidth={2.6} />
            Salvar
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

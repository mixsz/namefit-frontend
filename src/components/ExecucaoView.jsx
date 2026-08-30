import { useState, useEffect, useRef } from "react";
import { ORANGE, BG, FIELD, BORDER, TEXT, MUTED } from "../theme";
import { ArrowLeft, Check, Trash2, X, LogOut, Plus, Minus } from "lucide-react";
import ConnectionErrorState from "./ConnectionErrorState.jsx";

function ExecucaoView({
  onFinish,
  onCancelWorkout,
  onExitWithoutFinishing,
  workout,
  loading,
  connectionError,
  onRetry,
  exitModalOpen,
  onRequestExit,
  onCloseExitModal,
}) {
  const [progress, setProgress] = useState(() =>
    (workout?.exercises ?? []).map((ex) => ({
      id: ex.id,
      done: ex.done ?? false,
      setsDone: ex.setsDone ?? ex.sets,
      repsDone: ex.repsDone ?? ex.reps,
      weight: ex.weight ?? "",
    })),
  );

  useEffect(() => {
    if (workout?.exercises) {
      setProgress(
        workout.exercises.map((ex) => ({
          id: ex.id,
          done: ex.done ?? false,
          setsDone: ex.setsDone ?? ex.sets,
          repsDone: ex.repsDone ?? ex.reps,
          weight: ex.weight ?? "",
        })),
      );
    }
  }, [workout]);

  const [expandedId, setExpandedId] = useState(null);

  const exercises = workout?.exercises ?? [];
  const doneCount = progress.filter((p) => p.done).length;
  const total = exercises.length;
  const [finishModalOpen, setFinishModalOpen] = useState(false);

  function toggleDone(id) {
    setProgress((prev) =>
      prev.map((p) => (p.id === id ? { ...p, done: !p.done } : p)),
    );
    setExpandedId((prev) => {
      const currentlyDone = progress.find((p) => p.id === id)?.done;

      if (!currentlyDone) return id;
      return prev === id ? null : prev;
    });
  }

  function toggleExpand(id) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function updateField(id, field, value) {
    setProgress((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  }

  function handleFinish() {
    if (onFinish) {
      onFinish({ workout, progress });
    } else {
      console.log("Finalizar treino:", { workout, progress });
    }
    setFinishModalOpen(false);
  }

  function handleCancelWorkout() {
    if (onCancelWorkout) {
      onCancelWorkout();
    } else {
      console.log("Cancelar treino (descartar progresso)");
    }
  }

  function handleExitWithoutFinishing() {
    if (onExitWithoutFinishing) {
      onExitWithoutFinishing({ workout, progress });
    } else {
      console.log("Sair mantendo o treino em execução");
    }
  }

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
        ) : !workout ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 text-center">
            <p style={{ color: TEXT, fontWeight: 600 }}>
              Não foi possível carregar este treino.
            </p>
            <p className="text-sm" style={{ color: MUTED }}>
              Volte para a tela de Treinos e inicie novamente.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3">
              <BackLink onExit={onRequestExit} />
            </div>
            <header className="mt-5">
              <p
                className="mb-2 ml-2 text-xs font-bold uppercase tracking-[0.15em] sm:ml-0"
                style={{ color: ORANGE }}
              >
                Treino em execução
              </p>
              <div className="-mb-2 flex min-w-0 items-end justify-between gap-4">
                <h1
                  className="ml-1 min-w-0 flex-1 truncate pb-2 pl-1 font-bold leading-[0.95] sm:ml-0"
                  style={{
                    color: TEXT,
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {workout.title}
                </h1>
                <span
                  className="ml-2 mb-2 shrink-0 rounded-full px-3 py-1.5 text-sm font-bold"
                  style={{
                    background: FIELD,
                    color: doneCount === total ? ORANGE : MUTED,
                    border:
                      "1px solid " + (doneCount === total ? ORANGE : BORDER),
                    fontFamily: "'Barlow Condensed', sans-serif",
                  }}
                >
                  {doneCount}/{total}
                </span>
              </div>

              <div
                className="h-1.5 w-full overflow-hidden rounded-full"
                style={{
                  background: FIELD,
                  marginTop: "22px",
                  marginBottom: "-6px",
                }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${total === 0 ? 0 : (doneCount / total) * 100}%`,
                    background: ORANGE,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </header>

            <section className="mt-8 flex flex-col gap-3">
              {exercises.map((ex) => {
                const p = progress.find((x) => x.id === ex.id);
                return (
                  <ExerciseRow
                    key={ex.id}
                    exercise={ex}
                    state={p}
                    expanded={expandedId === ex.id}
                    onToggleDone={() => toggleDone(ex.id)}
                    onToggleExpand={toggleExpand}
                    onChangeField={(field, value) =>
                      updateField(ex.id, field, value)
                    }
                  />
                );
              })}
            </section>

            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setFinishModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full px-12 py-3 text-sm font-extrabold uppercase tracking-[0.05em] transition-all sm:gap-2.5 sm:px-56 sm:py-4 sm:text-base"
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
                <Check size={20} strokeWidth={2.8} />
                Finalizar treino
              </button>
            </div>
          </>
        )}
      </div>

      {exitModalOpen && (
        <ExitModal
          onClose={onCloseExitModal}
          onCancelWorkout={handleCancelWorkout}
          onExitWithoutFinishing={handleExitWithoutFinishing}
        />
      )}
      {finishModalOpen && (
        <FinishConfirmModal
          doneCount={doneCount}
          total={total}
          onClose={() => setFinishModalOpen(false)}
          onConfirm={handleFinish}
        />
      )}
    </main>
  );
}

function BackLink({ onExit }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={onExit}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="inline-flex items-center gap-2 py-2 pr-4 pl-2 text-sm font-bold uppercase tracking-[0.08em] transition-all"
      style={{ color: hover ? ORANGE : MUTED, background: "transparent" }}
    >
      <ArrowLeft size={18} strokeWidth={2.5} />
      Voltar
    </button>
  );
}

function ExerciseRow({
  exercise,
  state,
  expanded,
  onToggleDone,
  onToggleExpand,
  onChangeField,
}) {
  const done = state?.done;
  return (
    <div
      className="overflow-hidden rounded-2xl transition-all"
      style={{
        background:
          "radial-gradient(300% 600% at 100% -130%, rgba(255,110,50,0.06) 0%, rgba(180,60,15,0.01) 20%, #171310 45%, #0e0b09 100%)",
        border: "1.4px solid " + (done ? "rgba(255,77,28,0.45)" : BORDER),
      }}
    >
      <div className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
        <Checkbox
          checked={done}
          onChange={onToggleDone}
          label={exercise.name}
        />

        <button
          type="button"
          onClick={() => onToggleExpand(exercise.id)}
          className="flex min-w-0 flex-1 items-center text-left"
          aria-label={"Detalhes de " + exercise.name}
        >
          <span
            className="truncate font-bold"
            style={{
              color: TEXT,
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "1.3rem",
              lineHeight: 1.1,
              opacity: done ? 0.7 : 1,
            }}
          >
            {exercise.name}
          </span>
        </button>
      </div>

      <div
        className="grid transition-all duration-300 ease-out"
        style={{
          gridTemplateRows: expanded ? "1fr" : "0fr",
          opacity: expanded ? 1 : 0,
        }}
      >
        <div className="overflow-hidden">
          <div
            className="grid grid-cols-3 gap-6 px-4 pb-3 pt-1 sm:px-5"
            style={{ borderTop: "1px solid " + BORDER }}
          >
            <LabeledInput
              label="Séries"
              value={state?.setsDone ?? ""}
              onChange={(v) => onChangeField("setsDone", v)}
              placeholder={String(exercise.sets)}
            />
            <LabeledInput
              label="Repetições"
              value={state?.repsDone ?? ""}
              onChange={(v) => onChangeField("repsDone", v)}
              placeholder={String(exercise.reps)}
            />
            <LabeledInput
              label="Peso (kg)"
              value={state?.weight ?? ""}
              onChange={(v) => onChangeField("weight", v)}
              placeholder="indef."
              max={9999}
              weakPlaceholder
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Checkbox({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={"Concluir " + label}
      onClick={onChange}
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all"
      style={{
        background: checked ? ORANGE : "transparent",
        border: "2px solid " + (checked ? ORANGE : "#4a453f"),
      }}
      onMouseOver={(e) => {
        if (!checked) e.currentTarget.style.borderColor = ORANGE;
      }}
      onMouseOut={(e) => {
        if (!checked) e.currentTarget.style.borderColor = "#4a453f";
      }}
    >
      {checked && <Check size={14} strokeWidth={3.5} color={BG} />}
    </button>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  placeholder,
  max = 99,
  weakPlaceholder = false,
}) {
  const numericValue = typeof value === "number" ? value : Number(value) || 0;
  const atMax = numericValue >= max;
  const atMin = numericValue <= 0;

  function increment() {
    onChange(Math.min(max, numericValue + 1));
  }
  function decrement() {
    onChange(Math.max(0, numericValue - 1));
  }

  return (
    <div>
      <label
        className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.1em]"
        style={{ color: MUTED }}
      >
        {label}
      </label>
      <div
        className="flex items-center justify-between rounded-lg px-1 py-0.5"
        style={{
          background: FIELD,
          border: "1.5px solid " + BORDER,
        }}
      >
        <button
          type="button"
          tabIndex={-1}
          onClick={decrement}
          disabled={atMin}
          aria-label="Diminuir"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors disabled:opacity-30"
          style={{ background: "rgba(255,255,255,0.06)", color: "#c9c4bf" }}
          onMouseOver={(e) => {
            if (!atMin) e.currentTarget.style.color = ORANGE;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = "#c9c4bf";
          }}
        >
          <Minus size={12} strokeWidth={3} />
        </button>

        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={
            "w-full min-w-0 flex-1 bg-transparent py-1 text-center outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" +
            (weakPlaceholder ? " placeholder:text-white/20" : "")
          }
          style={{
            color: TEXT,
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "1rem",
          }}
        />

        <button
          type="button"
          tabIndex={-1}
          onClick={increment}
          disabled={atMax}
          aria-label="Aumentar"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors disabled:opacity-30"
          style={{ background: "rgba(255,255,255,0.06)", color: "#c9c4bf" }}
          onMouseOver={(e) => {
            if (!atMax) e.currentTarget.style.color = ORANGE;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = "#c9c4bf";
          }}
        >
          <Plus size={12} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}

function ExitModal({ onClose, onCancelWorkout, onExitWithoutFinishing }) {
  const dialogRef = useRef(null);
  const primaryRef = useRef(null);

  useEffect(() => {
    primaryRef.current?.focus();

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll(
          "button:not([disabled])",
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
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
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-modal-title"
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
              id="exit-modal-title"
              className="font-bold"
              style={{
                color: TEXT,
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "1.7rem",
                lineHeight: 1.05,
              }}
            >
              Sair do treino?
            </h2>
            <p className="mt-1 text-sm" style={{ color: MUTED }}>
              Você ainda não finalizou este treino. Salve o progresso pra
              continuar depois, ou descarte esta sessão por completo.
            </p>
          </div>
        </div>

        <div className="my-5" style={{ borderTop: "1px solid " + BORDER }} />

        <div className="flex flex-col gap-3">
          <button
            ref={primaryRef}
            type="button"
            onClick={onExitWithoutFinishing}
            className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-extrabold uppercase tracking-[0.05em] transition-all"
            style={{
              background: ORANGE,
              color: BG,
              boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#ff6b42")}
            onMouseOut={(e) => (e.currentTarget.style.background = ORANGE)}
          >
            <LogOut size={18} strokeWidth={2.6} />
            Salvar progresso e sair
          </button>

          <button
            type="button"
            onClick={onCancelWorkout}
            className="inline-flex items-center justify-center gap-1 py-1 text-[11px] font-semibold uppercase tracking-[0.03em] transition-colors"
            style={{ background: "transparent", color: "#8a5750" }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#ef4444")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#8a5750")}
          >
            <Trash2 size={12} strokeWidth={2.4} />
            Descartar sessão de treino
          </button>
        </div>
      </div>
    </div>
  );
}

function FinishConfirmModal({ doneCount, total, onClose, onConfirm }) {
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
        aria-labelledby="finish-modal-title"
        className="relative w-full max-w-md overflow-hidden rounded-2xl p-6"
        style={{
          background: "linear-gradient(180deg, #141210 0%, #17130f 100%)",
          border: "1px solid " + BORDER,
          boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
        }}
      >
        <div className="flex items-start gap-3 pr-4">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
            style={{ background: "rgba(255,77,28,0.14)", color: ORANGE }}
          >
            <Check size={20} strokeWidth={2.6} />
          </div>
          <div>
            <h2
              id="finish-modal-title"
              className="font-bold"
              style={{
                color: TEXT,
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "1.7rem",
                lineHeight: 1.05,
              }}
            >
              Finalizar treino?
            </h2>
            <p className="mt-1 text-sm" style={{ color: MUTED }}>
              {doneCount === total
                ? "Você concluiu todos os exercícios. "
                : `Você concluiu ${doneCount} de ${total} exercícios. `}
              Os dados registrados serão salvos no seu histórico.
            </p>
          </div>
        </div>

        <div className="my-5" style={{ borderTop: "1px solid " + BORDER }} />

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-extrabold uppercase tracking-[0.05em] transition-all"
            style={{
              background: ORANGE,
              color: BG,
              boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#ff6b42")}
            onMouseOut={(e) => (e.currentTarget.style.background = ORANGE)}
          >
            <Check size={18} strokeWidth={2.6} />
            Sim, finalizar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold uppercase tracking-[0.03em] transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              color: TEXT,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            }}
          >
            Continuar treino
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExecucaoView;

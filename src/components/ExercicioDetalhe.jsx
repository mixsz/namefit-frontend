import { useEffect } from "react";
import { ORANGE, FIELD, BORDER, TEXT, MUTED } from "../theme";
import { X } from "lucide-react";
import MuscleIcon from "./MuscleIcon";

export default function ExercicioDetalhe({ exercise, onClose }) {
  useEffect(() => {
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
        aria-label={"Detalhes de " + exercise.name}
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

        <div className="pt-4" style={{ borderTop: "1px solid " + BORDER }}>
          <p
            className="text-xs font-bold uppercase tracking-[0.15em]"
            style={{ color: "#e8956a" }}
          >
            Como executar
          </p>
          <p className="mt-2.5 text-sm leading-relaxed" style={{ color: TEXT }}>
            {exercise.description ||
              "Descrição não disponível para este exercício."}
          </p>
        </div>
      </div>
    </div>
  );
}

import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { ORANGE, PANEL, BORDER, TEXT, MUTED } from "../theme";
import { useToast } from "../hooks/useToast.js";

const TYPE_STYLES = {
  success: { icon: CheckCircle2, color: ORANGE },
  error: { icon: XCircle, color: "#ef4444" },
  info: { icon: Info, color: "#6b9fff" },
};

function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-24 right-6 z-[100] flex flex-col gap-3"
      style={{ pointerEvents: "none" }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }) {
  const { icon: Icon, color } = TYPE_STYLES[toast.type] || TYPE_STYLES.success;

  return (
    <div
      role="status"
      className="flex items-center gap-3 rounded-xl px-5 py-4 shadow-lg"
      style={{
        background: PANEL,
        border: "1px solid " + BORDER,
        boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
        minWidth: "320px",
        maxWidth: "420px",
        pointerEvents: "auto",
        animation: "toast-slide-in 0.2s ease-out",
      }}
    >
      <Icon size={24} color={color} style={{ flexShrink: 0 }} />
      <p className="flex-1 text-base font-semibold" style={{ color: TEXT }}>
        {toast.message}
      </p>
      <button
        type="button"
        onClick={() => onClose(toast.id)}
        aria-label="Fechar"
        className="rounded-md p-1 transition-colors"
        style={{ color: MUTED, flexShrink: 0 }}
        onMouseOver={(e) => (e.currentTarget.style.color = TEXT)}
        onMouseOut={(e) => (e.currentTarget.style.color = MUTED)}
      >
        <X size={16} />
      </button>

      <style>{`
        @keyframes toast-slide-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default ToastContainer;

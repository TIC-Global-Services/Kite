"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiCheck, FiX, FiAlertCircle } from "react-icons/fi";

// ── Types ──────────────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

// ── Context ────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => dismiss(id), 4000);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* ── Toast stack ── */}
      <div className="fixed top-6 right-6 z-[999] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <Toast key={t.id} item={t} onDismiss={() => dismiss(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// ── Single toast ───────────────────────────────────────────────────────────

const config: Record<ToastType, { icon: React.ReactNode; bg: string; bar: string }> = {
  success: {
    icon: <FiCheck size={13} strokeWidth={2.5} />,
    bg: "bg-primary text-background",
    bar: "bg-background/30",
  },
  error: {
    icon: <FiAlertCircle size={13} strokeWidth={2.5} />,
    bg: "bg-[#6B2020] text-background",
    bar: "bg-background/30",
  },
  info: {
    icon: <FiAlertCircle size={13} strokeWidth={2.5} />,
    bg: "bg-primary text-background",
    bar: "bg-background/30",
  },
};

function Toast({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const { icon, bg, bar } = config[item.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 48, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 48, scale: 0.96 }}
      transition={{ duration: 0.22, ease: [0.25, 0.1, 0, 1] }}
      className={`pointer-events-auto relative overflow-hidden min-w-[300px] max-w-sm ${bg}`}
    >
      {/* Content */}
      <div className="flex items-start gap-3 px-5 py-4">
        <div className="flex-shrink-0 w-5 h-5 rounded-full border border-current flex items-center justify-center mt-px">
          {icon}
        </div>
        <p className="flex-1 text-sm font-ki leading-snug">{item.message}</p>
        <button
          onClick={onDismiss}
          className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity mt-px"
          aria-label="Dismiss"
        >
          <FiX size={14} />
        </button>
      </div>

      {/* Auto-dismiss progress bar */}
      <motion.div
        className={`absolute bottom-0 left-0 h-[2px] ${bar}`}
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 4, ease: "linear" }}
      />
    </motion.div>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be inside <ToastProvider>");
  return ctx.toast;
}

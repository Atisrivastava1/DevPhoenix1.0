"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, X, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastEvent {
  message: string;
  type: ToastType;
}

type ToastListener = (event: ToastEvent) => void;
const listeners = new Set<ToastListener>();

export function showToast(message: string, type: ToastType = "info") {
  listeners.forEach(listener => listener({ message, type }));
}

export function PremiumToastContainer() {
  const [toasts, setToasts] = useState<(ToastEvent & { id: string })[]>([]);

  useEffect(() => {
    const handleEvent: ToastListener = (event) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { ...event, id }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };

    listeners.add(handleEvent);
    return () => {
      listeners.delete(handleEvent);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl border shadow-lg backdrop-blur-md ${
              toast.type === "success"
                ? "bg-emerald-50/95 border-emerald-200 text-emerald-950"
                : toast.type === "error"
                ? "bg-rose-50/95 border-rose-200 text-rose-950"
                : "bg-blue-50/95 border-blue-200 text-blue-950"
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
              {toast.type === "error" && <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />}
              {toast.type === "info" && <Info className="w-5 h-5 text-blue-500 shrink-0" />}
              <span className="text-sm font-semibold">{toast.message}</span>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="p-1 rounded-lg hover:bg-black/5 transition-colors ml-4"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

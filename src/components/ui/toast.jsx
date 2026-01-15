"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex w-full items-start gap-3 rounded-lg border bg-white p-4 shadow-lg animate-in slide-in-from-right-full duration-300",
              toast.type === "success" && "border-green-100 bg-green-50/50",
              toast.type === "error" && "border-red-100 bg-red-50/50",
              toast.type === "info" && "border-blue-100 bg-blue-50/50"
            )}
          >
            <div className="shrink-0 pt-0.5">
              {toast.type === "success" && <CheckCircle className="h-5 w-5 text-green-600" />}
              {toast.type === "error" && <AlertCircle className="h-5 w-5 text-red-600" />}
              {toast.type === "info" && <Info className="h-5 w-5 text-blue-600" />}
            </div>
            <div className="flex-1 text-sm font-medium text-gray-900 leading-tight pt-0.5">
              {messageFormatter(toast.message)}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 rounded-md p-0.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100/50 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Helper to handle both string and object messages
function messageFormatter(message) {
  if (typeof message === 'string') return message;
  if (message?.message) return message.message;
  return "An unexpected event occurred";
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

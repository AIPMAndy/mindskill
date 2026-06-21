'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(7);
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto"
            >
              <ToastItem toast={toast} onClose={() => removeToast(toast.id)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onClose }: { toast: Toast; onClose: () => void }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-600" strokeWidth={2} />,
    error: <XCircle className="w-5 h-5 text-red-600" strokeWidth={2} />,
    info: <Info className="w-5 h-5 text-blue-600" strokeWidth={2} />,
  };

  const styles = {
    success: 'bg-white border-green-200 shadow-[0_4px_20px_rgba(34,197,94,0.2)]',
    error: 'bg-white border-red-200 shadow-[0_4px_20px_rgba(239,68,68,0.2)]',
    info: 'bg-white border-blue-200 shadow-[0_4px_20px_rgba(59,130,246,0.2)]',
  };

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl border-2 backdrop-blur-sm
        min-w-[320px] max-w-[420px]
        ${styles[toast.type]}
      `}
    >
      <div className="flex-shrink-0">{icons[toast.type]}</div>
      <p className="flex-1 text-sm font-light text-[#1A1A1A] tracking-wide">
        {toast.message}
      </p>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <X className="w-4 h-4 text-[#8A8A8A]" strokeWidth={2} />
      </button>
    </div>
  );
};

'use client';

import { ReactNode } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '确认',
  cancelText = '取消',
  type = 'danger',
}: ConfirmDialogProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const icons = {
    danger: <AlertTriangle className="w-12 h-12 text-red-600" strokeWidth={1.5} />,
    warning: <AlertTriangle className="w-12 h-12 text-amber-600" strokeWidth={1.5} />,
    info: <AlertTriangle className="w-12 h-12 text-blue-600" strokeWidth={1.5} />,
  };

  const confirmStyles = {
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white',
    info: 'bg-blue-600 hover:bg-blue-700 text-white',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
      <div className="text-center py-4">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
            {icons[type]}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-light text-[#1A1A1A] mb-4 tracking-wide">
          {title}
        </h3>

        {/* Message */}
        <p className="text-base text-[#8A8A8A] font-light leading-relaxed tracking-wide mb-8">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-8 py-3 text-base font-light tracking-wide text-[#1A1A1A] border border-[#E5E5E0] rounded-full hover:bg-[#F5F5F0] transition-all duration-300"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-8 py-3 text-base font-light tracking-wide rounded-full transition-all duration-300 ${confirmStyles[type]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

'use client';

import React, { useState } from 'react';
import { X, Palette, RotateCcw } from 'lucide-react';
import { Theme } from '@/lib/themes';

export interface ThemeCustomizerProps {
  isOpen: boolean;
  currentTheme: Theme;
  onSave: (theme: Theme) => void;
  onClose: () => void;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  isOpen,
  currentTheme,
  onSave,
  onClose,
}) => {
  const [customTheme, setCustomTheme] = useState<Theme>(currentTheme);

  // Reset to current theme when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setCustomTheme(currentTheme);
    }
  }, [isOpen, currentTheme]);

  // Keyboard support: Escape to close
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const updateColor = (key: keyof Theme['colors'], value: string) => {
    setCustomTheme({
      ...customTheme,
      colors: {
        ...customTheme.colors,
        [key]: value,
      },
    });
  };

  const handleSave = () => {
    onSave(customTheme);
    onClose();
  };

  const handleReset = () => {
    setCustomTheme(currentTheme);
  };

  const colorFields: Array<{ key: keyof Theme['colors']; label: string }> = [
    { key: 'primary', label: 'Primary' },
    { key: 'secondary', label: 'Secondary' },
    { key: 'accent', label: 'Accent' },
    { key: 'background', label: 'Background' },
    { key: 'text', label: 'Text' },
    { key: 'textSecondary', label: 'Text Secondary' },
    { key: 'border', label: 'Border' },
    { key: 'borderHover', label: 'Border Hover' },
    { key: 'rootGradientFrom', label: 'Root Gradient From' },
    { key: 'rootGradientTo', label: 'Root Gradient To' },
    { key: 'connection', label: 'Connection' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Theme Customizer</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Color Controls */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Colors</h4>
              {colorFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={customTheme.colors[field.key]}
                      onChange={(e) => updateColor(field.key, e.target.value)}
                      className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customTheme.colors[field.key]}
                      onChange={(e) => updateColor(field.key, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Preview Pane */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Preview</h4>
              <div
                className="p-6 rounded-lg border-2"
                style={{
                  backgroundColor: customTheme.colors.background,
                  borderColor: customTheme.colors.border,
                }}
              >
                {/* Root Node Preview */}
                <div
                  className="px-6 py-3 rounded-2xl mb-4 text-center"
                  style={{
                    background: `linear-gradient(135deg, ${customTheme.colors.rootGradientFrom}, ${customTheme.colors.rootGradientTo})`,
                    color: customTheme.colors.primary === customTheme.colors.background
                      ? customTheme.colors.text
                      : '#FFFFFF',
                  }}
                >
                  <p className="text-base font-normal">Root Node</p>
                </div>

                {/* Child Node Preview */}
                <div
                  className="px-6 py-3 rounded-2xl border-2 bg-white mb-4"
                  style={{
                    borderColor: customTheme.colors.border,
                    color: customTheme.colors.text,
                  }}
                >
                  <p className="text-base font-light">Child Node</p>
                </div>

                {/* Selected Node Preview */}
                <div
                  className="px-6 py-3 rounded-2xl border-2 bg-white"
                  style={{
                    borderColor: customTheme.colors.accent,
                    color: customTheme.colors.text,
                    boxShadow: `0 4px 12px ${customTheme.colors.accent}33`,
                  }}
                >
                  <p className="text-base font-light">Selected Node</p>
                </div>

                {/* Connection Line Preview */}
                <div className="mt-4 flex items-center gap-2">
                  <div
                    className="flex-1 h-0.5"
                    style={{ backgroundColor: customTheme.colors.connection }}
                  />
                  <span className="text-xs" style={{ color: customTheme.colors.textSecondary }}>
                    Connection
                  </span>
                </div>
              </div>

              {/* Theme Info */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Theme Name</h5>
                <input
                  type="text"
                  value={customTheme.name}
                  onChange={(e) => setCustomTheme({ ...customTheme, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="My Custom Theme"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Default
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Save Theme
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

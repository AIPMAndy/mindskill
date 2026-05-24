'use client';

import { useState, useEffect } from 'react';
import { useExport, ExportFormat } from '@/hooks/useExport';
import { X, Download, Loader2 } from 'lucide-react';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  canvasRef: React.RefObject<HTMLElement>;
}

export function ExportDialog({ isOpen, onClose, canvasRef }: ExportDialogProps) {
  const [format, setFormat] = useState<ExportFormat>('png');
  const [filename, setFilename] = useState('mindmap');
  const [quality, setQuality] = useState(1.0);

  const { isExporting, exportError, exportMindMap } = useExport();

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleExport = async () => {
    if (!canvasRef.current) return;

    const filenameWithExtension = `${filename}.${format}`;
    await exportMindMap(canvasRef.current, {
      format,
      filename: filenameWithExtension,
      ...(format === 'png' && { quality }),
    });
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleOverlayClick}
      data-testid="modal-overlay"
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Export Mind Map</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Format
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="format"
                value="png"
                checked={format === 'png'}
                onChange={(e) => setFormat(e.target.value as ExportFormat)}
                className="mr-2"
                aria-label="PNG"
              />
              <span className="text-gray-900">PNG</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="format"
                value="pdf"
                checked={format === 'pdf'}
                onChange={(e) => setFormat(e.target.value as ExportFormat)}
                className="mr-2"
                aria-label="PDF"
              />
              <span className="text-gray-900">PDF</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="format"
                value="svg"
                checked={format === 'svg'}
                onChange={(e) => setFormat(e.target.value as ExportFormat)}
                className="mr-2"
                aria-label="SVG"
              />
              <span className="text-gray-900">SVG</span>
            </label>
          </div>
        </div>

        {/* Filename Input */}
        <div className="mb-6">
          <label htmlFor="filename" className="block text-sm font-medium text-gray-700 mb-2">
            Filename
          </label>
          <div className="flex items-center">
            <input
              id="filename"
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Filename"
            />
            <span className="ml-2 text-gray-500">.{format}</span>
          </div>
        </div>

        {/* Quality Slider (only for PNG) */}
        {format === 'png' && (
          <div className="mb-6">
            <label htmlFor="quality" className="block text-sm font-medium text-gray-700 mb-2">
              Quality
            </label>
            <div className="flex items-center gap-3">
              <input
                id="quality"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="flex-1"
                aria-label="Quality"
              />
              <span className="text-sm text-gray-600 w-12 text-right">
                {(quality * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {exportError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{exportError}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

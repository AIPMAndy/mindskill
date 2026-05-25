'use client';

import React, { useState, useEffect } from 'react';
import { X, FileText } from 'lucide-react';

export interface NodeNoteEditorProps {
  isOpen: boolean;
  note?: string;
  onSave: (note: string) => void;
  onClose: () => void;
}

export const NodeNoteEditor: React.FC<NodeNoteEditorProps> = ({
  isOpen,
  note = '',
  onSave,
  onClose,
}) => {
  const [noteText, setNoteText] = useState(note);
  const [showPreview, setShowPreview] = useState(false);

  // Reset note text when modal opens with new note
  useEffect(() => {
    if (isOpen) {
      setNoteText(note);
    }
  }, [isOpen, note]);

  // Keyboard support: Escape to cancel
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    onSave(noteText);
    onClose();
  };

  const handleCancel = () => {
    setNoteText(note);
    onClose();
  };

  // Simple markdown preview (basic formatting)
  const renderPreview = (text: string) => {
    let html = text;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

    // Code
    html = html.replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>');

    // Line breaks
    html = html.replace(/\n/g, '<br />');

    return html;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={handleCancel} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Node Note</h3>
          </div>
          <button
            onClick={handleCancel}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Preview Toggle */}
        <div className="flex gap-2 px-6 py-3 border-b border-gray-200">
          <button
            onClick={() => setShowPreview(false)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !showPreview
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showPreview
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Preview
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!showPreview ? (
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write your note here... (Markdown supported)"
              className="w-full h-full min-h-[300px] p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
              autoFocus
            />
          ) : (
            <div
              className="prose prose-sm max-w-none p-4 border border-gray-200 rounded-lg min-h-[300px] bg-gray-50"
              dangerouslySetInnerHTML={{ __html: renderPreview(noteText) }}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-500">
            {noteText.length} characters
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

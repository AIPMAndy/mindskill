import { useEffect, useRef } from 'react';

interface ShortcutHandlers {
  onUndo?: () => void;
  onRedo?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onCut?: () => void;
  onDelete?: () => void;
  onSave?: () => void;
  onSearch?: () => void;
  onAddSibling?: () => void;
  onAddChild?: () => void;
  onEdit?: () => void;
  onToggleExpand?: () => void;
  onEscape?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      const h = handlersRef.current;

      // Cmd/Ctrl + Z - Undo
      if (isMod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        h.onUndo?.();
        return;
      }

      // Cmd/Ctrl + Shift + Z - Redo
      if (isMod && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        h.onRedo?.();
        return;
      }

      // Cmd/Ctrl + C - Copy
      if (isMod && e.key === 'c') {
        e.preventDefault();
        h.onCopy?.();
        return;
      }

      // Cmd/Ctrl + V - Paste
      if (isMod && e.key === 'v') {
        e.preventDefault();
        h.onPaste?.();
        return;
      }

      // Cmd/Ctrl + X - Cut
      if (isMod && e.key === 'x') {
        e.preventDefault();
        h.onCut?.();
        return;
      }

      // Cmd/Ctrl + S - Save
      if (isMod && e.key === 's') {
        e.preventDefault();
        h.onSave?.();
        return;
      }

      // Cmd/Ctrl + F - Search
      if (isMod && e.key === 'f') {
        e.preventDefault();
        h.onSearch?.();
        return;
      }

      // Delete - Delete node
      if (e.key === 'Delete' || e.key === 'Backspace') {
        h.onDelete?.();
        return;
      }

      // Enter - Add sibling
      if (e.key === 'Enter') {
        e.preventDefault();
        h.onAddSibling?.();
        return;
      }

      // Tab - Add child
      if (e.key === 'Tab') {
        e.preventDefault();
        h.onAddChild?.();
        return;
      }

      // F2 - Edit node
      if (e.key === 'F2') {
        e.preventDefault();
        h.onEdit?.();
        return;
      }

      // Space - Toggle expand
      if (e.key === ' ') {
        e.preventDefault();
        h.onToggleExpand?.();
        return;
      }

      // Escape
      if (e.key === 'Escape') {
        h.onEscape?.();
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
}

import { useEffect } from 'react';

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
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;

      // Cmd/Ctrl + Z - Undo
      if (isMod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handlers.onUndo?.();
        return;
      }

      // Cmd/Ctrl + Shift + Z - Redo
      if (isMod && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        handlers.onRedo?.();
        return;
      }

      // Cmd/Ctrl + C - Copy
      if (isMod && e.key === 'c') {
        e.preventDefault();
        handlers.onCopy?.();
        return;
      }

      // Cmd/Ctrl + V - Paste
      if (isMod && e.key === 'v') {
        e.preventDefault();
        handlers.onPaste?.();
        return;
      }

      // Cmd/Ctrl + X - Cut
      if (isMod && e.key === 'x') {
        e.preventDefault();
        handlers.onCut?.();
        return;
      }

      // Cmd/Ctrl + S - Save
      if (isMod && e.key === 's') {
        e.preventDefault();
        handlers.onSave?.();
        return;
      }

      // Cmd/Ctrl + F - Search
      if (isMod && e.key === 'f') {
        e.preventDefault();
        handlers.onSearch?.();
        return;
      }

      // Delete - Delete node
      if (e.key === 'Delete' || e.key === 'Backspace') {
        handlers.onDelete?.();
        return;
      }

      // Enter - Add sibling
      if (e.key === 'Enter') {
        e.preventDefault();
        handlers.onAddSibling?.();
        return;
      }

      // Tab - Add child
      if (e.key === 'Tab') {
        e.preventDefault();
        handlers.onAddChild?.();
        return;
      }

      // F2 - Edit node
      if (e.key === 'F2') {
        e.preventDefault();
        handlers.onEdit?.();
        return;
      }

      // Space - Toggle expand
      if (e.key === ' ') {
        e.preventDefault();
        handlers.onToggleExpand?.();
        return;
      }

      // Escape
      if (e.key === 'Escape') {
        handlers.onEscape?.();
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}

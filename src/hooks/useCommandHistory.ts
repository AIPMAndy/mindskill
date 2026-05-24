import { useRef, useCallback } from 'react';
import { Command } from '../lib/commands/Command';

const MAX_HISTORY_SIZE = 50;

interface CommandHistoryState {
  undoStack: Command[];
  redoStack: Command[];
}

export function useCommandHistory() {
  const stateRef = useRef<CommandHistoryState>({
    undoStack: [],
    redoStack: []
  });

  const executeCommand = useCallback((command: Command) => {
    command.execute();
    stateRef.current.undoStack.push(command);

    if (stateRef.current.undoStack.length > MAX_HISTORY_SIZE) {
      stateRef.current.undoStack.shift();
    }

    stateRef.current.redoStack = [];
  }, []);

  const undo = useCallback(() => {
    if (stateRef.current.undoStack.length === 0) return;

    const command = stateRef.current.undoStack.pop();
    if (command) {
      command.undo();
      stateRef.current.redoStack.push(command);
    }
  }, []);

  const redo = useCallback(() => {
    if (stateRef.current.redoStack.length === 0) return;

    const command = stateRef.current.redoStack.pop();
    if (command) {
      command.redo();
      stateRef.current.undoStack.push(command);
    }
  }, []);

  const canUndo = useCallback(() => stateRef.current.undoStack.length > 0, []);
  const canRedo = useCallback(() => stateRef.current.redoStack.length > 0, []);

  return {
    executeCommand,
    undo,
    redo,
    canUndo,
    canRedo
  };
}

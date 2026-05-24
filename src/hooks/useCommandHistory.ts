import { Command } from '../lib/commands/Command';

const MAX_HISTORY_SIZE = 50;

interface CommandHistoryState {
  undoStack: Command[];
  redoStack: Command[];
}

export function useCommandHistory() {
  const state: CommandHistoryState = {
    undoStack: [],
    redoStack: []
  };

  const executeCommand = (command: Command) => {
    command.execute();
    state.undoStack.push(command);

    if (state.undoStack.length > MAX_HISTORY_SIZE) {
      state.undoStack.shift();
    }

    state.redoStack = [];
  };

  const undo = () => {
    if (state.undoStack.length === 0) return;

    const command = state.undoStack.pop();
    if (command) {
      command.undo();
      state.redoStack.push(command);
    }
  };

  const redo = () => {
    if (state.redoStack.length === 0) return;

    const command = state.redoStack.pop();
    if (command) {
      command.redo();
      state.undoStack.push(command);
    }
  };

  const canUndo = () => state.undoStack.length > 0;
  const canRedo = () => state.redoStack.length > 0;

  return {
    executeCommand,
    undo,
    redo,
    canUndo,
    canRedo
  };
}

/**
 * Command pattern interface for implementing undo/redo functionality.
 * Each command encapsulates a single action that can be executed, undone, and redone.
 */
export interface Command {
  /**
   * Executes the command, applying its changes.
   * Should be idempotent - calling multiple times should have the same effect as calling once.
   */
  execute(): void;

  /**
   * Undoes the command, reverting its changes.
   * Should only be called after execute() has been called.
   */
  undo(): void;

  /**
   * Redoes the command, reapplying its changes after an undo.
   * Should only be called after undo() has been called.
   */
  redo(): void;
}

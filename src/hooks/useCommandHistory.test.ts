import { useCommandHistory } from './useCommandHistory';
import { Command } from '../lib/commands/Command';

class MockCommand implements Command {
  executed = false;

  execute() {
    this.executed = true;
  }

  undo() {
    this.executed = false;
  }

  redo() {
    this.execute();
  }
}

describe('useCommandHistory', () => {
  it('should execute command and add to history', () => {
    const history = useCommandHistory();
    const cmd = new MockCommand();

    history.executeCommand(cmd);

    expect(cmd.executed).toBe(true);
    expect(history.canUndo()).toBe(true);
    expect(history.canRedo()).toBe(false);
  });

  it('should undo and redo commands', () => {
    const history = useCommandHistory();
    const cmd = new MockCommand();

    history.executeCommand(cmd);

    history.undo();

    expect(cmd.executed).toBe(false);
    expect(history.canUndo()).toBe(false);
    expect(history.canRedo()).toBe(true);

    history.redo();

    expect(cmd.executed).toBe(true);
  });

  it('should clear redo stack when executing new command after undo', () => {
    const history = useCommandHistory();
    const cmd1 = new MockCommand();
    const cmd2 = new MockCommand();

    history.executeCommand(cmd1);
    history.undo();
    history.executeCommand(cmd2);

    expect(history.canRedo()).toBe(false);
    expect(cmd1.executed).toBe(false);
    expect(cmd2.executed).toBe(true);
  });

  it('should handle multiple undo/redo operations', () => {
    const history = useCommandHistory();
    const cmd1 = new MockCommand();
    const cmd2 = new MockCommand();
    const cmd3 = new MockCommand();

    history.executeCommand(cmd1);
    history.executeCommand(cmd2);
    history.executeCommand(cmd3);

    expect(cmd1.executed).toBe(true);
    expect(cmd2.executed).toBe(true);
    expect(cmd3.executed).toBe(true);

    history.undo();
    expect(cmd3.executed).toBe(false);
    expect(history.canUndo()).toBe(true);

    history.undo();
    expect(cmd2.executed).toBe(false);
    expect(history.canUndo()).toBe(true);

    history.undo();
    expect(cmd1.executed).toBe(false);
    expect(history.canUndo()).toBe(false);

    history.redo();
    expect(cmd1.executed).toBe(true);
    expect(history.canRedo()).toBe(true);
  });

  it('should enforce max history size', () => {
    const history = useCommandHistory();
    const commands: MockCommand[] = [];

    // Execute 60 commands (exceeds MAX_HISTORY_SIZE of 50)
    for (let i = 0; i < 60; i++) {
      const cmd = new MockCommand();
      commands.push(cmd);
      history.executeCommand(cmd);
    }

    // Undo all 50 commands that should be in history
    for (let i = 0; i < 50; i++) {
      history.undo();
    }

    // Should not be able to undo anymore (first 10 commands were dropped)
    expect(history.canUndo()).toBe(false);
  });

  it('should not undo when history is empty', () => {
    const history = useCommandHistory();
    const cmd = new MockCommand();

    history.executeCommand(cmd);
    history.undo();
    history.undo(); // Should be no-op

    expect(cmd.executed).toBe(false);
    expect(history.canUndo()).toBe(false);
  });

  it('should not redo when redo stack is empty', () => {
    const history = useCommandHistory();
    const cmd = new MockCommand();

    history.executeCommand(cmd);
    history.redo(); // Should be no-op

    expect(cmd.executed).toBe(true);
    expect(history.canRedo()).toBe(false);
  });
});

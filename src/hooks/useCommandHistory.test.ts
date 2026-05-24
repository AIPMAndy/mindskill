import { renderHook, act } from '@testing-library/react';
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
    const { result } = renderHook(() => useCommandHistory());
    const cmd = new MockCommand();

    act(() => {
      result.current.executeCommand(cmd);
    });

    expect(cmd.executed).toBe(true);
    expect(result.current.canUndo()).toBe(true);
    expect(result.current.canRedo()).toBe(false);
  });

  it('should undo and redo commands', () => {
    const { result } = renderHook(() => useCommandHistory());
    const cmd = new MockCommand();

    act(() => {
      result.current.executeCommand(cmd);
    });

    act(() => {
      result.current.undo();
    });

    expect(cmd.executed).toBe(false);
    expect(result.current.canUndo()).toBe(false);
    expect(result.current.canRedo()).toBe(true);

    act(() => {
      result.current.redo();
    });

    expect(cmd.executed).toBe(true);
  });

  it('should clear redo stack when executing new command after undo', () => {
    const { result } = renderHook(() => useCommandHistory());
    const cmd1 = new MockCommand();
    const cmd2 = new MockCommand();

    act(() => {
      result.current.executeCommand(cmd1);
      result.current.undo();
      result.current.executeCommand(cmd2);
    });

    expect(result.current.canRedo()).toBe(false);
    expect(cmd1.executed).toBe(false);
    expect(cmd2.executed).toBe(true);
  });

  it('should handle multiple undo/redo operations', () => {
    const { result } = renderHook(() => useCommandHistory());
    const cmd1 = new MockCommand();
    const cmd2 = new MockCommand();
    const cmd3 = new MockCommand();

    act(() => {
      result.current.executeCommand(cmd1);
      result.current.executeCommand(cmd2);
      result.current.executeCommand(cmd3);
    });

    expect(cmd1.executed).toBe(true);
    expect(cmd2.executed).toBe(true);
    expect(cmd3.executed).toBe(true);

    act(() => {
      result.current.undo();
    });
    expect(cmd3.executed).toBe(false);
    expect(result.current.canUndo()).toBe(true);

    act(() => {
      result.current.undo();
    });
    expect(cmd2.executed).toBe(false);
    expect(result.current.canUndo()).toBe(true);

    act(() => {
      result.current.undo();
    });
    expect(cmd1.executed).toBe(false);
    expect(result.current.canUndo()).toBe(false);

    act(() => {
      result.current.redo();
    });
    expect(cmd1.executed).toBe(true);
    expect(result.current.canRedo()).toBe(true);
  });

  it('should enforce max history size', () => {
    const { result } = renderHook(() => useCommandHistory());
    const commands: MockCommand[] = [];

    act(() => {
      // Execute 60 commands (exceeds MAX_HISTORY_SIZE of 50)
      for (let i = 0; i < 60; i++) {
        const cmd = new MockCommand();
        commands.push(cmd);
        result.current.executeCommand(cmd);
      }
    });

    act(() => {
      // Undo all 50 commands that should be in history
      for (let i = 0; i < 50; i++) {
        result.current.undo();
      }
    });

    // Should not be able to undo anymore (first 10 commands were dropped)
    expect(result.current.canUndo()).toBe(false);
  });

  it('should not undo when history is empty', () => {
    const { result } = renderHook(() => useCommandHistory());
    const cmd = new MockCommand();

    act(() => {
      result.current.executeCommand(cmd);
      result.current.undo();
      result.current.undo(); // Should be no-op
    });

    expect(cmd.executed).toBe(false);
    expect(result.current.canUndo()).toBe(false);
  });

  it('should not redo when redo stack is empty', () => {
    const { result } = renderHook(() => useCommandHistory());
    const cmd = new MockCommand();

    act(() => {
      result.current.executeCommand(cmd);
      result.current.redo(); // Should be no-op
    });

    expect(cmd.executed).toBe(true);
    expect(result.current.canRedo()).toBe(false);
  });
});

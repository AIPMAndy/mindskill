import { Command } from './Command';

class TestCommand implements Command {
  private executed = false;

  execute(): void {
    this.executed = true;
  }

  undo(): void {
    this.executed = false;
  }

  redo(): void {
    this.execute();
  }

  isExecuted(): boolean {
    return this.executed;
  }
}

describe('Command', () => {
  it('should execute, undo, and redo', () => {
    const cmd = new TestCommand();

    expect(cmd.isExecuted()).toBe(false);

    cmd.execute();
    expect(cmd.isExecuted()).toBe(true);

    cmd.undo();
    expect(cmd.isExecuted()).toBe(false);

    cmd.redo();
    expect(cmd.isExecuted()).toBe(true);
  });

  it('should be idempotent - multiple executes have same effect', () => {
    const cmd = new TestCommand();

    cmd.execute();
    expect(cmd.isExecuted()).toBe(true);

    cmd.execute();
    expect(cmd.isExecuted()).toBe(true);
  });

  it('should handle undo without execute gracefully', () => {
    const cmd = new TestCommand();

    expect(() => cmd.undo()).not.toThrow();
    expect(cmd.isExecuted()).toBe(false);
  });

  it('should handle redo without undo gracefully', () => {
    const cmd = new TestCommand();

    cmd.execute();
    expect(() => cmd.redo()).not.toThrow();
    expect(cmd.isExecuted()).toBe(true);
  });
});

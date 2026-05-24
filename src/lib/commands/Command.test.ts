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
});

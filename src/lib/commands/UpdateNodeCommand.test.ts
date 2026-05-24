import { UpdateNodeCommand } from './UpdateNodeCommand';
import { MindNode } from '../types';

describe('UpdateNodeCommand', () => {
  it('should update and revert node text', () => {
    const nodes: MindNode[] = [{
      id: 'node1',
      text: 'Original',
      children: []
    }];

    const cmd = new UpdateNodeCommand(nodes, 'node1', 'Updated');

    cmd.execute();
    expect(nodes[0].text).toBe('Updated');

    cmd.undo();
    expect(nodes[0].text).toBe('Original');

    cmd.redo();
    expect(nodes[0].text).toBe('Updated');
  });

  it('should be idempotent', () => {
    const nodes: MindNode[] = [{
      id: 'node1',
      text: 'Original',
      children: []
    }];

    const cmd = new UpdateNodeCommand(nodes, 'node1', 'Updated');

    cmd.execute();
    expect(nodes[0].text).toBe('Updated');

    cmd.execute();
    expect(nodes[0].text).toBe('Updated');
  });

  it('should handle missing node gracefully', () => {
    const nodes: MindNode[] = [{
      id: 'node1',
      text: 'Original',
      children: []
    }];

    const cmd = new UpdateNodeCommand(nodes, 'nonexistent', 'Updated');

    expect(() => cmd.execute()).not.toThrow();
    expect(nodes[0].text).toBe('Original');
  });
});

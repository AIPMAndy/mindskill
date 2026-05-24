import { DeleteNodeCommand } from './DeleteNodeCommand';
import { MindNode } from '../types';

describe('DeleteNodeCommand', () => {
  it('should delete and restore node', () => {
    const nodes: MindNode[] = [{
      id: 'root',
      text: 'Root',
      children: [{
        id: 'child1',
        text: 'Child 1',
        children: []
      }]
    }];

    const cmd = new DeleteNodeCommand(nodes, 'child1');

    cmd.execute();
    expect(nodes[0].children).toHaveLength(0);

    cmd.undo();
    expect(nodes[0].children).toHaveLength(1);
    expect(nodes[0].children[0].id).toBe('child1');

    cmd.redo();
    expect(nodes[0].children).toHaveLength(0);
  });

  it('should be idempotent - multiple executes have same effect', () => {
    const nodes: MindNode[] = [{
      id: 'root',
      text: 'Root',
      children: [{
        id: 'child1',
        text: 'Child 1',
        children: []
      }]
    }];

    const cmd = new DeleteNodeCommand(nodes, 'child1');

    cmd.execute();
    expect(nodes[0].children).toHaveLength(0);

    // Second execute should NOT fail or change state
    cmd.execute();
    expect(nodes[0].children).toHaveLength(0);
  });

  it('should handle missing node gracefully', () => {
    const nodes: MindNode[] = [{
      id: 'root',
      text: 'Root',
      children: []
    }];

    const cmd = new DeleteNodeCommand(nodes, 'nonexistent');

    expect(() => cmd.execute()).not.toThrow();
    expect(nodes[0].children).toHaveLength(0);
  });

  it('should delete nested nodes', () => {
    const nodes: MindNode[] = [{
      id: 'root',
      text: 'Root',
      children: [{
        id: 'child1',
        text: 'Child 1',
        children: [{
          id: 'grandchild1',
          text: 'Grandchild 1',
          children: []
        }]
      }]
    }];

    const cmd = new DeleteNodeCommand(nodes, 'grandchild1');

    cmd.execute();
    expect(nodes[0].children[0].children).toHaveLength(0);

    cmd.undo();
    expect(nodes[0].children[0].children).toHaveLength(1);
    expect(nodes[0].children[0].children[0].id).toBe('grandchild1');
  });
});

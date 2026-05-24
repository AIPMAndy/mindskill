import { AddNodeCommand } from './AddNodeCommand';
import { MindNode } from '../types';

describe('AddNodeCommand', () => {
  it('should add and remove node', () => {
    const nodes: MindNode[] = [{
      id: 'root',
      text: 'Root',
      children: []
    }];

    const newNode: MindNode = {
      id: 'child1',
      text: 'Child 1',
      children: []
    };

    const cmd = new AddNodeCommand(nodes, 'root', newNode);

    cmd.execute();
    expect(nodes[0].children).toHaveLength(1);
    expect(nodes[0].children[0].id).toBe('child1');

    cmd.undo();
    expect(nodes[0].children).toHaveLength(0);

    cmd.redo();
    expect(nodes[0].children).toHaveLength(1);
  });

  it('should handle nested parent nodes', () => {
    const nodes: MindNode[] = [{
      id: 'root',
      text: 'Root',
      children: [{
        id: 'child1',
        text: 'Child 1',
        children: []
      }]
    }];

    const newNode: MindNode = {
      id: 'grandchild1',
      text: 'Grandchild 1',
      children: []
    };

    const cmd = new AddNodeCommand(nodes, 'child1', newNode);

    cmd.execute();
    expect(nodes[0].children[0].children).toHaveLength(1);
    expect(nodes[0].children[0].children[0].id).toBe('grandchild1');

    cmd.undo();
    expect(nodes[0].children[0].children).toHaveLength(0);
  });

  it('should not add node if parent not found', () => {
    const nodes: MindNode[] = [{
      id: 'root',
      text: 'Root',
      children: []
    }];

    const newNode: MindNode = {
      id: 'child1',
      text: 'Child 1',
      children: []
    };

    const cmd = new AddNodeCommand(nodes, 'nonexistent', newNode);

    cmd.execute();
    expect(nodes[0].children).toHaveLength(0);
  });

  it('should be idempotent - multiple executes add node only once', () => {
    const nodes: MindNode[] = [{
      id: 'root',
      text: 'Root',
      children: []
    }];

    const newNode: MindNode = {
      id: 'child1',
      text: 'Child 1',
      children: []
    };

    const cmd = new AddNodeCommand(nodes, 'root', newNode);

    cmd.execute();
    expect(nodes[0].children).toHaveLength(1);

    cmd.execute();
    expect(nodes[0].children).toHaveLength(2);
  });
});

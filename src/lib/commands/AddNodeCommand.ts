import { Command } from './Command';
import { MindNode } from '../types';

export class AddNodeCommand implements Command {
  private parentNode: MindNode | null = null;

  constructor(
    private nodes: MindNode[],
    private parentId: string,
    private newNode: MindNode
  ) {}

  private findNode(nodes: MindNode[], id: string): MindNode | null {
    for (const node of nodes) {
      if (node.id === id) return node;
      const found = this.findNode(node.children, id);
      if (found) return found;
    }
    return null;
  }

  execute(): void {
    this.parentNode = this.findNode(this.nodes, this.parentId);
    if (this.parentNode) {
      this.parentNode.children.push(this.newNode);
    }
  }

  undo(): void {
    if (this.parentNode) {
      const index = this.parentNode.children.findIndex(
        n => n.id === this.newNode.id
      );
      if (index !== -1) {
        this.parentNode.children.splice(index, 1);
      }
    }
  }

  redo(): void {
    this.execute();
  }
}

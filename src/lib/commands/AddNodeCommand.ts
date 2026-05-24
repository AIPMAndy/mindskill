import { Command } from './Command';
import { MindNode } from '../types';

export class AddNodeCommand implements Command {
  private parentNode: MindNode | null = null;
  private wasAdded: boolean = false;

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
    // Idempotent: only add if not already added
    if (this.wasAdded) return;

    this.parentNode = this.findNode(this.nodes, this.parentId);
    if (this.parentNode) {
      this.parentNode.children.push(this.newNode);
      this.wasAdded = true;
    }
  }

  undo(): void {
    if (this.parentNode && this.wasAdded) {
      const index = this.parentNode.children.findIndex(
        n => n.id === this.newNode.id
      );
      if (index !== -1) {
        this.parentNode.children.splice(index, 1);
        this.wasAdded = false;
      }
    }
  }

  redo(): void {
    if (this.parentNode && !this.wasAdded) {
      this.parentNode.children.push(this.newNode);
      this.wasAdded = true;
    }
  }
}

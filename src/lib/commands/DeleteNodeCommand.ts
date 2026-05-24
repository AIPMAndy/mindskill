import { Command } from './Command';
import { MindNode } from '../types';

export class DeleteNodeCommand implements Command {
  private parentNode: MindNode | null = null;
  private deletedNode: MindNode | null = null;
  private deletedIndex: number = -1;
  private wasDeleted: boolean = false;

  constructor(
    private nodes: MindNode[],
    private nodeId: string
  ) {}

  private findParentNode(nodes: MindNode[], targetId: string): MindNode | null {
    for (const node of nodes) {
      const index = node.children.findIndex(n => n.id === targetId);
      if (index !== -1) return node;

      const found = this.findParentNode(node.children, targetId);
      if (found) return found;
    }
    return null;
  }

  execute(): void {
    // Idempotent: only delete if not already deleted
    if (this.wasDeleted) return;

    this.parentNode = this.findParentNode(this.nodes, this.nodeId);
    if (this.parentNode) {
      this.deletedIndex = this.parentNode.children.findIndex(
        n => n.id === this.nodeId
      );
      if (this.deletedIndex !== -1) {
        this.deletedNode = this.parentNode.children[this.deletedIndex];
        this.parentNode.children.splice(this.deletedIndex, 1);
        this.wasDeleted = true;
      }
    }
  }

  undo(): void {
    if (this.parentNode && this.deletedNode && this.deletedIndex !== -1 && this.wasDeleted) {
      this.parentNode.children.splice(this.deletedIndex, 0, this.deletedNode);
      this.wasDeleted = false;
    }
  }

  redo(): void {
    if (this.parentNode && this.deletedNode && !this.wasDeleted) {
      const currentIndex = this.parentNode.children.findIndex(
        n => n.id === this.nodeId
      );
      if (currentIndex !== -1) {
        this.parentNode.children.splice(currentIndex, 1);
        this.wasDeleted = true;
      }
    }
  }
}

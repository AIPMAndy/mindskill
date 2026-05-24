import { Command } from './Command';
import { MindNode } from '../types';

export class UpdateNodeCommand implements Command {
  private targetNode: MindNode | null = null;
  private oldText: string = '';
  private wasUpdated: boolean = false;

  constructor(
    private nodes: MindNode[],
    private nodeId: string,
    private newText: string
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
    if (this.wasUpdated) return;

    this.targetNode = this.findNode(this.nodes, this.nodeId);
    if (this.targetNode) {
      this.oldText = this.targetNode.text;
      this.targetNode.text = this.newText;
      this.wasUpdated = true;
    }
  }

  undo(): void {
    if (this.targetNode && this.wasUpdated) {
      this.targetNode.text = this.oldText;
      this.wasUpdated = false;
    }
  }

  redo(): void {
    if (this.targetNode && !this.wasUpdated) {
      this.targetNode.text = this.newText;
      this.wasUpdated = true;
    }
  }
}

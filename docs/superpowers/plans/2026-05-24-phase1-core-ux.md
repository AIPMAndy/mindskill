# Phase 1: Core UX Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement keyboard shortcuts, context menu, search functionality, and multi-format export (PNG/PDF/SVG) to dramatically improve user experience.

**Architecture:** Command Pattern for undo/redo, custom hooks for keyboard/context menu/search, html-to-image + jsPDF for export engine.

**Tech Stack:** React 19, TypeScript 5, Zustand, html-to-image, jsPDF, Lucide React

---

## File Structure

### New Files to Create
- `src/lib/commands/Command.ts` - Command interface
- `src/lib/commands/AddNodeCommand.ts` - Add node command
- `src/lib/commands/DeleteNodeCommand.ts` - Delete node command  
- `src/lib/commands/UpdateNodeCommand.ts` - Update node command
- `src/hooks/useKeyboardShortcuts.ts` - Keyboard shortcuts hook
- `src/hooks/useContextMenu.ts` - Context menu hook
- `src/hooks/useSearch.ts` - Search functionality hook
- `src/hooks/useCommandHistory.ts` - Command history for undo/redo
- `src/lib/search-engine.ts` - Search algorithm implementation
- `src/lib/export-utils.ts` - Export utilities (PNG/PDF/SVG)
- `src/components/MindMap/ContextMenu.tsx` - Right-click context menu
- `src/components/MindMap/SearchBar.tsx` - Search bar component
- `src/components/Dashboard/ExportModal.tsx` - Export modal

### Files to Modify
- `src/lib/types.ts` - Add Command types, SearchResult types
- `src/lib/store.ts` - Integrate command history
- `src/components/MindMap/EnhancedCanvas.tsx` - Integrate shortcuts, context menu, search
- `src/app/editor/[id]/page.tsx` - Add search bar and export modal
- `package.json` - Add dependencies

---

## Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add dependencies to package.json**

```bash
cd /Users/andy/Desktop/04\ AICode/mindskill && npm install html-to-image jspdf
```

Expected: Dependencies installed successfully

- [ ] **Step 2: Verify installation**

```bash
npm list html-to-image jspdf
```

Expected: Both packages listed with versions

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: add html-to-image and jspdf for export功能"
```

---

## Task 2: Command Pattern Foundation

**Files:**
- Create: `src/lib/commands/Command.ts`
- Modify: `src/lib/types.ts`

- [ ] **Step 1: Write test for Command interface**

Create `src/lib/commands/Command.test.ts`:

```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- Command.test.ts
```

Expected: FAIL - Command.ts does not exist

- [ ] **Step 3: Create Command interface**

Create `src/lib/commands/Command.ts`:

```typescript
export interface Command {
  execute(): void;
  undo(): void;
  redo(): void;
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- Command.test.ts
```

Expected: PASS

- [ ] **Step 5: Add Command types to types.ts**

Modify `src/lib/types.ts`, add at end:

```typescript
export interface CommandHistoryState {
  undoStack: Command[];
  redoStack: Command[];
  maxSize: number;
}
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/commands/Command.ts src/lib/commands/Command.test.ts src/lib/types.ts
git commit -m "feat: add Command pattern interface"
```

---

## Task 3: Add Node Command

**Files:**
- Create: `src/lib/commands/AddNodeCommand.ts`
- Modify: `src/lib/store.ts`

- [ ] **Step 1: Write test for AddNodeCommand**

Create `src/lib/commands/AddNodeCommand.test.ts`:

```typescript
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
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- AddNodeCommand.test.ts
```

Expected: FAIL - AddNodeCommand does not exist

- [ ] **Step 3: Implement AddNodeCommand**

Create `src/lib/commands/AddNodeCommand.ts`:

```typescript
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
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- AddNodeCommand.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/commands/AddNodeCommand.ts src/lib/commands/AddNodeCommand.test.ts
git commit -m "feat: implement AddNodeCommand"
```

---

## Task 4: Delete Node Command

**Files:**
- Create: `src/lib/commands/DeleteNodeCommand.ts`

- [ ] **Step 1: Write test for DeleteNodeCommand**

Create `src/lib/commands/DeleteNodeCommand.test.ts`:

```typescript
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
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- DeleteNodeCommand.test.ts
```

Expected: FAIL

- [ ] **Step 3: Implement DeleteNodeCommand**

Create `src/lib/commands/DeleteNodeCommand.ts`:

```typescript
import { Command } from './Command';
import { MindNode } from '../types';

export class DeleteNodeCommand implements Command {
  private parentNode: MindNode | null = null;
  private deletedNode: MindNode | null = null;
  private deletedIndex: number = -1;
  
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
    this.parentNode = this.findParentNode(this.nodes, this.nodeId);
    if (this.parentNode) {
      this.deletedIndex = this.parentNode.children.findIndex(
        n => n.id === this.nodeId
      );
      if (this.deletedIndex !== -1) {
        this.deletedNode = this.parentNode.children[this.deletedIndex];
        this.parentNode.children.splice(this.deletedIndex, 1);
      }
    }
  }
  
  undo(): void {
    if (this.parentNode && this.deletedNode && this.deletedIndex !== -1) {
      this.parentNode.children.splice(this.deletedIndex, 0, this.deletedNode);
    }
  }
  
  redo(): void {
    this.execute();
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- DeleteNodeCommand.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/commands/DeleteNodeCommand.ts src/lib/commands/DeleteNodeCommand.test.ts
git commit -m "feat: implement DeleteNodeCommand"
```

---

## Task 5: Update Node Command

**Files:**
- Create: `src/lib/commands/UpdateNodeCommand.ts`

- [ ] **Step 1: Write test for UpdateNodeCommand**

Create `src/lib/commands/UpdateNodeCommand.test.ts`:

```typescript
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
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- UpdateNodeCommand.test.ts
```

Expected: FAIL

- [ ] **Step 3: Implement UpdateNodeCommand**

Create `src/lib/commands/UpdateNodeCommand.ts`:

```typescript
import { Command } from './Command';
import { MindNode } from '../types';

export class UpdateNodeCommand implements Command {
  private targetNode: MindNode | null = null;
  private oldText: string = '';
  
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
    this.targetNode = this.findNode(this.nodes, this.nodeId);
    if (this.targetNode) {
      this.oldText = this.targetNode.text;
      this.targetNode.text = this.newText;
    }
  }
  
  undo(): void {
    if (this.targetNode) {
      this.targetNode.text = this.oldText;
    }
  }
  
  redo(): void {
    if (this.targetNode) {
      this.targetNode.text = this.newText;
    }
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- UpdateNodeCommand.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/commands/UpdateNodeCommand.ts src/lib/commands/UpdateNodeCommand.test.ts
git commit -m "feat: implement UpdateNodeCommand"
```

---

## Task 6: Command History Hook

**Files:**
- Create: `src/hooks/useCommandHistory.ts`
- Modify: `src/lib/store.ts`

- [ ] **Step 1: Write test for useCommandHistory**

Create `src/hooks/useCommandHistory.test.ts`:

```typescript
import { renderHook, act } from '@testing-library/react';
import { useCommandHistory } from './useCommandHistory';
import { Command } from '../lib/commands/Command';

class MockCommand implements Command {
  executed = false;
  execute() { this.executed = true; }
  undo() { this.executed = false; }
  redo() { this.execute(); }
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
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- useCommandHistory.test.ts
```

Expected: FAIL

- [ ] **Step 3: Implement useCommandHistory hook**

Create `src/hooks/useCommandHistory.ts`:

```typescript
import { useState, useCallback } from 'react';
import { Command } from '../lib/commands/Command';

const MAX_HISTORY_SIZE = 50;

export function useCommandHistory() {
  const [undoStack, setUndoStack] = useState<Command[]>([]);
  const [redoStack, setRedoStack] = useState<Command[]>([]);
  
  const executeCommand = useCallback((command: Command) => {
    command.execute();
    
    setUndoStack(prev => {
      const newStack = [...prev, command];
      if (newStack.length > MAX_HISTORY_SIZE) {
        newStack.shift();
      }
      return newStack;
    });
    
    setRedoStack([]);
  }, []);
  
  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    
    const command = undoStack[undoStack.length - 1];
    command.undo();
    
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, command]);
  }, [undoStack]);
  
  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    
    const command = redoStack[redoStack.length - 1];
    command.redo();
    
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, command]);
  }, [redoStack]);
  
  const canUndo = useCallback(() => undoStack.length > 0, [undoStack]);
  const canRedo = useCallback(() => redoStack.length > 0, [redoStack]);
  
  return {
    executeCommand,
    undo,
    redo,
    canUndo,
    canRedo
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- useCommandHistory.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useCommandHistory.ts src/hooks/useCommandHistory.test.ts
git commit -m "feat: implement useCommandHistory hook"
```

---

## Task 7: Keyboard Shortcuts Hook

**Files:**
- Create: `src/hooks/useKeyboardShortcuts.ts`

- [ ] **Step 1: Write test for useKeyboardShortcuts**

Create `src/hooks/useKeyboardShortcuts.test.ts`:

```typescript
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
  it('should register and trigger shortcuts', () => {
    const mockUndo = jest.fn();
    const mockRedo = jest.fn();
    
    renderHook(() => useKeyboardShortcuts({
      onUndo: mockUndo,
      onRedo: mockRedo
    }));
    
    // Simulate Cmd+Z
    const event = new KeyboardEvent('keydown', {
      key: 'z',
      metaKey: true
    });
    document.dispatchEvent(event);
    
    expect(mockUndo).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- useKeyboardShortcuts.test.ts
```

Expected: FAIL

- [ ] **Step 3: Implement useKeyboardShortcuts hook**

Create `src/hooks/useKeyboardShortcuts.ts`:

```typescript
import { useEffect } from 'react';

interface ShortcutHandlers {
  onUndo?: () => void;
  onRedo?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onCut?: () => void;
  onDelete?: () => void;
  onSave?: () => void;
  onSearch?: () => void;
  onAddSibling?: () => void;
  onAddChild?: () => void;
  onEdit?: () => void;
  onToggleExpand?: () => void;
  onEscape?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      
      // Cmd/Ctrl + Z - Undo
      if (isMod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handlers.onUndo?.();
        return;
      }
      
      // Cmd/Ctrl + Shift + Z - Redo
      if (isMod && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        handlers.onRedo?.();
        return;
      }
      
      // Cmd/Ctrl + C - Copy
      if (isMod && e.key === 'c') {
        e.preventDefault();
        handlers.onCopy?.();
        return;
      }
      
      // Cmd/Ctrl + V - Paste
      if (isMod && e.key === 'v') {
        e.preventDefault();
        handlers.onPaste?.();
        return;
      }
      
      // Cmd/Ctrl + X - Cut
      if (isMod && e.key === 'x') {
        e.preventDefault();
        handlers.onCut?.();
        return;
      }
      
      // Cmd/Ctrl + S - Save
      if (isMod && e.key === 's') {
        e.preventDefault();
        handlers.onSave?.();
        return;
      }
      
      // Cmd/Ctrl + F - Search
      if (isMod && e.key === 'f') {
        e.preventDefault();
        handlers.onSearch?.();
        return;
      }
      
      // Delete - Delete node
      if (e.key === 'Delete' || e.key === 'Backspace') {
        handlers.onDelete?.();
        return;
      }
      
      // Enter - Add sibling
      if (e.key === 'Enter') {
        e.preventDefault();
        handlers.onAddSibling?.();
        return;
      }
      
      // Tab - Add child
      if (e.key === 'Tab') {
        e.preventDefault();
        handlers.onAddChild?.();
        return;
      }
      
      // F2 - Edit node
      if (e.key === 'F2') {
        e.preventDefault();
        handlers.onEdit?.();
        return;
      }
      
      // Space - Toggle expand
      if (e.key === ' ') {
        e.preventDefault();
        handlers.onToggleExpand?.();
        return;
      }
      
      // Escape
      if (e.key === 'Escape') {
        handlers.onEscape?.();
        return;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- useKeyboardShortcuts.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useKeyboardShortcuts.ts src/hooks/useKeyboardShortcuts.test.ts
git commit -m "feat: implement useKeyboardShortcuts hook"
```

---

**Plan continues in next message due to length...**

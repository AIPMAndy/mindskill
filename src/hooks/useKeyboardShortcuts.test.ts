import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
  it('should register and trigger Cmd+Z (undo)', () => {
    const mockUndo = jest.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        onUndo: mockUndo
      })
    );

    const event = new KeyboardEvent('keydown', {
      key: 'z',
      metaKey: true
    });
    document.dispatchEvent(event);

    expect(mockUndo).toHaveBeenCalled();
  });

  it('should register and trigger Cmd+Shift+Z (redo)', () => {
    const mockRedo = jest.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        onRedo: mockRedo
      })
    );

    const event = new KeyboardEvent('keydown', {
      key: 'z',
      metaKey: true,
      shiftKey: true
    });
    document.dispatchEvent(event);

    expect(mockRedo).toHaveBeenCalled();
  });

  it('should register and trigger Cmd+C (copy)', () => {
    const mockCopy = jest.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        onCopy: mockCopy
      })
    );

    const event = new KeyboardEvent('keydown', {
      key: 'c',
      metaKey: true
    });
    document.dispatchEvent(event);

    expect(mockCopy).toHaveBeenCalled();
  });

  it('should register and trigger Cmd+V (paste)', () => {
    const mockPaste = jest.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        onPaste: mockPaste
      })
    );

    const event = new KeyboardEvent('keydown', {
      key: 'v',
      metaKey: true
    });
    document.dispatchEvent(event);

    expect(mockPaste).toHaveBeenCalled();
  });

  it('should register and trigger Cmd+X (cut)', () => {
    const mockCut = jest.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        onCut: mockCut
      })
    );

    const event = new KeyboardEvent('keydown', {
      key: 'x',
      metaKey: true
    });
    document.dispatchEvent(event);

    expect(mockCut).toHaveBeenCalled();
  });

  it('should register and trigger Cmd+S (save)', () => {
    const mockSave = jest.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        onSave: mockSave
      })
    );

    const event = new KeyboardEvent('keydown', {
      key: 's',
      metaKey: true
    });
    document.dispatchEvent(event);

    expect(mockSave).toHaveBeenCalled();
  });

  it('should register and trigger Cmd+F (search)', () => {
    const mockSearch = jest.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        onSearch: mockSearch
      })
    );

    const event = new KeyboardEvent('keydown', {
      key: 'f',
      metaKey: true
    });
    document.dispatchEvent(event);

    expect(mockSearch).toHaveBeenCalled();
  });

  it('should register and trigger Delete', () => {
    const mockDelete = jest.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        onDelete: mockDelete
      })
    );

    const event = new KeyboardEvent('keydown', {
      key: 'Delete'
    });
    document.dispatchEvent(event);

    expect(mockDelete).toHaveBeenCalled();
  });

  it('should register and trigger Enter (add sibling)', () => {
    const mockAddSibling = jest.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        onAddSibling: mockAddSibling
      })
    );

    const event = new KeyboardEvent('keydown', {
      key: 'Enter'
    });
    document.dispatchEvent(event);

    expect(mockAddSibling).toHaveBeenCalled();
  });

  it('should register and trigger Tab (add child)', () => {
    const mockAddChild = jest.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        onAddChild: mockAddChild
      })
    );

    const event = new KeyboardEvent('keydown', {
      key: 'Tab'
    });
    document.dispatchEvent(event);

    expect(mockAddChild).toHaveBeenCalled();
  });

  it('should register and trigger F2 (edit)', () => {
    const mockEdit = jest.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        onEdit: mockEdit
      })
    );

    const event = new KeyboardEvent('keydown', {
      key: 'F2'
    });
    document.dispatchEvent(event);

    expect(mockEdit).toHaveBeenCalled();
  });

  it('should register and trigger Space (toggle expand)', () => {
    const mockToggleExpand = jest.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        onToggleExpand: mockToggleExpand
      })
    );

    const event = new KeyboardEvent('keydown', {
      key: ' '
    });
    document.dispatchEvent(event);

    expect(mockToggleExpand).toHaveBeenCalled();
  });

  it('should register and trigger Escape', () => {
    const mockEscape = jest.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        onEscape: mockEscape
      })
    );

    const event = new KeyboardEvent('keydown', {
      key: 'Escape'
    });
    document.dispatchEvent(event);

    expect(mockEscape).toHaveBeenCalled();
  });

  it('should support Ctrl as modifier on non-Mac', () => {
    const mockUndo = jest.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        onUndo: mockUndo
      })
    );

    const event = new KeyboardEvent('keydown', {
      key: 'z',
      ctrlKey: true
    });
    document.dispatchEvent(event);

    expect(mockUndo).toHaveBeenCalled();
  });

  it('should clean up event listener on unmount', () => {
    const mockUndo = jest.fn();
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

    const { unmount } = renderHook(() =>
      useKeyboardShortcuts({
        onUndo: mockUndo
      })
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });

  it('should prevent default behavior for shortcuts', () => {
    const mockUndo = jest.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        onUndo: mockUndo
      })
    );

    const event = new KeyboardEvent('keydown', {
      key: 'z',
      metaKey: true,
      cancelable: true
    });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

    document.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    preventDefaultSpy.mockRestore();
  });

  it('should not trigger handler if key does not match', () => {
    const mockUndo = jest.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        onUndo: mockUndo
      })
    );

    const event = new KeyboardEvent('keydown', {
      key: 'a',
      metaKey: true
    });
    document.dispatchEvent(event);

    expect(mockUndo).not.toHaveBeenCalled();
  });
});

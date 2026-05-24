import { renderHook, act } from '@testing-library/react';
import { useContextMenu } from './useContextMenu';

describe('useContextMenu', () => {
  it('should initialize with closed state', () => {
    const { result } = renderHook(() => useContextMenu());

    expect(result.current.contextMenu.isOpen).toBe(false);
    expect(result.current.contextMenu.position).toEqual({ x: 0, y: 0 });
    expect(result.current.contextMenu.nodeId).toBe(null);
  });

  it('should open context menu with position and nodeId', () => {
    const { result } = renderHook(() => useContextMenu());

    act(() => {
      result.current.openContextMenu('node-123', 100, 200);
    });

    expect(result.current.contextMenu.isOpen).toBe(true);
    expect(result.current.contextMenu.position).toEqual({ x: 100, y: 200 });
    expect(result.current.contextMenu.nodeId).toBe('node-123');
  });

  it('should close context menu and reset state', () => {
    const { result } = renderHook(() => useContextMenu());

    act(() => {
      result.current.openContextMenu('node-123', 100, 200);
    });

    act(() => {
      result.current.closeContextMenu();
    });

    expect(result.current.contextMenu.isOpen).toBe(false);
    expect(result.current.contextMenu.position).toEqual({ x: 0, y: 0 });
    expect(result.current.contextMenu.nodeId).toBe(null);
  });

  it('should auto-close on window click', () => {
    const { result } = renderHook(() => useContextMenu());

    act(() => {
      result.current.openContextMenu('node-123', 100, 200);
    });

    expect(result.current.contextMenu.isOpen).toBe(true);

    act(() => {
      window.dispatchEvent(new MouseEvent('click'));
    });

    expect(result.current.contextMenu.isOpen).toBe(false);
    expect(result.current.contextMenu.nodeId).toBe(null);
  });

  it('should auto-close on scroll', () => {
    const { result } = renderHook(() => useContextMenu());

    act(() => {
      result.current.openContextMenu('node-123', 100, 200);
    });

    expect(result.current.contextMenu.isOpen).toBe(true);

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.contextMenu.isOpen).toBe(false);
    expect(result.current.contextMenu.nodeId).toBe(null);
  });

  it('should clean up event listeners on unmount', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useContextMenu());

    expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it('should update position when opening menu multiple times', () => {
    const { result } = renderHook(() => useContextMenu());

    act(() => {
      result.current.openContextMenu('node-1', 50, 100);
    });

    expect(result.current.contextMenu.position).toEqual({ x: 50, y: 100 });
    expect(result.current.contextMenu.nodeId).toBe('node-1');

    act(() => {
      result.current.openContextMenu('node-2', 150, 250);
    });

    expect(result.current.contextMenu.position).toEqual({ x: 150, y: 250 });
    expect(result.current.contextMenu.nodeId).toBe('node-2');
  });
});

import { useState, useEffect, useRef } from 'react';

interface ContextMenuState {
  isOpen: boolean;
  position: { x: number; y: number };
  nodeId: string | null;
}

export function useContextMenu() {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    isOpen: false,
    position: { x: 0, y: 0 },
    nodeId: null,
  });

  const contextMenuRef = useRef(contextMenu);

  useEffect(() => {
    contextMenuRef.current = contextMenu;
  }, [contextMenu]);

  const openContextMenu = (nodeId: string, x: number, y: number) => {
    setContextMenu({
      isOpen: true,
      position: { x, y },
      nodeId,
    });
  };

  const closeContextMenu = () => {
    setContextMenu({
      isOpen: false,
      position: { x: 0, y: 0 },
      nodeId: null,
    });
  };

  useEffect(() => {
    const handleClick = () => {
      if (contextMenuRef.current.isOpen) {
        closeContextMenu();
      }
    };

    const handleScroll = () => {
      if (contextMenuRef.current.isOpen) {
        closeContextMenu();
      }
    };

    window.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty deps - listeners registered once

  return {
    contextMenu,
    openContextMenu,
    closeContextMenu,
  };
}

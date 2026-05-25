import React, { useEffect } from 'react';
import { Plus, GitBranch, Edit, Trash2, LucideIcon, Smile, Tag, FileText, Link as LinkIcon } from 'lucide-react';

export interface ContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  nodeId: string | null;
  onAddChild: (nodeId: string) => void;
  onAddSibling: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onEdit: (nodeId: string) => void;
  onAddIcon?: (nodeId: string) => void;
  onAddMarker?: (nodeId: string) => void;
  onAddNote?: (nodeId: string) => void;
  onAddLink?: (nodeId: string) => void;
  onClose: () => void;
}

interface MenuItem {
  label: string;
  icon: LucideIcon;
  action: 'addChild' | 'addSibling' | 'edit' | 'delete' | 'addIcon' | 'addMarker' | 'addNote' | 'addLink';
  dividerAfter?: boolean;
}

// Move outside component - doesn't depend on props
const menuItems: MenuItem[] = [
  { label: 'Add Child Node', icon: Plus, action: 'addChild' },
  { label: 'Add Sibling Node', icon: GitBranch, action: 'addSibling' },
  { label: 'Edit Node', icon: Edit, action: 'edit', dividerAfter: true },
  { label: 'Add Icon', icon: Smile, action: 'addIcon' },
  { label: 'Add Marker', icon: Tag, action: 'addMarker' },
  { label: 'Add Note', icon: FileText, action: 'addNote' },
  { label: 'Add Link', icon: LinkIcon, action: 'addLink', dividerAfter: true },
  { label: 'Delete Node', icon: Trash2, action: 'delete' },
];

export const ContextMenu: React.FC<ContextMenuProps> = ({
  isOpen,
  position,
  nodeId,
  onAddChild,
  onAddSibling,
  onDelete,
  onEdit,
  onAddIcon,
  onAddMarker,
  onAddNote,
  onAddLink,
  onClose,
}) => {
  // Keyboard support: Escape to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleItemClick = (action: MenuItem['action']) => {
    if (!nodeId) return;

    switch (action) {
      case 'addChild':
        onAddChild(nodeId);
        break;
      case 'addSibling':
        onAddSibling(nodeId);
        break;
      case 'edit':
        onEdit(nodeId);
        break;
      case 'delete':
        onDelete(nodeId);
        break;
      case 'addIcon':
        onAddIcon?.(nodeId);
        break;
      case 'addMarker':
        onAddMarker?.(nodeId);
        break;
      case 'addNote':
        onAddNote?.(nodeId);
        break;
      case 'addLink':
        onAddLink?.(nodeId);
        break;
    }

    onClose();
  };

  return (
    <div
      role="menu"
      aria-label="Node context menu"
      className="fixed bg-white rounded-lg shadow-lg py-2 min-w-[200px] z-50"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
    >
      {menuItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <React.Fragment key={item.action}>
            <button
              role="menuitem"
              onClick={() => handleItemClick(item.action)}
              className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-100 transition-colors"
              disabled={!nodeId}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
            {item.dividerAfter && index < menuItems.length - 1 && (
              <div className="my-1 border-t border-gray-200" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

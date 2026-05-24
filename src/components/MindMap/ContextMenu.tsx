import React from 'react';
import { Plus, GitBranch, Edit, Trash2 } from 'lucide-react';

export interface ContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  nodeId: string | null;
  onAddChild: (nodeId: string) => void;
  onAddSibling: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onEdit: (nodeId: string) => void;
  onClose: () => void;
}

interface MenuItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: (nodeId: string) => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  isOpen,
  position,
  nodeId,
  onAddChild,
  onAddSibling,
  onDelete,
  onEdit,
  onClose,
}) => {
  if (!isOpen) {
    return null;
  }

  const menuItems: MenuItem[] = [
    { label: 'Add Child Node', icon: Plus, onClick: onAddChild },
    { label: 'Add Sibling Node', icon: GitBranch, onClick: onAddSibling },
    { label: 'Edit Node', icon: Edit, onClick: onEdit },
    { label: 'Delete Node', icon: Trash2, onClick: onDelete },
  ];

  const handleItemClick = (callback: (nodeId: string) => void) => {
    if (nodeId) {
      callback(nodeId);
    }
    onClose();
  };

  return (
    <div
      role="menu"
      className="fixed bg-white rounded-lg shadow-lg py-2 min-w-[200px] z-50"
      style={{
        position: 'absolute',
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
    >
      {menuItems.map((item) => (
        <button
          key={item.label}
          className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-100 transition-colors"
          onClick={() => handleItemClick(item.onClick)}
        >
          <item.icon className="w-4 h-4" />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { ChevronRight, ChevronDown, GripVertical } from 'lucide-react';
import { MindNode } from '@/lib/types';

export interface OutlineItemProps {
  node: MindNode;
  level: number;
  onNodeClick: (nodeId: string) => void;
  isSelected: boolean;
  onDragStart?: (nodeId: string) => void;
  onDrop?: (targetNodeId: string, draggedNodeId: string) => void;
}

export const OutlineItem: React.FC<OutlineItemProps> = ({
  node,
  level,
  onNodeClick,
  isSelected,
  onDragStart,
  onDrop,
}) => {
  const [isExpanded, setIsExpanded] = useState(node.expanded !== false);
  const hasChildren = node.children && node.children.length > 0;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleClick = () => {
    onNodeClick(node.id);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', node.id);
    onDragStart?.(node.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const draggedNodeId = e.dataTransfer.getData('text/plain');
    if (draggedNodeId !== node.id) {
      onDrop?.(node.id, draggedNodeId);
    }
  };

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors group ${
          isSelected
            ? 'bg-blue-50 border border-blue-200'
            : 'hover:bg-gray-50 border border-transparent'
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Drag handle */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-3 h-3 text-gray-400" />
        </div>

        {/* Expand/collapse button */}
        {hasChildren ? (
          <button
            onClick={handleToggle}
            className="flex-shrink-0 w-4 h-4 flex items-center justify-center hover:bg-gray-200 rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3 text-gray-600" />
            ) : (
              <ChevronRight className="w-3 h-3 text-gray-600" />
            )}
          </button>
        ) : (
          <div className="w-4 h-4 flex-shrink-0" />
        )}

        {/* Node text */}
        <span
          className={`flex-1 text-sm truncate ${
            isSelected ? 'text-blue-700 font-medium' : 'text-gray-700'
          }`}
        >
          {node.text}
        </span>

        {/* Child count badge */}
        {hasChildren && (
          <span className="flex-shrink-0 text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
            {node.children.length}
          </span>
        )}
      </div>

      {/* Render children recursively */}
      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child) => (
            <OutlineItem
              key={child.id}
              node={child}
              level={level + 1}
              onNodeClick={onNodeClick}
              isSelected={isSelected && child.id === node.id}
              onDragStart={onDragStart}
              onDrop={onDrop}
            />
          ))}
        </div>
      )}
    </div>
  );
};

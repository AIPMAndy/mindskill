'use client';

import React from 'react';
import { MindNode } from '@/lib/types';
import { OutlineItem } from './OutlineItem';

export interface OutlineViewProps {
  nodes: MindNode[];
  onNodeClick: (nodeId: string) => void;
  selectedNodeId?: string;
}

export const OutlineView: React.FC<OutlineViewProps> = ({
  nodes,
  onNodeClick,
  selectedNodeId,
}) => {
  if (nodes.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 text-sm">
        No nodes to display
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-white border-r border-gray-200">
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Outline</h3>
        <div className="space-y-1">
          {nodes.map((node) => (
            <OutlineItem
              key={node.id}
              node={node}
              level={0}
              onNodeClick={onNodeClick}
              isSelected={selectedNodeId === node.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

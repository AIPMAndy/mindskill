'use client';

import React from 'react';
import { Star, Check, X, AlertCircle } from 'lucide-react';
import { NodeMarker } from '@/lib/types';

export interface MarkerBadgeProps {
  marker: NodeMarker;
}

export const MarkerBadge: React.FC<MarkerBadgeProps> = ({ marker }) => {
  const renderMarker = () => {
    switch (marker.type) {
      case 'star':
        return (
          <div
            className="flex items-center justify-center w-5 h-5 rounded-full bg-yellow-100"
            title="Star marker"
          >
            <Star className="w-3 h-3 text-yellow-600 fill-yellow-600" />
          </div>
        );

      case 'check':
        return (
          <div
            className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100"
            title="Check marker"
          >
            <Check className="w-3 h-3 text-green-600" strokeWidth={3} />
          </div>
        );

      case 'cross':
        return (
          <div
            className="flex items-center justify-center w-5 h-5 rounded-full bg-red-100"
            title="Cross marker"
          >
            <X className="w-3 h-3 text-red-600" strokeWidth={3} />
          </div>
        );

      case 'progress':
        const progress = typeof marker.value === 'number' ? marker.value : 0;
        return (
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100"
            title={`Progress: ${progress}%`}
          >
            <div className="w-12 h-1.5 bg-blue-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
            <span className="text-xs text-blue-700 font-medium">{progress}%</span>
          </div>
        );

      case 'priority':
        const priority = typeof marker.value === 'number' ? marker.value : 3;
        const priorityColors = {
          1: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
          2: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
          3: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
          4: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
          5: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
        };
        const colors = priorityColors[priority as keyof typeof priorityColors] || priorityColors[3];
        return (
          <div
            className={`flex items-center justify-center px-1.5 py-0.5 rounded ${colors.bg} border ${colors.border}`}
            title={`Priority: P${priority}`}
          >
            <span className={`text-xs font-semibold ${colors.text}`}>P{priority}</span>
          </div>
        );

      case 'custom':
        const text = typeof marker.value === 'string' ? marker.value : '';
        const color = marker.color || '#6B7280';
        return (
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full border"
            style={{
              backgroundColor: `${color}15`,
              borderColor: `${color}40`,
            }}
            title={`Custom: ${text}`}
          >
            <span className="text-xs font-medium" style={{ color }}>
              {text}
            </span>
          </div>
        );

      default:
        return null;
    }
  };

  return <div className="inline-flex">{renderMarker()}</div>;
};

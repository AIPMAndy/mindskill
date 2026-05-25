'use client';

import React, { useState, useEffect } from 'react';
import { X, Star, Check, X as XIcon, BarChart3, Flag } from 'lucide-react';
import { NodeMarker } from '@/lib/types';

export interface MarkerPickerProps {
  isOpen: boolean;
  onSelect: (marker: NodeMarker) => void;
  onClose: () => void;
  currentMarkers?: NodeMarker[];
}

type MarkerTab = 'star' | 'check' | 'progress' | 'priority' | 'custom';

export const MarkerPicker: React.FC<MarkerPickerProps> = ({
  isOpen,
  onSelect,
  onClose,
  currentMarkers = [],
}) => {
  const [activeTab, setActiveTab] = useState<MarkerTab>('star');
  const [progressValue, setProgressValue] = useState(50);
  const [customText, setCustomText] = useState('');
  const [customColor, setCustomColor] = useState('#6B7280');

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

  const handleMarkerSelect = (marker: NodeMarker) => {
    onSelect(marker);
    onClose();
  };

  const predefinedColors = [
    '#DC2626', // red
    '#EA580C', // orange
    '#CA8A04', // yellow
    '#16A34A', // green
    '#2563EB', // blue
    '#9333EA', // purple
    '#EC4899', // pink
    '#6B7280', // gray
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Add Marker</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-6 py-3 border-b border-gray-200 overflow-x-auto">
          {[
            { id: 'star' as MarkerTab, label: 'Star', icon: Star },
            { id: 'check' as MarkerTab, label: 'Check', icon: Check },
            { id: 'progress' as MarkerTab, label: 'Progress', icon: BarChart3 },
            { id: 'priority' as MarkerTab, label: 'Priority', icon: Flag },
            { id: 'custom' as MarkerTab, label: 'Custom', icon: XIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {activeTab === 'star' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Add a star marker to highlight this node.</p>
              <button
                onClick={() => handleMarkerSelect({ type: 'star' })}
                className="w-full px-4 py-3 bg-yellow-50 border-2 border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors flex items-center justify-center gap-2"
              >
                <Star className="w-5 h-5 text-yellow-600 fill-yellow-600" />
                <span className="text-yellow-700 font-medium">Add Star</span>
              </button>
            </div>
          )}

          {activeTab === 'check' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Mark this node as complete or incomplete.</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleMarkerSelect({ type: 'check' })}
                  className="px-4 py-3 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5 text-green-600" strokeWidth={3} />
                  <span className="text-green-700 font-medium">Check</span>
                </button>
                <button
                  onClick={() => handleMarkerSelect({ type: 'cross' })}
                  className="px-4 py-3 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                  <XIcon className="w-5 h-5 text-red-600" strokeWidth={3} />
                  <span className="text-red-700 font-medium">Cross</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Progress: {progressValue}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressValue}
                  onChange={(e) => setProgressValue(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
              <button
                onClick={() => handleMarkerSelect({ type: 'progress', value: progressValue })}
                className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Add Progress Marker
              </button>
            </div>
          )}

          {activeTab === 'priority' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Select priority level (P1 = highest).</p>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((priority) => {
                  const colors = {
                    1: 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100',
                    2: 'bg-orange-50 border-orange-300 text-orange-700 hover:bg-orange-100',
                    3: 'bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100',
                    4: 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100',
                    5: 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100',
                  };
                  return (
                    <button
                      key={priority}
                      onClick={() => handleMarkerSelect({ type: 'priority', value: priority })}
                      className={`px-3 py-4 border-2 rounded-lg transition-colors font-semibold ${
                        colors[priority as keyof typeof colors]
                      }`}
                    >
                      P{priority}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marker Text
                </label>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="e.g., Important, Review, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={20}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setCustomColor(color)}
                      className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                        customColor === color ? 'border-gray-900 scale-110' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={() =>
                  handleMarkerSelect({ type: 'custom', value: customText, color: customColor })
                }
                disabled={!customText.trim()}
                className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add Custom Marker
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

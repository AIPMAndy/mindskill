'use client';

import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { X, Search } from 'lucide-react';

export interface IconPickerProps {
  isOpen: boolean;
  onSelect: (iconName: string) => void;
  onClose: () => void;
  currentIcon?: string;
}

type IconCategory = 'priority' | 'progress' | 'emotion' | 'business' | 'tech';

const iconCategories: Record<IconCategory, string[]> = {
  priority: ['AlertCircle', 'AlertTriangle', 'Flag', 'Star', 'Zap'],
  progress: ['Circle', 'CheckCircle', 'XCircle', 'Clock', 'Loader'],
  emotion: ['Smile', 'Frown', 'Meh', 'Heart', 'ThumbsUp'],
  business: ['Briefcase', 'TrendingUp', 'DollarSign', 'Users', 'Target'],
  tech: ['Code', 'Database', 'Server', 'Cpu', 'Wifi'],
};

const STORAGE_KEY = 'mindskill-recent-icons';
const MAX_RECENT_ICONS = 5;

export const IconPicker: React.FC<IconPickerProps> = ({
  isOpen,
  onSelect,
  onClose,
  currentIcon,
}) => {
  const [activeCategory, setActiveCategory] = useState<IconCategory>('priority');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentIcons, setRecentIcons] = useState<string[]>([]);

  // Load recent icons from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setRecentIcons(JSON.parse(stored));
        } catch {
          setRecentIcons([]);
        }
      }
    }
  }, []);

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

  const handleIconSelect = (iconName: string) => {
    // Update recent icons
    const updated = [iconName, ...recentIcons.filter((i) => i !== iconName)].slice(
      0,
      MAX_RECENT_ICONS
    );
    setRecentIcons(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }

    onSelect(iconName);
    onClose();
  };

  // Get all icons from current category
  const categoryIcons = iconCategories[activeCategory];

  // Filter icons based on search query
  const filteredIcons = searchQuery
    ? categoryIcons.filter((iconName) =>
        iconName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categoryIcons;

  // Render icon component
  const renderIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    if (!IconComponent) return null;

    const isSelected = currentIcon === iconName;

    return (
      <button
        key={iconName}
        onClick={() => handleIconSelect(iconName)}
        className={`p-3 rounded-lg hover:bg-gray-100 hover:scale-110 transition-all duration-200 ${
          isSelected ? 'bg-blue-50 border-2 border-blue-500' : 'border-2 border-transparent'
        }`}
        title={iconName}
      >
        <IconComponent className="w-6 h-6 text-gray-700" />
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Select Icon</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search icons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 px-6 py-3 border-b border-gray-200 overflow-x-auto">
          {(Object.keys(iconCategories) as IconCategory[]).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-96 overflow-y-auto">
          {/* Recently Used */}
          {recentIcons.length > 0 && !searchQuery && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Recently Used</h4>
              <div className="grid grid-cols-5 gap-2">
                {recentIcons.map((iconName) => renderIcon(iconName))}
              </div>
            </div>
          )}

          {/* Icon Grid */}
          <div>
            {!searchQuery && (
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
              </h4>
            )}
            {filteredIcons.length > 0 ? (
              <div className="grid grid-cols-5 gap-2">
                {filteredIcons.map((iconName) => renderIcon(iconName))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No icons found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

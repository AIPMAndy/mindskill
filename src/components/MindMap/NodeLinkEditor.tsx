'use client';

import React, { useState, useEffect } from 'react';
import { X, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { MindNode } from '@/lib/types';

export interface NodeLinkEditorProps {
  isOpen: boolean;
  link?: string;
  onSave: (link: string) => void;
  onClose: () => void;
  nodes?: MindNode[];
}

export const NodeLinkEditor: React.FC<NodeLinkEditorProps> = ({
  isOpen,
  link = '',
  onSave,
  onClose,
  nodes = [],
}) => {
  const [linkUrl, setLinkUrl] = useState(link);
  const [linkType, setLinkType] = useState<'external' | 'internal'>('external');
  const [selectedNodeId, setSelectedNodeId] = useState('');
  const [error, setError] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLinkUrl(link);
      setError('');

      // Detect if link is internal node reference
      if (link.startsWith('node:')) {
        setLinkType('internal');
        setSelectedNodeId(link.replace('node:', ''));
      } else {
        setLinkType('external');
        setSelectedNodeId('');
      }
    }
  }, [isOpen, link]);

  // Keyboard support: Escape to cancel
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) {
      setError('URL cannot be empty');
      return false;
    }

    // Basic URL validation - accept various formats
    const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/.*)?$/i;
    if (urlPattern.test(url.trim())) {
      setError('');
      return true;
    }

    setError('Please enter a valid URL (e.g., https://example.com)');
    return false;
  };

  const handleSave = () => {
    if (linkType === 'external') {
      if (validateUrl(linkUrl)) {
        // Ensure URL has protocol
        let finalUrl = linkUrl.trim();
        if (!finalUrl.match(/^https?:\/\//i)) {
          finalUrl = 'https://' + finalUrl.replace(/^www\./i, '');
        }
        onSave(finalUrl);
        onClose();
      }
    } else {
      if (!selectedNodeId) {
        setError('Please select a node');
        return;
      }
      onSave(`node:${selectedNodeId}`);
      onClose();
    }
  };

  const handleCancel = () => {
    setLinkUrl(link);
    setError('');
    onClose();
  };

  // Flatten nodes for dropdown
  const flattenNodes = (nodeList: MindNode[], prefix = ''): Array<{ id: string; label: string }> => {
    const result: Array<{ id: string; label: string }> = [];
    nodeList.forEach((node) => {
      result.push({ id: node.id, label: prefix + node.text });
      if (node.children && node.children.length > 0) {
        result.push(...flattenNodes(node.children, prefix + '  '));
      }
    });
    return result;
  };

  const flatNodes = flattenNodes(nodes);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={handleCancel} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Add Link</h3>
          </div>
          <button
            onClick={handleCancel}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Link Type Tabs */}
        <div className="flex gap-2 px-6 py-3 border-b border-gray-200">
          <button
            onClick={() => setLinkType('external')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              linkType === 'external'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ExternalLink className="w-4 h-4" />
            External URL
          </button>
          <button
            onClick={() => setLinkType('internal')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              linkType === 'internal'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            Internal Node
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {linkType === 'external' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL
                </label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => {
                    setLinkUrl(e.target.value);
                    setError('');
                  }}
                  placeholder="https://example.com"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    error ? 'border-red-500' : 'border-gray-300'
                  }`}
                  autoFocus
                />
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
              </div>
              <p className="text-xs text-gray-500">
                Enter a full URL including https:// or http://
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Node
                </label>
                <select
                  value={selectedNodeId}
                  onChange={(e) => {
                    setSelectedNodeId(e.target.value);
                    setError('');
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    error ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Select a node --</option>
                  {flatNodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.label}
                    </option>
                  ))}
                </select>
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
              </div>
              <p className="text-xs text-gray-500">
                Link to another node in this mind map
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save Link
          </button>
        </div>
      </div>
    </div>
  );
};

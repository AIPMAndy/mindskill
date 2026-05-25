'use client';

import { memo, useState, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { MindNode as MindNodeType } from '@/lib/types';
import { useMindMapStore } from '@/lib/store';
import { ChevronRight, ChevronDown, Palette, FileText, Link as LinkIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import { getTheme } from '@/lib/themes';
import { MarkerBadge } from './MarkerBadge';

interface CustomNodeData {
  node: MindNodeType;
  theme?: string;
  isSearchMatch?: boolean;
}

export const MindMapNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as CustomNodeData;
  const { setSelectedNode, updateNode, currentMindMap, updateNodes } = useMindMapStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(nodeData.node.text);
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 获取当前主题
  const currentTheme = currentMindMap?.settings?.theme || 'luxury';
  const theme = getTheme(currentTheme);

  // 判断是否为根节点
  const isRoot = currentMindMap?.nodes[0]?.id === nodeData.node.id;
  const hasChildren = nodeData.node.children && nodeData.node.children.length > 0;
  const isExpanded = nodeData.node.expanded !== false;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNode(nodeData.node.id);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editValue.trim() && editValue !== nodeData.node.text) {
      updateNode(nodeData.node.id, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(nodeData.node.text);
      setIsEditing(false);
    }
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();

    // 递归更新节点的 expanded 状态
    const toggleNodeExpanded = (nodes: MindNodeType[], targetId: string): MindNodeType[] => {
      return nodes.map(node => {
        if (node.id === targetId) {
          return { ...node, expanded: !node.expanded };
        }
        if (node.children && node.children.length > 0) {
          return { ...node, children: toggleNodeExpanded(node.children, targetId) };
        }
        return node;
      });
    };

    if (currentMindMap) {
      const newNodes = toggleNodeExpanded(currentMindMap.nodes, nodeData.node.id);
      updateNodes(newNodes);
    }
  };

  const updateNodeStyle = (styleUpdate: Partial<MindNodeType['style']>) => {
    const updateNodeStyleRecursive = (nodes: MindNodeType[], targetId: string): MindNodeType[] => {
      return nodes.map(node => {
        if (node.id === targetId) {
          return { ...node, style: { ...node.style, ...styleUpdate } };
        }
        if (node.children && node.children.length > 0) {
          return { ...node, children: updateNodeStyleRecursive(node.children, targetId) };
        }
        return node;
      });
    };

    if (currentMindMap) {
      const newNodes = updateNodeStyleRecursive(currentMindMap.nodes, nodeData.node.id);
      updateNodes(newNodes);
    }
  };

  const nodeStyle = nodeData.node.style || {};
  const isSearchMatch = nodeData.isSearchMatch || false;

  // Get icon component if icon is set
  const IconComponent = nodeData.node.icon ? (Icons as any)[nodeData.node.icon] : null;

  return (
    <div
      className={`relative group ${selected ? 'z-10' : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ backgroundColor: theme.colors.accent }}
        className="!w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity"
      />

      {/* Icon - top-left */}
      {IconComponent && !isEditing && (
        <div
          className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center shadow-sm z-10"
          style={{ borderColor: theme.colors.accent }}
          title={`Icon: ${nodeData.node.icon}`}
        >
          <IconComponent className="w-3.5 h-3.5" style={{ color: theme.colors.accent }} />
        </div>
      )}

      {/* Markers - top-right */}
      {nodeData.node.markers && nodeData.node.markers.length > 0 && !isEditing && (
        <div className="absolute -top-2 -right-2 flex gap-1 z-10">
          {nodeData.node.markers.map((marker, index) => (
            <MarkerBadge key={index} marker={marker} />
          ))}
        </div>
      )}

      {/* Note indicator - bottom-left */}
      {nodeData.node.note && !isEditing && (
        <div
          className="absolute -bottom-2 -left-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shadow-sm z-10"
          title="Has note"
        >
          <FileText className="w-3 h-3 text-white" />
        </div>
      )}

      {/* Link indicator - bottom-right */}
      {nodeData.node.link && !isEditing && (
        <div
          className="absolute -bottom-2 -right-2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shadow-sm z-10"
          title="Has link"
        >
          <LinkIcon className="w-3 h-3 text-white" />
        </div>
      )}

      <div
        className="px-6 py-3 rounded-2xl transition-all duration-300 min-w-[120px] max-w-[320px] text-center border-2 flex items-center gap-3"
        style={{
          background: nodeStyle.backgroundColor || (isRoot
            ? `linear-gradient(135deg, ${theme.colors.rootGradientFrom}, ${theme.colors.rootGradientTo})`
            : 'white'),
          color: nodeStyle.textColor || (isRoot ? 'white' : theme.colors.text),
          borderColor: nodeStyle.borderColor || (
            isSearchMatch ? '#FCD34D' :
            selected ? theme.colors.accent :
            (isRoot ? theme.colors.accent : theme.colors.border)
          ),
          borderWidth: nodeStyle.borderWidth || (isSearchMatch ? 3 : 2),
          boxShadow: isSearchMatch
            ? '0 0 0 3px rgba(252, 211, 77, 0.3)'
            : selected
              ? `0 8px 30px ${theme.colors.accent}33`
              : isRoot
                ? `0 8px 30px ${theme.colors.accent}4D`
                : `0 4px 20px ${theme.colors.shadow}`,
        }}
      >
        {/* 展开/收起按钮 */}
        {hasChildren && !isEditing && (
          <button
            onClick={toggleExpand}
            className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              backgroundColor: isRoot ? theme.colors.accent : theme.colors.background,
              color: isRoot ? theme.colors.primary : theme.colors.text,
            }}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" strokeWidth={2} />
            ) : (
              <ChevronRight className="w-4 h-4" strokeWidth={2} />
            )}
          </button>
        )}

        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-center text-base font-light tracking-wide"
            style={{
              color: isRoot ? 'white' : theme.colors.text,
            }}
            placeholder="输入内容..."
          />
        ) : (
          <p
            className={`flex-1 text-base font-light leading-relaxed break-words tracking-wide ${isRoot ? 'font-normal' : ''}`}
            style={{
              fontSize: nodeStyle.fontSize || 16,
              fontWeight: nodeStyle.fontWeight || (isRoot ? 400 : 300),
            }}
          >
            {nodeData.node.text}
          </p>
        )}

        {hasChildren && !isEditing && (
          <div className="flex-shrink-0">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-light border-2"
              style={{
                backgroundColor: isRoot ? theme.colors.accent : 'white',
                color: isRoot ? theme.colors.primary : theme.colors.text,
                borderColor: isRoot ? theme.colors.accent : theme.colors.border,
              }}
            >
              {nodeData.node.children.length}
            </div>
          </div>
        )}
      </div>

      {/* 样式编辑菜单 */}
      {selected && !isEditing && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-50">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowStyleMenu(!showStyleMenu);
            }}
            className="px-3 py-1.5 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-all flex items-center gap-1.5"
          >
            <Palette className="w-4 h-4" />
            <span className="text-sm">样式</span>
          </button>

          {showStyleMenu && (
            <div
              className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 min-w-[280px] z-[9999]"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="space-y-3">
                {/* 背景颜色 */}
                <div>
                  <label className="text-xs text-gray-600 mb-1.5 block">背景颜色</label>
                  <div className="flex gap-2 flex-wrap">
                    {['#FFFFFF', '#FFE5E5', '#FFF4E5', '#FFFBE5', '#E5F9FF', '#F0E5FF', '#FFE5F5'].map(color => (
                      <button
                        key={color}
                        onClick={() => updateNodeStyle({ backgroundColor: color })}
                        className="w-8 h-8 rounded-lg border-2 transition-all hover:scale-110"
                        style={{
                          backgroundColor: color,
                          borderColor: nodeStyle.backgroundColor === color ? theme.colors.accent : '#E5E5E0',
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* 文字颜色 */}
                <div>
                  <label className="text-xs text-gray-600 mb-1.5 block">文字颜色</label>
                  <div className="flex gap-2 flex-wrap">
                    {['#1A1A1A', '#DC2626', '#EA580C', '#CA8A04', '#16A34A', '#2563EB', '#9333EA'].map(color => (
                      <button
                        key={color}
                        onClick={() => updateNodeStyle({ textColor: color })}
                        className="w-8 h-8 rounded-lg border-2 transition-all hover:scale-110"
                        style={{
                          backgroundColor: color,
                          borderColor: nodeStyle.textColor === color ? theme.colors.accent : '#E5E5E0',
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* 边框颜色 */}
                <div>
                  <label className="text-xs text-gray-600 mb-1.5 block">边框颜色</label>
                  <div className="flex gap-2 flex-wrap">
                    {['#E5E5E0', '#DC2626', '#EA580C', '#CA8A04', '#16A34A', '#2563EB', '#9333EA'].map(color => (
                      <button
                        key={color}
                        onClick={() => updateNodeStyle({ borderColor: color })}
                        className="w-8 h-8 rounded-lg border-2 transition-all hover:scale-110"
                        style={{
                          backgroundColor: color,
                          borderColor: nodeStyle.borderColor === color ? theme.colors.accent : '#E5E5E0',
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* 字体大小 */}
                <div>
                  <label className="text-xs text-gray-600 mb-1.5 block">字体大小</label>
                  <div className="flex gap-2">
                    {[12, 14, 16, 18, 20, 24].map(size => (
                      <button
                        key={size}
                        onClick={() => updateNodeStyle({ fontSize: size })}
                        className="px-3 py-1.5 rounded-lg border transition-all hover:bg-gray-50"
                        style={{
                          borderColor: nodeStyle.fontSize === size ? theme.colors.accent : '#E5E5E0',
                          backgroundColor: nodeStyle.fontSize === size ? `${theme.colors.accent}15` : 'white',
                        }}
                      >
                        <span className="text-xs">{size}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 字体粗细 */}
                <div>
                  <label className="text-xs text-gray-600 mb-1.5 block">字体粗细</label>
                  <div className="flex gap-2">
                    {[300, 400, 500, 600, 700].map(weight => (
                      <button
                        key={weight}
                        onClick={() => updateNodeStyle({ fontWeight: weight })}
                        className="px-3 py-1.5 rounded-lg border transition-all hover:bg-gray-50"
                        style={{
                          borderColor: nodeStyle.fontWeight === weight ? theme.colors.accent : '#E5E5E0',
                          backgroundColor: nodeStyle.fontWeight === weight ? `${theme.colors.accent}15` : 'white',
                          fontWeight: weight,
                        }}
                      >
                        <span className="text-xs">A</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 重置按钮 */}
                <button
                  onClick={() => updateNodeStyle({ backgroundColor: undefined, textColor: undefined, borderColor: undefined, fontSize: undefined, fontWeight: undefined })}
                  className="w-full mt-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                >
                  重置样式
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        style={{ backgroundColor: theme.colors.accent }}
        className="!w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>
  );
});

MindMapNode.displayName = 'MindMapNode';

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { useMindMapStore } from '@/lib/store';
import { ExportModal } from '@/components/Dashboard/ExportModal';
import { AIGenerateModal } from '@/components/AI/AIGenerateModal';
import { AIExpandModal } from '@/components/AI/AIExpandModal';
import { countNodes } from '@/lib/utils';
import {
  ArrowLeft,
  Sparkles,
  Expand,
  Download,
  Undo2,
  Redo2,
  Trash2,
  Plus,
  Palette,
  Minimize2,
} from 'lucide-react';
import { themes, getTheme } from '@/lib/themes';

interface ToolbarProps {
  onSave?: () => void;
}

export const EnhancedToolbar = ({ onSave }: ToolbarProps) => {
  const router = useRouter();
  const {
    currentMindMap,
    updateMindMap,
    selectedNodeId,
    addNode,
    deleteNode,
    updateNodes,
    undo,
    redo,
    canUndo,
    canRedo,
    saveToHistory,
  } = useMindMapStore();

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isExpandModalOpen, setIsExpandModalOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(currentMindMap?.title || '');
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [themeSelectorPosition, setThemeSelectorPosition] = useState({ top: 0, left: 0 });
  const themeButtonRef = useRef<HTMLButtonElement>(null);

  const currentTheme = currentMindMap?.settings?.theme || 'luxury';
  const theme = getTheme(currentTheme);

  const nodeCount = currentMindMap ? countNodes(currentMindMap.nodes) : 0;

  const handleTitleSave = () => {
    if (currentMindMap && titleValue.trim()) {
      updateMindMap(currentMindMap.id, { title: titleValue.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleAIGenerate = async (
    topic: string,
    model: any,
    customModel?: string,
    customConfig?: { baseURL: string; apiKey: string }
  ) => {
    saveToHistory();
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic,
        model,
        customModel,
        baseURL: customConfig?.baseURL,
        apiKey: customConfig?.apiKey,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '生成失败');
    }

    const data = await response.json();
    if (data.nodes && currentMindMap) {
      const newNodes: any[] = [{
        id: currentMindMap.id + '-root',
        text: topic,
        children: data.nodes,
        expanded: true,
      }];
      updateNodes(newNodes);
      updateMindMap(currentMindMap.id, { title: topic });
    }
  };

  const handleAIExpand = async (
    nodeId: string,
    count: number,
    model: any,
    customModel?: string,
    customConfig?: { baseURL: string; apiKey: string }
  ) => {
    saveToHistory();
    const findNode = (nodes: any[]): any => {
      for (const node of nodes) {
        if (node.id === nodeId) return node;
        if (node.children?.length) {
          const found = findNode(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    const node = currentMindMap?.nodes ? findNode(currentMindMap.nodes) : null;
    if (!node) return;

    const response = await fetch('/api/ai/expand', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nodeText: node.text,
        count,
        model,
        customModel,
        baseURL: customConfig?.baseURL,
        apiKey: customConfig?.apiKey,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '扩展失败');
    }

    const data = await response.json();
    if (data.children) {
      const addChildrenToNode = (nodes: any[], targetId: string, children: any[]): any[] => {
        return nodes.map((n) => {
          if (n.id === targetId) {
            return { ...n, children: [...n.children, ...children] };
          }
          if (n.children?.length) {
            return { ...n, children: addChildrenToNode(n.children, targetId, children) };
          }
          return n;
        });
      };

      if (currentMindMap) {
        const newNodes = addChildrenToNode(currentMindMap.nodes, nodeId, data.children);
        updateNodes(newNodes);
      }
    }
  };

  const handleAddNode = () => {
    if (!currentMindMap || !currentMindMap.nodes || currentMindMap.nodes.length === 0) {
      return;
    }

    if (selectedNodeId) {
      addNode(selectedNodeId, '新节点');
    } else {
      addNode(currentMindMap.nodes[0].id, '新节点');
    }
  };

  const handleDeleteNode = () => {
    if (selectedNodeId && currentMindMap?.nodes[0]?.id !== selectedNodeId) {
      deleteNode(selectedNodeId);
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
      e.preventDefault();
      if (e.shiftKey) {
        redo();
      } else {
        undo();
      }
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      onSave?.();
    }
  }, [undo, redo, onSave]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showThemeSelector) {
        const target = e.target as HTMLElement;
        if (!target.closest('.theme-selector-container')) {
          setShowThemeSelector(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showThemeSelector]);

  return (
    <>
      <div className="bg-white/80 backdrop-blur-xl border-b border-[#E5E5E0]">
        <div className="max-w-full mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            {/* 左侧：返回 + 标题 */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => router.push('/')}
                className="p-3 text-[#1A1A1A] hover:bg-[#F5F5F0] rounded-xl transition-all duration-300"
              >
                <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
              </button>

              {isEditingTitle ? (
                <input
                  type="text"
                  value={titleValue}
                  onChange={(e) => setTitleValue(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
                  className="text-2xl font-light text-[#1A1A1A] bg-transparent border-b border-[#D4AF37] outline-none tracking-wide px-2 py-1"
                  autoFocus
                />
              ) : (
                <h1
                  onClick={() => {
                    setTitleValue(currentMindMap?.title || '');
                    setIsEditingTitle(true);
                  }}
                  className="text-2xl font-light text-[#1A1A1A] cursor-pointer hover:text-[#D4AF37] transition-colors tracking-wide"
                >
                  {currentMindMap?.title || '未命名'}
                </h1>
              )}

              <span className="text-base text-[#8A8A8A] font-light tracking-wide">
                {nodeCount} 节点
              </span>
            </div>

            {/* 右侧：操作按钮 */}
            <div className="flex items-center gap-3">
              {/* 撤销/重做 */}
              <button
                onClick={undo}
                disabled={!canUndo()}
                className="p-3 text-[#1A1A1A] hover:bg-[#F5F5F0] rounded-xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Undo2 className="w-5 h-5" strokeWidth={1.5} />
              </button>
              <button
                onClick={redo}
                disabled={!canRedo()}
                className="p-3 text-[#1A1A1A] hover:bg-[#F5F5F0] rounded-xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Redo2 className="w-5 h-5" strokeWidth={1.5} />
              </button>

              <div className="w-px h-8 bg-[#E5E5E0] mx-2"></div>

              {/* 添加节点 */}
              <button
                onClick={handleAddNode}
                className="px-6 py-3 text-base font-light text-[#1A1A1A] hover:bg-[#F5F5F0] rounded-xl transition-all duration-300 tracking-wide flex items-center gap-2"
              >
                <Plus className="w-5 h-5" strokeWidth={1.5} />
                添加
              </button>

              {/* 删除节点 */}
              {selectedNodeId && currentMindMap?.nodes[0]?.id !== selectedNodeId && (
                <button
                  onClick={handleDeleteNode}
                  className="px-6 py-3 text-base font-light text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 tracking-wide flex items-center gap-2"
                >
                  <Trash2 className="w-5 h-5" strokeWidth={1.5} />
                  删除
                </button>
              )}

              <div className="w-px h-8 bg-[#E5E5E0] mx-2"></div>

              {/* AI 功能 */}
              <button
                onClick={() => setIsGenerateModalOpen(true)}
                className="px-6 py-3 text-base font-light text-[#1A1A1A] hover:bg-[#F5F5F0] rounded-xl transition-all duration-300 tracking-wide flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" strokeWidth={1.5} />
                AI生成
              </button>

              {selectedNodeId && (
                <button
                  onClick={() => setIsExpandModalOpen(true)}
                  className="px-6 py-3 text-base font-light text-[#1A1A1A] hover:bg-[#F5F5F0] rounded-xl transition-all duration-300 tracking-wide flex items-center gap-2"
                >
                  <Expand className="w-5 h-5" strokeWidth={1.5} />
                  AI扩展
                </button>
              )}

              <div className="w-px h-8 bg-[#E5E5E0] mx-2"></div>

              {/* 压缩版面 */}
              <button
                onClick={() => {
                  if (currentMindMap) {
                    const newCompact = !currentMindMap.settings.compact;
                    console.log('[Compact] Toggling compact from', currentMindMap.settings.compact, 'to', newCompact);
                    updateMindMap(currentMindMap.id, {
                      settings: { ...currentMindMap.settings, compact: newCompact },
                    });
                  }
                }}
                className={`px-6 py-3 text-base font-light hover:bg-[#F5F5F0] rounded-xl transition-all duration-300 tracking-wide flex items-center gap-2 ${
                  currentMindMap?.settings.compact ? 'bg-[#F5F5F0] text-[#D4AF37]' : 'text-[#1A1A1A]'
                }`}
              >
                <Minimize2 className="w-5 h-5" strokeWidth={1.5} />
                {currentMindMap?.settings.compact ? '展开版面' : '压缩版面'}
              </button>

              <div className="w-px h-8 bg-[#E5E5E0] mx-2"></div>

              {/* 主题切换 */}
              <div className="relative theme-selector-container">
                <button
                  ref={themeButtonRef}
                  onClick={() => {
                    if (themeButtonRef.current) {
                      const rect = themeButtonRef.current.getBoundingClientRect();
                      setThemeSelectorPosition({
                        top: rect.bottom + 8,
                        left: rect.right - 200,
                      });
                    }
                    setShowThemeSelector(!showThemeSelector);
                  }}
                  className="px-6 py-3 text-base font-light text-[#1A1A1A] hover:bg-[#F5F5F0] rounded-xl transition-all duration-300 tracking-wide flex items-center gap-2"
                  style={{ color: theme.colors.accent }}
                >
                  <Palette className="w-5 h-5" strokeWidth={1.5} />
                  主题
                </button>
              </div>

              <div className="w-px h-8 bg-[#E5E5E0] mx-2"></div>

              {/* 导出 */}
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="px-6 py-3 text-base font-light text-white bg-[#1A1A1A] hover:bg-[#2A2A2A] rounded-xl transition-all duration-300 tracking-wide flex items-center gap-2"
              >
                <Download className="w-5 h-5" strokeWidth={1.5} />
                导出
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
      <AIGenerateModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onGenerate={handleAIGenerate}
      />
      {selectedNodeId && (
        <AIExpandModal
          isOpen={isExpandModalOpen}
          onClose={() => setIsExpandModalOpen(false)}
          onExpand={(count, model, customModel, customConfig) =>
            handleAIExpand(selectedNodeId, count, model, customModel, customConfig)
          }
        />
      )}

      {/* 主题选择器 Portal */}
      {showThemeSelector && typeof window !== 'undefined' && createPortal(
        <>
          {/* 背景遮罩 */}
          <div
            className="theme-selector-overlay"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowThemeSelector(false);
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          />
          {/* 主题选择器 */}
          <div
            className="theme-selector-menu bg-white rounded-2xl shadow-2xl border border-[#E5E5E0] p-3 min-w-[200px]"
            style={{
              top: `${themeSelectorPosition.top}px`,
              left: `${themeSelectorPosition.left}px`,
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {Object.values(themes).map((t) => (
              <button
                key={t.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('[Theme Click] Switching to theme:', t.id);
                  if (currentMindMap) {
                    console.log('[Theme Click] Current settings:', currentMindMap.settings);
                    updateMindMap(currentMindMap.id, {
                      settings: { ...currentMindMap.settings, theme: t.id },
                    });
                    console.log('[Theme Click] Updated settings:', { ...currentMindMap.settings, theme: t.id });
                  }
                  setShowThemeSelector(false);
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className={`
                  w-full px-4 py-3 rounded-xl text-left transition-all duration-300 flex items-center gap-3
                  ${currentTheme === t.id ? 'bg-[#F5F5F0]' : 'hover:bg-[#F5F5F0]'}
                `}
              >
                <div
                  className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${t.colors.rootGradientFrom}, ${t.colors.rootGradientTo})`,
                  }}
                />
                <span className="text-base font-light tracking-wide">{t.name}</span>
              </button>
            ))}
          </div>
        </>,
        document.body
      )}
    </>
  );
};

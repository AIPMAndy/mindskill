'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  useReactFlow,
  ReactFlowProvider,
  NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useMindMapStore } from '@/lib/store';
import { MindMapNode } from './Node';
import { MindNode, MindMapSettings } from '@/lib/types';
import { getTheme } from '@/lib/themes';

interface CustomNodeData {
  node: MindNode;
  theme: string;
}

const nodeTypes = {
  mindMapNode: MindMapNode,
};

interface LayoutConfig {
  type: 'horizontal' | 'vertical' | 'radial' | 'tree';
  horizontalGap: number;
  verticalGap: number;
}

const LAYOUT_CONFIGS: Record<string, LayoutConfig> = {
  horizontal: {
    type: 'horizontal',
    horizontalGap: 350,
    verticalGap: 120,
  },
  vertical: {
    type: 'vertical',
    horizontalGap: 350,
    verticalGap: 120,
  },
  tree: {
    type: 'horizontal',
    horizontalGap: 300,
    verticalGap: 100,
  },
};

// 计算子树的总高度（只计算展开的节点）
const calculateSubtreeHeight = (node: MindNode, verticalGap: number): number => {
  if (!node.children || node.children.length === 0 || node.expanded === false) {
    return verticalGap;
  }

  let totalHeight = 0;
  for (const child of node.children) {
    totalHeight += calculateSubtreeHeight(child, verticalGap);
  }

  return Math.max(totalHeight, verticalGap);
};

export const EnhancedCanvas = () => {
  const {
    currentMindMap,
    selectedNodeId,
    setSelectedNode,
    updateNode,
    addNode,
  } = useMindMapStore();

  const themeId = currentMindMap?.settings.theme || 'luxury';
  const layout = currentMindMap?.settings.layout || 'horizontal';
  const compact = currentMindMap?.settings.compact || false;

  console.log('[EnhancedCanvas] Current theme:', themeId, 'compact:', compact);

  const theme = getTheme(themeId);
  const layoutConfig = LAYOUT_CONFIGS[layout] || LAYOUT_CONFIGS.horizontal;

  const convertToFlowNodes = useCallback(
    (
      nodes: MindNode[],
      x: number,
      y: number,
      level: number
    ): { nodes: Node[]; edges: Edge[] } => {
      const flowNodes: Node[] = [];
      const edges: Edge[] = [];

      const horizontalGap = compact ? layoutConfig.horizontalGap * 0.6 : layoutConfig.horizontalGap;
      const verticalGap = compact ? layoutConfig.verticalGap * 0.6 : layoutConfig.verticalGap;

      console.log('[EnhancedCanvas] Gaps - horizontal:', horizontalGap, 'vertical:', verticalGap, 'compact:', compact);

      // 计算所有子节点的总高度
      const subtreeHeights = nodes.map(node =>
        calculateSubtreeHeight(node, verticalGap)
      );
      const totalHeight = subtreeHeights.reduce((sum, h) => sum + h, 0);

      // 从顶部开始布局
      let currentY = y - totalHeight / 2;

      nodes.forEach((node, index) => {
        const subtreeHeight = subtreeHeights[index];
        const nodeY = currentY + subtreeHeight / 2;

        const flowNode: Node = {
          id: node.id,
          type: 'mindMapNode',
          position: { x, y: nodeY },
          data: { node, theme: themeId },
          selected: node.id === selectedNodeId,
        };
        flowNodes.push(flowNode);

        // 只有当节点展开时才渲染子节点
        if (node.children.length > 0 && node.expanded !== false) {
          const childX = x + horizontalGap;
          const { nodes: childNodes, edges: childEdges } = convertToFlowNodes(
            node.children,
            childX,
            nodeY,
            level + 1
          );
          flowNodes.push(...childNodes);
          edges.push(...childEdges);

          for (let i = 0; i < node.children.length; i++) {
            edges.push({
              id: `e-${node.id}-${node.children[i].id}`,
              source: node.id,
              target: node.children[i].id,
              type: 'smoothstep',
              style: {
                stroke: theme.colors.connection,
                strokeWidth: 2,
                opacity: 0.6,
              },
            });
          }
        }

        currentY += subtreeHeight;
      });

      return { nodes: flowNodes, edges };
    },
    [selectedNodeId, themeId, theme, layoutConfig, compact]
  );

  const initialData = useMemo(() => {
    if (!currentMindMap?.nodes || currentMindMap.nodes.length === 0) {
      return { nodes: [], edges: [] };
    }
    return convertToFlowNodes(currentMindMap.nodes, 100, 300, 0);
  }, [currentMindMap?.nodes, convertToFlowNodes]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialData.edges);

  useEffect(() => {
    const newData = convertToFlowNodes(
      currentMindMap?.nodes || [],
      100,
      300,
      0
    );
    setNodes(newData.nodes);
    setEdges(newData.edges);
  }, [currentMindMap?.nodes, convertToFlowNodes, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNode(node.id);
    },
    [setSelectedNode]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent, node: Node) => {
      e.stopPropagation();
      const nodeData = node.data as unknown as CustomNodeData;
      const newText = prompt('输入新的节点内容:', nodeData?.node?.text);
      if (newText && newText.trim()) {
        updateNode(node.id, newText.trim());
      }
    },
    [updateNode]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!selectedNodeId) return;

      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const newText = prompt('输入新节点内容:');
        if (newText && newText.trim()) {
          addNode(selectedNodeId, newText.trim());
        }
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        const newText = prompt('输入子节点内容:');
        if (newText && newText.trim()) {
          addNode(selectedNodeId, newText.trim());
        }
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          e.preventDefault();
          const target = e.target as HTMLElement;
          if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
            const currentMap = useMindMapStore.getState().currentMindMap;
            if (currentMap?.nodes[0]?.id !== selectedNodeId) {
              useMindMapStore.getState().deleteNode(selectedNodeId);
            }
          }
        }
      }

      if (e.key === 'Escape') {
        setSelectedNode(null);
      }
    },
    [selectedNodeId, addNode, setSelectedNode]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!currentMindMap) {
    return (
      <div className="flex items-center justify-center h-full bg-[#FAFAF9]">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-[#F5F5F0] to-[#E5E5E0] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-[#8A8A8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-xl text-[#8A8A8A] font-light tracking-wide">暂无思维导图</p>
        </div>
      </div>
    );
  }

  const themeColors = getTheme(theme);

  return (
    <div className="w-full h-full" style={{ backgroundColor: themeColors.colors.background }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={handleDoubleClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.1}
        maxZoom={2.5}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { strokeWidth: 2 },
        }}
      >
        <Background
          color={themeColors.colors.border}
          gap={30}
          size={1}
        />
        <Controls
          className="!bg-white/80 !backdrop-blur-xl !shadow-[0_4px_20px_rgba(0,0,0,0.08)] !rounded-2xl !border-2 !border-[#E5E5E0]"
          showInteractive={false}
        />
        <MiniMap
          className="!bg-white/80 !backdrop-blur-xl !shadow-[0_4px_20px_rgba(0,0,0,0.08)] !rounded-2xl !border-2 !border-[#E5E5E0]"
          nodeColor="#D4AF37"
          maskColor="rgba(0, 0, 0, 0.05)"
          style={{
            borderRadius: '16px',
          }}
        />
      </ReactFlow>
    </div>
  );
};

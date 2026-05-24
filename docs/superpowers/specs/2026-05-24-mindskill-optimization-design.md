# MindSKILL 全面优化设计方案

**日期**: 2026-05-24  
**版本**: 1.0  
**策略**: 快速迭代法（方案 A）

## 1. 项目概述

### 1.1 优化目标
将 MindSKILL 打造成功能完善、体验优秀的 XMind 平替产品，通过快速迭代的方式分阶段实现：
- **Phase 1（1周）**: 核心体验优化 - 快捷键、搜索、右键菜单、导出
- **Phase 2（1-2周）**: 功能补全 - 节点增强、大纲视图、主题扩展、布局优化
- **Phase 3（2-3周）**: AI 增强 - 结构优化、摘要生成、智能问答

### 1.2 当前状态
**已有功能**:
- AI 智能生成（DeepSeek、OpenAI、Claude 等）
- AI 扩展节点
- XMind 格式导入/导出
- 本地存储（localStorage）
- 撤销/重做（50步历史）
- 5 种主题切换
- Tauri 桌面应用（Mac/Windows）
- React Flow 渲染引擎

**技术栈**:
- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- React Flow (@xyflow/react)
- Zustand (状态管理)
- Tauri 2 (桌面应用)

## 2. 架构设计

### 2.1 整体架构
保持现有的 Next.js + React Flow + Zustand 架构，在此基础上增强：

**核心模块**:
- **快捷键系统**: 全局 hook (`useKeyboardShortcuts`) 统一管理
- **命令系统**: Command Pattern 实现撤销/重做/复制/粘贴
- **搜索引擎**: 节点索引 + 高亮系统
- **导出引擎**: 多格式导出（PNG/PDF/SVG）
- **节点增强**: 图标/标记/备注/链接系统
- **布局引擎**: 自动布局算法优化

**数据流**:
```
用户操作 → 快捷键/UI事件 → Command执行 → Store更新 → React Flow重渲染
                                    ↓
                              历史记录栈（撤销/重做）
```

### 2.2 文件结构
```
src/
├── hooks/
│   ├── useKeyboardShortcuts.ts      # 快捷键系统
│   ├── useContextMenu.ts            # 右键菜单
│   ├── useSearch.ts                 # 搜索功能
│   └── useCommandHistory.ts         # 命令历史（撤销/重做）
├── lib/
│   ├── commands/                    # 命令模式实现
│   │   ├── Command.ts
│   │   ├── AddNodeCommand.ts
│   │   ├── DeleteNodeCommand.ts
│   │   └── UpdateNodeCommand.ts
│   ├── export-utils.ts              # 导出工具
│   ├── search-engine.ts             # 搜索引擎
│   ├── layout-algorithms.ts         # 布局算法
│   └── performance-utils.ts         # 性能优化工具
├── components/
│   ├── MindMap/
│   │   ├── ContextMenu.tsx          # 右键菜单
│   │   ├── SearchBar.tsx            # 搜索栏
│   │   ├── OutlineView.tsx          # 大纲视图
│   │   ├── IconPicker.tsx           # 图标选择器
│   │   ├── MarkerPicker.tsx         # 标记选择器
│   │   └── NodeNote.tsx             # 节点备注
│   ├── Settings/
│   │   ├── ThemeCustomizer.tsx      # 主题编辑器
│   │   └── KeyboardShortcuts.tsx    # 快捷键配置
│   └── AI/
│       ├── AIOptimizeModal.tsx      # AI 优化
│       ├── AISummaryModal.tsx       # AI 摘要
│       └── AIChatPanel.tsx          # AI 问答
└── app/
    └── api/
        └── ai/
            ├── optimize/route.ts    # AI 优化端点
            ├── summarize/route.ts   # AI 摘要端点
            └── chat/route.ts        # AI 问答端点
```

## 3. 数据模型设计

### 3.1 扩展的节点数据结构
```typescript
interface MindNode {
  id: string;
  text: string;
  children: MindNode[];
  
  // 现有字段
  position?: { x: number; y: number };
  style?: NodeStyle;
  collapsed?: boolean;
  expanded?: boolean;
  
  // 新增字段
  icon?: string;              // Lucide 图标名称
  markers?: NodeMarker[];     // 标记（星标、重要、完成等）
  note?: string;              // 备注
  link?: string;              // 外部链接
  tags?: string[];            // 标签
  priority?: 1 | 2 | 3 | 4 | 5; // 优先级
}

interface NodeMarker {
  type: 'star' | 'important' | 'done' | 'progress' | 'question';
  color?: string;
}
```

### 3.2 命令系统
```typescript
interface Command {
  execute(): void;
  undo(): void;
  redo(): void;
}

// 历史记录栈
interface HistoryState {
  undoStack: Command[];
  redoStack: Command[];
  maxSize: 50;
}
```

### 3.3 搜索索引
```typescript
interface SearchIndex {
  nodeId: string;
  text: string;
  path: string[];  // 节点路径（用于导航）
  level: number;
}
```

## 4. Phase 1: 核心体验优化（1周）

### 4.1 快捷键系统

**实现方案**:
- 使用自定义 hook `useKeyboardShortcuts`
- 支持组合键（Cmd/Ctrl + 字母）
- 支持上下文感知（编辑模式 vs 浏览模式）
- 可配置和自定义

**快捷键映射**:
```typescript
const shortcuts = {
  // 编辑操作
  'mod+z': () => undo(),
  'mod+shift+z': () => redo(),
  'mod+c': () => copyNode(),
  'mod+v': () => pasteNode(),
  'mod+x': () => cutNode(),
  'mod+d': () => duplicateNode(),
  
  // 节点操作
  'enter': () => addSiblingNode(),
  'tab': () => addChildNode(),
  'delete': () => deleteNode(),
  'f2': () => editNode(),
  'space': () => toggleExpand(),
  
  // 导航
  'mod+f': () => openSearch(),
  'escape': () => closeModal(),
  
  // 保存
  'mod+s': () => saveMindMap(),
};
```

**技术实现**:
- 监听 `keydown` 事件
- 阻止默认行为（如 Cmd+S 保存网页）
- 编辑状态下禁用部分快捷键

**文件位置**:
- `src/hooks/useKeyboardShortcuts.ts`
- `src/components/Settings/KeyboardShortcuts.tsx`

### 4.2 节点右键菜单

**菜单项**:
```typescript
const contextMenuItems = [
  { label: '添加子节点', icon: 'Plus', shortcut: 'Tab', action: 'addChild' },
  { label: '添加同级节点', icon: 'ArrowRight', shortcut: 'Enter', action: 'addSibling' },
  { type: 'divider' },
  { label: '复制', icon: 'Copy', shortcut: 'Cmd+C', action: 'copy' },
  { label: '剪切', icon: 'Scissors', shortcut: 'Cmd+X', action: 'cut' },
  { label: '粘贴', icon: 'Clipboard', shortcut: 'Cmd+V', action: 'paste' },
  { label: '删除', icon: 'Trash2', shortcut: 'Delete', action: 'delete', danger: true },
  { type: 'divider' },
  { label: '添加图标', icon: 'Smile', action: 'addIcon' },
  { label: '添加标记', icon: 'Tag', action: 'addMarker' },
  { label: '添加备注', icon: 'FileText', action: 'addNote' },
  { label: '添加链接', icon: 'Link', action: 'addLink' },
  { type: 'divider' },
  { label: 'AI 扩展', icon: 'Sparkles', action: 'aiExpand' },
];
```

**实现细节**:
- 使用 Portal 渲染到 body
- 点击外部自动关闭
- 位置智能调整（避免超出屏幕）
- 显示快捷键提示

**文件位置**:
- `src/components/MindMap/ContextMenu.tsx`
- `src/hooks/useContextMenu.ts`

### 4.3 搜索功能

**功能特性**:
- 实时搜索（输入即搜索）
- 高亮匹配节点
- 结果导航（上一个/下一个）
- 支持正则表达式（可选）
- 显示匹配路径

**UI 设计**:
- 浮动搜索框（Cmd+F 触发）
- 显示匹配数量（如 "3/10"）
- 上/下箭头导航按钮
- 关闭按钮（Escape）

**搜索算法**:
```typescript
function searchNodes(nodes: MindNode[], query: string): SearchResult[] {
  const results: SearchResult[] = [];
  
  function traverse(node: MindNode, path: string[]) {
    if (node.text.toLowerCase().includes(query.toLowerCase())) {
      results.push({
        nodeId: node.id,
        text: node.text,
        path: [...path, node.text],
        matchIndex: node.text.toLowerCase().indexOf(query.toLowerCase())
      });
    }
    
    node.children?.forEach(child => 
      traverse(child, [...path, node.text])
    );
  }
  
  nodes.forEach(node => traverse(node, []));
  return results;
}
```

**文件位置**:
- `src/components/MindMap/SearchBar.tsx`
- `src/lib/search-engine.ts`
- `src/hooks/useSearch.ts`

### 4.4 导出功能（PNG/PDF/SVG）

**实现方案**:
- **PNG/SVG**: 使用 `html-to-image` 库
- **PDF**: 使用 `jsPDF` + Canvas/SVG
- 导出选项：分辨率、背景色、包含/排除控制栏

**导出流程**:
```
1. 隐藏 UI 控件（工具栏、缩放按钮等）
2. 调整画布视图（fit view）
3. 生成图像/PDF
4. 恢复 UI 控件
5. 触发下载
```

**API 设计**:
```typescript
// src/lib/export-utils.ts
export async function exportToPNG(
  element: HTMLElement, 
  options: ExportOptions
): Promise<Blob>

export async function exportToSVG(
  element: HTMLElement, 
  options: ExportOptions
): Promise<Blob>

export async function exportToPDF(
  element: HTMLElement, 
  options: ExportOptions
): Promise<Blob>

interface ExportOptions {
  width?: number;
  height?: number;
  backgroundColor?: string;
  quality?: number;
  includeControls?: boolean;
}
```

**文件位置**:
- `src/lib/export-utils.ts`
- `src/components/Dashboard/ExportModal.tsx`

## 5. Phase 2: 功能补全（1-2周）

### 5.1 节点增强功能

#### 5.1.1 节点图标系统

**图标选择器**:
- 分类展示（表情、符号、优先级、进度等）
- 搜索功能
- 最近使用
- 自定义颜色

**预设图标分类**:
```typescript
const iconCategories = {
  priority: ['AlertCircle', 'AlertTriangle', 'Flag', 'Star', 'Zap'],
  progress: ['Circle', 'CheckCircle', 'XCircle', 'Clock', 'Loader'],
  emotion: ['Smile', 'Frown', 'Meh', 'Heart', 'ThumbsUp'],
  business: ['Briefcase', 'TrendingUp', 'DollarSign', 'Users', 'Target'],
  tech: ['Code', 'Database', 'Server', 'Cpu', 'Wifi'],
};
```

**文件位置**:
- `src/components/MindMap/IconPicker.tsx`

#### 5.1.2 节点标记系统

**标记类型**:
- 星标（重要）
- 完成状态（✓ / ✗）
- 进度（0-100%）
- 优先级（P1-P5）
- 自定义标签

**视觉呈现**:
- 小徽章显示在节点右上角
- 支持多个标记同时显示
- 悬浮显示详细信息

**文件位置**:
- `src/components/MindMap/MarkerPicker.tsx`

#### 5.1.3 节点备注和链接

**备注功能**:
- 富文本编辑（Markdown 支持）
- 悬浮显示预览
- 点击展开完整编辑器

**链接功能**:
- 支持外部 URL
- 支持内部节点引用
- 点击打开新标签页
- 显示链接图标

**文件位置**:
- `src/components/MindMap/NodeNote.tsx`

### 5.2 大纲视图

**功能特性**:
- 左侧边栏树形展示
- 支持拖拽排序（改变节点顺序和层级）
- 点击定位到画布节点
- 折叠/展开分支
- 与画布双向同步

**实现方案**:
- 使用 `@dnd-kit/core` 实现拖拽
- 递归组件渲染树结构
- 拖拽时显示插入位置指示器
- 实时同步到 Zustand store

**UI 布局**:
```
┌─────────────┬──────────────────────┐
│  大纲视图    │    画布区域           │
│  (可折叠)    │                      │
│  - 节点1     │   [思维导图可视化]    │
│    - 子节点  │                      │
│  - 节点2     │                      │
│             │                      │
└─────────────┴──────────────────────┘
```

**文件位置**:
- `src/components/MindMap/OutlineView.tsx`

### 5.3 主题系统扩展

**新增主题**（在现有 5 个基础上）:
```typescript
const newThemes = {
  // 现有：luxury, classic, modern, elegant, vibrant
  
  // 新增
  dark: {
    name: '暗黑模式',
    background: '#1A1A1A',
    nodeColors: ['#2A2A2A', '#3A3A3A', '#4A4A4A'],
    textColor: '#FFFFFF',
    edgeColor: '#666666',
  },
  minimal: {
    name: '极简风',
    background: '#FFFFFF',
    nodeColors: ['#F5F5F5', '#E5E5E5', '#D5D5D5'],
    textColor: '#000000',
    edgeColor: '#CCCCCC',
  },
  business: {
    name: '商务风',
    background: '#F8F9FA',
    nodeColors: ['#0066CC', '#0052A3', '#003D7A'],
    textColor: '#FFFFFF',
    edgeColor: '#0066CC',
  },
  handdrawn: {
    name: '手绘风',
    background: '#FFF9E6',
    nodeColors: ['#FFE5B4', '#FFD700', '#FFA500'],
    textColor: '#333333',
    edgeColor: '#8B4513',
    fontFamily: 'Comic Sans MS, cursive',
  },
  tech: {
    name: '科技风',
    background: '#0A0E27',
    nodeColors: ['#00D9FF', '#0099FF', '#0066FF'],
    textColor: '#FFFFFF',
    edgeColor: '#00D9FF',
  },
};
```

**自定义主题编辑器**:
- 颜色选择器（节点、背景、边、文字）
- 字体选择（大小、粗细、字体族）
- 边样式（直线、曲线、折线）
- 节点形状（矩形、圆角矩形、椭圆、菱形）
- 实时预览
- 保存为自定义主题

**文件位置**:
- `src/lib/themes.ts`（扩展）
- `src/components/Settings/ThemeCustomizer.tsx`

### 5.4 自动布局优化

**布局算法改进**:
- **避免节点重叠**: 碰撞检测和自动调整
- **智能间距**: 根据节点内容长度动态调整
- **紧凑模式**: 减少空白，适合大型导图
- **对齐优化**: 同级节点垂直对齐

**新增布局模式**:
```typescript
type LayoutMode = 
  | 'horizontal'      // 水平（现有）
  | 'vertical'        // 垂直（现有）
  | 'tree'           // 树状（现有）
  | 'radial'         // 放射状（新增）
  | 'fishbone'       // 鱼骨图（新增）
  | 'organization';  // 组织架构图（新增）
```

**文件位置**:
- `src/lib/layout-algorithms.ts`
- `src/components/MindMap/EnhancedCanvas.tsx`（更新）

## 6. Phase 3: AI 功能增强（2-3周）

### 6.1 AI 优化导图结构

**功能**:
- 分析导图逻辑性和完整性
- 建议重组节点顺序
- 识别并合并重复内容
- 补充缺失的关键分支

**实现流程**:
```
1. 用户点击 "AI 优化"
2. 将当前导图结构发送给 AI
3. AI 分析并返回优化建议
4. 展示对比视图（当前 vs 优化后）
5. 用户选择应用或忽略
```

**Prompt 设计**:
```
分析以下思维导图结构，提供优化建议：
{mindmap_json}

请从以下角度分析：
1. 逻辑性：节点分组是否合理
2. 完整性：是否缺少关键分支
3. 重复性：是否有重复或冗余内容
4. 层级性：层级深度是否合适

返回 JSON 格式的优化建议。
```

**文件位置**:
- `src/app/api/ai/optimize/route.ts`
- `src/components/AI/AIOptimizeModal.tsx`

### 6.2 AI 生成节点摘要

**功能**:
- 选中分支，生成摘要
- 摘要作为节点备注
- 支持多种风格（简洁/详细/要点）

**使用场景**:
- 复杂分支的快速理解
- 导出前的内容总结
- 演示文稿准备

**Prompt 设计**:
```
为以下思维导图分支生成摘要：
{branch_json}

摘要风格：{style}  // 简洁/详细/要点

要求：
- 提炼核心内容
- 保持逻辑清晰
- 字数控制在 {maxWords} 字以内
```

**文件位置**:
- `src/app/api/ai/summarize/route.ts`
- `src/components/AI/AISummaryModal.tsx`

### 6.3 AI 智能问答助手

**功能**:
- 侧边栏 AI 对话面板
- 基于当前导图内容回答问题
- 支持生成新节点并插入

**交互流程**:
```
用户: "这个项目的主要风险是什么？"
AI: [分析导图] "根据您的思维导图，主要风险包括..."
用户: "把这些风险加到导图里"
AI: [自动创建 "风险" 分支并添加子节点]
```

**实现细节**:
- 将导图内容作为上下文发送给 AI
- 支持多轮对话
- 支持直接操作导图（添加/修改节点）

**文件位置**:
- `src/app/api/ai/chat/route.ts`
- `src/components/AI/AIChatPanel.tsx`

## 7. 性能优化

### 7.1 大型导图优化

**目标**: 支持 1000+ 节点流畅运行

**优化策略**:
- **虚拟化渲染**: 只渲染可视区域的节点
- **懒加载**: 折叠节点的子节点延迟加载
- **节流防抖**: 拖拽、缩放操作节流
- **Web Worker**: 布局计算移到后台线程
- **Canvas 渲染**: 超大导图使用 Canvas 替代 DOM

**性能指标**:
```typescript
const performanceTargets = {
  initialRender: '< 2s',      // 首次渲染
  nodeRender: '< 100ms',      // 100 节点渲染
  dragResponse: '< 16ms',     // 拖拽响应（60fps）
  searchSpeed: '< 200ms',     // 搜索速度
  exportTime: '< 3s',         // 导出时间
  memoryUsage: '< 200MB',     // 内存占用
};
```

**文件位置**:
- `src/lib/performance-utils.ts`

### 7.2 代码分割和懒加载

**分割策略**:
```typescript
// 路由级别分割
const EditorPage = lazy(() => import('@/app/editor/[id]/page'));
const DashboardPage = lazy(() => import('@/app/page'));

// 组件级别分割
const AIGenerateModal = lazy(() => import('@/components/AI/AIGenerateModal'));
const ExportModal = lazy(() => import('@/components/Dashboard/ExportModal'));
const ThemeCustomizer = lazy(() => import('@/components/Settings/ThemeCustomizer'));
```

## 8. 依赖包新增

```json
{
  "dependencies": {
    "html-to-image": "^1.11.11",
    "jspdf": "^2.5.1",
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0"
  }
}
```

## 9. 实施时间表

### Week 1: Phase 1 核心体验
- Day 1-2: 快捷键系统 + 命令模式
- Day 3-4: 右键菜单 + 搜索功能
- Day 5-7: 导出功能（PNG/PDF/SVG）

### Week 2-3: Phase 2 功能补全
- Day 8-10: 节点增强（图标、标记、备注、链接）
- Day 11-13: 大纲视图 + 拖拽排序
- Day 14-16: 主题扩展 + 自定义编辑器
- Day 17-21: 布局优化 + 性能优化

### Week 4-6: Phase 3 AI 增强
- Day 22-28: AI 优化导图结构
- Day 29-35: AI 生成摘要
- Day 36-42: AI 智能问答助手

## 10. 测试策略

### 10.1 单元测试
- 快捷键系统测试
- 命令模式测试（撤销/重做）
- 搜索算法测试
- 导出功能测试

### 10.2 集成测试
- 用户操作流程测试
- AI 功能集成测试
- 导入/导出兼容性测试

### 10.3 性能测试
- 大型导图渲染性能
- 内存占用测试
- 导出速度测试

## 11. 成功指标

### 11.1 功能完整度
- [ ] 90% 的 XMind 核心功能覆盖
- [ ] 所有快捷键正常工作
- [ ] 导出格式完整（XMind/PNG/PDF/SVG/JSON）
- [ ] AI 功能稳定可用

### 11.2 性能指标
- [ ] 首次渲染 < 2s
- [ ] 100 节点渲染 < 100ms
- [ ] 搜索响应 < 200ms
- [ ] 导出时间 < 3s
- [ ] 内存占用 < 200MB

### 11.3 用户体验
- [ ] 快捷键覆盖所有常用操作
- [ ] 右键菜单直观易用
- [ ] 搜索功能准确快速
- [ ] 导出质量高

## 12. 风险和缓解

### 12.1 技术风险
**风险**: React Flow 性能瓶颈（1000+ 节点）  
**缓解**: 虚拟化渲染 + Canvas 降级方案

**风险**: 导出质量不佳  
**缓解**: 多种导出库测试，选择最优方案

**风险**: AI API 调用失败  
**缓解**: 错误处理 + 重试机制 + 降级提示

### 12.2 时间风险
**风险**: 功能开发超时  
**缓解**: 优先级排序，核心功能优先，次要功能可延后

### 12.3 兼容性风险
**风险**: XMind 导入/导出兼容性问题  
**缓解**: 充分测试各版本 XMind 文件，保持向后兼容

## 13. 后续迭代

### Phase 4（长期规划）
- 云同步（Supabase/Firebase）
- 多人协作（WebSocket）
- 模板市场
- 移动端适配
- 插件系统

---

**文档版本**: 1.0  
**最后更新**: 2026-05-24  
**负责人**: Andy  
**状态**: 待审核

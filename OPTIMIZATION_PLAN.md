# Mindskill 优化计划 - 平替 XMind

## 📊 当前状态分析

### ✅ 已有功能
- AI 智能生成思维导图（DeepSeek、OpenAI、Claude 等）
- AI 扩展节点
- XMind 格式导入/导出
- 本地存储（localStorage）
- 撤销/重做（50步历史）
- 5 种主题切换
- Tauri 桌面应用（Mac/Windows）
- React Flow 渲染引擎

### ❌ 缺失功能（对比 XMind）
1. **导出格式不足**：只有 JSON 和 XMind，缺少 PNG、PDF、SVG
2. **快捷键支持有限**：只有基础的 Enter 和 Tab
3. **节点功能单一**：无图标、标记、备注
4. **缺少搜索功能**
5. **无大纲视图**
6. **样式定制有限**：只有 5 个主题
7. **无云同步和协作**

---

## 🎯 优化方案（分阶段）

### Phase 1: 核心功能补全（1-2周）

#### 1.1 导出功能增强 ⭐⭐⭐
**目标**：支持 PNG、PDF、SVG 导出

**实现方案**：
- PNG/SVG：使用 `html-to-image` 或 `dom-to-image-more`
- PDF：使用 `jsPDF` + SVG 转换
- 添加导出选项：分辨率、背景色、水印

**代码位置**：
- `src/components/Dashboard/ExportModal.tsx`
- 新增 `src/lib/export-utils.ts`

#### 1.2 快捷键系统 ⭐⭐⭐
**目标**：完整的快捷键支持

**快捷键列表**：
```
Enter       - 添加同级节点
Tab         - 添加子节点
Delete      - 删除节点
Cmd/Ctrl+Z  - 撤销
Cmd/Ctrl+Y  - 重做
Cmd/Ctrl+C  - 复制节点
Cmd/Ctrl+V  - 粘贴节点
Cmd/Ctrl+X  - 剪切节点
Cmd/Ctrl+D  - 复制节点
Cmd/Ctrl+F  - 搜索
Cmd/Ctrl+S  - 保存
Space       - 展开/折叠节点
F2          - 编辑节点
Esc         - 取消编辑
```

**实现方案**：
- 使用 `react-hotkeys-hook` 或自定义 hook
- 添加快捷键配置面板
- 支持自定义快捷键

**代码位置**：
- 新增 `src/hooks/useKeyboardShortcuts.ts`
- 更新 `src/components/MindMap/EnhancedCanvas.tsx`

#### 1.3 节点增强功能 ⭐⭐
**目标**：节点图标、标记、备注

**功能清单**：
- 节点图标（优先级、进度、类型等）
- 节点标记（星标、重要、完成等）
- 节点备注（悬浮显示）
- 节点链接（URL）

**实现方案**：
- 扩展 `MindNode` 类型定义
- 使用 Lucide React 图标库
- 添加节点右键菜单

**代码位置**：
- 更新 `src/lib/types.ts`
- 更新 `src/components/MindMap/Node.tsx`
- 新增 `src/components/MindMap/NodeContextMenu.tsx`

#### 1.4 搜索功能 ⭐⭐
**目标**：全局搜索节点内容

**功能清单**：
- 搜索框（Cmd/Ctrl+F 触发）
- 高亮匹配节点
- 搜索结果导航（上一个/下一个）
- 支持正则表达式

**实现方案**：
- 添加搜索状态管理
- 实现节点遍历和匹配算法
- 添加搜索结果高亮样式

**代码位置**：
- 新增 `src/components/MindMap/SearchBar.tsx`
- 更新 `src/lib/store.ts`

---

### Phase 2: 体验优化（2-3周）

#### 2.1 大纲视图 ⭐⭐
**目标**：树形大纲视图，支持拖拽排序

**功能清单**：
- 左侧边栏大纲视图
- 支持拖拽调整节点顺序
- 点击定位到画布节点
- 折叠/展开分支

**实现方案**：
- 使用 `@dnd-kit/core` 实现拖拽
- 递归渲染树形结构
- 同步画布和大纲状态

**代码位置**：
- 新增 `src/components/MindMap/OutlineView.tsx`

#### 2.2 更多主题和样式 ⭐
**目标**：10+ 主题，支持自定义

**主题列表**：
- 现有 5 个主题
- 新增：暗黑模式、简约风、商务风、手绘风、科技风

**实现方案**：
- 扩展 `XMindStyles` 配置
- 添加主题预览
- 支持自定义颜色和字体

**代码位置**：
- 更新 `src/lib/xmind-parser.ts`
- 新增 `src/components/Settings/ThemeCustomizer.tsx`

#### 2.3 节点自动布局优化 ⭐
**目标**：更智能的节点布局算法

**优化点**：
- 避免节点重叠
- 自动调整间距
- 支持多种布局模式（树状、鱼骨图、组织架构图）

**实现方案**：
- 使用 React Flow 的自动布局 API
- 实现自定义布局算法

**代码位置**：
- 更新 `src/components/MindMap/EnhancedCanvas.tsx`
- 新增 `src/lib/layout-algorithms.ts`

#### 2.4 拖拽体验优化 ⭐
**目标**：更流畅的拖拽和连线

**优化点**：
- 拖拽时显示预览
- 支持多选拖拽
- 拖拽到边缘自动滚动

**实现方案**：
- 优化 React Flow 配置
- 添加拖拽动画

---

### Phase 3: AI 增强（3-4周）

#### 3.1 AI 优化导图结构 ⭐⭐⭐
**目标**：AI 分析并优化思维导图结构

**功能清单**：
- 分析导图逻辑性
- 建议重组节点
- 合并重复内容
- 补充缺失分支

**实现方案**：
- 新增 API 端点 `/api/ai/optimize`
- 设计优化提示词
- 展示优化建议（对比视图）

**代码位置**：
- 新增 `src/app/api/ai/optimize/route.ts`
- 新增 `src/components/AI/AIOptimizeModal.tsx`

#### 3.2 AI 生成节点摘要 ⭐⭐
**目标**：为复杂分支生成摘要

**功能清单**：
- 选中分支，生成摘要
- 摘要作为节点备注
- 支持多种摘要风格（简洁、详细、要点）

**实现方案**：
- 新增 API 端点 `/api/ai/summarize`
- 遍历子节点内容
- 生成结构化摘要

**代码位置**：
- 新增 `src/app/api/ai/summarize/route.ts`
- 更新 `src/components/AI/AIExpandModal.tsx`

#### 3.3 AI 智能问答 ⭐⭐
**目标**：基于思维导图内容的 AI 问答

**功能清单**：
- 侧边栏 AI 助手
- 基于当前导图内容回答问题
- 支持生成新节点

**实现方案**：
- 新增 API 端点 `/api/ai/chat`
- 将导图内容作为上下文
- 实现对话界面

**代码位置**：
- 新增 `src/components/AI/AIChatPanel.tsx`
- 新增 `src/app/api/ai/chat/route.ts`

---

### Phase 4: 高级功能（4-6周）

#### 4.1 云同步 ⭐⭐⭐
**目标**：多设备同步

**技术方案**：
- 使用 Supabase 或 Firebase
- 实时同步
- 冲突解决

#### 4.2 协作功能 ⭐⭐
**目标**：多人实时协作

**技术方案**：
- WebSocket 实时通信
- 操作冲突解决
- 用户光标显示

#### 4.3 模板市场 ⭐
**目标**：社区模板分享

**功能清单**：
- 模板上传/下载
- 模板评分和评论
- 模板分类和搜索

---

## 🚀 实施优先级

### 立即实施（本周）
1. ✅ 导出 PNG/PDF
2. ✅ 快捷键系统
3. ✅ 节点图标和标记

### 近期实施（2周内）
4. 搜索功能
5. 大纲视图
6. 更多主题

### 中期实施（1个月内）
7. AI 优化导图
8. AI 生成摘要
9. 节点自动布局

### 长期规划（2-3个月）
10. 云同步
11. 协作功能
12. 模板市场

---

## 📝 技术债务

### 需要重构的部分
1. **状态管理**：考虑迁移到 Jotai 或 Valtio（更轻量）
2. **类型定义**：完善 TypeScript 类型
3. **测试覆盖**：添加单元测试和 E2E 测试
4. **性能优化**：大型导图（1000+ 节点）性能优化
5. **错误处理**：统一错误处理和用户提示

---

## 🎨 UI/UX 改进

### 视觉优化
- [ ] 更现代的 UI 设计
- [ ] 动画效果优化
- [ ] 响应式布局
- [ ] 无障碍支持（ARIA）

### 交互优化
- [ ] 更直观的工具栏
- [ ] 右键菜单
- [ ] 拖拽提示
- [ ] 加载状态优化

---

## 📊 性能目标

- 启动时间：< 2s
- 导图渲染：< 100ms（100 节点）
- AI 生成响应：< 5s
- 导出 PNG：< 3s
- 内存占用：< 200MB

---

## 🔧 开发工具

### 推荐工具
- **Storybook**：组件开发和文档
- **Vitest**：单元测试
- **Playwright**：E2E 测试
- **Lighthouse**：性能分析
- **Bundle Analyzer**：打包分析

---

## 📚 参考资源

### 竞品分析
- XMind
- MindMeister
- Coggle
- Miro

### 技术参考
- React Flow 文档
- Tauri 文档
- AI Prompt Engineering

---

## 🎯 成功指标

### 用户体验
- [ ] 90% 的 XMind 核心功能覆盖
- [ ] 用户满意度 > 4.5/5
- [ ] 日活用户 > 1000

### 技术指标
- [ ] 代码覆盖率 > 80%
- [ ] 性能评分 > 90
- [ ] 无严重 Bug

### 商业指标
- [ ] GitHub Stars > 1000
- [ ] 付费用户转化率 > 5%
- [ ] 月活用户 > 10000

---

**更新时间**：2026-05-10
**负责人**：Andy
**状态**：规划中

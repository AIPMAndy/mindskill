import { Command } from './commands/Command';

export interface NodeMarker {
  type: 'star' | 'check' | 'cross' | 'progress' | 'priority' | 'custom';
  value?: string | number;
  color?: string;
}

export interface MindNode {
  id: string;
  text: string;
  children: MindNode[];
  position?: { x: number; y: number };
  style?: NodeStyle;
  collapsed?: boolean;
  expanded?: boolean;
  icon?: string;
  markers?: NodeMarker[];
  note?: string;
  link?: string;
  tags?: string[];
  priority?: 1 | 2 | 3 | 4 | 5;
}

export interface NodeStyle {
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  fontWeight?: number;
  borderColor?: string;
  borderWidth?: number;
}

export interface MindMap {
  id: string;
  title: string;
  nodes: MindNode[];
  settings: MindMapSettings;
  createdAt: string;
  updatedAt: string;
}

export interface MindMapSettings {
  layout: 'horizontal' | 'vertical' | 'tree';
  theme: string;
  zoom: number;
  compact?: boolean;
}

export type ThemeColor = 'luxury' | 'ocean' | 'forest' | 'sunset' | 'purple' | 'rose';

export type AIModel =
  | 'openai'
  | 'anthropic'
  | 'deepseek'
  | 'zhipu'
  | 'qwen'
  | 'kimi'
  | 'siliconflow'
  | 'custom';

export interface AIRequest {
  topic?: string;
  nodeText?: string;
  model: AIModel;
  depth?: number;
  count?: number;
}

export interface AIResponse {
  nodes?: MindNode[];
  children?: MindNode[];
  error?: string;
}

export interface CommandHistoryState {
  undoStack: Command[];
  redoStack: Command[];
  maxSize: number;
}

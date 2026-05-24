import { Command } from './commands/Command';

export interface MindNode {
  id: string;
  text: string;
  children: MindNode[];
  position?: { x: number; y: number };
  style?: NodeStyle;
  collapsed?: boolean;
  expanded?: boolean;
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

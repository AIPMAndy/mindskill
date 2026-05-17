export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    textSecondary: string;
    border: string;
    borderHover: string;
    shadow: string;
    rootGradientFrom: string;
    rootGradientTo: string;
    connection: string;
  };
}

export const themes: Record<string, Theme> = {
  luxury: {
    id: 'luxury',
    name: 'LV 奢华',
    colors: {
      primary: '#1A1A1A',
      secondary: '#3A3A3A',
      accent: '#D4AF37',
      background: '#FAF9F6',
      text: '#1A1A1A',
      textSecondary: '#8A8A8A',
      border: '#E5E5E0',
      borderHover: '#D4AF37',
      shadow: 'rgba(0,0,0,0.06)',
      rootGradientFrom: '#1A1A1A',
      rootGradientTo: '#3A3A3A',
      connection: '#D4AF37',
    },
  },
  ocean: {
    id: 'ocean',
    name: '海洋蓝',
    colors: {
      primary: '#0A2463',
      secondary: '#1E3A8A',
      accent: '#3B82F6',
      background: '#F0F9FF',
      text: '#0A2463',
      textSecondary: '#64748B',
      border: '#DBEAFE',
      borderHover: '#3B82F6',
      shadow: 'rgba(59,130,246,0.1)',
      rootGradientFrom: '#0A2463',
      rootGradientTo: '#1E3A8A',
      connection: '#3B82F6',
    },
  },
  forest: {
    id: 'forest',
    name: '森林绿',
    colors: {
      primary: '#064E3B',
      secondary: '#065F46',
      accent: '#10B981',
      background: '#F0FDF4',
      text: '#064E3B',
      textSecondary: '#6B7280',
      border: '#D1FAE5',
      borderHover: '#10B981',
      shadow: 'rgba(16,185,129,0.1)',
      rootGradientFrom: '#064E3B',
      rootGradientTo: '#065F46',
      connection: '#10B981',
    },
  },
  sunset: {
    id: 'sunset',
    name: '日落橙',
    colors: {
      primary: '#7C2D12',
      secondary: '#9A3412',
      accent: '#F97316',
      background: '#FFF7ED',
      text: '#7C2D12',
      textSecondary: '#78716C',
      border: '#FFEDD5',
      borderHover: '#F97316',
      shadow: 'rgba(249,115,22,0.1)',
      rootGradientFrom: '#7C2D12',
      rootGradientTo: '#9A3412',
      connection: '#F97316',
    },
  },
  purple: {
    id: 'purple',
    name: '紫罗兰',
    colors: {
      primary: '#4C1D95',
      secondary: '#5B21B6',
      accent: '#A855F7',
      background: '#FAF5FF',
      text: '#4C1D95',
      textSecondary: '#6B7280',
      border: '#E9D5FF',
      borderHover: '#A855F7',
      shadow: 'rgba(168,85,247,0.1)',
      rootGradientFrom: '#4C1D95',
      rootGradientTo: '#5B21B6',
      connection: '#A855F7',
    },
  },
  rose: {
    id: 'rose',
    name: '玫瑰金',
    colors: {
      primary: '#881337',
      secondary: '#9F1239',
      accent: '#F43F5E',
      background: '#FFF1F2',
      text: '#881337',
      textSecondary: '#78716C',
      border: '#FFE4E6',
      borderHover: '#F43F5E',
      shadow: 'rgba(244,63,94,0.1)',
      rootGradientFrom: '#881337',
      rootGradientTo: '#9F1239',
      connection: '#F43F5E',
    },
  },
};

export const getTheme = (themeId: string): Theme => {
  return themes[themeId] || themes.luxury;
};

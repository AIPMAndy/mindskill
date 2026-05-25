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
  dark: {
    id: 'dark',
    name: 'Dark Mode',
    colors: {
      primary: '#F9FAFB',
      secondary: '#E5E7EB',
      accent: '#60A5FA',
      background: '#111827',
      text: '#F9FAFB',
      textSecondary: '#9CA3AF',
      border: '#374151',
      borderHover: '#60A5FA',
      shadow: 'rgba(0,0,0,0.3)',
      rootGradientFrom: '#1F2937',
      rootGradientTo: '#374151',
      connection: '#60A5FA',
    },
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    colors: {
      primary: '#000000',
      secondary: '#404040',
      accent: '#000000',
      background: '#FFFFFF',
      text: '#000000',
      textSecondary: '#737373',
      border: '#E5E5E5',
      borderHover: '#000000',
      shadow: 'rgba(0,0,0,0.05)',
      rootGradientFrom: '#FFFFFF',
      rootGradientTo: '#F5F5F5',
      connection: '#000000',
    },
  },
  business: {
    id: 'business',
    name: 'Business',
    colors: {
      primary: '#1E3A8A',
      secondary: '#1E40AF',
      accent: '#2563EB',
      background: '#F8FAFC',
      text: '#1E3A8A',
      textSecondary: '#64748B',
      border: '#E2E8F0',
      borderHover: '#2563EB',
      shadow: 'rgba(37,99,235,0.08)',
      rootGradientFrom: '#1E3A8A',
      rootGradientTo: '#1E40AF',
      connection: '#2563EB',
    },
  },
  handdrawn: {
    id: 'handdrawn',
    name: 'Hand Drawn',
    colors: {
      primary: '#7C3AED',
      secondary: '#8B5CF6',
      accent: '#A78BFA',
      background: '#FFFBEB',
      text: '#78350F',
      textSecondary: '#92400E',
      border: '#FDE68A',
      borderHover: '#A78BFA',
      shadow: 'rgba(167,139,250,0.15)',
      rootGradientFrom: '#FEF3C7',
      rootGradientTo: '#FDE68A',
      connection: '#A78BFA',
    },
  },
  tech: {
    id: 'tech',
    name: 'Tech / Cyberpunk',
    colors: {
      primary: '#06B6D4',
      secondary: '#0891B2',
      accent: '#22D3EE',
      background: '#0F172A',
      text: '#06B6D4',
      textSecondary: '#64748B',
      border: '#1E293B',
      borderHover: '#22D3EE',
      shadow: 'rgba(34,211,238,0.2)',
      rootGradientFrom: '#0C4A6E',
      rootGradientTo: '#075985',
      connection: '#22D3EE',
    },
  },
};

export const getTheme = (themeId: string): Theme => {
  return themes[themeId] || themes.luxury;
};

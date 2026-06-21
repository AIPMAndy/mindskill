'use client';

import { Loader2 } from 'lucide-react';

interface LoadingProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export const Loading = ({
  text = '加载中...',
  size = 'md',
  fullScreen = false
}: LoadingProps) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const content = (
    <div className="text-center">
      <Loader2
        className={`${sizes[size]} animate-spin text-blue-600 mx-auto mb-4`}
        strokeWidth={1.5}
      />
      <p className={`${textSizes[size]} text-[#8A8A8A] font-light tracking-wide`}>
        {text}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        {content}
      </div>
    );
  }

  return content;
};

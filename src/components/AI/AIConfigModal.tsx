'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/UI/Modal';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { useMindMapStore } from '@/lib/store';
import { Settings, Check } from 'lucide-react';

interface AIConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIConfigModal = ({ isOpen, onClose }: AIConfigModalProps) => {
  const { aiConfig, setAIConfig } = useMindMapStore();
  const [modelName, setModelName] = useState('');
  const [baseURL, setBaseURL] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (aiConfig) {
      setModelName(aiConfig.modelName);
      setBaseURL(aiConfig.baseURL);
      setApiKey(aiConfig.apiKey);
    }
  }, [aiConfig]);

  const handleSave = () => {
    if (!modelName.trim()) {
      setError('请输入模型名称');
      return;
    }
    if (!baseURL.trim()) {
      setError('请输入 Base URL');
      return;
    }
    if (!apiKey.trim()) {
      setError('请输入 API Key');
      return;
    }

    setAIConfig({
      modelName: modelName.trim(),
      baseURL: baseURL.trim(),
      apiKey: apiKey.trim(),
    });

    setError('');
    onClose();
  };

  const handleClear = () => {
    setAIConfig(null);
    setModelName('');
    setBaseURL('');
    setApiKey('');
    setError('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI 模型配置" size="lg">
      <div className="space-y-6">
        <div className="text-[#8A8A8A] text-base leading-relaxed">
          <p>配置你的AI模型信息，支持任意兼容OpenAI格式的模型。配置后将自动应用到所有AI功能。</p>
        </div>

        <div className="space-y-4">
          <Input
            label="模型名称"
            placeholder="例如：gpt-4o, claude-3-5-sonnet-20241022, deepseek-chat"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            autoFocus
          />

          <Input
            label="Base URL"
            placeholder="例如：https://api.openai.com/v1"
            value={baseURL}
            onChange={(e) => setBaseURL(e.target.value)}
          />

          <Input
            label="API Key"
            type="password"
            placeholder="输入你的 API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>

        <div className="bg-[#FAFAF9] p-4 rounded-2xl border border-[#E5E5E0]">
          <p className="text-sm text-[#8A8A8A] leading-relaxed">
            <strong className="text-[#1A1A1A]">常用配置示例：</strong><br/>
            • <strong>OpenAI:</strong> https://api.openai.com/v1<br/>
            • <strong>DeepSeek:</strong> https://api.deepseek.com<br/>
            • <strong>硅基流动:</strong> https://api.siliconflow.cn/v1<br/>
            • <strong>Anthropic:</strong> https://api.anthropic.com<br/>
            • <strong>自定义中转:</strong> 填入你的中转地址
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {aiConfig && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-green-800 font-medium">已配置模型</p>
              <p className="text-xs text-green-600 mt-1">
                {aiConfig.modelName} - {aiConfig.baseURL}
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-between gap-3 pt-4">
          <Button
            variant="secondary"
            onClick={handleClear}
            disabled={!aiConfig}
          >
            清除配置
          </Button>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>
              取消
            </Button>
            <Button onClick={handleSave}>
              <Settings className="w-4 h-4 mr-2" />
              保存配置
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/UI/Modal';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { useMindMapStore } from '@/lib/store';
import { useToast } from '@/components/UI/Toast';
import { Sparkles, Loader2 } from 'lucide-react';

interface AIGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (
    topic: string,
    model: any,
    customModel?: string,
    customConfig?: { baseURL: string; apiKey: string }
  ) => Promise<void>;
}

export const AIGenerateModal = ({
  isOpen,
  onClose,
  onGenerate,
}: AIGenerateModalProps) => {
  const { aiConfig } = useMindMapStore();
  const { showToast } = useToast();
  const [topic, setTopic] = useState('');
  const [modelName, setModelName] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  // 自动加载保存的配置
  useEffect(() => {
    if (aiConfig) {
      setModelName(aiConfig.modelName);
      setBaseUrl(aiConfig.baseURL);
      setApiKey(aiConfig.apiKey);
    }
  }, [aiConfig]);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('请输入主题');
      return;
    }
    if (!modelName.trim()) {
      setError('请输入模型名称');
      return;
    }
    if (!baseUrl.trim()) {
      setError('请输入 Base URL');
      return;
    }
    if (!apiKey.trim()) {
      setError('请输入 API Key');
      return;
    }

    setError('');
    setIsGenerating(true);

    try {
      await onGenerate(
        topic.trim(),
        'custom',
        modelName.trim(),
        {
          baseURL: baseUrl.trim(),
          apiKey: apiKey.trim(),
        }
      );

      // 成功提示
      showToast('思维导图生成成功！', 'success');

      // 延迟关闭，让用户看到成功提示
      setTimeout(() => {
        onClose();
        setTopic('');
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.message || '生成失败，请重试';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI 创建思维导图" size="lg">
      <div className="space-y-6">
        <div className="text-[#8A8A8A] text-base leading-relaxed">
          <p>输入主题和AI模型配置，支持任意兼容OpenAI格式的模型（OpenAI、Claude、DeepSeek、Qwen等）</p>
        </div>

        <Input
          label="主题"
          placeholder="例如：人工智能在教育中的应用"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          autoFocus
        />

        <div className="space-y-4 bg-[#FAFAF9] p-6 rounded-2xl border border-[#E5E5E0]">
          <div className="flex items-center justify-between mb-4">
            <div className="text-base font-medium text-[#1A1A1A]">
              AI 模型配置
            </div>
            {aiConfig && (
              <span className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
                已使用保存的配置
              </span>
            )}
          </div>

          <Input
            label="模型名称"
            placeholder="例如：gpt-4o, claude-3-5-sonnet-20241022, deepseek-chat"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
          />

          <Input
            label="Base URL"
            placeholder="例如：https://api.openai.com/v1"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
          />

          <Input
            label="API Key"
            type="password"
            placeholder="输入你的 API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />

          {!aiConfig && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-700">
                💡 提示：在首页点击"AI配置"可以保存配置，下次使用时自动填充
              </p>
            </div>
          )}

          <div className="bg-white p-4 rounded-xl border border-[#E5E5E0]">
            <p className="text-sm text-[#8A8A8A] leading-relaxed">
              <strong className="text-[#1A1A1A]">常用配置示例：</strong><br/>
              • OpenAI: https://api.openai.com/v1<br/>
              • DeepSeek: https://api.deepseek.com<br/>
              • 硅基流动: https://api.siliconflow.cn/v1<br/>
              • 自定义中转: 填入你的中转地址
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onClose} disabled={isGenerating}>
            取消
          </Button>
          <Button
            onClick={handleGenerate}
            loading={isGenerating}
            disabled={!topic.trim() || !modelName.trim() || !baseUrl.trim() || !apiKey.trim()}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                开始生成
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};


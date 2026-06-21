'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/UI/Modal';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { useMindMapStore } from '@/lib/store';
import { useToast } from '@/components/UI/Toast';
import { Sparkles, Loader2 } from 'lucide-react';
import { findNodeById } from '@/lib/utils';

interface AIExpandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExpand: (
    count: number,
    model: any,
    customModel?: string,
    customConfig?: { baseURL: string; apiKey: string }
  ) => Promise<void>;
}

export const AIExpandModal = ({
  isOpen,
  onClose,
  onExpand,
}: AIExpandModalProps) => {
  const { currentMindMap, selectedNodeId, aiConfig } = useMindMapStore();
  const { showToast } = useToast();
  const [count, setCount] = useState(3);
  const [modelName, setModelName] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isExpanding, setIsExpanding] = useState(false);
  const [error, setError] = useState('');

  const selectedNode = selectedNodeId && currentMindMap
    ? findNodeById(currentMindMap.nodes, selectedNodeId)
    : null;

  // 自动加载保存的配置
  useEffect(() => {
    if (aiConfig) {
      setModelName(aiConfig.modelName);
      setBaseUrl(aiConfig.baseURL);
      setApiKey(aiConfig.apiKey);
    }
  }, [aiConfig]);

  const handleExpand = async () => {
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
    setIsExpanding(true);

    try {
      await onExpand(
        count,
        'custom',
        modelName.trim(),
        {
          baseURL: baseUrl.trim(),
          apiKey: apiKey.trim(),
        }
      );

      // 成功提示
      showToast(`成功扩展 ${count} 个子节点！`, 'success');

      // 延迟关闭
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.message || '扩展失败，请重试';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsExpanding(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI 扩展节点" size="lg">
      <div className="space-y-6">
        <div className="text-[#8A8A8A] text-base leading-relaxed">
          <p>为选中的节点生成子节点，支持任意兼容OpenAI格式的模型</p>
        </div>

        {selectedNode && (
          <div className="bg-[#FAFAF9] p-4 rounded-2xl border border-[#E5E5E0]">
            <div className="text-sm text-[#8A8A8A] mb-2">当前节点</div>
            <div className="text-lg font-medium text-[#1A1A1A]">{selectedNode.text}</div>
          </div>
        )}

        <div>
          <label className="block text-base font-medium text-[#1A1A1A] mb-3">
            生成数量
          </label>
          <div className="flex gap-3">
            {[3, 5, 8].map((num) => (
              <button
                key={num}
                onClick={() => setCount(num)}
                className={`flex-1 py-3 rounded-xl border-2 transition-all text-base font-medium ${
                  count === num
                    ? 'border-[#D4AF37] bg-[#FAFAF9] text-[#1A1A1A]'
                    : 'border-[#E5E5E0] text-[#8A8A8A] hover:border-[#D4AF37]'
                }`}
              >
                {num} 个
              </button>
            ))}
          </div>
        </div>

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
          <Button variant="secondary" onClick={onClose} disabled={isExpanding}>
            取消
          </Button>
          <Button
            onClick={handleExpand}
            loading={isExpanding}
            disabled={!modelName.trim() || !baseUrl.trim() || !apiKey.trim()}
          >
            {isExpanding ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                扩展中...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                开始扩展
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

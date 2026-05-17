'use client';

import { useState } from 'react';
import { Modal } from '@/components/UI/Modal';
import { useMindMapStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { TEMPLATES } from '@/lib/xmind-parser';
import { FileText, Plus, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { MindNode } from '@/lib/types';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const createNodesFromTemplate = (templateNodes: any[]): MindNode[] => {
  const convert = (nodes: any[]): MindNode[] => {
    return nodes.map(node => ({
      id: uuidv4(),
      text: node.text,
      children: node.children ? convert(node.children) : [],
      expanded: true,
    }));
  };
  return convert(templateNodes);
};

export const TemplateModal = ({ isOpen, onClose }: TemplateModalProps) => {
  const [title, setTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const { addMindMap } = useMindMapStore();
  const router = useRouter();

  const handleCreate = () => {
    if (!title.trim()) return;

    let nodes: MindNode[] = [];

    if (selectedTemplate && selectedTemplate !== 'blank') {
      const template = TEMPLATES[selectedTemplate as keyof typeof TEMPLATES];
      if (template.nodes.length > 0) {
        nodes = createNodesFromTemplate(template.nodes);
      }
    }

    const newMindMap = addMindMap(title.trim(), nodes);
    onClose();
    setTitle('');
    setSelectedTemplate(null);
    router.push(`/editor?id=${newMindMap.id}`);
  };

  const templateEntries = Object.entries(TEMPLATES);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="选择模板" size="lg">
      <div className="space-y-8">
        <div>
          <label className="block text-base font-light text-[#1A1A1A] mb-3 tracking-wide">
            思维导图标题
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="给你的思维导图起个名字"
            autoFocus
            className="w-full px-6 py-4 text-lg font-light text-[#1A1A1A] bg-[#FAFAF9] border-2 border-[#E5E5E0] rounded-2xl outline-none focus:border-[#D4AF37] transition-all duration-300 tracking-wide placeholder-[#BFBFBF]"
          />
        </div>

        <div>
          <label className="block text-base font-light text-[#1A1A1A] mb-4 tracking-wide">
            选择模板
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
            <button
              onClick={() => setSelectedTemplate('blank')}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                selectedTemplate === 'blank'
                  ? 'border-[#D4AF37] bg-[#FAFAF9] shadow-[0_4px_20px_rgba(212,175,55,0.2)]'
                  : 'border-[#E5E5E0] hover:border-[#D4AF37] hover:bg-[#FAFAF9]'
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-[#F5F5F0] to-[#E5E5E0] rounded-xl flex items-center justify-center">
                  <Plus className="w-7 h-7 text-[#8A8A8A]" strokeWidth={1.5} />
                </div>
                <div className="text-base font-light text-[#1A1A1A] tracking-wide">空白画布</div>
              </div>
            </button>

            {templateEntries.map(([key, template]) => (
              <button
                key={key}
                onClick={() => setSelectedTemplate(key)}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                  selectedTemplate === key
                    ? 'border-[#D4AF37] bg-[#FAFAF9] shadow-[0_4px_20px_rgba(212,175,55,0.2)]'
                    : 'border-[#E5E5E0] hover:border-[#D4AF37] hover:bg-[#FAFAF9]'
                }`}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#1A1A1A] to-[#3A3A3A] rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-[#D4AF37]" strokeWidth={1.5} />
                    </div>
                    {selectedTemplate === key && (
                      <div className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-light text-[#1A1A1A] mb-1 tracking-wide">{template.name}</div>
                    <div className="text-sm text-[#8A8A8A] font-light tracking-wide">{template.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedTemplate && selectedTemplate !== 'blank' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#FAFAF9] border border-[#E5E5E0] rounded-2xl p-6"
          >
            <div className="flex items-start gap-4">
              <Sparkles className="w-6 h-6 text-[#D4AF37] mt-0.5" strokeWidth={1.5} />
              <div className="text-base">
                <p className="font-light text-[#1A1A1A] mb-2 tracking-wide">模板预览</p>
                <p className="text-[#8A8A8A] font-light tracking-wide">
                  将创建一个包含预设结构的思维导图，你可以继续添加和修改内容
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={onClose}
            className="px-8 py-3 text-base font-light tracking-wide text-[#1A1A1A] border border-[#E5E5E0] rounded-full hover:bg-[#F5F5F0] transition-all duration-300"
          >
            取消
          </button>
          <button
            onClick={handleCreate}
            disabled={!title.trim()}
            className="px-8 py-3 text-base font-light tracking-wide text-white bg-[#1A1A1A] rounded-full hover:bg-[#2A2A2A] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            创建思维导图
            <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </Modal>
  );
};

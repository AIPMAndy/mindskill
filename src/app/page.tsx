'use client';

import { useState } from 'react';
import { useMindMapStore } from '@/lib/store';
import { MindMapCard } from '@/components/Dashboard/MindMapCard';
import { TemplateModal } from '@/components/Dashboard/TemplateModal';
import { ImportModal } from '@/components/Dashboard/ImportModal';
import { AIConfigModal } from '@/components/AI/AIConfigModal';
import { Brain, Plus, Upload, Settings, Sparkles, Palette } from 'lucide-react';

export default function HomePage() {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAIConfigModalOpen, setIsAIConfigModalOpen] = useState(false);
  const { mindMaps } = useMindMapStore();

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* 顶部导航 - 极简设计 */}
      <nav className="border-b border-[#E5E5E0] bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-gradient-to-br from-[#1A1A1A] to-[#3A3A3A] rounded-xl flex items-center justify-center">
                <Brain className="w-7 h-7 text-[#D4AF37]" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-3xl font-light tracking-wider text-[#1A1A1A]">MINDSKILL</h1>
                <p className="text-base text-[#8A8A8A] font-light tracking-wide mt-1">Luxury Mind Mapping</p>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsAIConfigModalOpen(true)}
                className="px-8 py-3 text-base font-light tracking-wide text-[#1A1A1A] border border-[#E5E5E0] rounded-full hover:bg-[#F5F5F0] transition-all duration-300"
              >
                <Settings className="w-5 h-5 inline mr-2" strokeWidth={1.5} />
                AI配置
              </button>
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="px-8 py-3 text-base font-light tracking-wide text-[#1A1A1A] border border-[#E5E5E0] rounded-full hover:bg-[#F5F5F0] transition-all duration-300"
              >
                <Upload className="w-5 h-5 inline mr-2" strokeWidth={1.5} />
                导入
              </button>
              <button
                onClick={() => setIsTemplateModalOpen(true)}
                className="px-8 py-3 text-base font-light tracking-wide text-white bg-[#1A1A1A] rounded-full hover:bg-[#2A2A2A] transition-all duration-300"
              >
                <Plus className="w-5 h-5 inline mr-2" strokeWidth={1.5} />
                新建
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto px-8 py-16">
        {/* 产品介绍区域 */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light text-[#1A1A1A] mb-6 tracking-wide">极致简约，专业强大</h2>
            <p className="text-xl text-[#8A8A8A] font-light tracking-wide max-w-3xl mx-auto">
              结合 AI 智能与 XMind 兼容性，为您打造奢华级思维导图体验
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 功能卡片 1 */}
            <div className="bg-white rounded-3xl p-10 border border-[#E5E5E0] hover:border-[#D4AF37] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-500">
              <div className="w-16 h-16 bg-gradient-to-br from-[#1A1A1A] to-[#3A3A3A] rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-[#D4AF37]" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-light text-[#1A1A1A] mb-4 tracking-wide">AI 智能生成</h3>
              <p className="text-lg text-[#8A8A8A] font-light leading-relaxed tracking-wide">
                支持多种主流 AI 模型，一键生成完整思维导图结构，让创作更高效
              </p>
            </div>

            {/* 功能卡片 2 */}
            <div className="bg-white rounded-3xl p-10 border border-[#E5E5E0] hover:border-[#D4AF37] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-500">
              <div className="w-16 h-16 bg-gradient-to-br from-[#1A1A1A] to-[#3A3A3A] rounded-2xl flex items-center justify-center mb-6">
                <Upload className="w-8 h-8 text-[#D4AF37]" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-light text-[#1A1A1A] mb-4 tracking-wide">XMind 完美兼容</h3>
              <p className="text-lg text-[#8A8A8A] font-light leading-relaxed tracking-wide">
                无缝导入导出 XMind 格式文件，保留完整的节点结构和层级关系
              </p>
            </div>

            {/* 功能卡片 3 */}
            <div className="bg-white rounded-3xl p-10 border border-[#E5E5E0] hover:border-[#D4AF37] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-500">
              <div className="w-16 h-16 bg-gradient-to-br from-[#1A1A1A] to-[#3A3A3A] rounded-2xl flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-[#D4AF37]" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-light text-[#1A1A1A] mb-4 tracking-wide">本地存储安全</h3>
              <p className="text-lg text-[#8A8A8A] font-light leading-relaxed tracking-wide">
                所有数据仅保存在本地浏览器，隐私安全，无需担心数据泄露
              </p>
            </div>
          </div>
        </section>

        {/* 标题区域 */}
        <div className="mb-16">
          <h2 className="text-5xl font-light text-[#1A1A1A] mb-4 tracking-wide">我的思维导图</h2>
          <p className="text-xl text-[#8A8A8A] font-light tracking-wide">{mindMaps.length} 个作品</p>
        </div>

        {/* 思维导图列表 */}
        {mindMaps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-32 h-32 bg-gradient-to-br from-[#1A1A1A] to-[#3A3A3A] rounded-3xl flex items-center justify-center mb-10 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
              <Brain className="w-16 h-16 text-[#D4AF37]" strokeWidth={1.5} />
            </div>
            <h3 className="text-4xl font-light text-[#1A1A1A] mb-6 tracking-wide">开始创作</h3>
            <p className="text-xl text-[#8A8A8A] mb-16 font-light tracking-wide">从空白画布或模板开始，创建您的第一个思维导图</p>
            <div className="flex items-center gap-6">
              <button
                onClick={() => setIsTemplateModalOpen(true)}
                className="px-10 py-4 text-lg font-light tracking-wider text-white bg-[#1A1A1A] rounded-full hover:bg-[#2A2A2A] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
              >
                新建思维导图
              </button>
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="px-10 py-4 text-lg font-light tracking-wider text-[#1A1A1A] border border-[#E5E5E0] rounded-full hover:bg-[#F5F5F0] transition-all duration-300"
              >
                导入 XMind
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mindMaps.map((mindMap) => (
              <MindMapCard key={mindMap.id} mindMap={mindMap} />
            ))}
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer className="border-t border-[#E5E5E0] mt-32">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-4 text-[#1A1A1A]">
                <span className="text-4xl">🎯</span>
                <span className="text-xl font-light tracking-wider">AI酋长Andy出品</span>
              </div>
              <div className="flex items-center gap-3 text-base text-[#8A8A8A] font-light">
                <span>微信:</span>
                <span className="px-6 py-2 bg-[#F5F5F0] rounded-full font-mono tracking-wide">AIPMAndy</span>
              </div>
            </div>
            <div className="text-sm text-[#BFBFBF] font-light tracking-widest">
              © 2026 MINDSKILL. ALL RIGHTS RESERVED.
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TemplateModal isOpen={isTemplateModalOpen} onClose={() => setIsTemplateModalOpen(false)} />
      <ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
      <AIConfigModal isOpen={isAIConfigModalOpen} onClose={() => setIsAIConfigModalOpen(false)} />
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { MindMap } from '@/lib/types';
import { useMindMapStore } from '@/lib/store';
import { formatDate, countNodes } from '@/lib/utils';
import { Trash2, Clock, GitBranch } from 'lucide-react';
import { motion } from 'framer-motion';

interface MindMapCardProps {
  mindMap: MindMap;
  index?: number;
}

export const MindMapCard = ({ mindMap, index = 0 }: MindMapCardProps) => {
  const router = useRouter();
  const { deleteMindMap, loadMindMap } = useMindMapStore();
  const nodeCount = countNodes(mindMap.nodes);

  const handleOpen = () => {
    loadMindMap(mindMap);
    router.push(`/editor?id=${mindMap.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要删除这个思维导图吗？')) {
      deleteMindMap(mindMap.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onClick={handleOpen}
      className="group bg-white rounded-2xl border border-[#E5E5E0] overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-[#D4AF37] transition-all duration-500 cursor-pointer"
    >
      {/* 预览区域 */}
      <div className="h-40 bg-gradient-to-br from-[#FAFAF9] to-[#F5F5F0] flex items-center justify-center relative border-b border-[#E5E5E0]">
        <div className="flex flex-col items-center gap-3 opacity-40 group-hover:opacity-60 transition-opacity duration-300">
          <GitBranch className="w-10 h-10 text-[#1A1A1A]" strokeWidth={1.5} />
          <div className="text-sm font-light text-[#1A1A1A] tracking-wide max-w-[200px] truncate">
            {mindMap.nodes[0]?.text || '空白画布'}
          </div>
        </div>

        {/* 删除按钮 */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleDelete}
            className="p-2 bg-white/90 backdrop-blur-sm hover:bg-red-50 text-[#8A8A8A] hover:text-red-600 rounded-lg border border-[#E5E5E0] shadow-sm transition-all duration-300"
          >
            <Trash2 className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* 信息区域 */}
      <div className="p-6">
        <h3 className="font-light text-lg text-[#1A1A1A] mb-4 truncate tracking-wide">
          {mindMap.title}
        </h3>

        <div className="flex items-center gap-6 text-xs text-[#8A8A8A] font-light">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span className="tracking-wide">{formatDate(mindMap.updatedAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span className="tracking-wide">{nodeCount} 节点</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

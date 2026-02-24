import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, DollarSign, Calendar, TrendingUp, GripVertical } from 'lucide-react';
import { useCRMStore } from '@/store/useCRMStore';
import { DealForm } from '@/components/forms/DealForm';
import { Modal } from '@/components/ui-custom/Modal';
import { cn } from '@/lib/utils';
import type { Deal } from '@/types';

const stages = [
  { id: 'prospecting', label: 'Prospecção', color: '#B8C5D6', bg: 'bg-[#B8C5D6]/10', border: 'border-[#B8C5D6]/30' },
  { id: 'qualification', label: 'Qualificação', color: '#FFA726', bg: 'bg-[#FFA726]/10', border: 'border-[#FFA726]/30' },
  { id: 'proposal', label: 'Proposta', color: '#1F74FF', bg: 'bg-[#1F74FF]/10', border: 'border-[#1F74FF]/30' },
  { id: 'negotiation', label: 'Negociação', color: '#9C27B0', bg: 'bg-[#9C27B0]/10', border: 'border-[#9C27B0]/30' },
  { id: 'closed-won', label: 'Ganho ✓', color: '#00C853', bg: 'bg-[#00C853]/10', border: 'border-[#00C853]/30' },
  { id: 'closed-lost', label: 'Perdido', color: '#EF5350', bg: 'bg-[#EF5350]/10', border: 'border-[#EF5350]/30' },
] as const;

function DealCard({ deal, index }: { deal: Deal; index: number }) {
  const { updateDeal } = useCRMStore();
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="glass-card rounded-xl p-4 border border-white/10 hover:border-[#1F74FF]/30 transition-all cursor-pointer group"
        onClick={() => setIsEditOpen(true)}
      >
        <div className="flex items-start justify-between mb-3">
          <h4 className="text-sm font-semibold text-white leading-tight flex-1 pr-2">{deal.title}</h4>
          <GripVertical className="w-4 h-4 text-[#B8C5D6]/40 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <p className="text-xs text-[#B8C5D6] mb-3">{deal.contactName}</p>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-[#B8C5D6]">
            <DollarSign className="w-3.5 h-3.5" />
            <span className="font-semibold text-white">R$ {deal.value.toLocaleString('pt-BR')}</span>
          </div>
          {deal.expectedCloseDate && (
            <div className="flex items-center gap-1.5 text-xs text-[#B8C5D6]">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(deal.expectedCloseDate).toLocaleDateString('pt-BR')}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs text-[#B8C5D6]">
            <TrendingUp className="w-3.5 h-3.5" />
            <div className="flex-1 bg-white/10 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-[#1F74FF]"
                style={{ width: `${deal.probability}%` }}
              />
            </div>
            <span>{deal.probability}%</span>
          </div>
        </div>
      </motion.div>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Editar Oportunidade">
        <DealForm deal={deal} onSuccess={() => setIsEditOpen(false)} />
      </Modal>
    </>
  );
}

export function Pipeline() {
  const { deals } = useCRMStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string>('prospecting');

  const getDealsByStage = (stageId: string) => deals.filter((d) => d.stage === stageId);
  const getStageTotal = (stageId: string) =>
    getDealsByStage(stageId).reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Pipeline</h1>
          <p className="text-[#B8C5D6] mt-1">Gerencie suas oportunidades em cada etapa</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1F74FF] text-white rounded-xl font-medium hover:bg-[#1F74FF]/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nova Oportunidade
        </motion.button>
      </motion.div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
        {stages.map((stage) => {
          const stageDeals = getDealsByStage(stage.id);
          const stageTotal = getStageTotal(stage.id);

          return (
            <div key={stage.id} className="flex-shrink-0 w-72">
              {/* Column Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn('rounded-xl p-3 mb-3 border', stage.bg, stage.border)}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold" style={{ color: stage.color }}>
                    {stage.label}
                  </h3>
                  <span
                    className="text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: stage.color + '30', color: stage.color }}
                  >
                    {stageDeals.length}
                  </span>
                </div>
                <p className="text-xs text-[#B8C5D6]">
                  R$ {(stageTotal / 1000).toFixed(0)}k
                </p>
              </motion.div>

              {/* Cards */}
              <div className="space-y-3 min-h-[100px]">
                <AnimatePresence>
                  {stageDeals.map((deal, index) => (
                    <DealCard key={deal.id} deal={deal} index={index} />
                  ))}
                </AnimatePresence>

                {/* Add button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setSelectedStage(stage.id); setIsModalOpen(true); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-white/20 text-[#B8C5D6]/60 hover:text-[#B8C5D6] hover:border-white/30 transition-all text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar
                </motion.button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Oportunidade">
        <DealForm initialStage={selectedStage} onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}

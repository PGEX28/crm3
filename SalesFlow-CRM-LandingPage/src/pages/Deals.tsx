import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, DollarSign, Calendar, TrendingUp, Edit2, Trash2, Briefcase } from 'lucide-react';
import { useCRMStore } from '@/store/useCRMStore';
import { DealForm } from '@/components/forms/DealForm';
import { Modal } from '@/components/ui-custom/Modal';
import { ConfirmDialog } from '@/components/ui-custom/ConfirmDialog';
import { cn } from '@/lib/utils';
import type { Deal } from '@/types';

const stageConfig = {
  prospecting: { label: 'Prospecção', color: 'bg-[#B8C5D6]/20 text-[#B8C5D6]' },
  qualification: { label: 'Qualificação', color: 'bg-[#FFA726]/20 text-[#FFA726]' },
  proposal: { label: 'Proposta', color: 'bg-[#1F74FF]/20 text-[#1F74FF]' },
  negotiation: { label: 'Negociação', color: 'bg-[#9C27B0]/20 text-[#9C27B0]' },
  'closed-won': { label: 'Ganho', color: 'bg-[#00C853]/20 text-[#00C853]' },
  'closed-lost': { label: 'Perdido', color: 'bg-[#EF5350]/20 text-[#EF5350]' },
};

export function Deals() {
  const { deals, deleteDeal } = useCRMStore();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [deletingDeal, setDeletingDeal] = useState<Deal | null>(null);

  const filtered = deals.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.contactName.toLowerCase().includes(search.toLowerCase())
  );

  const totalValue = filtered.reduce((sum, d) => sum + d.value, 0);
  const wonValue = filtered
    .filter((d) => d.stage === 'closed-won')
    .reduce((sum, d) => sum + d.value, 0);

  const handleEdit = (deal: Deal) => {
    setEditingDeal(deal);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingDeal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Oportunidades</h1>
          <p className="text-[#B8C5D6] mt-1">{deals.length} oportunidades no total</p>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Valor Total', value: `R$ ${(totalValue / 1000).toFixed(0)}k`, color: 'text-white' },
          { label: 'Total Ganho', value: `R$ ${(wonValue / 1000).toFixed(0)}k`, color: 'text-[#00C853]' },
          { label: 'Taxa de Conversão', value: `${deals.length > 0 ? Math.round((deals.filter(d => d.stage === 'closed-won').length / deals.length) * 100) : 0}%`, color: 'text-[#1F74FF]' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-xl p-4"
          >
            <p className="text-sm text-[#B8C5D6]">{item.label}</p>
            <p className={cn('text-2xl font-bold mt-1', item.color)}>{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8C5D6]" />
        <input
          type="text"
          placeholder="Buscar oportunidades..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-[#B8C5D6]/60 focus:outline-none focus:border-[#1F74FF]/50 focus:ring-2 focus:ring-[#1F74FF]/20 transition-all"
        />
      </div>

      {/* Deals List */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <Briefcase className="w-16 h-16 text-[#B8C5D6]/30 mb-4" />
          <p className="text-[#B8C5D6] text-lg">Nenhuma oportunidade encontrada</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card rounded-xl p-5 border border-white/10 hover:border-[#1F74FF]/30 transition-all group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Title & Contact */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-white">{deal.title}</h3>
                      <span className={cn('text-xs px-2.5 py-0.5 rounded-full font-medium', stageConfig[deal.stage].color)}>
                        {stageConfig[deal.stage].label}
                      </span>
                    </div>
                    <p className="text-sm text-[#B8C5D6]">{deal.contactName}</p>
                  </div>

                  {/* Details */}
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-[#B8C5D6]">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold text-white">R$ {deal.value.toLocaleString('pt-BR')}</span>
                    </div>
                    {deal.expectedCloseDate && (
                      <div className="flex items-center gap-1.5 text-[#B8C5D6]">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(deal.expectedCloseDate).toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#B8C5D6]" />
                      <div className="w-20 bg-white/10 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-[#1F74FF]" style={{ width: `${deal.probability}%` }} />
                      </div>
                      <span className="text-[#B8C5D6] text-xs">{deal.probability}%</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(deal)}
                      className="w-8 h-8 rounded-lg bg-[#1F74FF]/20 text-[#1F74FF] flex items-center justify-center hover:bg-[#1F74FF]/30 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setDeletingDeal(deal)}
                      className="w-8 h-8 rounded-lg bg-[#EF5350]/20 text-[#EF5350] flex items-center justify-center hover:bg-[#EF5350]/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleClose} title={editingDeal ? 'Editar Oportunidade' : 'Nova Oportunidade'}>
        <DealForm deal={editingDeal} onSuccess={handleClose} />
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingDeal}
        onClose={() => setDeletingDeal(null)}
        onConfirm={() => { if (deletingDeal) { deleteDeal(deletingDeal.id); setDeletingDeal(null); } }}
        title="Excluir Oportunidade"
        description={`Tem certeza que deseja excluir "${deletingDeal?.title}"?`}
      />
    </div>
  );
}

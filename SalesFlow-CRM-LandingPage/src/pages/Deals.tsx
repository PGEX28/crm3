import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  DollarSign, 
  TrendingUp,
  Target,
  Edit2,
  Trash2,
  Eye
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Modal } from '@/components/ui-custom/Modal';
import { ConfirmDialog } from '@/components/ui-custom/ConfirmDialog';
import { DealForm } from '@/components/forms/DealForm';
import { useCRMStore } from '@/store/useCRMStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Deal } from '@/types';

const stageConfig = {
  prospecting: { label: 'Prospecção', color: '#B8C5D6', bgColor: 'bg-[#B8C5D6]/20' },
  qualification: { label: 'Qualificação', color: '#FFA726', bgColor: 'bg-[#FFA726]/20' },
  proposal: { label: 'Proposta', color: '#1F74FF', bgColor: 'bg-[#1F74FF]/20' },
  negotiation: { label: 'Negociação', color: '#9C27B0', bgColor: 'bg-[#9C27B0]/20' },
  'closed-won': { label: 'Ganho', color: '#00C853', bgColor: 'bg-[#00C853]/20' },
  'closed-lost': { label: 'Perdido', color: '#EF5350', bgColor: 'bg-[#EF5350]/20' },
};

interface DealRowProps {
  deal: Deal;
  index: number;
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
  onView: (deal: Deal) => void;
}

function DealRow({ deal, index, onEdit, onDelete, onView }: DealRowProps) {
  const [isHovered, setIsHovered] = useState(false);
  const stage = stageConfig[deal.stage];

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group cursor-pointer transition-colors",
        isHovered && "bg-white/5"
      )}
    >
      <td className="px-4 py-4">
        <div>
          <p className="text-sm font-medium text-white">{deal.title}</p>
          <p className="text-xs text-[#B8C5D6]">Criado em {deal.createdAt}</p>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#1F74FF]/20 flex items-center justify-center">
            <span className="text-xs font-medium text-[#1F74FF]">
              {deal.contactName.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <span className="text-sm text-white">{deal.contactName}</span>
        </div>
      </td>
      <td className="px-4 py-4">
        <span className="text-sm font-semibold text-white">
          R$ {deal.value.toLocaleString('pt-BR')}
        </span>
      </td>
      <td className="px-4 py-4">
        <span 
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium border",
            stage.bgColor,
            "border-current"
          )}
          style={{ color: stage.color }}
        >
          {stage.label}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="w-20 h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${deal.probability}%` }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className={cn(
                "h-full rounded-full",
                deal.probability >= 70 ? "bg-[#00C853]" :
                deal.probability >= 40 ? "bg-[#FFA726]" : "bg-[#EF5350]"
              )}
            />
          </div>
          <span className="text-xs text-[#B8C5D6]">{deal.probability}%</span>
        </div>
      </td>
      <td className="px-4 py-4">
        <span className="text-sm text-[#B8C5D6]">{deal.expectedCloseDate}</span>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onView(deal)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-[#B8C5D6] hover:text-white transition-colors"
          >
            <Eye className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(deal)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-[#B8C5D6] hover:text-white transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(deal)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-[#B8C5D6] hover:text-[#EF5350] transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
}

export function Deals() {
  const { deals, deleteDeal } = useCRMStore();
  const [filterStage, setFilterStage] = useState<Deal['stage'] | 'all'>('all');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isViewModal, setIsViewModal] = useState(false);
  
  // Confirm dialog states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState<Deal | null>(null);

  const filteredDeals = deals.filter(deal => 
    filterStage === 'all' || deal.stage === filterStage
  );

  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const wonValue = deals
    .filter(deal => deal.stage === 'closed-won')
    .reduce((sum, deal) => sum + deal.value, 0);
  const activeDeals = deals.filter(deal => 
    !['closed-won', 'closed-lost'].includes(deal.stage)
  ).length;

  const stats = [
    { 
      label: 'Valor Total', 
      value: `R$ ${totalValue.toLocaleString('pt-BR')}`,
      icon: DollarSign,
      color: 'text-[#1F74FF]',
      bgColor: 'bg-[#1F74FF]/20'
    },
    { 
      label: 'Valor Ganho', 
      value: `R$ ${wonValue.toLocaleString('pt-BR')}`,
      icon: TrendingUp,
      color: 'text-[#00C853]',
      bgColor: 'bg-[#00C853]/20'
    },
    { 
      label: 'Negócios Ativos', 
      value: activeDeals.toString(),
      icon: Target,
      color: 'text-[#FFA726]',
      bgColor: 'bg-[#FFA726]/20'
    },
  ];

  const handleAdd = () => {
    setSelectedDeal(null);
    setIsViewModal(false);
    setIsModalOpen(true);
  };

  const handleEdit = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsViewModal(false);
    setIsModalOpen(true);
  };

  const handleView = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsViewModal(true);
    setIsModalOpen(true);
  };

  const handleDelete = (deal: Deal) => {
    setDealToDelete(deal);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (dealToDelete) {
      deleteDeal(dealToDelete.id);
      toast.success('Oportunidade excluída com sucesso!');
      setDealToDelete(null);
    }
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setSelectedDeal(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <Header 
        title="Oportunidades" 
        subtitle="Gerencie todos os seus negócios"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-xl p-4 flex items-center gap-4"
          >
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bgColor)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <div>
              <p className="text-sm text-[#B8C5D6]">{stat.label}</p>
              <p className="text-xl font-bold text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <motion.button
            onClick={() => setFilterStage('all')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
              filterStage === 'all'
                ? "bg-[#1F74FF] text-white"
                : "bg-[#1A3B66]/60 text-[#B8C5D6] hover:text-white hover:bg-[#1A3B66]"
            )}
          >
            Todos
          </motion.button>
          {Object.entries(stageConfig).map(([key, config]) => (
            <motion.button
              key={key}
              onClick={() => setFilterStage(key as Deal['stage'])}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                filterStage === key
                  ? "text-white"
                  : "bg-[#1A3B66]/60 text-[#B8C5D6] hover:text-white hover:bg-[#1A3B66]"
              )}
              style={filterStage === key ? { backgroundColor: config.color } : {}}
            >
              {config.label}
            </motion.button>
          ))}
        </div>

        <motion.button
          onClick={handleAdd}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1F74FF] text-white font-medium hover:bg-[#1F74FF]/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nova Oportunidade
        </motion.button>
      </div>

      {/* Deals Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-left text-xs font-medium text-[#B8C5D6]">Título</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#B8C5D6]">Contato</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#B8C5D6]">Valor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#B8C5D6]">Etapa</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#B8C5D6]">Probabilidade</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#B8C5D6]">Fechamento</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#B8C5D6]">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {filteredDeals.map((deal, index) => (
                  <DealRow 
                    key={deal.id} 
                    deal={deal} 
                    index={index}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                  />
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isViewModal ? 'Detalhes da Oportunidade' : selectedDeal ? 'Editar Oportunidade' : 'Nova Oportunidade'}
        size={isViewModal ? 'md' : 'lg'}
      >
        {isViewModal && selectedDeal ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xl font-semibold text-white">{selectedDeal.title}</h4>
                <p className="text-[#B8C5D6]">Criado em {selectedDeal.createdAt}</p>
              </div>
              <span 
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium border",
                  stageConfig[selectedDeal.stage].bgColor,
                  "border-current"
                )}
                style={{ color: stageConfig[selectedDeal.stage].color }}
              >
                {stageConfig[selectedDeal.stage].label}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-sm text-[#B8C5D6] mb-1">Valor</p>
                <p className="text-2xl font-bold text-white">R$ {selectedDeal.value.toLocaleString('pt-BR')}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-sm text-[#B8C5D6] mb-1">Probabilidade</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-3 rounded-full bg-white/10 overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full",
                        selectedDeal.probability >= 70 ? "bg-[#00C853]" :
                        selectedDeal.probability >= 40 ? "bg-[#FFA726]" : "bg-[#EF5350]"
                      )}
                      style={{ width: `${selectedDeal.probability}%` }}
                    />
                  </div>
                  <span className="text-white font-medium">{selectedDeal.probability}%</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-sm text-[#B8C5D6] mb-1">Contato</p>
                <p className="text-white">{selectedDeal.contactName}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-sm text-[#B8C5D6] mb-1">Data de Fechamento</p>
                <p className="text-white">{selectedDeal.expectedCloseDate}</p>
              </div>
            </div>

            {selectedDeal.notes && (
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-sm text-[#B8C5D6] mb-1">Observações</p>
                <p className="text-white">{selectedDeal.notes}</p>
              </div>
            )}

            <div className="flex gap-3">
              <motion.button
                onClick={() => {
                  setIsViewModal(false);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-4 py-3 rounded-xl bg-[#1F74FF] text-white font-medium hover:bg-[#1F74FF]/90 transition-colors"
              >
                Editar Oportunidade
              </motion.button>
            </div>
          </div>
        ) : (
          <DealForm 
            deal={selectedDeal} 
            onSuccess={handleSuccess} 
          />
        )}
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Oportunidade"
        description={`Tem certeza que deseja excluir a oportunidade "${dealToDelete?.title}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        variant="danger"
      />
    </motion.div>
  );
}

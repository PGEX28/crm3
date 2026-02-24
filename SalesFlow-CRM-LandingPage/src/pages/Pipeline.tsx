import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, DollarSign, User, Edit2, Trash2, Eye } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Modal } from '@/components/ui-custom/Modal';
import { ConfirmDialog } from '@/components/ui-custom/ConfirmDialog';
import { DealForm } from '@/components/forms/DealForm';
import { useCRMStore } from '@/store/useCRMStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Deal } from '@/types';

const stages = [
  { id: 'prospecting', label: 'Prospecção', color: '#B8C5D6' },
  { id: 'qualification', label: 'Qualificação', color: '#FFA726' },
  { id: 'proposal', label: 'Proposta', color: '#1F74FF' },
  { id: 'negotiation', label: 'Negociação', color: '#9C27B0' },
  { id: 'closed-won', label: 'Ganho', color: '#00C853' },
  { id: 'closed-lost', label: 'Perdido', color: '#EF5350' },
] as const;

interface DealCardProps {
  deal: Deal;
  index: number;
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
  onView: (deal: Deal) => void;
}

function DealCard({ deal, index, onEdit, onDelete, onView }: DealCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      draggable
      className={cn(
        "glass-card rounded-xl p-4 cursor-grab active:cursor-grabbing relative",
        "transition-all duration-300",
        isHovered && "scale-[1.02] shadow-lg"
      )}
    >
      {/* Actions */}
      <div className={cn(
        "absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity",
        isHovered && "opacity-100"
      )}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onView(deal);
          }}
          className="p-1.5 rounded-lg bg-[#1A3B66]/80 text-[#B8C5D6] hover:text-white transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(deal);
          }}
          className="p-1.5 rounded-lg bg-[#1A3B66]/80 text-[#B8C5D6] hover:text-white transition-colors"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(deal);
          }}
          className="p-1.5 rounded-lg bg-[#1A3B66]/80 text-[#B8C5D6] hover:text-[#EF5350] transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-3 pr-16">
        <h4 className="text-sm font-medium text-white line-clamp-2">{deal.title}</h4>
      </div>

      {/* Value */}
      <div className="flex items-center gap-2 mb-3">
        <DollarSign className="w-4 h-4 text-[#00C853]" />
        <span className="text-lg font-semibold text-white">
          R$ {deal.value.toLocaleString('pt-BR')}
        </span>
      </div>

      {/* Contact */}
      <div className="flex items-center gap-2 mb-3 text-sm text-[#B8C5D6]">
        <User className="w-4 h-4" />
        <span>{deal.contactName}</span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[#B8C5D6]">
          <Calendar className="w-3 h-3" />
          <span>{deal.expectedCloseDate}</span>
        </div>
        <div className="flex items-center gap-1">
          <div 
            className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden"
          >
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
      </div>
    </motion.div>
  );
}

interface PipelineColumnProps {
  stage: typeof stages[number];
  deals: Deal[];
  onAdd: (stageId: string) => void;
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
  onView: (deal: Deal) => void;
}

function PipelineColumn({ stage, deals, onAdd, onEdit, onDelete, onView }: PipelineColumnProps) {
  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-shrink-0 w-80"
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: stage.color }}
          />
          <h3 className="font-medium text-white">{stage.label}</h3>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs text-[#B8C5D6]">
            {deals.length}
          </span>
        </div>
        <span className="text-sm text-[#B8C5D6]">
          R$ {totalValue.toLocaleString('pt-BR')}
        </span>
      </div>

      {/* Column Content */}
      <div 
        className={cn(
          "min-h-[500px] rounded-2xl p-3 space-y-3",
          "bg-white/5 border border-white/5"
        )}
      >
        {deals.map((deal, index) => (
          <DealCard 
            key={deal.id} 
            deal={deal} 
            index={index}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
          />
        ))}

        {/* Add Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAdd(stage.id)}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-3 rounded-xl",
            "border border-dashed border-white/20 text-[#B8C5D6]",
            "hover:border-[#1F74FF]/50 hover:text-[#1F74FF] transition-colors"
          )}
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">Adicionar</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

export function Pipeline() {
  const { deals, deleteDeal } = useCRMStore();
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [initialStage, setInitialStage] = useState<string>('prospecting');
  const [isViewModal, setIsViewModal] = useState(false);
  
  // Confirm dialog states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState<Deal | null>(null);

  const handleAdd = (stageId: string) => {
    setSelectedDeal(null);
    setInitialStage(stageId);
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
      className="space-y-6 h-full"
    >
      <Header 
        title="Pipeline de Vendas" 
        subtitle="Visualize e gerencie suas oportunidades"
      />

      {/* Pipeline Board */}
      <div className="overflow-x-auto pb-4 scrollbar-thin">
        <div className="flex gap-6 min-w-max">
          {stages.map((stage) => (
            <PipelineColumn
              key={stage.id}
              stage={stage}
              deals={deals.filter((deal) => deal.stage === stage.id)}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))}
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
                  stages.find(s => s.id === selectedDeal.stage)?.color && "bg-opacity-20"
                )}
                style={{ 
                  color: stages.find(s => s.id === selectedDeal.stage)?.color,
                  borderColor: stages.find(s => s.id === selectedDeal.stage)?.color,
                  backgroundColor: `${stages.find(s => s.id === selectedDeal.stage)?.color}20`
                }}
              >
                {stages.find(s => s.id === selectedDeal.stage)?.label}
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
            initialStage={initialStage}
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

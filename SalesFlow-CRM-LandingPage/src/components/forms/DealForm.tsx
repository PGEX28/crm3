import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, DollarSign, User, Calendar, Target, FileText } from 'lucide-react';
import { useCRMStore } from '@/store/useCRMStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Deal } from '@/types';

interface DealFormProps {
  deal?: Deal | null;
  initialStage?: string;
  onSuccess: () => void;
}

const stageOptions = [
  { value: 'prospecting', label: 'Prospecção', color: '#B8C5D6' },
  { value: 'qualification', label: 'Qualificação', color: '#FFA726' },
  { value: 'proposal', label: 'Proposta', color: '#1F74FF' },
  { value: 'negotiation', label: 'Negociação', color: '#9C27B0' },
  { value: 'closed-won', label: 'Ganho', color: '#00C853' },
  { value: 'closed-lost', label: 'Perdido', color: '#EF5350' },
];

export function DealForm({ deal, initialStage = 'prospecting', onSuccess }: DealFormProps) {
  const { addDeal, updateDeal, contacts } = useCRMStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    stage: initialStage as Deal['stage'],
    probability: 25,
    contactId: '',
    expectedCloseDate: '',
    notes: '',
  });

  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title,
        value: deal.value.toString(),
        stage: deal.stage,
        probability: deal.probability,
        contactId: deal.contactId,
        expectedCloseDate: deal.expectedCloseDate,
        notes: deal.notes,
      });
    } else {
      setFormData({
        title: '',
        value: '',
        stage: initialStage as Deal['stage'],
        probability: 25,
        contactId: contacts.length > 0 ? contacts[0].id : '',
        expectedCloseDate: '',
        notes: '',
      });
    }
  }, [deal, contacts, initialStage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const selectedContact = contacts.find(c => c.id === formData.contactId);
      
      const dealData = {
        ...formData,
        value: Number(formData.value) || 0,
        contactName: selectedContact?.name || 'Desconhecido',
      };

      if (deal) {
        updateDeal(deal.id, dealData);
        toast.success('Oportunidade atualizada com sucesso!');
      } else {
        addDeal(dealData);
        toast.success('Oportunidade criada com sucesso!');
      }
      
      onSuccess();
    } catch (error) {
      toast.error('Erro ao salvar oportunidade. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName = "w-full pl-10 pr-4 py-3 rounded-xl bg-[#1A3B66]/60 border border-white/10 text-white placeholder:text-[#B8C5D6]/60 focus:outline-none focus:border-[#1F74FF]/50 focus:ring-2 focus:ring-[#1F74FF]/20 transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white mb-2">
            Título <span className="text-[#EF5350]">*</span>
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8C5D6]" />
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Implementação ERP"
              className={inputClassName}
            />
          </div>
        </div>

        {/* Value */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Valor <span className="text-[#EF5350]">*</span>
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8C5D6]" />
            <input
              type="number"
              required
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              placeholder="0,00"
              className={inputClassName}
            />
          </div>
        </div>

        {/* Contact */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Contato <span className="text-[#EF5350]">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8C5D6]" />
            <select
              required
              value={formData.contactId}
              onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
              className={cn(inputClassName, "appearance-none cursor-pointer")}
            >
              <option value="" className="bg-[#0B1B36]">Selecione um contato</option>
              {contacts.map((contact) => (
                <option key={contact.id} value={contact.id} className="bg-[#0B1B36]">
                  {contact.name} - {contact.company}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Expected Close Date */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Data de Fechamento Esperada
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8C5D6]" />
            <input
              type="date"
              value={formData.expectedCloseDate}
              onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
              className={cn(inputClassName, "cursor-pointer")}
            />
          </div>
        </div>

        {/* Probability */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Probabilidade: {formData.probability}%
          </label>
          <div className="relative">
            <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8C5D6]" />
            <input
              type="range"
              min="0"
              max="100"
              value={formData.probability}
              onChange={(e) => setFormData({ ...formData, probability: Number(e.target.value) })}
              className="w-full ml-10 mr-4 accent-[#1F74FF]"
            />
          </div>
          <div className="flex justify-between text-xs text-[#B8C5D6] mt-1 px-2">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Stage */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white mb-2">Etapa</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {stageOptions.map((option) => (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => setFormData({ ...formData, stage: option.value as Deal['stage'] })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "px-3 py-2.5 rounded-xl text-sm font-medium transition-all border",
                  formData.stage === option.value
                    ? "text-white border-current"
                    : "bg-[#1A3B66]/60 text-[#B8C5D6] border-transparent hover:text-white hover:bg-[#1A3B66]"
                )}
                style={{
                  backgroundColor: formData.stage === option.value ? option.color : undefined,
                  borderColor: formData.stage === option.value ? option.color : undefined,
                }}
              >
                {option.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white mb-2">Observações</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-5 h-5 text-[#B8C5D6]" />
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Adicione observações sobre a oportunidade..."
              rows={3}
              className={cn(inputClassName, "pl-10 resize-none")}
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <motion.button
          type="button"
          onClick={onSuccess}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
        >
          Cancelar
        </motion.button>
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "flex-1 px-4 py-3 rounded-xl bg-[#1F74FF] text-white font-medium transition-colors",
            isSubmitting && "opacity-70 cursor-not-allowed"
          )}
        >
          {isSubmitting ? 'Salvando...' : deal ? 'Atualizar' : 'Criar Oportunidade'}
        </motion.button>
      </div>
    </form>
  );
}

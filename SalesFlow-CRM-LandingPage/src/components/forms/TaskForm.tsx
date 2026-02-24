import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Calendar, User, FileText, Briefcase } from 'lucide-react';
import { useCRMStore } from '@/store/useCRMStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Task } from '@/types';

interface TaskFormProps {
  task?: Task | null;
  onSuccess: () => void;
}

const priorityOptions = [
  { value: 'low', label: 'Baixa', color: '#B8C5D6' },
  { value: 'medium', label: 'Média', color: '#FFA726' },
  { value: 'high', label: 'Alta', color: '#EF5350' },
];

const statusOptions = [
  { value: 'pending', label: 'Pendente' },
  { value: 'in-progress', label: 'Em Progresso' },
  { value: 'completed', label: 'Concluída' },
];

export function TaskForm({ task, onSuccess }: TaskFormProps) {
  const { addTask, updateTask, contacts, deals } = useCRMStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending' as Task['status'],
    priority: 'medium' as Task['priority'],
    dueDate: '',
    relatedType: '' as 'contact' | 'deal' | '',
    relatedId: '',
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        relatedType: task.relatedTo?.type || '',
        relatedId: task.relatedTo?.id || '',
      });
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const relatedTo = formData.relatedId && formData.relatedType
        ? {
            type: formData.relatedType,
            id: formData.relatedId,
            name: formData.relatedType === 'contact'
              ? contacts.find(c => c.id === formData.relatedId)?.name || ''
              : deals.find(d => d.id === formData.relatedId)?.title || '',
          }
        : undefined;

      const taskData = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate,
        assignedTo: '1',
        relatedTo,
      };

      if (task) {
        updateTask(task.id, taskData);
        toast.success('Tarefa atualizada com sucesso!');
      } else {
        addTask(taskData);
        toast.success('Tarefa criada com sucesso!');
      }
      
      onSuccess();
    } catch (error) {
      toast.error('Erro ao salvar tarefa. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName = "w-full pl-10 pr-4 py-3 rounded-xl bg-[#1A3B66]/60 border border-white/10 text-white placeholder:text-[#B8C5D6]/60 focus:outline-none focus:border-[#1F74FF]/50 focus:ring-2 focus:ring-[#1F74FF]/20 transition-all";

  const relatedOptions = formData.relatedType === 'contact' 
    ? contacts.map(c => ({ value: c.id, label: c.name }))
    : formData.relatedType === 'deal'
    ? deals.map(d => ({ value: d.id, label: d.title }))
    : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white mb-2">
            Título <span className="text-[#EF5350]">*</span>
          </label>
          <div className="relative">
            <CheckSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8C5D6]" />
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Fazer follow-up com cliente"
              className={inputClassName}
            />
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Data de Vencimento <span className="text-[#EF5350]">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8C5D6]" />
            <input
              type="date"
              required
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className={cn(inputClassName, "cursor-pointer")}
            />
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Prioridade</label>
          <div className="flex gap-2">
            {priorityOptions.map((option) => (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => setFormData({ ...formData, priority: option.value as Task['priority'] })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex-1 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border",
                  formData.priority === option.value
                    ? "text-white border-current"
                    : "bg-[#1A3B66]/60 text-[#B8C5D6] border-transparent hover:text-white hover:bg-[#1A3B66]"
                )}
                style={{
                  backgroundColor: formData.priority === option.value ? option.color : undefined,
                  borderColor: formData.priority === option.value ? option.color : undefined,
                }}
              >
                {option.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Status</label>
          <div className="relative">
            <CheckSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8C5D6]" />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
              className={cn(inputClassName, "appearance-none cursor-pointer")}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-[#0B1B36]">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Related To */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Relacionado a</label>
          <div className="flex gap-2 mb-2">
            <motion.button
              type="button"
              onClick={() => setFormData({ ...formData, relatedType: 'contact', relatedId: '' })}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                formData.relatedType === 'contact'
                  ? "bg-[#1F74FF] text-white"
                  : "bg-[#1A3B66]/60 text-[#B8C5D6] hover:text-white hover:bg-[#1A3B66]"
              )}
            >
              <User className="w-4 h-4 inline mr-1" />
              Contato
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setFormData({ ...formData, relatedType: 'deal', relatedId: '' })}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                formData.relatedType === 'deal'
                  ? "bg-[#1F74FF] text-white"
                  : "bg-[#1A3B66]/60 text-[#B8C5D6] hover:text-white hover:bg-[#1A3B66]"
              )}
            >
              <Briefcase className="w-4 h-4 inline mr-1" />
              Negócio
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setFormData({ ...formData, relatedType: '', relatedId: '' })}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "px-3 py-2 rounded-xl text-sm font-medium transition-all",
                formData.relatedType === ''
                  ? "bg-[#B8C5D6]/30 text-white"
                  : "bg-[#1A3B66]/60 text-[#B8C5D6] hover:text-white hover:bg-[#1A3B66]"
              )}
            >
              Nenhum
            </motion.button>
          </div>
          
          {formData.relatedType && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8C5D6]" />
              <select
                value={formData.relatedId}
                onChange={(e) => setFormData({ ...formData, relatedId: e.target.value })}
                className={cn(inputClassName, "appearance-none cursor-pointer")}
              >
                <option value="" className="bg-[#0B1B36]">
                  Selecione {formData.relatedType === 'contact' ? 'um contato' : 'um negócio'}
                </option>
                {relatedOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-[#0B1B36]">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white mb-2">Descrição</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-5 h-5 text-[#B8C5D6]" />
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Adicione detalhes sobre a tarefa..."
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
          {isSubmitting ? 'Salvando...' : task ? 'Atualizar' : 'Criar Tarefa'}
        </motion.button>
      </div>
    </form>
  );
}

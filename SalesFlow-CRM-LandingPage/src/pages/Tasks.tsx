import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, CheckCircle2, Circle, Clock, AlertCircle, Edit2, Trash2, CheckSquare } from 'lucide-react';
import { useCRMStore } from '@/store/useCRMStore';
import { TaskForm } from '@/components/forms/TaskForm';
import { Modal } from '@/components/ui-custom/Modal';
import { ConfirmDialog } from '@/components/ui-custom/ConfirmDialog';
import { cn } from '@/lib/utils';
import type { Task } from '@/types';

const priorityConfig = {
  low: { label: 'Baixa', color: 'bg-[#B8C5D6]/20 text-[#B8C5D6]', icon: Clock },
  medium: { label: 'Média', color: 'bg-[#FFA726]/20 text-[#FFA726]', icon: Clock },
  high: { label: 'Alta', color: 'bg-[#EF5350]/20 text-[#EF5350]', icon: AlertCircle },
};

const statusConfig = {
  pending: { label: 'Pendente', icon: Circle },
  'in-progress': { label: 'Em Progresso', icon: Clock },
  completed: { label: 'Concluída', icon: CheckCircle2 },
};

export function Tasks() {
  const { tasks, updateTask, deleteTask } = useCRMStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Task['status'] | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const filtered = tasks.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleToggleStatus = (task: Task) => {
    const next: Task['status'] =
      task.status === 'pending' ? 'in-progress' : task.status === 'in-progress' ? 'completed' : 'pending';
    updateTask(task.id, { status: next });
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const isOverdue = (task: Task) =>
    task.status !== 'completed' && new Date(task.dueDate) < new Date();

  const counts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
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
          <h1 className="text-3xl font-bold text-white">Tarefas</h1>
          <p className="text-[#B8C5D6] mt-1">{tasks.length} tarefas no total</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1F74FF] text-white rounded-xl font-medium hover:bg-[#1F74FF]/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nova Tarefa
        </motion.button>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'pending', 'in-progress', 'completed'] as const).map((s) => (
          <motion.button
            key={s}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setStatusFilter(s)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all',
              statusFilter === s
                ? 'bg-[#1F74FF] text-white'
                : 'bg-white/5 text-[#B8C5D6] hover:text-white hover:bg-white/10'
            )}
          >
            {s === 'all' ? 'Todas' : statusConfig[s]?.label ?? s}
            <span className="ml-2 text-xs opacity-70">({counts[s]})</span>
          </motion.button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8C5D6]" />
        <input
          type="text"
          placeholder="Buscar tarefas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-[#B8C5D6]/60 focus:outline-none focus:border-[#1F74FF]/50 focus:ring-2 focus:ring-[#1F74FF]/20 transition-all"
        />
      </div>

      {/* Tasks List */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <CheckSquare className="w-16 h-16 text-[#B8C5D6]/30 mb-4" />
          <p className="text-[#B8C5D6] text-lg">Nenhuma tarefa encontrada</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((task, index) => {
              const overdue = isOverdue(task);
              const PriorityIcon = priorityConfig[task.priority].icon;

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    'glass-card rounded-xl p-4 border transition-all group',
                    task.status === 'completed'
                      ? 'border-[#00C853]/20 opacity-60'
                      : overdue
                      ? 'border-[#EF5350]/30'
                      : 'border-white/10 hover:border-[#1F74FF]/30'
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* Toggle */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleToggleStatus(task)}
                      className="mt-0.5 flex-shrink-0"
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle2 className="w-6 h-6 text-[#00C853]" />
                      ) : task.status === 'in-progress' ? (
                        <Clock className="w-6 h-6 text-[#FFA726]" />
                      ) : (
                        <Circle className="w-6 h-6 text-[#B8C5D6]/40 hover:text-[#1F74FF] transition-colors" />
                      )}
                    </motion.button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className={cn('font-medium text-white', task.status === 'completed' && 'line-through opacity-60')}>
                          {task.title}
                        </h3>
                        <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', priorityConfig[task.priority].color)}>
                          {priorityConfig[task.priority].label}
                        </span>
                        {overdue && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[#EF5350]/20 text-[#EF5350] font-medium">
                            Atrasada
                          </span>
                        )}
                      </div>
                      {task.description && (
                        <p className="text-sm text-[#B8C5D6] mb-2">{task.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#B8C5D6]">
                        <span>Vence: {new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
                        {task.relatedTo && (
                          <span className="px-2 py-0.5 rounded-full bg-[#1F74FF]/20 text-[#1F74FF]">
                            {task.relatedTo.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(task)}
                        className="w-8 h-8 rounded-lg bg-[#1F74FF]/20 text-[#1F74FF] flex items-center justify-center hover:bg-[#1F74FF]/30 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setDeletingTask(task)}
                        className="w-8 h-8 rounded-lg bg-[#EF5350]/20 text-[#EF5350] flex items-center justify-center hover:bg-[#EF5350]/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleClose} title={editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}>
        <TaskForm task={editingTask} onSuccess={handleClose} />
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={() => { if (deletingTask) { deleteTask(deletingTask.id); setDeletingTask(null); } }}
        title="Excluir Tarefa"
        description={`Tem certeza que deseja excluir "${deletingTask?.title}"?`}
      />
    </div>
  );
}

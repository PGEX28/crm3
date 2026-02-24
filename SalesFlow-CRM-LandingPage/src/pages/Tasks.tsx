import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Calendar,
  Flag,
  User,
  Edit2,
  Trash2,
  Eye
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Modal } from '@/components/ui-custom/Modal';
import { ConfirmDialog } from '@/components/ui-custom/ConfirmDialog';
import { TaskForm } from '@/components/forms/TaskForm';
import { useCRMStore } from '@/store/useCRMStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Task } from '@/types';

const priorityConfig = {
  low: { label: 'Baixa', color: '#B8C5D6', icon: Flag },
  medium: { label: 'Média', color: '#FFA726', icon: Flag },
  high: { label: 'Alta', color: '#EF5350', icon: Flag },
};

const statusConfig = {
  pending: { label: 'Pendente', className: 'bg-[#FFA726]/20 text-[#FFA726]' },
  'in-progress': { label: 'Em Progresso', className: 'bg-[#1F74FF]/20 text-[#1F74FF]' },
  completed: { label: 'Concluída', className: 'bg-[#00C853]/20 text-[#00C853]' },
};

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onView: (task: Task) => void;
}

function TaskCard({ task, index, onEdit, onDelete, onView }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const priority = priorityConfig[task.priority];
  const status = statusConfig[task.status];
  const { toggleTaskStatus } = useCRMStore();

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "glass-card rounded-xl p-4 relative overflow-hidden group",
        "transition-all duration-300",
        isHovered && "scale-[1.02]",
        task.status === 'completed' && "opacity-60"
      )}
    >
      {/* Priority Indicator */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: priority.color }}
      />

      <div className="pl-3">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                toggleTaskStatus(task.id);
                toast.success(task.status === 'completed' ? 'Tarefa reaberta!' : 'Tarefa concluída!');
              }}
              className={cn(
                "transition-colors",
                task.status === 'completed' ? "text-[#00C853]" : "text-[#B8C5D6] hover:text-[#1F74FF]"
              )}
            >
              {task.status === 'completed' ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <Circle className="w-6 h-6" />
              )}
            </motion.button>
            <div>
              <h4 className={cn(
                "text-sm font-medium text-white transition-all",
                task.status === 'completed' && "line-through text-[#B8C5D6]"
              )}>
                {task.title}
              </h4>
              <p className="text-xs text-[#B8C5D6]">{task.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onView(task)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#B8C5D6] hover:text-white transition-colors"
            >
              <Eye className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#B8C5D6] hover:text-white transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(task)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#B8C5D6] hover:text-[#EF5350] transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 flex-wrap">
          <span className={cn(
            "px-2 py-0.5 rounded-full text-xs font-medium",
            status.className
          )}>
            {status.label}
          </span>
          
          <div className="flex items-center gap-1 text-xs text-[#B8C5D6]">
            <Flag className="w-3 h-3" style={{ color: priority.color }} />
            <span>{priority.label}</span>
          </div>
          
          <div className={cn(
            "flex items-center gap-1 text-xs",
            isOverdue ? "text-[#EF5350]" : "text-[#B8C5D6]"
          )}>
            <Calendar className="w-3 h-3" />
            <span>{task.dueDate}</span>
            {isOverdue && <span>(Atrasada)</span>}
          </div>

          {task.relatedTo && (
            <div className="flex items-center gap-1 text-xs text-[#B8C5D6]">
              <User className="w-3 h-3" />
              <span>{task.relatedTo.name}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function Tasks() {
  const { tasks, deleteTask } = useCRMStore();
  const [filterStatus, setFilterStatus] = useState<Task['status'] | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<Task['priority'] | 'all'>('all');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isViewModal, setIsViewModal] = useState(false);
  
  // Confirm dialog states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchesStatus && matchesPriority;
  });

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  const handleAdd = () => {
    setSelectedTask(null);
    setIsViewModal(false);
    setIsModalOpen(true);
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsViewModal(false);
    setIsModalOpen(true);
  };

  const handleView = (task: Task) => {
    setSelectedTask(task);
    setIsViewModal(true);
    setIsModalOpen(true);
  };

  const handleDelete = (task: Task) => {
    setTaskToDelete(task);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
      toast.success('Tarefa excluída com sucesso!');
      setTaskToDelete(null);
    }
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <Header 
        title="Tarefas" 
        subtitle="Gerencie suas atividades e prazos"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: '#1F74FF' },
          { label: 'Pendentes', value: stats.pending, color: '#FFA726' },
          { label: 'Em Progresso', value: stats.inProgress, color: '#9C27B0' },
          { label: 'Concluídas', value: stats.completed, color: '#00C853' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-xl p-4 text-center"
          >
            <p 
              className="text-2xl font-bold"
              style={{ color: stat.color }}
            >
              {stat.value}
            </p>
            <p className="text-sm text-[#B8C5D6]">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as Task['status'] | 'all')}
            className="px-4 py-2 rounded-xl bg-[#1A3B66]/60 text-white text-sm border border-white/10 focus:outline-none focus:border-[#1F74FF]/50"
          >
            <option value="all">Todos os Status</option>
            <option value="pending">Pendente</option>
            <option value="in-progress">Em Progresso</option>
            <option value="completed">Concluída</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as Task['priority'] | 'all')}
            className="px-4 py-2 rounded-xl bg-[#1A3B66]/60 text-white text-sm border border-white/10 focus:outline-none focus:border-[#1F74FF]/50"
          >
            <option value="all">Todas as Prioridades</option>
            <option value="high">Alta</option>
            <option value="medium">Média</option>
            <option value="low">Baixa</option>
          </select>
        </div>

        <motion.button
          onClick={handleAdd}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1F74FF] text-white font-medium hover:bg-[#1F74FF]/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nova Tarefa
        </motion.button>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task, index) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              index={index}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredTasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 rounded-full bg-[#1A3B66]/60 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-[#B8C5D6]" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Nenhuma tarefa encontrada</h3>
          <p className="text-[#B8C5D6]">Crie uma nova tarefa para começar</p>
        </motion.div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isViewModal ? 'Detalhes da Tarefa' : selectedTask ? 'Editar Tarefa' : 'Nova Tarefa'}
        size={isViewModal ? 'md' : 'lg'}
      >
        {isViewModal && selectedTask ? (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${priorityConfig[selectedTask.priority].color}30` }}
              >
                <Flag 
                  className="w-6 h-6" 
                  style={{ color: priorityConfig[selectedTask.priority].color }}
                />
              </div>
              <div className="flex-1">
                <h4 className={cn(
                  "text-xl font-semibold text-white",
                  selectedTask.status === 'completed' && "line-through text-[#B8C5D6]"
                )}>
                  {selectedTask.title}
                </h4>
                <p className="text-[#B8C5D6]">{selectedTask.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-sm text-[#B8C5D6] mb-1">Status</p>
                <span className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium",
                  statusConfig[selectedTask.status].className
                )}>
                  {statusConfig[selectedTask.status].label}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-sm text-[#B8C5D6] mb-1">Prioridade</p>
                <span 
                  className="text-white font-medium"
                  style={{ color: priorityConfig[selectedTask.priority].color }}
                >
                  {priorityConfig[selectedTask.priority].label}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-sm text-[#B8C5D6] mb-1">Data de Vencimento</p>
                <p className="text-white">{selectedTask.dueDate}</p>
              </div>
              {selectedTask.relatedTo && (
                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-sm text-[#B8C5D6] mb-1">Relacionado a</p>
                  <p className="text-white">{selectedTask.relatedTo.name}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <motion.button
                onClick={() => {
                  setIsViewModal(false);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-4 py-3 rounded-xl bg-[#1F74FF] text-white font-medium hover:bg-[#1F74FF]/90 transition-colors"
              >
                Editar Tarefa
              </motion.button>
            </div>
          </div>
        ) : (
          <TaskForm 
            task={selectedTask} 
            onSuccess={handleSuccess} 
          />
        )}
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Tarefa"
        description={`Tem certeza que deseja excluir a tarefa "${taskToDelete?.title}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        variant="danger"
      />
    </motion.div>
  );
}

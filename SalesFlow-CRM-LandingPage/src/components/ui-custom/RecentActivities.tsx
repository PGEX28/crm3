import { motion } from 'framer-motion';
import { 
  Edit3, 
  Mail, 
  Phone, 
  Calendar,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { useCRMStore } from '@/store/useCRMStore';
import { cn } from '@/lib/utils';
import type { Activity } from '@/types';

const activityConfig = {
  call: { icon: Phone, color: 'bg-[#1F74FF]/20 text-[#1F74FF]', label: 'Ligação' },
  email: { icon: Mail, color: 'bg-[#00C853]/20 text-[#00C853]', label: 'Email' },
  meeting: { icon: Calendar, color: 'bg-[#FFA726]/20 text-[#FFA726]', label: 'Reunião' },
  note: { icon: Edit3, color: 'bg-[#9C27B0]/20 text-[#9C27B0]', label: 'Nota' },
  task: { icon: CheckCircle2, color: 'bg-[#00BCD4]/20 text-[#00BCD4]', label: 'Tarefa' },
  deal: { icon: TrendingUp, color: 'bg-[#4CAF50]/20 text-[#4CAF50]', label: 'Negócio' },
};



function ActivityItem({ activity, index }: { activity: Activity; index: number }) {
  const config = activityConfig[activity.type];
  const Icon = config.icon;

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Agora';
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days}d atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.1, 
        duration: 0.4,
        ease: [0.68, -0.6, 0.32, 1.6]
      }}
      className="relative flex gap-4 group"
    >
      {/* Timeline Line */}
      <div className="flex flex-col items-center">
        <motion.div
          whileHover={{ scale: 1.2, rotate: 360 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 z-10",
            config.color
          )}
        >
          <Icon className="w-5 h-5" />
        </motion.div>
        {index < 3 && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: '100%' }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
            className="w-0.5 bg-gradient-to-b from-[#1F74FF]/30 to-transparent mt-2"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-6">
        <motion.div
          whileHover={{ x: 5 }}
          className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-white">{activity.title}</span>
                <span className="text-xs text-[#B8C5D6]">• {config.label}</span>
              </div>
              <p className="text-sm text-[#B8C5D6]">{activity.description}</p>
              {activity.relatedTo && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-[#B8C5D6]">Relacionado a:</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#1F74FF]/20 text-[#1F74FF]">
                    {activity.relatedTo.name}
                  </span>
                </div>
              )}
            </div>
            <span className="text-xs text-[#B8C5D6]">{formatTime(activity.timestamp)}</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function RecentActivities() {
  const { activities } = useCRMStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
      className="glass-card rounded-2xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Atividades Recentes</h3>
          <p className="text-sm text-[#B8C5D6]">Últimas ações no sistema</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 rounded-lg bg-[#1F74FF]/20 text-[#1F74FF] text-sm font-medium hover:bg-[#1F74FF]/30 transition-colors"
        >
          Ver todas
        </motion.button>
      </div>

      {/* Activities List */}
      <div className="space-y-0">
        {activities.slice(0, 4).map((activity, index) => (
          <ActivityItem 
            key={activity.id} 
            activity={activity} 
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
}

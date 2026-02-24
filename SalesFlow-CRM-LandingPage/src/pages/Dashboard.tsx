import { motion } from 'framer-motion';
import { DollarSign, Users, TrendingUp, CheckSquare } from 'lucide-react';
import { MetricCard } from '@/components/ui-custom/MetricCard';
import { SalesChart } from '@/components/ui-custom/SalesChart';
import { RecentActivities } from '@/components/ui-custom/RecentActivities';
import { useCRMStore } from '@/store/useCRMStore';

export function Dashboard() {
  const { contacts, deals, tasks } = useCRMStore();

  const totalRevenue = deals
    .filter((d) => d.stage === 'closed-won')
    .reduce((sum, d) => sum + d.value, 0);

  const activeContacts = contacts.filter((c) => c.status !== 'inactive').length;

  const openDeals = deals.filter(
    (d) => d.stage !== 'closed-won' && d.stage !== 'closed-lost'
  ).length;

  const pendingTasks = tasks.filter((t) => t.status !== 'completed').length;

  const metrics = [
    { title: 'Receita Total', value: totalRevenue, prefix: 'R$ ', growth: 12, icon: DollarSign, color: 'green' as const, delay: 0 },
    { title: 'Contatos Ativos', value: activeContacts, growth: 8, icon: Users, color: 'blue' as const, delay: 0.1 },
    { title: 'Oportunidades Abertas', value: openDeals, growth: 5, icon: TrendingUp, color: 'orange' as const, delay: 0.2 },
    { title: 'Tarefas Pendentes', value: pendingTasks, growth: -3, icon: CheckSquare, color: 'red' as const, delay: 0.3 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-[#B8C5D6] mt-1">Visão geral do seu desempenho comercial</p>
      </motion.div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      {/* Charts & Activities */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <SalesChart />
        </div>
        <div className="xl:col-span-1">
          <RecentActivities />
        </div>
      </div>

      {/* Pipeline Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Resumo do Pipeline</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Prospecção', stage: 'prospecting', color: '#B8C5D6' },
            { label: 'Qualificação', stage: 'qualification', color: '#FFA726' },
            { label: 'Proposta', stage: 'proposal', color: '#1F74FF' },
            { label: 'Negociação', stage: 'negotiation', color: '#9C27B0' },
            { label: 'Ganho', stage: 'closed-won', color: '#00C853' },
            { label: 'Perdido', stage: 'closed-lost', color: '#EF5350' },
          ].map((item) => {
            const count = deals.filter((d) => d.stage === item.stage).length;
            const value = deals
              .filter((d) => d.stage === item.stage)
              .reduce((sum, d) => sum + d.value, 0);
            return (
              <div key={item.stage} className="text-center p-4 rounded-xl bg-white/5">
                <div
                  className="w-3 h-3 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: item.color }}
                />
                <p className="text-xs text-[#B8C5D6] mb-1">{item.label}</p>
                <p className="text-xl font-bold text-white">{count}</p>
                <p className="text-xs text-[#B8C5D6]">
                  R$ {(value / 1000).toFixed(0)}k
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

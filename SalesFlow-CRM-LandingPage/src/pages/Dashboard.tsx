import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Users, 
  Package, 
  Wallet, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Phone,
  Mail,
  Calendar,
  Edit3,
  TrendingUp
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { MetricCard } from '@/components/ui-custom/MetricCard';
import { SalesChart } from '@/components/ui-custom/SalesChart';
import { CustomerChart } from '@/components/ui-custom/CustomerChart';
import { useCRMStore } from '@/store/useCRMStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const statusConfig = {
  completed: { 
    icon: CheckCircle2, 
    label: 'Completo', 
    className: 'bg-[#00C853]/20 text-[#00C853] border-[#00C853]/30' 
  },
  pending: { 
    icon: Clock, 
    label: 'Pendente', 
    className: 'bg-[#FFA726]/20 text-[#FFA726] border-[#FFA726]/30' 
  },
  cancelled: { 
    icon: XCircle, 
    label: 'Cancelado', 
    className: 'bg-[#EF5350]/20 text-[#EF5350] border-[#EF5350]/30' 
  },
};

export function Dashboard() {
  const { metrics, transactions, activities } = useCRMStore();

  const handleViewAllTransactions = () => {
    toast.info('Visualização completa de transações em desenvolvimento');
  };

  const handleViewAllActivities = () => {
    toast.info('Visualização completa de atividades em desenvolvimento');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <Header 
        title="Dashboard" 
        subtitle="Bem-vindo de volta, confira seu desempenho hoje"
      />

      {/* Metrics Grid */}
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        style={{ perspective: '1000px' }}
      >
        <MetricCard
          title="Total de Vendas"
          value={metrics.totalSales}
          prefix="R$ "
          growth={metrics.salesGrowth}
          icon={DollarSign}
          color="blue"
          delay={0}
        />
        <MetricCard
          title="Total de Clientes"
          value={metrics.totalCustomers}
          growth={metrics.customersGrowth}
          icon={Users}
          color="green"
          delay={0.1}
        />
        <MetricCard
          title="Total de Produtos"
          value={metrics.totalProducts}
          growth={metrics.productsGrowth}
          icon={Package}
          color="orange"
          delay={0.2}
        />
        <MetricCard
          title="Total de Receita"
          value={metrics.totalRevenue}
          prefix="R$ "
          growth={metrics.revenueGrowth}
          icon={Wallet}
          color="blue"
          delay={0.3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div>
          <CustomerChart />
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h3 className="text-lg font-semibold text-white">Transações Recentes</h3>
                <p className="text-sm text-[#B8C5D6]">Últimas movimentações do sistema</p>
              </div>
              <motion.button
                onClick={handleViewAllTransactions}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1F74FF]/20 text-[#1F74FF] text-sm font-medium hover:bg-[#1F74FF]/30 transition-colors"
              >
                Ver todas
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#B8C5D6]">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#B8C5D6]">Data</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#B8C5D6]">Cliente</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#B8C5D6]">Valor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#B8C5D6]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {transactions.slice(0, 5).map((transaction, index) => {
                    const status = statusConfig[transaction.status];
                    const StatusIcon = status.icon;
                    
                    return (
                      <motion.tr
                        key={transaction.id}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                        className="cursor-pointer"
                      >
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-[#1F74FF]">{transaction.id}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-[#B8C5D6]">{transaction.date}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#1F74FF]/20 flex items-center justify-center">
                              <span className="text-xs font-medium text-[#1F74FF]">
                                {transaction.customer.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <span className="text-sm text-white">{transaction.customer}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-semibold text-white">
                            R$ {transaction.amount.toLocaleString('pt-BR')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                            status.className
                          )}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Activities */}
        <div>
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
                onClick={handleViewAllActivities}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1F74FF]/20 text-[#1F74FF] text-sm font-medium hover:bg-[#1F74FF]/30 transition-colors"
              >
                Ver todas
                <ArrowRight className="w-3 h-3" />
              </motion.button>
            </div>

            {/* Activities List */}
            <div className="space-y-4">
              {activities.slice(0, 4).map((activity, index) => {
                const activityConfig = {
                  call: { icon: Phone, color: 'bg-[#1F74FF]/20 text-[#1F74FF]', label: 'Ligação' },
                  email: { icon: Mail, color: 'bg-[#00C853]/20 text-[#00C853]', label: 'Email' },
                  meeting: { icon: Calendar, color: 'bg-[#FFA726]/20 text-[#FFA726]', label: 'Reunião' },
                  note: { icon: Edit3, color: 'bg-[#9C27B0]/20 text-[#9C27B0]', label: 'Nota' },
                  task: { icon: CheckCircle2, color: 'bg-[#00BCD4]/20 text-[#00BCD4]', label: 'Tarefa' },
                  deal: { icon: TrendingUp, color: 'bg-[#4CAF50]/20 text-[#4CAF50]', label: 'Negócio' },
                };
                
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
                    key={activity.id}
                    initial={{ opacity: 0, x: -20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ 
                      delay: index * 0.1, 
                      duration: 0.4,
                      ease: [0.68, -0.6, 0.32, 1.6]
                    }}
                    className="flex gap-3"
                  >
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", config.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-white">{activity.title}</span>
                        <span className="text-xs text-[#B8C5D6]">• {config.label}</span>
                      </div>
                      <p className="text-sm text-[#B8C5D6] truncate">{activity.description}</p>
                      <span className="text-xs text-[#B8C5D6]/60">{formatTime(activity.timestamp)}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  BarChart3,
  Activity
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { useCRMStore } from '@/store/useCRMStore';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const performanceData = [
  { month: 'Jan', leads: 45, conversions: 12 },
  { month: 'Fev', leads: 52, conversions: 18 },
  { month: 'Mar', leads: 48, conversions: 15 },
  { month: 'Abr', leads: 61, conversions: 22 },
  { month: 'Mai', leads: 55, conversions: 20 },
  { month: 'Jun', leads: 67, conversions: 28 },
];

const sourceData = [
  { source: 'Website', value: 35 },
  { source: 'Indicação', value: 25 },
  { source: 'Redes Sociais', value: 20 },
  { source: 'Email', value: 12 },
  { source: 'Outros', value: 8 },
];

export function Analytics() {
  const { deals, contacts } = useCRMStore();

  const conversionRate = Math.round((deals.filter(d => d.stage === 'closed-won').length / deals.length) * 100);
  const avgDealValue = deals.reduce((sum, d) => sum + d.value, 0) / deals.length;

  const stats = [
    {
      title: 'Taxa de Conversão',
      value: `${conversionRate}%`,
      change: '+5%',
      icon: TrendingUp,
      color: 'from-[#00C853] to-[#00C853]/50'
    },
    {
      title: 'Valor Médio',
      value: `R$ ${Math.round(avgDealValue).toLocaleString('pt-BR')}`,
      change: '+12%',
      icon: DollarSign,
      color: 'from-[#1F74FF] to-[#1F74FF]/50'
    },
    {
      title: 'Leads/Mês',
      value: '54',
      change: '+8%',
      icon: Users,
      color: 'from-[#FFA726] to-[#FFA726]/50'
    },
    {
      title: 'Meta Anual',
      value: '78%',
      change: '+15%',
      icon: Target,
      color: 'from-[#9C27B0] to-[#9C27B0]/50'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <Header 
        title="Analytics" 
        subtitle="Métricas e análises de desempenho"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-2xl p-6 relative overflow-hidden"
          >
            {/* Gradient Background */}
            <div className={cn(
              "absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 -mr-10 -mt-10",
              "bg-gradient-to-br",
              stat.color
            )} />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  "bg-gradient-to-br",
                  stat.color
                )}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="px-2 py-1 rounded-full bg-[#00C853]/20 text-[#00C853] text-xs font-medium">
                  {stat.change}
                </span>
              </div>
              
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-[#B8C5D6]">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Leads vs Conversões</h3>
              <p className="text-sm text-[#B8C5D6]">Desempenho mensal</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#1F74FF]" />
                <span className="text-xs text-[#B8C5D6]">Leads</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#00C853]" />
                <span className="text-xs text-[#B8C5D6]">Conversões</span>
              </div>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#B8C5D6" fontSize={12} />
                <YAxis stroke="#B8C5D6" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(11, 27, 54, 0.9)', 
                    border: '1px solid rgba(31, 116, 255, 0.3)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="leads" fill="#1F74FF" radius={[4, 4, 0, 0]} />
                <Bar dataKey="conversions" fill="#00C853" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Source Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white">Fonte de Leads</h3>
            <p className="text-sm text-[#B8C5D6]">De onde vêm seus leads</p>
          </div>

          <div className="space-y-4">
            {sourceData.map((item, index) => (
              <motion.div
                key={item.source}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">{item.source}</span>
                  <span className="text-sm text-[#B8C5D6]">{item.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                    className={cn(
                      "h-full rounded-full",
                      index === 0 ? "bg-[#1F74FF]" :
                      index === 1 ? "bg-[#00C853]" :
                      index === 2 ? "bg-[#FFA726]" :
                      index === 3 ? "bg-[#9C27B0]" :
                      "bg-[#B8C5D6]"
                    )}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 glass-card rounded-2xl p-6"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white">Tendência de Receita</h3>
            <p className="text-sm text-[#B8C5D6]">Evolução da receita ao longo do ano</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1F74FF" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#1F74FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#B8C5D6" fontSize={12} />
                <YAxis stroke="#B8C5D6" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(11, 27, 54, 0.9)', 
                    border: '1px solid rgba(31, 116, 255, 0.3)',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="conversions" 
                  stroke="#1F74FF" 
                  strokeWidth={3}
                  fill="url(#revenueGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Resumo</h3>
          
          <div className="space-y-6">
            {[
              { label: 'Total de Negócios', value: deals.length, icon: BarChart3 },
              { label: 'Negócios Ganhos', value: deals.filter(d => d.stage === 'closed-won').length, icon: TrendingUp },
              { label: 'Total de Contatos', value: contacts.length, icon: Users },
              { label: 'Atividades Hoje', value: 12, icon: Activity },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-[#1F74FF]/20 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-[#1F74FF]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{item.value}</p>
                  <p className="text-sm text-[#B8C5D6]">{item.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

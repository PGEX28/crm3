import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useCRMStore } from '@/store/useCRMStore';

const COLORS = ['#1F74FF', '#00C853', '#FFA726', '#9C27B0', '#EF5350', '#B8C5D6'];

export function Analytics() {
  const { deals, contacts, tasks, salesData } = useCRMStore();

  const stageData = [
    { name: 'Prospecção', value: deals.filter(d => d.stage === 'prospecting').length },
    { name: 'Qualificação', value: deals.filter(d => d.stage === 'qualification').length },
    { name: 'Proposta', value: deals.filter(d => d.stage === 'proposal').length },
    { name: 'Negociação', value: deals.filter(d => d.stage === 'negotiation').length },
    { name: 'Ganho', value: deals.filter(d => d.stage === 'closed-won').length },
    { name: 'Perdido', value: deals.filter(d => d.stage === 'closed-lost').length },
  ].filter(d => d.value > 0);

  const contactStatusData = [
    { name: 'Lead', value: contacts.filter(c => c.status === 'lead').length },
    { name: 'Prospecto', value: contacts.filter(c => c.status === 'prospect').length },
    { name: 'Cliente', value: contacts.filter(c => c.status === 'customer').length },
    { name: 'Inativo', value: contacts.filter(c => c.status === 'inactive').length },
  ].filter(d => d.value > 0);

  const taskData = [
    { name: 'Pendente', value: tasks.filter(t => t.status === 'pending').length, fill: '#FFA726' },
    { name: 'Em Progresso', value: tasks.filter(t => t.status === 'in-progress').length, fill: '#1F74FF' },
    { name: 'Concluída', value: tasks.filter(t => t.status === 'completed').length, fill: '#00C853' },
  ];

  const totalRevenue = deals.filter(d => d.stage === 'closed-won').reduce((s, d) => s + d.value, 0);
  const pipelineValue = deals.filter(d => !['closed-won','closed-lost'].includes(d.stage)).reduce((s, d) => s + d.value, 0);
  const winRate = deals.length > 0
    ? Math.round((deals.filter(d => d.stage === 'closed-won').length / deals.length) * 100)
    : 0;
  const avgDealValue = deals.length > 0 ? Math.round(deals.reduce((s, d) => s + d.value, 0) / deals.length) : 0;

  const tooltipStyle = {
    backgroundColor: '#0B1B36',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: '#fff',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-[#B8C5D6] mt-1">Análise completa do seu desempenho</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Receita Total', value: `R$ ${(totalRevenue / 1000).toFixed(0)}k`, color: 'text-[#00C853]' },
          { label: 'Pipeline', value: `R$ ${(pipelineValue / 1000).toFixed(0)}k`, color: 'text-[#1F74FF]' },
          { label: 'Taxa de Conversão', value: `${winRate}%`, color: 'text-[#FFA726]' },
          { label: 'Ticket Médio', value: `R$ ${(avgDealValue / 1000).toFixed(0)}k`, color: 'text-[#9C27B0]' },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-xl p-5"
          >
            <p className="text-sm text-[#B8C5D6] mb-1">{kpi.label}</p>
            <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Sales Over Time */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-6">Evolução de Vendas (12 meses)</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="gSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1F74FF" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#1F74FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C853" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00C853" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="month" stroke="#B8C5D6" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#B8C5D6" fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => `R$${v/1000}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`R$ ${v.toLocaleString('pt-BR')}`, '']} />
              <Legend formatter={(val) => <span style={{ color: '#B8C5D6' }}>{val === 'sales' ? 'Vendas' : 'Receita'}</span>} />
              <Area type="monotone" dataKey="sales" stroke="#1F74FF" strokeWidth={2} fill="url(#gSales)" />
              <Area type="monotone" dataKey="revenue" stroke="#00C853" strokeWidth={2} fill="url(#gRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline by Stage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Pipeline por Etapa</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stageData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                  {stageData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Contacts by Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Contatos por Status</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contactStatusData} layout="vertical">
                <XAxis type="number" stroke="#B8C5D6" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" stroke="#B8C5D6" fontSize={11} tickLine={false} axisLine={false} width={70} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {contactStatusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Tasks Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Status das Tarefas</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskData}>
                <XAxis dataKey="name" stroke="#B8C5D6" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#B8C5D6" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {taskData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

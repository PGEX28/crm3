import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { useCRMStore } from '@/store/useCRMStore';
import { cn } from '@/lib/utils';

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-strong p-4 rounded-xl border border-[#1F74FF]/30"
      >
        <p className="text-white font-medium mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-[#B8C5D6] text-sm">
              {entry.dataKey === 'sales' ? 'Vendas' : 'Receita'}:
            </span>
            <span className="text-white font-medium">
              R$ {entry.value?.toLocaleString('pt-BR')}
            </span>
          </div>
        ))}
      </motion.div>
    );
  }
  return null;
};

export function SalesChart() {
  const { salesData } = useCRMStore();
  const [hoveredData, setHoveredData] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<'monthly' | 'weekly' | 'yearly'>('monthly');

  const filters = [
    { id: 'monthly', label: 'Mensal' },
    { id: 'weekly', label: 'Semanal' },
    { id: 'yearly', label: 'Anual' },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="glass-card rounded-2xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Visão Geral de Vendas</h3>
          <p className="text-sm text-[#B8C5D6]">Acompanhe seu desempenho ao longo do tempo</p>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-2">
          {filters.map((filter) => (
            <motion.button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                activeFilter === filter.id
                  ? "bg-[#1F74FF] text-white"
                  : "bg-[#1A3B66]/60 text-[#B8C5D6] hover:text-white hover:bg-[#1A3B66]"
              )}
            >
              {filter.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={salesData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            onMouseMove={(e) => {
              if (e.activeTooltipIndex !== undefined) {
                setHoveredData(e.activeTooltipIndex);
              }
            }}
            onMouseLeave={() => setHoveredData(null)}
          >
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1F74FF" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#1F74FF" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00C853" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#00C853" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />
            
            <XAxis 
              dataKey="month" 
              stroke="#B8C5D6"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            
            <YAxis 
              stroke="#B8C5D6"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickFormatter={(value) => `R$${value / 1000}k`}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#1F74FF"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorSales)"
              animationDuration={1500}
              animationEasing="ease-out"
            />
            
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#00C853"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              animationDuration={1500}
              animationEasing="ease-out"
            />

            {hoveredData !== null && (
              <ReferenceLine 
                x={salesData[hoveredData]?.month} 
                stroke="#1F74FF" 
                strokeDasharray="3 3"
                strokeOpacity={0.5}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#1F74FF]" />
          <span className="text-sm text-[#B8C5D6]">Vendas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#00C853]" />
          <span className="text-sm text-[#B8C5D6]">Receita</span>
        </div>
      </div>
    </motion.div>
  );
}

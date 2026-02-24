import { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';
import { useCRMStore } from '@/store/useCRMStore';

interface ActiveShapeProps {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload: { name: string; value: number };
  percent: number;
}

const renderActiveShape = (props: ActiveShapeProps) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;
  
  return (
    <g>
      <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill="#fff" className="text-lg font-semibold">
        {payload.name}
      </text>
      <text x={cx} y={cy + 15} dy={8} textAnchor="middle" fill="#B8C5D6" className="text-sm">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        className="filter drop-shadow-lg"
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 12}
        outerRadius={outerRadius + 16}
        fill={fill}
        opacity={0.3}
      />
    </g>
  );
};

export function CustomerChart() {
  const { customerCategories } = useCRMStore();
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="glass-card rounded-2xl p-6"
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">Categoria de Clientes</h3>
        <p className="text-sm text-[#B8C5D6]">Distribuição por segmento</p>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape as unknown as (props: unknown) => React.ReactElement}
              data={customerCategories}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
              onMouseEnter={onPieEnter}
              animationBegin={0}
              animationDuration={800}
            >
              {customerCategories.map((item, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={item.color}
                  stroke="rgba(11, 27, 54, 0.8)"
                  strokeWidth={3}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
        {customerCategories.map((category, index) => (
          <motion.button
            key={category.name}
            onClick={() => setActiveIndex(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300
              ${activeIndex === index ? 'bg-white/10' : 'hover:bg-white/5'}
            `}
          >
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: category.color }}
            />
            <span className="text-sm text-[#B8C5D6]">{category.name}</span>
            <span className="text-sm text-white font-medium">{category.value}%</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

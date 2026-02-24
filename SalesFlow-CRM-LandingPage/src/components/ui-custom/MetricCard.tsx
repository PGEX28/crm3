import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  growth?: number;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'orange' | 'red';
  delay?: number;
}

const colorMap = {
  blue: { bg: 'bg-[#1F74FF]/20', text: 'text-[#1F74FF]', border: 'border-[#1F74FF]/30' },
  green: { bg: 'bg-[#00C853]/20', text: 'text-[#00C853]', border: 'border-[#00C853]/30' },
  orange: { bg: 'bg-[#FFA726]/20', text: 'text-[#FFA726]', border: 'border-[#FFA726]/30' },
  red: { bg: 'bg-[#EF5350]/20', text: 'text-[#EF5350]', border: 'border-[#EF5350]/30' },
};

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const previousValue = useRef(0);

  useEffect(() => {
    const startValue = previousValue.current;
    const endValue = value;
    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out expo
      const easeOutExpo = 1 - Math.pow(2, -10 * progress);
      const currentValue = startValue + (endValue - startValue) * easeOutExpo;
      
      setDisplayValue(currentValue);
      previousValue.current = currentValue;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  return (
    <span className="text-2xl lg:text-3xl font-bold text-white">
      {prefix}{formatNumber(displayValue)}{suffix}
    </span>
  );
}

export function MetricCard({ title, value, prefix = '', suffix = '', growth = 0, icon: Icon, color, delay = 0 }: MetricCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const colors = colorMap[color];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--x', `${x}px`);
    cardRef.current.style.setProperty('--y', `${y}px`);
  };

  const GrowthIcon = growth > 0 ? TrendingUp : growth < 0 ? TrendingDown : Minus;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: -30, rotateX: 20 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        delay, 
        duration: 0.5, 
        ease: [0.34, 1.56, 0.64, 1] 
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative p-6 rounded-2xl overflow-hidden",
        "glass-card spotlight-hover",
        "transform-gpu transition-all duration-300",
        isHovered && "scale-[1.02] shadow-xl shadow-[#1F74FF]/10"
      )}
      style={{ perspective: '1000px' }}
    >
      {/* Spotlight Effect */}
      <div 
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none",
          isHovered && "opacity-100"
        )}
        style={{
          background: `radial-gradient(300px circle at var(--x, 50%) var(--y, 50%), rgba(31, 116, 255, 0.15), transparent 50%)`
        }}
      />

      {/* Border Glow */}
      <div 
        className={cn(
          "absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 pointer-events-none",
          isHovered && "opacity-100"
        )}
        style={{
          background: `linear-gradient(135deg, ${color === 'blue' ? '#1F74FF' : color === 'green' ? '#00C853' : color === 'orange' ? '#FFA726' : '#EF5350'}20, transparent)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'xor',
          WebkitMaskComposite: 'xor',
          padding: '1px'
        }}
      />

      <div className="relative z-10">
        {/* Icon & Growth */}
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            colors.bg,
            colors.border,
            "border"
          )}>
            <Icon className={cn("w-6 h-6", colors.text)} />
          </div>
          
          {growth !== 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.3 }}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium",
                growth > 0 ? "bg-[#00C853]/20 text-[#00C853]" : "bg-[#EF5350]/20 text-[#EF5350]"
              )}
            >
              <GrowthIcon className="w-3 h-3" />
              <span>{Math.abs(growth)}%</span>
            </motion.div>
          )}
        </div>

        {/* Value */}
        <div className="mb-1">
          <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
        </div>

        {/* Title */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
          className="text-sm text-[#B8C5D6]"
        >
          {title}
        </motion.p>
      </div>
    </motion.div>
  );
}

import { motion } from 'framer-motion';
import { Bell, Search, Calendar, Filter } from 'lucide-react';
import { useCRMStore } from '@/store/useCRMStore';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { searchQuery, setSearchQuery } = useCRMStore();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8"
    >
      {/* Title Section */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold text-white"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-[#B8C5D6] mt-1"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* Actions Section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8C5D6]" />
          <input
            type="text"
            placeholder="Pesquisar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-64 pl-10 pr-4 py-2.5 rounded-xl",
              "bg-[#1A3B66]/60 border border-white/10",
              "text-white placeholder:text-[#B8C5D6]/60",
              "focus:outline-none focus:border-[#1F74FF]/50 focus:ring-2 focus:ring-[#1F74FF]/20",
              "transition-all duration-300"
            )}
          />
        </motion.div>

        {/* Date Filter */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl",
            "bg-[#1A3B66]/60 border border-white/10",
            "text-white hover:bg-[#1A3B66]/80 transition-colors"
          )}
        >
          <Calendar className="w-4 h-4" />
          <span className="text-sm">Este mês</span>
          <Filter className="w-3 h-3 ml-1 text-[#B8C5D6]" />
        </motion.button>

        {/* Notifications */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={cn(
            "relative p-2.5 rounded-xl",
            "bg-[#1A3B66]/60 border border-white/10",
            "text-white hover:bg-[#1A3B66]/80 transition-colors"
          )}
        >
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#1F74FF] text-xs flex items-center justify-center font-medium">
            3
          </span>
        </motion.button>
      </div>
    </motion.header>
  );
}

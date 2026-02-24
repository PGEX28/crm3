import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Kanban,
  Briefcase,
  CheckSquare,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useCRMStore } from '@/store/useCRMStore';
import type { ViewType } from '@/types';
import { cn } from '@/lib/utils';

interface NavItem {
  id: ViewType;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'contacts', label: 'Contatos', icon: Users },
  { id: 'pipeline', label: 'Pipeline', icon: Kanban },
  { id: 'deals', label: 'Oportunidades', icon: Briefcase },
  { id: 'tasks', label: 'Tarefas', icon: CheckSquare },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

export function Sidebar() {
  const { currentView, setCurrentView, currentUser } = useCRMStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0 });
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    const activeItem = itemRefs.current.get(currentView);
    if (activeItem && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      setIndicatorStyle({
        top: itemRect.top - navRect.top,
        height: itemRect.height
      });
    }
  }, [currentView]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--x', `${x}%`);
    e.currentTarget.style.setProperty('--y', `${y}%`);
  };

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed left-4 top-4 bottom-4 z-50 flex flex-col",
        "glass-card-strong rounded-3xl",
        "transition-all duration-500 ease-out",
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-5 border-b border-white/10">
        <div className="relative flex-shrink-0">
          <img 
            src="/logo.png" 
            alt="SalesFlow Logo" 
            className="w-10 h-10 rounded-xl object-cover"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-xl border-2 border-dashed border-white/20 pointer-events-none"
          />
        </div>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="overflow-hidden"
          >
            <h1 className="text-lg font-bold text-white whitespace-nowrap">SalesFlow</h1>
            <p className="text-xs text-[#B8C5D6] whitespace-nowrap">CRM Inteligente</p>
          </motion.div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-24 w-6 h-6 rounded-full bg-[#1F74FF] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      >
        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Navigation */}
      <nav ref={navRef} className="flex-1 px-3 py-6 space-y-2 overflow-y-auto scrollbar-thin relative">
        {/* Active Indicator */}
        <motion.div
          className="absolute left-3 right-3 rounded-xl bg-[#1F74FF]/20 border border-[#1F74FF]/30"
          animate={{
            top: indicatorStyle.top,
            height: indicatorStyle.height,
            opacity: 1
          }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ opacity: 0 }}
        />

        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          const isHovered = hoveredItem === item.id;

          return (
            <motion.button
              key={item.id}
              ref={(el) => {
                if (el) itemRefs.current.set(item.id, el);
              }}
              onClick={() => setCurrentView(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              onMouseMove={handleMouseMove}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl",
                "transition-all duration-300 relative overflow-hidden",
                "spotlight-hover",
                isActive && "text-white",
                !isActive && "text-[#B8C5D6] hover:text-white"
              )}
            >
              <motion.div
                animate={{
                  rotate: isHovered ? 15 : 0,
                  scale: isHovered ? 1.1 : 1
                }}
                transition={{ duration: 0.2 }}
              >
                <Icon className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isActive && "text-[#1F74FF]"
                )} />
              </motion.div>
              
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}

              {isActive && !isCollapsed && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute right-2 w-1.5 h-1.5 rounded-full bg-[#1F74FF]"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-white/10">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl",
            "bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          )}
        >
          <div className="relative flex-shrink-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full bg-[#1A3B66]"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#00C853] border-2 border-[#0B1B36]" />
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="overflow-hidden"
            >
              <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
              <p className="text-xs text-[#B8C5D6] truncate">{currentUser.email}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.aside>
  );
}

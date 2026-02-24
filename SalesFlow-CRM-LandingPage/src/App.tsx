import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import { Dashboard } from '@/pages/Dashboard';
import { Contacts } from '@/pages/Contacts';
import { Pipeline } from '@/pages/Pipeline';
import { Deals } from '@/pages/Deals';
import { Tasks } from '@/pages/Tasks';
import { Analytics } from '@/pages/Analytics';
import { Settings } from '@/pages/Settings';
import { useCRMStore } from '@/store/useCRMStore';
import { cn } from '@/lib/utils';

function MainContent() {
  const { currentView } = useCRMStore();

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'contacts':
        return <Contacts />;
      case 'pipeline':
        return <Pipeline />;
      case 'deals':
        return <Deals />;
      case 'tasks':
        return <Tasks />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <main className="flex-1 overflow-auto scrollbar-thin">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}

function BackgroundEffect() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient Orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        }}
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#1F74FF]/10 blur-[100px]"
      />
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 80, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear'
        }}
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#00C853]/10 blur-[100px]"
      />
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'linear'
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#0E2D66]/50 blur-[120px]"
      />

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <div className={cn(
      "min-h-screen bg-[#0B1B36] text-white",
      "flex"
    )}>
      <BackgroundEffect />
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-0 lg:ml-72 transition-all duration-500">
        <MainContent />
      </div>
    </div>
  );
}

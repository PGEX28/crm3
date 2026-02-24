import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

const variantConfig = {
  danger: {
    iconColor: 'text-[#EF5350]',
    bgColor: 'bg-[#EF5350]/20',
    buttonColor: 'bg-[#EF5350] hover:bg-[#EF5350]/90',
  },
  warning: {
    iconColor: 'text-[#FFA726]',
    bgColor: 'bg-[#FFA726]/20',
    buttonColor: 'bg-[#FFA726] hover:bg-[#FFA726]/90',
  },
  info: {
    iconColor: 'text-[#1F74FF]',
    bgColor: 'bg-[#1F74FF]/20',
    buttonColor: 'bg-[#1F74FF] hover:bg-[#1F74FF]/90',
  },
};

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
}: ConfirmDialogProps) {
  const config = variantConfig[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <div className="glass-card-strong rounded-2xl overflow-hidden p-6">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className={cn("w-16 h-16 rounded-full flex items-center justify-center", config.bgColor)}>
                  <AlertTriangle className={cn("w-8 h-8", config.iconColor)} />
                </div>
              </div>

              {/* Content */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
                <p className="text-[#B8C5D6]">{description}</p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
                >
                  {cancelText}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={cn(
                    "flex-1 px-4 py-3 rounded-xl text-white font-medium transition-colors",
                    config.buttonColor
                  )}
                >
                  {confirmText}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

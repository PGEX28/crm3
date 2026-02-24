import { motion } from 'framer-motion';
import { CheckCircle2, Clock, XCircle, MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { useCRMStore } from '@/store/useCRMStore';
import { cn } from '@/lib/utils';
import type { Transaction } from '@/types';

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

function TransactionRow({ transaction, index }: { transaction: Transaction; index: number }) {
  const status = statusConfig[transaction.status];
  const StatusIcon = status.icon;

  return (
    <motion.tr
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ 
        y: -2, 
        backgroundColor: 'rgba(26, 59, 102, 0.8)',
        transition: { duration: 0.2 }
      }}
      className="group cursor-pointer"
    >
      <td className="px-4 py-4">
        <span className="text-sm font-medium text-[#1F74FF]">{transaction.id}</span>
      </td>
      <td className="px-4 py-4">
        <span className="text-sm text-[#B8C5D6]">{transaction.date}</span>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1F74FF]/20 flex items-center justify-center">
            <span className="text-xs font-medium text-[#1F74FF]">
              {transaction.customer.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <span className="text-sm text-white font-medium">{transaction.customer}</span>
        </div>
      </td>
      <td className="px-4 py-4">
        <span className="text-sm text-[#B8C5D6]">{transaction.location}</span>
      </td>
      <td className="px-4 py-4">
        <span className="text-sm font-semibold text-white">
          R$ {transaction.amount.toLocaleString('pt-BR')}
        </span>
      </td>
      <td className="px-4 py-4">
        <span className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border",
          status.className
        )}>
          <StatusIcon className="w-3.5 h-3.5" />
          {status.label}
        </span>
      </td>
      <td className="px-4 py-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-lg hover:bg-white/10 text-[#B8C5D6] hover:text-white transition-colors opacity-0 group-hover:opacity-100"
        >
          <MoreHorizontal className="w-4 h-4" />
        </motion.button>
      </td>
    </motion.tr>
  );
}

export function TransactionsTable() {
  const { transactions } = useCRMStore();

  return (
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
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 rounded-lg bg-[#1F74FF]/20 text-[#1F74FF] text-sm font-medium hover:bg-[#1F74FF]/30 transition-colors"
        >
          Ver todas
        </motion.button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-left">
                <button className="flex items-center gap-1 text-xs font-medium text-[#B8C5D6] hover:text-white transition-colors">
                  ID
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button className="flex items-center gap-1 text-xs font-medium text-[#B8C5D6] hover:text-white transition-colors">
                  Data
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-medium text-[#B8C5D6]">Cliente</span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-medium text-[#B8C5D6]">Localização</span>
              </th>
              <th className="px-4 py-3 text-left">
                <button className="flex items-center gap-1 text-xs font-medium text-[#B8C5D6] hover:text-white transition-colors">
                  Valor
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-medium text-[#B8C5D6]">Status</span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-medium text-[#B8C5D6]">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.map((transaction, index) => (
              <TransactionRow 
                key={transaction.id} 
                transaction={transaction} 
                index={index}
              />
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

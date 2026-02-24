import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Filter, Mail, Phone, Building2,
  Edit2, Trash2, ChevronDown, Users
} from 'lucide-react';
import { useCRMStore } from '@/store/useCRMStore';
import { ContactForm } from '@/components/forms/ContactForm';
import { Modal } from '@/components/ui-custom/Modal';
import { ConfirmDialog } from '@/components/ui-custom/ConfirmDialog';
import { cn } from '@/lib/utils';
import type { Contact } from '@/types';

const statusConfig = {
  lead: { label: 'Lead', color: 'bg-[#B8C5D6]/20 text-[#B8C5D6]' },
  prospect: { label: 'Prospecto', color: 'bg-[#FFA726]/20 text-[#FFA726]' },
  customer: { label: 'Cliente', color: 'bg-[#00C853]/20 text-[#00C853]' },
  inactive: { label: 'Inativo', color: 'bg-[#EF5350]/20 text-[#EF5350]' },
};

export function Contacts() {
  const { contacts, deleteContact } = useCRMStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Contact['status'] | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null);
  const [showFilter, setShowFilter] = useState(false);

  const filtered = contacts.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingContact(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Contatos</h1>
          <p className="text-[#B8C5D6] mt-1">{contacts.length} contatos no total</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1F74FF] text-white rounded-xl font-medium hover:bg-[#1F74FF]/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Contato
        </motion.button>
      </motion.div>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8C5D6]" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou empresa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-[#B8C5D6]/60 focus:outline-none focus:border-[#1F74FF]/50 focus:ring-2 focus:ring-[#1F74FF]/20 transition-all"
          />
        </div>
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[#B8C5D6] hover:text-white transition-colors"
          >
            <Filter className="w-5 h-5" />
            {statusFilter === 'all' ? 'Todos' : statusConfig[statusFilter].label}
            <ChevronDown className={cn('w-4 h-4 transition-transform', showFilter && 'rotate-180')} />
          </motion.button>
          <AnimatePresence>
            {showFilter && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-2 w-44 glass-card-strong rounded-xl border border-white/10 overflow-hidden z-10"
              >
                {(['all', 'lead', 'prospect', 'customer', 'inactive'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => { setStatusFilter(s); setShowFilter(false); }}
                    className={cn(
                      'w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/10',
                      statusFilter === s ? 'text-[#1F74FF]' : 'text-[#B8C5D6]'
                    )}
                  >
                    {s === 'all' ? 'Todos' : statusConfig[s].label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Contacts Grid */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <Users className="w-16 h-16 text-[#B8C5D6]/30 mb-4" />
          <p className="text-[#B8C5D6] text-lg">Nenhum contato encontrado</p>
          <p className="text-[#B8C5D6]/60 text-sm mt-1">Tente ajustar os filtros ou criar um novo contato</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card rounded-2xl p-5 hover:border-[#1F74FF]/30 border border-white/10 transition-all group"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1F74FF] to-[#9C27B0] flex items-center justify-center text-white font-bold text-lg">
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{contact.name}</h3>
                      <p className="text-xs text-[#B8C5D6]">{contact.position}</p>
                    </div>
                  </div>
                  <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium', statusConfig[contact.status].color)}>
                    {statusConfig[contact.status].label}
                  </span>
                </div>

                {/* Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-[#B8C5D6]">
                    <Building2 className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{contact.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#B8C5D6]">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#B8C5D6]">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>{contact.phone}</span>
                  </div>
                </div>

                {/* Value & Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div>
                    <p className="text-xs text-[#B8C5D6]">Valor potencial</p>
                    <p className="text-sm font-semibold text-white">
                      R$ {contact.value.toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(contact)}
                      className="w-8 h-8 rounded-lg bg-[#1F74FF]/20 text-[#1F74FF] flex items-center justify-center hover:bg-[#1F74FF]/30 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setDeletingContact(contact)}
                      className="w-8 h-8 rounded-lg bg-[#EF5350]/20 text-[#EF5350] flex items-center justify-center hover:bg-[#EF5350]/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={editingContact ? 'Editar Contato' : 'Novo Contato'}
      >
        <ContactForm contact={editingContact} onSuccess={handleClose} />
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deletingContact}
        onClose={() => setDeletingContact(null)}
        onConfirm={() => { if (deletingContact) { deleteContact(deletingContact.id); setDeletingContact(null); } }}
        title="Excluir Contato"
        description={`Tem certeza que deseja excluir "${deletingContact?.name}"? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
}

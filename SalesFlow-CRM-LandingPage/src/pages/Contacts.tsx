import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  Building2,
  Edit2,
  Trash2,
  Eye
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Modal } from '@/components/ui-custom/Modal';
import { ConfirmDialog } from '@/components/ui-custom/ConfirmDialog';
import { ContactForm } from '@/components/forms/ContactForm';
import { useCRMStore } from '@/store/useCRMStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Contact } from '@/types';

const statusConfig = {
  lead: { label: 'Lead', className: 'bg-[#FFA726]/20 text-[#FFA726] border-[#FFA726]/30' },
  prospect: { label: 'Prospecto', className: 'bg-[#1F74FF]/20 text-[#1F74FF] border-[#1F74FF]/30' },
  customer: { label: 'Cliente', className: 'bg-[#00C853]/20 text-[#00C853] border-[#00C853]/30' },
  inactive: { label: 'Inativo', className: 'bg-[#B8C5D6]/20 text-[#B8C5D6] border-[#B8C5D6]/30' },
};

interface ContactCardProps {
  contact: Contact;
  index: number;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
  onView: (contact: Contact) => void;
}

function ContactCard({ contact, index, onEdit, onDelete, onView }: ContactCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const status = statusConfig[contact.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "glass-card rounded-2xl p-5 relative overflow-hidden group",
        "transition-all duration-300",
        isHovered && "scale-[1.02] shadow-xl shadow-[#1F74FF]/10"
      )}
    >
      {/* Hover Glow */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-[#1F74FF]/10 to-transparent opacity-0 transition-opacity duration-300",
          isHovered && "opacity-100"
        )}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1F74FF]/30 to-[#00C853]/30 flex items-center justify-center">
              <span className="text-lg font-bold text-white">
                {contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div>
              <h4 className="text-white font-medium">{contact.name}</h4>
              <p className="text-sm text-[#B8C5D6]">{contact.position}</p>
            </div>
          </div>
          <span className={cn(
            "px-2.5 py-1 rounded-full text-xs font-medium border",
            status.className
          )}>
            {status.label}
          </span>
        </div>

        {/* Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-[#B8C5D6]">
            <Building2 className="w-4 h-4" />
            <span>{contact.company}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#B8C5D6]">
            <Mail className="w-4 h-4" />
            <span>{contact.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#B8C5D6]">
            <Phone className="w-4 h-4" />
            <span>{contact.phone}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div>
            <p className="text-xs text-[#B8C5D6]">Valor Potencial</p>
            <p className="text-lg font-semibold text-white">
              R$ {contact.value.toLocaleString('pt-BR')}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onView(contact)}
              className="p-2 rounded-lg hover:bg-white/10 text-[#B8C5D6] hover:text-white transition-colors"
            >
              <Eye className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(contact)}
              className="p-2 rounded-lg hover:bg-white/10 text-[#B8C5D6] hover:text-white transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(contact)}
              className="p-2 rounded-lg hover:bg-white/10 text-[#B8C5D6] hover:text-[#EF5350] transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Contacts() {
  const { contacts, searchQuery, deleteContact } = useCRMStore();
  const [filterStatus, setFilterStatus] = useState<Contact['status'] | 'all'>('all');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isViewModal, setIsViewModal] = useState(false);
  
  // Confirm dialog states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || contact.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filters = [
    { id: 'all', label: 'Todos' },
    { id: 'lead', label: 'Leads' },
    { id: 'prospect', label: 'Prospectos' },
    { id: 'customer', label: 'Clientes' },
    { id: 'inactive', label: 'Inativos' },
  ] as const;

  const handleAdd = () => {
    setSelectedContact(null);
    setIsViewModal(false);
    setIsModalOpen(true);
  };

  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact);
    setIsViewModal(false);
    setIsModalOpen(true);
  };

  const handleView = (contact: Contact) => {
    setSelectedContact(contact);
    setIsViewModal(true);
    setIsModalOpen(true);
  };

  const handleDelete = (contact: Contact) => {
    setContactToDelete(contact);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (contactToDelete) {
      deleteContact(contactToDelete.id);
      toast.success('Contato excluído com sucesso!');
      setContactToDelete(null);
    }
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setSelectedContact(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <Header 
        title="Contatos" 
        subtitle="Gerencie seus leads, prospectos e clientes"
      />

      {/* Filters & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {filters.map((filter) => (
            <motion.button
              key={filter.id}
              onClick={() => setFilterStatus(filter.id as Contact['status'] | 'all')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                filterStatus === filter.id
                  ? "bg-[#1F74FF] text-white"
                  : "bg-[#1A3B66]/60 text-[#B8C5D6] hover:text-white hover:bg-[#1A3B66]"
              )}
            >
              {filter.label}
            </motion.button>
          ))}
        </div>

        <motion.button
          onClick={handleAdd}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1F74FF] text-white font-medium hover:bg-[#1F74FF]/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Contato
        </motion.button>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredContacts.map((contact, index) => (
            <ContactCard 
              key={contact.id} 
              contact={contact} 
              index={index}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredContacts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 rounded-full bg-[#1A3B66]/60 flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-[#B8C5D6]" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Nenhum contato encontrado</h3>
          <p className="text-[#B8C5D6]">Tente ajustar seus filtros ou adicione um novo contato</p>
        </motion.div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isViewModal ? 'Detalhes do Contato' : selectedContact ? 'Editar Contato' : 'Novo Contato'}
        size={isViewModal ? 'md' : 'lg'}
      >
        {isViewModal && selectedContact ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1F74FF]/30 to-[#00C853]/30 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {selectedContact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white">{selectedContact.name}</h4>
                <p className="text-[#B8C5D6]">{selectedContact.position} na {selectedContact.company}</p>
                <span className={cn(
                  "inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium border",
                  statusConfig[selectedContact.status].className
                )}>
                  {statusConfig[selectedContact.status].label}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-sm text-[#B8C5D6] mb-1">Email</p>
                <p className="text-white">{selectedContact.email}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-sm text-[#B8C5D6] mb-1">Telefone</p>
                <p className="text-white">{selectedContact.phone}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-sm text-[#B8C5D6] mb-1">Valor Potencial</p>
                <p className="text-white font-semibold">R$ {selectedContact.value.toLocaleString('pt-BR')}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-sm text-[#B8C5D6] mb-1">Último Contato</p>
                <p className="text-white">{selectedContact.lastContact}</p>
              </div>
            </div>

            {selectedContact.notes && (
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-sm text-[#B8C5D6] mb-1">Observações</p>
                <p className="text-white">{selectedContact.notes}</p>
              </div>
            )}

            <div className="flex gap-3">
              <motion.button
                onClick={() => {
                  setIsViewModal(false);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-4 py-3 rounded-xl bg-[#1F74FF] text-white font-medium hover:bg-[#1F74FF]/90 transition-colors"
              >
                Editar Contato
              </motion.button>
            </div>
          </div>
        ) : (
          <ContactForm 
            contact={selectedContact} 
            onSuccess={handleSuccess} 
          />
        )}
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Contato"
        description={`Tem certeza que deseja excluir o contato "${contactToDelete?.name}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        variant="danger"
      />
    </motion.div>
  );
}

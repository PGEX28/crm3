import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Building2, Briefcase, DollarSign, FileText } from 'lucide-react';
import { useCRMStore } from '@/store/useCRMStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Contact } from '@/types';

interface ContactFormProps {
  contact?: Contact | null;
  onSuccess: () => void;
}

const statusOptions = [
  { value: 'lead', label: 'Lead' },
  { value: 'prospect', label: 'Prospecto' },
  { value: 'customer', label: 'Cliente' },
  { value: 'inactive', label: 'Inativo' },
];

export function ContactForm({ contact, onSuccess }: ContactFormProps) {
  const { addContact, updateContact } = useCRMStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    status: 'lead' as Contact['status'],
    value: '',
    notes: '',
  });

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        company: contact.company,
        position: contact.position,
        status: contact.status,
        value: contact.value.toString(),
        notes: contact.notes,
      });
    }
  }, [contact]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const contactData = {
        ...formData,
        value: Number(formData.value) || 0,
        lastContact: new Date().toISOString().split('T')[0],
      };

      if (contact) {
        updateContact(contact.id, contactData);
        toast.success('Contato atualizado com sucesso!');
      } else {
        addContact(contactData);
        toast.success('Contato criado com sucesso!');
      }
      
      onSuccess();
    } catch (error) {
      toast.error('Erro ao salvar contato. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName = "w-full pl-10 pr-4 py-3 rounded-xl bg-[#1A3B66]/60 border border-white/10 text-white placeholder:text-[#B8C5D6]/60 focus:outline-none focus:border-[#1F74FF]/50 focus:ring-2 focus:ring-[#1F74FF]/20 transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Nome Completo <span className="text-[#EF5350]">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8C5D6]" />
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: João Silva"
              className={inputClassName}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Email <span className="text-[#EF5350]">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8C5D6]" />
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="exemplo@email.com"
              className={inputClassName}
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Telefone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8C5D6]" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+55 11 98765-4321"
              className={inputClassName}
            />
          </div>
        </div>

        {/* Company */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Empresa</label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8C5D6]" />
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Nome da empresa"
              className={inputClassName}
            />
          </div>
        </div>

        {/* Position */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Cargo</label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8C5D6]" />
            <input
              type="text"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              placeholder="Ex: Diretor Comercial"
              className={inputClassName}
            />
          </div>
        </div>

        {/* Value */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Valor Potencial</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8C5D6]" />
            <input
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              placeholder="0,00"
              className={inputClassName}
            />
          </div>
        </div>

        {/* Status */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white mb-2">Status</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {statusOptions.map((option) => (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => setFormData({ ...formData, status: option.value as Contact['status'] })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                  formData.status === option.value
                    ? "bg-[#1F74FF] text-white"
                    : "bg-[#1A3B66]/60 text-[#B8C5D6] hover:text-white hover:bg-[#1A3B66]"
                )}
              >
                {option.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white mb-2">Observações</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-5 h-5 text-[#B8C5D6]" />
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Adicione observações sobre o contato..."
              rows={3}
              className={cn(inputClassName, "pl-10 resize-none")}
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <motion.button
          type="button"
          onClick={onSuccess}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
        >
          Cancelar
        </motion.button>
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "flex-1 px-4 py-3 rounded-xl bg-[#1F74FF] text-white font-medium transition-colors",
            isSubmitting && "opacity-70 cursor-not-allowed"
          )}
        >
          {isSubmitting ? 'Salvando...' : contact ? 'Atualizar' : 'Criar Contato'}
        </motion.button>
      </div>
    </form>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe,
  CreditCard,
  ChevronRight,
  Camera,
  Mail,
  Phone,
  Building2,
  Save,
  LogOut
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { useCRMStore } from '@/store/useCRMStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const settingsTabs = [
  { id: 'profile', label: 'Perfil', icon: User },
  { id: 'notifications', label: 'Notificações', icon: Bell },
  { id: 'security', label: 'Segurança', icon: Shield },
  { id: 'appearance', label: 'Aparência', icon: Palette },
  { id: 'integrations', label: 'Integrações', icon: Globe },
  { id: 'billing', label: 'Faturamento', icon: CreditCard },
] as const;

function ProfileSettings() {
  const { currentUser } = useCRMStore();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: '+55 11 98765-4321',
    company: 'SalesFlow CRM',
    position: 'Administrador',
    bio: 'Especialista em vendas com mais de 10 anos de experiência no mercado B2B.',
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simular chamada API
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Perfil atualizado com sucesso!');
    setIsSaving(false);
  };

  const inputClassName = "w-full pl-10 pr-4 py-3 rounded-xl bg-[#1A3B66]/60 border border-white/10 text-white placeholder:text-[#B8C5D6]/60 focus:outline-none focus:border-[#1F74FF]/50 focus:ring-2 focus:ring-[#1F74FF]/20 transition-all";

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-24 h-24 rounded-2xl bg-[#1A3B66]"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => toast.info('Upload de foto em desenvolvimento')}
            className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-[#1F74FF] text-white flex items-center justify-center shadow-lg"
          >
            <Camera className="w-4 h-4" />
          </motion.button>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Foto de Perfil</h3>
          <p className="text-sm text-[#B8C5D6]">PNG, JPG ou GIF até 5MB</p>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Nome Completo</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8C5D6]" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={inputClassName}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8C5D6]" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={inputClassName}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Telefone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8C5D6]" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={inputClassName}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Empresa</label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8C5D6]" />
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className={inputClassName}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white mb-2">Biografia</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={4}
            className={cn(inputClassName, "pl-4 resize-none")}
          />
        </div>
      </div>

      {/* Save Button */}
      <motion.button
        onClick={handleSave}
        disabled={isSaving}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1F74FF] text-white font-medium hover:bg-[#1F74FF]/90 transition-colors",
          isSaving && "opacity-70 cursor-not-allowed"
        )}
      >
        <Save className="w-5 h-5" />
        {isSaving ? 'Salvando...' : 'Salvar Alterações'}
      </motion.button>
    </div>
  );
}

function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    dealUpdates: true,
    weeklyReports: true,
    marketingEmails: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => {
      const newValue = !prev[key];
      toast.success(newValue ? 'Notificação ativada!' : 'Notificação desativada!');
      return { ...prev, [key]: newValue };
    });
  };

  return (
    <div className="space-y-6">
      {[
        { key: 'emailNotifications', label: 'Notificações por Email', description: 'Receba atualizações importantes por email' },
        { key: 'pushNotifications', label: 'Notificações Push', description: 'Receba notificações em tempo real no navegador' },
        { key: 'taskReminders', label: 'Lembretes de Tarefas', description: 'Seja lembrado de tarefas próximas do prazo' },
        { key: 'dealUpdates', label: 'Atualizações de Negócios', description: 'Notificações quando um negócio muda de etapa' },
        { key: 'weeklyReports', label: 'Relatórios Semanais', description: 'Receba um resumo semanal do seu desempenho' },
        { key: 'marketingEmails', label: 'Emails de Marketing', description: 'Novidades e dicas sobre o SalesFlow' },
      ].map((item, index) => (
        <motion.div
          key={item.key}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center justify-between p-4 rounded-xl bg-white/5"
        >
          <div>
            <h4 className="text-white font-medium">{item.label}</h4>
            <p className="text-sm text-[#B8C5D6]">{item.description}</p>
          </div>
          <motion.button
            onClick={() => toggleSetting(item.key as keyof typeof settings)}
            className={cn(
              "w-14 h-7 rounded-full transition-colors relative",
              settings[item.key as keyof typeof settings] ? "bg-[#00C853]" : "bg-white/20"
            )}
          >
            <motion.div
              animate={{ x: settings[item.key as keyof typeof settings] ? 28 : 4 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg"
            />
          </motion.button>
        </motion.div>
      ))}
    </div>
  );
}

function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Preencha todos os campos');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    
    setIsUpdating(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Senha atualizada com sucesso!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsUpdating(false);
  };

  const handleEnable2FA = () => {
    toast.info('Autenticação de dois fatores em desenvolvimento');
  };

  const handleTerminateSession = (sessionType: string) => {
    toast.success(`Sessão ${sessionType} encerrada com sucesso!`);
  };

  return (
    <div className="space-y-6">
      {/* Password */}
      <div className="p-6 rounded-xl bg-white/5">
        <h4 className="text-white font-medium mb-4">Alterar Senha</h4>
        <div className="space-y-4">
          <input
            type="password"
            placeholder="Senha atual"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#1A3B66]/60 border border-white/10 text-white placeholder:text-[#B8C5D6]/60 focus:outline-none focus:border-[#1F74FF]/50"
          />
          <input
            type="password"
            placeholder="Nova senha"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#1A3B66]/60 border border-white/10 text-white placeholder:text-[#B8C5D6]/60 focus:outline-none focus:border-[#1F74FF]/50"
          />
          <input
            type="password"
            placeholder="Confirmar nova senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#1A3B66]/60 border border-white/10 text-white placeholder:text-[#B8C5D6]/60 focus:outline-none focus:border-[#1F74FF]/50"
          />
          <motion.button
            onClick={handleUpdatePassword}
            disabled={isUpdating}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "px-6 py-3 rounded-xl bg-[#1F74FF] text-white font-medium hover:bg-[#1F74FF]/90 transition-colors",
              isUpdating && "opacity-70 cursor-not-allowed"
            )}
          >
            {isUpdating ? 'Atualizando...' : 'Atualizar Senha'}
          </motion.button>
        </div>
      </div>

      {/* Two Factor */}
      <div className="p-6 rounded-xl bg-white/5">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-medium">Autenticação de Dois Fatores</h4>
            <p className="text-sm text-[#B8C5D6]">Adicione uma camada extra de segurança</p>
          </div>
          <motion.button
            onClick={handleEnable2FA}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-xl bg-[#1F74FF]/20 text-[#1F74FF] font-medium hover:bg-[#1F74FF]/30 transition-colors"
          >
            Ativar
          </motion.button>
        </div>
      </div>

      {/* Sessions */}
      <div className="p-6 rounded-xl bg-white/5">
        <h4 className="text-white font-medium mb-4">Sessões Ativas</h4>
        <div className="space-y-3">
          {[
            { device: 'Chrome - Windows', location: 'São Paulo, Brasil', current: true },
            { device: 'Safari - iPhone', location: 'São Paulo, Brasil', current: false },
          ].map((session, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div>
                <p className="text-white text-sm">{session.device}</p>
                <p className="text-xs text-[#B8C5D6]">{session.location}</p>
              </div>
              {session.current ? (
                <span className="px-2 py-1 rounded-full bg-[#00C853]/20 text-[#00C853] text-xs">Atual</span>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTerminateSession(session.device)}
                  className="flex items-center gap-1 text-sm text-[#EF5350] hover:underline"
                >
                  <LogOut className="w-4 h-4" />
                  Encerrar
                </motion.button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AppearanceSettings() {
  const [theme, setTheme] = useState('dark');
  const [accentColor, setAccentColor] = useState('#1F74FF');

  const colors = [
    { name: 'Azul', value: '#1F74FF' },
    { name: 'Verde', value: '#00C853' },
    { name: 'Roxo', value: '#9C27B0' },
    { name: 'Laranja', value: '#FFA726' },
    { name: 'Vermelho', value: '#EF5350' },
  ];

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl bg-white/5">
        <h4 className="text-white font-medium mb-4">Tema</h4>
        <div className="flex gap-3">
          <motion.button
            onClick={() => {
              setTheme('dark');
              toast.success('Tema escuro ativado!');
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex-1 p-4 rounded-xl border-2 transition-all",
              theme === 'dark' 
                ? "border-[#1F74FF] bg-[#1F74FF]/10" 
                : "border-white/10 hover:border-white/30"
            )}
          >
            <div className="w-full h-20 rounded-lg bg-[#0B1B36] mb-3" />
            <p className="text-white font-medium">Escuro</p>
          </motion.button>
          <motion.button
            onClick={() => {
              setTheme('light');
              toast.info('Tema claro em desenvolvimento');
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex-1 p-4 rounded-xl border-2 transition-all",
              theme === 'light' 
                ? "border-[#1F74FF] bg-[#1F74FF]/10" 
                : "border-white/10 hover:border-white/30"
            )}
          >
            <div className="w-full h-20 rounded-lg bg-gray-100 mb-3" />
            <p className="text-white font-medium">Claro</p>
          </motion.button>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-white/5">
        <h4 className="text-white font-medium mb-4">Cor de Destaque</h4>
        <div className="flex gap-3 flex-wrap">
          {colors.map((color) => (
            <motion.button
              key={color.value}
              onClick={() => {
                setAccentColor(color.value);
                toast.success(`Cor ${color.name} selecionada!`);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={cn(
                "w-12 h-12 rounded-xl transition-all",
                accentColor === color.value && "ring-2 ring-white ring-offset-2 ring-offset-[#0B1B36]"
              )}
              style={{ backgroundColor: color.value }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function IntegrationsSettings() {
  const integrations = [
    { name: 'Slack', description: 'Receba notificações no Slack', connected: true },
    { name: 'Google Calendar', description: 'Sincronize seus eventos', connected: false },
    { name: 'Zapier', description: 'Automatize workflows', connected: false },
    { name: 'WhatsApp', description: 'Envie mensagens diretamente', connected: true },
  ];

  return (
    <div className="space-y-4">
      {integrations.map((integration, index) => (
        <motion.div
          key={integration.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center justify-between p-4 rounded-xl bg-white/5"
        >
          <div>
            <h4 className="text-white font-medium">{integration.name}</h4>
            <p className="text-sm text-[#B8C5D6]">{integration.description}</p>
          </div>
          <motion.button
            onClick={() => {
              toast.info(`${integration.name} - Funcionalidade em desenvolvimento`);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
              integration.connected
                ? "bg-[#00C853]/20 text-[#00C853] hover:bg-[#00C853]/30"
                : "bg-[#1F74FF]/20 text-[#1F74FF] hover:bg-[#1F74FF]/30"
            )}
          >
            {integration.connected ? 'Conectado' : 'Conectar'}
          </motion.button>
        </motion.div>
      ))}
    </div>
  );
}

function BillingSettings() {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl bg-white/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-white font-medium">Plano Atual</h4>
            <p className="text-2xl font-bold text-white mt-1">Pro</p>
            <p className="text-sm text-[#B8C5D6]">R$ 99/mês</p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-[#00C853]/20 text-[#00C853] text-sm font-medium">
            Ativo
          </div>
        </div>
        <div className="flex gap-3">
          <motion.button
            onClick={() => toast.info('Upgrade em desenvolvimento')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-4 py-3 rounded-xl bg-[#1F74FF] text-white font-medium hover:bg-[#1F74FF]/90 transition-colors"
          >
            Fazer Upgrade
          </motion.button>
          <motion.button
            onClick={() => toast.info('Cancelamento em desenvolvimento')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
          >
            Cancelar Plano
          </motion.button>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-white/5">
        <h4 className="text-white font-medium mb-4">Histórico de Faturas</h4>
        <div className="space-y-3">
          {[
            { date: 'Fev 2024', amount: 'R$ 99,00', status: 'Pago' },
            { date: 'Jan 2024', amount: 'R$ 99,00', status: 'Pago' },
            { date: 'Dez 2023', amount: 'R$ 99,00', status: 'Pago' },
          ].map((invoice, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div>
                <p className="text-white text-sm">{invoice.date}</p>
                <p className="text-xs text-[#B8C5D6]">{invoice.amount}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 rounded-full bg-[#00C853]/20 text-[#00C853] text-xs">
                  {invoice.status}
                </span>
                <motion.button
                  onClick={() => toast.info('Download em desenvolvimento')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm text-[#1F74FF] hover:underline"
                >
                  Download
                </motion.button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Settings() {
  const [activeTab, setActiveTab] = useState<typeof settingsTabs[number]['id']>('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'appearance':
        return <AppearanceSettings />;
      case 'integrations':
        return <IntegrationsSettings />;
      case 'billing':
        return <BillingSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <Header 
        title="Configurações" 
        subtitle="Personalize sua experiência no SalesFlow"
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="glass-card rounded-2xl p-3 space-y-1">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ x: 4 }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300",
                    activeTab === tab.id
                      ? "bg-[#1F74FF] text-white"
                      : "text-[#B8C5D6] hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{tab.label}</span>
                  <ChevronRight className={cn(
                    "w-4 h-4 ml-auto transition-transform",
                    activeTab === tab.id && "rotate-90"
                  )} />
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="glass-card rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-6">
              {settingsTabs.find(t => t.id === activeTab)?.label}
            </h2>
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

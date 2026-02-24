import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Globe, Save, Check } from 'lucide-react';
import { useCRMStore } from '@/store/useCRMStore';
import { cn } from '@/lib/utils';

const sections = [
  { id: 'profile', label: 'Perfil', icon: User },
  { id: 'notifications', label: 'Notificações', icon: Bell },
  { id: 'security', label: 'Segurança', icon: Shield },
  { id: 'appearance', label: 'Aparência', icon: Palette },
  { id: 'integrations', label: 'Integrações', icon: Globe },
];

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => onChange(!value)}
      className={cn(
        'relative w-12 h-6 rounded-full transition-colors duration-300',
        value ? 'bg-[#1F74FF]' : 'bg-white/10'
      )}
    >
      <motion.div
        animate={{ x: value ? 24 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
      />
    </motion.button>
  );
}

export function Settings() {
  const { currentUser } = useCRMStore();
  const [activeSection, setActiveSection] = useState('profile');
  const [saved, setSaved] = useState(false);

  const [notifications, setNotifications] = useState({
    email: true, push: true, newLead: true, dealUpdate: true, taskReminder: true, weeklyReport: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-[#B8C5D6]/60 focus:outline-none focus:border-[#1F74FF]/50 focus:ring-2 focus:ring-[#1F74FF]/20 transition-all";

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white">Configurações</h1>
        <p className="text-[#B8C5D6] mt-1">Personalize sua experiência no SalesFlow</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-56 glass-card rounded-2xl p-3 h-fit"
        >
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <motion.button
                key={section.id}
                whileHover={{ x: 4 }}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                  activeSection === section.id
                    ? 'bg-[#1F74FF]/20 text-[#1F74FF]'
                    : 'text-[#B8C5D6] hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className="w-4 h-4" />
                {section.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 glass-card rounded-2xl p-6 space-y-6"
        >
          {/* Profile */}
          {activeSection === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Informações do Perfil</h2>
              <div className="flex items-center gap-5">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-20 h-20 rounded-2xl bg-[#1A3B66]" />
                <div>
                  <p className="font-semibold text-white text-lg">{currentUser.name}</p>
                  <p className="text-[#B8C5D6]">{currentUser.role}</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-2 text-sm text-[#1F74FF] hover:underline"
                  >
                    Alterar foto
                  </motion.button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#B8C5D6] mb-2">Nome completo</label>
                  <input type="text" defaultValue={currentUser.name} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#B8C5D6] mb-2">Email</label>
                  <input type="email" defaultValue={currentUser.email} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#B8C5D6] mb-2">Cargo</label>
                  <input type="text" defaultValue={currentUser.role} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#B8C5D6] mb-2">Telefone</label>
                  <input type="tel" placeholder="+55 11 99999-9999" className={inputClass} />
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Notificações</h2>
              <div className="space-y-4">
                {[
                  { key: 'email', label: 'Notificações por Email', desc: 'Receba atualizações no seu email' },
                  { key: 'push', label: 'Notificações Push', desc: 'Alertas no navegador em tempo real' },
                  { key: 'newLead', label: 'Novo Lead', desc: 'Quando um novo lead for adicionado' },
                  { key: 'dealUpdate', label: 'Atualização de Negócio', desc: 'Mudanças no pipeline' },
                  { key: 'taskReminder', label: 'Lembretes de Tarefas', desc: 'Alertas de vencimento' },
                  { key: 'weeklyReport', label: 'Relatório Semanal', desc: 'Resumo toda segunda-feira' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                    <div>
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      <p className="text-xs text-[#B8C5D6]">{item.desc}</p>
                    </div>
                    <Toggle
                      value={notifications[item.key as keyof typeof notifications]}
                      onChange={(v) => setNotifications({ ...notifications, [item.key]: v })}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security */}
          {activeSection === 'security' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Segurança</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#B8C5D6] mb-2">Senha atual</label>
                  <input type="password" placeholder="••••••••" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#B8C5D6] mb-2">Nova senha</label>
                  <input type="password" placeholder="••••••••" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#B8C5D6] mb-2">Confirmar nova senha</label>
                  <input type="password" placeholder="••••••••" className={inputClass} />
                </div>
                <div className="p-4 rounded-xl bg-[#1F74FF]/10 border border-[#1F74FF]/20">
                  <p className="text-sm font-medium text-white mb-1">Autenticação de dois fatores</p>
                  <p className="text-xs text-[#B8C5D6] mb-3">Adicione uma camada extra de segurança à sua conta.</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 rounded-xl bg-[#1F74FF] text-white text-sm font-medium hover:bg-[#1F74FF]/90"
                  >
                    Ativar 2FA
                  </motion.button>
                </div>
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeSection === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Aparência</h2>
              <div>
                <p className="text-sm font-medium text-[#B8C5D6] mb-3">Cor de destaque</p>
                <div className="flex gap-3">
                  {['#1F74FF', '#00C853', '#9C27B0', '#FFA726', '#EF5350', '#00BCD4'].map((color) => (
                    <motion.button
                      key={color}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 rounded-xl border-2 border-transparent hover:border-white/30 transition-all"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-[#B8C5D6] mb-3">Idioma</p>
                <select className={inputClass} defaultValue="pt-BR">
                  <option value="pt-BR" className="bg-[#0B1B36]">Português (Brasil)</option>
                  <option value="en" className="bg-[#0B1B36]">English</option>
                  <option value="es" className="bg-[#0B1B36]">Español</option>
                </select>
              </div>
            </div>
          )}

          {/* Integrations */}
          {activeSection === 'integrations' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Integrações</h2>
              <div className="space-y-3">
                {[
                  { name: 'WhatsApp Business', desc: 'Envie mensagens diretamente do CRM', connected: true },
                  { name: 'Google Calendar', desc: 'Sincronize reuniões e tarefas', connected: false },
                  { name: 'Slack', desc: 'Receba notificações no Slack', connected: false },
                  { name: 'RD Station', desc: 'Sincronize leads automaticamente', connected: true },
                  { name: 'Zapier', desc: 'Conecte com +5.000 aplicativos', connected: false },
                ].map((integration) => (
                  <div key={integration.name} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                    <div>
                      <p className="text-sm font-medium text-white">{integration.name}</p>
                      <p className="text-xs text-[#B8C5D6]">{integration.desc}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        'px-4 py-1.5 rounded-xl text-sm font-medium transition-all',
                        integration.connected
                          ? 'bg-[#00C853]/20 text-[#00C853]'
                          : 'bg-[#1F74FF]/20 text-[#1F74FF] hover:bg-[#1F74FF]/30'
                      )}
                    >
                      {integration.connected ? 'Conectado' : 'Conectar'}
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-white/10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className={cn(
                'flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all',
                saved ? 'bg-[#00C853] text-white' : 'bg-[#1F74FF] text-white hover:bg-[#1F74FF]/90'
              )}
            >
              {saved ? <><Check className="w-4 h-4" /> Salvo!</> : <><Save className="w-4 h-4" /> Salvar Alterações</>}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

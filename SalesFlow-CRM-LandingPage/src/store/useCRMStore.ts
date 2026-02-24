import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ViewType, Contact, Deal, Task, Activity, SalesData, User } from '@/types';

const mockContacts: Contact[] = [
  { id: '1', name: 'Ana Silva', email: 'ana@techcorp.com', phone: '+55 11 98765-4321', company: 'TechCorp Brasil', position: 'Diretora Comercial', status: 'customer', value: 85000, notes: 'Cliente VIP, reunião mensal.', lastContact: '2024-01-15', createdAt: '2023-06-01' },
  { id: '2', name: 'Carlos Mendes', email: 'carlos@startup.io', phone: '+55 21 99887-6543', company: 'StartupXYZ', position: 'CEO', status: 'prospect', value: 42000, notes: 'Interessado em plano enterprise.', lastContact: '2024-01-10', createdAt: '2023-09-15' },
  { id: '3', name: 'Marina Costa', email: 'marina@agencia.com', phone: '+55 11 97654-3210', company: 'Agência Digital Pro', position: 'Head de Marketing', status: 'lead', value: 28000, notes: 'Conheceu via webinar.', lastContact: '2024-01-08', createdAt: '2024-01-05' },
  { id: '4', name: 'Roberto Almeida', email: 'roberto@vendasmax.com', phone: '+55 31 98877-6655', company: 'VendasMax', position: 'Diretor de TI', status: 'customer', value: 120000, notes: 'Contrato anual renovado.', lastContact: '2024-01-12', createdAt: '2022-11-20' },
  { id: '5', name: 'Fernanda Lima', email: 'fernanda@leadmaster.com', phone: '+55 51 97788-9900', company: 'LeadMaster', position: 'Gerente de Vendas', status: 'prospect', value: 55000, notes: 'Aguardando proposta.', lastContact: '2024-01-09', createdAt: '2023-12-10' },
  { id: '6', name: 'Paulo Rodrigues', email: 'paulo@salespro.com', phone: '+55 41 96677-8899', company: 'SalesPro', position: 'COO', status: 'inactive', value: 15000, notes: 'Contrato encerrado em dez/23.', lastContact: '2023-12-01', createdAt: '2023-03-15' },
];

const mockDeals: Deal[] = [
  { id: '1', title: 'Implementação CRM Enterprise', value: 85000, stage: 'negotiation', probability: 75, contactId: '1', contactName: 'Ana Silva', expectedCloseDate: '2024-02-28', notes: 'Aguardando aprovação do jurídico.', createdAt: '2024-01-01' },
  { id: '2', title: 'Licença SaaS Anual', value: 42000, stage: 'proposal', probability: 50, contactId: '2', contactName: 'Carlos Mendes', expectedCloseDate: '2024-03-15', notes: 'Proposta enviada.', createdAt: '2024-01-05' },
  { id: '3', title: 'Consultoria de Vendas', value: 28000, stage: 'qualification', probability: 30, contactId: '3', contactName: 'Marina Costa', expectedCloseDate: '2024-04-01', notes: 'Reunião de descoberta agendada.', createdAt: '2024-01-08' },
  { id: '4', title: 'Renovação Contrato Premium', value: 120000, stage: 'closed-won', probability: 100, contactId: '4', contactName: 'Roberto Almeida', expectedCloseDate: '2024-01-20', notes: 'Contrato assinado!', createdAt: '2023-12-01' },
  { id: '5', title: 'Módulo de Analytics', value: 35000, stage: 'prospecting', probability: 20, contactId: '5', contactName: 'Fernanda Lima', expectedCloseDate: '2024-05-01', notes: 'Primeiro contato realizado.', createdAt: '2024-01-10' },
  { id: '6', title: 'Integração ERP', value: 67000, stage: 'closed-lost', probability: 0, contactId: '6', contactName: 'Paulo Rodrigues', expectedCloseDate: '2024-01-10', notes: 'Escolheram concorrente.', createdAt: '2023-11-01' },
];

const mockTasks: Task[] = [
  { id: '1', title: 'Follow-up com Ana Silva', description: 'Ligar para confirmar reunião de negociação.', status: 'pending', priority: 'high', dueDate: '2024-01-20', assignedTo: '1', relatedTo: { type: 'contact', id: '1', name: 'Ana Silva' }, createdAt: '2024-01-15' },
  { id: '2', title: 'Enviar proposta revisada', description: 'Revisar e enviar proposta para Carlos Mendes.', status: 'in-progress', priority: 'high', dueDate: '2024-01-18', assignedTo: '1', relatedTo: { type: 'deal', id: '2', name: 'Licença SaaS Anual' }, createdAt: '2024-01-14' },
  { id: '3', title: 'Agendar demo', description: 'Agendar demonstração do produto para Marina.', status: 'pending', priority: 'medium', dueDate: '2024-01-22', assignedTo: '1', relatedTo: { type: 'contact', id: '3', name: 'Marina Costa' }, createdAt: '2024-01-13' },
  { id: '4', title: 'Preparar relatório mensal', description: 'Compilar métricas de vendas de janeiro.', status: 'pending', priority: 'low', dueDate: '2024-01-31', assignedTo: '1', createdAt: '2024-01-12' },
  { id: '5', title: 'Reunião de pipeline', description: 'Revisão semanal do pipeline com a equipe.', status: 'completed', priority: 'medium', dueDate: '2024-01-15', assignedTo: '1', createdAt: '2024-01-10' },
];

const mockActivities: Activity[] = [
  { id: '1', type: 'deal', title: 'Negócio fechado!', description: 'Renovação Contrato Premium assinado - R$ 120.000', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), relatedTo: { type: 'deal', id: '4', name: 'Roberto Almeida' } },
  { id: '2', type: 'call', title: 'Ligação realizada', description: 'Discussão sobre termos do contrato enterprise.', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), relatedTo: { type: 'contact', id: '1', name: 'Ana Silva' } },
  { id: '3', type: 'email', title: 'Proposta enviada', description: 'Proposta de licença SaaS anual enviada por email.', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), relatedTo: { type: 'deal', id: '2', name: 'Carlos Mendes' } },
  { id: '4', type: 'meeting', title: 'Reunião de descoberta', description: 'Levantamento de necessidades com Marina Costa.', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), relatedTo: { type: 'contact', id: '3', name: 'Marina Costa' } },
  { id: '5', type: 'note', title: 'Nota adicionada', description: 'Cliente solicitou prazo maior para análise.', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), relatedTo: { type: 'contact', id: '5', name: 'Fernanda Lima' } },
  { id: '6', type: 'task', title: 'Tarefa concluída', description: 'Revisão semanal do pipeline realizada.', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
];

const mockSalesData: SalesData[] = [
  { month: 'Jan', sales: 45000, revenue: 38000 },
  { month: 'Fev', sales: 52000, revenue: 44000 },
  { month: 'Mar', sales: 48000, revenue: 42000 },
  { month: 'Abr', sales: 61000, revenue: 55000 },
  { month: 'Mai', sales: 55000, revenue: 48000 },
  { month: 'Jun', sales: 67000, revenue: 60000 },
  { month: 'Jul', sales: 72000, revenue: 65000 },
  { month: 'Ago', sales: 69000, revenue: 62000 },
  { month: 'Set', sales: 78000, revenue: 70000 },
  { month: 'Out', sales: 85000, revenue: 76000 },
  { month: 'Nov', sales: 91000, revenue: 82000 },
  { month: 'Dez', sales: 98000, revenue: 89000 },
];

const currentUser: User = {
  id: '1',
  name: 'Pablo Execução',
  email: 'pablo@salesflow.com',
  role: 'Administrador',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pablo',
};

interface CRMState {
  currentView: ViewType;
  contacts: Contact[];
  deals: Deal[];
  tasks: Task[];
  activities: Activity[];
  salesData: SalesData[];
  currentUser: User;

  setCurrentView: (view: ViewType) => void;

  addContact: (contact: Omit<Contact, 'id' | 'createdAt'>) => void;
  updateContact: (id: string, contact: Partial<Contact>) => void;
  deleteContact: (id: string) => void;

  addDeal: (deal: Omit<Deal, 'id' | 'createdAt'>) => void;
  updateDeal: (id: string, deal: Partial<Deal>) => void;
  deleteDeal: (id: string) => void;

  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  addActivity: (activity: Omit<Activity, 'id'>) => void;
}

export const useCRMStore = create<CRMState>()(
  persist(
    (set) => ({
      currentView: 'dashboard',
      contacts: mockContacts,
      deals: mockDeals,
      tasks: mockTasks,
      activities: mockActivities,
      salesData: mockSalesData,
      currentUser,

      setCurrentView: (view) => set({ currentView: view }),

      addContact: (contact) =>
        set((state) => ({
          contacts: [
            ...state.contacts,
            { ...contact, id: Date.now().toString(), createdAt: new Date().toISOString() },
          ],
          activities: [
            { id: Date.now().toString(), type: 'note', title: 'Novo contato criado', description: `${contact.name} foi adicionado ao CRM.`, timestamp: new Date().toISOString() },
            ...state.activities,
          ],
        })),

      updateContact: (id, contact) =>
        set((state) => ({
          contacts: state.contacts.map((c) => (c.id === id ? { ...c, ...contact } : c)),
        })),

      deleteContact: (id) =>
        set((state) => ({
          contacts: state.contacts.filter((c) => c.id !== id),
        })),

      addDeal: (deal) =>
        set((state) => ({
          deals: [
            ...state.deals,
            { ...deal, id: Date.now().toString(), createdAt: new Date().toISOString() },
          ],
          activities: [
            { id: Date.now().toString(), type: 'deal', title: 'Nova oportunidade criada', description: `${deal.title} - R$ ${deal.value.toLocaleString('pt-BR')}`, timestamp: new Date().toISOString() },
            ...state.activities,
          ],
        })),

      updateDeal: (id, deal) =>
        set((state) => ({
          deals: state.deals.map((d) => (d.id === id ? { ...d, ...deal } : d)),
        })),

      deleteDeal: (id) =>
        set((state) => ({
          deals: state.deals.filter((d) => d.id !== id),
        })),

      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            { ...task, id: Date.now().toString(), createdAt: new Date().toISOString() },
          ],
          activities: [
            { id: Date.now().toString(), type: 'task', title: 'Nova tarefa criada', description: task.title, timestamp: new Date().toISOString() },
            ...state.activities,
          ],
        })),

      updateTask: (id, task) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...task } : t)),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),

      addActivity: (activity) =>
        set((state) => ({
          activities: [{ ...activity, id: Date.now().toString() }, ...state.activities],
        })),
    }),
    {
      name: 'crm-storage',
    }
  )
);

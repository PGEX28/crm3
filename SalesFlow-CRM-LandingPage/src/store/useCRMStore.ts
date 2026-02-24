import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  User, 
  Contact, 
  Deal, 
  Task, 
  Activity, 
  Transaction, 
  DashboardMetrics,
  SalesData,
  CustomerCategory,
  ViewType 
} from '@/types';

interface CRMState {
  // User
  currentUser: User;
  
  // Navigation
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  
  // Data
  contacts: Contact[];
  deals: Deal[];
  tasks: Task[];
  activities: Activity[];
  transactions: Transaction[];
  
  // Dashboard Data
  metrics: DashboardMetrics;
  salesData: SalesData[];
  customerCategories: CustomerCategory[];
  
  // Actions - Contacts
  addContact: (contact: Omit<Contact, 'id' | 'createdAt'>) => void;
  updateContact: (id: string, contact: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  
  // Actions - Deals
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt'>) => void;
  updateDeal: (id: string, deal: Partial<Deal>) => void;
  deleteDeal: (id: string) => void;
  moveDeal: (id: string, stage: Deal['stage']) => void;
  
  // Actions - Tasks
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  
  // Actions - Activities
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  
  // Search & Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const mockUser: User = {
  id: '1',
  name: 'Carlos Mendes',
  email: 'carlos@salesflow.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
  role: 'Administrador'
};

const mockContacts: Contact[] = [
  {
    id: 'c1',
    name: 'Ana Silva',
    email: 'ana.silva@techcorp.com',
    phone: '+55 11 98765-4321',
    company: 'TechCorp Brasil',
    position: 'Diretora de TI',
    status: 'customer',
    createdAt: '2024-01-15',
    lastContact: '2024-02-20',
    notes: 'Cliente estratégico. Interessada em novas soluções.',
    value: 45000
  },
  {
    id: 'c2',
    name: 'Roberto Santos',
    email: 'roberto@innovate.com',
    phone: '+55 11 91234-5678',
    company: 'Innovate Solutions',
    position: 'CEO',
    status: 'prospect',
    createdAt: '2024-02-01',
    lastContact: '2024-02-18',
    notes: 'Em negociação para projeto grande.',
    value: 120000
  },
  {
    id: 'c3',
    name: 'Mariana Costa',
    email: 'mariana@globalbiz.com',
    phone: '+55 21 99876-5432',
    company: 'Global Business',
    position: 'Gerente de Compras',
    status: 'lead',
    createdAt: '2024-02-10',
    lastContact: '2024-02-15',
    notes: 'Primeiro contato feito. Aguardando retorno.',
    value: 25000
  },
  {
    id: 'c4',
    name: 'Pedro Oliveira',
    email: 'pedro@startupbr.com',
    phone: '+55 11 94567-8901',
    company: 'Startup BR',
    position: 'CTO',
    status: 'customer',
    createdAt: '2023-12-05',
    lastContact: '2024-02-22',
    notes: 'Renovação de contrato em março.',
    value: 68000
  },
  {
    id: 'c5',
    name: 'Juliana Martins',
    email: 'juliana@enterprise.com',
    phone: '+55 31 98765-1234',
    company: 'Enterprise Co',
    position: 'Diretora Comercial',
    status: 'prospect',
    createdAt: '2024-02-05',
    lastContact: '2024-02-19',
    notes: 'Reunião agendada para próxima semana.',
    value: 95000
  }
];

const mockDeals: Deal[] = [
  {
    id: 'd1',
    title: 'Implementação ERP TechCorp',
    value: 45000,
    stage: 'negotiation',
    probability: 75,
    contactId: 'c1',
    contactName: 'Ana Silva',
    expectedCloseDate: '2024-03-15',
    createdAt: '2024-01-20',
    notes: 'Negociação avançada. Cliente solicitou desconto.'
  },
  {
    id: 'd2',
    title: 'Projeto de Transformação Digital',
    value: 120000,
    stage: 'proposal',
    probability: 50,
    contactId: 'c2',
    contactName: 'Roberto Santos',
    expectedCloseDate: '2024-04-01',
    createdAt: '2024-02-05',
    notes: 'Proposta enviada. Aguardando feedback.'
  },
  {
    id: 'd3',
    title: 'Licenciamento Software',
    value: 25000,
    stage: 'prospecting',
    probability: 25,
    contactId: 'c3',
    contactName: 'Mariana Costa',
    expectedCloseDate: '2024-03-30',
    createdAt: '2024-02-12',
    notes: 'Primeira reunião realizada.'
  },
  {
    id: 'd4',
    title: 'Renovação Anual',
    value: 68000,
    stage: 'closed-won',
    probability: 100,
    contactId: 'c4',
    contactName: 'Pedro Oliveira',
    expectedCloseDate: '2024-02-20',
    createdAt: '2024-01-01',
    notes: 'Contrato renovado por mais 12 meses.'
  },
  {
    id: 'd5',
    title: 'Consultoria Enterprise',
    value: 95000,
    stage: 'qualification',
    probability: 40,
    contactId: 'c5',
    contactName: 'Juliana Martins',
    expectedCloseDate: '2024-04-15',
    createdAt: '2024-02-08',
    notes: 'Qualificando necessidades.'
  }
];

const mockTasks: Task[] = [
  {
    id: 't1',
    title: 'Follow-up com Ana Silva',
    description: 'Enviar proposta atualizada com desconto',
    status: 'pending',
    priority: 'high',
    dueDate: '2024-02-25',
    assignedTo: '1',
    relatedTo: { type: 'contact', id: 'c1', name: 'Ana Silva' },
    createdAt: '2024-02-20'
  },
  {
    id: 't2',
    title: 'Preparar apresentação',
    description: 'Criar deck para reunião com Enterprise',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2024-02-24',
    assignedTo: '1',
    relatedTo: { type: 'contact', id: 'c5', name: 'Juliana Martins' },
    createdAt: '2024-02-19'
  },
  {
    id: 't3',
    title: 'Atualizar CRM',
    description: 'Registrar atividades da semana',
    status: 'pending',
    priority: 'medium',
    dueDate: '2024-02-23',
    assignedTo: '1',
    createdAt: '2024-02-21'
  },
  {
    id: 't4',
    title: 'Ligar para prospects',
    description: 'Lista de 10 leads para contato',
    status: 'completed',
    priority: 'medium',
    dueDate: '2024-02-20',
    assignedTo: '1',
    createdAt: '2024-02-18'
  }
];

const mockActivities: Activity[] = [
  {
    id: 'a1',
    type: 'deal',
    title: 'Negócio fechado',
    description: 'Renovação Anual com Pedro Oliveira',
    timestamp: '2024-02-20T14:30:00',
    userId: '1',
    userName: 'Carlos Mendes',
    relatedTo: { type: 'contact', id: 'c4', name: 'Pedro Oliveira' }
  },
  {
    id: 'a2',
    type: 'email',
    title: 'Email enviado',
    description: 'Proposta comercial para Roberto Santos',
    timestamp: '2024-02-19T10:15:00',
    userId: '1',
    userName: 'Carlos Mendes',
    relatedTo: { type: 'contact', id: 'c2', name: 'Roberto Santos' }
  },
  {
    id: 'a3',
    type: 'call',
    title: 'Ligação realizada',
    description: 'Discutiu requisitos com Mariana Costa',
    timestamp: '2024-02-18T16:45:00',
    userId: '1',
    userName: 'Carlos Mendes',
    relatedTo: { type: 'contact', id: 'c3', name: 'Mariana Costa' }
  },
  {
    id: 'a4',
    type: 'meeting',
    title: 'Reunião agendada',
    description: 'Apresentação de produtos para Juliana Martins',
    timestamp: '2024-02-17T09:00:00',
    userId: '1',
    userName: 'Carlos Mendes',
    relatedTo: { type: 'contact', id: 'c5', name: 'Juliana Martins' }
  }
];

const mockTransactions: Transaction[] = [
  { id: 'TRX-001', date: '2024-02-20', customer: 'Pedro Oliveira', location: 'São Paulo, SP', amount: 68000, status: 'completed' },
  { id: 'TRX-002', date: '2024-02-19', customer: 'Ana Silva', location: 'Rio de Janeiro, RJ', amount: 12500, status: 'completed' },
  { id: 'TRX-003', date: '2024-02-18', customer: 'Roberto Santos', location: 'Belo Horizonte, MG', amount: 35000, status: 'pending' },
  { id: 'TRX-004', date: '2024-02-17', customer: 'Mariana Costa', location: 'Curitiba, PR', amount: 8200, status: 'completed' },
  { id: 'TRX-005', date: '2024-02-16', customer: 'Juliana Martins', location: 'São Paulo, SP', amount: 15000, status: 'cancelled' },
  { id: 'TRX-006', date: '2024-02-15', customer: 'Fernando Lima', location: 'Porto Alegre, RS', amount: 22000, status: 'completed' },
];

const mockMetrics: DashboardMetrics = {
  totalSales: 56234,
  salesGrowth: 12,
  totalCustomers: 1234,
  customersGrowth: 5,
  totalProducts: 567,
  productsGrowth: -2,
  totalRevenue: 89012,
  revenueGrowth: 8
};

const mockSalesData: SalesData[] = [
  { month: 'Jan', sales: 45000, revenue: 38000 },
  { month: 'Fev', sales: 52000, revenue: 45000 },
  { month: 'Mar', sales: 48000, revenue: 42000 },
  { month: 'Abr', sales: 61000, revenue: 54000 },
  { month: 'Mai', sales: 55000, revenue: 48000 },
  { month: 'Jun', sales: 67000, revenue: 59000 },
  { month: 'Jul', sales: 71000, revenue: 62000 },
  { month: 'Ago', sales: 58000, revenue: 51000 },
  { month: 'Set', sales: 63000, revenue: 56000 },
  { month: 'Out', sales: 69000, revenue: 61000 },
  { month: 'Nov', sales: 74000, revenue: 65000 },
  { month: 'Dez', sales: 78000, revenue: 69000 },
];

const mockCustomerCategories: CustomerCategory[] = [
  { name: 'Novos', value: 35, color: '#1F74FF' },
  { name: 'Fixos', value: 45, color: '#00C853' },
  { name: 'Sazonais', value: 20, color: '#FFA726' },
];

export const useCRMStore = create<CRMState>()(
  persist(
    (set) => ({
      // Initial State
      currentUser: mockUser,
      currentView: 'dashboard',
      contacts: mockContacts,
      deals: mockDeals,
      tasks: mockTasks,
      activities: mockActivities,
      transactions: mockTransactions,
      metrics: mockMetrics,
      salesData: mockSalesData,
      customerCategories: mockCustomerCategories,
      searchQuery: '',

      // Actions
      setCurrentView: (view) => set({ currentView: view }),
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Contact Actions
      addContact: (contact) => {
        const newContact: Contact = {
          ...contact,
          id: `c${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0]
        };
        set((state) => ({ contacts: [...state.contacts, newContact] }));
      },

      updateContact: (id, contact) => {
        set((state) => ({
          contacts: state.contacts.map((c) =>
            c.id === id ? { ...c, ...contact } : c
          )
        }));
      },

      deleteContact: (id) => {
        set((state) => ({
          contacts: state.contacts.filter((c) => c.id !== id)
        }));
      },

      // Deal Actions
      addDeal: (deal) => {
        const newDeal: Deal = {
          ...deal,
          id: `d${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0]
        };
        set((state) => ({ deals: [...state.deals, newDeal] }));
      },

      updateDeal: (id, deal) => {
        set((state) => ({
          deals: state.deals.map((d) =>
            d.id === id ? { ...d, ...deal } : d
          )
        }));
      },

      deleteDeal: (id) => {
        set((state) => ({
          deals: state.deals.filter((d) => d.id !== id)
        }));
      },

      moveDeal: (id, stage) => {
        set((state) => ({
          deals: state.deals.map((d) =>
            d.id === id ? { ...d, stage } : d
          )
        }));
      },

      // Task Actions
      addTask: (task) => {
        const newTask: Task = {
          ...task,
          id: `t${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0]
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },

      updateTask: (id, task) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...task } : t
          )
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id)
        }));
      },

      toggleTaskStatus: (id) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' }
              : t
          )
        }));
      },

      // Activity Actions
      addActivity: (activity) => {
        const newActivity: Activity = {
          ...activity,
          id: `a${Date.now()}`,
          timestamp: new Date().toISOString()
        };
        set((state) => ({
          activities: [newActivity, ...state.activities]
        }));
      }
    }),
    {
      name: 'crm-storage',
      partialize: (state) => ({
        contacts: state.contacts,
        deals: state.deals,
        tasks: state.tasks,
        activities: state.activities
      })
    }
  )
);

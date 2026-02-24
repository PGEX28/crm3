export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  status: 'lead' | 'prospect' | 'customer' | 'inactive';
  avatar?: string;
  createdAt: string;
  lastContact: string;
  notes: string;
  value: number;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  contactId: string;
  contactName: string;
  expectedCloseDate: string;
  createdAt: string;
  notes: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignedTo: string;
  relatedTo?: {
    type: 'contact' | 'deal';
    id: string;
    name: string;
  };
  createdAt: string;
}

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task' | 'deal';
  title: string;
  description: string;
  timestamp: string;
  userId: string;
  userName: string;
  relatedTo?: {
    type: 'contact' | 'deal';
    id: string;
    name: string;
  };
}

export interface Transaction {
  id: string;
  date: string;
  customer: string;
  location: string;
  amount: number;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface DashboardMetrics {
  totalSales: number;
  salesGrowth: number;
  totalCustomers: number;
  customersGrowth: number;
  totalProducts: number;
  productsGrowth: number;
  totalRevenue: number;
  revenueGrowth: number;
}

export interface SalesData {
  month: string;
  sales: number;
  revenue: number;
}

export interface CustomerCategory {
  name: string;
  value: number;
  color: string;
}

export type ViewType = 'dashboard' | 'contacts' | 'pipeline' | 'deals' | 'tasks' | 'analytics' | 'settings';

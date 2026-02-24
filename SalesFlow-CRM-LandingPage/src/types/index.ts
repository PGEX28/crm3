export type ViewType = 'dashboard' | 'contacts' | 'pipeline' | 'deals' | 'tasks' | 'analytics' | 'settings';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  status: 'lead' | 'prospect' | 'customer' | 'inactive';
  value: number;
  notes: string;
  lastContact: string;
  createdAt: string;
  avatar?: string;
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
  notes: string;
  createdAt: string;
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
  relatedTo?: {
    type: 'contact' | 'deal';
    id: string;
    name: string;
  };
}

export interface SalesData {
  month: string;
  sales: number;
  revenue: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

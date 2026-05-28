export type LeadStatus = 'New' | 'Contacted' | 'Proposal Sent' | 'Negotiation' | 'Converted';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  dealSize: number;
  assignedTo: string; // Team member ID
  status: LeadStatus;
  nextFollowUp: string; // YYYY-MM-DD
  notes: string[];
  logoColor: string; // Tailwind bg color class
}

export type ClientStatus = 'Active' | 'Onboarding' | 'Paused' | 'Suspended';

export interface Deliverable {
  id: string;
  name: string;
  status: 'In Progress' | 'On Track' | 'At Risk' | 'Completed' | 'Delayed';
  dueDate: string;
  progress: number; // 0 to 100
}

export interface Invoice {
  id: string;
  amount: number;
  status: 'Paid' | 'Sent' | 'Overdue' | 'Draft';
  dueDate: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  contractValue: number;
  status: ClientStatus;
  website: string;
  avatarText: string;
  bgColor: string;
  notes: {
    id: string;
    text: string;
    date: string;
    author: string;
    isPinned?: boolean;
  }[];
  deliverables: Deliverable[];
  invoices: Invoice[];
  projectHealth: 'Excellent' | 'Good' | 'At Risk' | 'Critical';
}

export type TaskStatus = 'To Do' | 'In Progress' | 'Waiting' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo: string; // Team member ID
  dueDate: string; // YYYY-MM-DD
  clientName?: string;
  createdDate: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  duration: string; // e.g. "45m", "1h"
  type: 'Meeting' | 'Follow-up' | 'Call' | 'Project Deadline';
  clientName?: string;
  assignedTo: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  activeClients: number;
  completedTasks: number;
  rating: number; // e.g., Conversion or Satisfaction score
  status: 'online' | 'offline' | 'busy';
  workload: number; // Percentage
}

export interface ActivityLog {
  id: string;
  type: 'call' | 'meeting' | 'task' | 'lead' | 'email';
  title: string;
  timestamp: string; // e.g., "10m ago", "2h ago"
  description: string;
  user: string;
}

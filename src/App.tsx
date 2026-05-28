import React, { useState, useEffect, useMemo } from 'react';
import { 
  Bell, 
  Search, 
  Settings2, 
  Plus, 
  Sparkles, 
  FolderSync, 
  Users2, 
  Workflow, 
  FileCode,
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronDown,
  Info,
  X,
  PlaySquare,
  Command,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

// Imports types and datasets
import { Lead, Client, Task, CalendarEvent, TeamMember, ActivityLog } from './types';
import { 
  INITIAL_TEAM, 
  INITIAL_LEADS, 
  INITIAL_CLIENTS, 
  INITIAL_TASKS, 
  INITIAL_EVENTS, 
  INITIAL_ACTIVITIES 
} from './data';

// Component Screens
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import LeadsScreen from './components/LeadsScreen';
import ClientsScreen from './components/ClientsScreen';
import TasksScreen from './components/TasksScreen';
import CalendarView from './components/CalendarView';
import AnalyticsScreen from './components/AnalyticsScreen';
import TeamScreen from './components/TeamScreen';

export default function App() {
  // Navigation & UI States
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  
  // Notification toggle state
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  // Quick Search Dialog
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [paletteQuery, setPaletteQuery] = useState<string>('');
  
  // Custom redirect helper from Kanban converted button to Client Profile tab
  const [clientSearchPref, setClientSearchPref] = useState<string | null>(null);

  // Core Stateful Datasets with LocalStorage fallback
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('nf_crm_team');
    return saved ? JSON.parse(saved) : INITIAL_TEAM;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('nf_crm_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('nf_crm_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('nf_crm_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('nf_crm_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('nf_crm_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  // Selected lead id focuses in Leads screen details sidebar
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  // Quick Inline creation states for Global topbar task Modal
  const [isQuickTaskOpen, setIsQuickTaskOpen] = useState<boolean>(false);
  const [qtTitle, setQtTitle] = useState('');
  const [qtPriority, setQtPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [qtDate, setQtDate] = useState('2026-06-03');
  const [qtAssignee, setQtAssignee] = useState('team-1');
  const [qtClient, setQtClient] = useState('');

  // Persists states in localStorage
  useEffect(() => {
    localStorage.setItem('nf_crm_team', JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem('nf_crm_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('nf_crm_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('nf_crm_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('nf_crm_events', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    localStorage.setItem('nf_crm_activities', JSON.stringify(activities));
  }, [activities]);

  // Activity logger helper
  const handleAddNewActivityLog = (activity: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newLog: ActivityLog = {
      ...activity,
      id: `act-gen-${Date.now()}`,
      timestamp: 'Just now'
    };
    setActivities(prev => [newLog, ...prev.slice(0, 18)]);
  };

  // --- LEADS DIRECTORY ACTIONS ---
  const handleUpdateLeadStatus = (leadId: string, newStatus: Lead['status']) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => {
        if (lead.id === leadId) {
          // If status converted, automatically onboard as client if they don't already exist
          if (newStatus === 'Converted') {
            const clientMatch = clients.find(c => c.company.toLowerCase() === lead.company.toLowerCase());
            if (!clientMatch) {
              const newClient: Client = {
                id: `client-${Date.now()}`,
                name: lead.name,
                company: lead.company,
                email: lead.email,
                phone: lead.phone,
                contractValue: lead.dealSize * 3, // annual contract estimated
                status: 'Active',
                website: `https://${lead.company.toLowerCase().replace(/\s+/g, '')}.com`,
                avatarText: lead.company.slice(0, 2).toUpperCase(),
                bgColor: 'bg-indigo-650',
                projectHealth: 'Good',
                notes: [
                  {
                    id: `note-conv-${Date.now()}`,
                    text: `Onboarded from NovaFlow Prospect logs! Closed initial deal at $${lead.dealSize.toLocaleString()}.`,
                    date: '2026-05-28',
                    author: 'Sales Manager'
                  }
                ],
                deliverables: [
                  { id: `del-init-${Date.now()}`, name: 'Initiate Client Discovery onboarding', status: 'In Progress', dueDate: '2026-06-15', progress: 10 }
                ],
                invoices: [
                  { id: `inv-init-${Date.now()}`, amount: lead.dealSize, status: 'Sent', dueDate: '2026-06-10' }
                ]
              };
              setClients(prevClients => [newClient, ...prevClients]);
              handleAddNewActivityLog({
                type: 'lead',
                title: 'Client Auto-Onboarded',
                description: `Successfully converted ${lead.company} from prospect pipeline. Created active CRM profile!`,
                user: 'Sarah Jenkins'
              });
            }
          }
          return { ...lead, status: newStatus };
        }
        return lead;
      })
    );
  };

  const handleAddLead = (leadBlob: Omit<Lead, 'id'>) => {
    const newLead: Lead = {
      ...leadBlob,
      id: `lead-gen-${Date.now()}`
    };
    setLeads(prev => [newLead, ...prev]);
    handleAddNewActivityLog({
      type: 'lead',
      title: 'New Opportunity Created',
      description: `Discovered contact client ${newLead.name} from company ${newLead.company}. Estimated ARR deal: $${newLead.dealSize.toLocaleString()}.`,
      user: 'Sarah Jenkins'
    });
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
  };

  const handleDeleteLeads = (ids: string[]) => {
    setLeads(prev => prev.filter(l => !ids.includes(l.id)));
    handleAddNewActivityLog({
      type: 'lead',
      title: 'Opportunites Removed',
      description: `Cleaned up and deregistered ${ids.length} leads in custom bulk sequence.`,
      user: 'Alex Rivera'
    });
  };

  // --- CLIENTS WORKSPACE LIST ACTIONS ---
  const handleUpdateClient = (updatedClient: Client) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  };

  const handleAddClient = (clientBlob: Omit<Client, 'id'>) => {
    const newClient: Client = {
      ...clientBlob,
      id: `client-gen-${Date.now()}`
    };
    setClients(prev => [newClient, ...prev]);
    handleAddNewActivityLog({
      type: 'task',
      title: 'New Client Registered',
      description: `Formally onboarded ${newClient.company} to Digital Production suite. ARR sizing logged as $${newClient.contractValue.toLocaleString()}.`,
      user: 'Alex Rivera'
    });
  };

  // --- CHECKS TASK ACTIONS ---
  const handleAddTask = (taskBlob: Omit<Task, 'id' | 'createdDate'>) => {
    const newTask: Task = {
      ...taskBlob,
      id: `task-gen-${Date.now()}`,
      createdDate: '2026-05-28'
    };
    setTasks(prev => [newTask, ...prev]);
    handleAddNewActivityLog({
      type: 'task',
      title: 'Internal Checklist Added',
      description: `Task: "[${newTask.title}]" assigned to rep. Due: ${newTask.dueDate}.`,
      user: 'NovaFlow CRM'
    });
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    
    // Log complete alerts
    if (updatedTask.status === 'Completed') {
      handleAddNewActivityLog({
        type: 'task',
        title: 'Task Checked Complete',
        description: `Coordination task finalized: "${updatedTask.title}".`,
        user: 'Alex Rivera'
      });
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // --- CALENDAR MEET ACTIONS ---
  const handleAddEvent = (eventBlob: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventBlob,
      id: `event-gen-${Date.now()}`
    };
    setCalendarEvents(prev => [...prev, newEvent]);
    handleAddNewActivityLog({
      type: 'meeting',
      title: 'Calendar Appointment Scheduled',
      description: `Booked "${newEvent.title}" meeting slot for date ${newEvent.date} at ${newEvent.startTime}.`,
      user: 'Sarah Jenkins'
    });
  };

  // --- TEAM STATUS ACTIONS ---
  const handleUpdateTeamMember = (updatedMember: TeamMember) => {
    setTeamMembers(prev => prev.map(t => t.id === updatedMember.id ? updatedMember : t));
  };

  // Top level command palette jump triggers
  const handleSelectClientRedirect = (companyName: string) => {
    setClientSearchPref(companyName);
    setCurrentTab('clients');
  };

  const handleSelectLeadRedirect = (lead: Lead) => {
    setSelectedLeadId(lead.id);
    setCurrentTab('leads');
  };

  // Topbar navbar quick task submit
  const handleGlobalQuickTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qtTitle.trim()) return;

    handleAddTask({
      title: qtTitle,
      priority: qtPriority,
      status: 'To Do',
      assignedTo: qtAssignee,
      dueDate: qtDate,
      clientName: qtClient || undefined
    });

    setQtTitle('');
    setQtClient('');
    setIsQuickTaskOpen(false);
  };

  // Quick helper: resets demo database to defaults
  const handleResetDemoSeed = () => {
    if (confirm("Restore Pipedrive/HubSpot style default presets for training simulation? Any custom edits will clear.")) {
      localStorage.removeItem('nf_crm_team');
      localStorage.removeItem('nf_crm_leads');
      localStorage.removeItem('nf_crm_clients');
      localStorage.removeItem('nf_crm_tasks');
      localStorage.removeItem('nf_crm_events');
      localStorage.removeItem('nf_crm_activities');
      window.location.reload();
    }
  };

  // Command palette search results filtering
  const filteredPaletteResults = useMemo(() => {
    if (!paletteQuery.trim()) return [];
    const q = paletteQuery.toLowerCase();
    
    const matchedLeads = leads.filter(l => l.company.toLowerCase().includes(q) || l.name.toLowerCase().includes(q));
    const matchedClients = clients.filter(c => c.company.toLowerCase().includes(q) || c.name.toLowerCase().includes(q));
    const matchedTasks = tasks.filter(t => t.title.toLowerCase().includes(q));

    return [
      ...matchedLeads.map(l => ({ type: 'Lead Prospect', label: `${l.company} (${l.name})`, action: () => handleSelectLeadRedirect(l) })),
      ...matchedClients.map(c => ({ type: 'Client Workspace', label: `${c.company} — $${c.contractValue.toLocaleString()}`, action: () => handleSelectClientRedirect(c.company) })),
      ...matchedTasks.map(t => ({ type: 'Operational Task', label: t.title, action: () => { setCurrentTab('tasks'); } }))
    ].slice(0, 5);
  }, [paletteQuery, leads, clients, tasks]);

  // System alerts highlights
  const systemAlertsCount = useMemo(() => {
    const overdueTasks = tasks.filter(t => t.status !== 'Completed' && t.dueDate < '2026-05-28').length;
    const pendingLeads = leads.filter(l => l.status === 'New').length;
    return overdueTasks + pendingLeads;
  }, [tasks, leads]);

  return (
    <div id="saas-system-viewport" className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Upper critical alert bar warning */}
      <div className="bg-slate-900 border-b border-slate-850 px-4 py-2 text-white flex items-center justify-between text-xs font-semibold gap-3 shrink-0 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="bg-blue-600 text-white font-bold px-2 py-0.5 rounded text-[10px] font-mono shadow-xs">CRM CORE v1.4</span>
          <p className="font-medium text-slate-300">
            NovaFlow agency sandbox workspace running live. Database synchronized securely.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            id="workspace-reset-db-btn"
            onClick={handleResetDemoSeed}
            className="text-[10.5px] text-slate-400 hover:text-white transition flex items-center gap-1.5 underline cursor-pointer"
          >
            <FolderSync className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      <div id="workspace-main-structure" className="flex-1 flex flex-row min-h-0 relative">
        
        {/* Core Sidebar navigation panel */}
        <Sidebar 
          currentTab={currentTab} 
          setCurrentTab={(tab) => { setCurrentTab(tab); window.scrollTo({ top: 0, behavior: 'instant' }); }} 
          collapsed={sidebarCollapsed} 
          setCollapsed={setSidebarCollapsed}
          onOpenQuickAction={() => setIsQuickTaskOpen(true)}
        />

        {/* Workspace body viewport */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50/80">
          
          {/* Top Navbar details */}
          <header id="topbar-navbar" className="bg-white border-b border-slate-200/80 h-16 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
            
            {/* Command Palette trigger */}
            <div id="topbar-left-search" className="flex items-center gap-4 flex-1 max-w-md">
              <div 
                onClick={() => { setIsCommandPaletteOpen(true); setTimeout(() => document.getElementById('palette-input-field')?.focus(), 155); }}
                className="w-full bg-slate-50 border border-slate-200 p-2 px-3 rounded-lg flex items-center justify-between text-slate-400 text-xs cursor-pointer hover:border-blue-400 transition"
                title="Click or lookup pipeline, accounts, or checklists..."
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-slate-400" />
                  <span className="font-medium select-none">Search pipeline, clients, tasks...</span>
                </div>
                <span className="text-[10px] font-mono font-extrabold bg-slate-200/60 p-0.5 px-1.5 rounded text-slate-500">⌘K</span>
              </div>
            </div>

            {/* Account indicators block */}
            <div id="topbar-right-controls" className="flex items-center gap-3">
              
              {/* Alert Bell dropdown toggle */}
              <div className="relative">
                <button
                  id="notifications-bell-btn"
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-600 transition relative cursor-pointer"
                  title="System alerts notifications"
                >
                  <Bell className="w-4 h-4" />
                  {systemAlertsCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full bg-rose-600 text-white font-mono font-black text-[9px] flex items-center justify-center border border-white animate-pulse">
                      {systemAlertsCount}
                    </span>
                  )}
                </button>

                {/* Notifications dropdown layout */}
                {isNotifOpen && (
                  <div id="topbar-notif-dropdown" className="absolute right-0 mt-2.5 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-4 space-y-3 p-3.5 animate-slide-in">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-800">Operational Reminders</span>
                      <button onClick={() => setIsNotifOpen(false)} className="text-[10px] text-blue-600 hover:text-blue-800 font-bold underline">Close</button>
                    </div>

                    <div className="space-y-2 max-h-[220px] overflow-y-auto">
                      {tasks.filter(t => t.status !== 'Completed' && t.dueDate < '2026-05-28').map(t => (
                        <div key={t.id} className="p-2 border border-rose-100 bg-rose-50/25 rounded-lg text-[11px] text-slate-700 leading-normal">
                          <p className="font-bold text-slate-900">Overdue Project Task</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">"{t.title}" overdue since {t.dueDate}.</p>
                        </div>
                      ))}

                      {leads.filter(l => l.status === 'New').map(l => (
                        <div key={l.id} className="p-2 border border-blue-105 bg-blue-50/20 rounded-lg text-[11px] text-slate-700 leading-normal">
                          <p className="font-bold text-blue-900">Unassigned Lead Inbound</p>
                          <p className="text-[10px] text-slate-600 mt-0.5">{l.company} awaits discovery follow-up connection.</p>
                        </div>
                      ))}
                      
                      {tasks.filter(t => t.status !== 'Completed' && t.dueDate < '2026-05-28').length === 0 && leads.filter(l => l.status === 'New').length === 0 && (
                        <p className="text-xs text-slate-400 italic text-center py-4">No active warnings or bottlenecks!</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* CRM Agency Scope detail */}
              <div id="workspace-logo-capsule" className="items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 px-3 rounded-xl hidden sm:flex select-none">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" title="API Status: Connected"></span>
                <span className="text-xs font-bold text-slate-700">NovaFlow Digital CRM</span>
              </div>

              {/* Developer contact email quick reference card */}
              <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 text-blue-900 font-extrabold flex items-center justify-center text-[10px]" title="Administrator Alex Rivera">
                AR
              </div>

            </div>

          </header>

          {/* Core main viewing canvas area */}
          <main id="main-content-viewport" className="p-6 overflow-y-auto flex-1 pb-16">
            
            {/* View Switching Tab router */}
            {currentTab === 'dashboard' && (
              <DashboardOverview
                leads={leads}
                clientsCount={clients.length}
                tasks={tasks}
                recentActivities={activities}
                upcomingEvents={calendarEvents}
                teamMembers={teamMembers}
                onUpdateLeadStatus={handleUpdateLeadStatus}
                onSelectLead={handleSelectLeadRedirect}
                onSelectClientByCompany={handleSelectClientRedirect}
                onAddNewLeadQuick={() => setCurrentTab('leads')}
                onAddActivity={(act) => setActivities(prev => [{ ...act, id: `act-${Date.now()}`, timestamp: 'Just now' }, ...prev])}
              />
            )}

            {currentTab === 'leads' && (
              <LeadsScreen
                leads={leads}
                teamMembers={teamMembers}
                onAddLead={handleAddLead}
                onUpdateLead={handleUpdateLead}
                onDeleteLeads={handleDeleteLeads}
                selectedLeadId={selectedLeadId}
                setSelectedLeadId={setSelectedLeadId}
              />
            )}

            {currentTab === 'clients' && (
              <ClientsScreen
                clients={clients}
                onUpdateClient={handleUpdateClient}
                onAddClient={handleAddClient}
                selectedCompanyPref={clientSearchPref}
                onClearPref={() => setClientSearchPref(null)}
              />
            )}

            {currentTab === 'tasks' && (
              <TasksScreen
                tasks={tasks}
                teamMembers={teamMembers}
                onAddTask={handleAddTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
              />
            )}

            {currentTab === 'calendar' && (
              <CalendarView
                events={calendarEvents}
                teamMembers={teamMembers}
                onAddEvent={handleAddEvent}
              />
            )}

            {currentTab === 'analytics' && (
              <AnalyticsScreen
                leads={leads}
                clients={clients}
                teamMembers={teamMembers}
              />
            )}

            {currentTab === 'team' && (
              <TeamScreen
                teamMembers={teamMembers}
                onUpdateTeamMember={handleUpdateTeamMember}
              />
            )}

          </main>

        </div>

      </div>

      {/* 3. Global Quick Creator Task Modal (Triggered by bottom Sidebar Plus button) */}
      {isQuickTaskOpen && (
        <div id="global-quick-task-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 px-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full p-6 shadow-xl space-y-4 animate-scale-up">
            
            <div className="flex items-center justify-between pb-3 border-b border-rose-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <h3 className="text-sm font-bold text-slate-900">Global Operational Task Creator</h3>
              </div>
              <button 
                id="close-global-task-modal-btn"
                onClick={() => setIsQuickTaskOpen(false)}
                className="text-slate-400 hover:text-slate-650 hover:bg-slate-100 p-1 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGlobalQuickTaskSubmit} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Task Title Description *</label>
                <input 
                  id="global-qt-title"
                  type="text" 
                  required
                  placeholder="e.g. Schedule audit review with Alpha Retail"
                  value={qtTitle}
                  onChange={(e) => setQtTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Client Account Association</label>
                <input 
                  id="global-qt-client"
                  type="text" 
                  placeholder="e.g. Alpha Retail Group (Optional)"
                  value={qtClient}
                  onChange={(e) => setQtClient(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Urgency Priority</label>
                  <select
                    id="global-qt-priority"
                    value={qtPriority}
                    onChange={(e) => setQtPriority(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 focus:bg-white cursor-pointer"
                  >
                    <option value="High">🔴 High Priority</option>
                    <option value="Medium">🟡 Medium Priority</option>
                    <option value="Low">🟢 Low Priority</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Assigned Rep</label>
                  <select
                    id="global-qt-assignee"
                    value={qtAssignee}
                    onChange={(e) => setQtAssignee(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 focus:bg-white cursor-pointer"
                  >
                    {teamMembers.map(m => (
                      <option key={m.id} value={m.id}>{m.name.split(' ')[0]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Target Deadline</label>
                <input 
                  id="global-qt-date"
                  type="date" 
                  value={qtDate}
                  onChange={(e) => setQtDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
                  required
                />
              </div>

              <button
                id="global-qt-submit-btn"
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-2.5 rounded-lg transition-all shadow-xs"
              >
                Create Operational Task
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. Help Command Palette Dialog overlay */}
      {isCommandPaletteOpen && (
        <div id="command-palette-overlay" className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 px-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-300 max-w-md w-full p-5 shadow-2xl space-y-3.5 animate-scale-up">
            
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Command className="w-5 h-5 text-blue-600 animate-pulse" />
              <input 
                id="palette-input-field"
                type="text" 
                placeholder="Search anything anywhere..." 
                value={paletteQuery}
                onChange={(e) => setPaletteQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm focus:outline-none text-slate-800 placeholder-slate-400 font-bold"
              />
              <button 
                id="close-palette-btn"
                onClick={() => { setIsCommandPaletteOpen(false); setPaletteQuery(''); }}
                className="text-slate-400 hover:text-slate-600 font-bold hover:bg-slate-100 p-1 rounded"
              >
                ESC
              </button>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="space-y-2">
              <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Recommended actions</p>
              
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                
                <button
                  id="palette-action-dashboard"
                  onClick={() => { setCurrentTab('dashboard'); setIsCommandPaletteOpen(false); }}
                  className="flex items-center gap-2 bg-slate-50 hover:bg-blue-50 p-2 rounded-lg border text-slate-700 hover:text-blue-800 transition"
                >
                  <Workflow className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="font-medium text-[11px]">Go to Kanban</span>
                </button>

                <button
                  id="palette-action-calendar"
                  onClick={() => { setCurrentTab('calendar'); setIsCommandPaletteOpen(false); }}
                  className="flex items-center gap-2 bg-slate-50 hover:bg-blue-50 p-2 rounded-lg border text-slate-700 hover:text-blue-800 transition"
                >
                  <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-medium text-[11px]">Go to Scheduler</span>
                </button>

                <button
                  id="palette-action-analytics"
                  onClick={() => { setCurrentTab('analytics'); setIsCommandPaletteOpen(false); }}
                  className="flex items-center gap-2 bg-slate-50 hover:bg-blue-50 p-2 rounded-lg border text-slate-700 hover:text-blue-800 transition"
                >
                  <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span className="font-medium text-[11px]">Reporting Overview</span>
                </button>

                <button
                  id="palette-action-reset"
                  onClick={() => { setIsCommandPaletteOpen(false); handleResetDemoSeed(); }}
                  className="flex items-center gap-2 bg-slate-50 hover:bg-rose-50 p-2 rounded-lg border text-slate-700 hover:text-rose-800 transition"
                >
                  <FolderSync className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="font-medium text-[11px]">Seed default DB</span>
                </button>

              </div>
            </div>

            {/* Dynamic Results */}
            {paletteQuery.trim() !== '' && (
              <div className="space-y-1 bg-slate-50/50 p-2 border border-slate-200 rounded-xl">
                <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest px-2 mb-1.5">Matched results ({filteredPaletteResults.length})</p>
                {filteredPaletteResults.map((res, i) => (
                  <div
                    id={`palette-result-item-${i}`}
                    key={i}
                    onClick={() => { res.action(); setIsCommandPaletteOpen(false); setPaletteQuery(''); }}
                    className="p-2 transition rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer flex justify-between text-xs"
                  >
                    <span className="font-bold">{res.label}</span>
                    <span className="text-[10px] font-mono opacity-80 uppercase font-black">{res.type}</span>
                  </div>
                ))}
                {filteredPaletteResults.length === 0 && (
                  <p className="text-xs text-slate-400 italic text-center py-2">No matching prospect contacts or active accounts.</p>
                )}
              </div>
            )}

            <div className="flex items-center gap-1.5 p-2 bg-slate-50 text-[10px] text-slate-400 rounded-xl leading-normal">
              <Lightbulb className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Looking for account profiles? Type matching client names like "Alpha" or contact persons.</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

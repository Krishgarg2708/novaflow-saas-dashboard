import React, { useState } from 'react';
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  ArrowRight, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  FileCheck2,
  PhoneCall,
  User,
  Plus,
  Compass,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Lead, Task, ActivityLog, CalendarEvent, TeamMember } from '../types';

interface DashboardOverviewProps {
  leads: Lead[];
  clientsCount: number;
  tasks: Task[];
  recentActivities: ActivityLog[];
  upcomingEvents: CalendarEvent[];
  teamMembers: TeamMember[];
  onUpdateLeadStatus: (leadId: string, newStatus: Lead['status']) => void;
  onSelectLead: (lead: Lead) => void;
  onSelectClientByCompany: (companyName: string) => void;
  onAddNewLeadQuick: () => void;
  onAddActivity: (activity: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
}

export default function DashboardOverview({
  leads,
  clientsCount,
  tasks,
  recentActivities,
  upcomingEvents,
  teamMembers,
  onUpdateLeadStatus,
  onSelectLead,
  onSelectClientByCompany,
  onAddNewLeadQuick,
  onAddActivity
}: DashboardOverviewProps) {
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);

  // Total Deal Pipeline value
  const totalPipelineValue = leads
    .filter(l => l.status !== 'Converted')
    .reduce((sum, lead) => sum + lead.dealSize, 0);

  // Pending tasks count
  const pendingTasksCount = tasks.filter(t => t.status !== 'Completed').length;

  const kpis = [
    {
      id: "kpi-leads",
      label: "Active Prospects / Leads",
      value: leads.filter(l => l.status !== 'Converted').length.toString(),
      trend: "+12.4% vs last mo",
      trendType: "up",
      icon: Users,
      color: "text-blue-600 bg-blue-50 border-blue-100"
    },
    {
      id: "kpi-clients",
      label: "Active Agency Clients",
      value: clientsCount.toString(),
      trend: "+2 onboarding",
      trendType: "neutral",
      icon: Briefcase,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100"
    },
    {
      id: "kpi-revenue",
      label: "Lead Pipeline Value",
      value: `$${totalPipelineValue.toLocaleString()}`,
      trend: "+$32k this week",
      trendType: "up",
      icon: DollarSign,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100"
    },
    {
      id: "kpi-tasks",
      label: "Internal Pending Tasks",
      value: pendingTasksCount.toString(),
      trend: "4 high priority",
      trendType: "down", // high pending task is warning
      icon: FileCheck2,
      color: "text-amber-600 bg-amber-50 border-amber-100"
    }
  ];

  const pipelineStages: { id: Lead['status']; title: string; color: string }[] = [
    { id: 'New', title: 'New Leads', color: 'bg-slate-100 text-slate-800 border-slate-200' },
    { id: 'Contacted', title: 'Contacted', color: 'bg-blue-50 text-blue-800 border-blue-200' },
    { id: 'Proposal Sent', title: 'Proposal Sent', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { id: 'Negotiation', title: 'Negotiation', color: 'bg-purple-50 text-purple-800 border-purple-200' },
    { id: 'Converted', title: 'Converted', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' }
  ];

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedLeadId(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: Lead['status']) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedLeadId;
    if (id) {
      onUpdateLeadStatus(id, status);
      
      // Log an activity log for stage advancement
      const lead = leads.find(l => l.id === id);
      if (lead && lead.status !== status) {
        onAddActivity({
          type: 'lead',
          title: `Lead Phase Advanced`,
          description: `Moved ${lead.company} to [${status}] stage via Interactive Pipeline.`,
          user: 'Alex Rivera'
        });
      }
    }
    setDraggedLeadId(null);
  };

  const handleMoveStage = (leadId: string, currentStatus: Lead['status']) => {
    const list: Lead['status'][] = ['New', 'Contacted', 'Proposal Sent', 'Negotiation', 'Converted'];
    const currentIndex = list.indexOf(currentStatus);
    if (currentIndex < list.length - 1) {
      const nextStatus = list[currentIndex + 1];
      onUpdateLeadStatus(leadId, nextStatus);

      const lead = leads.find(l => l.id === leadId);
      if (lead) {
        onAddActivity({
          type: 'lead',
          title: `Lead Advanced`,
          description: `Updated status of ${lead.company} from ${currentStatus} to ${nextStatus}.`,
          user: 'Alex Rivera'
        });
      }
    }
  };

  return (
    <div id="dashboard-overview-root" className="space-y-6">
      
      {/* Welcome Header */}
      <div id="dashboard-welcome-banner" className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">NovaFlow Workspace Overview</h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, <strong className="font-semibold text-slate-800">Alex</strong>. Your 5-member team currently manages 5 active agency accounts and {leads.filter(l => l.status !== 'Converted').length} active prospects.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            id="quick-add-lead-btn"
            onClick={onAddNewLeadQuick}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs py-2 px-3.5 rounded-lg shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Prospect</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Block */}
      <div id="dashboard-kpi-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div 
              id={`kpi-${kpi.id}`}
              key={kpi.id} 
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between"
            >
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{kpi.label}</p>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{kpi.value}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <TrendingUp className={`w-3 h-3 ${kpi.trendType === 'down' ? 'text-amber-500 rotate-180' : 'text-emerald-500'}`} />
                  <span className={`text-[11px] font-medium ${
                    kpi.trendType === 'down' 
                      ? 'text-amber-600' 
                      : kpi.trendType === 'neutral' 
                        ? 'text-slate-500' 
                        : 'text-emerald-600'
                  }`}>
                    {kpi.trend}
                  </span>
                </div>
              </div>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${kpi.color}`}>
                <Icon className="w-5.5 h-5.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Leads pipeline block (Kanban style) */}
      <div id="leads-kanban-section" className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Leads & Deal Stages Pipeline</h2>
            <p className="text-xs text-slate-500">Drag and drop cards between columns or use the click action to update stages.</p>
          </div>
          <span className="text-xs font-mono text-slate-500 bg-slate-100 py-1 px-2.5 rounded border border-slate-200">
            Total Pipeline Size: {leads.filter(l => l.status !== 'Converted').length} active deals
          </span>
        </div>

        <div id="kanban-board-container" className="grid grid-cols-1 lg:grid-cols-5 gap-3">
          {pipelineStages.map((stage) => {
            const stageLeads = leads.filter(l => l.status === stage.id);
            const totalStageValue = stageLeads.reduce((sum, current) => sum + current.dealSize, 0);

            return (
              <div 
                id={`kanban-stage-${stage.id}`}
                key={stage.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
                className="bg-slate-50/70 p-3 rounded-2xl border border-slate-200/80 min-h-[440px] flex flex-col"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between mb-3 pb-1.5 border-b border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">{stage.title}</span>
                    <span className="text-[10px] bg-slate-200/80 text-slate-700 px-1.5 py-0.5 rounded-full font-semibold">
                      {stageLeads.length}
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-500">
                    ${(totalStageValue / 1000).toFixed(1)}k
                  </span>
                </div>

                {/* Cards stack */}
                <div className="space-y-2 flex-1 overflow-y-auto max-h-[480px]">
                  {stageLeads.length === 0 ? (
                    <div className="h-28 border border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-3 text-center">
                      <p className="text-[10px] text-slate-400">Empty stage</p>
                      <p className="text-[9px] text-slate-300">Drag prospects here</p>
                    </div>
                  ) : (
                    stageLeads.map((lead) => {
                      const assigneeObj = teamMembers.find(t => t.id === lead.assignedTo) || teamMembers[0];
                      return (
                        <div
                          id={`kanban-lead-card-${lead.id}`}
                          key={lead.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, lead.id)}
                          className="bg-white p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-sm cursor-grab active:cursor-grabbing transition-all hover:translate-y-[-1px]"
                        >
                          <div className="flex items-start justify-between gap-1 mb-1.5">
                            <h4 
                              onClick={() => onSelectLead(lead)}
                              className="text-xs font-bold text-slate-800 hover:text-blue-600 transition-colors cursor-pointer truncate"
                              title="Click to view full details"
                            >
                              {lead.company}
                            </h4>
                            <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 py-0.5 px-1.5 rounded">
                              ${lead.dealSize.toLocaleString()}
                            </span>
                          </div>

                          <span className="text-[10px] text-slate-500 block mb-2 font-medium">
                            Rep: {lead.name}
                          </span>

                          <div className="flex items-center justify-between border-t border-slate-100 pt-2 mt-2">
                            {/* Assignee Avatar */}
                            <div className="flex items-center gap-1.5">
                              <div className="w-5 h-5 rounded-full bg-slate-900 text-white text-[9px] font-bold flex items-center justify-center" title={assigneeObj.name}>
                                {assigneeObj.avatar}
                              </div>
                              <span className="text-[9px] text-slate-400 truncate max-w-[65px]">{assigneeObj.name.split(' ')[0]}</span>
                            </div>

                            {/* Move stage action */}
                            {stage.id !== 'Converted' ? (
                              <button
                                id={`lead-${lead.id}-advance-stage-btn`}
                                onClick={() => handleMoveStage(lead.id, lead.status)}
                                className="text-[10px] font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 py-0.5 px-2 rounded flex items-center gap-0.5 border border-transparent hover:border-blue-100"
                                title="Move to Next Stage"
                              >
                                <span>Next</span>
                                <ArrowRight className="w-2.5 h-2.5" />
                              </button>
                            ) : (
                              <button
                                id={`client-conversion-btn-${lead.id}`}
                                onClick={() => onSelectClientByCompany(lead.company)}
                                className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 bg-emerald-5 hover:bg-emerald-100/70 border border-emerald-100 rounded px-1.5 py-0.5"
                                title="View Customer profile in CRM"
                              >
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                <span>Profile</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two column lists: Recent activities & Follow-ups */}
      <div id="dashboard-two-column-block" className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Upcoming Follow-ups & Reminders */}
        <div id="followups-container-card" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4.5 h-4.5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-950">Upcoming Follow-Ups & Reminders</h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">Next 7 Days</span>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto">
              {upcomingEvents.map((evt) => {
                const isCall = evt.type === 'Call';
                const isDeadline = evt.type === 'Project Deadline';
                
                return (
                  <div 
                    id={`upcoming-event-item-${evt.id}`}
                    key={evt.id} 
                    className="flex justify-between items-start p-3 bg-slate-50/70 hover:bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-xl transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          isCall 
                            ? 'bg-amber-500' 
                            : isDeadline 
                              ? 'bg-rose-500' 
                              : 'bg-blue-500'
                        }`}></span>
                        <h4 className="text-xs font-bold text-slate-800 leading-snug">{evt.title}</h4>
                      </div>
                      
                      <p className="text-[10px] text-slate-500 font-medium">
                        Client: <strong className="text-slate-700">{evt.clientName || "Agency General"}</strong>
                      </p>
                    </div>

                    <div className="text-right space-y-1">
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{evt.startTime}</span>
                      </div>
                      <span className="text-[9px] font-bold py-0.5 px-2 rounded bg-white border border-slate-200 text-slate-600">
                        {evt.date}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 text-center">
              Configure or synchronize your Google Workspace Calendar inside the integrations menu.
            </p>
          </div>
        </div>

        {/* Recent updates and Activity Log */}
        <div id="recent-activities-container-card" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Compass className="w-4.5 h-4.5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-950">Real-Time Team Activity Sync</h3>
            </div>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          <div className="space-y-3.5 max-h-[300px] overflow-y-auto">
            {recentActivities.map((act) => {
              const isTask = act.type === 'task';
              const isLead = act.type === 'lead';
              
              return (
                <div id={`activity-log-item-${act.id}`} key={act.id} className="flex gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 text-xs font-bold ${
                    isTask 
                      ? 'bg-amber-50 text-amber-700 border-amber-100' 
                      : isLead 
                        ? 'bg-blue-50 text-blue-700 border-blue-100' 
                        : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                  }`}>
                    {act.user.slice(0, 2).toUpperCase()}
                  </div>
                  
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-800 leading-none">{act.title}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{act.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">{act.description}</p>
                    <p className="text-[9px] text-slate-400 font-medium">Logged by {act.user}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}

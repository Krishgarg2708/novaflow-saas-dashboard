import React, { useState } from 'react';
import { 
  Users, 
  Mail, 
  Phone, 
  CheckCircle, 
  Briefcase, 
  Smile, 
  Layers, 
  CircleDot, 
  Plus, 
  ArrowRight,
  ShieldCheck,
  SendHorizontal,
  ChevronRight,
  X,
  Printer,
  Download,
  Clipboard,
  FileText,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ClipboardCheck
} from 'lucide-react';
import { TeamMember } from '../types';

interface TeamScreenProps {
  teamMembers: TeamMember[];
  onUpdateTeamMember: (member: TeamMember) => void;
  adminName?: string;
  adminEmail?: string;
}

export default function TeamScreen({
  teamMembers,
  onUpdateTeamMember,
  adminName,
  adminEmail
}: TeamScreenProps) {
  const [selectedRepId, setSelectedRepId] = useState<string | null>(null);
  
  // Performance Profile Export Modal states
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFilter, setExportFilter] = useState<'all' | 'high-workload' | 'high-rating'>('all');
  const [copiedText, setCopiedText] = useState(false);
  const [copiedSpreadsheet, setCopiedSpreadsheet] = useState(false);
  
  // Custom message email modal simulation
  const [isDraftEmailOpen, setIsDraftEmailOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailToName, setEmailToName] = useState('');

  const selectedRep = teamMembers.find(t => t.id === selectedRepId) || null;

  // Derived statistics based on the modal's export-filter selection
  const filteredMembers = teamMembers.filter(m => {
    if (exportFilter === 'high-workload') return m.workload > 70;
    if (exportFilter === 'high-rating') return m.rating > 85;
    return true;
  });

  const avgWorkload = filteredMembers.length > 0
    ? filteredMembers.reduce((sum, m) => sum + m.workload, 0) / filteredMembers.length
    : 0;

  const avgRating = filteredMembers.length > 0
    ? filteredMembers.reduce((sum, m) => sum + m.rating, 0) / filteredMembers.length
    : 0;

  const totalActiveClientsManaged = filteredMembers.reduce((sum, m) => sum + m.activeClients, 0);
  const totalCompletedTasksCount = filteredMembers.reduce((sum, m) => sum + m.completedTasks, 0);
  const overloadedStaffCount = filteredMembers.filter(m => m.workload > 85).length;
  const maxRatingMember = filteredMembers.length > 0
    ? [...filteredMembers].sort((a, b) => b.rating - a.rating)[0]
    : null;

  const handleCopySummary = () => {
    const dateStr = "May 28, 2026";
    let txt = `==================================================\n`;
    txt += `    NOVAFLOW CRM - OPERATIONAL DISPATCH CARD      \n`;
    txt += `==================================================\n`;
    txt += `Generated on: ${dateStr} at 12:35 UTC\n`;
    txt += `Active Scope: ${exportFilter.toUpperCase()}\n\n`;
    txt += `--- AGGREGATED METRICS ---\n`;
    txt += `- Monitored Associates: ${filteredMembers.length}\n`;
    txt += `- Average Allocation Load: ${avgWorkload.toFixed(1)}%\n`;
    txt += `- Average Satisfaction Rating: ${avgRating.toFixed(1)}%\n`;
    txt += `- Active Accounts Pipeline: ${totalActiveClientsManaged}\n`;
    txt += `- Task Deliverables Settled: ${totalCompletedTasksCount}\n`;
    txt += `- Overload Capacity Staff: ${overloadedStaffCount} Reps\n\n`;
    txt += `--- DETAILED PERSONNEL VALUES ---\n`;
    filteredMembers.forEach(m => {
      const statusSymbol = m.workload > 80 ? '🔴' : m.workload > 50 ? '🟡' : '🟢';
      txt += `* [${m.status.toUpperCase()}] ${m.name} (${m.role})\n`;
      txt += `  Load: ${m.workload}% ${statusSymbol} | Rating: ${m.rating}% ⭐\n`;
      txt += `  Accounts: ${m.activeClients} | Settled Tasks: ${m.completedTasks}\n`;
      txt += `--------------------------------------------------\n`;
    });
    
    navigator.clipboard.writeText(txt);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCopyCSV = () => {
    let csv = `Name,Role,Status,Workload %,Satisfaction Rating %,Active Clients,Completed Tasks\n`;
    filteredMembers.forEach(m => {
      csv += `"${m.name}","${m.role}","${m.status}",${m.workload},${m.rating},${m.activeClients},${m.completedTasks}\n`;
    });
    
    navigator.clipboard.writeText(csv);
    setCopiedSpreadsheet(true);
    setTimeout(() => setCopiedSpreadsheet(false), 2000);
  };

  const handleDownloadTxtReport = () => {
    let txt = `===============================================\n`;
    txt += `    NOVAFLOW CRM OPERATIONAL PERFORMANCE REPORT \n`;
    txt += `===============================================\n`;
    txt += `Generated: May 28, 2026 12:35 PM UTC\n`;
    txt += `Assessment Scope Filter: ${exportFilter}\n\n`;
    txt += `SUMMARY HIGHLIGHTS:\n`;
    txt += `-------------------\n`;
    txt += `Total Staff count: ${filteredMembers.length}\n`;
    txt += `Average Workforce Load utilization: ${avgWorkload.toFixed(1)}%\n`;
    txt += `Average Star Performance Rating: ${avgRating.toFixed(1)}%\n`;
    txt += `Total active clients portfolios: ${totalActiveClientsManaged}\n`;
    txt += `Total completed internal checklist items: ${totalCompletedTasksCount}\n`;
    txt += `Critical overloaded bottlenecks (>80% workload): ${overloadedStaffCount}\n`;
    if (maxRatingMember) {
      txt += `Champion performer: ${maxRatingMember.name} (Rating: ${maxRatingMember.rating}%)\n`;
    }
    txt += `\n`;
    txt += `STAFF DETAILS DISPATCH MATRIX:\n`;
    txt += `------------------------------\n`;
    filteredMembers.forEach(m => {
      txt += `Name: ${m.name}\n`;
      txt += `Designation: ${m.role}\n`;
      txt += `Availability state: ${m.status}\n`;
      txt += `Allocation Loading: ${m.workload}% of total occupancy\n`;
      txt += `Review feedback score: ${m.rating}%\n`;
      txt += `Active accounts portfolios: ${m.activeClients} client contracts\n`;
      txt += `Done checklist tasks: ${m.completedTasks} items completed\n`;
      txt += `-----------------------------------------------\n`;
    });
    txt += `\nEnd of NovaFlow dispatch evaluation report.\n`;

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `novaflow-personnel-performance-audit-${exportFilter}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenDraftEmail = (member: TeamMember) => {
    setEmailToName(member.name);
    setEmailSubject(`[NovaFlow CRM] Account Re-routing Alert`);
    setEmailBody(`Hi ${member.name.split(' ')[0]},\n\nWe are reviewing our current Q2 client workloads. Let's arrange a sync session tomorrow regarding account assignments.\n\nBest,\nAlex`);
    setIsDraftEmailOpen(true);
  };

  const handleSendEmailSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Email simulation completed: Sent broadcast instructions to ${emailToName}!`);
    setIsDraftEmailOpen(false);
    setEmailSubject('');
    setEmailBody('');
  };

  const handleStatusChangeToggle = (memberId: string, status: TeamMember['status']) => {
    const target = teamMembers.find(t => t.id === memberId);
    if (target) {
      onUpdateTeamMember({
        ...target,
        status
      });
    }
  };

  const handleWorkloadSlide = (memberId: string, workload: number) => {
    const target = teamMembers.find(t => t.id === memberId);
    if (target) {
      onUpdateTeamMember({
        ...target,
        workload: Number(workload)
      });
    }
  };

  return (
    <div id="team-screen-root" className="space-y-6 animate-fade-in">
      
      {/* 1. Statistics banner */}
      <div id="team-header-card" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">NovaFlow Core Agency Team</h1>
          <p className="text-sm text-slate-500 mt-0.5">Oversee member allocations, operational workloads, and performance metrics.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 shrink-0">
          <div className="flex gap-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Online: {teamMembers.filter(t => t.status === 'online').length}</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Busy: {teamMembers.filter(t => t.status === 'busy').length}</span>
            </span>
          </div>

          <button
            id="team-performance-export-btn"
            onClick={() => setIsExportModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-3.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Performance Export</span>
          </button>
        </div>
      </div>

      {/* 2. Team Grid layout cards */}
      <div id="team-cards-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {teamMembers.map((member) => (
          <div 
            id={`team-rep-card-${member.id}`}
            key={member.id} 
            className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden hover:border-blue-300 transition-all hover:-translate-y-0.5"
          >
            {/* Upper Ident */}
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-slate-100 font-bold flex items-center justify-center text-sm shadow-sm">
                    {member.avatar}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">{member.name}</h3>
                    <p className="text-xs text-slate-400 font-medium whitespace-nowrap mt-0.5">{member.role}</p>
                  </div>
                </div>

                {/* Live Status selectors selector */}
                <select
                  id={`member-card-status-select-${member.id}`}
                  value={member.status}
                  onChange={(e) => handleStatusChangeToggle(member.id, e.target.value as any)}
                  className={`text-[10px] font-bold uppercase py-0.5 px-2.5 rounded-full border focus:outline-none cursor-pointer ${
                    member.status === 'online' 
                      ? 'bg-emerald-50/50 text-emerald-700 border-emerald-100' 
                      : member.status === 'busy' 
                        ? 'bg-amber-100 text-amber-700 border-amber-200' 
                        : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                >
                  <option value="online">● Online</option>
                  <option value="busy">● Busy</option>
                  <option value="offline">○ Offline</option>
                </select>
              </div>

              {/* Informative counts details */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50/70 p-3 rounded-xl border border-slate-200/50 text-xs">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide block">Active Accounts</span>
                  <p className="font-extrabold text-slate-800 mt-0.5 flex items-center gap-1 font-mono">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span>{member.activeClients} Clients</span>
                  </p>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide block">Completed Tasks</span>
                  <p className="font-extrabold text-slate-755 mt-0.5 flex items-center gap-1 font-mono">
                    <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
                    <span>{member.completedTasks} items</span>
                  </p>
                </div>
              </div>

              {/* Workload assigned utilization slider */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>Workload Utilization</span>
                  </span>
                  <span className="font-mono">{member.workload}%</span>
                </div>

                <div className="flex items-center gap-3">
                  <input 
                    id={`member-card-workload-slider-${member.id}`}
                    type="range" 
                    min="0" 
                    max="100" 
                    value={member.workload}
                    onChange={(e) => handleWorkloadSlide(member.id, Number(e.target.value))}
                    className="flex-1 accent-blue-600 h-1 cursor-pointer"
                  />
                  <span className={`text-[9px] font-mono font-bold leading-none ${member.workload > 80 ? 'text-amber-500' : 'text-slate-400'}`}>
                    {member.workload > 80 ? 'Heavy' : 'Stable'}
                  </span>
                </div>
              </div>
            </div>

            {/* Lower panel buttons */}
            <div className="bg-slate-55 p-3.5 px-5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1 text-[11px] text-slate-500">
                <Smile className="w-3.5 h-3.5 text-emerald-500" />
                <span>Score: {member.rating}% rating</span>
              </span>

              <button
                id={`member-email-action-btn-${member.id}`}
                onClick={() => handleOpenDraftEmail(member)}
                className="text-blue-600 hover:text-blue-800 text-[11px] font-bold flex items-center gap-1 px-2.5 py-1.5 rounded hover:bg-blue-50/50 transition-all border border-transparent hover:border-blue-100"
              >
                <span>Instruct</span>
                <SendHorizontal className="w-3 h-3" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Draft custom simulation instructions overlay */}
      {isDraftEmailOpen && (
        <div id="email-sender-modal-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in px-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full p-5 shadow-xl space-y-4 animate-scale-up">
            
            <div className="flex items-center justify-between pb-2 border-b border-rose-200">
              <h3 className="text-sm font-bold text-slate-900 leading-none">Instruct: Send CRM routing order</h3>
              <button 
                id="close-email-modal-btn"
                onClick={() => setIsDraftEmailOpen(false)}
                className="text-slate-400 hover:text-slate-650 hover:bg-slate-100 p-1 rounded-full text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendEmailSimulation} className="space-y-3.5 text-xs text-slate-700">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Target Coordinator</label>
                <input 
                  id="email-form-to-name"
                  type="text" 
                  disabled
                  value={emailToName}
                  className="w-full bg-slate-104 border border-slate-150 p-1.5 px-2 rounded font-bold text-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600">Subject Directive *</label>
                <input 
                  id="email-form-subject"
                  type="text" 
                  required
                  placeholder="Subject details..."
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-1.5 rounded text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600">Email Body Message *</label>
                <textarea 
                  id="email-form-body"
                  rows={4}
                  required
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-1.5 rounded resize-none text-[11px] text-slate-750 leading-normal"
                ></textarea>
              </div>

              <button
                id="send-email-instruction-submit"
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 rounded-lg transition-all shadow-xs"
              >
                Transmit Directive Ordered
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Performance Profile Export Modal */}
      {isExportModalOpen && (
        <div id="performance-export-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in px-4 print:hidden">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-blue-50 border border-blue-100 rounded-lg text-blue-600">
                  <FileText className="w-5 h-5 text-blue-600 animate-pulse" />
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Core Performance & Allocation Audit</h3>
                  <p className="text-[10px] text-slate-400 font-medium">Export raw sheets, copies, or high-definition formal PDF sheets.</p>
                </div>
              </div>
              <button 
                id="close-export-modal-btn"
                onClick={() => setIsExportModalOpen(false)}
                className="text-slate-400 hover:text-slate-650 hover:bg-slate-100 p-1.5 rounded-full transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Filter Selector tab rows */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Target Assessment Cohort</label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs">
                <button
                  id="tab-export-all"
                  onClick={() => setExportFilter('all')}
                  className={`py-2 px-3 rounded-lg font-bold transition text-center cursor-pointer ${exportFilter === 'all' ? 'bg-white text-blue-700 shadow-xs scale-102' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  All Staff ({teamMembers.length})
                </button>
                <button
                  id="tab-export-workload"
                  onClick={() => setExportFilter('high-workload')}
                  className={`py-2 px-3 rounded-lg font-bold transition text-center cursor-pointer ${exportFilter === 'high-workload' ? 'bg-white text-blue-700 shadow-xs scale-102' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  High Workload ({teamMembers.filter(m => m.workload > 70).length})
                </button>
                <button
                  id="tab-export-rating"
                  onClick={() => setExportFilter('high-rating')}
                  className={`py-2 px-3 rounded-lg font-bold transition text-center cursor-pointer ${exportFilter === 'high-rating' ? 'bg-white text-blue-700 shadow-xs scale-102' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  Top Performers ({teamMembers.filter(m => m.rating > 85).length})
                </button>
              </div>
            </div>

            {/* Live Interactive Dashboard Card Preview Container */}
            <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-slate-50/50 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase font-black bg-slate-900 text-white py-0.5 px-2 rounded-md font-mono">WORKSPACE PROFILE STATUS IN-BOUNDS</span>
                <span className="text-[10px] text-slate-400 font-mono">May 28, 2026 | 12:35 UTC</span>
              </div>

              {/* Bento Metric Boxes grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/70 shadow-xs text-center space-y-1">
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide">Monitored</span>
                  <p className="text-xl font-black font-mono text-slate-900">{filteredMembers.length} staff</p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-205 shadow-xs text-center space-y-1">
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide">Avg Utilization</span>
                  <p className="text-xl font-black font-mono text-slate-900">{avgWorkload.toFixed(0)}%</p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-205 shadow-xs text-center space-y-1">
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide">Client Sizing</span>
                  <p className="text-xl font-black font-mono text-slate-900">{totalActiveClientsManaged} acct</p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-205 shadow-xs text-center space-y-1">
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide">Done Deliverables</span>
                  <p className="text-xl font-black font-mono text-slate-900">{totalCompletedTasksCount} item</p>
                </div>
              </div>

              {/* Mini Personnel Table List */}
              <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs">
                <div className="bg-slate-100/60 p-2 px-3 border-b border-slate-200 flex justify-between text-[10px] text-slate-400 font-black uppercase tracking-wider">
                  <span>Representative</span>
                  <span>Workload & Productivity Rating</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-[160px] overflow-y-auto text-xs font-sans">
                  {filteredMembers.map(m => (
                    <div key={m.id} className="p-2.5 px-3 flex items-center justify-between text-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-slate-900 text-slate-100 rounded-full font-bold text-[10px] flex items-center justify-center">{m.avatar}</div>
                        <div>
                          <p className="font-extrabold text-slate-900">{m.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{m.role}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 font-sans">
                        <div className="text-right">
                          <p className="font-mono font-bold">{m.workload}% allocation</p>
                          <p className="text-[10px] text-emerald-600 font-semibold">{m.rating}% rating score</p>
                        </div>

                        {/* Status warning color dot indicator */}
                        <span className={`w-2 h-2 rounded-full ${m.workload > 85 ? 'bg-rose-500 animate-ping' : m.workload > 60 ? 'bg-amber-400' : 'bg-emerald-500'}`} />
                      </div>
                    </div>
                  ))}
                  {filteredMembers.length === 0 && (
                    <p className="p-4 text-center text-xs text-slate-400 italic">No associates matched the chosen assessment criteria!</p>
                  )}
                </div>
              </div>

              {/* Dynamic Action Trigger warning notifications if overloading is detected */}
              {overloadedStaffCount > 0 && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-2.5 text-[11px] text-amber-800 font-medium">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 self-start mt-0.5" />
                  <p className="leading-relaxed">
                    <span className="font-extrabold text-amber-900">Overcapacity Warning:</span> {overloadedStaffCount} associate(s) exceed safe 80% workload targets. Export this report now to coordinate internal reallocations and optimize workforce satisfaction ratings.
                  </p>
                </div>
              )}

            </div>

            {/* Downloader & Copiers Tools actions row block */}
            <div className="space-y-3.5">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Available Dispatches / Exports</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                
                {/* 1. Raw Text Copy */}
                <button
                  id="action-btn-copy-card"
                  onClick={handleCopySummary}
                  className="p-3 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 transition-all text-slate-700 hover:text-blue-800 group relative cursor-pointer"
                  title="Copy a summary card with emojis to paste in Slack/Teams"
                >
                  {copiedText ? (
                    <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied Card</span>
                    </span>
                  ) : (
                    <>
                      <Clipboard className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                      <span className="text-[10px] font-bold">Copy Slack Card</span>
                    </>
                  )}
                </button>

                {/* 2. Structured CSV sheet copy */}
                <button
                  id="action-btn-copy-csv"
                  onClick={handleCopyCSV}
                  className="p-3 border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 transition-all text-slate-700 hover:text-emerald-800 group relative cursor-pointer"
                  title="Copy formatted comma separated sheet to paste directly in Excel/Sheets"
                >
                  {copiedSpreadsheet ? (
                    <span className="text-emerald-650 font-bold text-[10px] flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied CSV</span>
                    </span>
                  ) : (
                    <>
                      <ClipboardCheck className="w-5 h-5 text-slate-400 group-hover:text-emerald-500" />
                      <span className="text-[10px] font-bold">Copy CSV Ledger</span>
                    </>
                  )}
                </button>

                {/* 3. Text download backup */}
                <button
                  id="action-btn-download-txt"
                  onClick={handleDownloadTxtReport}
                  className="p-3 border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 transition-all text-slate-700 hover:text-indigo-800 group cursor-pointer"
                  title="Download raw report as personnel-performance.txt file"
                >
                  <Download className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                  <span className="text-[10px] font-bold font-sans">Download File</span>
                </button>

                {/* 4. Full PDF print generation */}
                <button
                  id="action-btn-print-pdf"
                  onClick={() => window.print()}
                  className="p-3 border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 transition-all text-slate-700 hover:text-amber-800 group cursor-pointer"
                  title="Opens the browser print dialog to print or save with tailored styles"
                >
                  <Printer className="w-5 h-5 text-slate-400 group-hover:text-amber-600" />
                  <span className="text-[10px] font-bold">Print / Save PDF</span>
                </button>

              </div>
            </div>

            <div className="p-3 bg-blue-50/75 rounded-xl flex gap-2 text-[10px] text-blue-750 leading-relaxed font-semibold border border-blue-105">
              <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span>
                <span className="font-bold text-blue-800">Advanced tip:</span> Clicking <span className="underline">"Print / Save PDF"</span> launches print settings. To export a crisp, digital document, change target destination to <span className="font-bold">"Save as PDF"</span>. This handles page sizes automatically!
              </span>
            </div>

          </div>
        </div>
      )}

      {/* 4. Hideable Pristine Executive Layout for High-end PDF & Physical Printing */}
      <div id="perform-print-section" className="hidden print:block bg-white p-12 text-slate-900 max-w-4xl mx-auto space-y-8 font-sans">
        
        {/* Header Block with Corporate styling */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6">
          <div>
            <span className="text-[10px] uppercase tracking-widest bg-slate-950 text-white p-1 px-3.5 font-bold rounded">NovaFlow Enterprise Management</span>
            <h1 className="text-2xl font-black text-slate-950 mt-2.5 tracking-tight">WORKFORCE PERFORMANCE & ALLOCATION AUDIT</h1>
            <p className="text-[10px] text-slate-400 font-mono mt-1">DISPATCH ID: NF-MEMBERS-AUD-2026 | COHORTS GENERATED SECURELY</p>
          </div>
          <div className="text-right text-xs font-mono font-bold text-slate-705 space-y-0.5 text-xs">
            <p className="text-slate-950 font-bold">Prepared date: May 28, 2026</p>
            <p>Report stamp: 12:35 PM UTC</p>
            <p className="text-emerald-700 font-black">Database connection: Verified</p>
          </div>
        </div>

        {/* Audit filter header indicators */}
        <div className="flex justify-between items-center text-xs">
          <p className="font-medium text-slate-500">
            Assessment Focus Scope Filter: <span className="font-bold uppercase text-slate-900">"{exportFilter}"</span>
          </p>
          <p className="font-mono text-slate-450 text-[10px]">
            Generated by Lead Administrator: {adminName || 'Krish Garg'} ({adminEmail || 'krish.garg2708@gmail.com'})
          </p>
        </div>

        {/* Quantitative summary bento metrics row for print */}
        <div className="grid grid-cols-4 gap-4">
          <div className="border border-slate-200 p-4 rounded-xl text-center space-y-1 bg-slate-50/50">
            <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block">Monitored Staff</span>
            <h3 className="text-2xl font-extrabold text-slate-950 font-mono">{filteredMembers.length}</h3>
          </div>

          <div className="border border-slate-200 p-4 rounded-xl text-center space-y-1 bg-slate-50/50">
            <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block">Average Workload</span>
            <h3 className="text-2xl font-extrabold text-slate-950 font-mono">{avgWorkload.toFixed(1)}%</h3>
          </div>

          <div className="border border-slate-200 p-4 rounded-xl text-center space-y-1 bg-slate-50/50">
            <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block">Efficiency Satisfaction</span>
            <h3 className="text-2xl font-extrabold text-slate-950 font-mono">{avgRating.toFixed(1)}%</h3>
          </div>

          <div className="border border-slate-200 p-4 rounded-xl text-center space-y-1 bg-slate-50/50">
            <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block">Alert Bottlenecks</span>
            <h3 className="text-2xl font-extrabold text-rose-600 font-mono">{overloadedStaffCount} Rep(s)</h3>
          </div>
        </div>

        {/* Personnel Breakdown Table */}
        <div className="space-y-4 pt-2">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b-2 border-slate-200 pb-2">WORKFORCE ALLOCATION DISPATCH MATRIX</h2>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 font-extrabold text-slate-800">
                <th className="p-3">Representative</th>
                <th className="p-3">Core Designation</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Workload Load</th>
                <th className="p-3 text-right">Productivity rating</th>
                <th className="p-3 text-right">Accounts managed</th>
                <th className="p-3 text-right">Tasks Settled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {filteredMembers.map(m => (
                <tr key={m.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-950">{m.name}</td>
                  <td className="p-3">{m.role}</td>
                  <td className="p-3 capitalize font-mono text-[10px] font-bold">{m.status}</td>
                  <td className={`p-3 text-right font-black font-mono ${m.workload > 85 ? 'text-rose-650' : 'text-slate-900'}`}>{m.workload}%</td>
                  <td className="p-3 text-right font-bold font-mono">{m.rating}%</td>
                  <td className="p-3 text-right font-mono">{m.activeClients} client portfolio</td>
                  <td className="p-3 text-right font-mono">{m.completedTasks} tasks</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detailed qualitative evaluation field */}
        <div className="border border-slate-200 rounded-xl p-6 bg-slate-50/30 text-xs text-slate-705 space-y-3 font-medium leading-relaxed">
          <h3 className="font-black uppercase tracking-wider text-slate-950">SYSTEM EVALUATOR AUDIT COMMENTARY</h3>
          <p>
            Workload quotas are continuously calculated in real-time as a factor of active client portfolios and unfinished sprint items. 
            Average workload parameters presently register at <span className="font-extrabold text-slate-900 font-mono">{avgWorkload.toFixed(1)}%</span>. 
            Adequate target workloads sit between <span className="font-bold text-slate-900 font-mono">45% and 75%</span>. 
            Currently, {overloadedStaffCount} representatives are identified as critically loaded (&gt;80% occupancy threshold). 
            System administrators advise immediate client re-routing or task re-delegation parameters before entering next sprint checkpoints.
          </p>
        </div>

        {/* Signatures region */}
        <div className="pt-16 flex justify-between items-center text-xs">
          <div className="border-t border-slate-400 w-52 text-center pt-2.5">
            <p className="font-extrabold text-slate-900">Sarah Jenkins</p>
            <p className="text-slate-400">Sales Operations VP</p>
          </div>
          <div className="border-t border-slate-400 w-52 text-center pt-2.5">
            <p className="font-extrabold text-slate-900">{adminName || 'Krish Garg'}</p>
            <p className="text-slate-400">Lead CRM Administrator</p>
          </div>
        </div>

      </div>

    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  ExternalLink, 
  Phone, 
  Mail, 
  DollarSign, 
  Plus, 
  Trash2, 
  Pin, 
  CheckCircle2, 
  X, 
  Briefcase, 
  ChevronRight, 
  HeartHandshake, 
  AlertTriangle,
  FileSpreadsheet,
  Clock
} from 'lucide-react';
import { Client, Deliverable, Invoice, ClientStatus } from '../types';

interface ClientsScreenProps {
  clients: Client[];
  onUpdateClient: (client: Client) => void;
  onAddClient: (client: Omit<Client, 'id'>) => void;
  selectedCompanyPref?: string | null;
  onClearPref?: () => void;
}

export default function ClientsScreen({
  clients,
  onUpdateClient,
  onAddClient,
  selectedCompanyPref,
  onClearPref
}: ClientsScreenProps) {
  // Master List filter/selection
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedClientId, setSelectedClientId] = useState<string>(() => {
    if (selectedCompanyPref) {
      const match = clients.find(c => c.company.toLowerCase() === selectedCompanyPref.toLowerCase());
      if (match) return match.id;
    }
    return clients[0]?.id || '';
  });

  // Handle outside redirection/preferences
  React.useEffect(() => {
    if (selectedCompanyPref) {
      const match = clients.find(c => c.company.toLowerCase() === selectedCompanyPref.toLowerCase());
      if (match) {
        setSelectedClientId(match.id);
      }
      if (onClearPref) onClearPref();
    }
  }, [selectedCompanyPref, clients, onClearPref]);

  // Form states inside Sidebar Details
  const [newNoteText, setNewNoteText] = useState('');
  const [newDelName, setNewDelName] = useState('');
  const [newDelDueDate, setNewDelDueDate] = useState('');

  const [newInvAmount, setNewInvAmount] = useState('');
  const [newInvStatus, setNewInvStatus] = useState<'Paid' | 'Sent' | 'Overdue' | 'Draft'>('Sent');
  const [newInvDueDate, setNewInvDueDate] = useState('');

  // Creation overlay for adding a whole new Account Client
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [formCompany, setFormCompany] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formWebsite, setFormWebsite] = useState('');
  const [formValue, setFormValue] = useState('45000');
  const [formStatus, setFormStatus] = useState<ClientStatus>('Active');

  // Currently focused client structure
  const activeClient = useMemo(() => {
    return clients.find(c => c.id === selectedClientId) || clients[0] || null;
  }, [clients, selectedClientId]);

  // Filter Master list
  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      const matchesSearch = c.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            c.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [clients, searchTerm, statusFilter]);

  // Add a brand-new Client Account row
  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCompany || !formContact || !formEmail) {
      alert("Missing required fields for creating a new agency client.");
      return;
    }

    onAddClient({
      name: formContact,
      company: formCompany,
      email: formEmail,
      phone: formPhone || '(555) 000-0000',
      contractValue: Number(formValue) || 45000,
      status: formStatus,
      website: formWebsite || 'https://novaflow.agency',
      avatarText: formCompany.slice(0, 2).toUpperCase(),
      bgColor: 'bg-blue-600',
      projectHealth: 'Good',
      notes: [
        {
          id: 'note-init',
          text: 'Client onboarding profile generated.',
          date: '2026-05-28',
          author: 'Alex Rivera',
          isPinned: true
        }
      ],
      deliverables: [],
      invoices: []
    });

    // Reset list
    setFormCompany('');
    setFormContact('');
    setFormEmail('');
    setFormPhone('');
    setFormWebsite('');
    setFormValue('45000');
    setFormStatus('Active');
    setIsAddClientOpen(false);
  };

  // Add deliverable item to current active client details
  const handleAddDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDelName || !newDelDueDate || !activeClient) return;

    const newDel: Deliverable = {
      id: `del-custom-${Date.now()}`,
      name: newDelName,
      status: 'In Progress',
      dueDate: newDelDueDate,
      progress: 0
    };

    onUpdateClient({
      ...activeClient,
      deliverables: [...activeClient.deliverables, newDel]
    });

    setNewDelName('');
    setNewDelDueDate('');
  };

  // Quick helper to slide deliverable progress
  const handleUpdateDeliverableProgress = (delId: string, progress: number) => {
    if (!activeClient) return;
    const progressVal = Number(progress);
    const updated = activeClient.deliverables.map(d => {
      if (d.id === delId) {
        return { 
          ...d, 
          progress: progressVal, 
          status: progressVal === 100 ? 'Completed' : d.status === 'Completed' ? 'In Progress' : d.status 
        } as Deliverable;
      }
      return d;
    });

    onUpdateClient({
      ...activeClient,
      deliverables: updated
    });
  };

  const handleUpdateDeliverableStatus = (delId: string, newStatus: Deliverable['status']) => {
    if (!activeClient) return;
    const updated = activeClient.deliverables.map(d => {
      if (d.id === delId) {
        return { 
          ...d, 
          status: newStatus,
          progress: newStatus === 'Completed' ? 100 : d.progress === 100 ? 50 : d.progress
        } as Deliverable;
      }
      return d;
    });

    onUpdateClient({
      ...activeClient,
      deliverables: updated
    });
  };

  // Add bill item snapshot
  const handleAddInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvAmount || !newInvDueDate || !activeClient) return;

    const newInv: Invoice = {
      id: `inv-${Date.now()}`,
      amount: Number(newInvAmount) || 5000,
      status: newInvStatus,
      dueDate: newInvDueDate
    };

    onUpdateClient({
      ...activeClient,
      invoices: [...activeClient.invoices, newInv]
    });

    setNewInvAmount('');
    setNewInvDueDate('');
    setNewInvStatus('Sent');
  };

  // Delete invoice
  const handleDeleteInvoice = (invId: string) => {
    if (!activeClient) return;
    onUpdateClient({
      ...activeClient,
      invoices: activeClient.invoices.filter(i => i.id !== invId)
    });
  };

  // Post notes comment
  const handlePostNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !activeClient) return;

    onUpdateClient({
      ...activeClient,
      notes: [
        {
          id: `no-c-${Date.now()}`,
          text: newNoteText,
          date: new Date().toISOString().split('T')[0],
          author: 'Alex Rivera'
        },
        ...activeClient.notes
      ]
    });
    setNewNoteText('');
  };

  // Pin toggle
  const handleToggleNotePin = (noteId: string) => {
    if (!activeClient) return;
    onUpdateClient({
      ...activeClient,
      notes: activeClient.notes.map(n => n.id === noteId ? { ...n, isPinned: !n.isPinned } : n)
    });
  };

  // Delete specific note
  const handleDeleteNote = (noteId: string) => {
    if (!activeClient) return;
    onUpdateClient({
      ...activeClient,
      notes: activeClient.notes.filter(n => n.id !== noteId)
    });
  };

  // Quick Client delete row
  const handleDeleteClientMain = (clientId: string) => {
    if (confirm("Are you sure you want to completely de-register this client from CRM logs?")) {
      // Just flag as paused or delete
      alert("Account deletion can be requested by Workspace Administrator settings.");
    }
  };

  return (
    <div id="clients-module-root" className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
      
      {/* 1. Left Sidebar: Clients Directories */}
      <div id="clients-master-panel" className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
        
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900">Active Accounts</h2>
          <button 
            id="open-add-client-modal-btn"
            onClick={() => setIsAddClientOpen(true)}
            className="p-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
            title="Onboard New Agency Client"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Directory Search inputs */}
        <div className="relative">
          <input 
            id="clients-search-textbox"
            type="text" 
            placeholder="Search accounts..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 p-2 pl-3 text-xs rounded-lg focus:outline-none focus:border-blue-500 text-slate-800"
          />
        </div>

        {/* Category Filters dropdown */}
        <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200 flex justify-between gap-1">
          {['All', 'Active', 'Onboarding', 'Paused'].map((st) => (
            <button
              id={`clients-filter-tab-${st}`}
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`flex-1 text-[10px] font-bold py-1 px-1.5 rounded transition ${
                statusFilter === st 
                  ? 'bg-white text-slate-800 shadow-xs border border-slate-200' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Dynamic Directory Stack */}
        <div className="space-y-1.5 max-h-[460px] overflow-y-auto">
          {filteredClients.map((client) => {
            const isSelected = client.id === selectedClientId;
            const completedCount = client.deliverables.filter(d => d.status === 'Completed').length;
            const totalCount = client.deliverables.length;

            return (
              <div
                id={`client-list-item-${client.id}`}
                key={client.id}
                onClick={() => setSelectedClientId(client.id)}
                className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                  isSelected 
                    ? 'bg-blue-50/50 border-blue-200 shadow-xs' 
                    : 'bg-white border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className={`w-8.5 h-8.5 rounded-lg flex items-center justify-center font-bold text-white text-xs shrink-0 ${client.bgColor || 'bg-blue-600'}`}>
                    {client.avatarText}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-slate-800 truncate leading-snug">{client.company}</h4>
                    <p className="text-[10px] text-slate-400 font-medium truncate">Annual: ${(client.contractValue / 1000).toFixed(0)}k</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full block border ${
                    client.status === 'Active' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : client.status === 'Onboarding' 
                        ? 'bg-blue-50 text-blue-700 border-blue-100' 
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {client.status}
                  </span>
                  {totalCount > 0 && (
                    <span className="text-[9px] text-slate-400 mt-1 block">
                      Tasks: {completedCount}/{totalCount}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* 2. Right Workspace details Column */}
      <div id="clients-main-workspace" className="lg:col-span-3 space-y-5">
        
        {activeClient ? (
          <>
            {/* Top Workspace Identity row */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-sm ${activeClient.bgColor || 'bg-blue-600'}`}>
                  {activeClient.avatarText}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-lg font-bold text-slate-900 leading-snug">{activeClient.company}</h1>
                    <select
                      id={`workspace-client-status-selector-${activeClient.id}`}
                      value={activeClient.status}
                      onChange={(e) => onUpdateClient({ ...activeClient, status: e.target.value as ClientStatus })}
                      className="bg-slate-100 border border-slate-200 text-[10px] font-bold py-0.5 px-2 rounded-full text-slate-700 focus:outline-none cursor-pointer"
                    >
                      <option value="Active">Active Account</option>
                      <option value="Onboarding">Onboarding</option>
                      <option value="Paused">Paused</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{activeClient.name}</span>
                    </span>
                    <a 
                      href={activeClient.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-0.5"
                    >
                      <span>{activeClient.website.replace('https://', '')}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* General Contract Overview stats */}
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/60 shrink-0">
                <div className="space-y-0.5 text-left">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Contract Arr</span>
                  <p className="text-sm font-bold text-slate-900">${activeClient.contractValue.toLocaleString()}/yr</p>
                </div>
                <div className="h-8 w-px bg-slate-200"></div>
                <div className="space-y-0.5 text-left">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Deliverable Health</span>
                  <div className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${
                      activeClient.projectHealth === 'Excellent' || activeClient.projectHealth === 'Good'
                        ? 'bg-emerald-500' 
                        : 'bg-rose-500'
                    }`}></span>
                    <span className="text-xs font-semibold text-slate-800">{activeClient.projectHealth}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Split: Deliverables (Active projects) & Timeline notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Left Column: List Deliverables & Progress */}
              <div id="client-deliverables-card" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-slate-700" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Active Deliverables Tracker</h3>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Count: {activeClient.deliverables.length}</span>
                </div>

                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {activeClient.deliverables.length === 0 ? (
                    <p className="text-xs text-slate-400 italic text-center py-6">No deliverables set. Add below.</p>
                  ) : (
                    activeClient.deliverables.map((del) => (
                      <div id={`del-item-${del.id}`} key={del.id} className="space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-800 text-[11px] truncate max-w-[140px]" title={del.name}>{del.name}</span>
                          
                          <select
                            id={`del-status-select-${del.id}`}
                            value={del.status}
                            onChange={(e) => handleUpdateDeliverableStatus(del.id, e.target.value as Deliverable['status'])}
                            className="bg-transparent text-[10px] font-bold text-slate-500 focus:outline-none cursor-pointer"
                          >
                            <option value="In Progress">In Progress</option>
                            <option value="On Track">On Track</option>
                            <option value="At Risk">At Risk</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>

                        {/* Slide slider progress */}
                        <div className="flex items-center gap-3 mt-1.5">
                          <input 
                            id={`del-progress-slider-${del.id}`}
                            type="range" 
                            min="0" 
                            max="100" 
                            value={del.progress}
                            onChange={(e) => handleUpdateDeliverableProgress(del.id, Number(e.target.value))}
                            className="flex-1 accent-blue-600 h-1 cursor-pointer"
                          />
                          <span className="text-[10px] font-mono font-bold text-slate-700 w-7 text-right shrink-0">{del.progress}%</span>
                        </div>

                        <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                          <span className="font-medium">Due Connection: {del.dueDate}</span>
                          <span className="font-bold text-blue-600">{del.status}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Deliverable Quick Form */}
                <form onSubmit={handleAddDeliverable} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">New Active Deliverable</p>
                  <div className="grid grid-cols-1 gap-1.5">
                    <input 
                      id="new-del-name-input"
                      type="text" 
                      placeholder="Title: e.g. Core SEO Audit Draft"
                      value={newDelName}
                      onChange={(e) => setNewDelName(e.target.value)}
                      className="bg-white border border-slate-200 text-xs p-1.5 px-2 rounded focus:outline-none text-slate-800"
                      required
                    />
                    <div className="flex gap-2">
                      <input 
                        id="new-del-due-date-input"
                        type="date" 
                        value={newDelDueDate}
                        onChange={(e) => setNewDelDueDate(e.target.value)}
                        className="bg-white border border-slate-200 text-[10px] p-1.5 px-2 rounded focus:outline-none text-slate-800 flex-1"
                        required
                      />
                      <button 
                        id="submit-deliverable-btn"
                        type="submit" 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 rounded cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </form>

              </div>

              {/* Right Column: Timeline notes comments block */}
              <div id="client-notes-card" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">Team Strategy Internal Notes</span>
                  <span className="text-[10px] text-slate-400">Pinned updates</span>
                </div>

                <form onSubmit={handlePostNote} className="flex gap-1.5">
                  <input 
                    id="client-new-note-input"
                    type="text" 
                    placeholder="Type internal accounts updates..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 p-1.5 text-xs rounded focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
                    required
                  />
                  <button 
                    id="submit-client-note-btn"
                    type="submit" 
                    className="bg-slate-800 hover:bg-slate-950 text-white font-bold text-xs px-3.5 rounded"
                  >
                    Post
                  </button>
                </form>

                <div className="space-y-1.5 max-h-[240px] overflow-y-auto">
                  {activeClient.notes.length === 0 ? (
                    <p className="text-xs text-slate-400 italic text-center py-6">No historical updates logged.</p>
                  ) : (
                    activeClient.notes.map((note) => (
                      <div id={`note-block-${note.id}`} key={note.id} className="p-2.5 rounded-lg border bg-slate-50 border-slate-200/80 transition relative group">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-slate-700 text-[11px] leading-relaxed flex-1">{note.text}</p>
                          
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              id={`note-${note.id}-pin-btn`}
                              onClick={() => handleToggleNotePin(note.id)}
                              className={`p-0.5 rounded ${note.isPinned ? 'text-blue-600' : 'text-slate-300 hover:text-slate-500'}`}
                              title={note.isPinned ? "Unpin Note" : "Pin Note"}
                            >
                              <Pin className="w-3 h-3" />
                            </button>
                            <button
                              id={`note-${note.id}-delete-btn`}
                              onClick={() => handleDeleteNote(note.id)}
                              className="text-slate-300 hover:text-rose-600 p-0.5"
                              title="Delete Note"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[9px] text-slate-400 mt-2 border-t border-slate-200/40 pt-1.5">
                          <span className="font-bold text-slate-600">{note.author}</span>
                          <span className="font-mono">{note.date}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* 3. Lower wide row: Billing & Pending invoicing ledger */}
            <div id="client-billing-card" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Billing Snapshot & Invoices Ledger</h3>
                </div>
                
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-slate-500 font-medium">
                    Total Sent: <strong className="text-slate-900">${
                      activeClient.invoices
                        .filter(i => i.status === 'Sent' || i.status === 'Overdue')
                        .reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()
                    }</strong>
                  </span>
                  <span className="text-slate-500 font-medium">
                    Paid Ledger: <strong className="text-emerald-600">${
                      activeClient.invoices
                        .filter(i => i.status === 'Paid')
                        .reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()
                    }</strong>
                  </span>
                </div>
              </div>

              {/* Invoicing main layout split */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
                
                {/* Invoice Table list */}
                <div className="md:col-span-2">
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                    <table className="w-full text-left col-collapse border-collapse">
                      <thead>
                        <tr className="bg-slate-150 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <th className="p-3">Invoice Id</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3">Due Target</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {activeClient.invoices.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-400 italic">No invoices logged. Generate invoice below.</td>
                          </tr>
                        ) : (
                          activeClient.invoices.map((inv) => (
                            <tr id={`invoice-row-${inv.id}`} key={inv.id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-3 font-mono text-[10px] font-bold text-slate-700">INV-2026-{inv.id.slice(-4)}</td>
                              <td className="p-3 font-bold text-slate-900">${inv.amount.toLocaleString()}</td>
                              <td className="p-3 font-mono text-slate-500">{inv.dueDate}</td>
                              <td className="p-3">
                                <span className={`inline-block border px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                  inv.status === 'Paid' 
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                    : inv.status === 'Sent' 
                                      ? 'bg-blue-50 text-blue-700 border-blue-100' 
                                      : inv.status === 'Overdue' 
                                        ? 'bg-rose-50 text-rose-700 border-rose-100' 
                                        : 'bg-slate-100 text-slate-600 border-slate-200'
                                }`}>
                                  {inv.status}
                                </span>
                              </td>
                              <td className="p-3 text-center">
                                <button
                                  id={`delete-invoice-btn-${inv.id}`}
                                  onClick={() => handleDeleteInvoice(inv.id)}
                                  className="text-[10px] text-rose-600 hover:text-rose-800 hover:bg-rose-50 p-1 rounded"
                                  title="Delete transaction log"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Add Invoice Generator Panel */}
                <div className="md:col-span-1 bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2.5">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Generate Client Bill Invoice</p>
                  
                  <form onSubmit={handleAddInvoice} className="space-y-2 text-xs">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">Billable Amount ($)</label>
                      <input 
                        id="new-invoice-amount-input"
                        type="number" 
                        placeholder="5000"
                        value={newInvAmount}
                        onChange={(e) => setNewInvAmount(e.target.value)}
                        className="bg-white border border-slate-200 rounded p-1.5 w-full text-slate-800 font-bold"
                        required
                        min="1"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">Invoice Status</label>
                      <select
                        id="new-invoice-status-select"
                        value={newInvStatus}
                        onChange={(e) => setNewInvStatus(e.target.value as any)}
                        className="bg-white border border-slate-200 rounded p-1.5 w-full text-slate-700 focus:outline-none cursor-pointer"
                      >
                        <option value="Sent">Sent (Awaiting Payment)</option>
                        <option value="Paid">Paid (Add directly to income Ledger)</option>
                        <option value="Overdue">Overdue</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">Payment Due Target</label>
                      <input 
                        id="new-invoice-due-date-input"
                        type="date" 
                        value={newInvDueDate}
                        onChange={(e) => setNewInvDueDate(e.target.value)}
                        className="bg-white border border-slate-200 rounded p-1.5 w-full text-[10px] text-slate-800 focus:outline-none"
                        required
                      />
                    </div>

                    <button
                      id="submit-invoice-btn"
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-1.5 rounded transition shadow-xs cursor-pointer"
                    >
                      Authorize Invoice Log
                    </button>
                  </form>
                </div>

              </div>

            </div>
          </>
        ) : (
          <div className="p-16 bg-white border border-dashed rounded-2xl text-center text-slate-405">
            <p className="font-bold text-lg">No Account Selected</p>
            <p className="text-xs">Search or pick a client directory account from the lateral controller list.</p>
          </div>
        )}

      </div>

      {/* Slide-over Onboard modal */}
      {isAddClientOpen && (
        <div id="add-client-modal-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in px-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-xl space-y-4 animate-scale-up">
            
            <div className="flex items-center justify-between pb-3 border-b border-rose-200">
              <h2 className="text-base font-bold text-slate-900">Onboard New Active Client Account</h2>
              <button 
                id="close-add-client-modal-header-btn"
                onClick={() => setIsAddClientOpen(false)}
                className="text-slate-400 hover:text-slate-650 hover:bg-slate-100 p-1 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 flex flex-col pt-1">
                  <label className="font-bold text-slate-700">Company Brand Name *</label>
                  <input
                    id="client-form-company"
                    type="text"
                    required
                    placeholder="e.g. Paramount Retail"
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    className="p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white text-slate-800 font-bold"
                  />
                </div>

                <div className="space-y-1 flex flex-col pt-1">
                  <label className="font-bold text-slate-700">Primary Contact Person *</label>
                  <input
                    id="client-form-contact"
                    type="text"
                    required
                    placeholder="e.g. Arthur Pendragon"
                    value={formContact}
                    onChange={(e) => setFormContact(e.target.value)}
                    className="p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 flex flex-col pt-1">
                  <label className="font-bold text-slate-700">Business E-mail Address *</label>
                  <input
                    id="client-form-email"
                    type="email"
                    required
                    placeholder="e.g. accounts@paramount.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>

                <div className="space-y-1 flex flex-col pt-1">
                  <label className="font-bold text-slate-700">Telephone Contact</label>
                  <input
                    id="client-form-phone"
                    type="text"
                    placeholder="e.g. +1 (555) 762-0931"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 flex flex-col pt-1">
                  <label className="font-bold text-slate-700">Official Company Website URL</label>
                  <input
                    id="client-form-website"
                    type="text"
                    placeholder="e.g. https://paramount.com"
                    value={formWebsite}
                    onChange={(e) => setFormWebsite(e.target.value)}
                    className="p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>

                <div className="space-y-1 flex flex-col pt-1">
                  <label className="font-bold text-slate-700">Onboarding Annual Contract (ARR)</label>
                  <input
                    id="client-form-value"
                    type="number"
                    placeholder="45000"
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                    className="p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white font-mono text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1 flex flex-col pt-1">
                <label className="font-bold text-slate-700">Phase Status Assignment</label>
                <select
                  id="client-form-status"
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as ClientStatus)}
                  className="p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white text-slate-800 cursor-pointer"
                >
                  <option value="Active">Active Account (In Production)</option>
                  <option value="Onboarding">Onboarding Workspace Setup</option>
                  <option value="Paused">Paused / Pending Scope MSA Amendment</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  id="cancel-add-client-btn"
                  type="button"
                  onClick={() => setIsAddClientOpen(false)}
                  className="px-4 py-2 hover:bg-slate-100 rounded-lg text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  id="confirm-add-client-btn"
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm transition-all"
                >
                  Authorized Onboard Account
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

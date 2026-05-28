import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  UserPlus, 
  Mail, 
  Phone, 
  ArrowUpDown, 
  Plus, 
  X, 
  MoreHorizontal, 
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Edit2
} from 'lucide-react';
import { Lead, TeamMember, LeadStatus } from '../types';

interface LeadsScreenProps {
  leads: Lead[];
  onAddLead: (lead: Omit<Lead, 'id'>) => void;
  onUpdateLead: (lead: Lead) => void;
  onDeleteLeads: (ids: string[]) => void;
  teamMembers: TeamMember[];
  selectedLeadId: string | null;
  setSelectedLeadId: (id: string | null) => void;
}

export default function LeadsScreen({
  leads,
  onAddLead,
  onUpdateLead,
  onDeleteLeads,
  teamMembers,
  selectedLeadId,
  setSelectedLeadId
}: LeadsScreenProps) {
  // Filters configuration
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('All');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('All');

  // Sorting configuration
  const [sortBy, setSortBy] = useState<'dealSize' | 'company' | 'nextFollowUp'>('dealSize');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Selected row checkout (for bulk actions)
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // Modals visibility
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // New lead form inputs
  const [formCompany, setFormCompany] = useState('');
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formSource, setFormSource] = useState('Organic Search');
  const [formDealSize, setFormDealSize] = useState('15000');
  const [formAssignee, setFormAssignee] = useState(teamMembers[0]?.id || '');
  const [formFollowUp, setFormFollowUp] = useState('2026-06-05');
  const [formNotes, setFormNotes] = useState('');

  // Extract unique Sources lists
  const availableSources = useMemo(() => {
    const list = leads.map(l => l.source);
    return ['All', ...Array.from(new Set(list))];
  }, [leads]);

  // Handle lead detail state
  const currentDetailedLead = useMemo(() => {
    return leads.find(l => l.id === selectedLeadId) || null;
  }, [leads, selectedLeadId]);

  // Bulk operation triggers
  const handleBulkDelete = () => {
    if (selectedRowIds.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedRowIds.length} leads?`)) {
      onDeleteLeads(selectedRowIds);
      setSelectedRowIds([]);
    }
  };

  const handleBulkStatusChange = (status: LeadStatus) => {
    if (selectedRowIds.length === 0) return;
    selectedRowIds.forEach(id => {
      const target = leads.find(l => l.id === id);
      if (target) {
        onUpdateLead({ ...target, status });
      }
    });
    setSelectedRowIds([]);
  };

  // Toggle single row checkbox
  const toggleRowSelection = (id: string) => {
    setSelectedRowIds(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  // Toggle select all checkboxes
  const handleToggleAllRows = (visibleLeadIds: string[]) => {
    const allSelectedInVisible = visibleLeadIds.every(id => selectedRowIds.includes(id));
    if (allSelectedInVisible) {
      setSelectedRowIds(prev => prev.filter(id => !visibleLeadIds.includes(id)));
    } else {
      setSelectedRowIds(prev => Array.from(new Set([...prev, ...visibleLeadIds])));
    }
  };

  // Process sorting, filtering, and pagination
  const filteredAndSortedLeads = useMemo(() => {
    let result = [...leads];

    // 1. Search filter
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      result = result.filter(l => 
        l.company.toLowerCase().includes(q) || 
        l.name.toLowerCase().includes(q) || 
        l.email.toLowerCase().includes(q)
      );
    }

    // 2. Status filter
    if (statusFilter !== 'All') {
      result = result.filter(l => l.status === statusFilter);
    }

    // 3. Source filter
    if (sourceFilter !== 'All') {
      result = result.filter(l => l.source === sourceFilter);
    }

    // 4. Assignee filter
    if (assigneeFilter !== 'All') {
      result = result.filter(l => l.assignedTo === assigneeFilter);
    }

    // 5. Sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'dealSize') {
        comparison = a.dealSize - b.dealSize;
      } else if (sortBy === 'company') {
        comparison = a.company.localeCompare(b.company);
      } else if (sortBy === 'nextFollowUp') {
        comparison = a.nextFollowUp.localeCompare(b.nextFollowUp);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [leads, searchTerm, statusFilter, sourceFilter, assigneeFilter, sortBy, sortOrder]);

  // Paginated leads extraction
  const totPages = Math.max(1, Math.ceil(filteredAndSortedLeads.length / itemsPerPage));
  const visibleLeads = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedLeads.slice(start, start + itemsPerPage);
  }, [filteredAndSortedLeads, currentPage]);

  const visibleLeadIds = useMemo(() => visibleLeads.map(l => l.id), [visibleLeads]);

  // Change sort parameters safely
  const handleSortChange = (field: 'dealSize' | 'company' | 'nextFollowUp') => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  // Create lead submittal
  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCompany || !formName || !formEmail) {
      alert('Please fill out all required fields.');
      return;
    }

    onAddLead({
      company: formCompany,
      name: formName,
      email: formEmail,
      phone: formPhone || '(555) 000-0000',
      source: formSource,
      dealSize: Number(formDealSize) || 10000,
      assignedTo: formAssignee,
      status: 'New',
      nextFollowUp: formFollowUp,
      notes: formNotes ? [formNotes] : ['Initial prospect profile created.'],
      logoColor: 'bg-blue-50 text-blue-700 border-blue-200'
    });

    // Reset Form
    setFormCompany('');
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormSource('Organic Search');
    setFormDealSize('15000');
    setFormNotes('');
    setIsAddModalOpen(false);
  };

  // Add a note to current detailed lead
  const handleAddNoteToDetailedLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !currentDetailedLead) return;

    const updatedLead = {
      ...currentDetailedLead,
      notes: [newNoteText, ...currentDetailedLead.notes]
    };
    onUpdateLead(updatedLead);
    setNewNoteText('');
  };

  return (
    <div id="leads-screen-root" className="space-y-6">
      
      {/* Action Header */}
      <div id="leads-header-bar" className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Prospect Pipeline & Leads</h1>
          <p className="text-sm text-slate-500 mt-0.5">Filter, sort, assign, and manage your incoming digital agency deals.</p>
        </div>
        <button
          id="open-add-lead-modal-btn"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-4 rounded-lg shadow-sm transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Custom Prospect</span>
        </button>
      </div>

      {/* Database Filters Bar */}
      <div id="leads-filters-card" className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Text Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input 
              id="leads-search-input"
              type="text"
              placeholder="Search company name, rep contact, or email address..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-50 pl-10 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            
            {/* Status Dropdowns */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="filter-status-select"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="bg-transparent text-xs text-slate-600 focus:outline-none cursor-pointer"
              >
                <option value="All">All Stages</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Converted">Converted</option>
              </select>
            </div>

            {/* Sources Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <select
                id="filter-source-select"
                value={sourceFilter}
                onChange={(e) => { setSourceFilter(e.target.value); setCurrentPage(1); }}
                className="bg-transparent text-xs text-slate-600 focus:outline-none cursor-pointer"
              >
                <option value="All">All Sources</option>
                {availableSources.filter(s => s !== 'All').map(src => (
                  <option key={src} value={src}>{src}</option>
                ))}
              </select>
            </div>

            {/* Rep Assignee Selector */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <select
                id="filter-assignee-select"
                value={assigneeFilter}
                onChange={(e) => { setAssigneeFilter(e.target.value); setCurrentPage(1); }}
                className="bg-transparent text-xs text-slate-600 focus:outline-none cursor-pointer"
              >
                <option value="All">All Reps</option>
                {teamMembers.map(rep => (
                  <option key={rep.id} value={rep.id}>{rep.name.split(' ')[0]}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Clear filters badge helper */}
        {(searchTerm || statusFilter !== 'All' || sourceFilter !== 'All' || assigneeFilter !== 'All') && (
          <div className="flex items-center justify-between bg-blue-50/50 p-2 rounded-lg border border-blue-100/65">
            <p className="text-[11px] text-blue-700 font-semibold">
              Filtered query completed: showing {filteredAndSortedLeads.length} of {leads.length} leads
            </p>
            <button
              id="clear-leads-filters-btn"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
                setSourceFilter('All');
                setAssigneeFilter('All');
              }}
              className="text-[10px] text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Selected Rows Bulk Actions Strip info */}
      {selectedRowIds.length > 0 && (
        <div id="bulk-actions-toolbar" className="flex items-center justify-between bg-slate-900 text-white p-3 px-4 rounded-xl shadow-lg border border-slate-800 animate-slide-in">
          <div className="flex items-center gap-3">
            <span className="text-xs bg-blue-600 font-bold px-2 py-0.5 rounded text-white font-mono">
              {selectedRowIds.length} Selected
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">Bulk actions available:</span>
          </div>

          <div className="flex items-center gap-2">
            <select
              id="bulk-status-select"
              onChange={(e) => {
                if (e.target.value) {
                  handleBulkStatusChange(e.target.value as LeadStatus);
                  e.target.value = '';
                }
              }}
              className="bg-slate-800 text-xs border border-slate-700 p-1 px-2.5 rounded text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="">Move Stage...</option>
              <option value="New">Set New</option>
              <option value="Contacted">Set Contacted</option>
              <option value="Proposal Sent">Set Proposal</option>
              <option value="Negotiation">Set Negotiation</option>
              <option value="Converted">Set Converted</option>
            </select>

            <button
              id="bulk-delete-btn"
              onClick={handleBulkDelete}
              className="bg-rose-950/40 hover:bg-rose-900 border border-rose-800 text-rose-200 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* Main CRM Leads Table / Sidebar Container */}
      <div id="leads-split-view-container" className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-start">
        
        {/* Table Column span elements */}
        <div className={`xl:col-span-2 space-y-3 ${selectedLeadId ? 'xl:col-span-2' : 'xl:col-span-3'}`}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table id="crm-leads-data-table" className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-widest select-none">
                    <th className="p-4 w-10 text-center">
                      <input 
                        id="select-all-leads-checkbox"
                        type="checkbox"
                        checked={visibleLeadIds.length > 0 && visibleLeadIds.every(id => selectedRowIds.includes(id))}
                        onChange={() => handleToggleAllRows(visibleLeadIds)}
                        className="rounded accent-blue-600"
                      />
                    </th>
                    <th 
                      onClick={() => handleSortChange('company')}
                      className="p-4 cursor-pointer hover:bg-slate-100/80 transition-all text-slate-500 hover:text-slate-800"
                    >
                      <div className="flex items-center gap-1">
                        <span>Company & Contact</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="p-4 text-slate-500">Source</th>
                    <th 
                      onClick={() => handleSortChange('dealSize')}
                      className="p-4 text-right cursor-pointer hover:bg-slate-100/80 transition-all text-slate-500 hover:text-slate-800"
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>Deal Size</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="p-4 text-slate-500">Rep Account</th>
                    <th className="p-4 text-slate-500">Status Stage</th>
                    <th 
                      onClick={() => handleSortChange('nextFollowUp')}
                      className="p-4 cursor-pointer hover:bg-slate-100/80 transition-all text-slate-500 text-center hover:text-slate-800"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>Follow-Up</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {visibleLeads.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-16 text-center">
                        <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-2">
                          <ShieldAlert className="w-8 h-8 text-slate-300" />
                          <p className="font-bold text-slate-700">No Prospects Found</p>
                          <p className="text-xs text-slate-400">Try adjusting your filters, searching other terms, or add a custom lead to get started.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    visibleLeads.map((lead) => {
                      const assignee = teamMembers.find(t => t.id === lead.assignedTo) || teamMembers[0];
                      const isSelected = selectedLeadId === lead.id;
                      const isRowChecked = selectedRowIds.includes(lead.id);

                      // Style status badges
                      let bgStatusClass = '';
                      if (lead.status === 'New') bgStatusClass = 'bg-slate-100 text-slate-800 border-slate-200';
                      else if (lead.status === 'Contacted') bgStatusClass = 'bg-blue-50 text-blue-700 border-blue-200';
                      else if (lead.status === 'Proposal Sent') bgStatusClass = 'bg-amber-50 text-amber-700 border-amber-200';
                      else if (lead.status === 'Negotiation') bgStatusClass = 'bg-purple-50 text-purple-700 border-purple-200';
                      else if (lead.status === 'Converted') bgStatusClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';

                      return (
                        <tr 
                          id={`lead-row-${lead.id}`}
                          key={lead.id} 
                          className={`hover:bg-slate-50/75 transition-colors cursor-pointer ${
                            isSelected ? 'bg-blue-50/40 border-l-4 border-l-blue-600' : ''
                          } ${isRowChecked ? 'bg-slate-50/50' : ''}`}
                          onClick={() => setSelectedLeadId(lead.id)}
                        >
                          {/* Row Selector Checkbox */}
                          <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <input 
                              id={`checkbox-lead-row-${lead.id}`}
                              type="checkbox"
                              checked={isRowChecked}
                              onChange={() => toggleRowSelection(lead.id)}
                              className="rounded accent-blue-600"
                            />
                          </td>

                          {/* Company / Name */}
                          <td className="p-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900 text-sm">{lead.company}</span>
                              <span className="text-[11px] text-slate-500 font-medium mt-0.5">{lead.name}</span>
                            </div>
                          </td>

                          {/* Source */}
                          <td className="p-4 text-slate-500 font-medium">{lead.source}</td>

                          {/* Deal size */}
                          <td className="p-4 text-right font-mono font-bold text-slate-900 select-all">
                            ${lead.dealSize.toLocaleString()}
                          </td>

                          {/* Assignee */}
                          <td className="p-4">
                            <div className="flex items-center gap-1.5">
                              <div className="w-5.5 h-5.5 rounded-full bg-slate-800 text-slate-200 text-[9px] font-bold flex items-center justify-center border border-slate-200">
                                {assignee.avatar}
                              </div>
                              <span className="text-slate-600 font-medium">{assignee.name.split(' ')[0]}</span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="p-4">
                            <span className={`inline-block border rounded-full px-2.5 py-0.5 text-[10px] font-bold ${bgStatusClass}`}>
                              {lead.status}
                            </span>
                          </td>

                          {/* Next Follow-up */}
                          <td className="p-4 text-center font-mono">
                            <div className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                              <Clock className="w-2.5 h-2.5 text-slate-400" />
                              <span>{lead.nextFollowUp}</span>
                            </div>
                          </td>

                          {/* Action details trigger */}
                          <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <button
                              id={`view-lead-details-btn-${lead.id}`}
                              onClick={() => setSelectedLeadId(lead.id)}
                              className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold py-1 px-2.5 rounded hover:bg-blue-50/80 transition-all"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls bar */}
            {filteredAndSortedLeads.length > itemsPerPage && (
              <div id="leads-pagination-footer" className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  Page {currentPage} of {totPages} ({filteredAndSortedLeads.length} leads total)
                </span>

                <div className="flex gap-1.5">
                  <button
                    id="prev-leads-page-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    id="next-leads-page-btn"
                    disabled={currentPage === totPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lead profile screen details drill down sidebar */}
        {selectedLeadId && currentDetailedLead && (
          <div id="leads-sidebar-detail-panel" className="bg-white rounded-2xl border border-blue-200 shadow-md p-5 sticky top-24 space-y-5 animate-slide-in">
            
            {/* Sidebar header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                  {currentDetailedLead.company.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">{currentDetailedLead.company}</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Prospect Summary Profile</p>
                </div>
              </div>
              <button
                id="close-lead-detail-btn"
                onClick={() => setSelectedLeadId(null)}
                className="text-slate-400 hover:text-slate-700 p-1 hover:bg-slate-100 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stage Quick update pill */}
            <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Prospect Deal Status</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <select 
                  id={`detail-lead-status-select-${currentDetailedLead.id}`}
                  value={currentDetailedLead.status}
                  onChange={(e) => onUpdateLead({ ...currentDetailedLead, status: e.target.value as Lead['status'] })}
                  className="bg-white text-xs text-slate-800 font-semibold p-1 px-2 border border-slate-200 rounded focus:outline-none w-full cursor-pointer"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Converted">Converted</option>
                </select>
              </div>
            </div>

            {/* Informative fields */}
            <div className="space-y-3.5 text-xs text-slate-700">
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Contact Person</p>
                <p className="font-bold text-slate-800 mt-0.5">{currentDetailedLead.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Email Contact</p>
                  <p className="font-medium text-slate-700 mt-0.5 flex items-center gap-1 select-all">
                    <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{currentDetailedLead.email}</span>
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Phone</p>
                  <p className="font-medium text-slate-700 mt-0.5 flex items-center gap-1 select-all">
                    <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{currentDetailedLead.phone}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Deal Size</p>
                  <p className="font-bold text-slate-900 mt-0.5 font-mono">
                    ${currentDetailedLead.dealSize.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Source Channel</p>
                  <p className="font-medium text-slate-700 mt-0.5">{currentDetailedLead.source}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Owner / Assigned Account Rep</p>
                <div className="flex items-center gap-1.5 mt-1 border border-slate-100 p-1.5 rounded-lg bg-slate-50/50">
                  <select
                    id={`detail-lead-assignee-select-${currentDetailedLead.id}`}
                    value={currentDetailedLead.assignedTo}
                    onChange={(e) => onUpdateLead({ ...currentDetailedLead, assignedTo: e.target.value })}
                    className="bg-transparent text-xs w-full font-medium text-slate-700 focus:outline-none cursor-pointer"
                  >
                    {teamMembers.map(rep => (
                      <option key={rep.id} value={rep.id}>{rep.name} ({rep.role})</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Action History / Notes */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Interaction Notes Timeline</p>
              
              <form onSubmit={handleAddNoteToDetailedLead} className="flex gap-1.5">
                <input
                  id="prospect-new-note-input"
                  type="text"
                  placeholder="Log quick comment / update note..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 p-1.5 text-[11px] rounded focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
                />
                <button
                  id="submit-prospect-note-btn"
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-2.5 rounded hover:scale-101 active:scale-99 transition-all"
                >
                  Log
                </button>
              </form>

              <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                {currentDetailedLead.notes.map((note, idx) => (
                  <div id={`prospect-note-item-${idx}`} key={idx} className="bg-slate-50 p-2 rounded border border-slate-100 text-[11px] text-slate-600 leading-normal">
                    {note}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick delete check */}
            <div className="pt-2">
              <button
                id={`delete-single-lead-btn-${currentDetailedLead.id}`}
                onClick={() => {
                  if (window.confirm("Delete this prospect from NovaFlow CRM?")) {
                    onDeleteLeads([currentDetailedLead.id]);
                    setSelectedLeadId(null);
                  }
                }}
                className="w-full text-slate-400 hover:text-rose-600 font-semibold hover:bg-rose-50 text-[10px] text-center p-2 rounded transition-all border border-transparent hover:border-rose-100"
              >
                Archive Prospect Lead
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Slide Under overlay add Modal */}
      {isAddModalOpen && (
        <div id="add-lead-modal-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in px-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-xl space-y-4 animate-scale-up">
            
            <div className="flex items-center justify-between pb-3 border-b border-rose-200">
              <h2 className="text-base font-bold text-slate-900">Add New Active Prospect</h2>
              <button 
                id="close-add-lead-modal-header-btn"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 flex flex-col">
                  <label className="font-bold text-slate-700">Company Name *</label>
                  <input
                    id="form-company-name"
                    type="text"
                    required
                    placeholder="e.g. Apex Fitness"
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    className="p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>

                <div className="space-y-1 flex flex-col">
                  <label className="font-bold text-slate-700">Contact Point Name *</label>
                  <input
                    id="form-contact-name"
                    type="text"
                    required
                    placeholder="e.g. Jake Mercer"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 flex flex-col">
                  <label className="font-bold text-slate-700">Business Email *</label>
                  <input
                    id="form-contact-email"
                    type="email"
                    required
                    placeholder="jake@apexfitness.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>

                <div className="space-y-1 flex flex-col">
                  <label className="font-bold text-slate-700">Phone Connection</label>
                  <input
                    id="form-contact-phone"
                    type="text"
                    placeholder="e.g. +1 (555) 234-5678"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1 flex flex-col">
                  <label className="font-bold text-slate-700">Estimated Value ($)</label>
                  <input
                    id="form-deal-size"
                    type="number"
                    placeholder="15000"
                    value={formDealSize}
                    onChange={(e) => setFormDealSize(e.target.value)}
                    className="p-2 border border-slate-200 rounded-lg text-xs font-mono bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>

                <div className="space-y-1 flex flex-col">
                  <label className="font-bold text-slate-700">Acquisition Source</label>
                  <select
                    id="form-acquisition-source"
                    value={formSource}
                    onChange={(e) => setFormSource(e.target.value)}
                    className="p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white text-slate-800 cursor-pointer"
                  >
                    <option value="Organic Search">Organic Search</option>
                    <option value="LinkedIn Outreach">LinkedIn Outreach</option>
                    <option value="Referral">Referral</option>
                    <option value="Web Form">Web Form</option>
                    <option value="Inbound Call">Inbound Call</option>
                    <option value="Cold Email">Cold Email</option>
                  </select>
                </div>

                <div className="space-y-1 flex flex-col">
                  <label className="font-bold text-slate-700">Assigned Rep</label>
                  <select
                    id="form-assigned-rep"
                    value={formAssignee}
                    onChange={(e) => setFormAssignee(e.target.value)}
                    className="p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white text-slate-800 cursor-pointer"
                  >
                    {teamMembers.map(u => (
                      <option key={u.id} value={u.id}>{u.name.split(' ')[0]} ({u.role.split(' ')[0]})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1 flex flex-col">
                  <label className="font-bold text-slate-700">Next Follow-Up Target Date</label>
                  <input
                    id="form-followup-date"
                    type="date"
                    value={formFollowUp}
                    onChange={(e) => setFormFollowUp(e.target.value)}
                    className="p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1 flex flex-col">
                <label className="font-bold text-slate-700">Initial Discovery Notes</label>
                <textarea
                  id="form-discovery-notes"
                  rows={2}
                  placeholder="Summarize product requests, budget guidelines, or customer details..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="p-2 border border-slate-200 rounded-lg text-xs resize-none bg-slate-50 focus:bg-white text-slate-800"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  id="cancel-add-lead-btn"
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 hover:bg-slate-100 rounded-lg text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  id="confirm-add-lead-btn"
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm hover:scale-101 transition-all"
                >
                  Create Prospect
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

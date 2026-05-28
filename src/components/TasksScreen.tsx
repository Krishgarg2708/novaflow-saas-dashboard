import React, { useState, useMemo } from 'react';
import { 
  CheckSquare, 
  Square, 
  Clock, 
  Trash2, 
  Plus, 
  Filter, 
  PlusCircle, 
  ListTodo, 
  ChevronRight,
  Sparkles,
  AlertTriangle,
  User,
  CheckCircle,
  FolderLock
} from 'lucide-react';
import { Task, TeamMember, TaskStatus, TaskPriority } from '../types';

interface TasksScreenProps {
  tasks: Task[];
  teamMembers: TeamMember[];
  onAddTask: (task: Omit<Task, 'id' | 'createdDate'>) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  openQuickAddTask?: boolean;
  onCloseQuickAddTask?: () => void;
}

export default function TasksScreen({
  tasks,
  teamMembers,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  openQuickAddTask = false,
  onCloseQuickAddTask
}: TasksScreenProps) {
  // Tabs for statuses
  const [currentStatusTab, setCurrentStatusTab] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Quick Inline creation state
  const [quickTitle, setQuickTitle] = useState('');
  const [quickPriority, setQuickPriority] = useState<TaskPriority>('Medium');
  const [quickDueDate, setQuickDueDate] = useState('2026-06-03');
  const [quickAssignee, setQuickAssignee] = useState(teamMembers[0]?.id || 'team-1');
  const [quickClient, setQuickClient] = useState('');

  // Filter list
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchesStatus = currentStatusTab === 'All' || t.status === currentStatusTab;
      const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
      const matchesQuery = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (t.clientName && t.clientName.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesStatus && matchesPriority && matchesQuery;
    });
  }, [tasks, currentStatusTab, priorityFilter, searchTerm]);

  // Handle submit of Quick inline Task
  const handleInlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    onAddTask({
      title: quickTitle,
      priority: quickPriority,
      status: 'To Do',
      assignedTo: quickAssignee,
      dueDate: quickDueDate,
      clientName: quickClient || undefined
    });

    setQuickTitle('');
    setQuickClient('');
  };

  // Toggle checklist checkbox
  const handleCheckCircleToggle = (task: Task) => {
    onUpdateTask({
      ...task,
      status: task.status === 'Completed' ? 'To Do' : 'Completed'
    });
  };

  const handleStatusChangeBtn = (task: Task, newStatus: TaskStatus) => {
    onUpdateTask({
      ...task,
      status: newStatus
    });
  };

  const todayStr = '2026-05-28'; // Current mock date from metadata

  return (
    <div id="tasks-module-root" className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
      
      {/* 1. Main Checklist Column */}
      <div className="xl:col-span-3 space-y-4">
        
        {/* Module Header card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ListTodo className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">Internal Project Tasks</h1>
              <p className="text-xs text-slate-500">Coordinate workspace operational items and track account team execution.</p>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <span className="text-xs font-mono font-bold bg-slate-50 border border-slate-200 py-1 px-3 rounded text-slate-700">
              Completed Checklist: {tasks.filter(t => t.status === 'Completed').length}/{tasks.length}
            </span>
          </div>
        </div>

        {/* Task category Filter tabs */}
        <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            {['All', 'To Do', 'In Progress', 'Waiting', 'Completed'].map((tab) => {
              const tabCount = tab === 'All' ? tasks.length : tasks.filter(t => t.status === tab).length;
              return (
                <button
                  id={`task-tab-btn-${tab}`}
                  key={tab}
                  onClick={() => setCurrentStatusTab(tab)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                    currentStatusTab === tab 
                      ? 'bg-slate-900 text-white shadow-xs' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>{tab}</span>
                  <span className={`text-[10px] px-1.5 rounded-full ${
                    currentStatusTab === tab ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tabCount}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-bold shrink-0">Priority:</span>
            <select
              id="tasks-priority-filter-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded text-xs p-1 focus:outline-none cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="High">🔴 High Only</option>
              <option value="Medium">🟡 Medium Only</option>
              <option value="Low">🟢 Low Only</option>
            </select>
          </div>
        </div>

        {/* Real-time search */}
        <div className="relative">
          <input 
            id="tasks-search-input"
            type="text" 
            placeholder="Search operational tasks by title or client name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 p-2.5 px-4 rounded-xl text-xs focus:outline-none focus:border-blue-500 text-slate-800"
          />
        </div>

        {/* Task Items Directory stack */}
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {filteredTasks.length === 0 ? (
            <div className="p-16 bg-white border border-dashed text-center rounded-2xl text-slate-400">
              <p className="font-bold text-sm">No operational tasks found</p>
              <p className="text-xs">Adjust your search criteria or write a task below.</p>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const assignee = teamMembers.find(t => t.id === task.assignedTo) || teamMembers[0];
              const isCompleted = task.status === 'Completed';
              const isOverdue = !isCompleted && task.dueDate < todayStr;
              
              return (
                <div 
                  id={`task-item-${task.id}`}
                  key={task.id} 
                  className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white ${
                    isCompleted 
                      ? 'border-slate-200/60 opacity-65 bg-slate-50/40' 
                      : isOverdue 
                        ? 'border-rose-200/95 bg-rose-50/30' 
                        : 'border-slate-200 hover:border-slate-350 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Toggle button check */}
                    <button
                      id={`task-toggle-btn-${task.id}`}
                      onClick={() => handleCheckCircleToggle(task)}
                      className="mt-0.5 text-slate-400 hover:text-blue-600 cursor-pointer shrink-0"
                    >
                      {isCompleted ? (
                        <CheckSquare className="w-4.5 h-4.5 text-blue-600 fill-blue-50" />
                      ) : (
                        <Square className="w-4.5 h-4.5 text-slate-300 hover:text-slate-500" />
                      )}
                    </button>

                    <div className="space-y-0.5 min-w-0">
                      <p className={`text-xs font-bold leading-normal truncate ${
                        isCompleted ? 'line-through text-slate-400' : 'text-slate-800'
                      }`}>
                        {task.title}
                      </p>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        {task.clientName && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded leading-none">
                            {task.clientName}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">Created: {task.createdDate || 'May 26'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Operational stats row */}
                  <div className="flex items-center gap-3 justify-between sm:justify-end shrink-0 text-xs">
                    
                    {/* Urgency tag details */}
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        task.priority === 'High' 
                          ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                          : task.priority === 'Medium' 
                            ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      }`}>
                        {task.priority} Priority
                      </span>

                      {/* Due connection reminder tag */}
                      <span className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded border font-mono ${
                        isOverdue 
                          ? 'bg-rose-50 border-rose-200 text-rose-700 font-bold' 
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}>
                        <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{task.dueDate}</span>
                        {isOverdue && <AlertTriangle className="w-2.5 h-2.5 text-rose-500 animate-bounce" />}
                      </span>
                    </div>

                    {/* Team Rep Owner */}
                    <div className="flex items-center gap-1.5">
                      <div className="w-5.5 h-5.5 rounded-full bg-slate-800 text-slate-200 font-bold text-[9px] flex items-center justify-center" title={assignee.name}>
                        {assignee.avatar}
                      </div>

                      {/* Delete command row */}
                      <button
                        id={`delete-single-task-btn-${task.id}`}
                        onClick={() => onDeleteTask(task.id)}
                        className="text-slate-300 hover:text-rose-600 p-1 rounded-md transition"
                        title="Delete operational task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* 2. Right Creation Sidebar Panel */}
      <div id="tasks-creator-sidebar" className="xl:col-span-1 space-y-4">
        
        {/* Quick Create block */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100">
            <Sparkles className="w-4.5 h-4.5 text-blue-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">New Internal Task</h3>
          </div>

          <form onSubmit={handleInlineSubmit} className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-600">Task Title *</label>
              <input 
                id="tasks-input-title"
                type="text" 
                placeholder="e.g. Schedule audit with Alpha"
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:bg-white text-slate-800"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600">Client Account Link</label>
              <input 
                id="tasks-input-client"
                type="text" 
                placeholder="e.g. Alfa Retail (Optional)"
                value={quickClient}
                onChange={(e) => setQuickClient(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:bg-white text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-bold text-slate-600">Priority Level</label>
                <select
                  id="tasks-input-priority"
                  value={quickPriority}
                  onChange={(e) => setQuickPriority(e.target.value as TaskPriority)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-600 focus:bg-white cursor-pointer"
                >
                  <option value="High">🔴 High Priority</option>
                  <option value="Medium">🟡 Medium Priority</option>
                  <option value="Low">🟢 Low Priority</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600">Target Rep</label>
                <select
                  id="tasks-input-assignee"
                  value={quickAssignee}
                  onChange={(e) => setQuickAssignee(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-600 focus:bg-white cursor-pointer"
                >
                  {teamMembers.map(m => (
                    <option key={m.id} value={m.id}>{m.name.split(' ')[0]}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600">Target Due Date</label>
              <input 
                id="tasks-input-due-date"
                type="date" 
                value={quickDueDate}
                onChange={(e) => setQuickDueDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:bg-white"
                required
              />
            </div>

            <button
              id="tasks-sidebar-submit-btn"
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-750 text-white font-bold p-2 rounded-lg transition-all text-xs"
            >
              Add Operational Task
            </button>
          </form>
        </div>

        {/* Informative Workspace Policies widget */}
        <div className="bg-slate-50/70 p-4 border border-slate-200 rounded-2xl text-[10px] text-slate-400 space-y-2.5">
          <p className="font-bold uppercase tracking-wider text-slate-500">Workspace Task Guidelines</p>
          <ul className="list-disc pl-4 space-y-1 font-medium leading-relaxed">
            <li>Any checklist item overdue by 3 days automatically alerts Account Supervisors.</li>
            <li>Tag appropriate partner client names to generate proper Deliverables correlation in CRM metrics.</li>
          </ul>
        </div>

      </div>

    </div>
  );
}

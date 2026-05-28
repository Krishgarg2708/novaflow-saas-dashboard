import React from 'react';
import { 
  LayoutDashboard, 
  Users2, 
  Briefcase, 
  CheckSquare, 
  Calendar, 
  TrendingUp, 
  Contact2, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Command,
  Plus
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onOpenQuickAction: () => void;
  adminName?: string;
  adminEmail?: string;
  onLogout?: () => void;
}

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  collapsed, 
  setCollapsed,
  onOpenQuickAction,
  adminName,
  adminEmail,
  onLogout
}: SidebarProps) {
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads Pipeline', icon: Users2, badge: '5' },
    { id: 'clients', label: 'Clients Directory', icon: Briefcase },
    { id: 'tasks', label: 'Internal Tasks', icon: CheckSquare, badge: '3' },
    { id: 'calendar', label: 'Agency Calendar', icon: Calendar },
    { id: 'analytics', label: 'Performance Analytics', icon: TrendingUp },
    { id: 'team', label: 'My Agency Team', icon: Contact2 },
  ];

  return (
    <div 
      id="sidebar-container"
      className={`bg-slate-900 text-white min-h-screen border-r border-slate-800 transition-all duration-300 flex flex-col justify-between sticky top-0 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Brand Block */}
      <div>
        <div id="sidebar-brand-wrapper" className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div id="brand-logo-name-group" className="flex items-center gap-3 overflow-hidden">
            <div id="brand-avatar" className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/10 flex-shrink-0">
              <Command className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div id="brand-titles" className="flex flex-col select-none animate-fade-in">
                <span className="font-bold text-sm tracking-tight text-white leading-none">NovaFlow</span>
                <span className="text-[10px] text-slate-400 font-medium mt-1">Digital Agency CRM</span>
              </div>
            )}
          </div>
          
          <button 
            id="sidebar-collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors hidden md:block"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Workspace Switcher */}
        {!collapsed ? (
          <div id="workspace-switcher" className="p-3 mx-3 my-4 bg-slate-800/50 border border-slate-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Workspace</p>
                <p className="text-xs font-semibold text-white">NovaFlow Core HQ</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active Core Session"></span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center my-4">
            <span className="w-2, h-2 p-1 rounded-full bg-emerald-500" title="Active Session"></span>
          </div>
        )}

        {/* Core Navigation Links */}
        <div id="sidebar-navigation-menu" className="px-2 py-2 space-y-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                id={`sidebar-nav-btn-${item.id}`}
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-155 group relative ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/10' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <IconComponent className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                
                {!collapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}
                
                {!collapsed && item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold leading-none ${
                    isActive ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}

                {/* Collapsed Tooltip fallback */}
                {collapsed && (
                  <div className="absolute left-16 bg-slate-950 text-white text-xs py-1.5 px-3 rounded-md shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Profile and Settings */}
      <div className="p-2 border-t border-slate-800 space-y-1">
        
        {/* Quick Action Button */}
        {!collapsed ? (
          <div className="px-2 py-2">
            <button 
              id="sidebar-quick-task-btn"
              onClick={onOpenQuickAction}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold py-2 px-3 rounded-lg border border-slate-700/80 transition-all hover:border-slate-600 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-blue-400" />
              <span>Quick Create Task</span>
            </button>
          </div>
        ) : (
          <div className="flex justify-center p-1">
            <button 
              id="sidebar-quick-task-btn-collapsed"
              onClick={onOpenQuickAction}
              className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center border border-slate-700 shadow-sm"
              title="Quick Create Task"
            >
              <Plus className="w-5 h-5 text-blue-400" />
            </button>
          </div>
        )}

        <div 
          onClick={onLogout}
          className="flex items-center gap-3 p-2 rounded-xl bg-slate-950/40 border border-slate-900 cursor-pointer hover:bg-slate-800 transition-all"
          title="Click to logout / setup credentials"
        >
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-900 border border-blue-200 font-bold flex items-center justify-center text-xs flex-shrink-0">
            {adminName ? adminName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'KG'}
          </div>
          {!collapsed && (
            <div className="flex-1 truncate select-none col-span-1">
              <p className="text-xs font-medium text-white truncate leading-none mb-0.5">{adminName || 'Krish Garg'}</p>
              <p className="text-[10px] text-slate-400 truncate">{adminEmail || 'krish@novaflow'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

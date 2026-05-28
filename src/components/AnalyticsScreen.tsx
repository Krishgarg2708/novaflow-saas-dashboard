import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShieldCheck, 
  Sparkles, 
  Compass, 
  Percent, 
  Award,
  Users2,
  CalendarDays
} from 'lucide-react';
import { TeamMember, Lead, Client } from '../types';

interface AnalyticsScreenProps {
  leads: Lead[];
  clients: Client[];
  teamMembers: TeamMember[];
}

export default function AnalyticsScreen({
  leads,
  clients,
  teamMembers
}: AnalyticsScreenProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'Q1' | 'Q2' | 'Full'>('Full');

  // Revenue totals
  const activeArrSum = clients.reduce((sum, c) => sum + c.contractValue, 0);
  
  // Accounts Outstanding (Sent / Unpaid invoices)
  const outstandingInvoices = clients.reduce((sum, c) => {
    const outstanding = c.invoices
      .filter(i => i.status === 'Sent' || i.status === 'Overdue')
      .reduce((s, inv) => s + inv.amount, 0);
    return sum + outstanding;
  }, 0);

  // Completed Invoices (Paid)
  const paidInvoicesTotal = clients.reduce((sum, c) => {
    const paid = c.invoices
      .filter(i => i.status === 'Paid')
      .reduce((s, inv) => s + inv.amount, 0);
    return sum + paid;
  }, 0);

  // Conversion computation
  // Leads: Converted status vs All leads
  const totalLeadsCount = leads.length;
  const convertedLeadsCount = leads.filter(l => l.status === 'Converted').length;
  const leadConversionRate = totalLeadsCount > 0 
    ? ((convertedLeadsCount / totalLeadsCount) * 100).toFixed(1)
    : "25.0";

  // Data for the custom styled Vector SVG Bar graph
  // Monthly Revenues in 2026: Jan, Feb, Mar, Apr, May, Jun (Projected)
  const monthlyRevenueData = [
    { name: 'Jan', amount: 32000, color: '#3b82f6' },
    { name: 'Feb', amount: 48000, color: '#3b82f6' },
    { name: 'Mar', amount: 45000, color: '#3b82f6' },
    { name: 'Apr', amount: 62000, color: '#3b82f6' },
    { name: 'May', amount: 74000, color: '#2563eb' }, // High month
    { name: 'Jun', amount: 89000, color: '#10b981' }  // Projected high
  ];

  // Sources count
  const sourceStats = [
    { channel: 'Organic Search', value: 40, count: 8, color: 'bg-emerald-500 text-emerald-700' },
    { channel: 'Referral Pipeline', value: 30, count: 6, color: 'bg-blue-500 text-blue-700' },
    { channel: 'LinkedIn Business Outreach', value: 20, count: 4, color: 'bg-indigo-500 text-indigo-700' },
    { channel: 'Inbound Web Forms', value: 10, count: 2, color: 'bg-amber-500 text-amber-700' }
  ];

  return (
    <div id="analytics-screen-root" className="space-y-6">
      
      {/* 1. Header block */}
      <div id="analytics-header-card" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Performance & Financial Analytics</h1>
          <p className="text-sm text-slate-500 mt-0.5">Real-time indicators, deal conversion graphs, and revenue growth margins.</p>
        </div>

        <div className="flex gap-1.5 p-0.5 bg-slate-100 rounded-lg text-xs self-start md:self-auto">
          {['Q1 Only', 'Q2 Only', 'Full Year'].map((tf, i) => (
            <button
              id={`tf-btn-${i}`}
              key={tf}
              onClick={() => setSelectedTimeframe(i === 0 ? 'Q1' : i === 1 ? 'Q2' : 'Full')}
              className={`font-semibold py-1 px-3 rounded-md transition ${
                (i === 2 && selectedTimeframe === 'Full') || (i === 1 && selectedTimeframe === 'Q2') || (i === 0 && selectedTimeframe === 'Q1')
                  ? 'bg-white text-slate-800 shadow-xs' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Stat Widgets banner */}
      <div id="analytics-kpi-row" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Active Arr size */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Portfolio ARR</span>
            <h3 className="text-xl font-extrabold text-slate-900 font-mono">${activeArrSum.toLocaleString()}</h3>
            <p className="text-[10px] text-emerald-600 flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.3% compounding vs startup state</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Closed Conversion efficiency */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Client Conversion Efficiency</span>
            <h3 className="text-xl font-extrabold text-slate-900 font-mono">{leadConversionRate}%</h3>
            <p className="text-[10px] text-blue-600 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Target conversion benchmark: 25.0%</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
            <Percent className="w-5 h-5" />
          </div>
        </div>

        {/* Pending A/R accounts outstanding */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">A/R outstanding ledgers</span>
            <h3 className="text-xl font-extrabold text-slate-900 font-mono">${outstandingInvoices.toLocaleString()}</h3>
            <p className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold">
              <CalendarDays className="w-3.5 h-3.5 text-slate-350" />
              <span>Awaiting payment clearance drafts</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Compass className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* 3. Splitting: Major custom Revenue Bar Chart + Source Distribution breakdown */}
      <div id="analytics-visuals-gird" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column width span: Multi month Bar chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-150">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Monthly Billable Capital Trends (2026)</h3>
              <p className="text-[10px] text-slate-400 font-medium">Monthly cleared invoices comparing design and core engineering services.</p>
            </div>
            
            <div className="flex items-center gap-3.5 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-blue-600 block"></span>
                <span className="text-slate-500 font-semibold text-[10px]">Actual Clears</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500 block"></span>
                <span className="text-slate-500 font-semibold text-[10px]">Projected Pipeline</span>
              </span>
            </div>
          </div>

          {/* Premium custom Vector SVG Bar graph */}
          <div id="revenue-graph-wrapper" className="pt-6">
            <div className="relative h-60 w-full">
              {/* Y Axis Guides */}
              <div className="absolute inset-y-0 left-0 w-12 flex flex-col justify-between text-[10px] font-mono font-bold text-slate-400 pb-6 pr-2 select-none border-r border-slate-100">
                <span>$90k</span>
                <span>$60k</span>
                <span>$30k</span>
                <span>$0</span>
              </div>

              {/* Chart Grid columns drawing */}
              <div className="ml-14 h-full flex items-end justify-between pb-6 relative">
                {/* Horizontal Guide Lines */}
                <span className="absolute left-0 right-0 border-t border-slate-100/80" style={{ bottom: 'calc(100% - 10px)' }}></span>
                <span className="absolute left-0 right-0 border-t border-slate-100/80" style={{ bottom: 'calc(66%)' }}></span>
                <span className="absolute left-0 right-0 border-t border-slate-100/80" style={{ bottom: 'calc(33%)' }}></span>
                <span className="absolute left-0 right-0 border-t border-slate-150" style={{ bottom: '0px' }}></span>

                {/* Individual Bars mapping */}
                {monthlyRevenueData.map((data, idx) => {
                  const maxAmount = 90000;
                  const percentHeight = (data.amount / maxAmount) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group px-2 sm:px-4">
                      {/* Tooltip value */}
                      <span className="opacity-0 group-hover:opacity-100 bg-slate-900 text-white font-mono font-bold text-[9px] py-1 px-1.5 rounded absolute -translate-y-9 transition-opacity z-10 shadow shadow-slate-950/20">
                        ${(data.amount / 1000).toFixed(0)}k
                      </span>

                      {/* Bar Column body */}
                      <div 
                        className="w-full rounded-t-md transition-all duration-300 hover:brightness-95 hover:shadow-sm"
                        style={{ 
                          height: `${percentHeight}%`, 
                          backgroundColor: data.color
                        }}
                      ></div>

                      {/* X Axis element */}
                      <span className="text-[10px] font-bold text-slate-400 mt-2 block font-mono">
                        {data.name}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>

        {/* Right Column width span: Lead Sources breakdown */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="pb-2 border-b border-slate-150">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-sans">Acquisition Channels Breakdown</h3>
            <p className="text-[10px] text-slate-400 font-medium">Compiled lead sources for current active pipeline.</p>
          </div>

          <div className="space-y-4 pt-2">
            {sourceStats.map((st, i) => (
              <div id={`source-stat-item-${i}`} key={st.channel} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">{st.channel}</span>
                  <span className="font-mono text-slate-400 font-bold">{st.value}% ({st.count} leads)</span>
                </div>
                
                {/* Horizontal custom bar progress indicator */}
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-blue-600 transition-all duration-500"
                    style={{ 
                      width: `${st.value}%`,
                      backgroundColor: i === 0 ? '#10b981' : i === 1 ? '#3b82f6' : i === 2 ? '#6366f1' : '#f59e0b'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick marketing recommendations advice widget */}
          <div className="bg-blue-50/50 p-3.5 border border-blue-100/60 rounded-xl text-[10px] text-blue-750 font-semibold space-y-1">
            <p className="font-bold text-blue-800">Compounding Advice:</p>
            <p className="leading-relaxed">
              Organic search and referrals aggregate 70% of total agency revenue. Recommend allocating larger SEO team bandwidth in Q3.
            </p>
          </div>

        </div>

      </div>

      {/* 4. Lower block: Team Operational performance metrics row */}
      <div id="analytics-team-report-card" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <Award className="w-5.5 h-5.5 text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Team Workload & Satisfaction Scores</span>
          </div>
          <span className="text-xs font-semibold text-slate-400">Compiling 5 active reps</span>
        </div>

        {/* Rep Table metrics */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs col-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-400 text-[10px] uppercase tracking-wider">
                <th className="p-3">Team Member</th>
                <th className="p-3">Role Designation</th>
                <th className="p-3">Active Clients</th>
                <th className="p-3">Completed Tasks</th>
                <th className="p-3">satisfaction Score</th>
                <th className="p-3">Allocated Workload</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-105">
              {teamMembers.map((member) => (
                <tr id={`analytics-team-row-${member.id}`} key={member.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-900 border text-slate-200 text-[10px] font-bold flex items-center justify-center">
                        {member.avatar}
                      </div>
                      <span className="font-bold text-slate-850">{member.name}</span>
                    </div>
                  </td>

                  <td className="p-3 text-slate-500 font-medium">{member.role}</td>
                  
                  <td className="p-3 font-semibold text-slate-700 font-mono">{member.activeClients} accounts</td>
                  
                  <td className="p-3 font-semibold text-slate-700 font-mono">{member.completedTasks} tasks</td>
                  
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <span className="font-mono font-bold text-slate-800">{member.rating}%</span>
                      <span className="text-[10px] text-emerald-600 font-bold">Excellent</span>
                    </div>
                  </td>

                  {/* Workload progress meter */}
                  <td className="p-3">
                    <div className="space-y-1 w-32">
                      <div className="flex justify-between items-center text-[9px] font-semibold text-slate-500">
                        <span>Utilization</span>
                        <span>{member.workload}%</span>
                      </div>
                      <div className="h-1 text-slate-100 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all`}
                          style={{
                            width: `${member.workload}%`,
                            backgroundColor: member.workload > 80 ? '#f59e0b' : '#3b82f6'
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>

                  {/* Available indicator */}
                  <td className="p-3 text-center">
                    <span className={`inline-block border text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      member.status === 'online' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : member.status === 'busy' 
                          ? 'bg-amber-100 text-amber-700 border-amber-100' 
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {member.status}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}

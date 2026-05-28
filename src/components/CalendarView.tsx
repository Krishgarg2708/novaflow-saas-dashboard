import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Video, 
  PhoneCall, 
  Sparkles,
  Award,
  Users
} from 'lucide-react';
import { CalendarEvent, TeamMember } from '../types';

interface CalendarViewProps {
  events: CalendarEvent[];
  teamMembers: TeamMember[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
}

export default function CalendarView({
  events,
  teamMembers,
  onAddEvent
}: CalendarViewProps) {
  // May 2026 active Month representation
  // May 1st, 2026 is a Friday. May 2026 has 31 days.
  const [currentView, setCurrentView] = useState<'monthly' | 'weekly'>('monthly');
  const [selectedDate, setSelectedDate] = useState<string>('2026-05-29'); // Target Friday mock date

  // Add event form triggers
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('2026-05-29');
  const [formTime, setFormTime] = useState('11:00');
  const [formDuration, setFormDuration] = useState('30m');
  const [formType, setFormType] = useState<CalendarEvent['type']>('Meeting');
  const [formClient, setFormClient] = useState('');
  const [formAssignee, setFormAssignee] = useState(teamMembers[0]?.id || 'team-1');

  // Generating May 2026 Grid Dates
  // We need to pad the days of the week. Friday is Index 5 if Sunday=0, Monday=1, ... Thursday=4.
  // Friday is May 1st, so we place 5 empty cells first.
  const daysInMonth = 31;
  const paddingBeforeDays = 5; // Sunday=0, Mon=1, Tue=2, Wed=3, Thu=4, so Fri=5.

  const calendarCells = useMemo(() => {
    const cells = [];
    
    // Add empty pad cells
    for (let i = 0; i < paddingBeforeDays; i++) {
      cells.push({ dayNumber: null, dateString: '' });
    }

    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = day.toString().padStart(2, '0');
      const dateString = `2026-05-${dayStr}`;
      cells.push({ dayNumber: day, dateString });
    }

    return cells;
  }, []);

  // Filter events of selected date
  const selectedDayEvents = useMemo(() => {
    return events.filter(e => e.date === selectedDate);
  }, [events, selectedDate]);

  // Handle Event submit
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formDate || !formTime) {
      alert("Please fill out required fields.");
      return;
    }

    onAddEvent({
      title: formTitle,
      date: formDate,
      startTime: formTime,
      duration: formDuration,
      type: formType,
      clientName: formClient || undefined,
      assignedTo: formAssignee
    });

    setFormTitle('');
    setFormDate('2026-05-29');
    setFormTime('11:00');
    setFormClient('');
    setIsAddEventOpen(false);
  };

  return (
    <div id="calendar-module-root" className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
      
      {/* List Column: Sidebar showing Events Scheduled on Selected day */}
      <div id="calendar-info-sidebar" className="xl:col-span-1 space-y-4">
        
        {/* Core Day statistics */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Focused Planner Date</span>
              <h2 className="text-sm font-bold text-slate-900 mt-0.5">{selectedDate}</h2>
            </div>
            
            <button
              id="schedule-booking-btn"
              onClick={() => setIsAddEventOpen(true)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-1.5 px-3 rounded-lg shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule</span>
            </button>
          </div>

          {/* List Events */}
          <div className="space-y-3.5 max-h-[380px] overflow-y-auto">
            {selectedDayEvents.length === 0 ? (
              <div className="p-12 text-center border border-dashed rounded-xl bg-slate-50">
                <p className="text-xs text-slate-400 font-bold">No Bookings Scheduled</p>
                <p className="text-[11px] text-slate-400 mt-1">Select other dates on May grid or book custom workshops.</p>
              </div>
            ) : (
              selectedDayEvents.map((evt) => {
                const assigneeObj = teamMembers.find(t => t.id === evt.assignedTo) || teamMembers[0];
                const isMeeting = evt.type === 'Meeting';
                const isDeadline = evt.type === 'Project Deadline';
                
                return (
                  <div 
                    id={`calendar-event-item-${evt.id}`}
                    key={evt.id} 
                    className={`p-3.5 rounded-xl border transition ${
                      isMeeting 
                        ? 'border-blue-150 bg-blue-50/20 hover:bg-blue-50/40' 
                        : isDeadline 
                          ? 'border-rose-150 bg-rose-50/20 hover:bg-rose-50/40' 
                          : 'border-slate-200 bg-slate-50/30 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${
                            evt.type === 'Call' 
                              ? 'bg-amber-500' 
                              : isDeadline 
                                ? 'bg-rose-500' 
                                : 'bg-blue-600'
                          }`}></span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{evt.type}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">{evt.title}</h4>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="inline-flex items-center gap-1 text-[10px] text-slate-500 font-mono font-bold bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{evt.startTime}</span>
                        </div>
                        <p className="text-[9px] text-slate-400 mt-1 font-medium">{evt.duration} duration</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-200/40 mt-3 pt-2">
                      <div>
                        {evt.clientName && (
                          <p className="text-[10px] text-slate-500 font-medium">
                            Account: <strong className="text-slate-700">{evt.clientName}</strong>
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1" title={`Coordinator: ${assigneeObj.name}`}>
                        <div className="w-5 h-5 rounded-full bg-slate-900 text-slate-100 font-bold text-[9px] flex items-center justify-center">
                          {assigneeObj.avatar}
                        </div>
                        <span className="text-[9px] text-slate-500 font-bold">{assigneeObj.name.split(' ')[0]}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Quick details helpful reminders */}
        <div className="bg-slate-50/70 p-4 border border-slate-200 rounded-2xl text-[10px] text-slate-400 space-y-2">
          <p className="font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-blue-500" />
            <span>Client Experience Sync</span>
          </p>
          <p className="leading-relaxed font-semibold">
            All meetings created here generate a secure Google Meet link and notify assigned client representatives automatically on invite.
          </p>
        </div>

      </div>

      {/* Grid Column: Right calendar display */}
      <div id="calendar-grid-panel" className="xl:col-span-2 space-y-4">
        
        {/* Toggle navigation bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Schedule Planner Calendar</h2>
            <span className="text-xs bg-slate-100 text-slate-500 py-0.5 px-2 rounded-lg font-bold">May 2026</span>
          </div>

          <div className="flex gap-1.5 p-0.5 bg-slate-100 rounded-lg">
            <button
              id="calendar-monthly-view-btn"
              onClick={() => setCurrentView('monthly')}
              className={`text-[11px] font-semibold py-1 px-3 rounded-md transition ${
                currentView === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Month (Grid)
            </button>
            <button
              id="calendar-weekly-view-btn"
              onClick={() => setCurrentView('weekly')}
              className={`text-[11px] font-semibold py-1 px-3 rounded-md transition ${
                currentView === 'weekly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Agenda List
            </button>
          </div>
        </div>

        {currentView === 'monthly' ? (
          <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm space-y-4">
            
            {/* Weekdays names grid header */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] uppercase tracking-wider text-slate-400">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Maya Calendar Grid cells */}
            <div className="grid grid-cols-7 gap-1.5">
              {calendarCells.map((cell, idx) => {
                const hasDay = cell.dayNumber !== null;
                const dateStr = cell.dateString;
                const isSelected = hasDay && dateStr === selectedDate;
                
                // Scan how many events are present under this day
                const dayEvents = hasDay ? events.filter(e => e.date === dateStr) : [];
                const hasEvents = dayEvents.length > 0;

                return (
                  <div
                    id={`calendar-cell-idx-${idx}`}
                    key={idx}
                    onClick={() => { if (hasDay) setSelectedDate(dateStr); }}
                    className={`min-h-[75px] rounded-xl border p-2 flex flex-col justify-between transition-all relative cursor-pointer group ${
                      !hasDay 
                        ? 'bg-slate-50/50 border-slate-100/60 cursor-default select-none' 
                        : isSelected 
                          ? 'border-blue-500 bg-blue-50/30 shadow-xs scale-[1.01]' 
                          : 'border-slate-200 bg-white hover:border-slate-350 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-bold font-mono ${
                        isSelected 
                          ? 'text-blue-700' 
                          : !hasDay 
                            ? 'text-slate-300' 
                            : 'text-slate-700'
                      }`}>
                        {cell.dayNumber}
                      </span>
                      
                      {/* Event Count indicators indicator */}
                      {hasEvents && (
                        <span className="w-3.5 h-3.5 rounded-full bg-blue-600 text-[9px] font-mono text-white flex items-center justify-center font-bold shrink-0">
                          {dayEvents.length}
                        </span>
                      )}
                    </div>

                    {/* Quick description snippet */}
                    {hasEvents && (
                      <div className="space-y-0.5 hidden md:block">
                        {dayEvents.slice(0, 1).map((ev) => (
                          <p 
                            key={ev.id} 
                            className="text-[9px] font-bold text-slate-600 truncate leading-tight bg-slate-100 p-0.5 rounded select-none"
                            title={ev.title}
                          >
                            {ev.title}
                          </p>
                        ))}
                        {dayEvents.length > 1 && (
                          <p className="text-[8px] text-blue-500 font-semibold text-center font-mono">
                            +{dayEvents.length - 1} more meetings
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="text-[10px] text-slate-400 font-medium text-center italic">
              * Showing May 2026. Dates highlighted in blue signify days with active agency appointments.
            </p>

          </div>
        ) : (
          /* Weekly agenda stream view */
          <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm space-y-4">
            
            <div className="flex justify-between items-center pb-2 border-b border-slate-150">
              <span className="text-xs font-bold text-slate-700 uppercase">Interactive Weekly agenda</span>
              <span className="text-[10px] text-slate-400 font-mono">Full Scheduled Streams</span>
            </div>

            <div className="divide-y divide-slate-100">
              {events.map((evt) => {
                const isSelected = evt.date === selectedDate;
                const rep = teamMembers.find(t => t.id === evt.assignedTo) || teamMembers[0];
                return (
                  <div 
                    id={`agenda-item-evt-${evt.id}`}
                    key={evt.id} 
                    onClick={() => setSelectedDate(evt.date)}
                    className={`py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 p-2.5 rounded-xl transition ${
                      isSelected ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="bg-slate-100 text-slate-600 font-mono shrink-0 p-2 rounded-lg text-center font-bold text-[10px] w-14 leading-tight">
                        {evt.date.slice(-5)}
                      </div>

                      <div className="space-y-0.5 min-w-0">
                        <span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                          {evt.type}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 mt-1 truncate">{evt.title}</h4>
                        <p className="text-[10px] text-slate-500">
                          Client: <strong className="text-slate-700">{evt.clientName || 'Agency General'}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
                      <div className="flex items-center gap-1.5 font-mono text-[10.5px] text-slate-600 bg-slate-50 p-1 px-2.5 rounded border border-slate-200">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{evt.startTime} ({evt.duration})</span>
                      </div>

                      <div className="w-6 h-6 rounded-full bg-slate-950 font-bold text-white text-[9px] flex items-center justify-center" title={rep.name}>
                        {rep.avatar}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>

      {/* Slide-over Scheduling Overlay modal */}
      {isAddEventOpen && (
        <div id="add-event-modal-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in px-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full p-6 shadow-xl space-y-4 animate-scale-up">
            
            <div className="flex items-center justify-between pb-3 border-b border-rose-200">
              <h2 className="text-sm font-bold text-slate-900">Schedule Agency Booking</h2>
              <button 
                id="close-add-event-modal-btn"
                onClick={() => setIsAddEventOpen(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3.5 text-xs">
              
              <div className="space-y-1">
                <label className="font-bold text-slate-650">Appointment Header Title *</label>
                <input 
                  id="event-form-title"
                  type="text" 
                  required
                  placeholder="e.g. Helix Master Agreement Review"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-50 p-2 border border-slate-200 rounded-lg text-slate-800 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-650">Appointment Date</label>
                  <input 
                    id="event-form-date"
                    type="date" 
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-slate-50 p-2 border border-slate-200 rounded-lg text-slate-800 text-[11px]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-650">Start Time</label>
                  <input 
                    id="event-form-time"
                    type="time" 
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full bg-slate-50 p-2 border border-slate-200 rounded-lg text-slate-800 text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-650">Duration Slot</label>
                  <select
                    id="event-form-duration"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full bg-slate-50 p-2 border border-slate-200 rounded-lg text-slate-650 cursor-pointer"
                  >
                    <option value="15m">15 Minutes</option>
                    <option value="30m">30 Minutes</option>
                    <option value="45m">45 Minutes</option>
                    <option value="1h">1 Hour</option>
                    <option value="2h">2 Hours</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-650">Meeting Channel</label>
                  <select
                    id="event-form-type"
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as CalendarEvent['type'])}
                    className="w-full bg-slate-50 p-2 border border-slate-200 rounded-lg text-slate-650 cursor-pointer"
                  >
                    <option value="Meeting">Meeting Session</option>
                    <option value="Call">Brief Phone Call</option>
                    <option value="Project Deadline">Major Project Deadline</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-650">Target Client / Project</label>
                <input 
                  id="event-form-client"
                  type="text" 
                  placeholder="e.g. Helix Tech Solutions"
                  value={formClient}
                  onChange={(e) => setFormClient(e.target.value)}
                  className="w-full bg-slate-50 p-2 border border-slate-200 rounded-lg text-slate-850 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-650">Host Coordinator</label>
                <select
                  id="event-form-assignee"
                  value={formAssignee}
                  onChange={(e) => setFormAssignee(e.target.value)}
                  className="w-full bg-slate-50 p-2 border border-slate-200 rounded-lg text-slate-650 cursor-pointer"
                >
                  {teamMembers.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  id="cancel-add-event-btn"
                  type="button"
                  onClick={() => setIsAddEventOpen(false)}
                  className="px-3.5 py-1.5 text-slate-500 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  id="confirm-add-event-btn"
                  type="submit"
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm transition"
                >
                  Schedule Invite
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

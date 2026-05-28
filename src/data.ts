import { Lead, Client, Task, CalendarEvent, TeamMember, ActivityLog } from './types';

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Alex Rivera',
    role: 'Agency Director',
    email: 'alex@novaflow.agency',
    avatar: 'AR',
    activeClients: 8,
    completedTasks: 42,
    rating: 98,
    status: 'online',
    workload: 65,
  },
  {
    id: 'team-2',
    name: 'Sarah Jenkins',
    role: 'Sales Manager',
    email: 'sarah@novaflow.agency',
    avatar: 'SJ',
    activeClients: 12,
    completedTasks: 89,
    rating: 94,
    status: 'busy',
    workload: 85,
  },
  {
    id: 'team-3',
    name: 'David Cho',
    role: 'Lead Designer',
    email: 'david@novaflow.agency',
    avatar: 'DC',
    activeClients: 6,
    completedTasks: 31,
    rating: 96,
    status: 'online',
    workload: 50,
  },
  {
    id: 'team-4',
    name: 'Liam Fletcher',
    role: 'Tech Lead',
    email: 'liam@novaflow.agency',
    avatar: 'LF',
    activeClients: 5,
    completedTasks: 55,
    rating: 99,
    status: 'offline',
    workload: 40,
  },
  {
    id: 'team-5',
    name: 'Elena Rostova',
    role: 'Account Executive',
    email: 'elena@novaflow.agency',
    avatar: 'ER',
    activeClients: 9,
    completedTasks: 67,
    rating: 95,
    status: 'online',
    workload: 75,
  },
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Jake Mercer',
    company: 'Apex Fitness',
    email: 'jake@apexfitness.com',
    phone: '+1 (555) 234-5678',
    source: 'Organic Search',
    dealSize: 12500,
    assignedTo: 'team-2', // Sarah Jenkins
    status: 'New',
    nextFollowUp: '2026-06-01',
    notes: [
      'Discovered via Google Organic. Looking to redesign their member app.',
      'Budget confirmed around $10k-$15k. Target launch in Q3.'
    ],
    logoColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    id: 'lead-2',
    name: 'Maya Patel',
    company: 'Helix Tech Solutions',
    email: 'm.patel@helixtech.io',
    phone: '+1 (555) 876-5432',
    source: 'LinkedIn Outreach',
    dealSize: 24500,
    assignedTo: 'team-2',
    status: 'Negotiation',
    nextFollowUp: '2026-05-29',
    notes: [
      'In negotiation phase. Sent customized Master Services Agreement (MSA).',
      'Expressed strong interest in the modular React portal and analytics integration.'
    ],
    logoColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  },
  {
    id: 'lead-3',
    name: 'Marcus Vance',
    company: 'Stellar Retailers',
    email: 'm.vance@stellarretail.com',
    phone: '+1 (555) 345-6789',
    source: 'Referral',
    dealSize: 18000,
    assignedTo: 'team-5', // Elena Rostova
    status: 'Proposal Sent',
    nextFollowUp: '2026-05-30',
    notes: [
      'Referred by current client Alpha Retail Group. High quality prospect.',
      'Proposal for comprehensive e-commerce strategy and design submitted of $18k.'
    ],
    logoColor: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  {
    id: 'lead-4',
    name: 'Dr. Sarah Lin',
    company: 'Quantum Biotech',
    email: 's.lin@quantumbiotech.org',
    phone: '+1 (555) 456-7890',
    source: 'Web Form',
    dealSize: 35000,
    assignedTo: 'team-1', // Alex Rivera
    status: 'Contacted',
    nextFollowUp: '2026-06-03',
    notes: [
      'Initial discovery call completed on May 24th.',
      'Client needs a highly compliant clinical portal and secure public site.'
    ],
    logoColor: 'bg-sky-50 text-sky-700 border-sky-200'
  },
  {
    id: 'lead-5',
    name: 'Linda Wu',
    company: 'Zenith Real Estate',
    email: 'linda.wu@zenithre.com',
    phone: '+1 (555) 567-8901',
    source: 'Inbound Call',
    dealSize: 8500,
    assignedTo: 'team-2',
    status: 'New',
    nextFollowUp: '2026-06-04',
    notes: [
      'Left voicemail on inbound line requesting local listing map integrations and branding.',
      'Schedule outbound call.'
    ],
    logoColor: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  {
    id: 'lead-6',
    name: 'Tom Geller',
    company: 'Echo Audio',
    email: 'geller@echoaudio.co',
    phone: '+1 (555) 678-9012',
    source: 'Cold Email',
    dealSize: 15000,
    assignedTo: 'team-5',
    status: 'Converted',
    nextFollowUp: '2026-05-25',
    notes: [
      'Contract signed! Project transitioning to David Cho for design onboarding.',
      'Closed deal at standard $15k flat setup fee.'
    ],
    logoColor: 'bg-rose-50 text-rose-700 border-rose-200'
  },
  {
    id: 'lead-7',
    name: 'Chloe Simmons',
    company: 'Radiant Apparel',
    email: 'chloe@radiantapparel.com',
    phone: '+1 (555) 789-0123',
    source: 'LinkedIn Outreach',
    dealSize: 9200,
    assignedTo: 'team-2',
    status: 'New',
    nextFollowUp: '2026-06-02',
    notes: [
      'Sent connection request and customized audit. Accepted and requested a summary.',
      'Initial proposal drafted.'
    ],
    logoColor: 'bg-pink-50 text-pink-700 border-pink-200'
  },
  {
    id: 'lead-8',
    name: 'Michael Cruz',
    company: 'Skyward Logistics',
    email: 'm.cruz@skywardlogistics.com',
    phone: '+1 (555) 890-1234',
    source: 'Referral',
    dealSize: 27000,
    assignedTo: 'team-1',
    status: 'Proposal Sent',
    nextFollowUp: '2026-05-31',
    notes: [
      'Re-design layout with custom tracker system.',
      'Sent proposal on May 25th. Under review by board.'
    ],
    logoColor: 'bg-teal-50 text-teal-700 border-teal-200'
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'client-1',
    name: 'Alpha Retail Group',
    company: 'Alpha Retail Group',
    email: 'billing@alpharetail.com',
    phone: '+1 (555) 901-2345',
    contractValue: 48000,
    status: 'Active',
    website: 'https://alpharetail.com',
    avatarText: 'AR',
    bgColor: 'bg-blue-600',
    projectHealth: 'Excellent',
    notes: [
      {
        id: 'no-1',
        text: 'Agreed on bi-weekly sprint deliverables. Communications are handled directly via Elena Rostova.',
        date: '2026-05-10',
        author: 'Elena Rostova',
        isPinned: true
      },
      {
        id: 'no-2',
        text: 'Client requested to add Apple Pay support early so billing can run tests.',
        date: '2026-05-22',
        author: 'David Cho'
      }
    ],
    deliverables: [
      { id: 'del-1', name: 'Interactive Figma Prototype', status: 'Completed', dueDate: '2026-05-15', progress: 100 },
      { id: 'del-2', name: 'Checkout flow implementation', status: 'In Progress', dueDate: '2026-06-10', progress: 65 },
      { id: 'del-3', name: 'Google Pay & Stripe integrations', status: 'On Track', dueDate: '2026-06-25', progress: 30 }
    ],
    invoices: [
      { id: 'inv-1', amount: 12000, status: 'Paid', dueDate: '2026-04-10' },
      { id: 'inv-2', amount: 12000, status: 'Paid', dueDate: '2026-05-10' },
      { id: 'inv-3', amount: 12000, status: 'Sent', dueDate: '2026-06-10' },
      { id: 'inv-4', amount: 12000, status: 'Draft', dueDate: '2026-07-10' }
    ]
  },
  {
    id: 'client-2',
    name: 'Nexus Global',
    company: 'Nexus Global Logistics',
    email: 'it@nexusglobal.com',
    phone: '+1 (555) 012-3456',
    contractValue: 84000,
    status: 'Active',
    website: 'https://nexus-logistic.com',
    avatarText: 'NG',
    bgColor: 'bg-indigo-600',
    projectHealth: 'Good',
    notes: [
      {
        id: 'no-3',
        text: 'Primary goal is to optimize page performance for a vast product catalog. Targeting sub-second loading time.',
        date: '2026-05-02',
        author: 'Liam Fletcher',
        isPinned: true
      }
    ],
    deliverables: [
      { id: 'del-4', name: 'Technical SEO Site Audit', status: 'Completed', dueDate: '2026-05-08', progress: 100 },
      { id: 'del-5', name: 'Core Web Vitals Optimization', status: 'In Progress', dueDate: '2026-06-15', progress: 50 },
      { id: 'del-6', name: 'Custom React Storefront Dev', status: 'On Track', dueDate: '2026-07-20', progress: 20 }
    ],
    invoices: [
      { id: 'inv-5', amount: 21000, status: 'Paid', dueDate: '2026-04-30' },
      { id: 'inv-6', amount: 21000, status: 'Sent', dueDate: '2026-05-30' }
    ]
  },
  {
    id: 'client-3',
    name: 'Blue Sky Travel',
    company: 'Blue Sky Travel',
    email: 'info@blueskytravel.ca',
    phone: '+1 (555) 123-4567',
    contractValue: 32000,
    status: 'Onboarding',
    website: 'https://blueskyvacations.ca',
    avatarText: 'BS',
    bgColor: 'bg-sky-500',
    projectHealth: 'Good',
    notes: [
      {
        id: 'no-4',
        text: 'Kickoff meeting set for May 29. Preparing wireframes and preliminary roadmap.',
        date: '2026-05-27',
        author: 'Alex Rivera'
      }
    ],
    deliverables: [
      { id: 'del-7', name: 'Brand Guide & Visual Assets', status: 'In Progress', dueDate: '2026-06-05', progress: 35 },
      { id: 'del-8', name: 'Mobile App Wireframes Map', status: 'On Track', dueDate: '2026-06-20', progress: 10 }
    ],
    invoices: [
      { id: 'inv-7', amount: 8000, status: 'Paid', dueDate: '2026-05-22' },
      { id: 'inv-8', amount: 8000, status: 'Draft', dueDate: '2026-06-22' }
    ]
  },
  {
    id: 'client-4',
    name: 'Vanguard Law',
    company: 'Vanguard Law Associates',
    email: 'office@vanguardlaw.com',
    phone: '+1 (555) 321-6540',
    contractValue: 18000,
    status: 'Paused',
    website: 'https://vanguardlawfirm.com',
    avatarText: 'VL',
    bgColor: 'bg-zinc-700',
    projectHealth: 'At Risk',
    notes: [
      {
        id: 'no-5',
        text: 'Client paused project temporarily due to partner reorganization meetings.',
        date: '2026-05-18',
        author: 'Elena Rostova',
        isPinned: true
      }
    ],
    deliverables: [
      { id: 'del-9', name: 'Information Architecture', status: 'Completed', dueDate: '2026-05-10', progress: 100 },
      { id: 'del-10', name: 'Interactive Portals Development', status: 'Delayed', dueDate: '2026-06-30', progress: 15 }
    ],
    invoices: [
      { id: 'inv-9', amount: 9000, status: 'Paid', dueDate: '2026-05-01' },
      { id: 'inv-10', amount: 9000, status: 'Overdue', dueDate: '2026-05-25' }
    ]
  },
  {
    id: 'client-5',
    name: 'Core Capital',
    company: 'Core Capital Management',
    email: 'contact@corecap.com',
    phone: '+1 (555) 789-3210',
    contractValue: 60000,
    status: 'Active',
    website: 'https://corecapitalinvest.com',
    avatarText: 'CC',
    bgColor: 'bg-emerald-600',
    projectHealth: 'Excellent',
    notes: [
      {
        id: 'no-6',
        text: 'Fintech dashboard needs clean typography and extreme precision in spacing and numbers.',
        date: '2026-05-24',
        author: 'Alex Rivera'
      }
    ],
    deliverables: [
      { id: 'del-11', name: 'Wireframing & Typography research Design', status: 'Completed', dueDate: '2026-05-20', progress: 100 },
      { id: 'del-12', name: 'Dashboard UI Component Delivery', status: 'In Progress', dueDate: '2026-06-12', progress: 45 }
    ],
    invoices: [
      { id: 'inv-11', amount: 15000, status: 'Paid', dueDate: '2026-05-15' },
      { id: 'inv-12', amount: 15000, status: 'Sent', dueDate: '2026-06-15' }
    ]
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Finalize MSA and contract scope for Helix Tech',
    priority: 'High',
    status: 'In Progress',
    assignedTo: 'team-2', // Sarah Jenkins
    dueDate: '2026-05-29',
    clientName: 'Helix Tech Solutions',
    createdDate: '2026-05-26',
  },
  {
    id: 'task-2',
    title: 'Audit checkout page speed & compile SEO issues',
    priority: 'Medium',
    status: 'To Do',
    assignedTo: 'team-4', // Liam Fletcher
    dueDate: '2026-06-02',
    clientName: 'Nexus Global',
    createdDate: '2026-05-27',
  },
  {
    id: 'task-3',
    title: 'Draft layout & logo sketches for Echo Audio',
    priority: 'Low',
    status: 'To Do',
    assignedTo: 'team-3', // David Cho
    dueDate: '2026-06-05',
    clientName: 'Echo Audio',
    createdDate: '2026-05-28',
  },
  {
    id: 'task-4',
    title: 'Review Alpha Retail checkout flow designs',
    priority: 'High',
    status: 'Completed',
    assignedTo: 'team-1', // Alex Rivera
    dueDate: '2026-05-25',
    clientName: 'Alpha Retail Group',
    createdDate: '2026-05-22',
  },
  {
    id: 'task-5',
    title: 'Prepare presentation slides for Blue Sky Kickoff',
    priority: 'Medium',
    status: 'In Progress',
    assignedTo: 'team-5', // Elena Rostova
    dueDate: '2026-05-29',
    clientName: 'Blue Sky Travel',
    createdDate: '2026-05-27',
  },
  {
    id: 'task-6',
    title: 'Inquire with Vanguard Law on invoicing status',
    priority: 'High',
    status: 'Waiting',
    assignedTo: 'team-5',
    dueDate: '2026-05-30',
    clientName: 'Vanguard Law',
    createdDate: '2026-05-24',
  },
  {
    id: 'task-7',
    title: 'Deliver interactive pixel perfect specs for Core Capital',
    priority: 'Medium',
    status: 'To Do',
    assignedTo: 'team-3',
    dueDate: '2026-06-10',
    clientName: 'Core Capital',
    createdDate: '2026-05-28',
  }
];

export const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'event-1',
    title: 'Helix Tech Contract Review',
    date: '2026-05-29',
    startTime: '10:00',
    duration: '45m',
    type: 'Meeting',
    clientName: 'Helix Tech Solutions',
    assignedTo: 'team-2'
  },
  {
    id: 'event-2',
    title: 'Blue Sky Kickoff Session',
    date: '2026-05-29',
    startTime: '14:00',
    duration: '1h',
    type: 'Meeting',
    clientName: 'Blue Sky Travel',
    assignedTo: 'team-1'
  },
  {
    id: 'event-3',
    title: 'Stellar Retail Follow-Up Call',
    date: '2026-05-30',
    startTime: '11:30',
    duration: '15m',
    type: 'Call',
    clientName: 'Stellar Retailers',
    assignedTo: 'team-5'
  },
  {
    id: 'event-4',
    title: 'SEO Audit Delivery Deadline',
    date: '2026-06-02',
    startTime: '17:00',
    duration: '30m',
    type: 'Project Deadline',
    clientName: 'Nexus Global',
    assignedTo: 'team-4'
  },
  {
    id: 'event-5',
    title: 'Weekly Standup Sync',
    date: '2026-06-01',
    startTime: '09:30',
    duration: '30m',
    type: 'Meeting',
    assignedTo: 'team-1'
  },
  {
    id: 'event-6',
    title: 'Quantum Biotech Intro Demo',
    date: '2026-06-03',
    startTime: '15:00',
    duration: '45m',
    type: 'Meeting',
    clientName: 'Quantum Biotech',
    assignedTo: 'team-1'
  }
];

export const INITIAL_ACTIVITIES: ActivityLog[] = [
  {
    id: 'act-1',
    type: 'lead',
    title: 'New Lead Added',
    timestamp: '18m ago',
    description: 'Zenith Real Estate was auto-imported from web inbound forms.',
    user: 'NovaBot'
  },
  {
    id: 'act-2',
    type: 'call',
    title: 'Call Completed with Helix Tech',
    timestamp: '2h ago',
    description: 'Maya Patel confirmed they received the draft scope; positive feedback.',
    user: 'Sarah Jenkins'
  },
  {
    id: 'act-3',
    type: 'task',
    title: 'Task Completed',
    timestamp: '4h ago',
    description: 'Alex Rivera reviewed Alpha Retail checkout flow wireframe layouts.',
    user: 'Alex Rivera'
  },
  {
    id: 'act-4',
    type: 'email',
    title: 'Proposal Draft Emailed',
    timestamp: '1d ago',
    description: 'Sent custom layout proposals with budget details to Stellar Retailers.',
    user: 'Elena Rostova'
  },
  {
    id: 'act-5',
    type: 'meeting',
    title: 'Strategic Workshop',
    timestamp: '2d ago',
    description: 'Aligned on timeline expectations and technical constraints with Core Capital IT team.',
    user: 'Liam Fletcher'
  }
];

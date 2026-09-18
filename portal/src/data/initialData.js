// Default bootstrap HR Specialist credentials
export const DEFAULT_HR_USER = {
  id: 'HR-001',
  name: 'David Miller',
  username: 'david.miller',
  email: 'david.hr@xortlogix.com',
  password: 'hr123',
  role: 'HR Operations Specialist',
  roleKey: 'hr',
  designation: 'HR Operations Specialist & People Partner',
  department: 'Supporting Staff',
  team: 'Supporting Staff',
  avatar: '',
  dateJoined: '15 Jan 2024',
  status: 'Active',
  employmentType: 'Full-Time',
  reportingLead: 'Executive Leadership',
  departmentHead: 'Executive Leadership',
  hrContact: 'Self',
  leaveBalances: {
    annual: { label: 'Annual Vacation', total: 28, used: 2, remaining: 26 },
    medical: { label: 'Medical Leave', total: 10, used: 0, remaining: 10 },
    casual: { label: 'Casual Leave', total: 8, used: 1, remaining: 7 },
    emergency: { label: 'Emergency Leave', total: 3, used: 0, remaining: 3 }
  }
};

export const DEFAULT_ADMIN_USER = DEFAULT_HR_USER;

export const INITIAL_DATA = {
  // Only the HR account exists in the portal
  initialUsers: [DEFAULT_HR_USER],

  // Leave policies configured in the system
  leavePolicies: [
    {
      id: 'pol-annual',
      name: 'Annual Paid Vacation Policy',
      eligibility: {
        gender: 'All',
        employmentType: 'Full-Time / Permanent',
        minimumService: '3 months'
      },
      entitlement: '20 days per annum',
      carryForward: 'Max 5 days into next year',
      approvalWorkflow: ['Team Lead', 'Department Head'],
      status: 'Active',
      description: 'Standard vacation entitlement accrued monthly.'
    },
    {
      id: 'pol-medical',
      name: 'Medical & Sick Leave Policy',
      eligibility: {
        gender: 'All',
        employmentType: 'All Active Classifications',
        minimumService: 'Day 1 on joining'
      },
      entitlement: '10 days per annum',
      carryForward: 'No',
      approvalWorkflow: ['Team Lead'],
      status: 'Active',
      description: 'Covers illness and recovery with physician note for >2 days.'
    },
    {
      id: 'pol-casual',
      name: 'Casual / Personal Day Policy',
      eligibility: {
        gender: 'All',
        employmentType: 'Full-Time / Permanent',
        minimumService: '1 month'
      },
      entitlement: '5 days per annum',
      carryForward: 'No',
      approvalWorkflow: ['Team Lead'],
      status: 'Active',
      description: 'For short personal errands or family urgent commitments.'
    },
    {
      id: 'pol-emergency',
      name: 'Emergency & Compassionate Policy',
      eligibility: {
        gender: 'All',
        employmentType: 'All (incl. Intern / Probation)',
        minimumService: 'Day 1'
      },
      entitlement: 'Case by case (up to 3 days)',
      carryForward: 'No',
      approvalWorkflow: ['Team Lead', 'HR'],
      status: 'Active',
      description: 'Fast-tracked route for immediate emergencies, bereavement, or acute distress.'
    }
  ],

  // Empty initial leave requests (filled as created by real users)
  recentLeaveRequests: [],

  // Empty initial HR requests
  hrRequests: [],

  // Initial audit log
  auditLogs: [
    {
      id: 'AUD-001',
      user: 'System Setup',
      action: 'Initialized platform database and configured master HR policies',
      module: 'System Setup',
      ip: '127.0.0.1',
      time: 'Setup'
    }
  ],

  // Announcements
  announcements: [
    {
      id: 'ann-1',
      title: 'Welcome to XortLogix Portal',
      date: '18 Sep 2024',
      author: 'HR Operations',
      target: 'All Employees',
      priority: 'General',
      content: 'Welcome to the centralized employee self-service and internal management portal. Please ensure your personal profile and emergency contacts are verified.'
    }
  ],

  // Calendar
  calendarEvents: [
    { date: '2024-09-25', title: 'Public Holiday (National Day Observance)', type: 'holiday', member: 'Company Wide' },
    { date: '2024-10-15', title: 'XortLogix Annual Innovation Summit', type: 'event', member: 'Company Wide' }
  ],

  // Org Hierarchy structure
  orgHierarchy: {
    name: 'XortLogix Technologies Inc.',
    departments: [
      {
        id: 'dept-eng',
        name: 'Engineering',
        head: 'Asim Khan',
        headTitle: 'Head of Engineering',
        color: '#2563eb',
        teams: [
          { name: 'Frontend Team', lead: 'Sarah Ahmed', membersCount: 0 },
          { name: 'Backend Team', lead: 'Ahmed Raza', membersCount: 0 },
          { name: 'DevOps & Cloud', lead: 'Usman Khan', membersCount: 0 },
          { name: 'QA & Automation', lead: 'Fatima Noor', membersCount: 0 }
        ]
      },
      {
        id: 'dept-hr',
        name: 'Human Resources',
        head: 'Sana Ahmed',
        headTitle: 'HR Operations Manager',
        color: '#ec4899',
        teams: [
          { name: 'People Operations', lead: 'Fatima Noor', membersCount: 0 },
          { name: 'Talent Acquisition', lead: 'Zainab Qazi', membersCount: 0 }
        ]
      },
      {
        id: 'dept-sales',
        name: 'Sales & Revenue',
        head: 'Bilal Khan',
        headTitle: 'VP of Sales',
        color: '#8b5cf6',
        teams: [
          { name: 'Enterprise Sales', lead: 'Zeeshan Ali', membersCount: 0 },
          { name: 'SMB Accounts', lead: 'Maria Sheikh', membersCount: 0 }
        ]
      },
      {
        id: 'dept-marketing',
        name: 'Marketing & Brand',
        head: 'Ayesha Malik',
        headTitle: 'Head of Marketing',
        color: '#f59e0b',
        teams: [
          { name: 'Growth Marketing', lead: 'Hassan Raza', membersCount: 0 },
          { name: 'Content & Brand', lead: 'Nida Farooq', membersCount: 0 }
        ]
      }
    ]
  }
};

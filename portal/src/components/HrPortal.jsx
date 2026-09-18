import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Check, 
  X, 
  Search, 
  Megaphone, 
  ArrowRight,
  Trash2,
  CalendarDays,
  ShieldCheck,
  Clock,
  HelpCircle,
  FileText,
  Bell,
  CheckCircle2,
  AlertCircle,
  Users,
  Briefcase,
  Code,
  Sparkles,
  PenTool,
  UserCheck
} from 'lucide-react';
import EditEmployeeModal from './EditEmployeeModal';
import { calculateEmploymentMilestones } from '../utils/employmentTimeline';

export default function HrPortal({ 
  user, 
  allEmployees, 
  leavePolicies, 
  leaveRequests, 
  hrRequests, 
  announcements = [],
  auditLogs = [],
  onApproveRequest, 
  onRejectRequest, 
  onOpenPolicyModal, 
  onDeletePolicy,
  onOpenCreateUserModal,
  onUpdateTicketStatus, 
  onPostAnnouncement,
  onDeleteAnnouncement,
  onUpdateEmployee,
  onDeleteEmployee,
  activePage = 'Dashboard' 
}) {
  const TEAM_CATEGORIES = [
    { key: 'ALL', label: 'All Team', icon: Users },
    { key: 'Directors', label: 'Directors', icon: Briefcase },
    { key: 'Developers', label: 'Developers', icon: Code },
    { key: 'GHL Experts', label: 'GHL Experts', icon: Sparkles },
    { key: 'Designers', label: 'Designers', icon: PenTool },
    { key: 'Marketers', label: 'Marketers', icon: Megaphone },
    { key: 'Supporting Staff', label: 'Supporting Staff', icon: UserCheck },
  ];

  const [empSearch, setEmpSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState('ALL');
  const [leaveQueueFilter, setLeaveQueueFilter] = useState('ALL');
  const [leaveSearch, setLeaveSearch] = useState('');
  const [helpdeskFilter, setHelpdeskFilter] = useState('ALL');
  const [helpdeskSearch, setHelpdeskSearch] = useState('');
  const [auditSearch, setAuditSearch] = useState('');
  const [annFilter, setAnnFilter] = useState('ALL');
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Announcement Modal State
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annTarget, setAnnTarget] = useState('All Employees');
  const [annPriority, setAnnPriority] = useState('General');
  const [annContent, setAnnContent] = useState('');

  // Exclude Administrator from the employee roster list
  const employeesOnly = allEmployees.filter((e) => {
    const isEmpAdmin = e.roleKey === 'admin' || 
                       e.email === 'admin@xortlogix.com' || 
                       e.role?.toLowerCase().includes('admin') || 
                       e.name?.toLowerCase().includes('admin') ||
                       e.id === 1 || e.id === '1' || e.id === 'ADMIN-001';
    return !isEmpAdmin;
  });

  const pendingRequests = leaveRequests.filter(r => r.status === 'Pending');

  const filteredEmployees = employeesOnly.filter(e => {
    const matchesSearch = !empSearch || 
                          e.name?.toLowerCase().includes(empSearch.toLowerCase()) || 
                          e.role?.toLowerCase().includes(empSearch.toLowerCase()) ||
                          e.email?.toLowerCase().includes(empSearch.toLowerCase()) ||
                          e.team?.toLowerCase().includes(empSearch.toLowerCase()) ||
                          e.department?.toLowerCase().includes(empSearch.toLowerCase());
    const matchesTeam = teamFilter === 'ALL' || 
                        e.department === teamFilter || 
                        e.team === teamFilter ||
                        (teamFilter === 'Developers' && (e.department?.toLowerCase().includes('dev') || e.department?.toLowerCase().includes('engineer'))) ||
                        (teamFilter === 'Marketers' && (e.department?.toLowerCase().includes('market') || e.department === 'Sales')) ||
                        (teamFilter === 'Designers' && e.department?.toLowerCase().includes('design')) ||
                        (teamFilter === 'Supporting Staff' && (e.department?.toLowerCase().includes('support') || e.department?.toLowerCase().includes('hr') || e.department?.toLowerCase().includes('human resources') || e.department?.toLowerCase().includes('operations'))) ||
                        (teamFilter === 'Directors' && (e.department?.toLowerCase().includes('director') || e.role?.toLowerCase().includes('director') || e.roleKey === 'admin')) ||
                        (teamFilter === 'GHL Experts' && (e.department?.toLowerCase().includes('ghl') || e.team?.toLowerCase().includes('ghl')));
    return matchesSearch && matchesTeam;
  });

  const filteredLeaveQueue = leaveRequests.filter(req => {
    const matchesFilter = leaveQueueFilter === 'ALL' || req.status.toLowerCase() === leaveQueueFilter.toLowerCase();
    const matchesSearch = req.employee.toLowerCase().includes(leaveSearch.toLowerCase()) ||
                          (req.department && req.department.toLowerCase().includes(leaveSearch.toLowerCase())) ||
                          (req.type && req.type.toLowerCase().includes(leaveSearch.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const filteredHelpdesk = hrRequests.filter(t => {
    const matchesFilter = helpdeskFilter === 'ALL' || 
                          (helpdeskFilter === 'OPEN' && t.status !== 'Resolved') ||
                          (helpdeskFilter === 'RESOLVED' && t.status === 'Resolved');
    const matchesSearch = (t.subject && t.subject.toLowerCase().includes(helpdeskSearch.toLowerCase())) ||
                          (t.employee && t.employee.toLowerCase().includes(helpdeskSearch.toLowerCase())) ||
                          (t.category && t.category.toLowerCase().includes(helpdeskSearch.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const filteredAuditLogs = auditLogs.filter(a => {
    return (a.action && a.action.toLowerCase().includes(auditSearch.toLowerCase())) ||
           (a.user && a.user.toLowerCase().includes(auditSearch.toLowerCase())) ||
           (a.module && a.module.toLowerCase().includes(auditSearch.toLowerCase()));
  });

  const filteredAnnouncements = announcements.filter(a => {
    if (annFilter === 'ALL') return true;
    return a.priority?.toLowerCase() === annFilter.toLowerCase();
  });

  const handlePublishAnnouncement = (e) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    if (onPostAnnouncement) {
      onPostAnnouncement({
        title: annTitle.trim(),
        target: annTarget,
        priority: annPriority,
        content: annContent.trim()
      });
    }

    setShowAnnounceModal(false);
    setAnnTitle('');
    setAnnContent('');
  };

  const rbacMatrix = [
    { feature: 'View Personal Dashboard & Profile', emp: true, lead: true, head: true, hr: true, admin: true },
    { feature: 'Apply for Standard / Emergency Leave', emp: true, lead: true, head: true, hr: true, admin: true },
    { feature: 'Submit HR Helpdesk Request', emp: true, lead: true, head: true, hr: true, admin: true },
    { feature: '1st-Tier Team Leave Approval', emp: false, lead: true, head: true, hr: true, admin: true },
    { feature: 'View Team Attendance & Directory', emp: false, lead: true, head: true, hr: true, admin: true },
    { feature: '2nd-Tier Department Escalation Approval', emp: false, lead: false, head: true, hr: true, admin: true },
    { feature: 'Department Utilization Analytics', emp: false, lead: false, head: true, hr: true, admin: true },
    { feature: 'Configure Leave Policies & Rules', emp: false, lead: false, head: false, hr: true, admin: true },
    { feature: 'Delete / Retract Leave Policies', emp: false, lead: false, head: false, hr: true, admin: true },
    { feature: 'Broadcast Announcements to All Accounts', emp: false, lead: false, head: false, hr: true, admin: true },
    { feature: 'Organization Headcount & Employee CRUD', emp: false, lead: false, head: false, hr: true, admin: true },
    { feature: 'HR Helpdesk Ticket Triage & Resolution', emp: false, lead: false, head: false, hr: true, admin: true },
    { feature: 'User Identity Provisioning & Passwords', emp: false, lead: false, head: false, hr: true, admin: true },
    { feature: 'Immutable Security Audit Logs View', emp: false, lead: false, head: false, hr: true, admin: true }
  ];

  return (
    <div className="page-viewport">
      {/* 1. DASHBOARD */}
      {activePage === 'Dashboard' && (
        <>
          <div className="page-title-banner">
            <div>
              <h1>HR Operations & People Management</h1>
              <p>People Partner: {user.name} • Registered Headcount: {allEmployees.filter(e => e.roleKey !== 'admin').length} Staff</p>
            </div>
            <div className="page-actions-group">
              <button className="btn-outline-saas" onClick={() => setShowAnnounceModal(true)}>
                <Megaphone size={14} />
                <span>Broadcast Notice</span>
              </button>
              <button className="btn-outline-saas" onClick={onOpenCreateUserModal}>
                <Plus size={14} />
                <span>Provision Employee</span>
              </button>
              <button className="btn-primary-saas" onClick={() => onOpenPolicyModal(null)}>
                <Plus size={14} />
                <span>Add Policy</span>
              </button>
            </div>
          </div>

          {/* Clean 4-Column Stat Cards */}
          <div className="stat-cards-grid">
            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-label">Total Organization Workforce</span>
              </div>
              <div className="stat-value">{allEmployees.filter(e => e.roleKey !== 'admin').length} Employees</div>
              <div className="stat-bottom">
                <span>{allEmployees.filter(e => e.roleKey !== 'admin').length > 0 ? 'Active accounts' : '0 Provisioned staff'}</span>
                <span style={{ color: allEmployees.filter(e => e.roleKey !== 'admin').length > 0 ? '#065f46' : '#6b7280', fontWeight: 600 }}>
                  {allEmployees.filter(e => e.roleKey !== 'admin').length > 0 ? 'Active' : '0 Active'}
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-label">Pending Leave Requests</span>
              </div>
              <div className="stat-value">{pendingRequests.length} Pending</div>
              <div className="stat-bottom">
                <span>Company-wide approval desk</span>
                <span style={{ color: pendingRequests.length > 0 ? '#92400e' : '#065f46', fontWeight: 600 }}>
                  {pendingRequests.length > 0 ? 'Action Required' : '0 Pending'}
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-label">Active Policies</span>
              </div>
              <div className="stat-value">{leavePolicies.filter(p => p.status === 'Active').length} Rules</div>
              <div className="stat-bottom">
                <span>Configured policies</span>
                <span style={{ color: '#065f46', fontWeight: 600 }}>Dynamic Engine</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-label">Company Announcements</span>
              </div>
              <div className="stat-value">{announcements.length} Live</div>
              <div className="stat-bottom">
                <span>Delivered to all accounts</span>
                <span style={{ color: '#065f46', fontWeight: 600 }}>Broadcast Active</span>
              </div>
            </div>
          </div>

          {/* Organization-wide Leave Review Table */}
          <div className="platform-card" style={{ padding: 0 }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 600 }}>Recent Organization-Wide Leave Requests</h3>
              <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                HR Final Approval & Policy Enforcement
              </span>
            </div>

            <div className="platform-table-wrapper" style={{ border: 'none' }}>
              <table className="platform-table">
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Department & Team</th>
                    <th>Leave Type</th>
                    <th>Dates</th>
                    <th>Duration</th>
                    <th>Routing Stage</th>
                    <th style={{ textAlign: 'center' }}>HR Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '28px', color: '#6b7280' }}>
                        No leave requests submitted yet across the organization.
                      </td>
                    </tr>
                  ) : (
                    leaveRequests.slice(0, 5).map((req) => (
                      <tr key={req.id}>
                        <td><strong style={{ color: '#111827' }}>{req.employee}</strong></td>
                        <td>{req.department} ({req.team})</td>
                        <td>{req.type}</td>
                        <td><strong>{req.dates}</strong></td>
                        <td>{req.days} Day(s)</td>
                        <td>
                          <span className={`badge badge-${req.status.toLowerCase()}`}>
                            {req.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {req.status === 'Pending' ? (
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                              <button
                                className="btn-primary-saas"
                                style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                                onClick={() => onApproveRequest(req.id)}
                              >
                                <Check size={12} />
                                <span>HR Approve</span>
                              </button>
                              <button
                                className="btn-outline-saas"
                                style={{ color: '#991b1b', padding: '3px 8px', fontSize: '0.72rem' }}
                                onClick={() => onRejectRequest(req.id)}
                              >
                                <X size={12} />
                                <span>Reject</span>
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.74rem', color: '#6b7280' }}>Completed</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* 2. EMPLOYEE DIRECTORY & MANAGEMENT */}
      {(activePage === 'Employee Directory' || activePage === 'Employee Management') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <div className="page-title-banner">
            <div>
              <h1>Employee Management & Access Credentials ({employeesOnly.length} Registered)</h1>
              <p>Provision login credentials (email & password), assign roles, departments, and leave quotas.</p>
            </div>
            <button className="btn-primary-saas" onClick={onOpenCreateUserModal}>
              <Plus size={14} />
              <span>Provision New Employee</span>
            </button>
          </div>

          <div className="filter-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {TEAM_CATEGORIES.map((tc) => {
                const IconComponent = tc.icon;
                const isActive = teamFilter === tc.key;
                return (
                  <button
                    key={tc.key}
                    type="button"
                    onClick={() => setTeamFilter(tc.key)}
                    style={{
                      borderRadius: '9999px',
                      padding: '6px 14px',
                      fontSize: '0.81rem',
                      fontWeight: isActive ? 700 : 500,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      border: isActive ? '1px solid #eab308' : '1px solid #e2e8f0',
                      background: isActive ? '#fef08a' : '#f1f5f9',
                      color: isActive ? '#854d0e' : '#475569',
                      transition: 'all 0.15s ease',
                      boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
                    }}
                  >
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '9999px',
                      background: isActive ? '#fde047' : '#e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isActive ? '#713f12' : '#64748b'
                    }}>
                      <IconComponent size={13} />
                    </div>
                    <span>{tc.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="search-box" style={{ width: '260px' }}>
              <Search size={14} color="#6b7280" />
              <input 
                type="text" 
                placeholder="Search employees..." 
                value={empSearch}
                onChange={(e) => setEmpSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.82rem' }}
              />
            </div>
          </div>

          <div className="platform-card" style={{ padding: 0 }}>
            <div className="platform-table-wrapper" style={{ border: 'none' }}>
              <table className="platform-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Employee Name</th>
                    <th>Department & Team</th>
                    <th>Portal Role</th>
                    <th>Tenure & Career Milestones</th>
                    <th>Allowed Leave Quotas</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>
                        No employees found matching the search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((e) => {
                      const ms = calculateEmploymentMilestones(e.dateJoinedRaw || e.dateJoined || '2024-01-15');
                      const isProbOrIntern = ['Probation', 'Intern', 'Internship'].includes(e.employmentType) || !ms.leavesEntitled;
                      return (
                        <tr key={e.id}>
                          <td><strong>{e.id}</strong></td>
                          <td>
                            <strong style={{ color: '#111827' }}>{e.name}</strong>
                            <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>{e.email}</div>
                          </td>
                          <td>{e.department} ({e.team})</td>
                          <td>
                            <span className="badge badge-active">{e.role}</span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              <div style={{ fontSize: '0.76rem', fontWeight: 600, color: '#1e293b' }}>
                                Joined: {ms.joinedDateStr}
                              </div>
                              <span style={{
                                fontSize: '0.70rem',
                                fontWeight: 700,
                                padding: '2px 7px',
                                borderRadius: '9999px',
                                background: ms.badgeBg,
                                color: ms.badgeColor,
                                display: 'inline-block',
                                width: 'fit-content'
                              }}>
                                {ms.statusBadge}
                              </span>
                              <div style={{ fontSize: '0.67rem', color: '#64748b' }}>
                                {ms.nextMilestoneText}
                              </div>
                            </div>
                          </td>
                          <td>
                            {isProbOrIntern ? (
                              <span style={{
                                background: '#fffbeb',
                                color: '#b45309',
                                border: '1px solid #fde68a',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontWeight: 600,
                                fontSize: '0.72rem',
                                display: 'inline-block'
                              }}>
                                0 Leaves ({ms.statusBadge})
                              </span>
                            ) : (
                              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', fontSize: '0.72rem' }}>
                                <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                                  {e.leaveBalances?.annual?.remaining ?? 20}d / {e.leaveBalances?.annual?.total ?? 20}d Annual
                                </span>
                                <span style={{ background: '#ecfdf5', color: '#059669', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                                  {e.leaveBalances?.medical?.remaining ?? 10}d Med
                                </span>
                                <span style={{ background: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                                  {e.leaveBalances?.casual?.remaining ?? 8}d Cas
                                </span>
                              </div>
                            )}
                          </td>
                          <td>
                            <span className={`badge ${e.status === 'Active' || !e.status ? 'badge-approved' : 'badge-pending'}`}>
                              {e.status || 'Active'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                              <button
                                onClick={() => setEditingEmployee(e)}
                                className="btn-outline-saas"
                                style={{
                                  padding: '4px 10px',
                                  fontSize: '0.74rem',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  borderRadius: '6px',
                                  borderColor: '#cbd5e1',
                                  color: '#4338ca',
                                  background: '#eef2ff'
                                }}
                                title="Edit employee details, starting date, role & quotas"
                              >
                                <Edit3 size={13} />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  const confirmed = window.confirm(`Are you sure you want to delete employee "${e.name}" (${e.email})?\n\nThis will remove their profile and credentials permanently.`);
                                  if (confirmed && onDeleteEmployee) {
                                    onDeleteEmployee(e.id);
                                  }
                                }}
                                className="btn-outline-saas"
                                style={{
                                  padding: '4px 10px',
                                  fontSize: '0.74rem',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  borderRadius: '6px',
                                  borderColor: '#fecaca',
                                  color: '#dc2626',
                                  background: '#fff1f2'
                                }}
                                title="Delete employee profile"
                              >
                                <Trash2 size={13} />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. LEAVE POLICY ENGINE (WITH DELETE & ADD POLICY) */}
      {activePage === 'Leave Policy Engine' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <div className="page-title-banner">
            <div>
              <h1>Configurable Leave Policy Engine</h1>
              <p>Define dynamic eligibility criteria, entitlement days, and approval chains. HR can create or delete policies at any time.</p>
            </div>
            <button className="btn-primary-saas" onClick={() => onOpenPolicyModal(null)}>
              <Plus size={14} />
              <span>Add New Policy</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', width: '100%' }}>
            {leavePolicies.length === 0 ? (
              <div className="platform-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
                <FileText size={36} color="#9ca3af" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '1rem', color: '#111827', marginBottom: '6px' }}>No Leave Policies Active</h3>
                <p style={{ fontSize: '0.82rem', marginBottom: '16px' }}>
                  All policies have been removed. Click "Add New Policy" to define vacation, medical, maternity, or custom leaves.
                </p>
                <button className="btn-primary-saas" onClick={() => onOpenPolicyModal(null)}>
                  <Plus size={14} />
                  <span>Add New Policy</span>
                </button>
              </div>
            ) : (
              leavePolicies.map((pol) => (
                <div key={pol.id} className="platform-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div className="card-title-row">
                      <h3 style={{ fontSize: '0.98rem' }}>{pol.name}</h3>
                      <span className={`badge ${pol.status === 'Active' ? 'badge-approved' : 'badge-pending'}`}>{pol.status}</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: '12px' }}>
                      {pol.description}
                    </p>

                    <div style={{ background: '#f9fafb', padding: '10px 12px', borderRadius: '6px', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <div>
                        <strong style={{ color: '#374151' }}>Eligibility:</strong> {pol.eligibility?.gender || 'All'} • {pol.eligibility?.employmentType || 'Full-Time'} (Min service: {pol.eligibility?.minimumService || 'None'})
                      </div>
                      <div>
                        <strong style={{ color: '#374151' }}>Allowed Entitlement:</strong>{' '}
                        <span style={{ fontWeight: 700, color: '#1d4ed8', background: '#eff6ff', padding: '2px 8px', borderRadius: '4px', border: '1px solid #dbeafe' }}>
                          {pol.days ? `${pol.days} Days / Year` : pol.entitlement}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#059669', marginLeft: '6px', fontWeight: 600 }}>
                          • Live Synchronized with Employees
                        </span>
                      </div>
                      <div>
                        <strong style={{ color: '#374151' }}>Carry Forward:</strong> {pol.carryForward}
                      </div>
                      <div>
                        <strong style={{ color: '#374151' }}>Approval Chain:</strong>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                          {(pol.approvalWorkflow || ['Team Lead', 'HR']).map((step, idx, arr) => (
                            <React.Fragment key={step}>
                              <span style={{ background: '#ffffff', border: '1px solid #e5e7eb', padding: '1px 6px', borderRadius: '4px', fontWeight: 500, fontSize: '0.72rem' }}>
                                {step}
                              </span>
                              {idx < arr.length - 1 && <ArrowRight size={11} color="#9ca3af" />}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button 
                      className="btn-outline-saas" 
                      style={{ color: '#dc2626', borderColor: '#fca5a5', padding: '3px 8px', fontSize: '0.74rem' }} 
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete the "${pol.name}" policy? This action will immediately remove it from all employee application forms.`)) {
                          if (onDeletePolicy) onDeletePolicy(pol.id);
                        }
                      }}
                      title="Delete Policy"
                    >
                      <Trash2 size={12} />
                      <span>Delete Policy</span>
                    </button>
                    <button className="btn-outline-saas" style={{ padding: '3px 8px', fontSize: '0.74rem' }} onClick={() => onOpenPolicyModal(pol)}>
                      <Edit3 size={12} />
                      <span>Edit Rules</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 4. LEAVE REQUESTS QUEUE (FIXED EMPTY SCREEN) */}
      {activePage === 'Leave Requests Queue' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <div className="page-title-banner">
            <div>
              <h1>Company-Wide Leave Requests Queue</h1>
              <p>HR centralized review desk. One-click approvals, policy verification, and employee absence ledger updates.</p>
            </div>
          </div>

          <div className="filter-bar">
            <div className="tabs-segmented">
              <button className={`tab-segmented-btn ${leaveQueueFilter === 'ALL' ? 'active' : ''}`} onClick={() => setLeaveQueueFilter('ALL')}>
                All Requests ({leaveRequests.length})
              </button>
              <button className={`tab-segmented-btn ${leaveQueueFilter === 'PENDING' ? 'active' : ''}`} onClick={() => setLeaveQueueFilter('PENDING')}>
                Pending ({leaveRequests.filter(r => r.status === 'Pending').length})
              </button>
              <button className={`tab-segmented-btn ${leaveQueueFilter === 'APPROVED' ? 'active' : ''}`} onClick={() => setLeaveQueueFilter('APPROVED')}>
                Approved ({leaveRequests.filter(r => r.status === 'Approved').length})
              </button>
              <button className={`tab-segmented-btn ${leaveQueueFilter === 'REJECTED' ? 'active' : ''}`} onClick={() => setLeaveQueueFilter('REJECTED')}>
                Rejected ({leaveRequests.filter(r => r.status === 'Rejected').length})
              </button>
            </div>

            <div className="search-box" style={{ width: '280px' }}>
              <Search size={14} color="#6b7280" />
              <input 
                type="text" 
                placeholder="Search by employee or leave..." 
                value={leaveSearch}
                onChange={(e) => setLeaveSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.82rem' }}
              />
            </div>
          </div>

          <div className="platform-card" style={{ padding: 0 }}>
            <div className="platform-table-wrapper" style={{ border: 'none' }}>
              <table className="platform-table">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Employee Name</th>
                    <th>Department & Team</th>
                    <th>Leave Classification</th>
                    <th>Dates</th>
                    <th>Duration</th>
                    <th>Routing Stage</th>
                    <th style={{ textAlign: 'center' }}>HR Final Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeaveQueue.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: '#6b7280' }}>
                        <CalendarDays size={32} color="#9ca3af" style={{ margin: '0 auto 8px', display: 'block' }} />
                        <div style={{ fontWeight: 600, color: '#111827' }}>No leave requests found</div>
                        <div style={{ fontSize: '0.78rem', marginTop: '4px' }}>There are currently no leave requests matching your selected filter.</div>
                      </td>
                    </tr>
                  ) : (
                    filteredLeaveQueue.map((req) => (
                      <tr key={req.id}>
                        <td><strong>{req.id}</strong></td>
                        <td><strong style={{ color: '#111827' }}>{req.employee}</strong></td>
                        <td>{req.department} ({req.team})</td>
                        <td>{req.type}</td>
                        <td><strong>{req.dates}</strong></td>
                        <td>{req.days} Day(s)</td>
                        <td>
                          <span className={`badge badge-${req.status.toLowerCase()}`}>
                            {req.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {req.status === 'Pending' ? (
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                              <button
                                className="btn-primary-saas"
                                style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                                onClick={() => onApproveRequest(req.id)}
                              >
                                <Check size={12} />
                                <span>HR Approve</span>
                              </button>
                              <button
                                className="btn-outline-saas"
                                style={{ color: '#991b1b', padding: '3px 8px', fontSize: '0.72rem' }}
                                onClick={() => onRejectRequest(req.id)}
                              >
                                <X size={12} />
                                <span>Reject</span>
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.74rem', color: '#6b7280' }}>Processed ({req.status})</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. HR HELPDESK (FIXED EMPTY TABLE) */}
      {activePage === 'HR Helpdesk' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <div className="page-title-banner">
            <div>
              <h1>HR Helpdesk & Ticket Triage</h1>
              <p>Inquiries on payroll, taxes, letters, benefits, and equipment raised by staff members.</p>
            </div>
          </div>

          <div className="filter-bar">
            <div className="tabs-segmented">
              <button className={`tab-segmented-btn ${helpdeskFilter === 'ALL' ? 'active' : ''}`} onClick={() => setHelpdeskFilter('ALL')}>
                All Tickets ({hrRequests.length})
              </button>
              <button className={`tab-segmented-btn ${helpdeskFilter === 'OPEN' ? 'active' : ''}`} onClick={() => setHelpdeskFilter('OPEN')}>
                Open / In Progress ({hrRequests.filter(t => t.status !== 'Resolved').length})
              </button>
              <button className={`tab-segmented-btn ${helpdeskFilter === 'RESOLVED' ? 'active' : ''}`} onClick={() => setHelpdeskFilter('RESOLVED')}>
                Resolved ({hrRequests.filter(t => t.status === 'Resolved').length})
              </button>
            </div>

            <div className="search-box" style={{ width: '280px' }}>
              <Search size={14} color="#6b7280" />
              <input 
                type="text" 
                placeholder="Search ticket subject or employee..." 
                value={helpdeskSearch}
                onChange={(e) => setHelpdeskSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.82rem' }}
              />
            </div>
          </div>

          <div className="platform-card" style={{ padding: 0 }}>
            <div className="platform-table-wrapper" style={{ border: 'none' }}>
              <table className="platform-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Employee</th>
                    <th>Category</th>
                    <th>Subject Description</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHelpdesk.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: '#6b7280' }}>
                        <HelpCircle size={32} color="#9ca3af" style={{ margin: '0 auto 8px', display: 'block' }} />
                        <div style={{ fontWeight: 600, color: '#111827' }}>No HR helpdesk tickets logged</div>
                        <div style={{ fontSize: '0.78rem', marginTop: '4px' }}>Employees can submit inquiries directly from their portal helpdesk.</div>
                      </td>
                    </tr>
                  ) : (
                    filteredHelpdesk.map((t) => (
                      <tr key={t.id}>
                        <td><strong>{t.id}</strong></td>
                        <td><strong>{t.employee}</strong></td>
                        <td>{t.category}</td>
                        <td>{t.subject}</td>
                        <td><span className="badge badge-active">{t.priority || 'Normal'}</span></td>
                        <td>
                          <span className={`badge ${t.status === 'Resolved' ? 'badge-approved' : 'badge-pending'}`}>{t.status}</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {t.status !== 'Resolved' ? (
                            <button
                              className="btn-primary-saas"
                              style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                              onClick={() => onUpdateTicketStatus && onUpdateTicketStatus(t.id, 'Resolved')}
                            >
                              Mark Resolved
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.74rem', color: '#065f46', fontWeight: 600 }}>Resolved</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. ANNOUNCEMENTS BROADCAST CENTER (DELIVERED TO ALL ACCOUNTS) */}
      {activePage === 'Announcements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <div className="page-title-banner">
            <div>
              <h1>Company Announcements & Broadcasts</h1>
              <p>Broadcast notices, executive memos, and policy updates delivered directly to all employee, lead, and admin dashboards.</p>
            </div>
            <button className="btn-primary-saas" onClick={() => setShowAnnounceModal(true)}>
              <Megaphone size={14} />
              <span>Broadcast Announcement</span>
            </button>
          </div>

          <div className="filter-bar">
            <div className="tabs-segmented">
              <button className={`tab-segmented-btn ${annFilter === 'ALL' ? 'active' : ''}`} onClick={() => setAnnFilter('ALL')}>
                All Broadcasts ({announcements.length})
              </button>
              <button className={`tab-segmented-btn ${annFilter === 'General' ? 'active' : ''}`} onClick={() => setAnnFilter('General')}>
                General
              </button>
              <button className={`tab-segmented-btn ${annFilter === 'Urgent' ? 'active' : ''}`} onClick={() => setAnnFilter('Urgent')}>
                Urgent
              </button>
              <button className={`tab-segmented-btn ${annFilter === 'Policy' ? 'active' : ''}`} onClick={() => setAnnFilter('Policy')}>
                Policy Updates
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredAnnouncements.length === 0 ? (
              <div className="platform-card" style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
                <Megaphone size={36} color="#9ca3af" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '1rem', color: '#111827', marginBottom: '6px' }}>No Broadcast Announcements</h3>
                <p style={{ fontSize: '0.82rem', marginBottom: '16px' }}>
                  Click "Broadcast Announcement" to send a company-wide update to all users.
                </p>
                <button className="btn-primary-saas" onClick={() => setShowAnnounceModal(true)}>
                  <Megaphone size={14} />
                  <span>Broadcast Announcement</span>
                </button>
              </div>
            ) : (
              filteredAnnouncements.map((a) => (
                <div key={a.id} className="platform-card" style={{ position: 'relative' }}>
                  <div className="card-title-row">
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827' }}>{a.title}</h3>
                      <p style={{ fontSize: '0.76rem', color: '#6b7280', marginTop: '3px' }}>
                        Broadcasted by <strong style={{ color: '#374151' }}>{a.author}</strong> • {a.date} • Target: <strong style={{ color: '#2563eb' }}>{a.target}</strong>
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`badge ${a.priority === 'Urgent' ? 'badge-rejected' : 'badge-active'}`}>
                        {a.priority || 'General'}
                      </span>
                      {onDeleteAnnouncement && (
                        <button 
                          onClick={() => {
                            if (window.confirm(`Delete announcement "${a.title}" from all employee portals?`)) {
                              onDeleteAnnouncement(a.id);
                            }
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#9ca3af',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: '4px'
                          }}
                          title="Delete announcement"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p style={{ fontSize: '0.86rem', color: '#374151', lineHeight: 1.5, marginTop: '8px' }}>
                    {a.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 7. ROLES & PERMISSIONS */}
      {activePage === 'Roles & Permissions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <div className="page-title-banner">
            <div>
              <h1>Role-Based Access Control (RBAC) Matrix</h1>
              <p>Permission hierarchy mapping across Employee, Team Lead, Department Head, HR, and System Admin.</p>
            </div>
          </div>

          <div className="platform-card" style={{ padding: 0 }}>
            <div className="platform-table-wrapper" style={{ border: 'none' }}>
              <table className="platform-table">
                <thead>
                  <tr>
                    <th>Capability / Functional Module</th>
                    <th style={{ textAlign: 'center' }}>Employee</th>
                    <th style={{ textAlign: 'center' }}>Team Lead</th>
                    <th style={{ textAlign: 'center' }}>Dept Head</th>
                    <th style={{ textAlign: 'center' }}>HR Manager</th>
                    <th style={{ textAlign: 'center' }}>System Admin</th>
                  </tr>
                </thead>
                <tbody>
                  {rbacMatrix.map((item, idx) => (
                    <tr key={idx}>
                      <td><strong style={{ color: '#111827' }}>{item.feature}</strong></td>
                      <td style={{ textAlign: 'center' }}>
                        {item.emp ? <Check size={14} color="#059669" /> : <X size={14} color="#d1d5db" />}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {item.lead ? <Check size={14} color="#059669" /> : <X size={14} color="#d1d5db" />}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {item.head ? <Check size={14} color="#059669" /> : <X size={14} color="#d1d5db" />}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {item.hr ? <Check size={14} color="#059669" /> : <X size={14} color="#d1d5db" />}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {item.admin ? <Check size={14} color="#059669" /> : <X size={14} color="#d1d5db" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 8. AUDIT LOGS */}
      {activePage === 'Audit Logs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <div className="page-title-banner">
            <div>
              <h1>Security & Governance Audit Trail</h1>
              <p>Append-only immutable record of all policy alterations, approvals, credential provisioning, and system events.</p>
            </div>
            <div className="search-box" style={{ width: '280px' }}>
              <Search size={14} color="#6b7280" />
              <input 
                type="text" 
                placeholder="Search audit actions or users..." 
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.82rem' }}
              />
            </div>
          </div>

          <div className="platform-card" style={{ padding: 0 }}>
            <div className="platform-table-wrapper" style={{ border: 'none' }}>
              <table className="platform-table">
                <thead>
                  <tr>
                    <th>Log ID</th>
                    <th>Actor</th>
                    <th>Action Description</th>
                    <th>Module</th>
                    <th>IP Address</th>
                    <th style={{ textAlign: 'right' }}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAuditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>
                        No audit events recorded matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAuditLogs.map((log) => (
                      <tr key={log.id}>
                        <td><strong>{log.id}</strong></td>
                        <td><strong style={{ color: '#111827' }}>{log.user}</strong></td>
                        <td>{log.action}</td>
                        <td><span className="badge badge-active">{log.module}</span></td>
                        <td><code style={{ fontSize: '0.74rem', color: '#6b7280' }}>{log.ip}</code></td>
                        <td style={{ textAlign: 'right', color: '#6b7280', fontSize: '0.78rem' }}>{log.time}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Announcement Modal */}
      {showAnnounceModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.05rem', fontWeight: 700 }}>
                <Megaphone size={18} color="#2563eb" />
                <span>Broadcast Announcement to All Accounts</span>
              </h3>
              <button onClick={() => setShowAnnounceModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handlePublishAnnouncement}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Headline / Title</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Annual Leave Year-End Carryover Notice" 
                    value={annTitle} 
                    onChange={(e) => setAnnTitle(e.target.value)} 
                    required 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Target Audience</label>
                    <select 
                      className="form-select"
                      value={annTarget}
                      onChange={(e) => setAnnTarget(e.target.value)}
                    >
                      <option value="All Employees">All Employees (Company-Wide)</option>
                      <option value="Directors">Directors</option>
                      <option value="Developers">Developers</option>
                      <option value="GHL Experts">GHL Experts</option>
                      <option value="Designers">Designers</option>
                      <option value="Marketers">Marketers</option>
                      <option value="Supporting Staff">Supporting Staff</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Priority / Classification</label>
                    <select 
                      className="form-select"
                      value={annPriority}
                      onChange={(e) => setAnnPriority(e.target.value)}
                    >
                      <option value="General">General Notice</option>
                      <option value="Policy">Policy Update</option>
                      <option value="Urgent">Urgent Broadcast</option>
                      <option value="Event">Company Event</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Announcement Content</label>
                  <textarea 
                    className="form-textarea" 
                    rows="5" 
                    placeholder="Provide details of the announcement. This bulletin will be broadcasted to all logged-in user dashboards and notice centers..."
                    value={annContent}
                    onChange={(e) => setAnnContent(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowAnnounceModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Megaphone size={14} />
                  <span>Broadcast to All</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      <EditEmployeeModal
        isOpen={!!editingEmployee}
        onClose={() => setEditingEmployee(null)}
        employee={editingEmployee}
        onSaveEmployee={(updated) => {
          if (onUpdateEmployee) {
            onUpdateEmployee(updated);
          }
        }}
      />
    </div>
  );
}

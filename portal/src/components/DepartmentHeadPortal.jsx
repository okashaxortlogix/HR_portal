import React, { useState } from 'react';
import { 
  CheckSquare, 
  CalendarDays, 
  Users, 
  Megaphone, 
  Check, 
  X, 
  Search, 
  Calendar 
} from 'lucide-react';

export default function DepartmentHeadPortal({ 
  user, 
  departmentOverview = [], 
  leaveRequests = [], 
  allEmployees = [],
  announcements = [],
  onApproveAll, 
  onApproveRequest,
  onRejectRequest,
  activePage = 'Dashboard' 
}) {
  const [approvalsFilter, setApprovalsFilter] = useState('PENDING');
  const [dirSearch, setDirSearch] = useState('');
  const pendingRequests = leaveRequests.filter(r => r.status === 'Pending');

  const filteredApprovals = leaveRequests.filter(r => {
    if (approvalsFilter === 'PENDING') return r.status === 'Pending';
    if (approvalsFilter === 'APPROVED') return r.status === 'Approved';
    if (approvalsFilter === 'REJECTED') return r.status === 'Rejected';
    return true;
  });

  const filteredEmployees = allEmployees.filter(e => 
    e.name.toLowerCase().includes(dirSearch.toLowerCase()) ||
    e.role.toLowerCase().includes(dirSearch.toLowerCase()) ||
    (e.team && e.team.toLowerCase().includes(dirSearch.toLowerCase()))
  );

  return (
    <div className="page-viewport">
      {/* 1. DASHBOARD */}
      {activePage === 'Dashboard' && (
        <>
          <div className="page-title-banner">
            <div>
              <h1>Engineering Department Leadership</h1>
              <p>Department Head: {user.name} • {departmentOverview.length} Functional Teams • {departmentOverview.reduce((acc, t) => acc + (t.members || 0), 0)} Registered Staff</p>
            </div>
            <button 
              className="btn-primary-saas"
              onClick={() => {
                alert('All department leave requests have been given secondary sign-off.');
                if (onApproveAll) onApproveAll();
              }}
            >
              <CheckSquare size={14} />
              <span>Bulk Approve Dept Leaves</span>
            </button>
          </div>

          {/* Clean 4-Column Stat Cards */}
          <div className="stat-cards-grid">
            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-label">Total Department Headcount</span>
              </div>
              <div className="stat-value">{departmentOverview.reduce((acc, t) => acc + (t.members || 0), 0)} Staff</div>
              <div className="stat-bottom">
                <span>Department active teams</span>
                <span style={{ color: '#065f46', fontWeight: 600 }}>Active</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-label">Engineers on Leave Today</span>
              </div>
              <div className="stat-value">{leaveRequests.filter(r => r.status === 'Approved').length} Staff</div>
              <div className="stat-bottom">
                <span>Coverage maintained</span>
                <span style={{ color: '#065f46', fontWeight: 600 }}>0 on leave</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-label">Escalated Sign-off Queue</span>
              </div>
              <div className="stat-value">{pendingRequests.length} Requests</div>
              <div className="stat-bottom">
                <span>Long leaves requiring sign-off</span>
                <span style={{ color: pendingRequests.length > 0 ? '#92400e' : '#065f46', fontWeight: 600 }}>
                  {pendingRequests.length > 0 ? 'Pending' : '0 Pending'}
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-label">Sprint Delivery Index</span>
              </div>
              <div className="stat-value">{departmentOverview.length > 0 ? '100%' : '0%'}</div>
              <div className="stat-bottom">
                <span>SLA benchmark met</span>
                <span style={{ color: '#065f46', fontWeight: 600 }}>Optimal</span>
              </div>
            </div>
          </div>

          {/* Sub-Teams Overview Table */}
          <div className="platform-card" style={{ padding: 0 }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 600 }}>Engineering Sub-Teams & Lead Breakdown</h3>
              <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>4 Specialized Pods</span>
            </div>

            <div className="platform-table-wrapper" style={{ border: 'none' }}>
              <table className="platform-table">
                <thead>
                  <tr>
                    <th>Sub-Team Name</th>
                    <th>Team Lead</th>
                    <th>Core Architecture & Stack</th>
                    <th style={{ textAlign: 'center' }}>Engineers</th>
                    <th style={{ textAlign: 'center' }}>On Leave Today</th>
                    <th style={{ textAlign: 'right' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentOverview.map((t, idx) => (
                    <tr key={idx}>
                      <td><strong style={{ color: '#111827' }}>{t.team}</strong></td>
                      <td><strong>{t.lead}</strong></td>
                      <td style={{ color: '#4b5563', fontSize: '0.8rem' }}>{t.techStack}</td>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>{t.members}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ fontWeight: 600, color: t.onLeave > 1 ? '#92400e' : '#065f46' }}>
                          {t.onLeave} Staff
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="badge badge-approved">Operational</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* 2. TEAMS & LEADS */}
      {activePage === 'Teams & Leads' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <div className="page-title-banner">
            <div>
              <h1>Engineering Teams & Reporting Leads</h1>
              <p>Structure, team leads, and operational coverage across pods.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', width: '100%' }}>
            {departmentOverview.map((team, idx) => (
              <div key={idx} className="platform-card">
                <div className="card-title-row">
                  <div>
                    <h3 style={{ fontSize: '0.98rem' }}>{team.team}</h3>
                    <p style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '2px' }}>
                      Headcount: {team.members} Staff • Stack: {team.techStack}
                    </p>
                  </div>
                  <span className="badge badge-active">Active Pod</span>
                </div>
                <div style={{ background: '#f9fafb', padding: '10px 12px', borderRadius: '6px', marginTop: '8px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>
                    Reporting Team Lead
                  </div>
                  <div style={{ fontWeight: 600, color: '#111827' }}>{team.lead}</div>
                  <p style={{ fontSize: '0.74rem', color: '#6b7280' }}>Responsible for 1st-tier leave approvals & sprint velocity</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. LEAVE APPROVALS */}
      {activePage === 'Leave Approvals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <div className="page-title-banner">
            <div>
              <h1>Department Leave Approvals Queue</h1>
              <p>Secondary sign-off for escalated and multi-day absences.</p>
            </div>
            {pendingRequests.length > 0 && (
              <button className="btn-primary-saas" onClick={onApproveAll}>
                <CheckSquare size={14} />
                <span>Sign-off All Pending ({pendingRequests.length})</span>
              </button>
            )}
          </div>

          <div className="filter-bar">
            <div className="tabs-segmented">
              <button className={`tab-segmented-btn ${approvalsFilter === 'ALL' ? 'active' : ''}`} onClick={() => setApprovalsFilter('ALL')}>
                All Requests ({leaveRequests.length})
              </button>
              <button className={`tab-segmented-btn ${approvalsFilter === 'PENDING' ? 'active' : ''}`} onClick={() => setApprovalsFilter('PENDING')}>
                Pending ({leaveRequests.filter(r => r.status === 'Pending').length})
              </button>
              <button className={`tab-segmented-btn ${approvalsFilter === 'APPROVED' ? 'active' : ''}`} onClick={() => setApprovalsFilter('APPROVED')}>
                Approved ({leaveRequests.filter(r => r.status === 'Approved').length})
              </button>
            </div>
          </div>

          <div className="platform-card" style={{ padding: 0 }}>
            <div className="platform-table-wrapper" style={{ border: 'none' }}>
              <table className="platform-table">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Employee</th>
                    <th>Team</th>
                    <th>Type</th>
                    <th>Dates</th>
                    <th>Days</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'center' }}>Sign-off Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApprovals.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
                        No leave requests in this queue.
                      </td>
                    </tr>
                  ) : (
                    filteredApprovals.map((req) => (
                      <tr key={req.id}>
                        <td><strong>{req.id}</strong></td>
                        <td><strong>{req.employee}</strong></td>
                        <td>{req.team || 'Engineering'}</td>
                        <td>{req.type}</td>
                        <td><strong>{req.dates}</strong></td>
                        <td>{req.days} Day(s)</td>
                        <td>
                          <span className={`badge badge-${req.status.toLowerCase()}`}>{req.status}</span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {req.status === 'Pending' ? (
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                              <button
                                className="btn-primary-saas"
                                style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                                onClick={() => onApproveRequest && onApproveRequest(req.id)}
                              >
                                <Check size={12} />
                                <span>Sign Off</span>
                              </button>
                              <button
                                className="btn-outline-saas"
                                style={{ color: '#991b1b', padding: '3px 8px', fontSize: '0.72rem' }}
                                onClick={() => onRejectRequest && onRejectRequest(req.id)}
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
        </div>
      )}

      {/* 4. DEPARTMENT CALENDAR */}
      {activePage === 'Department Calendar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <div className="page-title-banner">
            <div>
              <h1>Engineering Absence & Release Calendar</h1>
              <p>Sprint milestones, major releases, and scheduled team vacations.</p>
            </div>
          </div>

          <div className="platform-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ padding: '12px 14px', background: '#f9fafb', borderRadius: '6px', borderLeft: '3px solid #2563eb' }}>
              <strong>Sprint 38 Completion & Deployment:</strong> 24 Sep — Lead: Sarah Ahmed (Frontend Pod)
            </div>
            <div style={{ padding: '12px 14px', background: '#f9fafb', borderRadius: '6px', borderLeft: '3px solid #f59e0b' }}>
              <strong>Core API Migration Window:</strong> 28 Sep — Lead: Ahmed Raza (Backend Pod)
            </div>
            <div style={{ padding: '12px 14px', background: '#f9fafb', borderRadius: '6px', borderLeft: '3px solid #059669' }}>
              <strong>National Public Observance:</strong> 25 Sep — Company Standdown
            </div>
          </div>
        </div>
      )}

      {/* 5. DEPARTMENT REPORTS */}
      {activePage === 'Department Reports' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <div className="page-title-banner">
            <div>
              <h1>Engineering Reports & Analytics</h1>
              <p>Quarterly leave utilization, medical leave index, and coverage metrics.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', width: '100%' }}>
            <div className="platform-card">
              <h3>Annual Leave Utilization</h3>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, margin: '8px 0', color: '#111827' }}>
                64.2%
              </div>
              <p style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                Balanced Q4 vacation distribution without sprint bottlenecks.
              </p>
            </div>

            <div className="platform-card">
              <h3>Average Leave Duration</h3>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, margin: '8px 0', color: '#111827' }}>
                2.1 Days
              </div>
              <p style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                Most leaves are short 1-2 day rest or medical absences.
              </p>
            </div>

            <div className="platform-card">
              <h3>Coverage SLA Adherence</h3>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, margin: '8px 0', color: '#065f46' }}>
                98.8%
              </div>
              <p style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                Required on-call rotation threshold maintained throughout 2024.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 6. COMPANY DIRECTORY */}
      {activePage === 'Company Directory' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <div className="page-title-banner">
            <div>
              <h1>Company Directory ({allEmployees.length} Members)</h1>
              <p>Personnel contacts, assigned teams, and department leads.</p>
            </div>
            <div className="search-box" style={{ width: '280px' }}>
              <Search size={14} color="#6b7280" />
              <input 
                type="text" 
                placeholder="Search directory..." 
                value={dirSearch}
                onChange={(e) => setDirSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.82rem' }}
              />
            </div>
          </div>

          <div className="platform-card" style={{ padding: 0 }}>
            <div className="platform-table-wrapper" style={{ border: 'none' }}>
              <table className="platform-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Team</th>
                    <th>Role</th>
                    <th style={{ textAlign: 'right' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id}>
                      <td>
                        <strong style={{ color: '#111827' }}>{emp.name}</strong>
                        <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>{emp.email}</div>
                      </td>
                      <td>{emp.department}</td>
                      <td>{emp.team}</td>
                      <td>{emp.role}</td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="badge badge-approved">{emp.status || 'Active'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 7. ANNOUNCEMENTS */}
      {activePage === 'Announcements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <div className="page-title-banner">
            <div>
              <h1>Company Announcements</h1>
              <p>Official notices and policy updates broadcasted by People Operations.</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {announcements.length === 0 ? (
              <div className="platform-card" style={{ textAlign: 'center', padding: '36px', color: '#6b7280' }}>
                <Megaphone size={32} color="#9ca3af" style={{ margin: '0 auto 8px', display: 'block' }} />
                <p>No active announcements currently posted.</p>
              </div>
            ) : (
              announcements.map((a) => (
                <div key={a.id} className="platform-card">
                  <div className="card-title-row">
                    <div>
                      <h3 style={{ fontSize: '0.96rem' }}>{a.title}</h3>
                      <p style={{ fontSize: '0.74rem', color: '#6b7280', marginTop: '2px' }}>
                        {a.author} • {a.date} • Target: {a.target}
                      </p>
                    </div>
                    <span className={`badge ${a.priority === 'Urgent' ? 'badge-rejected' : 'badge-active'}`}>{a.priority || 'Notice'}</span>
                  </div>
                  <p style={{ fontSize: '0.84rem', color: '#374151', lineHeight: 1.5, marginTop: '8px' }}>{a.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

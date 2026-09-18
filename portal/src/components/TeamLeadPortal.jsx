import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Mail, 
  Search,
  Megaphone,
  BookOpen
} from 'lucide-react';

export default function TeamLeadPortal({ 
  user, 
  teamMembers, 
  leaveRequests, 
  allEmployees = [],
  announcements = [],
  onApproveRequest, 
  onRejectRequest, 
  activePage = 'Dashboard' 
}) {
  const [filterTab, setFilterTab] = useState('PENDING');
  const [memberSearch, setMemberSearch] = useState('');

  const pendingRequests = leaveRequests.filter(r => r.status === 'Pending');
  const displayRequests = leaveRequests.filter(r => {
    if (filterTab === 'PENDING') return r.status === 'Pending';
    if (filterTab === 'APPROVED') return r.status === 'Approved';
    if (filterTab === 'REJECTED') return r.status === 'Rejected';
    return true;
  });

  const filteredMembers = teamMembers.filter(m => 
    m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.role.toLowerCase().includes(memberSearch.toLowerCase())
  );

  return (
    <div className="page-viewport">
      {/* 1. DASHBOARD PAGE */}
      {activePage === 'Dashboard' && (
        <>
          <div className="page-title-banner">
            <div>
              <h1>Team Overview — {user.team}</h1>
              <p>Team Lead: {user.name} • Engineering Department • Reporting Head: Asim Khan</p>
            </div>
            <span className="badge badge-active" style={{ fontSize: '0.76rem' }}>
              Sprint 38 Active
            </span>
          </div>

          {/* 4 Clean Stat Cards */}
          <div className="stat-cards-grid">
            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-label">Assigned Team Members</span>
              </div>
              <div className="stat-value">{teamMembers.length} Staff</div>
              <div className="stat-bottom">
                <span>{teamMembers.length} Present • {leaveRequests.filter(r => r.status === 'Approved' && (r.team === user.team || r.department === user.department)).length} on Leave</span>
                <span style={{ color: '#065f46', fontWeight: 600 }}>{teamMembers.length > 0 ? '100% Active' : '0 Active'}</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-label">Pending Leave Approvals</span>
              </div>
              <div className="stat-value">{pendingRequests.length} Requests</div>
              <div className="stat-bottom">
                <span>Awaiting your direct action</span>
                <span style={{ color: pendingRequests.length > 0 ? '#92400e' : '#065f46', fontWeight: 600 }}>
                  {pendingRequests.length > 0 ? 'Review Queue' : '0 Pending'}
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-label">On Leave Today</span>
              </div>
              <div className="stat-value">
                {leaveRequests.filter(r => r.status === 'Approved' && (r.team === user.team || r.department === user.department)).length} Members
              </div>
              <div className="stat-bottom">
                <span>{leaveRequests.filter(r => r.status === 'Approved').length === 0 ? 'All members present' : 'Coverage Handled'}</span>
                <span style={{ color: '#065f46', fontWeight: 600 }}>0 on leave</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-label">Team Delivery Health</span>
              </div>
              <div className="stat-value">{teamMembers.length > 0 ? '100%' : '0%'}</div>
              <div className="stat-bottom">
                <span>Sprint operations</span>
                <span style={{ color: '#065f46', fontWeight: 600 }}>{teamMembers.length > 0 ? 'Optimal' : 'Zero State'}</span>
              </div>
            </div>
          </div>

          {/* Pending Approval Queue */}
          <div className="platform-card">
            <div className="card-title-row">
              <h3>Pending Leave Approvals ({pendingRequests.length})</h3>
              <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                Review and approve with immediate balance update
              </span>
            </div>

            {pendingRequests.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280', fontSize: '0.84rem' }}>
                All caught up. No pending leave requests for the Backend Team.
              </div>
            ) : (
              <div className="platform-table-wrapper">
                <table className="platform-table">
                  <thead>
                    <tr>
                      <th>Employee Name</th>
                      <th>Leave Type</th>
                      <th>Requested Dates</th>
                      <th>Reason / Justification</th>
                      <th>Workflow Stage</th>
                      <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRequests.map((req) => (
                      <tr key={req.id}>
                        <td>
                          <strong style={{ color: '#111827' }}>{req.employee}</strong>
                          <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>{req.team || user.team}</div>
                        </td>
                        <td>{req.type}</td>
                        <td><strong>{req.dates}</strong></td>
                        <td style={{ color: '#4b5563', fontSize: '0.78rem' }}>{req.reason}</td>
                        <td>
                          <span className="badge badge-pending">Team Lead Review</span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                            <button
                              className="btn-primary-saas"
                              style={{ padding: '4px 10px', fontSize: '0.74rem' }}
                              onClick={() => onApproveRequest(req.id)}
                            >
                              <Check size={12} />
                              <span>Approve</span>
                            </button>
                            <button
                              className="btn-outline-saas"
                              style={{ color: '#991b1b', padding: '4px 10px', fontSize: '0.74rem' }}
                              onClick={() => onRejectRequest(req.id)}
                            >
                              <X size={12} />
                              <span>Reject</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* 2. LEAVE APPROVALS TAB */}
      {activePage === 'Leave Approvals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <div className="page-title-banner">
            <div>
              <h1>Team Leave Approvals & History</h1>
              <p>Decision ledger for the Backend Team.</p>
            </div>
          </div>

          <div className="filter-bar">
            <div className="tabs-segmented">
              <button 
                className={`tab-segmented-btn ${filterTab === 'PENDING' ? 'active' : ''}`}
                onClick={() => setFilterTab('PENDING')}
              >
                Pending Review ({pendingRequests.length})
              </button>
              <button 
                className={`tab-segmented-btn ${filterTab === 'APPROVED' ? 'active' : ''}`}
                onClick={() => setFilterTab('APPROVED')}
              >
                Approved
              </button>
              <button 
                className={`tab-segmented-btn ${filterTab === 'REJECTED' ? 'active' : ''}`}
                onClick={() => setFilterTab('REJECTED')}
              >
                Rejected
              </button>
            </div>
          </div>

          <div className="platform-card" style={{ padding: 0 }}>
            <div className="platform-table-wrapper" style={{ border: 'none' }}>
              <table className="platform-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Employee</th>
                    <th>Classification</th>
                    <th>Dates</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayRequests.map((req) => (
                    <tr key={req.id}>
                      <td><strong>{req.id}</strong></td>
                      <td><strong>{req.employee}</strong></td>
                      <td>{req.type}</td>
                      <td><strong>{req.dates}</strong></td>
                      <td>{req.reason}</td>
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
                              Approve
                            </button>
                            <button
                              className="btn-outline-saas"
                              style={{ color: '#991b1b', padding: '3px 8px', fontSize: '0.72rem' }}
                              onClick={() => onRejectRequest(req.id)}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.74rem', color: '#6b7280' }}>Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. MY TEAM ROSTER TAB */}
      {activePage === 'My Team' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <div className="page-title-banner">
            <div>
              <h1>Backend Team Roster ({teamMembers.length} Engineers)</h1>
              <p>Direct reports, attendance status, and contact emails.</p>
            </div>
            <div className="search-box" style={{ width: '280px' }}>
              <Search size={14} color="#6b7280" />
              <input 
                type="text" 
                placeholder="Filter members..." 
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.82rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px', width: '100%' }}>
            {filteredMembers.map((m) => (
              <div key={m.id} className="platform-card" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <img 
                  src={m.avatar} 
                  alt={m.name} 
                  style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #e5e7eb' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {m.name}
                    </h4>
                    <span className={`badge ${m.onLeave ? 'badge-pending' : 'badge-approved'}`} style={{ fontSize: '0.68rem' }}>
                      {m.onLeave ? m.leaveType : 'Present'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.76rem', color: '#6b7280', margin: '2px 0 6px' }}>{m.role}</p>
                  <a 
                    href={`mailto:${m.email}`} 
                    className="btn-outline-saas" 
                    style={{ padding: '2px 8px', fontSize: '0.7rem', textDecoration: 'none', display: 'inline-flex' }}
                  >
                    <Mail size={11} />
                    <span>Email</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TEAM CALENDAR */}
      {activePage === 'Team Calendar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <div className="page-title-banner">
            <div>
              <h1>Team Absence Schedule</h1>
              <p>Ensure engineering release coverage during upcoming team leaves.</p>
            </div>
          </div>

          <div className="platform-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ padding: '10px 12px', background: '#f9fafb', borderRadius: '6px', borderLeft: '3px solid #2563eb' }}>
              <strong>18 Sep – 19 Sep:</strong> Bilal Ahmed on Medical Leave (Database queries covered by Ali Raza)
            </div>
            <div style={{ padding: '10px 12px', background: '#f9fafb', borderRadius: '6px', borderLeft: '3px solid #f59e0b' }}>
              <strong>20 Sep – 22 Sep:</strong> Ayesha Khan (Frontend) on Annual Leave
            </div>
            <div style={{ padding: '10px 12px', background: '#f9fafb', borderRadius: '6px', borderLeft: '3px solid #6b7280' }}>
              <strong>25 Sep:</strong> Public Holiday — Company-Wide Standdown
            </div>
            <div style={{ padding: '10px 12px', background: '#f9fafb', borderRadius: '6px', borderLeft: '3px solid #059669' }}>
              <strong>02 Oct – 05 Oct:</strong> Usman Tariq on Annual Leave (Microservices covered by Zainab Qazi)
            </div>
          </div>
        </div>
      )}

      {/* 5. ANNOUNCEMENTS TAB */}
      {activePage === 'Announcements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <div className="page-title-banner">
            <div>
              <h1>Company Announcements</h1>
              <p>Official announcements and executive policy updates broadcasted by People Operations.</p>
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

      {/* 6. COMPANY DIRECTORY TAB */}
      {activePage === 'Company Directory' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <div className="page-title-banner">
            <div>
              <h1>Company Directory ({allEmployees.length || teamMembers.length} Staff)</h1>
              <p>Find engineering leads, cross-department contacts, and product partners.</p>
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
                  {(allEmployees.length > 0 ? allEmployees : teamMembers).map((emp) => (
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
    </div>
  );
}

import React, { useState } from 'react';
import { 
  Plus, 
  Database, 
  Check, 
  X 
} from 'lucide-react';

export default function AdminPortal({ 
  user, 
  auditLogs, 
  allEmployees, 
  activePage = 'Dashboard' 
}) {
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('employee');

  const handleAddUser = (e) => {
    e.preventDefault();
    alert(`Account Provisioned: ${userName} (${userEmail}) as ${userRole}`);
    setShowAddUserModal(false);
    setUserName('');
    setUserEmail('');
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
    { feature: 'Organization Headcount & Employee CRUD', emp: false, lead: false, head: false, hr: true, admin: true },
    { feature: 'HR Helpdesk Ticket Triage & Resolution', emp: false, lead: false, head: false, hr: true, admin: true },
    { feature: 'User Identity Provisioning & Deactivation', emp: false, lead: false, head: false, hr: false, admin: true },
    { feature: 'Immutable Security Audit Logs View', emp: false, lead: false, head: false, hr: false, admin: true },
    { feature: 'SAML / SSO & System Configuration', emp: false, lead: false, head: false, hr: false, admin: true }
  ];

  return (
    <div className="page-viewport">
      {/* 1. DASHBOARD */}
      {activePage === 'Dashboard' && (
        <>
          <div className="page-title-banner">
            <div>
              <h1>System Administration & Security</h1>
              <p>Administrator: {user.name} • System Health: Operational • 99.98% SLA</p>
            </div>
            <div className="page-actions-group">
              <button className="btn-outline-saas" onClick={() => alert('Snapshot backup triggered.')}>
                <Database size={14} />
                <span>Backup DB</span>
              </button>
              <button className="btn-primary-saas" onClick={() => setShowAddUserModal(true)}>
                <Plus size={14} />
                <span>Provision User</span>
              </button>
            </div>
          </div>

          {/* 4 Clean Stat Cards */}
          <div className="stat-cards-grid">
            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-label">Total Provisioned Accounts</span>
              </div>
              <div className="stat-value">{allEmployees ? allEmployees.length : 1} Account{allEmployees && allEmployees.length === 1 ? '' : 's'}</div>
              <div className="stat-bottom">
                <span>Active accounts in database</span>
                <span style={{ color: '#065f46', fontWeight: 600 }}>Active</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-label">Active Organizational Units</span>
              </div>
              <div className="stat-value">6 Departments</div>
              <div className="stat-bottom">
                <span>18 Configured Teams</span>
                <span>Structured</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-label">System Availability SLA</span>
              </div>
              <div className="stat-value">99.98%</div>
              <div className="stat-bottom">
                <span>Zero unplanned downtime in 90d</span>
                <span style={{ color: '#065f46', fontWeight: 600 }}>Optimal</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-label">Security & MFA Enforcement</span>
              </div>
              <div className="stat-value">100% MFA</div>
              <div className="stat-bottom">
                <span>TOTP / WebAuthn Mandatory</span>
                <span style={{ color: '#065f46', fontWeight: 600 }}>Enforced</span>
              </div>
            </div>
          </div>

          {/* Real-Time Immutable Audit Trail */}
          <div className="platform-card" style={{ padding: 0 }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 600 }}>Security & Compliance Audit Log</h3>
              <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                Immutable write-only security ledger
              </span>
            </div>

            <div className="platform-table-wrapper" style={{ border: 'none' }}>
              <table className="platform-table">
                <thead>
                  <tr>
                    <th>Log ID</th>
                    <th>Actor</th>
                    <th>Action Taken</th>
                    <th>Target Module</th>
                    <th>Client IP</th>
                    <th style={{ textAlign: 'right' }}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td><code style={{ fontSize: '0.76rem', color: '#374151' }}>{log.id}</code></td>
                      <td><strong style={{ color: '#111827' }}>{log.user}</strong></td>
                      <td>{log.action}</td>
                      <td>
                        <span className="badge badge-active">{log.module}</span>
                      </td>
                      <td><code style={{ fontSize: '0.76rem', color: '#6b7280' }}>{log.ip}</code></td>
                      <td style={{ color: '#6b7280', textAlign: 'right' }}>{log.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* 2. USER MANAGEMENT */}
      {activePage === 'User Management' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <div className="page-title-banner">
            <div>
              <h1>User Identity & Account Management</h1>
              <p>Provision credentials, assign system roles, and revoke platform access.</p>
            </div>
            <button className="btn-primary-saas" onClick={() => setShowAddUserModal(true)}>
              <Plus size={14} />
              <span>Provision User</span>
            </button>
          </div>

          <div className="platform-card" style={{ padding: 0 }}>
            <div className="platform-table-wrapper" style={{ border: 'none' }}>
              <table className="platform-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Full Name</th>
                    <th>Email Address</th>
                    <th>Assigned Role</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allEmployees.map((u) => (
                    <tr key={u.id}>
                      <td><strong>{u.id}</strong></td>
                      <td><strong style={{ color: '#111827' }}>{u.name}</strong></td>
                      <td>{u.email}</td>
                      <td>
                        <span className="badge badge-active">{u.role}</span>
                      </td>
                      <td>{u.department}</td>
                      <td>
                        <span className="badge badge-approved">Active</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn-outline-saas" style={{ padding: '2px 8px', fontSize: '0.72rem' }} onClick={() => alert(`Reset sent to ${u.email}`)}>
                          Reset Key
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. ROLES & PERMISSIONS RBAC MATRIX */}
      {activePage === 'Roles & Permissions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <div className="page-title-banner">
            <div>
              <h1>Role-Based Access Control (RBAC) Permission Matrix</h1>
              <p>Granular capability boundaries across Employee, Team Lead, Dept Head, HR, and Admin.</p>
            </div>
          </div>

          <div className="platform-card" style={{ padding: 0 }}>
            <div className="platform-table-wrapper" style={{ border: 'none' }}>
              <table className="platform-table">
                <thead>
                  <tr>
                    <th>Platform Feature / Permission</th>
                    <th style={{ textAlign: 'center' }}>Employee</th>
                    <th style={{ textAlign: 'center' }}>Team Lead</th>
                    <th style={{ textAlign: 'center' }}>Dept Head</th>
                    <th style={{ textAlign: 'center' }}>HR Manager</th>
                    <th style={{ textAlign: 'center' }}>System Admin</th>
                  </tr>
                </thead>
                <tbody>
                  {rbacMatrix.map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ color: '#111827' }}><strong>{row.feature}</strong></td>
                      <td style={{ textAlign: 'center' }}>
                        {row.emp ? <Check size={14} color="#059669" style={{ margin: '0 auto' }} /> : <X size={14} color="#d1d5db" style={{ margin: '0 auto' }} />}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {row.lead ? <Check size={14} color="#059669" style={{ margin: '0 auto' }} /> : <X size={14} color="#d1d5db" style={{ margin: '0 auto' }} />}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {row.head ? <Check size={14} color="#059669" style={{ margin: '0 auto' }} /> : <X size={14} color="#d1d5db" style={{ margin: '0 auto' }} />}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {row.hr ? <Check size={14} color="#059669" style={{ margin: '0 auto' }} /> : <X size={14} color="#d1d5db" style={{ margin: '0 auto' }} />}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {row.admin ? <Check size={14} color="#059669" style={{ margin: '0 auto' }} /> : <X size={14} color="#d1d5db" style={{ margin: '0 auto' }} />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. AUDIT LOGS */}
      {activePage === 'Audit Logs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <div className="page-title-banner">
            <div>
              <h1>Security & Action Audit Trail</h1>
              <p>Complete record of policy adjustments, approvals, and user provisioning.</p>
            </div>
          </div>

          <div className="platform-card" style={{ padding: 0 }}>
            <div className="platform-table-wrapper" style={{ border: 'none' }}>
              <table className="platform-table">
                <thead>
                  <tr>
                    <th>Audit ID</th>
                    <th>User / Actor</th>
                    <th>Action</th>
                    <th>Module</th>
                    <th>IP Address</th>
                    <th style={{ textAlign: 'right' }}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td><code style={{ fontSize: '0.76rem', color: '#374151' }}>{log.id}</code></td>
                      <td><strong style={{ color: '#111827' }}>{log.user}</strong></td>
                      <td>{log.action}</td>
                      <td><span className="badge badge-active">{log.module}</span></td>
                      <td><code style={{ fontSize: '0.76rem', color: '#6b7280' }}>{log.ip}</code></td>
                      <td style={{ color: '#6b7280', textAlign: 'right' }}>{log.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Provision User Modal */}
      {showAddUserModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Provision Identity Account</h3>
              <button onClick={() => setShowAddUserModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>✕</button>
            </div>
            <form onSubmit={handleAddUser}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Maria Sheikh" 
                    value={userName} 
                    onChange={(e) => setUserName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Enterprise Email</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="maria.sheikh@worksphere.internal" 
                    value={userEmail} 
                    onChange={(e) => setUserEmail(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Assigned Role</label>
                  <select className="form-select" value={userRole} onChange={(e) => setUserRole(e.target.value)}>
                    <option value="employee">Employee</option>
                    <option value="team_lead">Team Lead</option>
                    <option value="department_head">Department Head</option>
                    <option value="hr">HR Operations Manager</option>
                    <option value="admin">System Administrator</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowAddUserModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Provision Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

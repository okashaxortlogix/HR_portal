import React, { useState } from 'react';
import { 
  CalendarDays, 
  Plus, 
  HelpCircle, 
  AlertTriangle, 
  UserCheck, 
  Search, 
  Download,
  AlertCircle,
  Clock,
  Award
} from 'lucide-react';
import { calculateEmploymentMilestones } from '../utils/employmentTimeline';

export default function EmployeePortal({ 
  profile, 
  leaveRequests, 
  onApplyLeave, 
  onRaiseRequest,
  allEmployees,
  announcements,
  calendarEvents,
  hrRequests,
  activePage = 'Dashboard'
}) {
  const [isInternMode, setIsInternMode] = useState(false);
  const [leaveFilter, setLeaveFilter] = useState('ALL');
  const [dirSearch, setDirSearch] = useState('');

  // Filter requests for the logged-in user
  const myRequests = leaveRequests.filter(r => r.userId === profile.id || r.employee === profile.name);
  const filteredLeaves = myRequests.filter(r => {
    if (leaveFilter === 'PENDING') return r.status === 'Pending';
    if (leaveFilter === 'APPROVED') return r.status === 'Approved';
    if (leaveFilter === 'REJECTED') return r.status === 'Rejected';
    return true;
  });

  const balances = profile.leaveBalances || {
    annual: { label: 'Annual Leave', total: 20, used: 0, remaining: 20 },
    medical: { label: 'Medical Leave', total: 10, used: 0, remaining: 10 },
    casual: { label: 'Casual Leave', total: 5, used: 0, remaining: 5 }
  };

  // Filter directory
  const filteredDir = allEmployees.filter(e => 
    e.name.toLowerCase().includes(dirSearch.toLowerCase()) ||
    e.department.toLowerCase().includes(dirSearch.toLowerCase()) ||
    e.role.toLowerCase().includes(dirSearch.toLowerCase())
  );

  const empMilestones = calculateEmploymentMilestones(profile.dateJoinedRaw || profile.dateJoined || '2024-01-15');

  return (
    <div className="page-viewport">
      {/* 1. DASHBOARD VIEW */}
      {activePage === 'Dashboard' && (
        <>
          {/* Top Banner */}
          <div className="page-title-banner">
            <div>
              <h1>Welcome, {profile.name}</h1>
              <p>{profile.designation} | {profile.department} ({profile.team}) | Joined {empMilestones.joinedDateStr} | ID: {profile.id}</p>
            </div>
            <div className="page-actions-group">
              <button 
                className="btn-outline-saas"
                onClick={() => setIsInternMode(!isInternMode)}
                style={{
                  background: isInternMode ? '#fffbeb' : '#ffffff',
                  borderColor: isInternMode ? '#f59e0b' : '#d1d5db',
                  color: isInternMode ? '#92400e' : '#374151'
                }}
                title="Toggle probation policy simulation"
              >
                <AlertTriangle size={14} color={isInternMode ? '#d97706' : '#6b7280'} />
                <span>{isInternMode ? 'Intern Policy Active' : 'Simulate Intern Policy'}</span>
              </button>

              <button 
                className="btn-primary-saas"
                onClick={() => onApplyLeave(isInternMode)}
              >
                <Plus size={15} />
                <span>{isInternMode ? 'Emergency Request' : 'Apply for Leave'}</span>
              </button>
            </div>
          </div>

          {/* Intern Mode Subtle Notice */}
          {isInternMode && (
            <div style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '6px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#92400e',
              fontSize: '0.82rem',
              width: '100%'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={17} color="#d97706" />
                <span>
                  <strong>Probation/Intern Status:</strong> Standard quota is restricted. Emergency requests are routed directly to Team Lead and HR.
                </span>
              </div>
              <button 
                className="btn-primary-saas" 
                style={{ padding: '3px 10px', fontSize: '0.76rem' }}
                onClick={() => onApplyLeave(true)}
              >
                Submit Emergency Request
              </button>
            </div>
          )}

          {/* Career Milestones Progress Bar */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '12px 18px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: empMilestones.badgeBg,
                color: empMilestones.badgeColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}>
                <Clock size={16} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>
                    Career Lifecycle Stage:
                  </span>
                  <span style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    background: empMilestones.badgeBg,
                    color: empMilestones.badgeColor
                  }}>
                    {empMilestones.statusBadge}
                  </span>
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>
                  {empMilestones.nextMilestoneText}
                </div>
              </div>
            </div>

            {/* 3 Milestone Stages */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.75rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.68rem', fontWeight: 600 }}>1. JOINED</div>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>{empMilestones.joinedDateStr}</div>
              </div>
              <div style={{ color: '#cbd5e1', fontWeight: 700 }}>→</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.68rem', fontWeight: 600 }}>2. PROBATION (+3m)</div>
                <div style={{ fontWeight: 700, color: '#4338ca' }}>{empMilestones.probationStartDateStr}</div>
              </div>
              <div style={{ color: '#cbd5e1', fontWeight: 700 }}>→</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.68rem', fontWeight: 600 }}>3. PERMANENT (+6m)</div>
                <div style={{ fontWeight: 700, color: '#15803d' }}>{empMilestones.permanentDateStr}</div>
              </div>
            </div>
          </div>

          {/* Edge-to-Edge 4-Column Clean Stats */}
          <div className="stat-cards-grid">
            {/* Annual Leave */}
            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-label">Annual Vacation</span>
                <span style={{ fontSize: '0.74rem', color: '#6b7280' }}>
                  {isInternMode ? 'Restricted' : `${balances.annual?.used || 0} of ${balances.annual?.total || 20} Days Allowed`}
                </span>
              </div>
              <div className="stat-value">
                {isInternMode ? 'N/A' : `${balances.annual?.remaining ?? 20} Days`}
              </div>
              <div className="stat-bottom">
                <span>{isInternMode ? 'Probation policy' : 'Available Balance'}</span>
                <span style={{ fontWeight: 600, color: '#1d4ed8' }}>
                  {isInternMode ? '0%' : `${Math.round(((balances.annual?.remaining ?? 20) / (balances.annual?.total || 1)) * 100)}% Left`}
                </span>
              </div>
              <div className="progress-track">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: isInternMode ? '0%' : `${Math.min(100, Math.max(0, ((balances.annual?.remaining ?? 20) / (balances.annual?.total || 1)) * 100))}%`,
                    background: '#2563eb' 
                  }} 
                />
              </div>
            </div>

            {/* Medical Leave */}
            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-label">Medical & Sick Leave</span>
                <span style={{ fontSize: '0.74rem', color: '#6b7280' }}>
                  {isInternMode ? 'Emergency Only' : `${balances.medical?.used || 0} of ${balances.medical?.total || 10} Days Allowed`}
                </span>
              </div>
              <div className="stat-value">
                {isInternMode ? 'N/A' : `${balances.medical?.remaining ?? 10} Days`}
              </div>
              <div className="stat-bottom">
                <span>{isInternMode ? 'Doctor note required' : 'Available Balance'}</span>
                <span style={{ fontWeight: 600, color: '#059669' }}>
                  {isInternMode ? '0%' : `${Math.round(((balances.medical?.remaining ?? 10) / (balances.medical?.total || 1)) * 100)}% Left`}
                </span>
              </div>
              <div className="progress-track">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: isInternMode ? '0%' : `${Math.min(100, Math.max(0, ((balances.medical?.remaining ?? 10) / (balances.medical?.total || 1)) * 100))}%`,
                    background: '#059669' 
                  }} 
                />
              </div>
            </div>

            {/* Casual Leave */}
            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-label">Casual / Personal Days</span>
                <span style={{ fontSize: '0.74rem', color: '#6b7280' }}>
                  {isInternMode ? 'Restricted' : `${balances.casual?.used || 0} of ${balances.casual?.total || 8} Days Allowed`}
                </span>
              </div>
              <div className="stat-value">
                {isInternMode ? 'N/A' : `${balances.casual?.remaining ?? 8} Days`}
              </div>
              <div className="stat-bottom">
                <span>{isInternMode ? 'Post-confirmation' : 'Available Balance'}</span>
                <span style={{ fontWeight: 600, color: '#475569' }}>
                  {isInternMode ? '0%' : `${Math.round(((balances.casual?.remaining ?? 8) / (balances.casual?.total || 1)) * 100)}% Left`}
                </span>
              </div>
              <div className="progress-track">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: isInternMode ? '0%' : `${Math.min(100, Math.max(0, ((balances.casual?.remaining ?? 8) / (balances.casual?.total || 1)) * 100))}%`,
                    background: '#475569' 
                  }} 
                />
              </div>
            </div>

            {/* Emergency Leave */}
            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-label">Emergency / Special</span>
                <span style={{ fontSize: '0.74rem', color: '#6b7280' }}>
                  {`${balances.emergency?.used || 0} of ${balances.emergency?.total || 3} Days Allowed`}
                </span>
              </div>
              <div className="stat-value">
                {`${balances.emergency?.remaining ?? 3} Days`}
              </div>
              <div className="stat-bottom">
                <span>Direct escalation</span>
                <span style={{ color: '#065f46', fontWeight: 600 }}>
                  {`${Math.round(((balances.emergency?.remaining ?? 3) / (balances.emergency?.total || 1)) * 100)}% Left`}
                </span>
              </div>
              <div className="progress-track">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${Math.min(100, Math.max(0, ((balances.emergency?.remaining ?? 3) / (balances.emergency?.total || 1)) * 100))}%`,
                    background: '#047857' 
                  }} 
                />
              </div>
            </div>
          </div>

          {/* Full-Width Two Columns */}
          <div className="dashboard-two-column">
            {/* Left: Full Width Recent Requests Table */}
            <div className="platform-card">
              <div className="card-title-row">
                <h3>
                  <CalendarDays size={16} color="#374151" />
                  <span>Recent Leave Requests</span>
                </h3>
                <button 
                  className="btn-outline-saas" 
                  style={{ padding: '3px 8px', fontSize: '0.74rem' }}
                  onClick={() => onApplyLeave(isInternMode)}
                >
                  <Plus size={13} />
                  <span>New Request</span>
                </button>
              </div>

              <div className="platform-table-wrapper">
                <table className="platform-table">
                  <thead>
                    <tr>
                      <th>Dates & Duration</th>
                      <th>Leave Type</th>
                      <th>Reason / Context</th>
                      <th>Approval Routing</th>
                      <th style={{ textAlign: 'right' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myRequests.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>
                          No leave requests recorded yet. Click "Apply for Leave" to submit your first request.
                        </td>
                      </tr>
                    ) : (
                      myRequests.map((req) => (
                        <tr key={req.id}>
                          <td>
                            <strong style={{ color: '#111827' }}>{req.dates}</strong>
                            <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>{req.days} Day(s)</div>
                          </td>
                          <td>{req.type}</td>
                          <td style={{ color: '#4b5563', fontSize: '0.78rem' }}>{req.reason}</td>
                          <td style={{ color: '#6b7280', fontSize: '0.76rem' }}>{req.approvalTier || 'Direct Approval'}</td>
                          <td style={{ textAlign: 'right' }}>
                            <span className={`badge badge-${req.status.toLowerCase()}`}>
                              {req.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Clean Reporting Line & Quick Support */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Quick Actions */}
              <div className="platform-card">
                <div className="card-title-row">
                  <h3>Quick Actions</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button 
                    className="btn-primary-saas" 
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => onApplyLeave(isInternMode)}
                  >
                    <Plus size={14} />
                    <span>{isInternMode ? 'Emergency Request' : 'Apply for Leave'}</span>
                  </button>

                  <button 
                    className="btn-outline-saas" 
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={onRaiseRequest}
                  >
                    <HelpCircle size={14} />
                    <span>Raise HR Ticket</span>
                  </button>
                </div>
              </div>

              {/* Organization Contacts (Section 11) */}
              <div className="platform-card">
                <div className="card-title-row">
                  <h3>
                    <UserCheck size={16} color="#374151" />
                    <span>Reporting Contacts</span>
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
                  <div style={{ padding: '8px 10px', background: '#f9fafb', borderRadius: '6px', borderLeft: '3px solid #2563eb' }}>
                    <div style={{ fontSize: '0.68rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Team Lead</div>
                    <strong style={{ color: '#111827' }}>{profile.reportingLead}</strong>
                    <div style={{ color: '#6b7280', fontSize: '0.72rem' }}>Direct approvals & attendance</div>
                  </div>

                  <div style={{ padding: '8px 10px', background: '#f9fafb', borderRadius: '6px', borderLeft: '3px solid #475569' }}>
                    <div style={{ fontSize: '0.68rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Department Head</div>
                    <strong style={{ color: '#111827' }}>{profile.departmentHead}</strong>
                    <div style={{ color: '#6b7280', fontSize: '0.72rem' }}>Engineering leadership</div>
                  </div>

                  <div style={{ padding: '8px 10px', background: '#f9fafb', borderRadius: '6px', borderLeft: '3px solid #059669' }}>
                    <div style={{ fontSize: '0.68rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>HR Business Partner</div>
                    <strong style={{ color: '#111827' }}>{profile.hrContact}</strong>
                    <div style={{ color: '#6b7280', fontSize: '0.72rem' }}>Policy & benefits exceptions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 2. MY LEAVES PAGE */}
      {activePage === 'My Leaves' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <div className="page-title-banner">
            <div>
              <h1>My Leave Balances & History</h1>
              <p>Complete record of active, approved, and historic leave requests with live administrative quota synchronization.</p>
            </div>
            <button className="btn-primary-saas" onClick={() => onApplyLeave(false)}>
              <Plus size={15} />
              <span>Apply for Leave</span>
            </button>
          </div>

          {/* Official Leave Entitlements & Allowances Synchronized from HR Policy */}
          <div className="platform-card" style={{ padding: '18px 20px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CalendarDays size={17} color="#2563eb" />
                  <span>Official Policy Entitlements & Live Quotas</span>
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
                  These allowed limits are governed by XortLogix Executive Administration and automatically update when policies change.
                </p>
              </div>
              <span className="badge badge-approved" style={{ fontSize: '0.74rem', padding: '3px 8px' }}>
                ✨ Live Policy Synchronized
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>Annual Vacation</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1d4ed8', marginTop: '2px' }}>
                  {balances.annual?.remaining ?? 20} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748b' }}>Days Left</span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#475569', marginTop: '4px' }}>
                  <strong>{balances.annual?.total || 20} Days Allowed</strong> • {balances.annual?.used || 0} Used
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>Medical & Sick Leave</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669', marginTop: '2px' }}>
                  {balances.medical?.remaining ?? 10} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748b' }}>Days Left</span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#475569', marginTop: '4px' }}>
                  <strong>{balances.medical?.total || 10} Days Allowed</strong> • {balances.medical?.used || 0} Used
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>Casual / Personal Leave</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#475569', marginTop: '2px' }}>
                  {balances.casual?.remaining ?? 8} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748b' }}>Days Left</span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#475569', marginTop: '4px' }}>
                  <strong>{balances.casual?.total || 8} Days Allowed</strong> • {balances.casual?.used || 0} Used
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>Emergency / Compassionate</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#047857', marginTop: '2px' }}>
                  {balances.emergency?.remaining ?? 3} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748b' }}>Days Left</span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#475569', marginTop: '4px' }}>
                  <strong>{balances.emergency?.total || 3} Days Allowed</strong> • {balances.emergency?.used || 0} Used
                </div>
              </div>
            </div>
          </div>

          <div className="filter-bar">
            <div className="tabs-segmented">
              <button 
                className={`tab-segmented-btn ${leaveFilter === 'ALL' ? 'active' : ''}`}
                onClick={() => setLeaveFilter('ALL')}
              >
                All Requests ({myRequests.length})
              </button>
              <button 
                className={`tab-segmented-btn ${leaveFilter === 'PENDING' ? 'active' : ''}`}
                onClick={() => setLeaveFilter('PENDING')}
              >
                Pending
              </button>
              <button 
                className={`tab-segmented-btn ${leaveFilter === 'APPROVED' ? 'active' : ''}`}
                onClick={() => setLeaveFilter('APPROVED')}
              >
                Approved
              </button>
              <button 
                className={`tab-segmented-btn ${leaveFilter === 'REJECTED' ? 'active' : ''}`}
                onClick={() => setLeaveFilter('REJECTED')}
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
                    <th>Request ID</th>
                    <th>Leave Classification</th>
                    <th>Dates</th>
                    <th>Days</th>
                    <th>Reason</th>
                    <th>Routing Stage</th>
                    <th style={{ textAlign: 'right' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeaves.map((req) => (
                    <tr key={req.id}>
                      <td><strong>{req.id}</strong></td>
                      <td>{req.type}</td>
                      <td><strong>{req.dates}</strong></td>
                      <td>{req.days} Day(s)</td>
                      <td>{req.reason}</td>
                      <td>{req.approvalTier || 'Direct'}</td>
                      <td style={{ textAlign: 'right' }}>
                        <span className={`badge badge-${req.status.toLowerCase()}`}>
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. MY PROFILE PAGE */}
      {activePage === 'My Profile' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <div className="page-title-banner">
            <div>
              <h1>Employee Profile — {profile.name}</h1>
              <p>Personal, employment, and reporting relationships.</p>
            </div>
          </div>

          <div className="platform-card" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', borderRight: '1px solid #e5e7eb', paddingRight: '20px' }}>
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80" 
                alt={profile.name}
                style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e5e7eb' }}
              />
              <h2 style={{ fontSize: '1.1rem', marginTop: '10px', color: '#111827' }}>{profile.name}</h2>
              <p style={{ color: '#6b7280', fontSize: '0.8rem' }}>{profile.designation}</p>
              <div style={{ marginTop: '8px' }}>
                <span className="badge badge-active">{profile.employmentStatus}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', fontSize: '0.82rem' }}>
              <div>
                <label style={{ color: '#6b7280', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>Employee ID</label>
                <div style={{ fontWeight: 600, color: '#111827' }}>{profile.id}</div>
              </div>
              <div>
                <label style={{ color: '#6b7280', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>Work Email</label>
                <div style={{ fontWeight: 600, color: '#111827' }}>ayesha.khan@worksphere.internal</div>
              </div>
              <div>
                <label style={{ color: '#6b7280', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>Department</label>
                <div style={{ fontWeight: 600, color: '#111827' }}>{profile.department}</div>
              </div>
              <div>
                <label style={{ color: '#6b7280', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>Assigned Team</label>
                <div style={{ fontWeight: 600, color: '#111827' }}>{profile.team}</div>
              </div>
              <div>
                <label style={{ color: '#6b7280', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>Employment Type</label>
                <div style={{ fontWeight: 600, color: '#111827' }}>{profile.employmentType}</div>
              </div>
              <div>
                <label style={{ color: '#6b7280', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>Date Joined</label>
                <div style={{ fontWeight: 600, color: '#111827' }}>{profile.joiningDate}</div>
              </div>
              <div>
                <label style={{ color: '#6b7280', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>Reporting Lead</label>
                <div style={{ fontWeight: 600, color: '#111827' }}>{profile.reportingLead}</div>
              </div>
              <div>
                <label style={{ color: '#6b7280', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>Department Head</label>
                <div style={{ fontWeight: 600, color: '#111827' }}>{profile.departmentHead}</div>
              </div>
              <div>
                <label style={{ color: '#6b7280', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>Office Location</label>
                <div style={{ fontWeight: 600, color: '#111827' }}>Floor 4, Building Alpha</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. MY REQUESTS PAGE (HR Helpdesk) */}
      {activePage === 'My Requests' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <div className="page-title-banner">
            <div>
              <h1>HR Helpdesk Tickets</h1>
              <p>Submitted inquiries on payroll, taxes, letters, and benefits.</p>
            </div>
            <button className="btn-primary-saas" onClick={onRaiseRequest}>
              <Plus size={15} />
              <span>Raise Ticket</span>
            </button>
          </div>

          <div className="platform-card" style={{ padding: 0 }}>
            <div className="platform-table-wrapper" style={{ border: 'none' }}>
              <table className="platform-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Category</th>
                    <th>Subject Description</th>
                    <th>Assigned Specialist</th>
                    <th>Date Submitted</th>
                    <th>Priority</th>
                    <th style={{ textAlign: 'right' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {hrRequests.map((t) => (
                    <tr key={t.id}>
                      <td><strong>{t.id}</strong></td>
                      <td>{t.category}</td>
                      <td>{t.subject}</td>
                      <td>{t.assignedTo}</td>
                      <td>{t.date}</td>
                      <td><span className="badge badge-active">{t.priority || 'Normal'}</span></td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="badge badge-approved">{t.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. COMPANY DIRECTORY PAGE */}
      {activePage === 'Company Directory' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <div className="page-title-banner">
            <div>
              <h1>Organization Directory</h1>
              <p>Search and contact colleagues across all departments.</p>
            </div>
            <div className="search-box" style={{ width: '300px' }}>
              <Search size={14} color="#6b7280" />
              <input 
                type="text" 
                placeholder="Search by name, role, department..." 
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
                    <th>Employee Name</th>
                    <th>Department</th>
                    <th>Team</th>
                    <th>Role / Title</th>
                    <th>Type</th>
                    <th style={{ textAlign: 'right' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDir.map((emp) => (
                    <tr key={emp.id}>
                      <td>
                        <strong style={{ color: '#111827' }}>{emp.name}</strong>
                        <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>{emp.email}</div>
                      </td>
                      <td>{emp.department}</td>
                      <td>{emp.team}</td>
                      <td>{emp.role}</td>
                      <td>{emp.type}</td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="badge badge-approved">{emp.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. ANNOUNCEMENTS PAGE */}
      {activePage === 'Announcements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <div className="page-title-banner">
            <div>
              <h1>Company Announcements</h1>
              <p>Official notices and policy updates from People Operations.</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {announcements.map((a) => (
              <div key={a.id} className="platform-card">
                <div className="card-title-row">
                  <div>
                    <h3 style={{ fontSize: '0.95rem' }}>{a.title}</h3>
                    <p style={{ fontSize: '0.74rem', color: '#6b7280', marginTop: '2px' }}>
                      {a.author} • {a.date} • Target: {a.target}
                    </p>
                  </div>
                  <span className="badge badge-active">{a.priority || 'Notice'}</span>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#374151', lineHeight: 1.5 }}>{a.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. COMPANY CALENDAR */}
      {activePage === 'Company Calendar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <div className="page-title-banner">
            <div>
              <h1>Company Calendar</h1>
              <p>Schedule of public holidays, all-hands events, and approved absences.</p>
            </div>
          </div>

          <div className="platform-card" style={{ padding: 0 }}>
            <div className="platform-table-wrapper" style={{ border: 'none' }}>
              <table className="platform-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Schedule Title</th>
                    <th>Participant</th>
                    <th style={{ textAlign: 'right' }}>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {calendarEvents.map((ev, i) => (
                    <tr key={i}>
                      <td><strong>{ev.date}</strong></td>
                      <td>{ev.title}</td>
                      <td>{ev.member}</td>
                      <td style={{ textAlign: 'right' }}>
                        <span className={`badge ${ev.type === 'holiday' ? 'badge-approved' : 'badge-active'}`}>
                          {ev.type.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 8. DOCUMENTS */}
      {activePage === 'Documents' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <div className="page-title-banner">
            <div>
              <h1>Company Documents</h1>
              <p>Employee handbooks, leave policy guides, and medical insurance documents.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', width: '100%' }}>
            <div className="platform-card">
              <h3>Employee Handbook 2024</h3>
              <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '6px 0 12px' }}>
                Values, remote work policy, codes of conduct, and workplace guidelines.
              </p>
              <button className="btn-outline-saas" onClick={() => alert('Downloading PDF...')}>
                <Download size={13} />
                <span>Download PDF</span>
              </button>
            </div>

            <div className="platform-card">
              <h3>Leave & Holiday Policy Guide</h3>
              <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '6px 0 12px' }}>
                Eligibility criteria, annual leave accrual rates, and medical documentation.
              </p>
              <button className="btn-outline-saas" onClick={() => alert('Downloading PDF...')}>
                <Download size={13} />
                <span>Download PDF</span>
              </button>
            </div>

            <div className="platform-card">
              <h3>Medical Benefits Guide</h3>
              <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '6px 0 12px' }}>
                Panel hospitals, claims process, and covered dental and vision allowances.
              </p>
              <button className="btn-outline-saas" onClick={() => alert('Downloading PDF...')}>
                <Download size={13} />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

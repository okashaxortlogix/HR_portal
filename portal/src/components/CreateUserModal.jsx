import React, { useState } from 'react';
import { UserPlus, X, Lock, Mail, User, Shield, Calendar, Clock, Award } from 'lucide-react';
import { calculateEmploymentMilestones } from '../utils/employmentTimeline';

export default function CreateUserModal({ isOpen, onClose, onCreateUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('pass123');
  const [roleKey, setRoleKey] = useState('employee');
  const [department, setDepartment] = useState('Developers');
  const [team, setTeam] = useState('Frontend Team');
  const [designation, setDesignation] = useState('Software Engineer');
  const [dateJoinedYMD, setDateJoinedYMD] = useState(new Date().toISOString().split('T')[0]);
  const milestones = calculateEmploymentMilestones(dateJoinedYMD);
  const [employmentType, setEmploymentType] = useState(milestones.suggestedType || 'Permanent');

  const isIntern = roleKey === 'intern';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      alert('Please fill out all required employee credentials.');
      return;
    }

    const roleTitles = {
      intern: 'Intern / Trainee',
      employee: 'Employee',
      team_lead: 'Team Lead',
      department_head: 'Department Head',
      hr: 'HR Manager',
      admin: 'System Admin'
    };

    // Automated Leave Balances: Regular permanent staff get equal leaves from day 1, Interns get 0 until 6-month permanent conversion
    const automatedLeaveBalances = (isIntern && !milestones.leavesEntitled) ? {
      annual: { label: 'Annual Vacation', total: 0, used: 0, remaining: 0 },
      medical: { label: 'Medical Leave', total: 0, used: 0, remaining: 0 },
      casual: { label: 'Casual Leave', total: 0, used: 0, remaining: 0 },
      emergency: { label: 'Emergency Leave', total: 0, used: 0, remaining: 0 }
    } : {
      annual: { label: 'Annual Vacation', total: 20, used: 0, remaining: 20 },
      medical: { label: 'Medical Leave', total: 10, used: 0, remaining: 10 },
      casual: { label: 'Casual Leave', total: 8, used: 0, remaining: 8 },
      emergency: { label: 'Emergency Leave', total: 3, used: 0, remaining: 3 }
    };

    const newUser = {
      id: `EMP-${Math.floor(Math.random() * 9000) + 1000}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      role: roleTitles[roleKey] || 'Employee',
      roleKey: roleKey,
      designation: designation.trim() || (isIntern ? 'Intern' : 'Team Member'),
      department: department,
      team: team,
      employmentType: isIntern ? (milestones.leavesEntitled ? 'Permanent' : milestones.suggestedType) : 'Permanent',
      employmentStatus: isIntern ? milestones.statusBadge : 'Permanent',
      dateJoined: milestones.joinedDateStr,
      dateJoinedRaw: dateJoinedYMD,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      status: 'Active',
      reportingLead: (roleKey === 'employee' || roleKey === 'intern') ? 'Team Lead' : 'Department Head',
      departmentHead: 'Executive Leadership',
      hrContact: 'David Miller',
      leaveBalances: automatedLeaveBalances
    };

    onCreateUser(newUser);
    onClose();

    // Reset form
    setName('');
    setEmail('');
    setPassword('pass123');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-container" style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus size={16} color="#111827" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#111827' }}>
              Provision New Employee Credentials
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ gap: '12px' }}>
            {/* Name & Email */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Hamza Malik"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Login Email *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="hamza@worksphere.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Login Password */}
            <div className="form-group">
              <label className="form-label">Assigned Login Password *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Initial password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                Employee will use this password to sign into their personal portal.
              </span>
            </div>

            {/* Role & Department */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-group">
                <label className="form-label">Portal Role *</label>
                <select className="form-select" value={roleKey} onChange={(e) => {
                  const newRole = e.target.value;
                  setRoleKey(newRole);
                  if (newRole === 'intern') {
                    setDesignation('Intern / Trainee');
                    setEmploymentType('Internship');
                  } else {
                    if (designation === 'Intern / Trainee' || designation === 'Intern') {
                      setDesignation('Software Engineer');
                    }
                    setEmploymentType('Permanent');
                  }
                }}>
                  <option value="employee">Employee (Self-Service)</option>
                  <option value="intern">Intern</option>
                  <option value="team_lead">Team Lead</option>
                  <option value="department_head">Department Head</option>
                  <option value="hr">HR Manager</option>
                  <option value="admin">System Admin</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Department *</label>
                <select className="form-select" value={department} onChange={(e) => setDepartment(e.target.value)}>
                  <option value="Developers">Developers</option>
                  <option value="GHL Experts">GHL Experts</option>
                  <option value="Designers">Designers</option>
                  <option value="Marketers">Marketers</option>
                  <option value="Directors">Directors</option>
                  <option value="Supporting Staff">Supporting Staff</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
            </div>

            {/* Team & Designation */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-group">
                <label className="form-label">Team</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Frontend Team"
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Job Designation</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Full-Stack Engineer"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                />
              </div>
            </div>

            {/* Show Starting Date & 3-Stage Milestone Career Progression ONLY for Intern role */}
            {isIntern ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group">
                    <label className="form-label">Intern Starting Date *</label>
                    <input
                      type="date"
                      className="form-input"
                      value={dateJoinedYMD}
                      onChange={(e) => {
                        const newD = e.target.value;
                        setDateJoinedYMD(newD);
                        const calc = calculateEmploymentMilestones(newD);
                        setEmploymentType(calc.suggestedType);
                      }}
                      required
                    />
                    <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                      Date intern started at the company.
                    </span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Progression Status</label>
                    <div style={{
                      padding: '9px 12px',
                      background: milestones.badgeBg,
                      color: milestones.badgeColor,
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <Clock size={14} />
                      <span>{milestones.statusBadge}</span>
                    </div>
                  </div>
                </div>

                {/* 3-Stage Career Lifecycle & Milestone Tracker */}
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  marginTop: '4px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1e293b' }}>
                      Intern Progression Milestones (3 Mo Intern → 3 Mo Probation → Permanent)
                    </span>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      background: milestones.badgeBg,
                      color: milestones.badgeColor
                    }}>
                      {milestones.statusBadge}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', fontSize: '0.72rem' }}>
                    <div style={{ background: '#ffffff', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <div style={{ color: '#64748b', fontWeight: 600 }}>1. Joined Company</div>
                      <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{milestones.joinedDateStr}</div>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Internship (0-3 mo)</div>
                    </div>

                    <div style={{ background: '#ffffff', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <div style={{ color: '#64748b', fontWeight: 600 }}>2. Probation Starts</div>
                      <div style={{ fontWeight: 700, color: '#4338ca', marginTop: '2px' }}>{milestones.probationStartDateStr}</div>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Probation (3-6 mo)</div>
                    </div>

                    <div style={{ background: '#ffffff', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <div style={{ color: '#64748b', fontWeight: 600 }}>3. Permanent Confirmed</div>
                      <div style={{ fontWeight: 700, color: '#15803d', marginTop: '2px' }}>{milestones.permanentDateStr}</div>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Job Converted (+6 mo)</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.73rem', color: '#475569', marginTop: '8px' }}>
                    {milestones.nextMilestoneText}
                  </div>
                </div>

                {/* Intern Leave Policy Note */}
                <div style={{
                  background: milestones.leavesEntitled ? '#f0fdf4' : '#fffbeb',
                  border: milestones.leavesEntitled ? '1px solid #bbf7d0' : '1px solid #fde68a',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  marginTop: '8px'
                }}>
                  <div style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: milestones.leavesEntitled ? '#166534' : '#92400e',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    {milestones.leavesEntitled ? '✅ 6+ Months Tenure: Converted to Permanent' : '⚠️ Automated Policy: 0 Leaves During Internship & Probation'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: milestones.leavesEntitled ? '#15803d' : '#78350f', marginTop: '4px', lineHeight: 1.45 }}>
                    {milestones.leavesEntitled ? (
                      <>
                        Milestone completed! This intern has crossed 6 months (3 months internship + 3 months probation) and is converted to <strong>Permanent</strong> with equal standard company leaves (20 Annual, 10 Medical, 8 Casual, 3 Emergency).
                      </>
                    ) : (
                      <>
                        Interns have <strong>0 leaves</strong> allocated during their 3-month internship and 3-month probation period. Full company leave quotas activate automatically upon permanent job conversion after 6 months.
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              /* Non-Intern Roles: Standard Direct Hire with Equal Leave Entitlement */
              <>
                <div className="form-group">
                  <label className="form-label">Company Starting Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={dateJoinedYMD}
                    onChange={(e) => setDateJoinedYMD(e.target.value)}
                  />
                  <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                    Official joining date for employee profile and portal directory.
                  </span>
                </div>

                <div style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  marginTop: '4px'
                }}>
                  <div style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#166534',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    ✅ Standard Equal Leave Entitlement Active
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#15803d', marginTop: '4px', lineHeight: 1.45 }}>
                    All <strong>Permanent</strong> personnel automatically receive equal company standard leaves:
                    <strong> 20 Annual</strong>, <strong>10 Medical</strong>, <strong>8 Casual</strong>, <strong>3 Emergency</strong>.
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create & Issue Credentials
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

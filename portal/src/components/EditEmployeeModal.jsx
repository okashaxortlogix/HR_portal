import React, { useState, useEffect } from 'react';
import { UserCheck, X, Lock, Mail, User, Shield, Briefcase, Building2, Calendar, Check, Clock } from 'lucide-react';
import { calculateEmploymentMilestones, parseDateToYMD } from '../utils/employmentTimeline';

export default function EditEmployeeModal({ isOpen, onClose, employee, onSaveEmployee }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [roleKey, setRoleKey] = useState('employee');
  const [department, setDepartment] = useState('Engineering');
  const [team, setTeam] = useState('Frontend Platform');
  const [dateJoinedYMD, setDateJoinedYMD] = useState('2024-01-15');
  const milestones = calculateEmploymentMilestones(dateJoinedYMD);
  const [employmentType, setEmploymentType] = useState('Full-Time');
  const [status, setStatus] = useState('Active');
  const [reportingLead, setReportingLead] = useState('Sarah Jenkins');
  const [departmentHead, setDepartmentHead] = useState('Elena Rostova');
  const [annualQuota, setAnnualQuota] = useState(20);
  const [medicalQuota, setMedicalQuota] = useState(10);
  const [casualQuota, setCasualQuota] = useState(7);
  const [emergencyQuota, setEmergencyQuota] = useState(3);

  useEffect(() => {
    if (employee) {
      setName(employee.name || '');
      setEmail(employee.email || '');
      setPassword(employee.password || '');
      setRole(employee.role || employee.designation || 'Software Engineer');
      setRoleKey(employee.roleKey || 'employee');
      setDepartment(employee.department || 'Engineering');
      setTeam(employee.team || 'Web Core Team');
      setDateJoinedYMD(parseDateToYMD(employee.dateJoinedRaw || employee.dateJoined || '2024-01-15'));
      setEmploymentType(employee.employmentType || employee.type || 'Full-Time');
      setStatus(employee.status || 'Active');
      setReportingLead(employee.reportingLead || 'Sarah Jenkins');
      setDepartmentHead(employee.departmentHead || 'Elena Rostova');

      const balances = employee.leaveBalances || {};
      setAnnualQuota(balances.annual?.total ?? 20);
      setMedicalQuota(balances.medical?.total ?? 10);
      setCasualQuota(balances.casual?.total ?? 7);
      setEmergencyQuota(balances.emergency?.total ?? 3);
    }
  }, [employee]);

  if (!isOpen || !employee) return null;

  const isIntern = roleKey === 'intern';
  const isProbationOrIntern = isIntern ? !milestones.leavesEntitled : false;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    const prevBalances = employee.leaveBalances || {};

    // Automated Policy: Equal leaves for all permanent staff (20/10/8/3), 0 leaves for interns during 0-6 month progression
    const automatedBalances = isProbationOrIntern ? {
      annual: { label: 'Annual Vacation', total: 0, used: 0, remaining: 0 },
      medical: { label: 'Medical Leave', total: 0, used: 0, remaining: 0 },
      casual: { label: 'Casual Leave', total: 0, used: 0, remaining: 0 },
      emergency: { label: 'Emergency Leave', total: 0, used: 0, remaining: 0 }
    } : {
      annual: {
        label: 'Annual Vacation',
        total: 20,
        used: prevBalances.annual?.used || 0,
        remaining: Math.max(0, 20 - (prevBalances.annual?.used || 0))
      },
      medical: {
        label: 'Medical Leave',
        total: 10,
        used: prevBalances.medical?.used || 0,
        remaining: Math.max(0, 10 - (prevBalances.medical?.used || 0))
      },
      casual: {
        label: 'Casual Leave',
        total: 8,
        used: prevBalances.casual?.used || 0,
        remaining: Math.max(0, 8 - (prevBalances.casual?.used || 0))
      },
      emergency: {
        label: 'Emergency Leave',
        total: 3,
        used: prevBalances.emergency?.used || 0,
        remaining: Math.max(0, 3 - (prevBalances.emergency?.used || 0))
      }
    };

    const updatedEmployee = {
      ...employee,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: role.trim() || (isIntern ? 'Intern' : 'Employee'),
      roleKey: roleKey,
      designation: role.trim() || (isIntern ? 'Intern' : 'Software Engineer'),
      department: department,
      team: team.trim(),
      dateJoined: milestones.joinedDateStr,
      dateJoinedRaw: dateJoinedYMD,
      employmentType: isIntern ? (milestones.leavesEntitled ? 'Permanent' : milestones.suggestedType) : 'Permanent',
      employmentStatus: isIntern ? milestones.statusBadge : 'Permanent',
      status: status,
      reportingLead: reportingLead.trim(),
      departmentHead: departmentHead.trim(),
      leaveBalances: automatedBalances
    };

    if (password.trim()) {
      updatedEmployee.password = password.trim();
    }

    onSaveEmployee(updatedEmployee);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '580px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#e0e7ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4f46e5'
            }}>
              <UserCheck size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.96rem', fontWeight: 600, color: '#111827', margin: 0 }}>
                Manage Employee Profile & Credentials
              </h3>
              <p style={{ fontSize: '0.74rem', color: '#6b7280', margin: '2px 0 0' }}>
                Update {employee.name}'s account details, role permissions, and leave quotas.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              color: '#6b7280', 
              padding: '4px', 
              borderRadius: '6px' 
            }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', flex: 1 }}>
          <div className="modal-body" style={{ gap: '14px' }}>
            {/* Row 1: Name & Email */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ paddingLeft: '32px' }}
                  />
                  <User size={14} color="#9ca3af" style={{ position: 'absolute', left: '10px', top: '11px' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Work Email *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ paddingLeft: '32px' }}
                  />
                  <Mail size={14} color="#9ca3af" style={{ position: 'absolute', left: '10px', top: '11px' }} />
                </div>
              </div>
            </div>

            {/* Row 2: Designation & Password */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Job Title / Designation *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Leave blank to keep current"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingLeft: '32px' }}
                  />
                  <Lock size={14} color="#9ca3af" style={{ position: 'absolute', left: '10px', top: '11px' }} />
                </div>
              </div>
            </div>

            {/* Row 3: Role Key & Department */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Portal Access Role *</label>
                <select
                  className="form-select"
                  value={roleKey}
                  onChange={(e) => {
                    const newRole = e.target.value;
                    setRoleKey(newRole);
                    if (newRole === 'intern') {
                      setEmploymentType(milestones.suggestedType || 'Internship');
                    } else {
                      setEmploymentType('Permanent');
                    }
                  }}
                >
                  <option value="employee">Employee (Standard Access)</option>
                  <option value="intern">Intern</option>
                  <option value="team_lead">Team Lead (1st-Tier Approver)</option>
                  <option value="department_head">Department Head (2nd-Tier Approver)</option>
                  <option value="hr">HR Operations Specialist</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Department *</label>
                <select
                  className="form-select"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="Developers">Developers</option>
                  <option value="GHL Experts">GHL Experts</option>
                  <option value="Designers">Designers</option>
                  <option value="Marketers">Marketers</option>
                  <option value="Directors">Directors</option>
                  <option value="Supporting Staff">Supporting Staff</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Human Resources & IT">Human Resources & IT</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Executive & HR Management">Executive & HR Management</option>
                </select>
              </div>
            </div>

            {/* Row 4: Team & Classification / Starting Date */}
            {isIntern ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Team / Sub-unit</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Web Core Team"
                      value={team}
                      onChange={(e) => setTeam(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Employment Classification *</label>
                    <select
                      className="form-select"
                      value={employmentType}
                      onChange={(e) => setEmploymentType(e.target.value)}
                    >
                      <option value="Internship">Internship (Zero Leaves)</option>
                      <option value="Probation">Probation (Zero Leaves)</option>
                      <option value="Permanent">Permanent (Standard Equal Leaves)</option>
                    </select>
                  </div>
                </div>

                {/* 3-Stage Milestone Lifecycle Tracker (ONLY for Intern role) */}
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={15} color="#4f46e5" />
                      <label className="form-label" style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>
                        Intern Starting Date *
                      </label>
                    </div>
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

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', alignItems: 'center' }}>
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
                      style={{ background: '#ffffff' }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setEmploymentType(milestones.suggestedType)}
                      style={{
                        padding: '8px 12px',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        color: '#334155',
                        cursor: 'pointer'
                      }}
                      title="Align employment classification with milestone calculation"
                    >
                      Sync Status ({milestones.suggestedType})
                    </button>
                  </div>

                  {/* 3-Stage Progression */}
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

                  <div style={{ fontSize: '0.73rem', color: '#475569' }}>
                    {milestones.nextMilestoneText}
                  </div>
                </div>
              </>
            ) : (
              /* Non-Intern Roles: Regular Personnel Fields with Clean Starting Date */
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Team / Sub-unit</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Web Core Team"
                    value={team}
                    onChange={(e) => setTeam(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Company Starting Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={dateJoinedYMD}
                    onChange={(e) => setDateJoinedYMD(e.target.value)}
                  />
                  <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                    Official joining date for employee profile and records.
                  </span>
                </div>
              </div>
            )}

            {/* Row 5: Account Status & Reporting Lead */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Account Status</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Active">Active (Permitted to log in)</option>
                  <option value="Inactive">Inactive / Suspended</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Resigned">Resigned</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Reporting Lead</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Sarah Jenkins"
                  value={reportingLead}
                  onChange={(e) => setReportingLead(e.target.value)}
                />
              </div>
            </div>

            {/* Row 6: Automated Leave Policy Status */}
            <div style={{
              background: isProbationOrIntern ? '#fffbeb' : '#f0fdf4',
              border: isProbationOrIntern ? '1px solid #fde68a' : '1px solid #bbf7d0',
              borderRadius: '8px',
              padding: '14px 16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: isProbationOrIntern ? '#92400e' : '#166534',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  {isProbationOrIntern ? '⚠️ Zero Leaves Allocated (Probation / Internship)' : '✅ Standard Equal Leave Entitlement'}
                </div>
                {isProbationOrIntern && (
                  <button
                    type="button"
                    onClick={() => setEmploymentType('Permanent')}
                    style={{
                      background: '#16a34a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '5px 12px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Check size={13} />
                    <span>Convert to Permanent</span>
                  </button>
                )}
              </div>
              <div style={{ fontSize: '0.75rem', color: isProbationOrIntern ? '#78350f' : '#15803d', marginTop: '6px', lineHeight: 1.45 }}>
                {isProbationOrIntern ? (
                  <>
                    This employee is currently classified under <strong>{employmentType}</strong>. Company policy dictates <strong>0 leaves</strong> until converted to a permanent job role. Clicking <strong>Convert to Permanent</strong> automatically grants standard equal leave quotas.
                  </>
                ) : (
                  <>
                    All permanent staff receive equal standard leave quotas: <strong>20 Annual Vacation</strong>, <strong>10 Medical Leave</strong>, <strong>8 Casual Leave</strong>, <strong>3 Emergency Leave</strong>.
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer" style={{ borderTop: '1px solid #e2e8f0', padding: '12px 20px', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              type="button"
              className="btn-outline-saas"
              onClick={onClose}
              style={{ fontSize: '0.8rem', padding: '8px 16px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary-saas"
              style={{ fontSize: '0.8rem', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Check size={15} />
              <span>Save Employee Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

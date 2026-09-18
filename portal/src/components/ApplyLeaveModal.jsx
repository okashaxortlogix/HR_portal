import React, { useState } from 'react';
import { X, Calendar, AlertCircle } from 'lucide-react';

export default function ApplyLeaveModal({ isOpen, onClose, onSubmitLeave, isInternMode = false, policies = [], user }) {
  const defaultType = isInternMode ? 'Emergency Leave' : (policies[0]?.name || 'Annual Leave');
  const [leaveType, setLeaveType] = useState(defaultType);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');
  const [isHalfDay, setIsHalfDay] = useState(false);

  // Sync default type if policies change
  React.useEffect(() => {
    if (!isInternMode && policies.length > 0 && !policies.some(p => p.name === leaveType)) {
      setLeaveType(policies[0]?.name || 'Annual Leave');
    }
  }, [policies, isInternMode]);

  if (!isOpen) return null;

  const getBalanceInfo = (typeName) => {
    if (!user?.leaveBalances) return null;
    const tl = typeName.toLowerCase();
    let key = null;
    if (tl.includes('annual') || tl.includes('vacation')) key = 'annual';
    else if (tl.includes('medical') || tl.includes('sick')) key = 'medical';
    else if (tl.includes('casual') || tl.includes('personal')) key = 'casual';
    else if (tl.includes('emergency')) key = 'emergency';
    else key = Object.keys(user.leaveBalances).find(k => tl.includes(k));

    return key ? user.leaveBalances[key] : null;
  };

  const selectedBal = getBalanceInfo(leaveType);

  const isProbationOrIntern = ['Probation', 'Intern', 'Internship'].includes(user?.employmentType);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isProbationOrIntern) {
      alert('Employees currently on Probation or Internship are not entitled to leaves until converted to Permanent status.');
      return;
    }

    if (!reason.trim()) {
      alert('Please provide a brief reason for your leave request.');
      return;
    }

    const startFormatted = new Date(startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    const endFormatted = new Date(endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const dateRange = startDate === endDate ? `${startFormatted}, ${new Date(startDate).getFullYear()}` : `${startFormatted} – ${endFormatted}`;

    const calculatedDays = isHalfDay ? 0.5 : Math.max(1, Math.round((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1);

    onSubmitLeave({
      id: `LR-${Math.floor(Math.random() * 900) + 100}`,
      employee: user?.name || 'Employee',
      userId: user?.id,
      department: user?.department || 'Engineering',
      team: user?.team || 'Operations',
      type: leaveType,
      dates: dateRange,
      status: 'Pending',
      days: calculatedDays,
      reason: reason
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.05rem', fontWeight: 700 }}>
            <Calendar size={18} color="#2563eb" />
            <span>Apply for Leave</span>
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        {isProbationOrIntern ? (
          <div style={{ padding: '24px 20px', textAlign: 'center' }}>
            <div style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '8px',
              padding: '16px',
              color: '#92400e',
              fontSize: '0.84rem',
              lineHeight: 1.5,
              textAlign: 'left'
            }}>
              <div style={{ fontWeight: 700, marginBottom: '6px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={16} />
                <span>Zero Leaves Entitlement (Probation / Internship)</span>
              </div>
              Per company HR policy, employees currently under <strong>{user?.employmentType || 'Probation'}</strong> have <strong>0 leaves</strong>. Paid leaves are only allocated once your employment is converted to Permanent status.
            </div>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" className="btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Leave Classification</label>
                <select 
                  className="form-select" 
                  value={leaveType} 
                  onChange={(e) => setLeaveType(e.target.value)}
                >
                  {policies && policies.length > 0 ? (
                    policies
                      .filter(p => p.status === 'Active')
                      .map(p => {
                        const bal = getBalanceInfo(p.name);
                        const balSuffix = bal ? ` [${bal.remaining} of ${bal.total}d Available]` : '';
                        return (
                          <option key={p.id} value={p.name}>
                            {p.name} ({p.days ? `${p.days}d Allowed` : p.entitlement}){balSuffix}
                          </option>
                        );
                      })
                  ) : (
                    <>
                      <option value="Annual Leave">Annual Vacation [20d Available]</option>
                      <option value="Medical Leave">Medical Leave [10d Available]</option>
                      <option value="Casual Leave">Casual Leave [8d Available]</option>
                      <option value="Emergency Leave">Emergency Leave [3d Available]</option>
                    </>
                  )}
                </select>
              </div>


              {/* Dynamic Quota Information Pill */}
              {selectedBal && (
                <div style={{
                  marginTop: '6px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  fontSize: '0.76rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: '#475569'
                }}>
                  <span>Policy Allowed: <strong style={{ color: '#0f172a' }}>{selectedBal.total} Days / Year</strong></span>
                  <span>Used: <strong>{selectedBal.used} Days</strong></span>
                  <span>Available: <strong style={{ color: '#2563eb' }}>{selectedBal.remaining} Days Remaining</strong></span>
                </div>
              )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Reason / Justification</label>
              <textarea 
                className="form-textarea" 
                rows="3" 
                placeholder="Explain the purpose of your leave or emergency context..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <input 
                type="checkbox" 
                id="halfDayCheck" 
                checked={isHalfDay} 
                onChange={(e) => setIsHalfDay(e.target.checked)} 
              />
              <label htmlFor="halfDayCheck">Apply as Half-Day Leave (0.5 day)</label>
            </div>

            <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', fontSize: '0.78rem', color: '#64748b' }}>
              <strong>Configured Approval Chain:</strong> Team Lead (Sarah Ahmed) → Department Head (Asim Khan) → Automated Balance Ledger Update.
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Submit Request
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}

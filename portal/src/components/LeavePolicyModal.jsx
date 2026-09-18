import React, { useState } from 'react';
import { FileText, CheckCircle2, Edit3, Save, X, ArrowRight } from 'lucide-react';

export function LeavePolicyCard({ policy, onEdit }) {
  return (
    <div className="panel-card" style={{ height: '100%' }}>
      <div className="panel-title">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={18} color="#2563eb" />
          <span>Leave Policy Configuration (Example)</span>
        </div>
        <button 
          onClick={onEdit} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px', 
            background: '#f1f5f9', 
            border: '1px solid #cbd5e1', 
            borderRadius: '6px', 
            padding: '3px 8px', 
            fontSize: '0.75rem', 
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          <Edit3 size={12} />
          <span>Edit</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.82rem' }}>
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
            {policy.name}
          </h4>
        </div>

        <div>
          <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Eligibility
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: '4px', marginTop: '4px' }}>
            <span style={{ color: '#64748b' }}>Gender:</span>
            <span style={{ fontWeight: 600 }}>{policy.eligibility.gender}</span>
            <span style={{ color: '#64748b' }}>Employment Type:</span>
            <span style={{ fontWeight: 600 }}>{policy.eligibility.employmentType}</span>
            <span style={{ color: '#64748b' }}>Minimum Service:</span>
            <span style={{ fontWeight: 600 }}>{policy.eligibility.minimumService}</span>
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Entitlement
          </span>
          <p style={{ fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>{policy.entitlement}</p>
        </div>

        <div>
          <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Carry Forward
          </span>
          <p style={{ fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>{policy.carryForward}</p>
        </div>

        <div>
          <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Approval Workflow
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
            {policy.approvalWorkflow.map((step, idx) => (
              <React.Fragment key={step}>
                <span style={{
                  background: '#f1f5f9',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#1e293b'
                }}>
                  {step}
                </span>
                {idx < policy.approvalWorkflow.length - 1 && <ArrowRight size={12} color="#94a3b8" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Status
          </span>
          <div style={{ marginTop: '4px' }}>
            <span className="status-pill active" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={12} />
              <span>{policy.status}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LeavePolicyModal({ isOpen, onClose, policy, onSavePolicy }) {
  if (!isOpen) return null;

  const defaultPolicy = {
    id: '',
    name: '',
    description: '',
    eligibility: {
      gender: 'All',
      employmentType: 'Full-Time',
      minimumService: '1 month'
    },
    entitlement: '10 days per annum',
    carryForward: 'No',
    approvalWorkflow: ['Team Lead', 'HR'],
    status: 'Active'
  };

  const [formData, setFormData] = useState(() => {
    const rawDays = policy?.days || (policy?.entitlement ? parseInt(policy.entitlement.replace(/\D+/g, '')) : 10) || 10;
    if (policy) {
      return {
        ...defaultPolicy,
        ...policy,
        days: rawDays,
        eligibility: { ...defaultPolicy.eligibility, ...(policy.eligibility || {}) },
        approvalWorkflow: policy.approvalWorkflow || ['Team Lead', 'HR']
      };
    }
    return { ...defaultPolicy, days: 10 };
  });

  const [allowedDays, setAllowedDays] = useState(() => {
    return policy?.days || (policy?.entitlement ? parseInt(policy.entitlement.replace(/\D+/g, '')) : 10) || 10;
  });

  const isEdit = Boolean(policy && policy.id);

  const handleDaysChange = (val) => {
    const num = Math.max(1, parseInt(val) || 0);
    setAllowedDays(num);
    setFormData((prev) => ({
      ...prev,
      days: num,
      entitlement: `${num} days per annum`
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSavePolicy({
      ...formData,
      days: Number(allowedDays),
      entitlement: `${allowedDays} days per annum`,
      id: formData.id || `pol-${Date.now()}`
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '540px' }}>
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.05rem', fontWeight: 700 }}>
            <FileText size={18} color="#2563eb" />
            <span>{isEdit ? 'Edit Leave Policy Rules' : 'Create New Leave Policy'}</span>
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
            {/* Live Sync Notice */}
            <div style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '0.8rem',
              color: '#1e40af',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <strong style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={15} color="#2563eb" />
                Live Organization-Wide Policy Sync
              </strong>
              <span>
                Setting the allowed leaves here will immediately update the total quota and recalculate available balances for <strong>all employees</strong> in their Employee Portal, HR Desks, and Approvals.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Policy Name *</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Annual Vacation Policy, Medical & Sick, Casual Leave"
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required 
              />
            </div>

            {/* Allowed Days Numerical Input (Direct Quota) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" style={{ color: '#1d4ed8', fontWeight: 700 }}>
                  Total Allowed Leaves (Days / Year) *
                </label>
                <input 
                  type="number" 
                  min="1"
                  max="120"
                  className="form-input" 
                  value={allowedDays}
                  onChange={(e) => handleDaysChange(e.target.value)}
                  required
                  style={{ fontWeight: 700, borderColor: '#3b82f6', background: '#f8fafc' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Entitlement Label</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. 25 days per annum"
                  value={formData.entitlement}
                  onChange={(e) => setFormData({ ...formData, entitlement: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Brief Description</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Summary of benefit and who it applies to..."
                value={formData.description || ''} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Eligible Gender</label>
                <select 
                  className="form-select" 
                  value={formData.eligibility.gender}
                  onChange={(e) => setFormData({
                    ...formData,
                    eligibility: { ...formData.eligibility, gender: e.target.value }
                  })}
                >
                  <option value="All">All Genders</option>
                  <option value="Female">Female Only</option>
                  <option value="Male">Male Only</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Employment Type</label>
                <select 
                  className="form-select" 
                  value={formData.eligibility.employmentType}
                  onChange={(e) => setFormData({
                    ...formData,
                    eligibility: { ...formData.eligibility, employmentType: e.target.value }
                  })}
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Full-Time / Permanent">Full-Time / Permanent</option>
                  <option value="Contract">Contract</option>
                  <option value="All (incl. Intern / Probation)">All (incl. Intern / Probation)</option>
                  <option value="All Active Classifications">All Active Classifications</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Minimum Service Period</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Day 1, 3 months, 6 months"
                value={formData.eligibility.minimumService}
                onChange={(e) => setFormData({
                  ...formData,
                  eligibility: { ...formData.eligibility, minimumService: e.target.value }
                })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Carry Forward Rule</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. No, Max 5 days, Lapsed on Dec 31"
                value={formData.carryForward}
                onChange={(e) => setFormData({ ...formData, carryForward: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Approval Chain</label>
                <select 
                  className="form-select"
                  value={formData.approvalWorkflow.join(' -> ')}
                  onChange={(e) => {
                    const val = e.target.value;
                    const chain = val.split(' -> ');
                    setFormData({ ...formData, approvalWorkflow: chain });
                  }}
                >
                  <option value="Team Lead">Team Lead only</option>
                  <option value="Team Lead -> HR">Team Lead → HR</option>
                  <option value="Team Lead -> Department Head">Team Lead → Department Head</option>
                  <option value="Team Lead -> Department Head -> HR">Team Lead → Department Head → HR</option>
                  <option value="HR">HR Direct</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Policy Status</label>
                <select 
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Save size={14} />
              <span>{isEdit ? 'Save Policy Rules' : 'Create Policy'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

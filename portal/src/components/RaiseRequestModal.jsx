import React, { useState } from 'react';
import { X, HelpCircle, Send } from 'lucide-react';

export default function RaiseRequestModal({ isOpen, onClose, onSubmitRequest }) {
  const [category, setCategory] = useState('Payroll');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim()) return;

    onSubmitRequest({
      id: `HR-${Math.floor(Math.random() * 800) + 200}`,
      employee: 'Ayesha Khan',
      category: category,
      subject: subject,
      status: 'Created',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      assignedTo: 'HR Support Desk'
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.05rem', fontWeight: 700 }}>
            <HelpCircle size={18} color="#7c3aed" />
            <span>Raise HR Helpdesk Ticket</span>
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Request Category</label>
              <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Leave Issue">Leave Issue / Balance Discrepancy</option>
                <option value="Attendance">Attendance & Biometrics</option>
                <option value="Payroll">Payroll, Tax & Compensation</option>
                <option value="Documentation">Documentation / Letters / Verification</option>
                <option value="Workplace Issue">Workplace & Equipment</option>
                <option value="Medical / Benefits">Medical / Health Benefits</option>
                <option value="Emergency">Emergency / Compassionate Request</option>
                <option value="Other">Other Query</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Subject</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Brief summary of your query" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Priority Level</label>
              <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="Low">Low (General guidance)</option>
                <option value="Medium">Medium (Standard 48-hour response)</option>
                <option value="High">High (Urgent resolution needed)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Description</label>
              <textarea 
                className="form-textarea" 
                rows="4" 
                placeholder="Provide all necessary context, dates, or relevant transaction references..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', fontSize: '0.78rem', color: '#64748b' }}>
              <strong>Lifecycle Route:</strong> Created → Assigned → In Progress → Resolved → Closed. An audit record is attached.
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Send size={14} />
              <span>Submit Ticket</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Building, 
  Save, 
  Check, 
  Eye, 
  EyeOff, 
  Camera, 
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
];

export default function ProfileSettingsModal({ isOpen, onClose, user, onUpdateUser }) {
  if (!isOpen || !user) return null;

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'security' | 'preferences'
  
  // Profile Info State
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [username, setUsername] = useState(user.username || user.name.toLowerCase().replace(/\s+/g, '.') || '');
  const [phone, setPhone] = useState(user.phone || '+92 300 1234567');
  const [bio, setBio] = useState(user.bio || `${user.designation || user.role} at XortLogix Enterprise`);
  const [avatar, setAvatar] = useState(user.avatar || PRESET_AVATARS[0]);

  // Security & Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  
  // Feedback Messages
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });

    // Validate email
    if (!email.trim() || !email.includes('@')) {
      setStatusMsg({ type: 'error', text: 'Please enter a valid enterprise email address.' });
      return;
    }

    // Validate password if user wants to change it
    if (newPassword.trim() || confirmPassword.trim() || currentPassword.trim()) {
      if (!currentPassword) {
        setStatusMsg({ type: 'error', text: 'Please provide your current password to authorize security updates.' });
        return;
      }
      if (currentPassword !== user.password) {
        setStatusMsg({ type: 'error', text: 'The current password provided is incorrect.' });
        return;
      }
      if (newPassword.length < 6) {
        setStatusMsg({ type: 'error', text: 'New password must be at least 6 characters long.' });
        return;
      }
      if (newPassword !== confirmPassword) {
        setStatusMsg({ type: 'error', text: 'New passwords do not match.' });
        return;
      }
    }

    const updatedUser = {
      ...user,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      username: username.trim().toLowerCase(),
      phone: phone.trim(),
      bio: bio.trim(),
      avatar: avatar,
      password: newPassword ? newPassword : user.password
    };

    onUpdateUser(updatedUser);

    setStatusMsg({
      type: 'success',
      text: 'Profile & account settings successfully updated and saved!'
    });

    // Reset password fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '640px', padding: 0, overflow: 'hidden' }}>
        {/* Modern Modal Header with User Card Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
          padding: '24px 24px 20px',
          color: '#ffffff',
          position: 'relative'
        }}>
          <button 
            onClick={onClose} 
            style={{ 
              position: 'absolute', 
              top: '16px', 
              right: '16px', 
              background: 'rgba(255, 255, 255, 0.12)', 
              border: 'none', 
              color: '#ffffff', 
              width: '28px', 
              height: '28px', 
              borderRadius: '50%', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={16} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <img 
                src={avatar} 
                alt={name} 
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}
              />
              <span style={{
                position: 'absolute',
                bottom: '2px',
                right: '2px',
                width: '14px',
                height: '14px',
                background: '#10b981',
                border: '2px solid #0f172a',
                borderRadius: '50%'
              }} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.01em', color: '#ffffff' }}>
                  {name || user.name}
                </h2>
                <span style={{
                  background: 'rgba(99, 102, 241, 0.35)',
                  border: '1px solid rgba(165, 180, 252, 0.4)',
                  color: '#e0e7ff',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 600
                }}>
                  {user.role}
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#c7d2fe', marginTop: '3px' }}>
                {user.department} • ID: <strong>{user.id}</strong>
              </p>
            </div>
          </div>

          {/* Segmented Navigation Tabs */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginTop: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            paddingBottom: '2px'
          }}>
            <button
              onClick={() => setActiveTab('profile')}
              style={{
                background: activeTab === 'profile' ? 'rgba(255, 255, 255, 0.18)' : 'transparent',
                border: 'none',
                color: activeTab === 'profile' ? '#ffffff' : '#cbd5e1',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <User size={14} />
              <span>Profile & Details</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              style={{
                background: activeTab === 'security' ? 'rgba(255, 255, 255, 0.18)' : 'transparent',
                border: 'none',
                color: activeTab === 'security' ? '#ffffff' : '#cbd5e1',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Lock size={14} />
              <span>Password & Security</span>
            </button>

            <button
              onClick={() => setActiveTab('preferences')}
              style={{
                background: activeTab === 'preferences' ? 'rgba(255, 255, 255, 0.18)' : 'transparent',
                border: 'none',
                color: activeTab === 'preferences' ? '#ffffff' : '#cbd5e1',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Sliders size={14} />
              <span>Preferences</span>
            </button>
          </div>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSaveProfile}>
          <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto', padding: '22px 24px' }}>
            {/* Status Alert */}
            {statusMsg.text && (
              <div style={{
                padding: '10px 14px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: statusMsg.type === 'error' ? '#fef2f2' : '#ecfdf5',
                color: statusMsg.type === 'error' ? '#991b1b' : '#065f46',
                border: `1px solid ${statusMsg.type === 'error' ? '#fecaca' : '#a7f3d0'}`
              }}>
                {statusMsg.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                <span>{statusMsg.text}</span>
              </div>
            )}

            {/* TAB 1: Profile & Details */}
            {activeTab === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Choose Avatar */}
                <div>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Camera size={14} color="#6366f1" />
                    <span>Choose Profile Avatar</span>
                  </label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '6px', flexWrap: 'wrap' }}>
                    {PRESET_AVATARS.map((url, idx) => (
                      <img 
                        key={idx}
                        src={url}
                        alt="Avatar Option"
                        onClick={() => setAvatar(url)}
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          cursor: 'pointer',
                          border: avatar === url ? '3px solid #6366f1' : '2px solid #e2e8f0',
                          boxShadow: avatar === url ? '0 0 0 2px rgba(99, 102, 241, 0.3)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Full Display Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">System Username / Handle</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                      placeholder="e.g. farhan.ali"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Official Work Email</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact / Mobile Phone</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      placeholder="+92 300 0000000"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Professional Bio / Title</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)} 
                    placeholder="Short description of your role and team focus..."
                  />
                </div>

                {/* Read-Only Employment Badges */}
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '10px',
                  fontSize: '0.78rem'
                }}>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 600 }}>Department</span>
                    <p style={{ fontWeight: 600, color: '#1e293b', marginTop: '2px' }}>{user.department}</p>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 600 }}>Assigned Team</span>
                    <p style={{ fontWeight: 600, color: '#1e293b', marginTop: '2px' }}>{user.team || 'Leadership'}</p>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 600 }}>Employment Type</span>
                    <p style={{ fontWeight: 600, color: '#047857', marginTop: '2px' }}>{user.employmentType || 'Full-Time'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Security & Password */}
            {activeTab === 'security' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: '#1e40af',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <ShieldCheck size={18} color="#2563eb" />
                  <span>Update your password securely. Ensure it is at least 6 characters long.</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showCurrentPass ? 'text' : 'password'} 
                      className="form-input" 
                      value={currentPassword} 
                      onChange={(e) => setCurrentPassword(e.target.value)} 
                      placeholder="Enter current password to verify identity"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer'
                      }}
                    >
                      {showCurrentPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type={showNewPass ? 'text' : 'password'} 
                        className="form-input" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        placeholder="New password (min 6 chars)"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: '#64748b',
                          cursor: 'pointer'
                        }}
                      >
                        {showNewPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input 
                      type="password" 
                      className="form-input" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      placeholder="Re-type new password"
                    />
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', color: '#64748b', background: '#f8fafc', padding: '10px 12px', borderRadius: '6px' }}>
                  <strong>Security Best Practice:</strong> Use a combination of uppercase letters, numbers, and symbols to ensure unauthorized personnel cannot guess your access credentials.
                </div>
              </div>
            )}

            {/* TAB 3: Preferences */}
            {activeTab === 'preferences' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">System Timezone</label>
                  <select className="form-select" defaultValue="PKT">
                    <option value="PKT">Pakistan Standard Time (GMT+5) — Islamabad, Karachi</option>
                    <option value="EST">Eastern Standard Time (GMT-5) — New York, Washington</option>
                    <option value="GMT">Greenwich Mean Time (GMT+0) — London</option>
                    <option value="GST">Gulf Standard Time (GMT+4) — Dubai</option>
                    <option value="SGT">Singapore Standard Time (GMT+8) — Singapore</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.84rem', color: '#1e293b' }}>Email Alerts on Leave Approvals</div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Receive instant dispatch notifications when leaves are approved or rejected.</div>
                    </div>
                    <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: '#6366f1' }} />
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.84rem', color: '#1e293b' }}>Urgent Broadcast Notifications</div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Show toast alerts immediately when HR broadcasts an urgent bulletin.</div>
                    </div>
                    <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: '#6366f1' }} />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="modal-footer" style={{ borderTop: '1px solid #e2e8f0', padding: '14px 24px', background: '#fafbfc' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Save size={14} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

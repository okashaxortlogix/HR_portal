import React, { useState, useRef } from 'react';
import { 
  User, 
  Lock, 
  Mail, 
  Phone, 
  Building, 
  Save, 
  Eye, 
  EyeOff, 
  Upload, 
  Trash2, 
  ShieldCheck, 
  Sliders, 
  CheckCircle2, 
  AlertCircle,
  Briefcase,
  Users,
  Camera,
  AtSign
} from 'lucide-react';

export default function ProfileSettingsPage({ user, onUpdateUser }) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'security' | 'preferences'
  const fileInputRef = useRef(null);

  // Profile fields state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [username, setUsername] = useState(user?.username || (user?.name ? user.name.toLowerCase().replace(/\s+/g, '.') : ''));
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  // Password & security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // System preferences
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [desktopAlerts, setDesktopAlerts] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  // Status feedback
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [isSaving, setIsSaving] = useState(false);

  // Local File Upload from User's Device
  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatusMsg({ type: 'error', text: 'Please select a valid image file (PNG, JPG, WEBP, or SVG).' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setStatusMsg({ type: 'error', text: 'Image file size exceeds 5MB limit. Please choose a smaller photo.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const dataUrl = loadEvt.target.result;
      setAvatar(dataUrl);
      setStatusMsg({ type: 'success', text: 'New photo selected from your device. Click "Save Changes" to apply.' });
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatar('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setStatusMsg({ type: 'success', text: 'Profile picture removed. Click "Save Changes" to apply.' });
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setStatusMsg({ type: '', text: '' });
    setIsSaving(true);

    if (!name.trim()) {
      setStatusMsg({ type: 'error', text: 'Full display name cannot be empty.' });
      setIsSaving(false);
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setStatusMsg({ type: 'error', text: 'Please enter a valid enterprise email address.' });
      setIsSaving(false);
      return;
    }

    // Password validation if updating password
    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword) {
        setStatusMsg({ type: 'error', text: 'Please enter your current password to authorize security changes.' });
        setIsSaving(false);
        return;
      }
      if (newPassword.length < 6) {
        setStatusMsg({ type: 'error', text: 'New password must be at least 6 characters long.' });
        setIsSaving(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        setStatusMsg({ type: 'error', text: 'New passwords do not match. Please re-type.' });
        setIsSaving(false);
        return;
      }
    }

    const updated = {
      ...user,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      username: username.trim().toLowerCase(),
      phone: phone.trim(),
      bio: bio.trim(),
      avatar: avatar,
      ...(newPassword ? { newPassword, currentPassword, password: newPassword } : {})
    };

    try {
      await onUpdateUser(updated);
      setStatusMsg({ type: 'success', text: 'Profile details, photo, and account settings saved successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setStatusMsg({ type: 'error', text: err?.message || 'Failed to save changes. Please check current password.' });
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    return str.slice(0, 2).toUpperCase();
  };

  return (
    <div className="page-viewport" style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', paddingBottom: '60px' }}>
      {/* 1. Page Header Banner */}
      <div className="page-title-banner" style={{ marginBottom: '4px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Account & Profile Settings
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '4px' }}>
            Manage your personal profile details, profile picture, account security, and portal preferences.
          </p>
        </div>
        <button 
          onClick={handleSubmit} 
          disabled={isSaving}
          className="btn-primary-saas"
          style={{ minWidth: '135px', justifyContent: 'center', padding: '9px 18px', fontSize: '0.84rem' }}
        >
          <Save size={15} />
          <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Status Feedback Alert */}
      {statusMsg.text && (
        <div style={{
          padding: '12px 18px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.84rem',
          fontWeight: 500,
          background: statusMsg.type === 'error' ? '#fef2f2' : '#f0fdf4',
          border: `1px solid ${statusMsg.type === 'error' ? '#fecaca' : '#bbf7d0'}`,
          color: statusMsg.type === 'error' ? '#991b1b' : '#166534',
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
        }}>
          {statusMsg.type === 'error' ? (
            <AlertCircle size={18} color="#dc2626" />
          ) : (
            <CheckCircle2 size={18} color="#16a34a" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* 2. Navigation Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #e2e8f0',
        gap: '8px',
        marginTop: '8px',
        background: '#ffffff',
        padding: '0 12px',
        borderRadius: '10px 10px 0 0',
        border: '1px solid #e2e8f0'
      }}>
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          style={{
            padding: '12px 20px',
            border: 'none',
            background: 'transparent',
            borderBottom: activeTab === 'profile' ? '2px solid #4f46e5' : '2px solid transparent',
            color: activeTab === 'profile' ? '#4f46e5' : '#64748b',
            fontWeight: activeTab === 'profile' ? 600 : 500,
            fontSize: '0.86rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease'
          }}
        >
          <User size={15} />
          <span>Personal & Identity Details</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          style={{
            padding: '12px 20px',
            border: 'none',
            background: 'transparent',
            borderBottom: activeTab === 'security' ? '2px solid #4f46e5' : '2px solid transparent',
            color: activeTab === 'security' ? '#4f46e5' : '#64748b',
            fontWeight: activeTab === 'security' ? 600 : 500,
            fontSize: '0.86rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease'
          }}
        >
          <Lock size={15} />
          <span>Password & Account Security</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preferences')}
          style={{
            padding: '12px 20px',
            border: 'none',
            background: 'transparent',
            borderBottom: activeTab === 'preferences' ? '2px solid #4f46e5' : '2px solid transparent',
            color: activeTab === 'preferences' ? '#4f46e5' : '#64748b',
            fontWeight: activeTab === 'preferences' ? 600 : 500,
            fontSize: '0.86rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease'
          }}
        >
          <Sliders size={15} />
          <span>System & Notification Preferences</span>
        </button>
      </div>

      {/* 3. Tab 1: Personal & Identity Details (Profile Picture sits directly inside here!) */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Section 1: Profile Photo Upload (RIGHT HERE IN PERSONAL DETAILS) */}
          <div className="platform-card" style={{ borderRadius: '0 0 12px 12px', borderTop: 'none', padding: '24px 26px' }}>
            <div className="card-title-row" style={{ marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Camera size={17} color="#4f46e5" />
                  <span>Profile Photo</span>
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '3px 0 0' }}>
                  Upload a photo from your local device to represent your account across the portal.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
              {/* Avatar Preview */}
              <div 
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                title="Click to choose a photo from device"
                style={{ 
                  position: 'relative',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                {avatar ? (
                  <img 
                    src={avatar} 
                    alt={name} 
                    style={{
                      width: '92px',
                      height: '92px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #6366f1',
                      boxShadow: '0 4px 14px rgba(99, 102, 241, 0.25)',
                      background: '#ffffff'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '92px',
                    height: '92px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)',
                    border: '3px solid #c7d2fe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    fontWeight: 800,
                    color: '#ffffff',
                    letterSpacing: '-0.02em',
                    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.2)'
                  }}>
                    {getInitials(name)}
                  </div>
                )}
                
                {/* Camera Overlay Icon */}
                <div style={{
                  position: 'absolute',
                  bottom: '0px',
                  right: '0px',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#1e1b4b',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #ffffff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                }}>
                  <Camera size={13} />
                </div>
              </div>

              {/* Upload Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input 
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    className="btn-primary-saas"
                    style={{ padding: '8px 16px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Upload size={14} />
                    <span>Choose Photo from Device</span>
                  </button>

                  {avatar && (
                    <button 
                      type="button"
                      onClick={handleRemovePhoto}
                      className="btn-outline-saas"
                      style={{ padding: '8px 14px', fontSize: '0.82rem', color: '#dc2626', borderColor: '#fecaca', background: '#fff1f2' }}
                    >
                      <Trash2 size={14} />
                      <span>Remove Photo</span>
                    </button>
                  )}
                </div>

                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  Choose any image locally from your computer. Supports PNG, JPG, or WEBP up to 5MB.
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Personal & Contact Information */}
          <div className="platform-card" style={{ padding: '24px 26px' }}>
            <div className="card-title-row">
              <h3>Personal & Contact Information</h3>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Editable details for internal portal visibility</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Full Display Name *</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    required
                    style={{ paddingLeft: '32px' }}
                  />
                  <User size={14} color="#9ca3af" style={{ position: 'absolute', left: '10px', top: '11px' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">System Username / Handle *</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text"
                    className="form-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. alex.rivera"
                    required
                    style={{ paddingLeft: '32px' }}
                  />
                  <AtSign size={14} color="#9ca3af" style={{ position: 'absolute', left: '10px', top: '11px' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Official Work Email *</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex.dev@xortlogix.com"
                    required
                    style={{ paddingLeft: '32px' }}
                  />
                  <Mail size={14} color="#9ca3af" style={{ position: 'absolute', left: '10px', top: '11px' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Contact / Mobile Phone</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text"
                    className="form-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2831"
                    style={{ paddingLeft: '32px' }}
                  />
                  <Phone size={14} color="#9ca3af" style={{ position: 'absolute', left: '10px', top: '11px' }} />
                </div>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '16px' }}>
              <label className="form-label">Professional Bio & Role Summary</label>
              <textarea 
                className="form-textarea"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief summary of your responsibilities, working hours, or project focus..."
              />
            </div>
          </div>

          {/* Section 3: Organizational Placement (Read-Only) */}
          <div className="platform-card" style={{ padding: '24px 26px' }}>
            <div className="card-title-row">
              <h3>Organizational Placement & Reporting Structure</h3>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Governed by XortLogix HR Administration</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
              <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4f46e5', marginBottom: '6px' }}>
                  <Building size={16} />
                  <span style={{ fontSize: '0.74rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>Department</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>{user?.department || 'General Department'}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>Operational Unit</div>
              </div>

              <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', marginBottom: '6px' }}>
                  <Users size={16} />
                  <span style={{ fontSize: '0.74rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>Assigned Team</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>{user?.team || 'General Team'}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>Squad / Pod</div>
              </div>

              <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d97706', marginBottom: '6px' }}>
                  <ShieldCheck size={16} />
                  <span style={{ fontSize: '0.74rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>Direct Reporting Lead</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>{user?.reportingLead || 'Sarah Jenkins'}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>1st-Tier Approver</div>
              </div>

              <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7c3aed', marginBottom: '6px' }}>
                  <Briefcase size={16} />
                  <span style={{ fontSize: '0.74rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>Department Head</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>{user?.departmentHead || 'Elena Rostova'}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>Executive Lead</div>
              </div>
            </div>
          </div>

          {/* Bottom Save Bar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
            <button 
              type="submit"
              disabled={isSaving}
              className="btn-primary-saas"
              style={{ minWidth: '150px', justifyContent: 'center', padding: '10px 24px' }}
            >
              <Save size={15} />
              <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      )}

      {/* 4. Tab 2: Password & Account Security (ONLY PASSWORD FIELDS) */}
      {activeTab === 'security' && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="platform-card" style={{ borderRadius: '0 0 12px 12px', borderTop: 'none', padding: '24px 26px' }}>
            <div className="card-title-row">
              <h3>Change Account Password</h3>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Keep your XortLogix credentials secure</span>
            </div>

            <div style={{ maxWidth: '520px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Current Password *</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showCurrentPass ? 'text' : 'password'}
                    className="form-input"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your existing password"
                    style={{ paddingRight: '36px' }}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    style={{ position: 'absolute', right: '10px', top: '9px', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
                  >
                    {showCurrentPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showNewPass ? 'text' : 'password'}
                    className="form-input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    style={{ paddingRight: '36px' }}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowNewPass(!showNewPass)}
                    style={{ position: 'absolute', right: '10px', top: '9px', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
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
                  placeholder="Re-enter your new password"
                />
              </div>

              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.78rem', color: '#64748b' }}>
                <strong style={{ color: '#334155' }}>Password Security Requirements:</strong>
                <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                  <li>Minimum 6 characters in length</li>
                  <li>Mix of uppercase letters, numbers, or symbols recommended</li>
                  <li>Do not reuse previous enterprise passwords</li>
                </ul>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
            <button 
              type="submit"
              disabled={isSaving}
              className="btn-primary-saas"
              style={{ minWidth: '150px', justifyContent: 'center', padding: '10px 24px' }}
            >
              <Save size={15} />
              <span>{isSaving ? 'Updating...' : 'Update Password'}</span>
            </button>
          </div>
        </form>
      )}

      {/* 5. Tab 3: System & Notification Preferences (ONLY PREFERENCES) */}
      {activeTab === 'preferences' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="platform-card" style={{ borderRadius: '0 0 12px 12px', borderTop: 'none', padding: '24px 26px' }}>
            <div className="card-title-row">
              <h3>Notification & Security Preferences</h3>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Control how XortLogix sends alerts and authenticates</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '680px' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.86rem', color: '#0f172a' }}>Leave Status Email Notifications</div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>Receive instant emails when a leave request is submitted, approved, or rejected.</div>
                </div>
                <input 
                  type="checkbox"
                  checked={emailNotifs}
                  onChange={(e) => setEmailNotifs(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#4f46e5' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.86rem', color: '#0f172a' }}>Desktop & In-Portal Alerts</div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>Show real-time toast notifications for company announcements and approvals.</div>
                </div>
                <input 
                  type="checkbox"
                  checked={desktopAlerts}
                  onChange={(e) => setDesktopAlerts(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#4f46e5' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.86rem', color: '#0f172a' }}>Two-Factor Authentication (2FA)</div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>Require an authentication code via email upon signing in to the portal.</div>
                </div>
                <input 
                  type="checkbox"
                  checked={twoFactorAuth}
                  onChange={(e) => setTwoFactorAuth(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#4f46e5' }}
                />
              </label>

              {/* Real-time HTML5 Browser Notification Permission & Test */}
              <div style={{
                marginTop: '10px',
                padding: '16px 18px',
                background: '#eff6ff',
                borderRadius: '10px',
                border: '1px solid #bfdbfe',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>🔔 Browser Notifications</span>
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#3b82f6', marginTop: '3px' }}>
                      Delivers real-time browser alerts whenever policies are updated, announcements are broadcast, or leave requests are processed.
                    </div>
                  </div>
                  <span style={{
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: (typeof Notification !== 'undefined' && Notification.permission === 'granted') ? '#dcfce7' : '#fef3c7',
                    color: (typeof Notification !== 'undefined' && Notification.permission === 'granted') ? '#15803d' : '#b45309',
                    border: (typeof Notification !== 'undefined' && Notification.permission === 'granted') ? '1px solid #86efac' : '1px solid #fde68a'
                  }}>
                    {typeof Notification !== 'undefined' ? `Status: ${Notification.permission}` : 'Not Supported'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginTop: '4px' }}>
                  <button
                    type="button"
                    onClick={async () => {
                      if (typeof Notification !== 'undefined') {
                        const res = await Notification.requestPermission();
                        if (res === 'granted') {
                          new Notification('XortLogix Portal', {
                            body: 'Browser notifications are active. You will receive live alerts for policy changes and announcements.',
                            icon: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=80'
                          });
                          setStatusMsg({ type: 'success', text: 'Browser notifications enabled successfully.' });
                        } else {
                          setStatusMsg({ type: 'error', text: 'Notification permission was dismissed or blocked in browser settings.' });
                        }
                      }
                    }}
                    style={{
                      background: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      padding: '7px 14px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>Request / Test Browser Notification</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Bell, 
  LogOut, 
  ChevronRight,
  User
} from 'lucide-react';

export default function Header({ 
  currentUser, 
  onLogout, 
  activePage, 
  onOpenSearch, 
  onOpenProfileSettings, 
  pendingCount = 0,
  recentNotifications = [],
  onTriggerTestNotif
}) {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="app-topbar">
      {/* Left: Clean Breadcrumbs */}
      <div className="topbar-left">
        <div className="breadcrumbs">
          <span style={{ fontWeight: 600, color: '#4f46e5' }}>XortLogix Portal</span>
          <ChevronRight size={13} color="#9ca3af" />
          <span>{currentUser.department}</span>
          <ChevronRight size={13} color="#9ca3af" />
          <span className="current">{activePage}</span>
        </div>
      </div>

      {/* Center: Global Spotlight Search Bar (⌘K / Ctrl+K) */}
      <div 
        className="search-box" 
        onClick={onOpenSearch}
        role="button"
        title="Press ⌘K or Ctrl+K to search pages, employees, policies, and actions"
        style={{ cursor: 'pointer' }}
      >
        <Search size={15} color="#6366f1" />
        <span style={{ color: '#64748b' }}>Search pages, staff, policies, actions...</span>
        <span className="search-shortcut">⌘K</span>
      </div>

      {/* Right: Actions, User Profile & Sign Out */}
      <div className="topbar-right">
        {/* Notifications Icon */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setNotifOpen(!notifOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <Bell size={17} color="#4b5563" />
            {((pendingCount || 0) + (recentNotifications || []).length) > 0 && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                background: '#dc2626',
                color: 'white',
                fontSize: '9px',
                fontWeight: 700,
                borderRadius: '9999px',
                minWidth: '14px',
                height: '14px',
                padding: '0 3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {(pendingCount || 0) + (recentNotifications || []).length}
              </span>
            )}

          </button>

          {notifOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              right: 0,
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              width: '320px',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.12), 0 8px 10px -6px rgba(0,0,0,0.08)',
              zIndex: 9999,
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#0f172a' }}>
                  Notifications
                </div>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: (typeof Notification !== 'undefined' && Notification.permission === 'granted') ? '#dcfce7' : '#f1f5f9',
                  color: (typeof Notification !== 'undefined' && Notification.permission === 'granted') ? '#15803d' : '#64748b'
                }}>
                  {typeof Notification !== 'undefined' && Notification.permission === 'granted' ? 'Desktop Alerts: ON' : 'In-App Only'}
                </span>
              </div>

              {recentNotifications && recentNotifications.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
                  {recentNotifications.slice(0, 6).map((n) => (
                    <div key={n.id} style={{ padding: '8px 10px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748b' }}>
                        <span style={{ fontWeight: 700, textTransform: 'uppercase', color: '#2563eb' }}>{n.category || 'System'}</span>
                        <span>{n.time || 'Recent'}</span>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#1e293b', marginTop: '2px' }}>
                        {n.title}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#475569', marginTop: '2px', lineHeight: 1.3 }}>
                        {n.message}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.78rem', color: '#64748b', padding: '14px 0', textAlign: 'center' }}>
                  {pendingCount > 0 
                    ? `${pendingCount} leave request(s) awaiting review.` 
                    : 'No unread notifications. All policies and notices are synchronized.'}
                </div>
              )}

              <button
                onClick={() => {
                  if (onTriggerTestNotif) {
                    onTriggerTestNotif();
                  }
                }}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#475569',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                  marginTop: '2px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}
              >
                <Bell size={12} />
                <span>Test Notification</span>
              </button>
            </div>
          )}
        </div>

        {/* User Account Info & Sign Out Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '6px' }}>
          <button 
            onClick={onOpenProfileSettings}
            title="Account Settings & Profile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 10px',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#c7d2fe';
              e.currentTarget.style.background = '#eef2ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.background = '#f8fafc';
            }}
          >
            {currentUser.avatar ? (
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <div 
                style={{ 
                  width: '22px', 
                  height: '22px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', 
                  color: '#ffffff',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '10px', 
                  fontWeight: 700 
                }}
              >
                {currentUser.name ? currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : 'U'}
              </div>
            )}
            <div style={{ lineHeight: 1.15, textAlign: 'left' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#0f172a' }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: '0.66rem', color: '#6366f1', fontWeight: 500 }}>
                {currentUser.role}
              </div>
            </div>
          </button>

          <button
            onClick={onLogout}
            title="Sign out of your account"
            className="btn-outline-saas"
            style={{ padding: '5px 9px', fontSize: '0.76rem', gap: '5px', color: '#991b1b', borderColor: '#fecaca' }}
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}

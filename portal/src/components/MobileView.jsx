import React, { useState } from 'react';
import { 
  Building2, 
  CalendarCheck, 
  MessageSquare, 
  Calendar, 
  PhoneCall, 
  Home, 
  FileText, 
  MoreHorizontal,
  Wifi,
  Battery
} from 'lucide-react';

export default function MobileView({ user, onApplyLeave, onRaiseRequest }) {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="mobile-simulator-wrapper">
      <div className="mobile-phone-frame">
        <div className="phone-screen">
          {/* iOS / Smartphone Status Bar */}
          <div className="phone-notch-bar">
            <span>9:41</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Wifi size={12} />
              <Battery size={14} />
            </div>
          </div>

          {/* WorkSphere App Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px',
            background: '#ffffff',
            borderBottom: '1px solid #f1f5f9',
            fontSize: '0.9rem',
            fontWeight: 800,
            color: '#0f172a'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '4px',
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '11px'
            }}>
              W
            </div>
            <span>WorkSphere</span>
          </div>

          {/* Body Content */}
          <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Greeting */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img 
                src={user.avatar} 
                alt={user.name} 
                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
              />
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>Hello, {user.name}</h3>
                <p style={{ fontSize: '0.72rem', color: '#64748b' }}>{user.designation}</p>
              </div>
            </div>

            {/* Leave Balance Section */}
            <div style={{ background: '#ffffff', borderRadius: '10px', padding: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Leave Balance
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginTop: '8px', textAlign: 'center' }}>
                <div style={{ background: '#f0f9ff', padding: '8px 4px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.62rem', color: '#0284c7', fontWeight: 600 }}>Annual Leave</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>12 days</div>
                </div>

                <div style={{ background: '#ecfdf5', padding: '8px 4px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.62rem', color: '#059669', fontWeight: 600 }}>Medical Leave</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>7 days</div>
                </div>

                <div style={{ background: '#f5f3ff', padding: '8px 4px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.62rem', color: '#7c3aed', fontWeight: 600 }}>Casual Leave</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>3 days</div>
                </div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div style={{ background: '#ffffff', borderRadius: '10px', padding: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Quick Actions
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
                <button 
                  onClick={() => onApplyLeave(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: '#0f172a'
                  }}
                >
                  <CalendarCheck size={14} color="#2563eb" />
                  <span>Apply Leave</span>
                </button>

                <button 
                  onClick={onRaiseRequest}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: '#0f172a'
                  }}
                >
                  <MessageSquare size={14} color="#7c3aed" />
                  <span>My Requests</span>
                </button>

                <button 
                  onClick={() => alert('Opening Mobile Calendar')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: '#0f172a'
                  }}
                >
                  <Calendar size={14} color="#059669" />
                  <span>Calendar</span>
                </button>

                <button 
                  onClick={() => alert('Dialing Sarah Ahmed (+1 555-349-402)')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: '#0f172a'
                  }}
                >
                  <PhoneCall size={14} color="#0284c7" />
                  <span>Contact Lead</span>
                </button>
              </div>
            </div>

            {/* Recent Item Banner */}
            <div style={{ background: '#ffffff', borderRadius: '10px', padding: '10px 12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700 }}>Upcoming Leave</span>
                <span className="status-pill pending" style={{ fontSize: '0.62rem' }}>Pending</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                Annual Leave: 20 Sep – 22 Sep, 2024
              </p>
            </div>
          </div>

          {/* Bottom App Navigation */}
          <div className="phone-nav-bottom">
            <div 
              className={`phone-nav-item ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              <Home size={15} />
              <span>Home</span>
            </div>
            <div 
              className={`phone-nav-item ${activeTab === 'leaves' ? 'active' : ''}`}
              onClick={() => { setActiveTab('leaves'); onApplyLeave(false); }}
            >
              <FileText size={15} />
              <span>Leaves</span>
            </div>
            <div 
              className={`phone-nav-item ${activeTab === 'requests' ? 'active' : ''}`}
              onClick={() => { setActiveTab('requests'); onRaiseRequest(); }}
            >
              <MessageSquare size={15} />
              <span>Requests</span>
            </div>
            <div 
              className={`phone-nav-item ${activeTab === 'more' ? 'active' : ''}`}
              onClick={() => alert('Mobile Settings & Profile')}
            >
              <MoreHorizontal size={15} />
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

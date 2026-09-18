import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  MessageSquare,
  User,
  Users,
  BookOpen,
  Megaphone,
  Calendar,
  FolderClosed,
  Building,
  BarChart3,
  GitBranch,
  FileText,
  Clock,
  Settings,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar({ 
  currentUser, 
  activePage, 
  onSelectPage, 
  pendingLeavesCount = 0,
  onOpenProfileSettings
}) {
  const getNavSections = () => {
    switch (currentUser.roleKey) {
      case 'intern':
      case 'employee':
        return [
          {
            title: 'Self-Service',
            items: [
              { name: 'Dashboard', icon: LayoutDashboard },
              { name: 'Profile Settings', icon: User },
              { name: 'My Leaves', icon: CalendarDays },
              { name: 'My Requests', icon: MessageSquare }
            ]
          },
          {
            title: 'Organization',
            items: [
              { name: 'Company Directory', icon: BookOpen },
              { name: 'Announcements', icon: Megaphone },
              { name: 'Company Calendar', icon: Calendar },
              { name: 'Documents', icon: FolderClosed }
            ]
          }
        ];

      case 'team_lead':
        return [
          {
            title: 'Team Management',
            items: [
              { name: 'Dashboard', icon: LayoutDashboard },
              { name: 'Leave Approvals', icon: CalendarDays, badge: pendingLeavesCount > 0 ? `${pendingLeavesCount}` : null },
              { name: 'My Team', icon: Users },
              { name: 'Team Calendar', icon: Calendar }
            ]
          },
          {
            title: 'Resources',
            items: [
              { name: 'Company Directory', icon: BookOpen },
              { name: 'Announcements', icon: Megaphone }
            ]
          }
        ];

      case 'department_head':
        return [
          {
            title: 'Department Operations',
            items: [
              { name: 'Dashboard', icon: LayoutDashboard },
              { name: 'Teams & Leads', icon: Building },
              { name: 'Leave Approvals', icon: CalendarDays },
              { name: 'Department Calendar', icon: Calendar },
              { name: 'Department Reports', icon: BarChart3 }
            ]
          },
          {
            title: 'Organization',
            items: [
              { name: 'Company Directory', icon: BookOpen },
              { name: 'Announcements', icon: Megaphone }
            ]
          }
        ];

      case 'hr':
      case 'admin':
        return [
          {
            title: 'HR & Administration',
            items: [
              { name: 'Dashboard', icon: LayoutDashboard },
              { name: 'Employee Management', icon: Users },
              { name: 'Leave Policy Engine', icon: FileText },
              { name: 'Leave Requests Queue', icon: CalendarDays, badge: pendingLeavesCount > 0 ? `${pendingLeavesCount}` : null },
              { name: 'HR Helpdesk', icon: MessageSquare }
            ]
          },
          {
            title: 'System & Security',
            items: [
              { name: 'Roles & Permissions', icon: ShieldCheck },
              { name: 'Audit Logs', icon: Clock },
              { name: 'Announcements', icon: Megaphone }
            ]
          }
        ];

      default:
        return [];
    }
  };

  const sections = getNavSections();

  return (
    <aside className="app-sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-wrapper">
          <div className="brand-icon">
            <span>X</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span className="brand-title">XortLogix Portal</span>
            <span style={{ fontSize: '0.64rem', color: '#818cf8', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Enterprise Suite
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="sidebar-body">
        {sections.map((sec, idx) => (
          <div key={idx}>
            <div className="sidebar-section-title">{sec.title}</div>
            <ul className="sidebar-nav-list">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.name;
                return (
                  <li key={item.name}>
                    <button
                      className={`sidebar-nav-btn ${isActive ? 'active' : ''}`}
                      onClick={() => onSelectPage(item.name)}
                    >
                      <div className="nav-left">
                        <Icon size={15} color={isActive ? '#818cf8' : '#94a3b8'} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="sidebar-badge">{item.badge}</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Clickable Active User Footer (Opens Settings & Profile) */}
      <div className="sidebar-footer-container">
        <button 
          className="sidebar-footer-persona-btn"
          onClick={onOpenProfileSettings}
          title="Account Settings: Click to edit profile, username, or change password"
        >
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {currentUser.avatar ? (
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="persona-avatar"
              />
            ) : (
              <div 
                className="persona-avatar"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #3730a3 0%, #4f46e5 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '12px'
                }}
              >
                {currentUser.name ? currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : 'U'}
              </div>
            )}
            <span className="persona-status-dot" />
          </div>
          <div className="persona-info">
            <h4>{currentUser.name}</h4>
            <p>{currentUser.role}</p>
          </div>
          <div className="persona-settings-icon">
            <Settings size={14} color="#94a3b8" />
          </div>
        </button>
      </div>
    </aside>
  );
}

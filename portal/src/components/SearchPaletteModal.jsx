import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  ArrowRight, 
  User, 
  FileText, 
  CalendarDays, 
  Megaphone, 
  ShieldCheck, 
  Clock, 
  HelpCircle, 
  Settings, 
  Plus, 
  ExternalLink,
  Command
} from 'lucide-react';

export default function SearchPaletteModal({ 
  isOpen, 
  onClose, 
  onNavigate, 
  users = [], 
  policies = [], 
  onOpenApplyLeave, 
  onOpenRaiseTicket, 
  onOpenProfileSettings,
  onOpenAddPolicy,
  onOpenBroadcastNotice,
  currentUser
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isHrOrAdmin = currentUser?.roleKey === 'hr' || currentUser?.roleKey === 'admin';

  // Available portal navigation pages
  const ALL_PAGES = [
    { name: 'Dashboard', desc: 'Overview, leave metrics, and announcements', icon: CalendarDays, category: 'Pages' },
    { name: 'Employee Management', desc: 'Provision employees and assign quotas', icon: User, category: 'Pages', hrOnly: true },
    { name: 'Leave Policy Engine', desc: 'Configure statutory & company leave rules', icon: FileText, category: 'Pages', hrOnly: true },
    { name: 'Leave Requests Queue', desc: 'Centralized review & approvals desk', icon: CalendarDays, category: 'Pages', hrOnly: true },
    { name: 'HR Helpdesk', desc: 'Employee support tickets & inquiries', icon: HelpCircle, category: 'Pages', hrOnly: true },
    { name: 'Announcements', desc: 'Company notices & executive bulletins', icon: Megaphone, category: 'Pages' },
    { name: 'Roles & Permissions', desc: 'RBAC capability matrix & security tiers', icon: ShieldCheck, category: 'Pages', hrOnly: true },
    { name: 'Audit Logs', desc: 'Immutable platform activity history', icon: Clock, category: 'Pages', hrOnly: true },
    { name: 'My Leaves', desc: 'Personal balance ledger and past requests', icon: CalendarDays, category: 'Pages' },
    { name: 'Profile Settings', desc: 'Manage your avatar, username, email, and password', icon: Settings, category: 'Pages' },
    { name: 'Company Directory', desc: 'Cross-functional personnel directory', icon: User, category: 'Pages' },
    { name: 'Company Calendar', desc: 'Public holidays and leave coverage', icon: CalendarDays, category: 'Pages' }
  ].filter(p => !p.hrOnly || isHrOrAdmin);

  // Quick Action triggers
  const QUICK_ACTIONS = [
    {
      id: 'act-apply-leave',
      title: 'Apply for Leave / Absence',
      desc: 'Submit vacation, medical, casual, or emergency request',
      icon: Plus,
      category: 'Quick Actions',
      action: () => { onClose(); if (onOpenApplyLeave) onOpenApplyLeave(); }
    },
    {
      id: 'act-raise-ticket',
      title: 'Raise HR Helpdesk Ticket',
      desc: 'Inquiries on payroll, taxes, benefits, or letters',
      icon: HelpCircle,
      category: 'Quick Actions',
      action: () => { onClose(); if (onOpenRaiseTicket) onOpenRaiseTicket(); }
    },
    {
      id: 'act-settings',
      title: 'Account Settings & Password',
      desc: 'Edit profile name, email, username, and change password',
      icon: Settings,
      category: 'Quick Actions',
      action: () => { onClose(); if (onOpenProfileSettings) onOpenProfileSettings(); }
    },
    ...(isHrOrAdmin ? [
      {
        id: 'act-broadcast',
        title: 'Broadcast Announcement to All Users',
        desc: 'Send an instant company-wide update or policy notice',
        icon: Megaphone,
        category: 'Quick Actions',
        action: () => { onClose(); if (onOpenBroadcastNotice) onOpenBroadcastNotice(); }
      },
      {
        id: 'act-add-policy',
        title: 'Create New Leave Policy',
        desc: 'Define eligibility, entitlement days, and approval chain',
        icon: FileText,
        category: 'Quick Actions',
        action: () => { onClose(); if (onOpenAddPolicy) onOpenAddPolicy(); }
      }
    ] : [])
  ];

  const q = query.trim().toLowerCase();

  // Filter Pages
  const matchedPages = ALL_PAGES.filter(p => 
    !q || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
  ).map(p => ({
    ...p,
    type: 'page',
    title: p.name,
    action: () => {
      onNavigate(p.name);
      onClose();
    }
  }));

  // Filter Quick Actions
  const matchedActions = QUICK_ACTIONS.filter(a =>
    !q || a.title.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q)
  ).map(a => ({
    ...a,
    type: 'action'
  }));

  // Filter Employees
  const matchedUsers = users.filter(u =>
    q && (
      u.name.toLowerCase().includes(q) || 
      u.email.toLowerCase().includes(q) || 
      (u.role && u.role.toLowerCase().includes(q)) ||
      (u.department && u.department.toLowerCase().includes(q))
    )
  ).map(u => ({
    id: u.id,
    title: u.name,
    desc: `${u.role} • ${u.department} (${u.team || 'General'})`,
    category: 'Employees',
    avatar: u.avatar,
    type: 'user',
    action: () => {
      onNavigate('Company Directory');
      onClose();
    }
  }));

  // Filter Policies
  const matchedPolicies = policies.filter(pol =>
    q && (
      pol.name.toLowerCase().includes(q) ||
      (pol.description && pol.description.toLowerCase().includes(q)) ||
      (pol.entitlement && pol.entitlement.toLowerCase().includes(q))
    )
  ).map(pol => ({
    id: pol.id,
    title: pol.name,
    desc: `${pol.entitlement} • Gender: ${pol.eligibility?.gender || 'All'} • Status: ${pol.status}`,
    category: 'Leave Policies',
    icon: FileText,
    type: 'policy',
    action: () => {
      onNavigate('Leave Policy Engine');
      onClose();
    }
  }));

  // Flattened results list
  const results = [
    ...matchedActions,
    ...matchedPages,
    ...matchedUsers,
    ...matchedPolicies
  ];

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (results.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % (results.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        results[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ alignItems: 'flex-start', paddingTop: '80px' }}>
      <div 
        className="modal-container" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          maxWidth: '580px', 
          padding: 0, 
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.35)',
          border: '1px solid #cbd5e1'
        }}
      >
        {/* Modern Command Search Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 20px',
          borderBottom: '1px solid #e2e8f0',
          background: '#ffffff'
        }}>
          <Search size={18} color="#6366f1" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages, employees, policies, or quick actions..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            style={{
              border: 'none',
              outline: 'none',
              fontSize: '0.96rem',
              width: '100%',
              color: '#0f172a',
              background: 'transparent',
              fontFamily: 'inherit'
            }}
          />
          {query ? (
            <button 
              onClick={() => { setQuery(''); setSelectedIndex(0); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '2px' }}
            >
              <X size={16} />
            </button>
          ) : (
            <span style={{
              fontSize: '0.7rem',
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              padding: '2px 7px',
              borderRadius: '5px',
              color: '#64748b',
              fontWeight: 600
            }}>
              ESC
            </span>
          )}
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '10px 12px' }}>
          {results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 20px', color: '#64748b' }}>
              <Command size={28} color="#94a3b8" style={{ margin: '0 auto 8px', display: 'block' }} />
              <p style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>No matching results</p>
              <p style={{ fontSize: '0.78rem', marginTop: '4px' }}>Try searching for a colleague name, "Annual Leave", or "Apply for Leave".</p>
            </div>
          ) : (
            results.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={`${item.category}-${item.title}-${idx}`}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: isSelected ? '#f1f5f9' : 'transparent',
                    transition: 'background 0.12s ease',
                    marginBottom: '2px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    {item.avatar ? (
                      <img 
                        src={item.avatar} 
                        alt={item.title} 
                        style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} 
                      />
                    ) : Icon ? (
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '7px',
                        background: isSelected ? '#e0e7ff' : '#f8fafc',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isSelected ? '#4f46e5' : '#64748b',
                        flexShrink: 0
                      }}>
                        <Icon size={14} />
                      </div>
                    ) : null}

                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.86rem', color: isSelected ? '#4f46e5' : '#0f172a' }}>
                          {item.title}
                        </span>
                        <span style={{
                          fontSize: '0.66rem',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          background: '#f1f5f9',
                          color: '#64748b',
                          fontWeight: 500
                        }}>
                          {item.category}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.74rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '1px' }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', color: isSelected ? '#4f46e5' : '#cbd5e1' }}>
                    <ArrowRight size={14} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 18px',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          fontSize: '0.72rem',
          color: '#64748b'
        }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <span><strong style={{ color: '#0f172a' }}>↑↓</strong> Navigate</span>
            <span><strong style={{ color: '#0f172a' }}>↵</strong> Select</span>
            <span><strong style={{ color: '#0f172a' }}>ESC</strong> Close</span>
          </div>
          <span style={{ color: '#818cf8', fontWeight: 600 }}>XortLogix Spotlight</span>
        </div>
      </div>
    </div>
  );
}

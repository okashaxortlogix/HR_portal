import React from 'react';
import { User, Users, Briefcase, Building2, ShieldCheck } from 'lucide-react';

export default function RoleAccessMatrix() {
  const roles = [
    {
      name: 'Employee',
      desc: 'View personal data, apply for leave, raise requests, access documents.',
      icon: User,
      color: '#0284c7',
      bg: '#e0f2fe'
    },
    {
      name: 'Team Lead',
      desc: 'Manage team, approve leaves, view team calendar and directory.',
      icon: Users,
      color: '#059669',
      bg: '#d1fae5'
    },
    {
      name: 'Department Head',
      desc: 'Oversee department, manage team leads, approve multi-tier leaves.',
      icon: Briefcase,
      color: '#7c3aed',
      bg: '#ede9fe'
    },
    {
      name: 'HR',
      desc: 'Manage employees, leave policies, HR requests, org tree, reports.',
      icon: Building2,
      color: '#ec4899',
      bg: '#fce7f3'
    },
    {
      name: 'Admin',
      desc: 'Full system control, user management, system settings, audit logs.',
      icon: ShieldCheck,
      color: '#2563eb',
      bg: '#dbeafe'
    }
  ];

  return (
    <div className="panel-card" style={{ height: '100%' }}>
      <div className="panel-title">
        <span>Role-Based Access</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {roles.map((r, idx) => {
          const Icon = r.icon;
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: r.bg,
                color: r.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px'
              }}>
                <Icon size={15} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>{r.name}</h4>
                <p style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.35 }}>{r.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

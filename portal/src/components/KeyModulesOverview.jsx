import React from 'react';
import { 
  FileCheck, 
  MessageSquare, 
  BookOpen, 
  Megaphone, 
  FolderClosed, 
  BarChart3 
} from 'lucide-react';

export default function KeyModulesOverview() {
  const modules = [
    {
      title: 'Leave Management',
      desc: 'Apply, track and manage leaves with automated balance updates.',
      icon: FileCheck,
      color: '#7c3aed',
      bg: '#ede9fe'
    },
    {
      title: 'HR Requests',
      desc: 'Raise and track HR-related requests (payroll, documents, etc.).',
      icon: MessageSquare,
      color: '#ec4899',
      bg: '#fce7f3'
    },
    {
      title: 'Organization Directory',
      desc: 'Find and contact team members, leads, and department heads.',
      icon: BookOpen,
      color: '#059669',
      bg: '#d1fae5'
    },
    {
      title: 'Announcements',
      desc: 'Stay updated with company news and important notices.',
      icon: Megaphone,
      color: '#0284c7',
      bg: '#e0f2fe'
    },
    {
      title: 'Documents',
      desc: 'Access policies, forms and important documents securely.',
      icon: FolderClosed,
      color: '#2563eb',
      bg: '#dbeafe'
    },
    {
      title: 'Reports',
      desc: 'Generate and view real-time HR and leave analytics.',
      icon: BarChart3,
      color: '#d97706',
      bg: '#fef3c7'
    }
  ];

  return (
    <div className="panel-card" style={{ height: '100%' }}>
      <div className="panel-title">
        <span>Key Features & Modules</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {modules.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: m.bg,
                color: m.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px'
              }}>
                <Icon size={15} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>{m.title}</h4>
                <p style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.35 }}>{m.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

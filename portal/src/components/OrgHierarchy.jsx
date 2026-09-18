import React from 'react';
import { Network, Users, UserCheck } from 'lucide-react';

export default function OrgHierarchy({ orgData, isCardMode = false }) {
  return (
    <div className={isCardMode ? 'panel-card' : ''} style={{ height: '100%', overflowX: 'auto' }}>
      <div className="panel-title" style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Network size={18} color="#2563eb" />
          <span>Organizational Hierarchy</span>
        </div>
        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Data-driven reporting structure</span>
      </div>

      <div className="org-chart-wrapper">
        {/* Company Root */}
        <div className="org-root-node">
          🏢 {orgData.name || 'Company'}
        </div>

        {/* Vertical connector line */}
        <div style={{ width: '2px', height: '18px', background: '#cbd5e1' }} />

        {/* Departments Grid */}
        <div className="org-dept-row">
          {orgData.departments.map((dept) => (
            <div key={dept.id} className="org-dept-card" style={{ borderTop: `3px solid ${dept.color}` }}>
              <div 
                className="org-dept-title"
                style={{ background: `${dept.color}15`, color: dept.color }}
              >
                {dept.name}
              </div>

              <div style={{ fontSize: '0.74rem', textAlign: 'center', color: '#64748b' }}>
                <span style={{ display: 'block', fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  Department Head
                </span>
                <strong style={{ color: '#0f172a' }}>{dept.head}</strong>
              </div>

              {/* Sub-teams list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                {dept.teams.map((t, idx) => (
                  <div key={idx} className="org-team-pill" style={{ borderLeftColor: dept.color }}>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{t.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '0.68rem', marginTop: '2px' }}>
                      <UserCheck size={11} />
                      <span>Team Lead: {t.lead}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8', fontSize: '0.66rem', marginTop: '1px' }}>
                      <Users size={11} />
                      <span>{t.membersCount} Members</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

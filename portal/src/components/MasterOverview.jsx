import React from 'react';
import EmployeePortal from './EmployeePortal';
import TeamLeadPortal from './TeamLeadPortal';
import DepartmentHeadPortal from './DepartmentHeadPortal';
import HrPortal from './HrPortal';
import AdminPortal from './AdminPortal';
import MobileView from './MobileView';
import OrgHierarchy from './OrgHierarchy';
import KeyModulesOverview from './KeyModulesOverview';
import RoleAccessMatrix from './RoleAccessMatrix';
import { LeavePolicyCard } from './LeavePolicyModal';
import { Maximize2, ExternalLink } from 'lucide-react';

export default function MasterOverview({
  data,
  onSwitchView,
  onApplyLeave,
  onRaiseRequest,
  onApproveRequest,
  onRejectRequest,
  onOpenPolicyModal
}) {
  return (
    <div style={{ paddingBottom: '40px' }}>
      {/* Top 3 Portals Grid */}
      <div className="overview-grid">
        {/* 1. Employee Portal (Dashboard) */}
        <div className="portal-card-frame">
          <div className="portal-frame-header emp-header">
            <span>Employee Portal (Dashboard)</span>
            <button 
              className="view-tab-btn" 
              onClick={() => onSwitchView('employee')} 
              style={{ color: '#0284c7', padding: '2px 8px' }}
            >
              <Maximize2 size={13} />
              <span>Full Screen</span>
            </button>
          </div>
          <div style={{ height: '420px', overflowY: 'auto' }}>
            <EmployeePortal 
              user={data.users.employee}
              leaveRequests={data.recentLeaveRequests}
              onApplyLeave={onApplyLeave}
              onRaiseRequest={onRaiseRequest}
              isMini={true}
            />
          </div>
        </div>

        {/* 2. Team Lead Portal */}
        <div className="portal-card-frame">
          <div className="portal-frame-header lead-header">
            <span>Team Lead Portal</span>
            <button 
              className="view-tab-btn" 
              onClick={() => onSwitchView('team_lead')} 
              style={{ color: '#059669', padding: '2px 8px' }}
            >
              <Maximize2 size={13} />
              <span>Full Screen</span>
            </button>
          </div>
          <div style={{ height: '420px', overflowY: 'auto' }}>
            <TeamLeadPortal 
              user={data.users.team_lead}
              leaveRequests={data.recentLeaveRequests}
              onApproveRequest={onApproveRequest}
              onRejectRequest={onRejectRequest}
              isMini={true}
            />
          </div>
        </div>

        {/* 3. Department Head Portal */}
        <div className="portal-card-frame">
          <div className="portal-frame-header head-header">
            <span>Department Head Portal</span>
            <button 
              className="view-tab-btn" 
              onClick={() => onSwitchView('department_head')} 
              style={{ color: '#7c3aed', padding: '2px 8px' }}
            >
              <Maximize2 size={13} />
              <span>Full Screen</span>
            </button>
          </div>
          <div style={{ height: '420px', overflowY: 'auto' }}>
            <DepartmentHeadPortal 
              user={data.users.department_head}
              departmentTeams={data.departmentTeams}
              onApproveAll={() => {
                data.recentLeaveRequests.forEach(r => onApproveRequest(r.id));
              }}
              isMini={true}
            />
          </div>
        </div>

        {/* 4. HR Portal */}
        <div className="portal-card-frame">
          <div className="portal-frame-header hr-header">
            <span>HR Portal</span>
            <button 
              className="view-tab-btn" 
              onClick={() => onSwitchView('hr')} 
              style={{ color: '#ec4899', padding: '2px 8px' }}
            >
              <Maximize2 size={13} />
              <span>Full Screen</span>
            </button>
          </div>
          <div style={{ height: '420px', overflowY: 'auto' }}>
            <HrPortal 
              user={data.users.hr}
              leaveRequests={data.recentLeaveRequests}
              onApproveRequest={onApproveRequest}
              onRejectRequest={onRejectRequest}
              onOpenPolicyModal={onOpenPolicyModal}
              isMini={true}
            />
          </div>
        </div>

        {/* 5. Admin Portal */}
        <div className="portal-card-frame">
          <div className="portal-frame-header admin-header">
            <span>Admin Portal</span>
            <button 
              className="view-tab-btn" 
              onClick={() => onSwitchView('admin')} 
              style={{ color: '#2563eb', padding: '2px 8px' }}
            >
              <Maximize2 size={13} />
              <span>Full Screen</span>
            </button>
          </div>
          <div style={{ height: '420px', overflowY: 'auto' }}>
            <AdminPortal 
              user={data.users.admin}
              recentActivities={data.recentActivities}
              isMini={true}
            />
          </div>
        </div>

        {/* 6. Mobile View (Employee Portal) */}
        <div className="portal-card-frame">
          <div className="portal-frame-header">
            <span>Mobile View (Employee Portal)</span>
            <button 
              className="view-tab-btn" 
              onClick={() => onSwitchView('mobile')} 
              style={{ color: '#64748b', padding: '2px 8px' }}
            >
              <Maximize2 size={13} />
              <span>Full Screen</span>
            </button>
          </div>
          <div style={{ height: '420px', overflowY: 'auto', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ transform: 'scale(0.85)', transformOrigin: 'top center' }}>
              <MobileView 
                user={data.users.employee}
                onApplyLeave={onApplyLeave}
                onRaiseRequest={onRaiseRequest}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Org Hierarchy + Key Modules + Role Access + Leave Policy */}
      <div className="overview-bottom-grid">
        {/* Org Hierarchy */}
        <div>
          <OrgHierarchy orgData={data.organizationTree} isCardMode={true} />
        </div>

        {/* Key Features & Modules */}
        <div>
          <KeyModulesOverview />
        </div>

        {/* Role-Based Access */}
        <div>
          <RoleAccessMatrix />
        </div>

        {/* Leave Policy Configuration (Example) */}
        <div>
          <LeavePolicyCard 
            policy={data.leavePolicies[0]} 
            onEdit={onOpenPolicyModal}
          />
        </div>
      </div>
    </div>
  );
}

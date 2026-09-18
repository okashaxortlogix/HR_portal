import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LoginPage from './components/LoginPage';
import CreateUserModal from './components/CreateUserModal';
import EmployeePortal from './components/EmployeePortal';
import TeamLeadPortal from './components/TeamLeadPortal';
import DepartmentHeadPortal from './components/DepartmentHeadPortal';
import HrPortal from './components/HrPortal';
import ApplyLeaveModal from './components/ApplyLeaveModal';
import RaiseRequestModal from './components/RaiseRequestModal';
import { LeavePolicyModal } from './components/LeavePolicyModal';
import SearchPaletteModal from './components/SearchPaletteModal';
import AiCopilotWidget from './components/AiCopilotWidget';
import ProfileSettingsPage from './components/ProfileSettingsPage';
import notificationService from './services/notificationService';
import { INITIAL_DATA, DEFAULT_HR_USER } from './data/initialData';
import api from './services/api';

export default function App() {
  // Persistent users list (excludes old purged accounts, preserves HR and newly registered employees)
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('worksphere_users_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter(u => !['admin@xortlogix.com', 'alex.dev@xortlogix.com', 'sarah.lead@xortlogix.com', 'elena.dept@xortlogix.com', 'marcus.dev@xortlogix.com'].includes(u.email));
          if (valid.length > 0) return valid;
        }
      }
    } catch (err) {
      console.error('Error loading users from localStorage:', err);
    }
    return INITIAL_DATA.initialUsers;
  });

  // Current authenticated user session (only HR user permitted)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedSession = localStorage.getItem('worksphere_session_user_v3');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.roleKey === 'hr') {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Error loading session from localStorage:', err);
    }
    return DEFAULT_HR_USER;
  });

  const [activePage, setActivePage] = useState('Dashboard');
  const [data, setData] = useState(INITIAL_DATA);

  // Dynamic leave policies with persistence (Maternity Leave removed by default)
  const [policies, setPolicies] = useState(() => {
    try {
      const saved = localStorage.getItem('worksphere_policies_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(p => p.id !== 'pol-maternity');
        }
      }
    } catch (e) {
      console.error('Error reading policies from localStorage:', e);
    }
    return INITIAL_DATA.leavePolicies.filter(p => p.id !== 'pol-maternity');
  });

  // Dynamic announcements with persistence (broadcasted to all users)
  const [announcements, setAnnouncements] = useState(() => {
    try {
      const saved = localStorage.getItem('worksphere_announcements_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error reading announcements from localStorage:', e);
    }
    return INITIAL_DATA.announcements;
  });

  // Modals state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isInternModeForModal, setIsInternModeForModal] = useState(false);
  const [isRaiseModalOpen, setIsRaiseModalOpen] = useState(false);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Real-time system notifications
  const [recentNotifications, setRecentNotifications] = useState([
    {
      id: 'init-1',
      category: 'Policy Engine',
      title: 'Leave Policies Active & Synchronized',
      message: 'All employees are linked to real-time administrative quotas.',
      time: 'Setup'
    }
  ]);

  // Centralized Alert Dispatcher (Browser Desktop Alert + In-App Notification Center)
  const dispatchAlert = ({ type, category, title, message }) => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newNotif = { id, type, category: category || 'System', title, message, time: 'Just now' };

    // Add to header notifications dropdown
    setRecentNotifications((prev) => [newNotif, ...prev.slice(0, 14)]);

    // Trigger Browser Desktop Notification & audio chime
    notificationService.sendDesktopNotification({
      title: title,
      body: message,
      tag: id
    });

    // Broadcast across other open tabs in real time
    notificationService.broadcast('LIVE_PORTAL_ALERT', { type, category, title, message, id });
  };

  // Subscribe to real-time cross-tab broadcast notifications
  useEffect(() => {
    const unsubscribe = notificationService.subscribe((event) => {
      if (event && event.type === 'LIVE_PORTAL_ALERT' && event.payload) {
        const p = event.payload;
        setRecentNotifications((prev) => [p, ...prev.slice(0, 14)]);
        notificationService.sendDesktopNotification({
          title: p.title,
          body: p.message,
          tag: p.id || `tag-${Date.now()}`
        });

        // If policy or announcement changed, fetch latest from backend
        if (p.type === 'policy' || p.type === 'announcement') {
          Promise.allSettled([api.getPolicies(), api.getAnnouncements(), api.getUsers()]).then(([pRes, aRes, uRes]) => {
            if (pRes.status === 'fulfilled' && pRes.value?.policies) setPolicies(pRes.value.policies);
            if (aRes.status === 'fulfilled' && aRes.value?.announcements) setAnnouncements(aRes.value.announcements);
            if (uRes.status === 'fulfilled' && uRes.value?.users) setUsers(uRes.value.users);
          });
        }
      }
    });
    return unsubscribe;
  }, []);

  // Background live poller for multi-client updates every 10 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const [pRes, aRes] = await Promise.allSettled([api.getPolicies(), api.getAnnouncements()]);
        if (pRes.status === 'fulfilled' && pRes.value?.policies) {
          setPolicies((prev) => {
            const hasChange = pRes.value.policies.some((np) => {
              const old = prev.find(o => o.id === np.id);
              return !old || old.days !== np.days;
            });
            return hasChange ? pRes.value.policies : prev;
          });
        }
        if (aRes.status === 'fulfilled' && aRes.value?.announcements) {
          setAnnouncements((prev) => {
            if (aRes.value.announcements.length !== prev.length) {
              return aRes.value.announcements;
            }
            return prev;
          });
        }
      } catch (e) {}
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Global Cmd+K / Ctrl+K listener for spotlight search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync live records from Laravel Database API on load
  useEffect(() => {
    async function loadBackendData() {
      try {
        const [usersRes, policiesRes, annRes, leavesRes, ticketsRes, logsRes] = await Promise.allSettled([
          api.getUsers(),
          api.getPolicies(),
          api.getAnnouncements(),
          api.getLeaves(),
          api.getTickets(),
          api.getAuditLogs()
        ]);

        if (usersRes.status === 'fulfilled' && usersRes.value?.users?.length) {
          setUsers(usersRes.value.users);
          if (currentUser) {
            const freshMe = usersRes.value.users.find(u => u.id === currentUser.id || u.email === currentUser.email);
            if (freshMe) setCurrentUser(freshMe);
          }
        }

        if (policiesRes.status === 'fulfilled' && policiesRes.value?.policies) {
          setPolicies(policiesRes.value.policies);
        }

        if (annRes.status === 'fulfilled' && annRes.value?.announcements) {
          setAnnouncements(annRes.value.announcements);
        }

        setData((prev) => ({
          ...prev,
          recentLeaveRequests: (leavesRes.status === 'fulfilled' && Array.isArray(leavesRes.value?.requests))
            ? leavesRes.value.requests
            : [],
          hrRequests: (ticketsRes.status === 'fulfilled' && Array.isArray(ticketsRes.value?.tickets))
            ? ticketsRes.value.tickets
            : [],
          auditLogs: (logsRes.status === 'fulfilled' && logsRes.value?.auditLogs?.length)
            ? logsRes.value.auditLogs
            : prev.auditLogs,
        }));
      } catch (err) {
        console.warn('Backend sync error:', err);
      }
    }

    loadBackendData();
  }, []);

  // Handle User Profile & Password Updates (Persisted to Laravel DB)
  const handleUpdateProfile = async (updatedUser) => {
    setCurrentUser(updatedUser);
    setUsers((prev) => {
      const nextUsers = prev.map((u) => u.id === updatedUser.id ? updatedUser : u);
      try {
        localStorage.setItem('worksphere_users_v3', JSON.stringify(nextUsers));
      } catch (e) {}
      return nextUsers;
    });

    try {
      localStorage.setItem('worksphere_session_user_v3', JSON.stringify(updatedUser));
    } catch (e) {}

    // Async sync to Laravel Backend Database
    try {
      await api.updateProfile(updatedUser);
    } catch (e) {
      console.warn('Could not sync profile to backend:', e.message);
    }

    setData((prev) => ({
      ...prev,
      auditLogs: [
        {
          id: `AUD-${Math.floor(Math.random() * 9000) + 1000}`,
          user: updatedUser.name,
          action: `Updated personal account credentials, bio & security settings`,
          module: 'Profile & Security',
          ip: '192.168.10.1',
          time: 'Just now'
        },
        ...prev.auditLogs
      ]
    }));
  };

  // Save users to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('worksphere_users_v3', JSON.stringify(users));
    } catch (err) {
      console.error('Error saving users to localStorage:', err);
    }
  }, [users]);

  // Save policies to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('worksphere_policies_v3', JSON.stringify(policies));
    } catch (e) {
      console.error('Error saving policies:', e);
    }
  }, [policies]);

  // Save announcements to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('worksphere_announcements_v3', JSON.stringify(announcements));
    } catch (e) {
      console.error('Error saving announcements:', e);
    }
  }, [announcements]);

  // Handle Login
  const handleLogin = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('worksphere_session_user_v3', JSON.stringify(user));
    } catch (err) {
      console.error('Error saving session:', err);
    }
    setActivePage('Dashboard');
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('worksphere_session_user_v3');
    } catch (err) {
      console.error('Error removing session:', err);
    }
  };

  // Handle New User Creation (Admin/HR only)
  const handleCreateUser = async (newUser) => {
    setUsers((prev) => [newUser, ...prev]);

    // Async sync to Laravel Backend
    try {
      await api.createUser(newUser);
    } catch (e) {
      console.warn('Backend user create error:', e.message);
    }

    // Record audit log
    const auditEntry = {
      id: `AUD-${Math.floor(Math.random() * 9000) + 1000}`,
      user: currentUser ? currentUser.name : 'Administrator',
      action: `Provisioned login credentials for ${newUser.name} (${newUser.email}) as ${newUser.role}`,
      module: 'User Management',
      ip: '192.168.10.1',
      time: 'Just now'
    };

    setData((prev) => ({
      ...prev,
      auditLogs: [auditEntry, ...prev.auditLogs]
    }));

    alert(`User "${newUser.name}" successfully created!\nLogin Email: ${newUser.email}\nAssigned Password: ${newUser.password}`);
  };

  // Handle Employee Update (Admin/HR only)
  const handleUpdateEmployee = async (updatedEmp) => {
    setUsers((prev) => prev.map((u) => u.id === updatedEmp.id ? { ...u, ...updatedEmp } : u));
    if (currentUser && currentUser.id === updatedEmp.id) {
      setCurrentUser(updatedEmp);
    }

    try {
      await api.updateUser(updatedEmp.id, updatedEmp);
    } catch (e) {
      console.warn('Backend user update error:', e.message);
    }

    setData((prev) => ({
      ...prev,
      auditLogs: [
        {
          id: `AUD-${Math.floor(Math.random() * 9000) + 1000}`,
          user: currentUser ? currentUser.name : 'HR Administrator',
          action: `Updated employee credentials and quotas for ${updatedEmp.name} (${updatedEmp.email})`,
          module: 'Employee Management',
          ip: '192.168.10.1',
          time: 'Just now'
        },
        ...prev.auditLogs
      ]
    }));
  };

  // Handle Employee Deletion (Admin/HR only)
  const handleDeleteEmployee = async (empId) => {
    const target = users.find((u) => u.id === empId);
    setUsers((prev) => prev.filter((u) => u.id !== empId));

    try {
      await api.deleteUser(empId);
    } catch (e) {
      console.warn('Backend user delete error:', e.message);
    }

    setData((prev) => ({
      ...prev,
      auditLogs: [
        {
          id: `AUD-${Math.floor(Math.random() * 9000) + 1000}`,
          user: currentUser ? currentUser.name : 'HR Administrator',
          action: `Deleted employee profile: ${target?.name || empId} (${target?.email || ''})`,
          module: 'Employee Management',
          ip: '192.168.10.1',
          time: 'Just now'
        },
        ...prev.auditLogs
      ]
    }));
  };

  // Handle Leave Submission (Live balance ledger update)
  const handleApplyLeave = async (newRequest) => {
    const requestWithUser = {
      ...newRequest,
      userId: currentUser.id,
      employee: currentUser.name,
      department: currentUser.department,
      team: currentUser.team
    };

    // Async sync to Laravel Database
    try {
      await api.applyLeave(requestWithUser);
    } catch (e) {
      console.warn('Backend apply leave error:', e.message);
    }

    setData((prev) => {
      const updatedRequests = [requestWithUser, ...prev.recentLeaveRequests];

      // Update user balances if annual or medical
      const updatedUsers = users.map((u) => {
        if (u.id === currentUser.id) {
          const typeLower = (newRequest.type || '').toLowerCase();
          let targetKey = null;
          if (typeLower.includes('annual') || typeLower.includes('vacation')) targetKey = 'annual';
          else if (typeLower.includes('medical') || typeLower.includes('sick')) targetKey = 'medical';
          else if (typeLower.includes('casual') || typeLower.includes('personal')) targetKey = 'casual';
          else if (typeLower.includes('emergency')) targetKey = 'emergency';
          else {
            targetKey = Object.keys(balances).find(k => typeLower.includes(k)) || 'annual';
          }

          if (balances[targetKey]) {
            const deduct = Number(newRequest.days) || 1;
            balances[targetKey] = {
              ...balances[targetKey],
              used: (balances[targetKey].used || 0) + deduct,
              remaining: Math.max(0, (balances[targetKey].remaining || 0) - deduct)
            };
          }
          const updatedUser = { ...u, leaveBalances: balances };
          setCurrentUser(updatedUser);
          try {
            localStorage.setItem('worksphere_session_user_v3', JSON.stringify(updatedUser));
          } catch (e) {}
          return updatedUser;
        }
        return u;
      });

      setUsers(updatedUsers);

      const newAudit = {
        id: `AUD-${Math.floor(Math.random() * 9000) + 1000}`,
        user: currentUser.name,
        action: `Submitted ${newRequest.type} (${newRequest.dates})`,
        module: 'Leave Engine',
        ip: '192.168.10.42',
        time: 'Just now'
      };

      // Trigger Browser Desktop Notification + Audio Chime + Floating Toast + Cross-tab broadcast
      dispatchAlert({
        type: 'leave',
        category: 'Leave Submitted',
        title: `Leave Application: ${requestWithUser.type}`,
        message: `${currentUser.name} applied for ${requestWithUser.dates} (${requestWithUser.days} day(s)). Sent for lead review.`
      });

      return {
        ...prev,
        recentLeaveRequests: updatedRequests,
        auditLogs: [newAudit, ...prev.auditLogs]
      };
    });
  };

  // Handle HR Request submission
  const handleRaiseRequest = async (newTicket) => {
    const ticketWithUser = {
      ...newTicket,
      userId: currentUser.id,
      employee: currentUser.name
    };

    try {
      await api.createTicket(ticketWithUser);
    } catch (e) {
      console.warn('Backend ticket create error:', e.message);
    }

    setData((prev) => ({
      ...prev,
      hrRequests: [ticketWithUser, ...prev.hrRequests],
      auditLogs: [
        {
          id: `AUD-${Math.floor(Math.random() * 9000) + 1000}`,
          user: currentUser.name,
          action: `Created HR Ticket: "${newTicket.subject}"`,
          module: 'HR Helpdesk',
          ip: '192.168.10.42',
          time: 'Just now'
        },
        ...prev.auditLogs
      ]
    }));
  };

  // Handle Request Approval
  const handleApproveRequest = async (id) => {
    try {
      await api.actionLeave(id, 'Approve', currentUser.name, '');
    } catch (e) {
      console.warn('Backend approve leave error:', e.message);
    }

    setData((prev) => {
      const updated = prev.recentLeaveRequests.map((req) => 
        req.id === id ? { ...req, status: 'Approved', approvalTier: 'Completed' } : req
      );
      const reqItem = prev.recentLeaveRequests.find((r) => r.id === id);

      dispatchAlert({
        type: 'leave',
        category: 'Leave Approved',
        title: `Leave Request Approved`,
        message: `Request for ${reqItem?.employee || 'Employee'} (${reqItem?.type || 'Leave'}) was approved.`
      });

      return {
        ...prev,
        recentLeaveRequests: updated,
        auditLogs: [
          {
            id: `AUD-${Math.floor(Math.random() * 9000) + 1000}`,
            user: currentUser.name,
            action: `Approved leave request ${id} (${reqItem?.employee})`,
            module: 'Leave Approvals',
            ip: '192.168.10.18',
            time: 'Just now'
          },
          ...prev.auditLogs
        ]
      };
    });
  };

  // Handle Request Rejection
  const handleRejectRequest = async (id) => {
    try {
      await api.actionLeave(id, 'Reject', currentUser.name, 'Operational workload demands');
    } catch (e) {
      console.warn('Backend reject leave error:', e.message);
    }

    setData((prev) => {
      const reqItem = prev.recentLeaveRequests.find((r) => r.id === id);
      const updated = prev.recentLeaveRequests.map((req) => 
        req.id === id ? { ...req, status: 'Rejected', approvalTier: 'Rejected' } : req
      );

      // Refund deducted balance
      if (reqItem && reqItem.userId) {
        const updatedUsers = users.map((u) => {
          if (u.id === reqItem.userId) {
            const balances = { ...(u.leaveBalances || {}) };
            const typeLower = (reqItem.type || '').toLowerCase();
            let targetKey = null;
            if (typeLower.includes('annual') || typeLower.includes('vacation')) targetKey = 'annual';
            else if (typeLower.includes('medical') || typeLower.includes('sick')) targetKey = 'medical';
            else if (typeLower.includes('casual') || typeLower.includes('personal')) targetKey = 'casual';
            else if (typeLower.includes('emergency')) targetKey = 'emergency';
            else {
              targetKey = Object.keys(balances).find(k => typeLower.includes(k)) || 'annual';
            }

            if (balances[targetKey]) {
              const refundDays = Number(reqItem.days) || 1;
              balances[targetKey] = {
                ...balances[targetKey],
                used: Math.max(0, (balances[targetKey].used || 0) - refundDays),
                remaining: (balances[targetKey].remaining || 0) + refundDays
              };
            }
            return { ...u, leaveBalances: balances };
          }
          return u;
        });
        setUsers(updatedUsers);
      }

      dispatchAlert({
        type: 'leave',
        category: 'Leave Rejected',
        title: `Leave Request Rejected`,
        message: `Request for ${reqItem?.employee || 'Employee'} was rejected. Balance refunded.`
      });

      return {
        ...prev,
        recentLeaveRequests: updated,
        auditLogs: [
          {
            id: `AUD-${Math.floor(Math.random() * 9000) + 1000}`,
            user: currentUser.name,
            action: `Rejected leave request ${id} (${reqItem?.employee})`,
            module: 'Leave Approvals',
            ip: '192.168.10.18',
            time: 'Just now'
          },
          ...prev.auditLogs
        ]
      };
    });
  };

  // Handle Policy save (Add New or Edit Existing with organization-wide employee quota sync)
  const handleSavePolicy = async (updatedPolicy) => {
    const rawDays = updatedPolicy.days || (updatedPolicy.entitlement ? parseInt(String(updatedPolicy.entitlement).replace(/\D+/g, '')) : 20) || 20;
    const days = Math.max(1, Number(rawDays));

    const rawId = (updatedPolicy.id || '').replace(/^pol-/, '').toLowerCase();
    const nameLower = (updatedPolicy.name || '').toLowerCase();
    let key = rawId;
    if (!key || key === 'new') {
      if (nameLower.includes('annual') || nameLower.includes('vacation')) key = 'annual';
      else if (nameLower.includes('medical') || nameLower.includes('sick')) key = 'medical';
      else if (nameLower.includes('casual') || nameLower.includes('personal')) key = 'casual';
      else if (nameLower.includes('emergency')) key = 'emergency';
      else key = nameLower.replace(/[^a-z0-9]/g, '_');
    }

    const policyToSave = {
      ...updatedPolicy,
      days: days,
      entitlement: `${days} days per annum`
    };

    // 1. Update policies list
    setPolicies((prev) => {
      const exists = prev.some((p) => p.id === policyToSave.id);
      if (exists) {
        return prev.map((p) => p.id === policyToSave.id ? policyToSave : p);
      }
      return [policyToSave, ...prev];
    });

    // 2. Synchronize leave balances for ALL users in real time across the portal
    setUsers((prevUsers) => {
      return prevUsers.map((u) => {
        const balances = { ...(u.leaveBalances || {}) };
        const current = balances[key] || { label: policyToSave.name, total: days, used: 0, remaining: days };
        const used = current.used || 0;
        balances[key] = {
          label: policyToSave.name,
          total: days,
          used: used,
          remaining: Math.max(0, days - used)
        };
        return { ...u, leaveBalances: balances };
      });
    });

    // 3. Update currently logged-in user immediately
    if (currentUser) {
      setCurrentUser((prevUser) => {
        if (!prevUser) return prevUser;
        const myBalances = { ...(prevUser.leaveBalances || {}) };
        const myCurrent = myBalances[key] || { label: policyToSave.name, total: days, used: 0, remaining: days };
        const myUsed = myCurrent.used || 0;
        const updatedMe = {
          ...prevUser,
          leaveBalances: {
            ...myBalances,
            [key]: {
              label: policyToSave.name,
              total: days,
              used: myUsed,
              remaining: Math.max(0, days - myUsed)
            }
          }
        };
        try {
          localStorage.setItem('worksphere_session_user_v3', JSON.stringify(updatedMe));
        } catch (e) {}
        return updatedMe;
      });
    }

    // 4. Instant notice announcement broadcast
    const autoAnn = {
      id: `ann-${Date.now()}`,
      title: `Policy Update: ${policyToSave.name} (${days} Days Allowed)`,
      content: `Administration has updated ${policyToSave.name} to ${days} allowed days per fiscal year. All employee quotas and available balances have been recalculated and synchronized.`,
      author: currentUser ? currentUser.name : 'HR Operations',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      target: 'All Employees',
      priority: 'Important'
    };
    setAnnouncements((prev) => [autoAnn, ...prev]);

    // 5. Trigger Real-time Browser Desktop Notification + Audio Chime + Floating Toast + Cross-tab broadcast
    dispatchAlert({
      type: 'policy',
      category: 'Policy Change Alert',
      title: `Policy Updated: ${policyToSave.name}`,
      message: `Admin updated ${policyToSave.name} to ${days} days per year. All employee quotas & balances synchronized.`
    });

    try {
      const res = await api.savePolicy(policyToSave);
      if (res && res.users && res.users.length > 0) {
        setUsers(res.users);
        if (currentUser) {
          const freshMe = res.users.find(u => String(u.id) === String(currentUser.id) || u.email === currentUser.email);
          if (freshMe) {
            setCurrentUser(freshMe);
            try {
              localStorage.setItem('worksphere_session_user_v3', JSON.stringify(freshMe));
            } catch (e) {}
          }
        }
      }
    } catch (e) {
      console.warn('Backend save policy error:', e.message);
    }

    setData((prev) => ({
      ...prev,
      auditLogs: [
        {
          id: `AUD-${Math.floor(Math.random() * 9000) + 1000}`,
          user: currentUser ? currentUser.name : 'HR Operations',
          action: `Updated allowed quota for policy "${policyToSave.name}" to ${days} days. Synchronized all employees.`,
          module: 'Leave Policy Engine',
          ip: '192.168.10.2',
          time: 'Just now'
        },
        ...prev.auditLogs
      ]
    }));
  };

  // Handle Policy deletion
  const handleDeletePolicy = async (policyId) => {
    const pol = policies.find((p) => p.id === policyId);
    setPolicies((prev) => prev.filter((p) => p.id !== policyId));

    try {
      await api.deletePolicy(policyId);
    } catch (e) {
      console.warn('Backend delete policy error:', e.message);
    }

    setData((prev) => ({
      ...prev,
      auditLogs: [
        {
          id: `AUD-${Math.floor(Math.random() * 9000) + 1000}`,
          user: currentUser ? currentUser.name : 'HR Operations',
          action: `Deleted leave policy: "${pol?.name || policyId}"`,
          module: 'Leave Policy Engine',
          ip: '192.168.10.2',
          time: 'Just now'
        },
        ...prev.auditLogs
      ]
    }));
  };

  const handleOpenPolicyModal = (policy = null) => {
    setSelectedPolicy(policy);
    setIsPolicyModalOpen(true);
  };

  // Handle Announcement broadcast (delivered to all accounts)
  const handleCreateAnnouncement = async (newAnn) => {
    const announcement = {
      id: `ann-${Date.now()}`,
      title: newAnn.title,
      target: newAnn.target || 'All Employees',
      priority: newAnn.priority || 'General',
      content: newAnn.content,
      author: currentUser ? currentUser.name : 'HR Operations',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    setAnnouncements((prev) => [announcement, ...prev]);

    // Trigger Browser Desktop Notification + Audio Chime + Floating Toast + Cross-tab broadcast
    dispatchAlert({
      type: 'announcement',
      category: 'Company Notice Broadcast',
      title: `Notice: ${announcement.title}`,
      message: announcement.content
    });

    try {
      await api.createAnnouncement(announcement);
    } catch (e) {
      console.warn('Backend create announcement error:', e.message);
    }

    setData((prev) => ({
      ...prev,
      auditLogs: [
        {
          id: `AUD-${Math.floor(Math.random() * 9000) + 1000}`,
          user: currentUser ? currentUser.name : 'HR Operations',
          action: `Broadcasted organization-wide announcement: "${announcement.title}"`,
          module: 'Announcements',
          ip: '192.168.10.2',
          time: 'Just now'
        },
        ...prev.auditLogs
      ]
    }));
  };

  // Handle Announcement deletion
  const handleDeleteAnnouncement = async (annId) => {
    const targetAnn = announcements.find((a) => a.id === annId);
    setAnnouncements((prev) => prev.filter((a) => a.id !== annId));

    try {
      await api.deleteAnnouncement(annId);
    } catch (e) {
      console.warn('Backend delete announcement error:', e.message);
    }

    setData((prev) => ({
      ...prev,
      auditLogs: [
        {
          id: `AUD-${Math.floor(Math.random() * 9000) + 1000}`,
          user: currentUser ? currentUser.name : 'HR Operations',
          action: `Removed broadcast announcement: "${targetAnn?.title || annId}"`,
          module: 'Announcements',
          ip: '192.168.10.2',
          time: 'Just now'
        },
        ...prev.auditLogs
      ]
    }));
  };

  // Handle HR Ticket status update
  const handleUpdateTicketStatus = async (ticketId, newStatus) => {
    try {
      await api.updateTicketStatus(ticketId, newStatus, currentUser.name);
    } catch (e) {
      console.warn('Backend update ticket status error:', e.message);
    }

    setData((prev) => ({
      ...prev,
      hrRequests: prev.hrRequests.map((t) => t.id === ticketId ? { ...t, status: newStatus } : t),
      auditLogs: [
        {
          id: `AUD-${Math.floor(Math.random() * 9000) + 1000}`,
          user: currentUser.name,
          action: `Updated HR ticket ${ticketId} status to "${newStatus}"`,
          module: 'HR Helpdesk',
          ip: '192.168.10.2',
          time: 'Just now'
        },
        ...prev.auditLogs
      ]
    }));
  };

  const openApplyLeaveModal = (isIntern = false) => {
    setIsInternModeForModal(isIntern);
    setIsApplyModalOpen(true);
  };

  // If not logged in, render real enterprise Login Page!
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} users={users} />;
  }

  const pendingLeavesCount = data.recentLeaveRequests.filter((r) => r.status === 'Pending').length;

  return (
    <div className="app-shell">
      {/* 1. Persistent Role-Aware Sidebar */}
      <Sidebar
        currentUser={currentUser}
        activePage={activePage}
        onSelectPage={setActivePage}
        pendingLeavesCount={pendingLeavesCount}
        onOpenProfileSettings={() => setActivePage('Profile Settings')}
      />

      {/* 2. Main Platform Work Area */}
      <div className="app-main">
        {/* Top App Bar with Sign Out */}
        <Header
          currentUser={currentUser}
          onLogout={handleLogout}
          activePage={activePage}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenProfileSettings={() => setActivePage('Profile Settings')}
          pendingCount={pendingLeavesCount}
          recentNotifications={recentNotifications}
          onTriggerTestNotif={() => dispatchAlert({
            type: 'system',
            category: 'System',
            title: 'Test Notification',
            message: 'Portal notifications are active and operating normally.'
          })}
        />

        {/* Dedicated Account & Profile Settings Page or Role Portals */}
        {activePage === 'Profile Settings' ? (
          <ProfileSettingsPage
            user={currentUser}
            onUpdateUser={handleUpdateProfile}
          />
        ) : (
          <>
            {/* Dedicated Persona Portals */}
            {(currentUser.roleKey === 'employee' || currentUser.roleKey === 'intern') && (
              <EmployeePortal
                profile={currentUser}
                leaveRequests={data.recentLeaveRequests}
                onApplyLeave={openApplyLeaveModal}
                onRaiseRequest={() => setIsRaiseModalOpen(true)}
                allEmployees={users}
                announcements={announcements}
                calendarEvents={data.calendarEvents}
                hrRequests={data.hrRequests.filter((t) => t.userId === currentUser.id || t.employee === currentUser.name)}
                activePage={activePage}
              />
            )}

            {currentUser.roleKey === 'team_lead' && (
              <TeamLeadPortal
                user={currentUser}
                teamMembers={users.filter((u) => u.team === currentUser.team || u.department === currentUser.department)}
                allEmployees={users}
                announcements={announcements}
                leaveRequests={data.recentLeaveRequests}
                onApproveRequest={handleApproveRequest}
                onRejectRequest={handleRejectRequest}
                activePage={activePage}
              />
            )}

            {currentUser.roleKey === 'department_head' && (
              <DepartmentHeadPortal
                user={currentUser}
                departmentOverview={[
                  { team: 'Frontend Team', lead: 'Sarah Ahmed', members: users.filter((u) => u.team === 'Frontend Team').length || 1, onLeave: 0, techStack: 'React / Next.js' },
                  { team: 'Backend Team', lead: 'Ahmed Raza', members: users.filter((u) => u.team === 'Backend Team').length || 1, onLeave: 0, techStack: 'Go / Node / PostgreSQL' }
                ]}
                leaveRequests={data.recentLeaveRequests}
                allEmployees={users}
                announcements={announcements}
                onApproveAll={() => {
                  data.recentLeaveRequests.forEach((r) => handleApproveRequest(r.id));
                }}
                onApproveRequest={handleApproveRequest}
                onRejectRequest={handleRejectRequest}
                activePage={activePage}
              />
            )}

            {(currentUser.roleKey === 'hr' || currentUser.roleKey === 'admin') && (
              <HrPortal
                user={currentUser}
                allEmployees={users}
                leavePolicies={policies}
                leaveRequests={data.recentLeaveRequests}
                hrRequests={data.hrRequests}
                announcements={announcements}
                auditLogs={data.auditLogs}
                onApproveRequest={handleApproveRequest}
                onRejectRequest={handleRejectRequest}
                onOpenPolicyModal={handleOpenPolicyModal}
                onDeletePolicy={handleDeletePolicy}
                onOpenCreateUserModal={() => setIsCreateUserOpen(true)}
                onUpdateTicketStatus={handleUpdateTicketStatus}
                onPostAnnouncement={handleCreateAnnouncement}
                onDeleteAnnouncement={handleDeleteAnnouncement}
                onUpdateEmployee={handleUpdateEmployee}
                onDeleteEmployee={handleDeleteEmployee}
                activePage={activePage}
              />
            )}
          </>
        )}
      </div>

      {/* Global Interactive Modals */}
      <CreateUserModal
        isOpen={isCreateUserOpen}
        onClose={() => setIsCreateUserOpen(false)}
        onCreateUser={handleCreateUser}
      />

      <ApplyLeaveModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSubmitLeave={handleApplyLeave}
        isInternMode={isInternModeForModal}
        policies={policies}
        user={currentUser}
      />

      <RaiseRequestModal
        isOpen={isRaiseModalOpen}
        onClose={() => setIsRaiseModalOpen(false)}
        onSubmitRequest={handleRaiseRequest}
      />

      <LeavePolicyModal
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
        policy={selectedPolicy}
        onSavePolicy={handleSavePolicy}
      />

      {/* Global Interactive Command & Spotlight Search Palette */}
      <SearchPaletteModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(page) => setActivePage(page)}
        users={users}
        policies={policies}
        onOpenApplyLeave={() => openApplyLeaveModal(false)}
        onOpenRaiseTicket={() => setIsRaiseModalOpen(true)}
        onOpenProfileSettings={() => setActivePage('Profile Settings')}
        onOpenAddPolicy={() => {
          setSelectedPolicy(null);
          setIsPolicyModalOpen(true);
        }}
        onOpenBroadcastNotice={() => setActivePage('Announcements')}
        currentUser={currentUser}
      />

      {/* Floating Modern AI Copilot Widget on the Right */}
      <AiCopilotWidget
        user={currentUser}
        policies={policies}
      />
    </div>
  );
}

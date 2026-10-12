import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  FileCheck,
  Code2,
  Video,
  FileText,
  Target,
  CalendarCheck,
  Sparkles,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';

function Sidebar({ collapsed, toggleSidebar, mobileOpen, closeMobile }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isStudent = user?.role === 'ROLE_STUDENT';
  const isAdmin = user?.role === 'ROLE_ADMIN';

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div className="brand-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="brand-icon">
            <Sparkles size={22} />
          </div>
          {!collapsed && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#4F46E5', letterSpacing: '-0.03em' }}>
                Campus<span style={{ color: '#8B5CF6' }}>Hire</span>
              </span>
              <span style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 600, letterSpacing: '0.05em' }}>
                CAREER PLATFORM
              </span>
            </div>
          )}
        </div>
        <button
          className="icon-btn"
          onClick={toggleSidebar}
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          style={{ width: '32px', height: '32px' }}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="sidebar-nav">
        {isStudent && (
          <>
            <NavLink to="/student/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={closeMobile}>
              <LayoutDashboard size={20} />
              {!collapsed && <span>Dashboard</span>}
            </NavLink>

            <NavLink to="/student/companies" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={closeMobile}>
              <Building2 size={20} />
              {!collapsed && <span>Companies</span>}
            </NavLink>

            <NavLink to="/student/jobs" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={closeMobile}>
              <Briefcase size={20} />
              {!collapsed && <span>Placement Drives</span>}
            </NavLink>

            <NavLink to="/student/applications" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={closeMobile}>
              <FileCheck size={20} />
              {!collapsed && <span>My Applications</span>}
            </NavLink>

            <NavLink to="/student/practice" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={closeMobile}>
              <Code2 size={20} />
              {!collapsed && <span>Practice Zone</span>}
            </NavLink>

            <NavLink to="/student/notifications" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={closeMobile}>
              <Bell size={20} />
              {!collapsed && <span>Notifications</span>}
            </NavLink>

            <NavLink to="/student/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={closeMobile}>
              <User size={20} />
              {!collapsed && <span>My Profile</span>}
            </NavLink>
          </>
        )}

        {isAdmin && (
          <>
            <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={closeMobile}>
              <LayoutDashboard size={20} />
              {!collapsed && <span>Dashboard</span>}
            </NavLink>

            <NavLink to="/admin/students" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={closeMobile}>
              <User size={20} />
              {!collapsed && <span>Students</span>}
            </NavLink>

            <NavLink to="/admin/companies" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={closeMobile}>
              <Building2 size={20} />
              {!collapsed && <span>Companies</span>}
            </NavLink>

            <NavLink to="/admin/drives" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={closeMobile}>
              <Briefcase size={20} />
              {!collapsed && <span>Placement Drives</span>}
            </NavLink>

            <NavLink to="/admin/applications" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={closeMobile}>
              <FileCheck size={20} />
              {!collapsed && <span>Applications</span>}
            </NavLink>

            <NavLink to="/admin/questions" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={closeMobile}>
              <Code2 size={20} />
              {!collapsed && <span>Practice Questions</span>}
            </NavLink>

            <NavLink to="/admin/mock-tests" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={closeMobile}>
              <Target size={20} />
              {!collapsed && <span>Mock Tests</span>}
            </NavLink>

            <NavLink to="/admin/notifications" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={closeMobile}>
              <Bell size={20} />
              {!collapsed && <span>Notifications</span>}
            </NavLink>

            <NavLink to="/admin/reports" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={closeMobile}>
              <FileText size={20} />
              {!collapsed && <span>Reports</span>}
            </NavLink>
          </>
        )}
      </div>

      <div style={{ padding: '16px', borderTop: '1px solid #E5E7EB' }}>
        <button
          onClick={handleLogout}
          className="nav-item"
          style={{ width: '100%', border: 'none', background: 'transparent', color: '#EF4444' }}
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

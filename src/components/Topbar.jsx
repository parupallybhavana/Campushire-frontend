import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { Search, Bell, User, LogOut, ChevronDown, Menu } from 'lucide-react';

function Topbar({ toggleMobileSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [unreadCount, setUnreadCount] = useState(2);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user && user.role === 'ROLE_STUDENT') {
      axiosInstance.get('/notifications')
        .then(res => {
          if (res.data && res.data.unreadCount !== undefined) {
            setUnreadCount(res.data.unreadCount);
          }
        })
        .catch(() => {});
    }
  }, [user, location.pathname]);

  const getBreadcrumbTitle = () => {
    const path = location.pathname;
    if (path.includes('/student/dashboard')) return 'Student Dashboard';
    if (path.includes('/student/companies')) return 'Explore Companies';
    if (path.includes('/student/jobs')) return 'Placement Drives';
    if (path.includes('/student/applications')) return 'My Applications';
    if (path.includes('/student/notifications')) return 'Notifications';
    if (path.includes('/student/practice')) return 'Practice Zone';
    if (path.includes('/student/mock-interviews')) return 'Mock Interviews';
    if (path.includes('/student/resume')) return 'Resume Analyzer';
    if (path.includes('/student/skill-gap')) return 'Skill Gap Analyzer';
    if (path.includes('/student/study-plan')) return 'Personalized Study Planner';
    if (path.includes('/student/ai-assistant')) return 'AI Placement Assistant';
    if (path.includes('/student/profile')) return 'My Student Profile';
    if (path.includes('/admin/dashboard')) return 'Admin Overview Dashboard';
    if (path.includes('/admin/companies')) return 'Manage Companies';
    if (path.includes('/admin/drives')) return 'Manage Placement Drives';
    if (path.includes('/admin/applications')) return 'Manage Applications';
    return 'CampusHire Hub';
  };

  const handleGlobalSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/student/companies?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'CH';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="icon-btn mobile-menu-toggle"
          type="button"
          onClick={toggleMobileSidebar}
          aria-label="Open navigation menu"
          aria-expanded={undefined}
        >
          <Menu size={21} />
        </button>
        <div className="breadcrumbs">
          <span style={{ fontWeight: 600, color: '#94A3B8' }}>CampusHire</span>
          <span>/</span>
          <span style={{ fontWeight: 700, color: '#1E293B' }}>{getBreadcrumbTitle()}</span>
        </div>
      </div>

      <div className="search-bar">
        <Search size={18} style={{ color: '#94A3B8' }} />
        <input
          type="text"
          placeholder="Search companies, placement drives, coding topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleGlobalSearch}
        />
      </div>

      <div className="topbar-right">
        {/* Notification Bell Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className="icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="dot" />}
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '50px',
              width: '320px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
              border: '1px solid #E5E7EB',
              padding: '16px',
              zIndex: 200
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Recent Notifications</h4>
                <button
                  type="button"
                  className="notification-view-all"
                  onClick={() => { setShowNotifications(false); navigate(user?.role === 'ROLE_ADMIN' ? '/admin/notifications' : '/student/notifications'); }}
                >
                  View All
                </button>
              </div>
              <p style={{ margin: 0, color: '#64748B', fontSize: '0.85rem' }}>
                {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}.` : 'You’re all caught up.'}
              </p>
              <button
                type="button"
                className="btn btn-primary notification-open-all"
                onClick={() => { setShowNotifications(false); navigate(user?.role === 'ROLE_ADMIN' ? '/admin/notifications' : '/student/notifications'); }}
              >
                Open notifications
              </button>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div style={{ position: 'relative' }}>
          <div
            className="user-profile-menu"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="avatar">{initials}</div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B', lineHeight: 1.2 }}>
                {user?.name || 'User'}
              </span>
              <span style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 600 }}>
                {user?.role === 'ROLE_ADMIN' ? 'Placement Admin' : 'Student'}
              </span>
            </div>
            <ChevronDown size={16} style={{ color: '#94A3B8' }} />
          </div>

          {showProfileMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '55px',
              width: '200px',
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
              border: '1px solid #E5E7EB',
              padding: '8px 0',
              zIndex: 200
            }}>
              <div
                style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}
                onClick={() => { setShowProfileMenu(false); navigate(user?.role === 'ROLE_ADMIN' ? '/admin/dashboard' : '/student/profile'); }}
              >
                <User size={16} /> Profile Settings
              </div>
              <div
                style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', color: '#EF4444' }}
                onClick={() => { setShowProfileMenu(false); logout(); navigate('/login'); }}
              >
                <LogOut size={16} /> Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;

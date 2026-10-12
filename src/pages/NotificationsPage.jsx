import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import axiosInstance from '../api/axiosInstance';
import { Bell, CheckCheck, Briefcase, Award, AlertCircle } from 'lucide-react';

const TYPE_ICONS = {
  DRIVE_UPDATE: <Briefcase size={18} />,
  ASSESSMENT: <Award size={18} />,
  ANNOUNCEMENT: <Bell size={18} />,
  APPLICATION_STATUS: <CheckCheck size={18} />,
};

const TYPE_COLORS = {
  DRIVE_UPDATE: { bg: '#EEF2FF', color: '#4F46E5' },
  ASSESSMENT: { bg: '#FEF3C7', color: '#D97706' },
  ANNOUNCEMENT: { bg: '#F3E8FF', color: '#8B5CF6' },
  APPLICATION_STATUS: { bg: '#DEF7EC', color: '#10B981' },
};

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/notifications');
      const notifs = res.data.notifications || res.data || [];
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.isRead).length);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await axiosInstance.put('/notifications/read-all');
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const markOneRead = async (id) => {
    try {
      await axiosInstance.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {}
  };

  return (
    <AppLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bell color="var(--primary)" size={26} /> Notification Center
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Real-time updates on placement drives, application status changes, and admin announcements.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {unreadCount > 0 && (
            <span className="badge badge-rejected">{unreadCount} Unread</span>
          )}
          <button className="btn btn-outline btn-sm" onClick={markAllRead}>
            <CheckCheck size={15} style={{ marginRight: '4px' }} /> Mark All Read
          </button>
        </div>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : notifications.length > 0 ? (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {notifications.map((n, idx) => {
            const type = n.type || 'ANNOUNCEMENT';
            const colors = TYPE_COLORS[type] || TYPE_COLORS.ANNOUNCEMENT;
            return (
              <div
                key={n.id || idx}
                style={{
                  padding: '18px 24px',
                  borderBottom: idx < notifications.length - 1 ? '1px solid var(--border-color)' : 'none',
                  backgroundColor: n.isRead ? '#FFFFFF' : '#EEF2FF',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  cursor: !n.isRead ? 'pointer' : 'default',
                  transition: 'background 0.15s'
                }}
                onClick={() => !n.isRead && markOneRead(n.id)}
              >
                {/* Icon */}
                <div style={{
                  width: '42px', height: '42px', borderRadius: '12px', flexShrink: 0,
                  background: colors.bg, color: colors.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {TYPE_ICONS[type] || <Bell size={18} />}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                      {n.title}
                    </h4>
                    {!n.isRead && (
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />
                    )}
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '2px 0 0 0', lineHeight: 1.5 }}>
                    {n.message}
                  </p>
                </div>

                {/* Time */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    }) : 'Today'}
                  </div>
                  <span className="badge badge-tag" style={{ marginTop: '4px', fontSize: '0.7rem' }}>
                    {type.replace('_', ' ')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Bell size={48} style={{ margin: '0 auto 16px auto', opacity: 0.4 }} />
          <h3 style={{ fontWeight: 800 }}>All Caught Up! 🎉</h3>
          <p style={{ fontSize: '0.9rem' }}>No new notifications at this time. Check back after applying to placement drives.</p>
        </div>
      )}
    </AppLayout>
  );
}

export default NotificationsPage;

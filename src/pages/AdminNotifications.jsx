import React, { useState } from 'react';
import AppLayout from '../components/AppLayout';
import axiosInstance from '../api/axiosInstance';
import { Bell, Send, CheckCircle2, AlertCircle } from 'lucide-react';

function AdminNotifications() {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'ANNOUNCEMENT',
    linkUrl: '/student/dashboard'
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setStatus(null);
      const res = await axiosInstance.post('/admin/notifications/broadcast', formData);
      setStatus({ success: true, message: res.data?.message || 'Broadcast notification sent successfully to all students!' });
      setFormData({
        title: '',
        message: '',
        type: 'ANNOUNCEMENT',
        linkUrl: '/student/dashboard'
      });
    } catch (err) {
      console.error('Broadcast failed:', err);
      setStatus({ success: false, message: 'Failed to send broadcast. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div style={{ maxWidth: '750px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>Broadcast Notifications</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Send real-time alerts and placement announcements to all registered students.
          </p>
        </div>

        {status && (
          <div className="card" style={{
            padding: '16px',
            marginBottom: '20px',
            background: status.success ? '#DEF7EC' : '#FDE8E8',
            color: status.success ? '#03543F' : '#9B1C1C',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            {status.success ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span style={{ fontWeight: 600 }}>{status.message}</span>
          </div>
        )}

        <div className="card" style={{ padding: '32px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label className="form-label">Notification Title *</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g., Google Cloud Drive Application Deadline Extended"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">Notification Category</label>
              <select
                className="form-control"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="ANNOUNCEMENT">ANNOUNCEMENT (General Updates)</option>
                <option value="DRIVE_UPDATE">DRIVE_UPDATE (Placement Drive Alerts)</option>
                <option value="ASSESSMENT">ASSESSMENT (Mock Test & Exam Alerts)</option>
              </select>
            </div>

            <div>
              <label className="form-label">Detailed Message *</label>
              <textarea
                rows="4"
                required
                className="form-control"
                placeholder="Type the message body that students will see in their notification center..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">Target Page Link (Optional)</label>
              <input
                type="text"
                className="form-control"
                placeholder="/student/jobs"
                value={formData.linkUrl}
                onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
              />
            </div>

            <div style={{ textAlign: 'right', marginTop: '10px' }}>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '12px 24px' }}>
                <Send size={18} style={{ marginRight: '8px' }} />
                {loading ? 'Sending Broadcast...' : 'Broadcast to All Students'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

export default AdminNotifications;

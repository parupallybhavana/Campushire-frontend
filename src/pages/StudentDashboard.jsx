import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Briefcase,
  FileCheck,
  Calendar,
  CheckCircle2,
  Award,
  Sparkles,
  ArrowRight,
  Clock,
  TrendingUp,
  X,
  Code2,
  BookOpen,
  Target
} from 'lucide-react';

function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [showLiveNotification, setShowLiveNotification] = useState(true);

  useEffect(() => {
    fetchDashboardSummary();
  }, []);

  const fetchDashboardSummary = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/students/dashboard-summary');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load dashboard summary:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="spinner" />
      </AppLayout>
    );
  }

  const studentName = data?.studentName || user?.name || 'Student';

  return (
    <AppLayout>
      {/* Live Activity Notification Banner (Inspired by Intervie live card) */}
      {showLiveNotification && (
        <div className="card" style={{
          background: 'linear-gradient(135deg, #4F46E5 0%, #8B5CF6 100%)',
          color: '#FFFFFF',
          marginBottom: '24px',
          padding: '16px 24px',
          position: 'relative'
        }}>
          <button
            onClick={() => setShowLiveNotification(false)}
            style={{ position: 'absolute', right: '16px', top: '16px', background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>🔥 Drive Deadline Alert: Google Cloud SDE-1</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                Check your eligibility and submit your application before the deadline in 12 days.
              </div>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              style={{ marginLeft: 'auto', background: '#FFFFFF', color: '#4F46E5', fontWeight: 700, border: 'none' }}
              onClick={() => navigate('/student/jobs')}
            >
              Apply Now
            </button>
          </div>
        </div>
      )}

      {/* Dashboard Greeting Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', color: 'var(--text-main)', fontWeight: 800 }}>
          Welcome back, {studentName}! 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
          Your placement dashboard. Track live drives, application statuses, and interview readiness.
        </p>
      </div>

      {/* 6 Core Statistics Cards */}
      <div className="grid-3" style={{ marginBottom: '28px' }}>
        <div className="stat-card" onClick={() => navigate('/student/jobs')} style={{ cursor: 'pointer' }}>
          <div>
            <span className="stat-label">Available Placement Drives</span>
            <div className="stat-number">{data?.availableDrivesCount ?? 0}</div>
          </div>
          <div className="stat-icon indigo"><Briefcase size={24} /></div>
        </div>

        <div className="stat-card" onClick={() => navigate('/student/applications')} style={{ cursor: 'pointer' }}>
          <div>
            <span className="stat-label">Total Applications</span>
            <div className="stat-number">{data?.totalApplicationsCount ?? 0}</div>
          </div>
          <div className="stat-icon violet"><FileCheck size={24} /></div>
        </div>

        <div className="stat-card" onClick={() => navigate('/student/applications')} style={{ cursor: 'pointer' }}>
          <div>
            <span className="stat-label">Shortlisted Applications</span>
            <div className="stat-number" style={{ color: 'var(--success)' }}>{data?.shortlistedApplicationsCount ?? 0}</div>
          </div>
          <div className="stat-icon green"><CheckCircle2 size={24} /></div>
        </div>

        <div className="stat-card" onClick={() => navigate('/student/practice/mock-test')} style={{ cursor: 'pointer' }}>
          <div>
            <span className="stat-label">Latest Mock Test Score</span>
            <div className="stat-number" style={{ color: 'var(--primary)' }}>
              {data?.latestMockTestScore ? `${data.latestMockTestScore}%` : 'N/A'}
            </div>
          </div>
          <div className="stat-icon blue"><Award size={24} /></div>
        </div>

        <div className="stat-card" onClick={() => navigate('/student/companies')} style={{ cursor: 'pointer' }}>
          <div>
            <span className="stat-label">Eligible Companies</span>
            <div className="stat-number">{data?.eligibleCompaniesCount ?? 0}</div>
          </div>
          <div className="stat-icon amber"><Building2 size={24} /></div>
        </div>

        <div className="stat-card" onClick={() => navigate('/student/practice')} style={{ cursor: 'pointer' }}>
          <div>
            <span className="stat-label">Practice Solved</span>
            <div className="stat-number">{data?.practiceTestsCompleted ?? 0}</div>
          </div>
          <div className="stat-icon violet"><Code2 size={24} /></div>
        </div>
      </div>

      {/* Grid: Upcoming Deadlines & Recent Notifications */}
      <div className="grid-2" style={{ marginBottom: '30px' }}>
        {/* Upcoming Application Deadlines */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Clock size={20} style={{ color: 'var(--primary)' }} /> Upcoming Drive Deadlines
            </h3>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/student/jobs')}>View All Drives</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {data?.upcomingDeadlines && data.upcomingDeadlines.length > 0 ? (
              data.upcomingDeadlines.map(d => (
                <div key={d.id} style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#FAFAFD'
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{d.title}</div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      {d.companyName} • Package: {d.salaryCtc || 'Standard'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-applied" style={{ fontSize: '0.75rem' }}>
                      <Calendar size={12} style={{ marginRight: '4px' }} />
                      {d.deadline ? new Date(d.deadline).toLocaleDateString() : 'Active'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state" style={{ padding: '24px 0' }}>
                <p>No upcoming application deadlines.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Sparkles size={20} style={{ color: 'var(--purple)' }} /> Recent Notifications
            </h3>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/student/notifications')}>View All</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data?.recentNotifications && data.recentNotifications.length > 0 ? (
              data.recentNotifications.map(n => (
                <div key={n.id} style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: n.isRead ? '#FFFFFF' : '#EEF2FF',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start'
                }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: n.isRead ? 'var(--text-muted)' : 'var(--primary)', marginTop: '6px' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{n.title}</div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{n.message}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state" style={{ padding: '24px 0' }}>
                <p>No new notifications yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Application Tracker Timeline */}
      <div className="card" style={{ marginBottom: '30px' }}>
        <div className="card-header">
          <h3 className="card-title">
            <FileCheck size={20} style={{ color: '#4F46E5' }} /> Application Status Tracker
          </h3>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/student/applications')}>Track History</button>
        </div>

        {data?.applicationTracker && data.applicationTracker.length > 0 ? (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Company & Position</th>
                  <th>Applied Date</th>
                  <th>Current Stage</th>
                  <th>Action Needed</th>
                </tr>
              </thead>
              <tbody>
                {data.applicationTracker.map(app => (
                  <tr key={app.id}>
                    <td style={{ fontWeight: 700 }}>
                      {app.companyName} - {app.driveTitle}
                    </td>
                    <td style={{ color: '#64748B' }}>
                      {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : 'Recent'}
                    </td>
                    <td>
                      <span className={`badge badge-${app.status.toLowerCase()}`}>
                        {app.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => navigate('/student/applications')}>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <h4>No active applications yet.</h4>
            <p>Explore companies and apply for eligible placement drives to track your application timeline here.</p>
            <button className="btn btn-primary btn-sm" style={{ marginTop: '14px' }} onClick={() => navigate('/student/jobs')}>
              Explore Opportunities
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default StudentDashboard;

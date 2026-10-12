import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import axiosInstance from '../api/axiosInstance';
import { FileCheck, Building2, CheckCircle2, XCircle, Clock, ArrowRight, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STATUS_STAGES = [
  'APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'ASSESSMENT',
  'INTERVIEW', 'SELECTED', 'REJECTED'
];

const STAGE_LABELS = {
  'APPLIED': 'Applied',
  'UNDER_REVIEW': 'Under Review',
  'SHORTLISTED': 'Shortlisted',
  'ASSESSMENT': 'Assessment',
  'INTERVIEW': 'Interview',
  'SELECTED': 'Selected',
  'REJECTED': 'Rejected'
};

const getBadgeClass = (status) => {
  switch (status?.toUpperCase()) {
    case 'APPLIED': return 'badge-applied';
    case 'UNDER_REVIEW': return 'badge-applied';
    case 'SHORTLISTED': return 'badge-shortlisted';
    case 'ASSESSMENT': return 'badge-shortlisted';
    case 'INTERVIEW': return 'badge-interview';
    case 'SELECTED': return 'badge-selected';
    case 'REJECTED': return 'badge-rejected';
    default: return 'badge-applied';
  }
};

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/applications/my');
      setApplications(res.data || []);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === 'ALL' ? applications
    : applications.filter(a => a.status?.toUpperCase() === filter);

  // Stats
  const stats = {
    total: applications.length,
    shortlisted: applications.filter(a => ['SHORTLISTED', 'ASSESSMENT', 'INTERVIEW', 'SELECTED'].includes(a.status)).length,
    selected: applications.filter(a => a.status === 'SELECTED').length,
    rejected: applications.filter(a => a.status === 'REJECTED').length,
  };

  return (
    <AppLayout>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>My Applications</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Track real-time recruitment progress across all applied placement drives.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/student/jobs')}>
          <Briefcase size={16} style={{ marginRight: '6px' }} /> Apply to New Drives
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid-3" style={{ gap: '16px', marginBottom: '24px' }}>
        <div className="stat-card">
          <div>
            <span className="stat-label">Total Applied</span>
            <div className="stat-number">{stats.total}</div>
          </div>
          <div className="stat-icon indigo"><FileCheck size={24} /></div>
        </div>
        <div className="stat-card">
          <div>
            <span className="stat-label">Shortlisted / In Process</span>
            <div className="stat-number" style={{ color: 'var(--success)' }}>{stats.shortlisted}</div>
          </div>
          <div className="stat-icon green"><CheckCircle2 size={24} /></div>
        </div>
        <div className="stat-card">
          <div>
            <span className="stat-label">Selected</span>
            <div className="stat-number" style={{ color: 'var(--primary)' }}>{stats.selected}</div>
          </div>
          <div className="stat-icon violet"><CheckCircle2 size={24} /></div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {['ALL', 'APPLIED', 'SHORTLISTED', 'ASSESSMENT', 'INTERVIEW', 'SELECTED', 'REJECTED'].map(s => (
          <button
            key={s}
            className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: '20px' }}
            onClick={() => setFilter(s)}
          >
            {s === 'ALL' ? 'All Applications' : STAGE_LABELS[s] || s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="spinner" />
      ) : filtered.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map((app) => {
            const isRejected = app.status === 'REJECTED';
            const isSelected = app.status === 'SELECTED';
            const currentStageIdx = STATUS_STAGES.indexOf(app.status);

            return (
              <div key={app.id} className="card" style={{ padding: '24px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '12px',
                      background: 'linear-gradient(135deg, var(--primary) 0%, var(--purple) 100%)',
                      color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '1.2rem'
                    }}>
                      {(app.companyName || app.placementDrive?.companyName || 'C').charAt(0)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                        {app.driveTitle || app.placementDrive?.title}
                      </h3>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        {app.companyName || app.placementDrive?.companyName} •
                        Applied: {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : 'Recently'}
                      </div>
                    </div>
                  </div>
                  <span className={`badge ${getBadgeClass(app.status)}`} style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                    {STAGE_LABELS[app.status] || app.status}
                  </span>
                </div>

                {/* Stage Progress Bar (not shown for rejected) */}
                {!isRejected && (
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center', marginBottom: '16px' }}>
                    {STATUS_STAGES.filter(s => s !== 'REJECTED').map((stage, i) => {
                      const stageIdx = STATUS_STAGES.indexOf(stage);
                      const done = currentStageIdx >= stageIdx;
                      const active = currentStageIdx === stageIdx;
                      return (
                        <React.Fragment key={stage}>
                          <div style={{
                            flex: 1, height: '6px', borderRadius: '4px',
                            background: done ? 'var(--primary)' : 'var(--border-color)',
                            transition: 'background 0.3s ease'
                          }} />
                          {i < STATUS_STAGES.filter(s => s !== 'REJECTED').length - 1 && (
                            <div style={{
                              width: '8px', height: '8px', borderRadius: '50%',
                              background: done ? 'var(--primary)' : 'var(--border-color)',
                              flexShrink: 0
                            }} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                )}

                {/* Stage Labels */}
                {!isRejected && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    {['Applied', 'Review', 'Shortlisted', 'Assessment', 'Interview', 'Selected'].map(l => (
                      <span key={l}>{l}</span>
                    ))}
                  </div>
                )}

                {isSelected && (
                  <div style={{ padding: '10px 14px', background: '#DEF7EC', border: '1px solid #BBF7D0', borderRadius: '8px', color: '#03543F', fontSize: '0.875rem', fontWeight: 600 }}>
                    🎉 Congratulations! You have been selected for this position.
                  </div>
                )}

                {isRejected && (
                  <div style={{ padding: '10px 14px', background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '8px', color: '#9B1C1C', fontSize: '0.875rem', fontWeight: 600 }}>
                    Application not progressed for this drive. Keep applying and practicing!
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : applications.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <FileCheck size={48} style={{ margin: '0 auto 16px auto', opacity: 0.4 }} />
          <h3 style={{ fontWeight: 800, marginBottom: '8px' }}>No Applications Yet</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '20px' }}>
            Browse active placement drives and apply to positions you're eligible for.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/student/jobs')}>
            Explore Placement Drives <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No applications found for the selected filter.
        </div>
      )}
    </AppLayout>
  );
};

export default MyApplications;

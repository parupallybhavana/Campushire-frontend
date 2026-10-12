import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import AppLayout from '../components/AppLayout';
import { 
  Building2, 
  Briefcase, 
  FileCheck, 
  Users, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminMetrics();
  }, []);

  const fetchAdminMetrics = async () => {
    setLoading(true);
    try {
      const [compRes, driveRes, appRes] = await Promise.all([
        axiosInstance.get('/admin/companies'),
        axiosInstance.get('/admin/drives'),
        axiosInstance.get('/admin/applications')
      ]);

      setCompanies(compRes.data);
      setDrives(driveRes.data);
      setApplications(appRes.data);
    } catch (err) {
      console.error('Failed to load admin metrics:', err);
      setError('Could not load administrative data from backend server.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="spinner" style={{ margin: '100px auto' }} />
      </AppLayout>
    );
  }

  const selectedCount = applications.filter(a => a.status === 'SELECTED').length;

  return (
    <AppLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {/* Admin Header */}
        <div className="glass-panel" style={{ padding: '28px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="badge badge-shortlisted" style={{ marginBottom: '8px' }}>
                <ShieldCheck size={14} /> Placement Administrator Portal
              </span>
              <h1 style={{ fontSize: '2rem' }}>Placement Management Overview</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
                Centralized control center for corporate partners, recruitment drives, and student selections
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} /> <span>{error}</span>
          </div>
        )}

        {/* Metrics Row */}
        <div className="grid-dashboard">
          <div className="glass-panel" style={{ padding: '20px', borderTop: '3px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Partner Companies</p>
                <h2 style={{ fontSize: '1.8rem', marginTop: '4px' }}>{companies.length}</h2>
              </div>
              <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.15)', borderRadius: '12px', color: 'var(--primary)' }}>
                <Building2 size={24} />
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px', borderTop: '3px solid var(--cyan)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Active Job Drives</p>
                <h2 style={{ fontSize: '1.8rem', marginTop: '4px', color: 'var(--cyan)' }}>{drives.length}</h2>
              </div>
              <div style={{ padding: '10px', background: 'rgba(6, 182, 212, 0.15)', borderRadius: '12px', color: 'var(--cyan)' }}>
                <Briefcase size={24} />
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px', borderTop: '3px solid var(--purple)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Applications</p>
                <h2 style={{ fontSize: '1.8rem', marginTop: '4px', color: 'var(--purple)' }}>{applications.length}</h2>
              </div>
              <div style={{ padding: '10px', background: 'rgba(139, 92, 246, 0.15)', borderRadius: '12px', color: 'var(--purple)' }}>
                <FileCheck size={24} />
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px', borderTop: '3px solid #10B981' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Students Placed</p>
                <h2 style={{ fontSize: '1.8rem', marginTop: '4px', color: '#10B981' }}>{selectedCount}</h2>
              </div>
              <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '12px', color: '#10B981' }}>
                <CheckCircle2 size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Admin Action Cards Grid */}
        <h2 style={{ fontSize: '1.3rem', marginTop: '10px' }}>Administrative Portals</h2>
        
        <div className="grid-cards">
          <Link to="/admin/companies" className="glass-panel glass-panel-hover" style={{ padding: '24px', textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ background: 'rgba(59, 130, 246, 0.15)', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '14px' }}>
                <Building2 size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '6px', color: 'var(--text-main)' }}>Manage Companies</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '16px' }}>
                Register and configure visiting corporate entities.
              </p>
            </div>
            <span className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', alignSelf: 'flex-start' }}>
              Manage Companies <ArrowRight size={14} />
            </span>
          </Link>

          <Link to="/admin/drives" className="glass-panel glass-panel-hover" style={{ padding: '24px', textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ background: 'rgba(6, 182, 212, 0.15)', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cyan)', marginBottom: '14px' }}>
                <Briefcase size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '6px', color: 'var(--text-main)' }}>Manage Placement Drives</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '16px' }}>
                Publish new recruitment drives and eligibility criteria.
              </p>
            </div>
            <span className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', alignSelf: 'flex-start' }}>
              Manage Drives <ArrowRight size={14} />
            </span>
          </Link>

          <Link to="/admin/applications" className="glass-panel glass-panel-hover" style={{ padding: '24px', textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ background: 'rgba(139, 92, 246, 0.15)', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--purple)', marginBottom: '14px' }}>
                <FileCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '6px', color: 'var(--text-main)' }}>Student Applications</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '16px' }}>
                Review student applications and update recruitment stages.
              </p>
            </div>
            <span className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', alignSelf: 'flex-start' }}>
              Review Applications <ArrowRight size={14} />
            </span>
          </Link>
        </div>

        {/* 1. SEPARATED SECTION: Partner Companies in Square Boxes */}
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Building2 color="var(--primary)" size={24} /> Partner Companies ({companies.length})
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Active corporate recruiting partners configured in the platform
              </p>
            </div>
            <Link to="/admin/companies" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              View All Companies <ArrowRight size={14} />
            </Link>
          </div>

          {companies.length === 0 ? (
            <div className="glass-panel" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Building2 size={36} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
              <p>No partner companies added yet. Click Manage Companies to add one.</p>
            </div>
          ) : (
            <div className="grid-cards">
              {companies.slice(0, 4).map((comp) => (
                <div key={comp.id} className="square-card" style={{ padding: '22px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--purple) 100%)',
                        color: '#FFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1.2rem',
                        flexShrink: 0
                      }}>
                        {comp.name ? comp.name.charAt(0) : 'C'}
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{comp.name}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{comp.location || 'Corporate Partner'}</span>
                      </div>
                    </div>

                    <p style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.85rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      marginBottom: '14px'
                    }}>
                      {comp.description || 'Verified campus placement partner.'}
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-tag" style={{ color: 'var(--primary)' }}>
                      Partner
                    </span>
                    <Link to="/admin/companies" className="btn btn-secondary btn-sm" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
                      Manage
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. SEPARATED SECTION: Placement Drives in Square Boxes */}
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Briefcase color="var(--cyan)" size={24} /> Active Placement Drives ({drives.length})
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Campus recruitment drives published for students
              </p>
            </div>
            <Link to="/admin/drives" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              View All Drives <ArrowRight size={14} />
            </Link>
          </div>

          {drives.length === 0 ? (
            <div className="glass-panel" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Briefcase size={36} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
              <p>No active placement drives announced. Click Manage Drives to create one.</p>
            </div>
          ) : (
            <div className="grid-cards">
              {drives.slice(0, 4).map((drive) => (
                <div key={drive.id} className="square-card" style={{ padding: '22px' }}>
                  <div>
                    <span className="badge badge-tag" style={{ color: 'var(--primary)', marginBottom: '8px', display: 'inline-flex' }}>
                      <Building2 size={12} style={{ marginRight: '4px' }} /> {drive.companyName || 'Company'}
                    </span>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {drive.title}
                    </h4>

                    <p style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.85rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      marginBottom: '14px'
                    }}>
                      {drive.description || 'Campus hiring drive open for eligible students.'}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <div>Min CGPA: <strong style={{ color: 'var(--text-main)' }}>{drive.minCgpa !== null ? drive.minCgpa : 'None'}</strong></div>
                      <div>Deadline: <strong style={{ color: 'var(--text-main)' }}>{drive.deadline || 'Open'}</strong></div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-selected" style={{ fontSize: '0.725rem' }}>
                      Active
                    </span>
                    <Link to="/admin/drives" className="btn btn-secondary btn-sm" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
                      Edit / View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;

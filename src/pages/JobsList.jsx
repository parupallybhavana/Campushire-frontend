import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import axiosInstance from '../api/axiosInstance';
import {
  Briefcase, Building2, MapPin, Award, Calendar,
  CheckCircle2, XCircle, Search, Clock
} from 'lucide-react';

const JobsList = () => {
  const [drives, setDrives] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [actionMsg, setActionMsg] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyEligible, setOnlyEligible] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [drivesRes, appsRes, profileRes] = await Promise.all([
        axiosInstance.get('/jobs'),
        axiosInstance.get('/applications/my'),
        axiosInstance.get('/students/profile')
      ]);
      setDrives(drivesRes.data || []);
      setMyApplications(appsRes.data || []);
      setStudentProfile(profileRes.data);
    } catch (err) {
      console.error('Failed to load drives:', err);
    } finally {
      setLoading(false);
    }
  };

  const appliedDriveIds = new Set(
    myApplications.map(a => a.placementDrive?.id)
  );

  const checkEligibility = (drive) => {
    if (!studentProfile) return { eligible: true, reasons: [] };
    const reasons = [];
    const cgpa = studentProfile.cgpa;
    if (drive.minCgpa != null && cgpa != null && cgpa < drive.minCgpa) {
      reasons.push(`CGPA ${cgpa.toFixed(2)} < Required ${drive.minCgpa}`);
    }
    if (drive.backlogLimit != null && (studentProfile.backlogs || 0) > drive.backlogLimit) {
      reasons.push(`Backlogs ${studentProfile.backlogs} > Limit ${drive.backlogLimit}`);
    }
    if (drive.eligibleBranches) {
      const branches = drive.eligibleBranches.split(',').map(b => b.trim().toLowerCase());
      if (studentProfile.branch && !branches.includes(studentProfile.branch.toLowerCase())) {
        reasons.push(`Branch "${studentProfile.branch}" not in eligible list`);
      }
    }
    return { eligible: reasons.length === 0, reasons };
  };

  const handleApply = async (driveId) => {
    setApplyingId(driveId);
    try {
      await axiosInstance.post(`/applications/apply/${driveId}`);
      setActionMsg(prev => ({ ...prev, [driveId]: { type: 'success', text: '✓ Application submitted successfully!' } }));
      const appsRes = await axiosInstance.get('/applications/my');
      setMyApplications(appsRes.data || []);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit. Please try again.';
      setActionMsg(prev => ({ ...prev, [driveId]: { type: 'danger', text: msg } }));
    } finally {
      setApplyingId(null);
      setTimeout(() => {
        setActionMsg(prev => { const n = { ...prev }; delete n[driveId]; return n; });
      }, 5000);
    }
  };

  const filtered = drives.filter(d => {
    const q = searchTerm.toLowerCase();
    const matches = !q || d.title?.toLowerCase().includes(q) ||
      d.companyName?.toLowerCase().includes(q) ||
      d.location?.toLowerCase().includes(q) ||
      d.jobRole?.toLowerCase().includes(q);
    if (onlyEligible) return matches && checkEligibility(d).eligible;
    return matches;
  });

  return (
    <AppLayout>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>Placement Drives</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {drives.length} active campus recruitment drives available. Apply to eligible ones.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            className={`btn btn-sm ${onlyEligible ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: '20px' }}
            onClick={() => setOnlyEligible(!onlyEligible)}
          >
            <CheckCircle2 size={15} style={{ marginRight: '4px' }} />
            {onlyEligible ? 'Eligible Only ✓' : 'Show Eligible Only'}
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          className="form-control"
          style={{ paddingLeft: '42px' }}
          placeholder="Search by drive title, company, location, or job role..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="spinner" />
      ) : filtered.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map((drive) => {
            const applied = appliedDriveIds.has(drive.id);
            const { eligible, reasons } = checkEligibility(drive);

            return (
              <div key={drive.id} className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  {/* Left: Company & Drive Info */}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flex: 1 }}>
                    <div style={{
                      width: '52px', height: '52px', borderRadius: '12px', flexShrink: 0,
                      background: 'linear-gradient(135deg, var(--primary) 0%, var(--purple) 100%)',
                      color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '1.25rem'
                    }}>
                      {(drive.companyName || 'C').charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>{drive.title}</h3>
                        {eligible ? (
                          <span className="badge badge-selected" style={{ fontSize: '0.75rem' }}>
                            <CheckCircle2 size={12} /> Eligible
                          </span>
                        ) : (
                          <span className="badge badge-rejected" style={{ fontSize: '0.75rem' }}>
                            <XCircle size={12} /> Ineligible
                          </span>
                        )}
                        {applied && (
                          <span className="badge badge-shortlisted" style={{ fontSize: '0.75rem' }}>Applied ✓</span>
                        )}
                      </div>

                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                        <Building2 size={14} style={{ marginRight: '4px', display: 'inline' }} />{drive.companyName}
                        {drive.jobRole && <span> • {drive.jobRole}</span>}
                      </div>

                      {/* Eligibility Criteria */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Award size={14} color="var(--primary)" />
                          Min CGPA: <strong>{drive.minCgpa ?? 'Any'}</strong>
                        </span>
                        {drive.backlogLimit != null && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <XCircle size={14} color="var(--warning)" />
                            Max Backlogs: <strong>{drive.backlogLimit}</strong>
                          </span>
                        )}
                        {drive.salaryCtc && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            💰 CTC: <strong style={{ color: 'var(--success)' }}>{drive.salaryCtc}</strong>
                          </span>
                        )}
                        {drive.location && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={14} /> {drive.location}
                          </span>
                        )}
                        {drive.deadline && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={14} /> Deadline: {new Date(drive.deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {/* Eligible Branches */}
                      {drive.eligibleBranches && (
                        <div style={{ marginBottom: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Eligible Branches:{' '}
                          {drive.eligibleBranches.split(',').map((b, i) => (
                            <span key={i} className="badge badge-tag" style={{ marginRight: '4px', fontSize: '0.72rem' }}>{b.trim()}</span>
                          ))}
                        </div>
                      )}

                      {/* Ineligibility Reasons */}
                      {!eligible && reasons.length > 0 && (
                        <div style={{ padding: '8px 12px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', fontSize: '0.8rem', color: '#9B1C1C' }}>
                          <strong>Why Ineligible:</strong> {reasons.join(' | ')}
                        </div>
                      )}

                      {/* Action Message */}
                      {actionMsg[drive.id] && (
                        <div style={{
                          marginTop: '10px', padding: '8px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600,
                          background: actionMsg[drive.id].type === 'success' ? '#DEF7EC' : '#FDE8E8',
                          color: actionMsg[drive.id].type === 'success' ? '#03543F' : '#9B1C1C'
                        }}>
                          {actionMsg[drive.id].text}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Apply Button */}
                  <div style={{ marginLeft: '16px', flexShrink: 0 }}>
                    {applied ? (
                      <button className="btn btn-outline btn-sm" disabled style={{ color: 'var(--success)', borderColor: 'var(--success)' }}>
                        <CheckCircle2 size={14} style={{ marginRight: '4px' }} /> Applied
                      </button>
                    ) : !eligible ? (
                      <button className="btn btn-outline btn-sm" disabled style={{ opacity: 0.5 }}>
                        Not Eligible
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleApply(drive.id)}
                        disabled={applyingId === drive.id}
                      >
                        {applyingId === drive.id ? 'Applying...' : 'Apply Now'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Briefcase size={48} style={{ margin: '0 auto 16px auto', opacity: 0.4 }} />
          <h3 style={{ fontWeight: 800 }}>No Placement Drives Found</h3>
          <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>
            {onlyEligible ? 'No eligible drives match your profile at this time.' : 'No active drives match your search. Try clearing the filter.'}
          </p>
        </div>
      )}
    </AppLayout>
  );
};

export default JobsList;

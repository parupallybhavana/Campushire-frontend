import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { 
  FileCheck, 
  Building2, 
  User, 
  Search, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Filter,
  UserCheck
} from 'lucide-react';
import AppLayout from '../components/AppLayout';

const ApplicationManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState({ id: null, type: '', text: '' });

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/admin/applications');
      setApplications(response.data);
    } catch (err) {
      console.error('Failed to load applications:', err);
      setError('Could not fetch student applications from backend server.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    setMessage({ id: null, type: '', text: '' });

    try {
      const response = await axiosInstance.put(`/admin/applications/${appId}/status`, {
        status: newStatus
      });

      setApplications(prev => prev.map(a => a.id === appId ? response.data : a));
      setMessage({ id: appId, type: 'success', text: `Status updated to ${newStatus}` });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update recruitment status.';
      setMessage({ id: appId, type: 'danger', text: msg });
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toUpperCase()) {
      case 'APPLIED':
      case 'UNDER_REVIEW':
        return 'badge-applied';
      case 'SHORTLISTED':
      case 'ASSESSMENT':
        return 'badge-shortlisted';
      case 'INTERVIEW':
        return 'badge-interview';
      case 'SELECTED':
        return 'badge-selected';
      case 'REJECTED':
        return 'badge-rejected';
      case 'WITHDRAWN':
        return 'badge-withdrawn';
      default:
        return 'badge-applied';
    }
  };

  const STATUS_OPTIONS = [
    { value: 'APPLIED', label: 'APPLIED' },
    { value: 'UNDER_REVIEW', label: 'UNDER REVIEW' },
    { value: 'SHORTLISTED', label: 'SHORTLISTED' },
    { value: 'ASSESSMENT', label: 'ASSESSMENT' },
    { value: 'INTERVIEW', label: 'INTERVIEW' },
    { value: 'SELECTED', label: 'SELECTED' },
    { value: 'REJECTED', label: 'REJECTED' },
    { value: 'WITHDRAWN', label: 'WITHDRAWN' }
  ];

  if (loading) {
    return (
      <AppLayout>
        <div className="spinner" style={{ margin: '100px auto' }} />
      </AppLayout>
    );
  }

  const filteredApplications = applications.filter(app => {
    const studentName = app.student?.name || '';
    const studentEmail = app.student?.email || '';
    const companyName = app.placementDrive?.companyName || '';
    const jobTitle = app.placementDrive?.title || '';

    const matchesSearch = 
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jobTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <AppLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileCheck color="var(--purple)" size={28} /> Application & Recruitment Status Management
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Review student applicant credentials and advance recruitment stages (Shortlist, Interview, Select, Reject)
        </p>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} /> <span>{error}</span>
        </div>
      )}

      {/* Filter and Search controls */}
      <div className="glass-panel" style={{ padding: '18px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '40px' }}
            placeholder="Search by Student Name, Email, Company, or Job Title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Filter size={16} color="var(--text-muted)" />
          <select
            className="form-control"
            style={{ width: 'auto' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="APPLIED">Applied</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="ASSESSMENT">Assessment</option>
            <option value="INTERVIEW">Interview</option>
            <option value="SELECTED">Selected</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      {filteredApplications.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <FileCheck size={40} style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
          <h3>No Applications Match Filter Criteria</h3>
          <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>Try resetting your search term or status filter.</p>
        </div>
      ) : (
        <div className="table-container glass-panel">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Student Info</th>
                <th>Academic Stats</th>
                <th>Company & Job</th>
                <th>Applied On</th>
                <th>Current Status</th>
                <th>Action (Update Status)</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => (
                <tr key={app.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{app.student?.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.student?.email}</div>
                  </td>

                  <td>
                    <div>
                      CGPA: <strong style={{ color: 'var(--cyan)' }}>{app.student?.cgpa !== null ? app.student.cgpa.toFixed(2) : 'N/A'}</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {app.student?.branch || 'N/A'} ({app.student?.graduationYear || 'N/A'})
                    </div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{app.placementDrive?.companyName}</div>
                    <div style={{ fontSize: '0.85rem' }}>{app.placementDrive?.title}</div>
                  </td>

                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    }) : 'N/A'}
                  </td>

                  <td>
                    <span className={`badge ${getStatusBadgeClass(app.status)}`} style={{ padding: '6px 12px' }}>
                      {app.status || 'APPLIED'}
                    </span>
                    {message.id === app.id && (
                      <div style={{ fontSize: '0.75rem', marginTop: '4px', fontWeight: 600, color: message.type === 'success' ? '#10B981' : '#EF4444' }}>
                        {message.text}
                      </div>
                    )}
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <select
                        className="status-select"
                        style={{
                          padding: '7px 12px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          width: '160px',
                          backgroundColor: '#FFFFFF',
                          color: '#1E293B',
                          border: '1.5px solid #CBD5E1',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                        value={app.status ? app.status.toUpperCase() : 'APPLIED'}
                        disabled={updatingId === app.id}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value} style={{ backgroundColor: '#FFFFFF', color: '#1E293B' }}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {updatingId === app.id && (
                        <div className="spinner" style={{ width: '16px', height: '16px', margin: 0, borderWidth: '2px' }} />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </AppLayout>
  );
};

export default ApplicationManagement;

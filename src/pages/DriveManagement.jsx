import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Briefcase, Plus, Edit, Trash2, Building2, MapPin, Award, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import AppLayout from '../components/AppLayout';

const DriveManagement = () => {
  const [drives, setDrives] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  // Modal / Form State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    companyId: '',
    description: '',
    minCgpa: '',
    requiredSkills: '',
    location: '',
    deadline: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [driveRes, compRes] = await Promise.all([
        axiosInstance.get('/admin/drives'),
        axiosInstance.get('/admin/companies')
      ]);
      setDrives(driveRes.data);
      setCompanies(compRes.data);
    } catch (err) {
      console.error('Failed to fetch placement drives data:', err);
      setError('Could not load placement drives or companies.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      companyId: companies.length > 0 ? companies[0].id : '',
      description: '',
      minCgpa: '',
      requiredSkills: '',
      location: '',
      deadline: ''
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (drive) => {
    setEditingId(drive.id);
    setFormData({
      title: drive.title || '',
      companyId: drive.companyId || '',
      description: drive.description || '',
      minCgpa: drive.minCgpa !== null && drive.minCgpa !== undefined ? drive.minCgpa : '',
      requiredSkills: drive.requiredSkills || '',
      location: drive.location || '',
      deadline: drive.deadline || ''
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        ...formData,
        companyId: parseInt(formData.companyId),
        minCgpa: formData.minCgpa !== '' ? parseFloat(formData.minCgpa) : null,
        deadline: formData.deadline ? formData.deadline : null
      };

      if (editingId) {
        await axiosInstance.put(`/admin/drives/${editingId}`, payload);
        setMessage({ type: 'success', text: 'Placement drive updated successfully!' });
      } else {
        await axiosInstance.post('/admin/drives', payload);
        setMessage({ type: 'success', text: 'New placement drive published successfully!' });
      }

      setShowModal(false);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save placement drive.';
      setMessage({ type: 'danger', text: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete placement drive "${title}"?`)) return;

    try {
      await axiosInstance.delete(`/admin/drives/${id}`);
      setMessage({ type: 'success', text: `Placement drive "${title}" deleted.` });
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete drive.';
      setMessage({ type: 'danger', text: msg });
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="spinner" style={{ margin: '100px auto' }} />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Briefcase color="var(--cyan)" size={28} /> Placement Drive Management
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Publish job openings, set eligibility CGPA thresholds, and deadlines
          </p>
        </div>

        <button 
          onClick={handleOpenAddModal} 
          className="btn btn-cyan" 
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          disabled={companies.length === 0}
        >
          <Plus size={18} /> Create Placement Drive
        </button>
      </div>

      {companies.length === 0 && (
        <div className="alert alert-info">
          <AlertCircle size={18} />
          <span>Please create at least one partner company before creating a placement drive.</span>
        </div>
      )}

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} /> <span>{error}</span>
        </div>
      )}

      {/* Drives Grid */}
      {drives.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Briefcase size={40} style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
          <h3>No Active Placement Drives</h3>
          <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>Click "Create Placement Drive" above to post a job opportunity.</p>
        </div>
      ) : (
        <div className="grid-cards">
          {drives.map((drive) => (
            <div key={drive.id} className="square-card" style={{ padding: '24px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ overflow: 'hidden' }}>
                    <span className="badge badge-tag" style={{ color: 'var(--primary)', marginBottom: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Building2 size={12} /> {drive.companyName}
                    </span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {drive.title}
                    </h3>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <button onClick={() => handleOpenEditModal(drive)} className="btn btn-secondary btn-sm" title="Edit Drive" style={{ padding: '6px' }}>
                      <Edit size={14} />
                    </button>
                    <button onClick={() => handleDelete(drive.id, drive.title)} className="btn btn-danger btn-sm" title="Delete Drive" style={{ padding: '6px' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  marginBottom: '14px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {drive.description || 'No description available.'}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.825rem', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '10px 12px', borderRadius: 'var(--radius-sm)', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                    <MapPin size={14} color="var(--primary)" /> <span>Location: <strong>{drive.location || 'Pan India'}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                    <Award size={14} color="var(--cyan)" /> <span>Min CGPA: <strong>{drive.minCgpa !== null ? drive.minCgpa : 'None'}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                    <Calendar size={14} color="var(--purple)" /> <span>Deadline: <strong>{drive.deadline || 'Open'}</strong></span>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
                {drive.requiredSkills ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxHeight: '48px', overflow: 'hidden' }}>
                    {drive.requiredSkills.split(',').slice(0, 4).map((skill, idx) => (
                      <span key={idx} className="badge badge-tag" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>{skill.trim()}</span>
                    ))}
                    {drive.requiredSkills.split(',').length > 4 && (
                      <span className="badge badge-tag" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>+{drive.requiredSkills.split(',').length - 4} more</span>
                    )}
                  </div>
                ) : (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Open for all eligible candidates</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '580px', padding: '28px', borderRadius: 'var(--radius-lg)', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              {editingId ? 'Edit Placement Drive' : 'Create New Placement Drive'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Job Title *</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="e.g. Software Development Engineer"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Company *</label>
                <select
                  name="companyId"
                  className="form-control"
                  value={formData.companyId}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select Company</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Job Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  placeholder="Role responsibilities, package details, tech stack..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Minimum CGPA Criterion</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    name="minCgpa"
                    className="form-control"
                    placeholder="e.g. 7.5"
                    value={formData.minCgpa}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Application Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    className="form-control"
                    value={formData.deadline}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  className="form-control"
                  placeholder="e.g. Bangalore, India"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label>Required Skills (Comma separated)</label>
                <input
                  type="text"
                  name="requiredSkills"
                  className="form-control"
                  placeholder="Java, Spring Boot, SQL, Data Structures"
                  value={formData.requiredSkills}
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-cyan" disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Update Drive' : 'Publish Drive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </AppLayout>
  );
};

export default DriveManagement;

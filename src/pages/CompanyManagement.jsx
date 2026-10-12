import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Building2, Plus, Edit, Trash2, ExternalLink, Globe, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import AppLayout from '../components/AppLayout';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  // Modal / Form state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    website: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/admin/companies');
      setCompanies(response.data);
    } catch (err) {
      console.error('Failed to load companies:', err);
      setError('Could not fetch companies list from backend server.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', location: '', website: '' });
    setShowModal(true);
  };

  const handleOpenEditModal = (company) => {
    setEditingId(company.id);
    setFormData({
      name: company.name || '',
      description: company.description || '',
      location: company.location || '',
      website: company.website || ''
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
      if (editingId) {
        await axiosInstance.put(`/admin/companies/${editingId}`, formData);
        setMessage({ type: 'success', text: 'Company details updated successfully!' });
      } else {
        await axiosInstance.post('/admin/companies', formData);
        setMessage({ type: 'success', text: 'New company added successfully!' });
      }

      setShowModal(false);
      fetchCompanies();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save company information.';
      setMessage({ type: 'danger', text: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete company "${name}"?`)) return;

    try {
      await axiosInstance.delete(`/admin/companies/${id}`);
      setMessage({ type: 'success', text: `Company "${name}" deleted.` });
      fetchCompanies();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete company.';
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
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building2 color="var(--primary)" size={28} /> Company Management
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage corporate entities visiting campus for recruitment drives
          </p>
        </div>

        <button onClick={handleOpenAddModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={18} /> Add New Company
        </button>
      </div>

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

      {/* Companies Grid */}
      {companies.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Building2 size={40} style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
          <h3>No Companies Listed</h3>
          <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>Click "Add New Company" above to register visiting companies.</p>
        </div>
      ) : (
        <div className="grid-cards">
          {companies.map((comp) => (
            <div key={comp.id} className="square-card" style={{ padding: '24px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                    <div>
                      <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 700 }}>{comp.name}</h3>
                      <span className="badge badge-tag" style={{ color: 'var(--primary)', marginTop: '2px' }}>Company</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => handleOpenEditModal(comp)} className="btn btn-secondary btn-sm" title="Edit Company" style={{ padding: '6px' }}>
                      <Edit size={14} />
                    </button>
                    <button onClick={() => handleDelete(comp.id, comp.name)} className="btn btn-danger btn-sm" title="Delete Company" style={{ padding: '6px' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.875rem',
                  marginBottom: '16px',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {comp.description || 'No description provided.'}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                  <MapPin size={15} color="var(--primary)" /> <span>{comp.location || 'Location Not Specified'}</span>
                </div>
                {comp.website && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Globe size={15} color="var(--cyan)" />
                    <a href={comp.website.startsWith('http') ? comp.website : `https://${comp.website}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                      {comp.website} <ExternalLink size={12} />
                    </a>
                  </div>
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
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '28px', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              {editingId ? 'Edit Company Details' : 'Add New Partner Company'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Company Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="e.g. Google Cloud"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  placeholder="Company overview, domain, and culture..."
                  value={formData.description}
                  onChange={handleChange}
                />
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
                <label>Website URL</label>
                <input
                  type="text"
                  name="website"
                  className="form-control"
                  placeholder="https://example.com"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Update Company' : 'Create Company'}
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

export default CompanyManagement;

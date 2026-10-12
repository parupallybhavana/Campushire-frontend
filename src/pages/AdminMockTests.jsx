import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import axiosInstance from '../api/axiosInstance';
import { Plus, Edit2, Trash2, Target, Clock, Award, X } from 'lucide-react';

function AdminMockTests() {
  const [mockTests, setMockTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const initialForm = {
    title: '',
    category: 'Full Stack',
    durationMinutes: 30,
    totalMarks: 50,
    passPercentage: 60,
    description: '',
    questionsJson: ''
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchMockTests();
  }, []);

  const fetchMockTests = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/admin/mock-tests');
      setMockTests(res.data || []);
    } catch (err) {
      console.error('Failed to fetch mock tests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (test = null) => {
    if (test) {
      setEditingId(test.id);
      setFormData({
        title: test.title || '',
        category: test.category || 'Full Stack',
        durationMinutes: test.durationMinutes || 30,
        totalMarks: test.totalMarks || 50,
        passPercentage: test.passPercentage || 60,
        description: test.description || '',
        questionsJson: test.questionsJson || ''
      });
    } else {
      setEditingId(null);
      setFormData(initialForm);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axiosInstance.put(`/admin/mock-tests/${editingId}`, formData);
        setMessage('Mock test updated successfully!');
      } else {
        await axiosInstance.post('/admin/mock-tests', formData);
        setMessage('Mock test created successfully!');
      }
      setShowModal(false);
      fetchMockTests();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Failed to save mock test:', err);
      alert('Failed to save mock test. Please verify JSON format if provided.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this mock test?')) return;
    try {
      await axiosInstance.delete(`/admin/mock-tests/${id}`);
      setMessage('Mock test deleted successfully!');
      fetchMockTests();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Failed to delete mock test:', err);
    }
  };

  return (
    <AppLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>Mock Test Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Configure online placement screening tests and question pools</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} style={{ marginRight: '6px' }} /> Create Mock Test
        </button>
      </div>

      {message && (
        <div className="card" style={{ padding: '12px 20px', background: '#DEF7EC', color: '#03543F', marginBottom: '20px', fontWeight: 600 }}>
          {message}
        </div>
      )}

      {loading ? (
        <div className="spinner" />
      ) : mockTests.length > 0 ? (
        <div className="grid-3">
          {mockTests.map((t) => (
            <div key={t.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span className="badge badge-applied">{t.category || 'General'}</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => handleOpenModal(t)}>
                      <Edit2 size={14} />
                    </button>
                    <button className="btn btn-outline btn-sm" style={{ color: '#EF4444' }} onClick={() => handleDelete(t.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>{t.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  {t.description || 'Comprehensive placement screening assessment with automated scoring.'}
                </p>

                <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} color="var(--primary)" /> {t.durationMinutes} mins
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Award size={14} color="var(--success)" /> Pass: {t.passPercentage}%
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Total Marks: {t.totalMarks}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No mock tests created yet. Click 'Create Mock Test' above to add one.
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '650px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{editingId ? 'Edit Mock Test' : 'Create Mock Test'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="form-label">Test Title *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g., Campus General Placement Mock Assessment"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid-3" style={{ gap: '12px' }}>
                <div>
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., Full Stack, Java"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">Duration (Mins)</label>
                  <input
                    type="number"
                    required
                    min="5"
                    className="form-control"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="form-label">Pass %</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    className="form-control"
                    value={formData.passPercentage}
                    onChange={(e) => setFormData({ ...formData, passPercentage: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Description</label>
                <textarea
                  rows="2"
                  className="form-control"
                  placeholder="Brief summary of test topics..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Questions JSON (Array of questions)</label>
                <textarea
                  rows="6"
                  className="form-control"
                  style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                  placeholder='[{"id": 1, "question": "What is 2+2?", "options": ["3","4","5","6"], "answer": "4", "explanation": "Simple math"}]'
                  value={formData.questionsJson}
                  onChange={(e) => setFormData({ ...formData, questionsJson: e.target.value })}
                />
                <small style={{ color: 'var(--text-muted)' }}>Paste JSON array of questions with question, options, answer, and explanation.</small>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Update Test' : 'Create Test'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default AdminMockTests;

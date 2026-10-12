import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import axiosInstance from '../api/axiosInstance';
import { Plus, Edit2, Trash2, Code2, BookOpen, User, Check, X, Filter } from 'lucide-react';

function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const initialForm = {
    title: '',
    topic: 'Java',
    category: 'TECHNICAL',
    difficulty: 'EASY',
    description: '',
    explanation: '',
    optionsJson: '',
    correctAnswer: '',
    solutionCode: ''
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/admin/questions');
      setQuestions(res.data || []);
    } catch (err) {
      console.error('Failed to fetch questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (q = null) => {
    if (q) {
      setEditingId(q.id);
      setFormData({
        title: q.title || '',
        topic: q.topic || 'Java',
        category: q.category || 'TECHNICAL',
        difficulty: q.difficulty || 'EASY',
        description: q.description || '',
        explanation: q.explanation || '',
        optionsJson: q.optionsJson || '',
        correctAnswer: q.correctAnswer || '',
        solutionCode: q.solutionCode || ''
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
        await axiosInstance.put(`/admin/questions/${editingId}`, formData);
        setMessage('Question updated successfully!');
      } else {
        await axiosInstance.post('/admin/questions', formData);
        setMessage('Question added successfully!');
      }
      setShowModal(false);
      fetchQuestions();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Failed to save question:', err);
      alert('Failed to save question. Please check input fields.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await axiosInstance.delete(`/admin/questions/${id}`);
      setMessage('Question deleted successfully!');
      fetchQuestions();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Failed to delete question:', err);
    }
  };

  const filteredQuestions = filterCategory === 'ALL'
    ? questions
    : questions.filter(q => q.category === filterCategory);

  return (
    <AppLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>Practice Questions Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Add, edit, or remove Technical, Aptitude, and HR interview questions</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} style={{ marginRight: '6px' }} /> Add Question
        </button>
      </div>

      {message && (
        <div className="card" style={{ padding: '12px 20px', background: '#DEF7EC', color: '#03543F', marginBottom: '20px', fontWeight: 600 }}>
          {message}
        </div>
      )}

      {/* Category Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {['ALL', 'TECHNICAL', 'APTITUDE', 'HR'].map((cat) => (
          <button
            key={cat}
            className={`btn btn-sm ${filterCategory === cat ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilterCategory(cat)}
          >
            {cat === 'ALL' ? 'All Questions' : cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="spinner" />
      ) : filteredQuestions.length > 0 ? (
        <div className="card">
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Question Title</th>
                  <th>Category</th>
                  <th>Topic / Subject</th>
                  <th>Difficulty</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuestions.map((q) => (
                  <tr key={q.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{q.title}</div>
                      <small style={{ color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {q.description}
                      </small>
                    </td>
                    <td>
                      <span className="badge badge-applied">{q.category}</span>
                    </td>
                    <td>
                      <span className="badge badge-tag">{q.topic || 'General'}</span>
                    </td>
                    <td>
                      <span className={`badge ${q.difficulty === 'HARD' ? 'badge-rejected' : q.difficulty === 'MEDIUM' ? 'badge-shortlisted' : 'badge-selected'}`}>
                        {q.difficulty}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => handleOpenModal(q)}>
                          <Edit2 size={14} />
                        </button>
                        <button className="btn btn-outline btn-sm" style={{ color: '#EF4444' }} onClick={() => handleDelete(q.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No questions found in this category.
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '700px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{editingId ? 'Edit Practice Question' : 'Add Practice Question'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="form-label">Question Title *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g., Difference between HashMap and ConcurrentHashMap"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid-3" style={{ gap: '12px' }}>
                <div>
                  <label className="form-label">Category *</label>
                  <select
                    className="form-control"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="TECHNICAL">TECHNICAL</option>
                    <option value="APTITUDE">APTITUDE</option>
                    <option value="HR">HR</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Topic / Subject</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., Java, SQL, OS, Percentages"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">Difficulty</label>
                  <select
                    className="form-control"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  >
                    <option value="EASY">EASY</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HARD">HARD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Question Description / Problem Statement *</label>
                <textarea
                  rows="3"
                  required
                  className="form-control"
                  placeholder="Explain the question or scenario..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {formData.category === 'APTITUDE' && (
                <div>
                  <label className="form-label">Options (JSON Array format)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder='["10%", "15%", "20%", "25%"]'
                    value={formData.optionsJson}
                    onChange={(e) => setFormData({ ...formData, optionsJson: e.target.value })}
                  />
                </div>
              )}

              <div>
                <label className="form-label">Correct Answer / Key Points</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., Option B / ConcurrentHashMap uses bucket level locking"
                  value={formData.correctAnswer}
                  onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Detailed Explanation / Answer Tip</label>
                <textarea
                  rows="3"
                  className="form-control"
                  placeholder="Detailed concept breakdown, formulas, or HR answering strategy..."
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                />
              </div>

              {formData.category === 'TECHNICAL' && (
                <div>
                  <label className="form-label">Sample Code Solution (Optional)</label>
                  <textarea
                    rows="4"
                    className="form-control"
                    placeholder="// Java or C++ implementation"
                    value={formData.solutionCode}
                    onChange={(e) => setFormData({ ...formData, solutionCode: e.target.value })}
                  />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Update Question' : 'Save Question'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default AdminQuestions;

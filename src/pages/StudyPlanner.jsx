import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import axiosInstance from '../api/axiosInstance';
import { CalendarCheck, Plus, CheckCircle2, Circle, Flame } from 'lucide-react';

function StudyPlanner() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('CODING');
  const [newDay, setNewDay] = useState('MONDAY');

  useEffect(() => {
    fetchStudyPlan();
  }, []);

  const fetchStudyPlan = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/study-plan');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load study plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (taskId) => {
    try {
      await axiosInstance.put(`/study-plan/${taskId}/toggle`);
      fetchStudyPlan();
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/study-plan', {
        title: newTitle,
        category: newCategory,
        dayOfWeek: newDay
      });
      setShowAddModal(false);
      setNewTitle('');
      fetchStudyPlan();
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  return (
    <AppLayout>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: '#1E293B' }}>Personalized Study Planner</h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Day-by-day weekly preparation schedule customized for upcoming placement drives.</p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Add Study Task
        </button>
      </div>

      {/* Completion Progress Bar */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <strong style={{ fontSize: '1rem', color: '#1E293B' }}>Weekly Task Completion</strong>
          <span style={{ fontWeight: 800, color: '#4F46E5', fontSize: '1.1rem' }}>
            {data?.completionPercentage || 0}% Complete
          </span>
        </div>
        <div className="progress-bar-bg" style={{ height: '10px' }}>
          <div className="progress-bar-fill" style={{ width: `${data?.completionPercentage || 0}%` }} />
        </div>
      </div>

      {/* Days Grid */}
      <div className="grid-cards">
        {days.map(day => {
          const dayTasks = data?.tasks?.filter(t => t.dayOfWeek === day) || [];
          return (
            <div key={day} className="card" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#4F46E5' }}>{day}</h4>
                <span className="badge badge-tag">{dayTasks.length} Task{dayTasks.length !== 1 ? 's' : ''}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {dayTasks.length > 0 ? (
                  dayTasks.map(t => (
                    <div
                      key={t.id}
                      onClick={() => toggleTask(t.id)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: t.completed ? '#ECFDF5' : '#FAFAFD',
                        border: '1px solid',
                        borderColor: t.completed ? '#A7F3D0' : '#E5E7EB',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '0.875rem'
                      }}
                    >
                      {t.completed ? <CheckCircle2 size={18} style={{ color: '#10B981' }} /> : <Circle size={18} style={{ color: '#94A3B8' }} />}
                      <span style={{ textDecoration: t.completed ? 'line-through' : 'none', color: t.completed ? '#047857' : '#1E293B', fontWeight: 600 }}>
                        {t.title}
                      </span>
                    </div>
                  ))
                ) : (
                  <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontStyle: 'italic' }}>Rest or Custom Study</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300
        }}>
          <div className="card" style={{ width: '420px', padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>Add New Study Task</h3>
            <form onSubmit={handleAddTask}>
              <div className="form-group">
                <label>Task Description</label>
                <input type="text" className="form-control" placeholder="e.g. Solve 5 Linked List Questions" value={newTitle} onChange={e => setNewTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Day of Week</label>
                <select className="form-control" value={newDay} onChange={e => setNewDay(e.target.value)}>
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Category</label>
                <select className="form-control" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                  <option value="CODING">Coding & DSA</option>
                  <option value="APTITUDE">Aptitude & Reasoning</option>
                  <option value="TECHNICAL">Technical Concepts</option>
                  <option value="HR">HR & Behavioral</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default StudyPlanner;

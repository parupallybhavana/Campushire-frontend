import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import axiosInstance from '../api/axiosInstance';
import { BookOpen, CheckCircle2, ChevronDown, ChevronUp, Code2, Sparkles } from 'lucide-react';

function TechnicalPrep() {
  const [questions, setQuestions] = useState([]);
  const [subject, setSubject] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [completedIds, setCompletedIds] = useState(() => {
    const saved = localStorage.getItem('completed_tech_questions');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(true);

  const subjects = ['All', 'C', 'Java', 'Python', 'DBMS', 'SQL', 'OOP', 'Operating Systems', 'Data Structures'];

  useEffect(() => {
    fetchQuestions();
  }, [subject]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = { category: 'TECHNICAL' };
      if (subject !== 'All') params.topic = subject;
      const res = await axiosInstance.get('/practice/questions', { params });
      setQuestions(res.data || []);
    } catch (err) {
      console.error('Failed to load technical questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompleted = (id, e) => {
    e.stopPropagation();
    let updated;
    if (completedIds.includes(id)) {
      updated = completedIds.filter(item => item !== id);
    } else {
      updated = [...completedIds, id];
    }
    setCompletedIds(updated);
    localStorage.setItem('completed_tech_questions', JSON.stringify(updated));
  };

  return (
    <AppLayout>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>Technical Interview Questions</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Comprehensive core computer science concept bank across 8 foundational subjects.
          </p>
        </div>
        <div className="badge badge-selected" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          <CheckCircle2 size={16} /> {completedIds.length} Marked as Completed
        </div>
      </div>

      {/* 8 Core Subject Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {subjects.map(s => (
          <button
            key={s}
            className={`btn ${subject === s ? 'btn-primary' : 'btn-outline'} btn-sm`}
            onClick={() => setSubject(s)}
            style={{ borderRadius: '20px', whiteSpace: 'nowrap' }}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="spinner" />
      ) : questions.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {questions.map(q => {
            const isDone = completedIds.includes(q.id);
            return (
              <div key={q.id} className="card" style={{ padding: '20px' }}>
                <div
                  onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '8px',
                      background: isDone ? 'rgba(16,185,129,0.1)' : 'rgba(79,70,229,0.1)',
                      color: isDone ? 'var(--success)' : 'var(--primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {isDone ? <CheckCircle2 size={18} /> : <BookOpen size={18} />}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>{q.title}</h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Subject: <strong>{q.topic || 'Computer Science'}</strong></span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      className={`btn btn-sm ${isDone ? 'btn-secondary' : 'btn-outline'}`}
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                      onClick={(e) => toggleCompleted(q.id, e)}
                    >
                      <CheckCircle2 size={13} style={{ marginRight: '4px' }} />
                      {isDone ? 'Completed' : 'Mark Completed'}
                    </button>
                    {expandedId === q.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {expandedId === q.id && (
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                    <div style={{ marginBottom: '12px' }}>
                      <strong>Question:</strong>
                      <p style={{ marginTop: '4px', color: 'var(--text-muted)' }}>{q.description}</p>
                    </div>

                    {q.correctAnswer && (
                      <div style={{ marginBottom: '12px', padding: '12px', borderRadius: '8px', background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                        <strong style={{ color: '#166534' }}>Key Answer Points:</strong>
                        <p style={{ margin: '4px 0 0 0', color: '#14532D' }}>{q.correctAnswer}</p>
                      </div>
                    )}

                    {q.explanation && (
                      <div style={{ marginTop: '12px', padding: '14px', borderRadius: '8px', background: '#F8FAFC', border: '1px solid var(--border-color)' }}>
                        <strong style={{ color: 'var(--primary)' }}>Detailed Explanation:</strong>
                        <p style={{ margin: '6px 0 0 0', whiteSpace: 'pre-line', color: 'var(--text-main)' }}>{q.explanation}</p>
                      </div>
                    )}

                    {q.solutionCode && (
                      <div style={{ marginTop: '12px' }}>
                        <strong style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                          <Code2 size={16} color="var(--primary)" /> Code Example:
                        </strong>
                        <pre style={{ background: '#1E293B', color: '#F8FAFC', padding: '14px', borderRadius: '8px', overflowX: 'auto', fontSize: '0.85rem' }}>
                          <code>{q.solutionCode}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No technical questions found for "{subject}".
        </div>
      )}
    </AppLayout>
  );
}

export default TechnicalPrep;

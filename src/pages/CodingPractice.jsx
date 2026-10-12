import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import axiosInstance from '../api/axiosInstance';
import { Code2, Play, Send, CheckCircle2, AlertTriangle, Lightbulb, RefreshCw, Award } from 'lucide-react';

function CodingPractice() {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [language, setLanguage] = useState('Java');
  const [code, setCode] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [topicFilter, setTopicFilter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('editor'); // editor, solution

  useEffect(() => {
    fetchQuestions();
  }, [difficultyFilter, topicFilter]);

  const fetchQuestions = async () => {
    try {
      const res = await axiosInstance.get('/practice/questions', {
        params: { category: 'CODING', difficulty: difficultyFilter, topic: topicFilter }
      });
      setQuestions(res.data);
      if (res.data.length > 0 && !selectedQuestion) {
        loadQuestion(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to load coding questions:', err);
    }
  };

  const loadQuestion = (q) => {
    setSelectedQuestion(q);
    setResult(null);
    if (q.solutionCode) {
      setCode(q.solutionCode);
    } else {
      setCode(`// Write your Java solution here\npublic class Solution {\n    public static void main(String[] args) {\n        System.out.println("Hello CampusHire!");\n    }\n}`);
    }
  };

  const handleSubmit = async () => {
    if (!selectedQuestion) return;
    try {
      setSubmitting(true);
      const res = await axiosInstance.post(`/practice/questions/${selectedQuestion.id}/submit`, {
        submittedCode: code,
        timeTakenSeconds: 90
      });
      setResult(res.data);
    } catch (err) {
      setResult({ isCorrect: false, message: 'Failed to evaluate code submission.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: '#1E293B' }}>Coding Practice</h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Solve data structure & algorithm challenges with instant testcase evaluation.</p>
        </div>
      </div>

      <div className="grid-3" style={{ gridTemplateColumns: '300px 1fr' }}>
        {/* Left Column: Question List */}
        <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>Questions Bank</h3>

          <select
            className="form-control"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            style={{ fontSize: '0.85rem' }}
          >
            <option value="">All Difficulties</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '550px' }}>
            {questions.map(q => (
              <div
                key={q.id}
                onClick={() => loadQuestion(q)}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #E5E7EB',
                  backgroundColor: selectedQuestion?.id === q.id ? '#EEF2FF' : '#FFFFFF',
                  borderColor: selectedQuestion?.id === q.id ? '#4F46E5' : '#E5E7EB',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: selectedQuestion?.id === q.id ? '#4F46E5' : '#1E293B' }}>
                  {q.title}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px', fontSize: '0.75rem' }}>
                  <span className={`badge ${q.difficulty === 'BEGINNER' ? 'badge-selected' : 'badge-shortlisted'}`}>
                    {q.difficulty}
                  </span>
                  <span className="badge badge-tag">{q.topic || 'Arrays'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Problem Description & Code Editor */}
        {selectedQuestion ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{selectedQuestion.title}</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span className="badge badge-selected">{selectedQuestion.difficulty}</span>
                  <span className="badge badge-tag">{selectedQuestion.topic}</span>
                </div>
              </div>

              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {selectedQuestion.description}
              </p>

              {selectedQuestion.sampleInput && (
                <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ padding: '10px 14px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E5E7EB', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                    <strong>Sample Input:</strong>
                    <pre style={{ margin: '4px 0 0 0', whiteSpace: 'pre-wrap' }}>{selectedQuestion.sampleInput}</pre>
                  </div>
                  <div style={{ padding: '10px 14px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E5E7EB', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                    <strong>Sample Output:</strong>
                    <pre style={{ margin: '4px 0 0 0', whiteSpace: 'pre-wrap' }}>{selectedQuestion.sampleOutput}</pre>
                  </div>
                </div>
              )}
            </div>

            {/* Editor Workspace */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '12px 20px', background: '#1E293B', color: '#FFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Code2 size={18} style={{ color: '#818CF8' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Code Editor</span>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    style={{ background: '#334155', color: '#FFF', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '0.825rem' }}
                  >
                    <option value="Java">Java 17</option>
                    <option value="Python">Python 3</option>
                    <option value="C">C Language</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab(activeTab === 'editor' ? 'solution' : 'editor')}>
                    <Lightbulb size={14} /> {activeTab === 'editor' ? 'View Explanation' : 'Code Editor'}
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={submitting}>
                    <Send size={14} /> {submitting ? 'Running...' : 'Run & Submit'}
                  </button>
                </div>
              </div>

              {activeTab === 'editor' ? (
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  style={{
                    width: '100%',
                    height: '280px',
                    backgroundColor: '#0F172A',
                    color: '#F8FAFC',
                    fontFamily: 'Consolas, Monaco, monospace',
                    fontSize: '0.9rem',
                    padding: '16px',
                    border: 'none',
                    outline: 'none',
                    resize: 'vertical',
                    lineHeight: '1.5'
                  }}
                />
              ) : (
                <div style={{ padding: '20px', backgroundColor: '#FAFAFD', minHeight: '280px' }}>
                  <h4 style={{ color: '#4F46E5', marginBottom: '8px' }}>Solution & Explanation</h4>
                  <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '14px' }}>{selectedQuestion.explanation}</p>
                  <pre style={{ background: '#0F172A', color: '#38BDF8', padding: '14px', borderRadius: '8px', fontSize: '0.85rem' }}>
                    {selectedQuestion.solutionCode}
                  </pre>
                </div>
              )}
            </div>

            {/* Test Results Banner */}
            {result && (
              <div className={`alert ${result.isCorrect ? 'alert-success' : 'alert-danger'}`}>
                {result.isCorrect ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                <div>
                  <strong>{result.message}</strong>
                  {result.score > 0 && <span style={{ marginLeft: '10px' }}>+20 XP Awarded!</span>}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="card empty-state">
            <p>Select a question from the bank to start coding.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default CodingPractice;

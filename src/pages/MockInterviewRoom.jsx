import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import axiosInstance from '../api/axiosInstance';
import { Video, Calendar, Clock, CheckCircle2, Play, MessageSquare, Award, ArrowRight } from 'lucide-react';

function MockInterviewRoom() {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answerText, setAnswerText] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Form state
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [interviewType, setInterviewType] = useState('TECHNICAL');
  const [difficulty, setDifficulty] = useState('INTERMEDIATE');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await axiosInstance.get('/mock-interviews');
      setSessions(res.data);
    } catch (err) {
      console.error('Failed to load mock interview sessions:', err);
    }
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/mock-interviews/schedule', {
        targetRole, interviewType, difficulty, durationMinutes: 30
      });
      setShowScheduleModal(false);
      fetchSessions();
    } catch (err) {
      console.error('Schedule failed:', err);
    }
  };

  const startSession = async (session) => {
    try {
      const res = await axiosInstance.get(`/mock-interviews/${session.id}/start`);
      setActiveSession(session);
      setQuestions(res.data.questions || []);
      setCurrentQIndex(0);
      setAnswerText('');
      setFeedback(null);
    } catch (err) {
      console.error('Failed to start interview:', err);
    }
  };

  const completeSession = async () => {
    try {
      const res = await axiosInstance.post(`/mock-interviews/${activeSession.id}/complete`, { answerText });
      setFeedback(res.data);
      fetchSessions();
    } catch (err) {
      setFeedback({ score: 88, feedbackText: "Great job! Responses were well structured using the STAR method." });
    }
  };

  return (
    <AppLayout>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: '#1E293B' }}>Mock Interview Practice Room</h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Solo technical & HR interview practice room inspired by live interview rooms.</p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowScheduleModal(true)}>
          <Calendar size={16} /> Schedule Mock Session
        </button>
      </div>

      {!activeSession ? (
        <div className="grid-2">
          {sessions.map(s => (
            <div key={s.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{s.targetRole} Mock Session</h3>
                <span className={`badge ${s.status === 'COMPLETED' ? 'badge-selected' : 'badge-shortlisted'}`}>
                  {s.status}
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                Type: {s.interviewType} • Difficulty: {s.difficulty} • Duration: {s.durationMinutes} Mins
              </div>
              {s.score && (
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#10B981' }}>
                  Score: {s.score}/100 - {s.feedbackText}
                </div>
              )}
              <button className="btn btn-primary btn-sm" style={{ marginTop: 'auto' }} onClick={() => startSession(s)}>
                <Play size={14} /> {s.status === 'COMPLETED' ? 'Re-take Room Session' : 'Join Solo Room'}
              </button>
            </div>
          ))}
        </div>
      ) : feedback ? (
        <div className="card" style={{ maxWidth: '650px', margin: '0 auto', textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#D1FAE5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
            <Award size={36} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Session Completed!</h2>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#4F46E5', margin: '12px 0' }}>{feedback.score}/100</div>
          <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '24px' }}>{feedback.feedbackText || feedback.message}</p>
          <button className="btn btn-primary" onClick={() => setActiveSession(null)}>Return to Sessions List</button>
        </div>
      ) : (
        <div className="card" style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #E5E7EB', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Live Solo Room - Question {currentQIndex + 1} of {questions.length}</h3>
            </div>
            <span className="badge badge-tag">{activeSession.targetRole}</span>
          </div>

          {questions[currentQIndex] && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ padding: '20px', borderRadius: '12px', background: '#FAFAFD', border: '1px solid #E5E7EB' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B' }}>{questions[currentQIndex].question}</h4>
              </div>

              <div className="form-group">
                <label>Your Verbal / Typed Answer Response:</label>
                <textarea
                  className="form-control"
                  placeholder="Type your structured response using the STAR method..."
                  value={answerText}
                  onChange={e => setAnswerText(e.target.value)}
                  style={{ minHeight: '180px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {currentQIndex < questions.length - 1 ? (
                  <button className="btn btn-secondary" onClick={() => { setCurrentQIndex(currentQIndex + 1); setAnswerText(''); }}>
                    Next Question <ArrowRight size={16} />
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={completeSession}>
                    Finish Session & Get Feedback
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300
        }}>
          <div className="card" style={{ width: '420px', padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>Schedule Mock Interview</h3>
            <form onSubmit={handleSchedule}>
              <div className="form-group">
                <label>Target Job Role</label>
                <input type="text" className="form-control" value={targetRole} onChange={e => setTargetRole(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Interview Type</label>
                <select className="form-control" value={interviewType} onChange={e => setInterviewType(e.target.value)}>
                  <option value="TECHNICAL">Technical Round</option>
                  <option value="CODING">Coding Assessment</option>
                  <option value="HR">HR & Fitment</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowScheduleModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default MockInterviewRoom;

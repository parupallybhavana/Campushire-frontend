import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import axiosInstance from '../api/axiosInstance';
import { Award, Clock, CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy } from 'lucide-react';

function MockPlacementTest() {
  const [mockTests, setMockTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTest, setActiveTest] = useState(null);
  const [testQuestions, setTestQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800);
  const [testPhase, setTestPhase] = useState('list'); // 'list' | 'test' | 'review' | 'result'
  const [score, setScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [previousAttempts, setPreviousAttempts] = useState([]);

  useEffect(() => {
    fetchMockTests();
  }, []);

  useEffect(() => {
    if (testPhase === 'test' && !submitting && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); handleFinishTest(); return 0; }
        return prev - 1;
      }), 1000);
      return () => clearInterval(timer);
    }
  }, [testPhase, submitting]);

  const fetchMockTests = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/practice/mock-tests');
      setMockTests(res.data || []);
    } catch (err) {
      console.error('Failed to load mock tests:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttempts = async () => {
    try {
      const res = await axiosInstance.get('/practice/mock-tests/my-attempts');
      setPreviousAttempts(res.data || []);
    } catch (err) {}
  };

  const startTest = (test) => {
    let questions = [];
    if (test.questionsJson) {
      try {
        questions = JSON.parse(test.questionsJson);
      } catch (e) {
        questions = [];
      }
    }
    setActiveTest(test);
    setTestQuestions(questions);
    setCurrentQIndex(0);
    setSelectedOption('');
    setAnswers({});
    setTimeLeft((test.durationMinutes || 30) * 60);
    setTestPhase('test');
    setScore(0);
  };

  const handleNextQuestion = () => {
    // Record answer
    const currentQ = testQuestions[currentQIndex];
    if (selectedOption && currentQ) {
      setAnswers(prev => ({ ...prev, [currentQIndex]: selectedOption }));
    }
    setSelectedOption('');
    if (currentQIndex < testQuestions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      handleFinishTest();
    }
  };

  const handleFinishTest = async () => {
    const currentQ = testQuestions[currentQIndex];
    const finalAnswers = { ...answers };
    if (selectedOption && currentQ) {
      finalAnswers[currentQIndex] = selectedOption;
    }

    // Calculate score
    let correct = 0;
    testQuestions.forEach((q, idx) => {
      if (finalAnswers[idx] && q.answer && finalAnswers[idx] === q.answer) {
        correct++;
      }
    });
    const finalScore = correct;
    setScore(finalScore);
    setAnswers(finalAnswers);
    setSubmitting(true);

    try {
      await axiosInstance.post(`/practice/mock-tests/${activeTest.id}/submit`, {
        score: finalScore,
        totalMarks: testQuestions.length,
        timeTakenSeconds: (activeTest.durationMinutes || 30) * 60 - timeLeft
      });
    } catch (err) {
      console.error('Submit failed:', err);
    }

    setTestPhase('result');
    setSubmitting(false);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentQ = testQuestions[currentQIndex];
  let currentOptions = [];
  if (currentQ?.options) {
    currentOptions = Array.isArray(currentQ.options) ? currentQ.options : JSON.parse(currentQ.options || '[]');
  }

  // PHASE: Test Selection List
  if (testPhase === 'list') {
    return (
      <AppLayout>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>Mock Placement Examinations</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Take timed mock tests with automatic score calculation and answer review.
          </p>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : mockTests.length > 0 ? (
          <div className="grid-2">
            {mockTests.map(test => {
              let qCount = 0;
              try { qCount = JSON.parse(test.questionsJson || '[]').length; } catch (e) {}
              return (
                <div key={test.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{test.title}</h3>
                      <span className="badge badge-tag" style={{ marginTop: '4px' }}>{test.category}</span>
                    </div>
                    <Award size={22} color="var(--primary)" />
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '16px', flex: 1 }}>
                    {test.description || 'Timed placement screening assessment with automated score calculation.'}
                  </p>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} color="var(--primary)" /> {test.durationMinutes} Minutes
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={14} color="var(--success)" /> {qCount} Questions
                    </span>
                    <span>Pass: {test.passPercentage}%</span>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => startTest(test)}
                    disabled={qCount === 0}
                    style={{ width: '100%' }}
                  >
                    {qCount === 0 ? 'No Questions Configured' : 'Start Timed Mock Exam'}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No mock tests published yet. Admin needs to create mock tests in the admin panel.
          </div>
        )}
      </AppLayout>
    );
  }

  // PHASE: Active Test — One Question at a Time
  if (testPhase === 'test') {
    const progress = ((currentQIndex) / testQuestions.length) * 100;
    return (
      <AppLayout>
        {/* Timer Bar */}
        <div style={{
          padding: '12px 20px',
          background: timeLeft < 120 ? '#FEE2E2' : 'linear-gradient(135deg, var(--primary), var(--purple))',
          color: timeLeft < 120 ? '#DC2626' : '#FFF',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <span style={{ fontWeight: 700, fontSize: '1rem' }}>{activeTest.title}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '1.2rem' }}>
            <Clock size={20} />
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
            <span>Question {currentQIndex + 1} of {testQuestions.length}</span>
            <span>{Math.round(progress)}% done</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Question Card */}
        {currentQ ? (
          <div className="card" style={{ maxWidth: '850px', margin: '0 auto', padding: '32px' }}>
            {currentQ.section && (
              <span className="badge badge-applied" style={{ marginBottom: '14px', display: 'inline-block' }}>{currentQ.section}</span>
            )}
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '24px', lineHeight: 1.5 }}>
              {currentQ.question}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
              {currentOptions.map((opt, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedOption(opt)}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '12px',
                    border: '2px solid',
                    borderColor: selectedOption === opt ? 'var(--primary)' : 'var(--border-color)',
                    backgroundColor: selectedOption === opt ? '#EEF2FF' : '#FFFFFF',
                    cursor: 'pointer',
                    fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: '12px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%', border: '2px solid',
                    borderColor: selectedOption === opt ? 'var(--primary)' : '#CBD5E1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: 800,
                    background: selectedOption === opt ? 'var(--primary)' : 'transparent',
                    color: selectedOption === opt ? '#FFF' : 'var(--text-main)'
                  }}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span>{opt}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {Object.keys(answers).length} questions answered
              </span>
              <button
                className="btn btn-primary"
                disabled={!selectedOption}
                onClick={handleNextQuestion}
                style={{ padding: '12px 28px' }}
              >
                {currentQIndex < testQuestions.length - 1 ? 'Next Question' : 'Submit Exam'}
                <ArrowRight size={16} style={{ marginLeft: '6px' }} />
              </button>
            </div>
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p>No questions configured for this test.</p>
            <button className="btn btn-outline" onClick={() => setTestPhase('list')}>Back to Tests</button>
          </div>
        )}
      </AppLayout>
    );
  }

  // PHASE: Results
  if (testPhase === 'result') {
    const totalQ = testQuestions.length || 1;
    const pct = Math.round((score / totalQ) * 100);
    const passed = pct >= (activeTest?.passPercentage || 60);
    return (
      <AppLayout>
        <div className="card" style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', padding: '48px 32px' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: passed ? '#D1FAE5' : '#FEE2E2',
            color: passed ? 'var(--success)' : '#EF4444',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto'
          }}>
            {passed ? <Trophy size={40} /> : <XCircle size={40} />}
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>
            {passed ? 'Excellent Work! 🎉' : 'Keep Practicing! 💪'}
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
            {activeTest.title} — Results Summary
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '36px' }}>
            <div style={{ padding: '20px', borderRadius: '14px', background: '#EEF2FF' }}>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Score</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{score}/{totalQ}</div>
            </div>
            <div style={{ padding: '20px', borderRadius: '14px', background: '#F3E8FF' }}>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Percentage</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--purple)' }}>{pct}%</div>
            </div>
            <div style={{ padding: '20px', borderRadius: '14px', background: passed ? '#DEF7EC' : '#FEE2E2' }}>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Result</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: passed ? 'var(--success)' : '#EF4444' }}>
                {passed ? 'PASSED' : 'FAILED'}
              </div>
            </div>
          </div>

          {/* Answer Review */}
          <div style={{ textAlign: 'left', marginBottom: '28px' }}>
            <h3 style={{ fontWeight: 800, marginBottom: '16px' }}>Answer Review</h3>
            {testQuestions.map((q, idx) => {
              const your = answers[idx];
              const correct = q.answer;
              const isRight = your === correct;
              return (
                <div key={idx} style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid',
                  borderColor: isRight ? '#BBF7D0' : '#FECACA',
                  background: isRight ? '#F0FDF4' : '#FEF2F2',
                  marginBottom: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    {isRight ? <CheckCircle2 size={18} color="var(--success)" /> : <XCircle size={18} color="#EF4444" />}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Q{idx + 1}: {q.question}</div>
                      <div style={{ fontSize: '0.825rem', marginTop: '4px' }}>
                        Your answer: <strong style={{ color: isRight ? 'var(--success)' : '#EF4444' }}>{your || 'Not answered'}</strong>
                        {!isRight && correct && (
                          <span> | Correct: <strong style={{ color: 'var(--success)' }}>{correct}</strong></span>
                        )}
                      </div>
                      {q.explanation && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{q.explanation}</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn btn-outline" onClick={() => startTest(activeTest)}>
              <RotateCcw size={16} style={{ marginRight: '6px' }} /> Retake Test
            </button>
            <button className="btn btn-primary" onClick={() => setTestPhase('list')}>
              Back to Mock Tests
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return null;
}

export default MockPlacementTest;

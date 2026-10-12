import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import axiosInstance from '../api/axiosInstance';
import { Brain, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

function AptitudePractice() {
  const [questions, setQuestions] = useState([]);
  const [topic, setTopic] = useState('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const topics = ['All', 'Percentages', 'Ratios', 'Time and work', 'Probability', 'Number systems', 'Logical reasoning'];

  useEffect(() => {
    fetchAptitudeQuestions();
  }, [topic]);

  const fetchAptitudeQuestions = async () => {
    try {
      setLoading(true);
      const params = { category: 'APTITUDE' };
      if (topic !== 'All') params.topic = topic;
      const res = await axiosInstance.get('/practice/questions', { params });
      setQuestions(res.data || []);
      setCurrentIndex(0);
      setSubmitted(false);
      setResult(null);
      setSelectedOption('');
    } catch (err) {
      console.error('Failed to load aptitude questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentQ = questions[currentIndex];
  let options = ["Option A", "Option B", "Option C", "Option D"];
  if (currentQ?.optionsJson) {
    try {
      options = JSON.parse(currentQ.optionsJson);
    } catch (e) {
      options = currentQ.optionsJson.split(',').map(s => s.trim());
    }
  }

  const handleOptionSubmit = async () => {
    if (!selectedOption || !currentQ) return;
    try {
      const res = await axiosInstance.post(`/practice/questions/${currentQ.id}/submit`, {
        selectedOption: selectedOption,
        timeTakenSeconds: 30
      });
      setResult(res.data);
      setSubmitted(true);
    } catch (err) {
      console.error('Submission failed:', err);
      // Fallback local comparison if needed
      const isCorrect = selectedOption.toLowerCase().includes(currentQ.correctAnswer.toLowerCase()) ||
        currentQ.correctAnswer.toLowerCase().includes(selectedOption.toLowerCase());
      setResult({
        isCorrect,
        explanation: currentQ.explanation || 'Review the mathematical logic above.'
      });
      setSubmitted(true);
    }
  };

  const nextQuestion = () => {
    setSubmitted(false);
    setResult(null);
    setSelectedOption('');
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <AppLayout>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>Quantitative & Logical Aptitude</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Interactive multiple-choice questions with instant answer explanations and step-by-step solutions.
        </p>
      </div>

      {/* Topic Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {topics.map(t => (
          <button
            key={t}
            className={`btn ${topic === t ? 'btn-primary' : 'btn-outline'} btn-sm`}
            onClick={() => setTopic(t)}
            style={{ borderRadius: '20px', whiteSpace: 'nowrap' }}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="spinner" />
      ) : currentQ ? (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span className="badge badge-shortlisted">Question {currentIndex + 1} of {questions.length}</span>
            <span className="badge badge-tag">{currentQ.topic || 'Aptitude'}</span>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '20px', lineHeight: 1.5 }}>
            {currentQ.description || currentQ.title}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {options.map((opt, idx) => (
              <div
                key={idx}
                onClick={() => !submitted && setSelectedOption(opt)}
                style={{
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: selectedOption === opt ? 'var(--primary)' : 'var(--border-color)',
                  backgroundColor: selectedOption === opt ? '#EEF2FF' : '#FFFFFF',
                  cursor: submitted ? 'default' : 'pointer',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{
                  width: '26px', height: '26px', borderRadius: '50%', border: '2px solid',
                  borderColor: selectedOption === opt ? 'var(--primary)' : '#CBD5E1',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem',
                  backgroundColor: selectedOption === opt ? 'var(--primary)' : 'transparent',
                  color: selectedOption === opt ? '#FFF' : 'var(--text-main)'
                }}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span>{opt}</span>
              </div>
            ))}
          </div>

          {!submitted ? (
            <button className="btn btn-primary" style={{ width: '100%', padding: '12px' }} onClick={handleOptionSubmit} disabled={!selectedOption}>
              Submit Answer
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className={`card`} style={{
                padding: '16px',
                background: result?.isCorrect ? '#DEF7EC' : '#FDE8E8',
                color: result?.isCorrect ? '#03543F' : '#9B1C1C',
                border: result?.isCorrect ? '1px solid #BBF7D0' : '1px solid #F87171'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  {result?.isCorrect ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                  <strong>{result?.isCorrect ? 'Correct Answer! +10 XP' : 'Incorrect Answer'}</strong>
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  {result?.explanation || currentQ.explanation}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Correct Key: <strong>{currentQ.correctAnswer}</strong>
                </span>
                <button className="btn btn-primary" onClick={nextQuestion}>
                  Next Question <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No aptitude questions found for "{topic}".
        </div>
      )}
    </AppLayout>
  );
}

export default AptitudePractice;

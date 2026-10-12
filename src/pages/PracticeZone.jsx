import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { Code2, Brain, BookOpen, MessageSquare, Award, Play, CheckCircle2, Flame, ArrowRight } from 'lucide-react';

function PracticeZone() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axiosInstance.get('/practice/stats')
      .then(res => setStats(res.data))
      .catch(() => {});
  }, []);

  return (
    <AppLayout>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: '#1E293B' }}>Practice Zone</h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem', marginTop: '4px' }}>
            Sharpen your coding, quantitative aptitude, technical concepts, and interview skills.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="badge badge-selected" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
            <Flame size={16} /> {stats?.streakDays || 5} Day Streak!
          </div>
          <div className="badge badge-shortlisted" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
            <Award size={16} /> {stats?.totalXp || 320} XP
          </div>
        </div>
      </div>

      {/* 4 Core Practice Categories */}
      <div className="grid-2" style={{ gap: '24px', marginBottom: '32px' }}>
        {/* A. Technical Questions */}
        <div className="card" onClick={() => navigate('/student/practice/technical')} style={{ cursor: 'pointer', padding: '28px' }}>
          <div className="stat-icon violet" style={{ marginBottom: '16px' }}><BookOpen size={28} /></div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>1. Technical Questions</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '8px 0 16px 0', lineHeight: 1.5 }}>
            Master core computer science fundamentals across 8 subjects: C, Java, Python, DBMS, SQL, OOP, Operating Systems, and Data Structures.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
            <span className="badge badge-applied">8 Core Subjects</span>
            <span style={{ color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              Explore Questions <ArrowRight size={16} />
            </span>
          </div>
        </div>

        {/* B. Aptitude Questions */}
        <div className="card" onClick={() => navigate('/student/practice/aptitude')} style={{ cursor: 'pointer', padding: '28px' }}>
          <div className="stat-icon amber" style={{ marginBottom: '16px' }}><Brain size={28} /></div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>2. Quantitative & Logical Aptitude</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '8px 0 16px 0', lineHeight: 1.5 }}>
            Practice multiple-choice questions on Percentages, Ratios, Time & Work, Probability, Number Systems, and Logical Reasoning with instant answer explanations.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
            <span className="badge badge-shortlisted">Interactive MCQs</span>
            <span style={{ color: '#F59E0B', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              Practice Aptitude <ArrowRight size={16} />
            </span>
          </div>
        </div>

        {/* C. HR Questions */}
        <div className="card" onClick={() => navigate('/student/practice/hr')} style={{ cursor: 'pointer', padding: '28px' }}>
          <div className="stat-icon green" style={{ marginBottom: '16px' }}><MessageSquare size={28} /></div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>3. HR Interview Questions</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '8px 0 16px 0', lineHeight: 1.5 }}>
            Prepare for behavioral rounds with curated sample answers and tips for "Tell me about yourself", "Strengths & Weaknesses", "Why should we hire you", and project walk-throughs.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
            <span className="badge badge-selected">Sample Answers & Tips</span>
            <span style={{ color: 'var(--success)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              Prepare Answers <ArrowRight size={16} />
            </span>
          </div>
        </div>

        {/* D. Mock Tests */}
        <div className="card" onClick={() => navigate('/student/practice/mock-test')} style={{ cursor: 'pointer', padding: '28px' }}>
          <div className="stat-icon blue" style={{ marginBottom: '16px' }}><Award size={28} /></div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>4. Mock Placement Tests</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '8px 0 16px 0', lineHeight: 1.5 }}>
            Take timed mock tests one question at a time. Receive automatic score calculation, answer explanations, and saved test attempt history in MySQL.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
            <span className="badge badge-applied">Timed Assessment</span>
            <span style={{ color: '#3B82F6', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              Start Mock Test <ArrowRight size={16} />
            </span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default PracticeZone;

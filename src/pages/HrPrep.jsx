import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import axiosInstance from '../api/axiosInstance';
import { MessageSquare, Star, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

// Fallback HR questions in case backend doesn't have any
const fallbackHrQuestions = [
  {
    id: 'f1',
    title: 'Tell me about yourself.',
    topic: 'Introduction',
    description: 'Give a structured 2-minute summary of your background, technical skills, key projects, and career goals.',
    correctAnswer: 'Past (education) → Present (skills & projects) → Future (career goals aligned with company)',
    explanation: `Structure your answer as: \n1. Education & Background (10-15 sec): "I am a final-year B.Tech student in Computer Science at XYZ University." \n2. Technical Skills & Projects (30-40 sec): "I have strong experience in Java, Spring Boot, and React. I built a campus placement management system using MySQL that helped automate eligibility checks." \n3. Career Goal (10-15 sec): "I am looking to join an engineering team where I can contribute to scalable backend solutions and grow as a full-stack developer."`
  },
  {
    id: 'f2',
    title: 'What are your greatest strengths?',
    topic: 'Self-Assessment',
    description: 'Mention 2-3 strengths with concrete examples from your academic or project experience.',
    correctAnswer: 'Choose strengths relevant to the job: Problem-solving, quick learner, attention to detail',
    explanation: `Example: "My greatest strength is my problem-solving approach. When debugging a performance issue in our final year project, I systematically profiled the database queries and reduced response time by 60% using indexing and caching. I also learn technical concepts quickly, having self-learned Spring Security and JWT in one week for a hackathon."`
  },
  {
    id: 'f3',
    title: 'Why do you want to join our company?',
    topic: 'Company Alignment',
    description: 'Show genuine research about the company\'s products, culture, and how your skills align with their needs.',
    correctAnswer: 'Research the company\'s tech stack, products, mission, and recent news before answering.',
    explanation: `Template: "I have been following [Company Name]'s work in [specific domain]. Your recent product [mention specific product] aligns with my interest in [relevant tech]. I believe my skills in [skill 1, skill 2] can directly contribute to [specific team or challenge]. I also appreciate your engineering culture that values [mention something from blogs, Glassdoor, or job description]."`
  },
  {
    id: 'f4',
    title: 'Describe a challenge you faced and how you overcame it.',
    topic: 'Behavioral / STAR',
    description: 'Use the STAR Method: Situation, Task, Action, Result. Keep it focused on a technical or teamwork challenge.',
    correctAnswer: 'STAR: Situation → Task → Action → Measurable Result',
    explanation: `Example (STAR): \nSituation: "In my third year, our team had just 3 weeks to deliver a web app for a college tech fest." \nTask: "I was responsible for the backend API and database layer." \nAction: "I designed a RESTful API using Spring Boot, set up MySQL with proper indexing, and used Git for collaboration. I worked 2-3 hours extra each day." \nResult: "We delivered on time. The app handled 400+ concurrent users without errors and won second prize."`
  },
  {
    id: 'f5',
    title: 'Where do you see yourself in 5 years?',
    topic: 'Career Goals',
    description: 'Show ambition but stay realistic. Align your growth goals with the company\'s growth story.',
    correctAnswer: 'Focus on skill growth, leadership, and contributing to meaningful engineering challenges.',
    explanation: `Example: "In 5 years, I see myself as a senior software engineer specializing in distributed systems and backend architecture. I want to grow from solving individual engineering problems to leading a team and mentoring junior developers. I believe joining [Company Name] gives me that structured growth path given your clear career ladders and emphasis on continuous learning."`
  },
  {
    id: 'f6',
    title: 'Why should we hire you?',
    topic: 'Value Proposition',
    description: 'Summarize your unique combination of technical skills, work ethic, and problem-solving mindset.',
    correctAnswer: 'Connect your specific skills and past results directly to what the role needs.',
    explanation: `Example: "You should hire me because I bring a combination of strong technical fundamentals in Java and React, practical project experience with databases and REST APIs, and a proven ability to learn fast under pressure. My campus placement management project demonstrated my ability to deliver end-to-end solutions from database design to UI. Most importantly, I am deeply motivated to do impactful work, not just complete tasks."`
  },
  {
    id: 'f7',
    title: 'Tell me about a time you worked in a team.',
    topic: 'Teamwork',
    description: 'Describe a specific team project. Emphasize your role, collaboration, and handling of disagreements.',
    correctAnswer: 'Highlight communication, conflict resolution, and your specific contribution to the team result.',
    explanation: `Example: "In my final year project team of 5, we built a placement management system. I was the backend lead. We had a disagreement on whether to use REST or GraphQL. I prepared a comparison document showing that REST would be faster to implement given our timeline. The team agreed, and it helped us deliver on schedule. The key was listening to everyone's ideas and then making a data-backed decision together."`
  },
  {
    id: 'f8',
    title: 'How do you handle pressure and tight deadlines?',
    topic: 'Work Ethic',
    description: 'Give a real example showing how you prioritize, plan, and execute under time constraints.',
    correctAnswer: 'Show methodical planning: break down tasks, prioritize ruthlessly, communicate proactively.',
    explanation: `Example: "When I have tight deadlines, I start by listing all deliverables and estimating time for each. Then I focus on the highest-impact items first. During our semester-end project, I had 3 assignments due in the same week. I created a daily schedule, completed the most complex task first when my energy was highest, and finished all 3 on time. I also believe in communicating early if a deadline is at risk — surprises are worse than delays."`
  }
];

function HrPrep() {
  const [questions, setQuestions] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [expandedAnswers, setExpandedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState('All');

  useEffect(() => {
    fetchHrQuestions();
  }, []);

  const fetchHrQuestions = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/practice/questions', { params: { category: 'HR' } });
      const data = res.data || [];
      setQuestions(data.length > 0 ? data : fallbackHrQuestions);
    } catch (err) {
      setQuestions(fallbackHrQuestions);
    } finally {
      setLoading(false);
    }
  };

  const allTopics = ['All', ...new Set(questions.map(q => q.topic).filter(Boolean))];
  const filtered = topic === 'All' ? questions : questions.filter(q => q.topic === topic);

  const toggleAnswer = (id) => {
    setExpandedAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <AppLayout>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>HR Interview Preparation</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Master behavioral rounds with curated sample answers, STAR Method tips, and structured response guides.
        </p>
      </div>

      {/* Topic Filter */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {allTopics.map(t => (
          <button
            key={t}
            className={`btn ${topic === t ? 'btn-primary' : 'btn-outline'} btn-sm`}
            onClick={() => setTopic(t)}
            style={{ borderRadius: '20px' }}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="spinner" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '900px' }}>
          {filtered.map((q) => {
            const isExpanded = expandedAnswers[q.id];
            return (
              <div key={q.id} className="card" style={{ padding: '22px' }}>
                {/* Question Header */}
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', cursor: 'pointer' }}
                  onClick={() => toggleAnswer(q.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                      background: 'rgba(79,70,229,0.1)', color: 'var(--primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <MessageSquare size={18} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>{q.title}</h3>
                      <span className="badge badge-tag">{q.topic || 'Behavioral'}</span>
                    </div>
                  </div>
                  <div style={{ color: 'var(--text-muted)', marginLeft: '12px', marginTop: '4px' }}>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {/* Expanded Answer Content */}
                {isExpanded && (
                  <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
                    {/* Context */}
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px' }}>{q.description}</p>

                    {/* Key Points */}
                    {q.correctAnswer && (
                      <div style={{ padding: '14px', borderRadius: '10px', background: '#FEF3C7', border: '1px solid #FCD34D', marginBottom: '16px' }}>
                        <strong style={{ color: '#92400E', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                          <Star size={15} /> Answering Strategy / Key Points:
                        </strong>
                        <p style={{ margin: 0, color: '#78350F', fontSize: '0.875rem', lineHeight: 1.5 }}>{q.correctAnswer}</p>
                      </div>
                    )}

                    {/* Sample Answer */}
                    {q.explanation && (
                      <div style={{ padding: '16px', borderRadius: '10px', background: '#F8FAFC', border: '1px solid var(--border-color)' }}>
                        <strong style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                          <BookOpen size={15} /> Sample Answer with Structure:
                        </strong>
                        <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.9rem', whiteSpace: 'pre-line', lineHeight: 1.7 }}>
                          {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}

export default HrPrep;

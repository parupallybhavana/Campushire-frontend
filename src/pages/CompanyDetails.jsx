import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import axiosInstance from '../api/axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Building2,
  Briefcase,
  CheckCircle2,
  ListChecks,
  BookOpen,
  MessageSquare,
  Star,
  Award,
  Globe,
  MapPin,
  Bookmark,
  Send,
  Users,
  AlertCircle
} from 'lucide-react';

function CompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Experience form state
  const [expTitle, setExpTitle] = useState('');
  const [expRole, setExpRole] = useState('');
  const [expDifficulty, setExpDifficulty] = useState('MEDIUM');
  const [expRounds, setExpRounds] = useState('');
  const [expQuestions, setExpQuestions] = useState('');
  const [expTips, setExpTips] = useState('');

  // Review form state
  const [revRating, setRevRating] = useState(5);
  const [revTitle, setRevTitle] = useState('');
  const [revText, setRevText] = useState('');

  const [expMsg, setExpMsg] = useState('');
  const [revMsg, setRevMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cRes, rRes, eRes, revRes] = await Promise.all([
        axiosInstance.get(`/companies/${id}`),
        axiosInstance.get(`/companies/${id}/readiness`),
        axiosInstance.get(`/companies/${id}/experiences`),
        axiosInstance.get(`/companies/${id}/reviews`)
      ]);
      setCompany(cRes.data);
      setReadiness(rRes.data);
      setExperiences(eRes.data);
      setReviews(revRes.data);
    } catch (err) {
      console.error('Failed to load company details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = async () => {
    try {
      await axiosInstance.post(`/companies/${id}/save`);
      fetchData();
    } catch (err) {
      console.error('Failed to bookmark company:', err);
    }
  };

  const handleAddExperience = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`/companies/${id}/experiences`, {
        title: expTitle,
        roleTitle: expRole,
        difficulty: expDifficulty,
        roundDetails: expRounds,
        questionsAsked: expQuestions,
        preparationTips: expTips
      });
      setExpMsg('Interview experience submitted successfully for moderation!');
      setExpTitle(''); setExpRole(''); setExpRounds(''); setExpQuestions(''); setExpTips('');
      fetchData();
    } catch (err) {
      setExpMsg('Failed to submit experience. Please try again.');
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`/companies/${id}/reviews`, {
        rating: revRating,
        title: revTitle,
        reviewText: revText
      });
      setRevMsg('Review submitted successfully!');
      setRevTitle(''); setRevText('');
      fetchData();
    } catch (err) {
      setRevMsg('Failed to submit review.');
    }
  };

  if (loading || !company) {
    return (
      <AppLayout>
        <div className="spinner" />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* 1. Header Banner */}
      <div className="card" style={{ marginBottom: '24px', position: 'relative' }}>
        <button
          onClick={handleSaveToggle}
          className="btn btn-secondary btn-sm"
          style={{ position: 'absolute', right: '20px', top: '20px' }}
        >
          <Bookmark size={16} fill={company.isSaved ? '#4F46E5' : 'none'} color={company.isSaved ? '#4F46E5' : '#64748B'} />
          {company.isSaved ? 'Saved' : 'Save Company'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img
            src={company.logoUrl || "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&h=100&fit=crop&auto=format"}
            alt={company.name}
            style={{ width: '70px', height: '70px', borderRadius: '16px', objectFit: 'cover', border: '1px solid #E5E7EB' }}
          />
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{company.name}</h1>
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.875rem', color: '#64748B', marginTop: '4px' }}>
              <span><Building2 size={14} /> {company.industry || 'IT Industry'}</span>
              <span><MapPin size={14} /> {company.headquarters || company.location || 'Headquarters'}</span>
              <span><Users size={14} /> {company.companySize || '10,000+ employees'}</span>
              {company.website && (
                <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Globe size={14} /> Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Company Details + Readiness Score Calculator */}
      <div className="grid-3" style={{ marginBottom: '30px' }}>
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Section 1: Overview */}
          <div className="card">
            <h3 className="card-title"><Building2 size={20} style={{ color: '#4F46E5' }} /> 1. Company Overview</h3>
            <p style={{ color: '#475569', lineHeight: 1.6, marginTop: '10px' }}>{company.description}</p>
          </div>

          {/* Section 2 & 8: Available Job Roles & Application */}
          <div className="card">
            <h3 className="card-title"><Briefcase size={20} style={{ color: '#8B5CF6' }} /> 2. Available Placement Drives & Roles</h3>
            {company.drives && company.drives.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '14px' }}>
                {company.drives.map(drive => (
                  <div key={drive.id} style={{ padding: '16px', border: '1px solid #E5E7EB', borderRadius: '12px', backgroundColor: '#FAFAFD' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{drive.title}</h4>
                      <span className="badge badge-selected">{drive.salaryCtc || '₹18 LPA'}</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#64748B', margin: '8px 0' }}>{drive.description}</p>

                    <div style={{ fontSize: '0.825rem', color: '#475569', display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      <span><strong>Min CGPA:</strong> {drive.minCgpa}</span>
                      <span><strong>Eligible Branches:</strong> {drive.eligibleBranches || 'CSE, IT, ECE'}</span>
                      <span><strong>Location:</strong> {drive.location}</span>
                    </div>

                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/student/jobs')}>
                      Apply For Drive
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No active placement drives announced right now for this company.</p>
              </div>
            )}
          </div>

          {/* Section 4: Selection Process */}
          <div className="card">
            <h3 className="card-title"><ListChecks size={20} style={{ color: '#F59E0B' }} /> 4. Recruitment Selection Process</h3>
            <div style={{ whiteSpace: 'pre-line', color: '#475569', lineHeight: 1.7, marginTop: '10px' }}>
              {company.selectionProcess || "1. Online Aptitude & Coding Round\n2. Technical Interview Round 1\n3. Technical Interview Round 2\n4. HR Fitment Round"}
            </div>
          </div>

          {/* Section 5: Preparation Guide */}
          <div className="card">
            <h3 className="card-title"><BookOpen size={20} style={{ color: '#10B981' }} /> 5. Interview Preparation Guide</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
              <div style={{ padding: '12px', borderRadius: '8px', background: '#EEF2FF' }}>
                <strong style={{ color: '#4F46E5' }}>Technical Topics:</strong>
                <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem' }}>{company.techTopics}</p>
              </div>
              <div style={{ padding: '12px', borderRadius: '8px', background: '#F3E8FF' }}>
                <strong style={{ color: '#8B5CF6' }}>Aptitude Topics:</strong>
                <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem' }}>{company.aptitudeTopics}</p>
              </div>
              <div style={{ padding: '12px', borderRadius: '8px', background: '#FEF3C7' }}>
                <strong style={{ color: '#D97706' }}>HR Questions & Checklist:</strong>
                <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem' }}>{company.hrQuestions}</p>
              </div>
            </div>
          </div>

          {/* Section 6: Interview Experiences */}
          <div className="card">
            <h3 className="card-title"><MessageSquare size={20} style={{ color: '#3B82F6' }} /> 6. Student Interview Experiences</h3>
            {experiences.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '14px' }}>
                {experiences.map(exp => (
                  <div key={exp.id} style={{ padding: '14px', border: '1px solid #E5E7EB', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '0.95rem' }}>{exp.title}</strong>
                      <span className="badge badge-tag">Community Contribution</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', margin: '4px 0' }}>Submitted by {exp.studentName}</div>
                    <p style={{ fontSize: '0.875rem', color: '#475569', margin: '8px 0', whiteSpace: 'pre-line' }}>{exp.questionsAsked}</p>
                    <div style={{ fontSize: '0.825rem', color: '#4F46E5', fontStyle: 'italic' }}>Tip: {exp.preparationTips}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '10px' }}>No student interview experiences submitted yet.</p>
            )}

            {/* Submit Experience Form */}
            <form onSubmit={handleAddExperience} style={{ marginTop: '20px', borderTop: '1px solid #E5E7EB', paddingTop: '16px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px' }}>Share Your Interview Experience</h4>
              {expMsg && <div className="alert alert-info">{expMsg}</div>}
              <div className="form-group">
                <input type="text" className="form-control" placeholder="Title (e.g. SDE-1 Interview Experience)" value={expTitle} onChange={e => setExpTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <textarea className="form-control" placeholder="Questions encountered and round descriptions..." value={expQuestions} onChange={e => setExpQuestions(e.target.value)} required />
              </div>
              <div className="form-group">
                <input type="text" className="form-control" placeholder="Preparation tips for fellow students" value={expTips} onChange={e => setExpTips(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary btn-sm"><Send size={14} /> Submit Experience</button>
            </form>
          </div>
        </div>

        {/* Right Sidebar: Company Readiness Score Widget */}
        <div>
          <div className="card" style={{ position: 'sticky', top: '90px' }}>
            <h3 className="card-title"><Award size={20} style={{ color: '#4F46E5' }} /> Company Readiness Score</h3>
            <p style={{ fontSize: '0.825rem', color: '#64748B', marginBottom: '16px' }}>
              Personalized readiness calculated based on your verified skills & practice performance.
            </p>

            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: '#4F46E5', lineHeight: 1 }}>
                {readiness?.overallScore || 75}%
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10B981' }}>Good Preparation Match</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Skills Match</span>
                  <span>{readiness?.skillsMatchScore || 70}%</span>
                </div>
                <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: `${readiness?.skillsMatchScore || 70}%` }} /></div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Coding Score</span>
                  <span>{readiness?.codingScore || 80}%</span>
                </div>
                <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: `${readiness?.codingScore || 80}%`, background: '#8B5CF6' }} /></div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Aptitude Score</span>
                  <span>{readiness?.aptitudeScore || 75}%</span>
                </div>
                <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: `${readiness?.aptitudeScore || 75}%`, background: '#F59E0B' }} /></div>
              </div>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E5E7EB' }}>
              <strong style={{ fontSize: '0.85rem', color: '#1E293B' }}>Recommended Actions:</strong>
              <ul style={{ fontSize: '0.825rem', color: '#64748B', paddingLeft: '16px', marginTop: '6px' }}>
                <li>Solve 5 Graph & Tree questions</li>
                <li>Attempt timed placement mock test</li>
              </ul>
              <button className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: '14px' }} onClick={() => navigate('/student/practice')}>
                Start Practice Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default CompanyDetails;

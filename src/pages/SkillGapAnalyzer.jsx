import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { Target, CheckCircle2, AlertTriangle, ArrowRight, BookOpen } from 'lucide-react';

function SkillGapAnalyzer() {
  const navigate = useNavigate();
  const [targetRole, setTargetRole] = useState('Java Developer');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkillGap();
  }, [targetRole]);

  const fetchSkillGap = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/students/skill-gap', { params: { targetRole } });
      setData(res.data);
    } catch (err) {
      console.error('Failed to load skill gap:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: '#1E293B' }}>Skill Gap Analyzer</h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Compare your demonstrated & declared skills against target job requirements.</p>
        </div>

        <select
          className="form-control"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          style={{ width: '220px', fontWeight: 700 }}
        >
          <option value="Java Developer">Java Developer</option>
          <option value="Frontend UI Engineer">Frontend UI Engineer</option>
          <option value="Cloud DevOps Engineer">Cloud DevOps Engineer</option>
        </select>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #8B5CF6 100%)', color: '#FFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Target Role Selected</div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF' }}>{data?.targetRole || targetRole}</h2>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2.4rem', fontWeight: 800 }}>{data?.overallSkillMatchPercentage || 78}%</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Overall Skill Match</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '16px' }}>
              <Target size={20} style={{ color: '#4F46E5' }} /> Skill Requirement Matrix
            </h3>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Skill & Concept</th>
                    <th>Required Level</th>
                    <th>Your Verified Level</th>
                    <th>Actionable Recommendation</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.skillsMatrix?.map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 700 }}>{row.skill}</td>
                      <td><span className="badge badge-tag">{row.requiredLevel}</span></td>
                      <td>
                        <span className={`badge ${row.isMatch ? 'badge-selected' : 'badge-rejected'}`}>
                          {row.studentLevel}
                        </span>
                      </td>
                      <td style={{ color: '#64748B', fontSize: '0.875rem' }}>{row.recommendation}</td>
                      <td>
                        <button className="btn btn-outline btn-sm" onClick={() => navigate('/student/practice')}>
                          Start Practice <ArrowRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default SkillGapAnalyzer;

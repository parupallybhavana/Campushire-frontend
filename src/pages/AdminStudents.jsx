import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import axiosInstance from '../api/axiosInstance';
import { Search, User, Mail, GraduationCap, Award, X, Eye, Briefcase, Code2 } from 'lucide-react';

function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, [search]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/admin/students', {
        params: search ? { search } : {}
      });
      setStudents(res.data || []);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'S';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getBranchColor = (branch) => {
    const colors = {
      'CSE': '#4F46E5', 'ECE': '#0891B2', 'ME': '#D97706',
      'CE': '#059669', 'IT': '#7C3AED', 'EE': '#DC2626'
    };
    const key = Object.keys(colors).find(k => branch?.includes(k));
    return colors[key] || '#64748B';
  };

  return (
    <AppLayout>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Registered Students
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
            {students.length} student profiles registered on the platform
          </p>
        </div>
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, email, branch..."
            style={{ paddingLeft: '42px' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="spinner" style={{ margin: '80px auto' }} />
      ) : students.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {students.map((student) => (
            <div
              key={student.id}
              className="square-card"
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}
            >
              {/* Avatar & Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '56px', height: '56px',
                  borderRadius: '14px',
                  background: `linear-gradient(135deg, ${getBranchColor(student.branch)} 0%, #8B5CF6 100%)`,
                  color: '#FFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '1.2rem',
                  flexShrink: 0
                }}>
                  {getInitials(student.name)}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {student.name || 'Unknown'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {student.email}
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px' }}>Branch</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{student.branch || 'N/A'}</div>
                </div>
                <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px' }}>CGPA</div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: student.cgpa >= 7.5 ? '#059669' : student.cgpa >= 6 ? '#D97706' : '#DC2626' }}>
                    {student.cgpa != null ? Number(student.cgpa).toFixed(2) : 'N/A'}
                  </div>
                </div>
                <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px' }}>Grad Year</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{student.graduationYear || 'N/A'}</div>
                </div>
                <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px' }}>Backlogs</div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: student.backlogs > 0 ? '#DC2626' : '#059669' }}>
                    {student.backlogs || 0}
                  </div>
                </div>
              </div>

              {/* Skills */}
              {student.skills && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {student.skills.split(',').slice(0, 4).map((skill, i) => (
                    <span key={i} style={{
                      background: 'rgba(79, 70, 229, 0.08)',
                      color: 'var(--primary)',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: '20px',
                      border: '1px solid rgba(79, 70, 229, 0.2)'
                    }}>{skill.trim()}</span>
                  ))}
                  {student.skills.split(',').length > 4 && (
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', padding: '3px 6px' }}>
                      +{student.skills.split(',').length - 4} more
                    </span>
                  )}
                </div>
              )}

              {/* View Button */}
              <button
                className="btn btn-outline btn-sm"
                style={{ width: '100%', marginTop: '4px' }}
                onClick={() => setSelectedStudent(student)}
              >
                <Eye size={14} style={{ marginRight: '6px' }} /> View Full Profile
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <User size={48} style={{ margin: '0 auto 16px auto', opacity: 0.3 }} />
          <h3 style={{ fontWeight: 800, marginBottom: '8px' }}>No Students Found</h3>
          <p style={{ fontSize: '0.9rem' }}>No registered students match your search criteria.</p>
        </div>
      )}

      {/* Student Profile Modal */}
      {selectedStudent && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 3000, padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            width: '100%', maxWidth: '600px',
            maxHeight: '90vh', overflowY: 'auto',
            padding: '32px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.25)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E293B' }}>Student Full Profile</h2>
              <button
                onClick={() => setSelectedStudent(null)}
                style={{ background: '#F1F5F9', border: 'none', cursor: 'pointer', borderRadius: '8px', padding: '8px', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Avatar + Name */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '18px',
              marginBottom: '24px', padding: '20px',
              background: 'linear-gradient(135deg, rgba(79,70,229,0.06) 0%, rgba(139,92,246,0.06) 100%)',
              borderRadius: '14px', border: '1px solid rgba(79,70,229,0.1)'
            }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '18px', flexShrink: 0,
                background: `linear-gradient(135deg, ${getBranchColor(selectedStudent.branch)} 0%, #8B5CF6 100%)`,
                color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '1.6rem'
              }}>
                {getInitials(selectedStudent.name)}
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1E293B' }}>{selectedStudent.name}</h3>
                <p style={{ color: '#64748B', fontSize: '0.9rem' }}>{selectedStudent.email}</p>
                {selectedStudent.phone && <p style={{ color: '#64748B', fontSize: '0.85rem', marginTop: '2px' }}>📞 {selectedStudent.phone}</p>}
              </div>
            </div>

            {/* Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              {[
                { label: 'Degree', value: selectedStudent.degree || 'B.Tech' },
                { label: 'Branch', value: selectedStudent.branch || 'Not specified' },
                { label: 'CGPA', value: selectedStudent.cgpa != null ? Number(selectedStudent.cgpa).toFixed(2) : 'N/A', color: selectedStudent.cgpa >= 7.5 ? '#059669' : '#D97706' },
                { label: 'Graduation Year', value: selectedStudent.graduationYear || 'N/A' },
                { label: 'Active Backlogs', value: selectedStudent.backlogs || 0, color: selectedStudent.backlogs > 0 ? '#DC2626' : '#059669' },
                { label: 'Phone', value: selectedStudent.phone || 'Not provided' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ background: '#F8FAFC', borderRadius: '12px', padding: '14px 16px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{label}</div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: color || '#1E293B' }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Skills */}
            {selectedStudent.skills && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>Technical Skills</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedStudent.skills.split(',').map((skill, i) => (
                    <span key={i} style={{
                      background: 'rgba(79,70,229,0.08)', color: '#4F46E5',
                      fontSize: '0.8rem', fontWeight: 600,
                      padding: '4px 10px', borderRadius: '20px',
                      border: '1px solid rgba(79,70,229,0.2)'
                    }}>{skill.trim()}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {selectedStudent.projects && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>Projects</div>
                <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '12px 14px', fontSize: '0.9rem', color: '#334155', whiteSpace: 'pre-wrap' }}>
                  {selectedStudent.projects}
                </div>
              </div>
            )}

            {/* Certifications */}
            {selectedStudent.certifications && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>Certifications</div>
                <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '12px 14px', fontSize: '0.9rem', color: '#334155', whiteSpace: 'pre-wrap' }}>
                  {selectedStudent.certifications}
                </div>
              </div>
            )}

            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={() => setSelectedStudent(null)}
            >
              Close Profile
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default AdminStudents;

import React, { useState, useEffect, useRef } from 'react';
import AppLayout from '../components/AppLayout';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { 
  User, Mail, Award, GraduationCap, Edit3, Save, X, Upload, 
  FileText, Trash2, Download, CheckCircle, AlertCircle, Phone, 
  BookOpen, Code2 
} from 'lucide-react';

const StudentProfile = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [resume, setResume] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    name: '', phone: '', branch: '', degree: '',
    cgpa: '', graduationYear: '', backlogs: 0,
    skills: '', projects: '', certifications: ''
  });

  useEffect(() => { fetchProfile(); fetchResume(); }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/students/profile');
      const d = res.data;
      setProfile(d);
      setFormData({
        name: d.name || '',
        phone: d.phone || '',
        branch: d.branch || '',
        degree: d.degree || 'B.Tech',
        cgpa: d.cgpa != null ? d.cgpa : '',
        graduationYear: d.graduationYear || '',
        backlogs: d.backlogs || 0,
        skills: d.skills || '',
        projects: d.projects || '',
        certifications: d.certifications || ''
      });
    } catch (err) {
      setMessage({ type: 'danger', text: 'Failed to load profile.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchResume = async () => {
    try {
      const res = await axiosInstance.get('/resumes/latest');
      setResume(res.data?.hasResume === false ? null : res.data);
    } catch (err) {
      setResume(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    const cgpaVal = parseFloat(formData.cgpa);
    if (isNaN(cgpaVal) || cgpaVal < 0 || cgpaVal > 10) {
      setMessage({ type: 'danger', text: 'CGPA must be between 0.0 and 10.0' });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...formData,
        cgpa: cgpaVal,
        graduationYear: parseInt(formData.graduationYear),
        backlogs: parseInt(formData.backlogs) || 0
      };
      const res = await axiosInstance.put('/students/profile', payload);
      setProfile(res.data);
      if (updateUser) updateUser({ name: res.data.name });
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setMessage({ type: 'danger', text: 'Only PDF files are accepted for resume upload.' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'danger', text: 'Resume file size must be under 5MB.' });
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await axiosInstance.post('/resumes/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResume(res.data);
      setMessage({ type: 'success', text: 'Resume uploaded successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    } catch (err) {
      setMessage({ type: 'danger', text: 'Failed to upload resume. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  const handleResumeDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your current resume?')) return;
    try {
      await axiosInstance.delete('/resumes/latest');
      setResume(null);
      setMessage({ type: 'success', text: 'Resume deleted successfully.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'danger', text: 'Failed to delete resume.' });
    }
  };

  const handleResumeDownload = () => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:8080/api/resumes/latest/download', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = resume?.filename || 'resume.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(() => setMessage({ type: 'danger', text: 'Failed to download resume.' }));
  };

  if (loading) return <AppLayout><div className="spinner" /></AppLayout>;

  return (
    <AppLayout>
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>My Profile</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Manage your academic credentials and placement readiness information</p>
          </div>
          {!isEditing ? (
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              <Edit3 size={16} style={{ marginRight: '6px' }} /> Edit Profile
            </button>
          ) : (
            <button className="btn btn-outline" onClick={() => setIsEditing(false)}>
              <X size={16} style={{ marginRight: '6px' }} /> Cancel
            </button>
          )}
        </div>

        {/* Alert */}
        {message.text && (
          <div className="card" style={{
            padding: '12px 18px', marginBottom: '20px',
            background: message.type === 'success' ? '#DEF7EC' : '#FDE8E8',
            color: message.type === 'success' ? '#03543F' : '#9B1C1C',
            display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span style={{ fontWeight: 600 }}>{message.text}</span>
          </div>
        )}

        {/* Profile Avatar Card */}
        <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--purple) 100%)',
              color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.8rem', fontWeight: 800, flexShrink: 0
            }}>
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{profile?.name}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{profile?.email}</p>
              <span className="badge badge-applied" style={{ marginTop: '6px' }}>
                {profile?.degree || 'B.Tech'} — {profile?.branch || 'Computer Science'}
              </span>
            </div>
          </div>
        </div>

        {!isEditing ? (
          /* VIEW MODE */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontWeight: 800, marginBottom: '16px', fontSize: '1.05rem', color: 'var(--primary)' }}>Academic & Contact Details</h3>
              <div className="grid-3" style={{ gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Phone</div>
                  <div style={{ fontWeight: 700 }}>{profile?.phone || 'Not provided'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Degree</div>
                  <div style={{ fontWeight: 700 }}>{profile?.degree || 'B.Tech'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Branch</div>
                  <div style={{ fontWeight: 700 }}>{profile?.branch || 'N/A'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '2px' }}>CGPA</div>
                  <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>
                    {profile?.cgpa != null ? Number(profile.cgpa).toFixed(2) : 'N/A'} / 10.0
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Graduation Year</div>
                  <div style={{ fontWeight: 700 }}>{profile?.graduationYear || 'N/A'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Active Backlogs</div>
                  <div style={{ fontWeight: 700 }}>
                    <span className={`badge ${profile?.backlogs > 0 ? 'badge-rejected' : 'badge-selected'}`}>
                      {profile?.backlogs || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontWeight: 800, marginBottom: '12px', fontSize: '1.05rem', color: 'var(--primary)' }}>Technical Skills</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {profile?.skills ? (
                  profile.skills.split(',').map((s, i) => (
                    <span key={i} className="badge badge-tag">{s.trim()}</span>
                  ))
                ) : <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No skills listed yet</span>}
              </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontWeight: 800, marginBottom: '12px', fontSize: '1.05rem', color: 'var(--primary)' }}>Projects</h3>
              {profile?.projects ? (
                <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-main)', lineHeight: 1.6 }}>{profile.projects}</p>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
                  No projects added yet. Click &ldquo;Edit Profile&rdquo; to add your academic & capstone projects.
                </p>
              )}
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontWeight: 800, marginBottom: '12px', fontSize: '1.05rem', color: 'var(--primary)' }}>Certifications</h3>
              {profile?.certifications ? (
                <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-main)', lineHeight: 1.6 }}>{profile.certifications}</p>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
                  No certifications listed yet. Click &ldquo;Edit Profile&rdquo; to showcase your certificates.
                </p>
              )}
            </div>

            {/* Resume Section */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontWeight: 800, marginBottom: '16px', fontSize: '1.05rem', color: 'var(--primary)' }}>
                <FileText size={18} style={{ marginRight: '8px' }} />
                Resume (PDF)
              </h3>
              {resume ? (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 18px', borderRadius: '10px', border: '1px solid #BBF7D0',
                  background: '#F0FDF4'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FileText size={22} color="var(--success)" />
                    <div>
                      <div style={{ fontWeight: 700 }}>{resume.filename || 'resume.pdf'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Uploaded: {resume.uploadedAt ? new Date(resume.uploadedAt).toLocaleDateString() : 'Recently'}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-outline btn-sm" onClick={handleResumeDownload}>
                      <Download size={14} style={{ marginRight: '4px' }} /> Download
                    </button>
                    <button className="btn btn-outline btn-sm" style={{ color: '#EF4444' }} onClick={handleResumeDelete}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{
                  border: '2px dashed var(--border-color)',
                  borderRadius: '12px', padding: '32px',
                  textAlign: 'center', cursor: 'pointer'
                }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={32} color="var(--primary)" style={{ marginBottom: '10px' }} />
                  <div style={{ fontWeight: 700, marginBottom: '4px' }}>Upload Your Resume (PDF)</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Max 5MB • PDF format only</div>
                  <button className="btn btn-primary btn-sm" style={{ marginTop: '14px' }} disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Select PDF Resume'}
                  </button>
                </div>
              )}
              <input
                type="file" accept=".pdf" ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleResumeUpload}
              />
              {resume && (
                <button
                  className="btn btn-outline btn-sm"
                  style={{ marginTop: '12px' }}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload size={14} style={{ marginRight: '4px' }} />
                  {uploading ? 'Uploading...' : 'Replace Resume'}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* EDIT MODE */
          <form onSubmit={handleSave}>
            <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
              <h3 style={{ fontWeight: 800, marginBottom: '20px', fontSize: '1.05rem', color: 'var(--primary)' }}>Edit Profile Information</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="grid-2" style={{ gap: '16px' }}>
                  <div>
                    <label className="form-label">Full Name *</label>
                    <input type="text" name="name" required className="form-control" value={formData.name} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="form-label">Phone Number</label>
                    <input type="text" name="phone" className="form-control" placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={handleChange} />
                  </div>
                </div>

                <div className="grid-2" style={{ gap: '16px' }}>
                  <div>
                    <label className="form-label">Degree</label>
                    <select name="degree" className="form-control" value={formData.degree} onChange={handleChange}>
                      <option>B.Tech</option>
                      <option>B.E</option>
                      <option>M.Tech</option>
                      <option>MCA</option>
                      <option>BCA</option>
                      <option>MBA</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Branch *</label>
                    <input type="text" name="branch" required className="form-control" placeholder="e.g., Computer Science" value={formData.branch} onChange={handleChange} />
                  </div>
                </div>

                <div className="grid-3" style={{ gap: '16px' }}>
                  <div>
                    <label className="form-label">CGPA (0.0 to 10.0) *</label>
                    <input type="number" step="0.01" min="0" max="10" name="cgpa" required className="form-control" value={formData.cgpa} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="form-label">Graduation Year *</label>
                    <input type="number" name="graduationYear" required className="form-control" placeholder="2025" value={formData.graduationYear} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="form-label">Active Backlogs</label>
                    <input type="number" name="backlogs" min="0" className="form-control" value={formData.backlogs} onChange={handleChange} />
                  </div>
                </div>

                <div>
                  <label className="form-label">Technical Skills (Comma separated)</label>
                  <textarea name="skills" className="form-control" rows="2" placeholder="Java, Spring Boot, React, MySQL, Python..." value={formData.skills} onChange={handleChange} />
                </div>

                <div>
                  <label className="form-label">Projects (Brief description)</label>
                  <textarea name="projects" className="form-control" rows="3" placeholder="1. Campus Placement System — Spring Boot, React, MySQL — automated eligibility checks&#10;2. E-Commerce API — REST, JWT authentication" value={formData.projects} onChange={handleChange} />
                </div>

                <div>
                  <label className="form-label">Certifications</label>
                  <textarea name="certifications" className="form-control" rows="2" placeholder="AWS Cloud Practitioner, Oracle Java SE 11, Coursera ML Specialization..." value={formData.certifications} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <Save size={16} style={{ marginRight: '6px' }} />
                {saving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </AppLayout>
  );
};

export default StudentProfile;

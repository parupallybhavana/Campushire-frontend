import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import axiosInstance from '../api/axiosInstance';
import { FileText, Upload, CheckCircle2, AlertCircle, Sparkles, Download, ListChecks } from 'lucide-react';

function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const res = await axiosInstance.get('/resumes/latest');
      if (res.data && res.data.hasResume) {
        setResumeData(res.data);
      }
    } catch (err) {
      console.error('Failed to load resume info:', err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      setMsg('');
      const res = await axiosInstance.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMsg('Resume uploaded & analyzed successfully!');
      fetchResume();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to upload resume.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <AppLayout>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', color: '#1E293B' }}>Resume Analyzer & ATS Checker</h1>
        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Upload your PDF resume to extract skills, evaluate ATS keywords, and get instant feedback.</p>
      </div>

      <div className="grid-2">
        {/* Left Column: Upload Form */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '16px' }}>
            <Upload size={20} style={{ color: '#4F46E5' }} /> Upload PDF / DOCX Resume
          </h3>

          {msg && <div className="alert alert-info">{msg}</div>}

          <form onSubmit={handleUpload}>
            <div style={{
              border: '2px dashed #CBD5E1',
              borderRadius: '14px',
              padding: '30px',
              textAlign: 'center',
              backgroundColor: '#FAFAFD',
              marginBottom: '16px',
              cursor: 'pointer'
            }}>
              <FileText size={40} style={{ color: '#4F46E5', marginBottom: '10px' }} />
              <p style={{ fontWeight: 600, color: '#1E293B', margin: 0 }}>
                {file ? file.name : 'Click or Drag PDF/DOCX resume file here'}
              </p>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Maximum size: 5MB</span>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                style={{ marginTop: '12px' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={uploading || !file}>
              {uploading ? 'Analyzing Resume...' : 'Analyze Resume'}
            </button>
          </form>
        </div>

        {/* Right Column: Feedback & Extraction */}
        {resumeData ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 className="card-title"><Sparkles size={20} style={{ color: '#8B5CF6' }} /> ATS Keyword Match</h3>
                <div className="badge badge-selected" style={{ fontSize: '1rem', padding: '6px 14px' }}>
                  {resumeData.completenessScore}% Score
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <strong style={{ fontSize: '0.875rem', color: '#1E293B' }}>Detected Technical Skills:</strong>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                  {resumeData.extractedSkills?.map((sk, idx) => (
                    <span key={idx} className="badge badge-shortlisted">{sk}</span>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '14px' }}>
                <strong style={{ fontSize: '0.875rem', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ListChecks size={16} /> Completeness Checklist:
                </strong>
                <ul style={{ fontSize: '0.85rem', color: '#475569', paddingLeft: '18px', marginTop: '8px' }}>
                  {resumeData.checklist?.map((c, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="card empty-state">
            <FileText size={40} style={{ color: '#94A3B8' }} />
            <h4>No resume uploaded yet.</h4>
            <p>Upload your PDF resume on the left to extract skills and view feedback.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default ResumeAnalyzer;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { UserPlus, User, Mail, Lock, GraduationCap, Award, Calendar, Code, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    branch: 'Computer Science & Engineering',
    degree: 'B.Tech / B.E',
    cgpa: '',
    graduationYear: 2025,
    skills: ''
  });

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!formData.email.trim()) {
      setError('Please enter a valid email address.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    const cgpaVal = formData.cgpa ? parseFloat(formData.cgpa) : null;
    if (cgpaVal !== null && (isNaN(cgpaVal) || cgpaVal < 0 || cgpaVal > 10)) {
      setError('CGPA must be a number between 0.0 and 10.0');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        branch: formData.branch,
        cgpa: cgpaVal,
        graduationYear: parseInt(formData.graduationYear) || 2025,
        skills: formData.skills.trim()
      };

      await axiosInstance.post('/auth/register', payload);
      
      setSuccessMsg('Registration successful! Redirecting to student login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response && err.response.data && typeof err.response.data === 'object') {
        const firstErr = Object.values(err.response.data)[0];
        setError(firstErr || 'Registration failed.');
      } else {
        setError('Failed to register. Email may already be in use or server is unreachable.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F5FA', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ maxWidth: '600px', width: '100%', margin: '0 auto' }}>
        <div style={{ marginBottom: '20px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '0.9rem', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to Public Home
          </Link>
        </div>

        <div className="card" style={{ padding: '40px', background: '#FFFFFF', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #4F46E5 0%, #8B5CF6 100%)',
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
            }}>
              <UserPlus size={26} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1E293B' }}>Create Student Account</h2>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '6px' }}>
              Fill in your details to register for campus placement drives
            </p>
          </div>

          {error && (
            <div style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#DC2626', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', color: '#047857', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '40px' }}
                  placeholder="Rahul Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  style={{ paddingLeft: '40px' }}
                  placeholder="rahul@college.edu"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="form-control"
                    style={{ paddingLeft: '40px' }}
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className="form-control"
                    style={{ paddingLeft: '40px' }}
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label htmlFor="branch">Branch *</label>
                <select
                  id="branch"
                  name="branch"
                  className="form-control"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                >
                  <option value="Computer Science & Engineering">CSE</option>
                  <option value="Information Technology">IT</option>
                  <option value="Electronics & Communication">ECE</option>
                  <option value="Electrical Engineering">EEE</option>
                  <option value="Mechanical Engineering">Mech</option>
                  <option value="Civil Engineering">Civil</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="cgpa">CGPA (0 - 10)</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="cgpa"
                    name="cgpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    className="form-control"
                    style={{ paddingLeft: '38px' }}
                    placeholder="8.50"
                    value={formData.cgpa}
                    onChange={handleChange}
                  />
                  <Award size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="graduationYear">Graduation Year</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="graduationYear"
                    name="graduationYear"
                    type="number"
                    className="form-control"
                    style={{ paddingLeft: '38px' }}
                    placeholder="2025"
                    value={formData.graduationYear}
                    onChange={handleChange}
                  />
                  <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                </div>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label htmlFor="skills">Technical Skills (Comma separated)</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="skills"
                  name="skills"
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '40px' }}
                  placeholder="Java, Spring Boot, React, SQL, Python"
                  value={formData.skills}
                  onChange={handleChange}
                />
                <Code size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '1rem', fontWeight: 700 }} disabled={loading}>
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>

          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #F1F5F9', textAlign: 'center' }}>
            <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
              Already registered?{' '}
              <Link to="/login" style={{ fontWeight: 700, color: '#4F46E5' }}>
                Sign In to Student Portal
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;


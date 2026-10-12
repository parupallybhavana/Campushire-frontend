import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { LogIn, Mail, Lock, AlertCircle, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const { token, user } = response.data;

      // Block admins from using student login
      if (user.role === 'ADMIN' || user.role === 'ROLE_ADMIN') {
        setError('This account has administrator privileges. Please use the Admin Portal Login instead.');
        setLoading(false);
        return;
      }

      login(token, user);
      navigate('/student/dashboard');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please verify your credentials or ensure the backend server is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F5FA', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ maxWidth: '440px', width: '100%', margin: '0 auto' }}>
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
              <LogIn size={26} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1E293B' }}>Student Login</h2>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '6px' }}>
              Sign in to explore campus drives & track applications
            </p>
          </div>

          {error && (
            <div style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#DC2626', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="student-email">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="student-email"
                  type="email"
                  className="form-control"
                  style={{ paddingLeft: '40px' }}
                  placeholder="student@campushire.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label htmlFor="student-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="student-password"
                  type="password"
                  className="form-control"
                  style={{ paddingLeft: '40px' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '1rem', fontWeight: 700 }} disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In to Student Portal'}
            </button>
          </form>

          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #F1F5F9', textAlign: 'center' }}>
            <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ fontWeight: 700, color: '#4F46E5' }}>
                Create Student Account
              </Link>
            </p>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '10px' }}>
              Are you an administrator?{' '}
              <Link to="/admin/login" style={{ fontWeight: 600, color: '#8B5CF6' }}>
                Admin Portal Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


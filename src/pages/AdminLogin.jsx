import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { ShieldCheck, Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';

const AdminLogin = () => {
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
      const response = await axiosInstance.post('/auth/admin/login', { email, password });
      const { token, user } = response.data;

      const isAdmin = user.role === 'ADMIN' || user.role === 'ROLE_ADMIN';
      if (!isAdmin) {
        setError('Access Denied: You do not have administrator permissions.');
        setLoading(false);
        return;
      }

      login(token, user);
      navigate('/admin/dashboard');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Admin authentication failed. Please verify credentials or backend connection.');
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

        <div className="card" style={{ padding: '40px', background: '#FFFFFF', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', borderTop: '4px solid #8B5CF6' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #4F46E5 100%)',
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}>
              <ShieldCheck size={28} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1E293B' }}>Admin Portal Login</h2>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '6px' }}>
              Placement Officers & Administrators Only
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
              <label htmlFor="admin-email">Admin Email or Username</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="admin-email"
                  type="email"
                  className="form-control"
                  style={{ paddingLeft: '40px' }}
                  placeholder="admin@campushire.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label htmlFor="admin-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="admin-password"
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

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '1rem', fontWeight: 700, background: 'linear-gradient(135deg, #8B5CF6 0%, #4F46E5 100%)' }}
              disabled={loading}
            >
              {loading ? 'Authenticating Admin...' : 'Sign In to Admin Portal'}
            </button>
          </form>

          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #F1F5F9', textAlign: 'center' }}>
            <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
              Are you a Student?{' '}
              <Link to="/login" style={{ fontWeight: 700, color: '#4F46E5' }}>
                Student Login Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;


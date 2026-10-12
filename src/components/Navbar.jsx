import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  Briefcase, 
  User, 
  FileCheck, 
  Building2, 
  LogOut, 
  LogIn, 
  UserPlus, 
  CheckSquare 
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, sticky: 'top', zIndex: 1000 }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
            padding: '8px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)'
          }}>
            <GraduationCap size={24} color="#ffffff" />
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' }} className="gradient-text">
            CampusHire
          </span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {!user ? (
            <>
              <Link 
                to="/" 
                className={`btn btn-secondary ${isActive('/') ? 'active' : ''}`}
                style={{ background: isActive('/') ? 'rgba(255, 255, 255, 0.1)' : 'transparent', border: 'none' }}
              >
                Home
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <LogIn size={16} /> Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserPlus size={16} /> Register
              </Link>
            </>
          ) : (user.role === 'ADMIN' || user.role === 'ROLE_ADMIN') ? (
            <>
              <Link 
                to="/admin/companies" 
                className="btn btn-secondary btn-sm"
                style={{ borderColor: isActive('/admin/companies') ? 'var(--primary)' : 'var(--border-light)' }}
              >
                <Building2 size={16} /> Companies
              </Link>
              <Link 
                to="/admin/drives" 
                className="btn btn-secondary btn-sm"
                style={{ borderColor: isActive('/admin/drives') ? 'var(--primary)' : 'var(--border-light)' }}
              >
                <Briefcase size={16} /> Placement Drives
              </Link>
              <Link 
                to="/admin/applications" 
                className="btn btn-secondary btn-sm"
                style={{ borderColor: isActive('/admin/applications') ? 'var(--primary)' : 'var(--border-light)' }}
              >
                <CheckSquare size={16} /> Applications
              </Link>

              <div style={{ height: '24px', width: '1px', background: 'var(--border-light)', margin: '0 6px' }} />

              <span className="badge badge-shortlisted" style={{ padding: '6px 12px' }}>
                ADMIN
              </span>
              
              <button onClick={handleLogout} className="btn btn-danger btn-sm" title="Logout">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/student/jobs" 
                className="btn btn-secondary btn-sm"
                style={{ borderColor: isActive('/student/jobs') ? 'var(--primary)' : 'var(--border-light)' }}
              >
                <Briefcase size={16} /> Placement Jobs
              </Link>
              <Link 
                to="/student/applications" 
                className="btn btn-secondary btn-sm"
                style={{ borderColor: isActive('/student/applications') ? 'var(--primary)' : 'var(--border-light)' }}
              >
                <FileCheck size={16} /> My Applications
              </Link>
              <Link 
                to="/student/profile" 
                className="btn btn-secondary btn-sm"
                style={{ borderColor: isActive('/student/profile') ? 'var(--primary)' : 'var(--border-light)' }}
              >
                <User size={16} /> My Profile
              </Link>

              <div style={{ height: '24px', width: '1px', background: 'var(--border-light)', margin: '0 6px' }} />

              <span className="badge badge-applied" style={{ padding: '6px 12px' }}>
                {user.name ? user.name.split(' ')[0] : 'Student'}
              </span>

              <button onClick={handleLogout} className="btn btn-danger btn-sm" title="Logout">
                <LogOut size={16} /> Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

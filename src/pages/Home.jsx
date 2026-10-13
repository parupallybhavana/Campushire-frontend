import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, Building2, Briefcase, Code2, ArrowRight, ShieldCheck, 
  CheckCircle2, Users, Award, TrendingUp, HelpCircle, BookOpen, 
  Mail, Phone, MapPin, User, Menu, X
} from 'lucide-react';

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [featuredCompanies, setFeaturedCompanies] = useState([]);
  const [latestDrives, setLatestDrives] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingDrives, setLoadingDrives] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    axiosInstance.get('/companies')
      .then(res => setFeaturedCompanies(res.data ? res.data.slice(0, 3) : []))
      .catch(() => setFeaturedCompanies([]))
      .finally(() => setLoadingCompanies(false));

    axiosInstance.get('/drives')
      .then(res => setLatestDrives(res.data ? res.data.slice(0, 3) : []))
      .catch(() => {
        // Fallback to /jobs if /drives returns differently
        axiosInstance.get('/jobs')
          .then(r => setLatestDrives(r.data ? r.data.slice(0, 3) : []))
          .catch(() => setLatestDrives([]));
      })
      .finally(() => setLoadingDrives(false));
  }, []);

  const handleDriveClick = () => {
    if (user) {
      navigate('/student/jobs');
    } else {
      navigate('/login');
    }
  };

  const handlePracticeClick = () => {
    if (user) {
      navigate('/student/practice');
    } else {
      navigate('/login');
    }
  };

  const handleCompaniesClick = () => {
    if (user) {
      navigate('/student/companies');
    } else {
      navigate('/login');
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
      {/* 1. Public Navigation Bar */}
      <header className={`public-header ${mobileMenuOpen ? 'menu-open' : ''}`} style={{
        height: '75px', backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border-color)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 5%',
        position: 'sticky', top: 0, zIndex: 100, boxShadow: 'var(--shadow-sm)'
      }}>
        {/* Brand Logo */}
        <div className="public-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--primary) 0%, var(--purple) 100%)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={22} />
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.03em' }}>
            Campus<span style={{ color: 'var(--purple)' }}>Hire</span>
          </span>
        </div>

        <button
          type="button"
          className="public-menu-toggle"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(open => !open)}
        >
          {mobileMenuOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
        </button>

        {/* Navigation Links */}
        <nav className="public-nav">
          <Link className="public-nav-link active" to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <button className="public-nav-link" onClick={() => { setMobileMenuOpen(false); handleCompaniesClick(); }}>Companies</button>
          <button className="public-nav-link" onClick={() => { setMobileMenuOpen(false); handleDriveClick(); }}>Placement Drives</button>
          <button className="public-nav-link" onClick={() => { setMobileMenuOpen(false); handlePracticeClick(); }}>Practice Zone</button>
        </nav>

        {/* Action Buttons */}
        <div className="public-actions">
          <button className="btn btn-outline btn-sm" onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}>Student Login</button>
          <button className="btn btn-secondary btn-sm" onClick={() => { setMobileMenuOpen(false); navigate('/admin/login'); }}>Admin Login</button>
          <button className="btn btn-primary btn-sm" onClick={() => { setMobileMenuOpen(false); navigate('/register'); }}>Register</button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="home-hero" style={{ padding: '80px 5%', textAlign: 'center', background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F5FA 100%)' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <span className="badge badge-shortlisted" style={{ padding: '8px 18px', fontSize: '0.85rem', marginBottom: '20px' }}>
            <Sparkles size={16} /> Intelligent Placement & Career Development Platform
          </span>

          <h1 className="home-hero-title" style={{ fontSize: '3.2rem', fontWeight: 800, lineHeight: 1.15, color: 'var(--text-main)', margin: '16px 0' }}>
            Discover. Prepare. Apply. <span style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--purple) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Get Hired.</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '32px' }}>
            Your placement journey starts here. Explore companies, discover job opportunities, practice interview questions, and track your applications in one place.
          </p>

          <div className="home-hero-actions" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" style={{ padding: '14px 28px', fontSize: '1rem' }} onClick={handleDriveClick}>
              Explore Placement Drives <ArrowRight size={18} />
            </button>
            <button className="btn btn-outline btn-lg" style={{ padding: '14px 28px', fontSize: '1rem' }} onClick={() => navigate('/login')}>
              Student Login
            </button>
            <button className="btn btn-secondary btn-lg" style={{ padding: '14px 28px', fontSize: '1rem' }} onClick={() => navigate('/admin/login')}>
              Admin Login
            </button>
            <button className="btn btn-outline btn-lg" style={{ padding: '14px 28px', fontSize: '1rem', borderColor: '#10B981', color: '#10B981' }} onClick={() => navigate('/register')}>
              Create Account
            </button>
          </div>
        </div>
      </section>

      {/* 3. About CampusHire */}
      <section className="home-section" style={{ padding: '60px 5%', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="card" style={{ padding: '40px', background: '#FFFFFF', borderRadius: 'var(--radius-lg)' }}>
          <div className="home-split-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
            <div>
              <span className="badge badge-tag" style={{ color: 'var(--primary)', marginBottom: '12px' }}>About CampusHire</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '16px' }}>
                Centralized Placement & Career Readiness
              </h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '20px' }}>
                CampusHire bridges the gap between ambitious students and top corporate recruiters. Our platform simplifies drive eligibility verification, single-click application tracking, technical skill evaluation, and recruitment status updates.
              </p>
              <div className="home-benefits-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 color="var(--success)" size={20} />
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Real-time CGPA Eligibility</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 color="var(--success)" size={20} />
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Automated Status Tracking</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 color="var(--success)" size={20} />
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Mock Test Assessment</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 color="var(--success)" size={20} />
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Direct PDF Resume Management</span>
                </div>
              </div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.06) 0%, rgba(139,92,246,0.06) 100%)', padding: '36px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px' }}>100%</div>
              <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>Verified Corporate Placement Drives</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Direct integration with college placement cells ensuring accurate deadlines and eligibility criteria.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works */}
      <section className="home-section" style={{ padding: '60px 5%', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>How It Works</h2>
          <p style={{ color: 'var(--text-muted)' }}>5 simple steps to launch your campus placement career</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', textAlign: 'center' }}>
          {[
            { step: '1', title: 'Discover', desc: 'Explore top recruiters & active placement drives' },
            { step: '2', title: 'Prepare', desc: 'Practise technical, aptitude & HR questions' },
            { step: '3', title: 'Apply', desc: 'Check eligibility & submit job application' },
            { step: '4', title: 'Track', desc: 'Follow stage-by-stage application timeline' },
            { step: '5', title: 'Get Hired', desc: 'Ace mock tests and secure your job offer' }
          ].map(item => (
            <div key={item.step} className="card" style={{ padding: '24px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--primary)', color: '#FFF', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                {item.step}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px' }}>{item.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Explore Companies */}
      <section className="home-section" style={{ padding: '60px 5%', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="home-section-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Explore Companies</h2>
            <p style={{ color: 'var(--text-muted)' }}>Partner corporations organizing placement drives</p>
          </div>
          <button className="btn btn-outline" onClick={handleCompaniesClick}>
            View All Companies <ArrowRight size={16} />
          </button>
        </div>

        {loadingCompanies ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>Loading hiring partners...</div>
        ) : featuredCompanies.length > 0 ? (
          <div className="grid-3">
            {featuredCompanies.map(c => (
              <div key={c.id} className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--primary) 0%, var(--purple) 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem' }}>
                    {c.name ? c.name.charAt(0) : 'C'}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{c.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.industry || 'Technology'}</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {c.description || 'Top recruiter conducting campus placement drives for engineering students.'}
                </p>
                <button className="btn btn-outline btn-sm" style={{ width: '100%' }} onClick={handleCompaniesClick}>
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No companies added yet. Database records will appear here automatically.
          </div>
        )}
      </section>

      {/* 6. Latest Placement Drives */}
      <section className="home-section" style={{ padding: '60px 5%', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="home-section-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Latest Placement Drives</h2>
            <p style={{ color: 'var(--text-muted)' }}>Active recruitment postings for eligible students</p>
          </div>
          <button className="btn btn-outline" onClick={handleDriveClick}>
            View All Drives <ArrowRight size={16} />
          </button>
        </div>

        {loadingDrives ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>Loading active placement drives...</div>
        ) : latestDrives.length > 0 ? (
          <div className="grid-3">
            {latestDrives.map(drive => (
              <div key={drive.id} className="card" style={{ padding: '24px' }}>
                <span className="badge badge-applied" style={{ marginBottom: '12px', display: 'inline-block' }}>
                  {drive.companyName || 'Campus Drive'}
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>{drive.roleTitle || drive.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Package: <strong style={{ color: 'var(--success)' }}>{drive.salaryPackage || drive.packageAmount || 'As per industry norms'}</strong>
                </p>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Min CGPA: <strong>{drive.minCgpa || '6.0'}</strong> | Deadline: <strong>{drive.deadline || 'Open'}</strong>
                </div>
                <button className="btn btn-primary btn-sm" style={{ width: '100%' }} onClick={handleDriveClick}>
                  Check Eligibility & Apply
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No placement drives currently published. Database records will appear here automatically.
          </div>
        )}
      </section>

      {/* 7. Practice Zone Introduction */}
      <section className="home-section" style={{ padding: '60px 5%', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="card" style={{ padding: '40px', background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', color: '#FFF', borderRadius: 'var(--radius-lg)' }}>
          <div className="home-split-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'center' }}>
            <div>
              <span className="badge" style={{ background: 'rgba(139,92,246,0.3)', color: '#C084FC', marginBottom: '12px' }}>
                <BookOpen size={14} /> Practice Zone
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFF', marginBottom: '14px' }}>
                Master Technical & Aptitude Skills
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: 1.6, marginBottom: '24px' }}>
                Prepare for campus selection rounds with curated question banks across 8 technical subjects, Quantitative Aptitude, Logical Reasoning, HR preparation, and timed Mock Tests with automatic score calculation.
              </p>
              <button className="btn btn-primary" onClick={handlePracticeClick}>
                Start Practicing Now <ArrowRight size={16} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Code2 color="var(--cyan)" size={24} />
                <h4 style={{ fontWeight: 800, marginTop: '8px', color: '#FFF' }}>Technical Prep</h4>
                <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>C, Java, Python, DBMS, SQL, OOP, OS, Data Structures</p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <TrendingUp color="var(--success)" size={24} />
                <h4 style={{ fontWeight: 800, marginTop: '8px', color: '#FFF' }}>Aptitude</h4>
                <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Percentages, Ratios, Probability, Work & Time</p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <User color="var(--purple)" size={24} />
                <h4 style={{ fontWeight: 800, marginTop: '8px', color: '#FFF' }}>HR Round</h4>
                <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Common questions & sample writing tips</p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Award color="var(--warning)" size={24} />
                <h4 style={{ fontWeight: 800, marginTop: '8px', color: '#FFF' }}>Mock Tests</h4>
                <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Timed evaluation with stored MySQL results</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Why Choose CampusHire? */}
      <section className="home-section" style={{ padding: '60px 5%', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Why Choose CampusHire?</h2>
          <p style={{ color: 'var(--text-muted)' }}>Purpose-built placement management for students and placement officers</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ background: 'rgba(79,70,229,0.1)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '16px' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>Role-Based Access Control</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Secure Spring Security JWT authorization separating Student portals from Placement Officer controls.
            </p>
          </div>

          <div className="card" style={{ padding: '28px' }}>
            <div style={{ background: 'rgba(16,185,129,0.1)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)', marginBottom: '16px' }}>
              <Award size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>Backend Eligibility Validation</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Automated validation against student CGPA, branch, graduation year, and backlog count before application submission.
            </p>
          </div>

          <div className="card" style={{ padding: '28px' }}>
            <div style={{ background: 'rgba(139,92,246,0.1)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--purple)', marginBottom: '16px' }}>
              <TrendingUp size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>Live Stage Tracking</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              7-stage recruitment tracking (`Applied`, `Under Review`, `Shortlisted`, `Assessment`, `Interview`, `Selected`, `Rejected`).
            </p>
          </div>
        </div>
      </section>

      {/* 9. Public Footer */}
      <footer style={{ backgroundColor: '#1E293B', color: '#94A3B8', padding: '50px 5% 30px 5%', borderTop: '1px solid #334155' }}>
        <div className="home-footer-grid" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '40px', marginBottom: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--primary) 0%, var(--purple) 100%)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={18} />
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFF' }}>CampusHire</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '16px' }}>
              Campus Placement Management & Career Preparation Platform. Connecting talent with top campus recruiters.
            </p>
            <p style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 700 }}>
              Tagline: "Discover. Prepare. Apply. Get Hired."
            </p>
          </div>

          <div>
            <h4 style={{ color: '#FFF', fontWeight: 700, marginBottom: '16px', fontSize: '1rem' }}>Navigation</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem' }}>
              <Link to="/" style={{ color: '#94A3B8' }}>Home</Link>
              <button onClick={handleCompaniesClick} style={{ background: 'none', border: 'none', color: '#94A3B8', textAlign: 'left', cursor: 'pointer', padding: 0 }}>Companies</button>
              <button onClick={handleDriveClick} style={{ background: 'none', border: 'none', color: '#94A3B8', textAlign: 'left', cursor: 'pointer', padding: 0 }}>Placement Drives</button>
              <button onClick={handlePracticeClick} style={{ background: 'none', border: 'none', color: '#94A3B8', textAlign: 'left', cursor: 'pointer', padding: 0 }}>Practice Zone</button>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#FFF', fontWeight: 700, marginBottom: '16px', fontSize: '1rem' }}>Portal Access</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem' }}>
              <Link to="/login" style={{ color: '#94A3B8' }}>Student Login</Link>
              <Link to="/admin/login" style={{ color: '#94A3B8' }}>Admin Login</Link>
              <Link to="/register" style={{ color: '#94A3B8' }}>Register Account</Link>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#FFF', fontWeight: 700, marginBottom: '16px', fontSize: '1rem' }}>Contact & Support</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem', color: '#94A3B8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="var(--primary)" /> support@campushire.edu
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} color="var(--success)" /> +1 (800) 555-CAMPUS
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="var(--warning)" /> University Training & Placement Cell
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '24px', borderTop: '1px solid #334155', textAlign: 'center', fontSize: '0.85rem', color: '#64748B' }}>
          © 2026 CampusHire Placement Management System. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Home;

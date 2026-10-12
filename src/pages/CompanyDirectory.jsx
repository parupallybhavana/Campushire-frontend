import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import axiosInstance from '../api/axiosInstance';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Building2, MapPin, DollarSign, Bookmark, ExternalLink, Filter } from 'lucide-react';

function CompanyDirectory() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [industryFilter, setIndustryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, [search, industryFilter, locationFilter]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (industryFilter) params.industry = industryFilter;
      if (locationFilter) params.location = locationFilter;

      const res = await axiosInstance.get('/companies', { params });
      setCompanies(res.data);
    } catch (err) {
      console.error('Failed to load companies:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async (e, companyId) => {
    e.stopPropagation();
    try {
      await axiosInstance.post(`/companies/${companyId}/save`);
      fetchCompanies();
    } catch (err) {
      console.error('Failed to bookmark company:', err);
    }
  };

  return (
    <AppLayout>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', color: '#1E293B' }}>Company Insights Hub</h1>
        <p style={{ color: '#64748B', fontSize: '0.95rem', marginTop: '4px' }}>
          Discover top recruiters, selection processes, eligibility rules, and student interview experiences before applying.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="card" style={{ marginBottom: '28px', padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label><Search size={14} /> Search Company</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Google, Microsoft..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label><Filter size={14} /> Industry</label>
            <select
              className="form-control"
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
            >
              <option value="">All Industries</option>
              <option value="Information Technology & Cloud">IT & Cloud</option>
              <option value="Software Development & Cloud">Software Development</option>
              <option value="Cloud & E-Commerce">E-Commerce & Cloud</option>
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label><MapPin size={14} /> Location</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Bangalore, Hyderabad..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      {loading ? (
        <div className="spinner" />
      ) : companies.length > 0 ? (
        <div className="grid-cards">
          {companies.map(company => (
            <div
              key={company.id}
              className="card"
              onClick={() => navigate(`/student/companies/${company.id}`)}
              style={{ cursor: 'pointer', position: 'relative', display: 'flex', flexDirection: 'column' }}
            >
              <button
                onClick={(e) => toggleBookmark(e, company.id)}
                title={company.isSaved ? "Saved" : "Save Company"}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '16px',
                  border: 'none',
                  background: company.isSaved ? '#EEF2FF' : 'transparent',
                  color: company.isSaved ? '#4F46E5' : '#94A3B8',
                  padding: '6px',
                  borderRadius: '50%',
                  cursor: 'pointer'
                }}
              >
                <Bookmark size={18} fill={company.isSaved ? '#4F46E5' : 'none'} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <img
                  src={company.logoUrl || "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=80&h=80&fit=crop&auto=format"}
                  alt={company.name}
                  style={{ width: '54px', height: '54px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #E5E7EB' }}
                />
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{company.name}</h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>{company.industry || 'Tech Recruiters'}</span>
                </div>
              </div>

              <p style={{ fontSize: '0.875rem', color: '#64748B', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '16px' }}>
                {company.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.825rem', color: '#475569', marginTop: 'auto', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} style={{ color: '#4F46E5' }} /> {company.location || 'Pan India'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <DollarSign size={14} style={{ color: '#10B981' }} /> {company.ctcPackage || 'Competitive Package'}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
                <span className="badge badge-shortlisted">
                  {company.driveCount} Active Drive{company.driveCount !== 1 ? 's' : ''}
                </span>
                <span style={{ fontSize: '0.825rem', color: '#4F46E5', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Explore Insights <ExternalLink size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Building2 size={40} style={{ color: '#94A3B8' }} />
          <h4>No companies found matching your filter.</h4>
          <p>Try clearing your search query or exploring all recruiters.</p>
          <button className="btn btn-secondary btn-sm" style={{ marginTop: '12px' }} onClick={() => { setSearch(''); setIndustryFilter(''); setLocationFilter(''); }}>
            Clear Filters
          </button>
        </div>
      )}
    </AppLayout>
  );
}

export default CompanyDirectory;

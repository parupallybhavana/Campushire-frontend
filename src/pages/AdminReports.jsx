import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import axiosInstance from '../api/axiosInstance';
import { Download, FileSpreadsheet, Users, Building2, Briefcase, FileCheck } from 'lucide-react';

function AdminReports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/admin/dashboard-stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await axiosInstance.get('/admin/reports/export', {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'campushire_placement_report.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <AppLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>Placement Reports & Analytics</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Comprehensive placement drive metrics and student application records</p>
        </div>
        <button className="btn btn-primary" onClick={handleExportCSV}>
          <Download size={18} style={{ marginRight: '6px' }} /> Export CSV Report
        </button>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : (
        <>
          <div className="grid-3" style={{ marginBottom: '30px' }}>
            <div className="stat-card">
              <div>
                <span className="stat-label">Total Registered Students</span>
                <div className="stat-number">{stats?.totalStudents || 0}</div>
              </div>
              <div className="stat-icon indigo"><Users size={24} /></div>
            </div>

            <div className="stat-card">
              <div>
                <span className="stat-label">Partner Companies</span>
                <div className="stat-number">{stats?.totalCompanies || 0}</div>
              </div>
              <div className="stat-icon violet"><Building2 size={24} /></div>
            </div>

            <div className="stat-card">
              <div>
                <span className="stat-label">Active Placement Drives</span>
                <div className="stat-number">{stats?.activeDrives || 0}</div>
              </div>
              <div className="stat-icon blue"><Briefcase size={24} /></div>
            </div>

            <div className="stat-card">
              <div>
                <span className="stat-label">Total Applications Submitted</span>
                <div className="stat-number">{stats?.totalApplications || 0}</div>
              </div>
              <div className="stat-icon amber"><FileCheck size={24} /></div>
            </div>

            <div className="stat-card">
              <div>
                <span className="stat-label">Shortlisted Candidates</span>
                <div className="stat-number" style={{ color: 'var(--success)' }}>{stats?.shortlistedStudents || 0}</div>
              </div>
              <div className="stat-icon green"><Users size={24} /></div>
            </div>

            <div className="stat-card">
              <div>
                <span className="stat-label">Selected / Placed Students</span>
                <div className="stat-number" style={{ color: 'var(--primary)' }}>{stats?.selectedStudents || 0}</div>
              </div>
              <div className="stat-icon indigo"><FileSpreadsheet size={24} /></div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Placement Drive Application Breakdown</h3>
            </div>
            {stats?.driveStats && stats.driveStats.length > 0 ? (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Placement Drive</th>
                      <th>Hiring Company</th>
                      <th>Total Student Applicants</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.driveStats.map((d, index) => (
                      <tr key={index}>
                        <td style={{ fontWeight: 700 }}>{d.driveTitle}</td>
                        <td>{d.companyName}</td>
                        <td>
                          <span className="badge badge-applied">{d.applicationsCount} applicants</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>No drive statistics available yet.</p>
              </div>
            )}
          </div>
        </>
      )}
    </AppLayout>
  );
}

export default AdminReports;

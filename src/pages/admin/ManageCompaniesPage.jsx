import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Trash2, Briefcase, Calendar, Building2 } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import './ManageCompaniesPage.css';

const ManageCompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setCompanies([
      { id: 1, name: 'TechCo Lebanon',  email: 'admin@techco.com',    status: 'pending',  jobs: 0, createdAt: '2025-05-01' },
      { id: 2, name: 'Pixels Design',   email: 'info@pixels.com',     status: 'approved', jobs: 5, createdAt: '2025-01-10' },
      { id: 3, name: 'DataMinds AI',    email: 'contact@dataminds.com',status: 'approved', jobs: 3, createdAt: '2025-02-20' },
      { id: 4, name: 'Fake Corp',       email: 'fake@spam.com',        status: 'rejected', jobs: 0, createdAt: '2025-04-30' },
    ]);
  }, []);

  const handleApprove = (id) =>
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, status: 'approved' } : c));

  const handleReject = (id) =>
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, status: 'rejected' } : c));

  const handleDelete = (id) => {
    if (window.confirm('Delete this company permanently?'))
      setCompanies(prev => prev.filter(c => c.id !== id));
  };

  const TABS = ['all', 'pending', 'approved', 'rejected'];
  const filtered = filter === 'all' ? companies : companies.filter(c => c.status === filter);

  const counts = {
    all:      companies.length,
    pending:  companies.filter(c => c.status === 'pending').length,
    approved: companies.filter(c => c.status === 'approved').length,
    rejected: companies.filter(c => c.status === 'rejected').length,
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="Manage Companies" subtitle="Approve, reject, or remove companies" />
        <div className="admin-content">

          {/* Toolbar */}
          <div className="page-toolbar">
            <div className="filter-tabs">
              {TABS.map(tab => (
                <button
                  key={tab}
                  className={`filter-tab ${filter === tab ? 'active' : ''}`}
                  onClick={() => setFilter(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  <span className="tab-count">{counts[tab]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="companies-grid">
            {filtered.length > 0 ? filtered.map(company => (
              <div key={company.id} className={`company-card company-card--${company.status}`}>

                {/* Header */}
                <div className="company-card__header">
                  <div className="company-avatar">
                    {company.name.charAt(0)}
                  </div>
                  <div className="company-info">
                    <h3 className="company-name">{company.name}</h3>
                    <p className="company-email">{company.email}</p>
                  </div>
                  <span className={`status-badge status-badge--${company.status}`}>
                    {company.status}
                  </span>
                </div>

                {/* Meta */}
                <div className="company-card__meta">
                  <span className="meta-item">
                    <Briefcase size={13} strokeWidth={2} />
                    {company.jobs} Jobs Posted
                  </span>
                  <span className="meta-item">
                    <Calendar size={13} strokeWidth={2} />
                    {new Date(company.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                {/* Actions */}
                <div className="company-card__actions">
                  {company.status === 'pending' && (
                    <>
                      <button className="btn-approve" onClick={() => handleApprove(company.id)}>
                        <CheckCircle size={14} strokeWidth={2.2} />
                        Approve
                      </button>
                      <button className="btn-reject" onClick={() => handleReject(company.id)}>
                        <XCircle size={14} strokeWidth={2.2} />
                        Reject
                      </button>
                    </>
                  )}
                  <button className="btn-delete-sm" onClick={() => handleDelete(company.id)}>
                    <Trash2 size={14} strokeWidth={2.2} />
                    Delete
                  </button>
                </div>

              </div>
            )) : (
              <div className="empty-state">
                <Building2 size={36} strokeWidth={1.4} />
                <p>No companies found.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ManageCompaniesPage;

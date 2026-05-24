import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Briefcase, Calendar, Building2, ChevronDown, ArrowLeft,
         Globe, MapPin, Mail, CheckCircle, XCircle } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import adminService from '../../services/adminService';
import useAdminProfile from '../../components/hooks/useAdminProfile';
import './ManageCompaniesPage.css';

const BASE_URL = 'http://localhost/forsa-platform-backend';

const getLogoSrc = (logo) => {
  if (!logo) return null;
  if (logo.startsWith('http')) return logo;
  return `${BASE_URL}/${logo}`;
};

const CompanyAvatar = ({ logo, name, size = 'md' }) => {
  const [imgError, setImgError] = useState(false);
  const logoSrc = getLogoSrc(logo);

  if (logoSrc && !imgError) {
    return (
      <div className={`company-avatar company-avatar--${size}`} style={{ padding: 0, background: 'transparent', border: '1px solid #e8ecf5', overflow: 'hidden' }}>
        <img
          src={logoSrc}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div className={`company-avatar company-avatar--${size}`}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
};

const STATUS_OPTIONS = ['pending', 'approved', 'rejected'];

const StatusDropdown = ({ company, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref             = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  const handleSelect = async (newStatus) => {
    setOpen(false);
    if (newStatus === company.status) return;
    if (!window.confirm(`Change "${company.name}" status to "${newStatus}"?`)) return;
    await onChange(company.id, newStatus);
  };
  return (
    <div className="status-dropdown" ref={ref}>
      <button
        className={`status-badge status-badge--${company.status} status-badge--clickable`}
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
      >
        {company.status}
        <ChevronDown size={12} strokeWidth={2.5} style={{ marginLeft: 4 }} />
      </button>
      {open && (
        <ul className="status-dropdown__menu">
          {STATUS_OPTIONS.map(opt => (
            <li
              key={opt}
              className={`status-dropdown__item ${opt === company.status ? 'active' : ''}`}
              onClick={() => handleSelect(opt)}
            >
              <span className={`status-dot status-dot--${opt}`} />
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const CompanyDetailPage = ({ company, onBack, onStatusChange, onDelete }) => (
  <div className="company-detail">
    <button className="btn-back" onClick={onBack}>
      <ArrowLeft size={16} strokeWidth={2.2} />Back to Companies
    </button>
    <div className="detail-header-card">
      <CompanyAvatar logo={company.logo} name={company.name} size="lg" />
      <div className="detail-header-info">
        <h2 className="detail-company-name">{company.name}</h2>
        <p className="detail-company-industry">{company.industry || 'Industry not specified'}</p>
        <div className="detail-meta-row">
          {company.email    && <span className="detail-meta-item"><Mail size={13} strokeWidth={2} /> {company.email}</span>}
          {company.location && <span className="detail-meta-item"><MapPin size={13} strokeWidth={2} /> {company.location}</span>}
          {company.website  && <span className="detail-meta-item"><Globe size={13} strokeWidth={2} /><a href={company.website} target="_blank" rel="noreferrer">{company.website}</a></span>}
        </div>
      </div>
      <div className="detail-header-actions">
        <StatusDropdown company={company} onChange={onStatusChange} />
        <button className="btn-delete-sm" onClick={() => onDelete(company.id)}>
          <Trash2 size={14} strokeWidth={2.2} /> Delete
        </button>
      </div>
    </div>

    <div className="detail-stats-row">
      <div className="detail-stat">
        <span className="detail-stat-value">{company.jobs ?? 0}</span>
        <span className="detail-stat-label">Jobs Posted</span>
      </div>
      <div className="detail-stat">
        <span className="detail-stat-value">
          {new Date(company.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
        <span className="detail-stat-label">Joined</span>
      </div>
      <div className="detail-stat">
        <span className={`detail-stat-value detail-stat-value--${company.status}`}>
          {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
        </span>
        <span className="detail-stat-label">Status</span>
      </div>
    </div>

    {company.description && (
      <div className="detail-section">
        <h4 className="detail-section-title">About</h4>
        <p className="detail-section-body">{company.description}</p>
      </div>
    )}

    <div className="detail-section">
      <h4 className="detail-section-title">Quick Actions</h4>
      <div className="detail-quick-actions">
        {company.status !== 'approved' && (
          <button className="btn-approve" onClick={() => onStatusChange(company.id, 'approved')}>
            <CheckCircle size={14} strokeWidth={2.2} /> Approve Company
          </button>
        )}
        {company.status !== 'rejected' && (
          <button className="btn-reject" onClick={() => onStatusChange(company.id, 'rejected')}>
            <XCircle size={14} strokeWidth={2.2} /> Reject Company
          </button>
        )}
        {company.status !== 'pending' && (
          <button className="btn-pending" onClick={() => onStatusChange(company.id, 'pending')}>
            Set to Pending
          </button>
        )}
      </div>
    </div>
  </div>
);

/* ─── Main Page ─────────────────────────────────────────────── */
const ManageCompaniesPage = () => {
  const adminProfile = useAdminProfile();

  const [companies, setCompanies]             = useState([]);
  const [filter, setFilter]                   = useState('all');
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminService.getAllCompanies();
        setCompanies(data.map(c => ({
          ...c,
          name:      c.company_name,
          jobs:      c.jobs_count ?? 0,
          createdAt: c.created_at,
          status: c.status
            ? c.status
            : c.is_banned
              ? 'banned'
              : c.is_approved
                ? 'approved'
                : 'pending',
        })));
      } catch (err) {
        setError(err.message || 'Failed to load companies.');
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminService.updateCompanyStatus(id, newStatus);
      setCompanies(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
      if (selectedCompany?.id === id) setSelectedCompany(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      alert(err.message || 'Status update failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this company permanently?')) return;
    try {
      await adminService.deleteCompany(id);
      setCompanies(prev => prev.filter(c => c.id !== id));
      if (selectedCompany?.id === id) setSelectedCompany(null);
    } catch (err) {
      alert(err.message || 'Delete failed.');
    }
  };

  const TABS = ['all', 'pending', 'approved', 'rejected'];
  const filtered = filter === 'all' ? companies : companies.filter(c => c.status === filter);
  const counts = {
    all:      companies.length,
    pending:  companies.filter(c => c.status === 'pending').length,
    approved: companies.filter(c => c.status === 'approved').length,
    rejected: companies.filter(c => c.status === 'rejected').length,
  };

  if (selectedCompany) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-main">
          <AdminHeader
            title="Company Details"
            subtitle="Full information about this company"
            adminName={adminProfile.name}
            adminAvatar={adminProfile.avatar}
          />
          <div className="admin-content">
            <CompanyDetailPage
              company={selectedCompany}
              onBack={() => setSelectedCompany(null)}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader
          title="Manage Companies"
          subtitle="Approve, reject, or remove companies"
          adminName={adminProfile.name}
          adminAvatar={adminProfile.avatar}
        />
        <div className="admin-content">
          {loading && <p className="loading-msg">Loading companies...</p>}
          {error   && <p className="error-msg">{error}</p>}

          {!loading && !error && (
            <>
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

              <div className="companies-grid">
                {filtered.length > 0 ? filtered.map(company => (
                  <div
                    key={company.id}
                    className={`company-card company-card--${company.status}`}
                    onClick={() => setSelectedCompany(company)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="company-card__header">
                      {/* ← logo يظهر إذا موجود، وإلا الحرف */}
                      <CompanyAvatar logo={company.logo} name={company.name} />
                      <div className="company-info">
                        <h3 className="company-name">{company.name}</h3>
                        <p className="company-email">{company.email}</p>
                      </div>
                      <div onClick={e => e.stopPropagation()}>
                        <StatusDropdown company={company} onChange={handleStatusChange} />
                      </div>
                    </div>

                    <div className="company-card__meta">
                      <span className="meta-item">
                        <Briefcase size={13} strokeWidth={2} />
                        {company.jobs} {company.jobs === 1 ? 'Job' : 'Jobs'} Posted
                      </span>
                      <span className="meta-item">
                        <Calendar size={13} strokeWidth={2} />
                        {new Date(company.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="company-card__actions" onClick={e => e.stopPropagation()}>
                      <button className="btn-delete-sm" onClick={() => handleDelete(company.id)}>
                        <Trash2 size={14} strokeWidth={2.2} /> Delete
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageCompaniesPage;
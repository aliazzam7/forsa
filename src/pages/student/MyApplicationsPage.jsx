import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase, MapPin, Clock, Calendar, ChevronDown,
  ChevronUp, FileText, ExternalLink, Search, Filter,
  CheckCircle, XCircle, AlertCircle, Inbox
} from 'lucide-react';
import StudentNavbar from '../../components/student/StudentNavbar';
import ApplicationStatusBadge from '../../components/student/ApplicationStatusBadge';
import './MyApplicationsPage.css';

/* ── Mock Applications ── */
const APPLICATIONS = [
  {
    id: 'a1',
    jobTitle: 'Frontend Developer',
    company: 'TechCorp',
    companyLogo: null,
    location: 'Beirut, Lebanon',
    type: 'Full-time',
    mode: 'Remote',
    appliedDate: '2025-05-10',
    deadline: '2025-08-30',
    status: 'pending',
    jobId: '1',
    note: '',
  },
  {
    id: 'a2',
    jobTitle: 'React Intern',
    company: 'StartupXYZ',
    companyLogo: null,
    location: 'Remote',
    type: 'Internship',
    mode: 'Remote',
    appliedDate: '2025-05-08',
    deadline: '2025-07-15',
    status: 'accepted',
    jobId: '2',
    note: 'Congratulations! We are pleased to inform you that your application has been accepted. Please check your email for next steps.',
  },
  {
    id: 'a3',
    jobTitle: 'UI/UX Developer',
    company: 'DesignHub',
    companyLogo: null,
    location: 'Beirut, Lebanon',
    type: 'Part-time',
    mode: 'Hybrid',
    appliedDate: '2025-05-05',
    deadline: '2025-08-01',
    status: 'rejected',
    jobId: '3',
    note: 'Thank you for applying. Unfortunately, we have decided to move forward with another candidate at this time.',
  },
  {
    id: 'a4',
    jobTitle: 'Node.js Developer',
    company: 'CloudBase',
    companyLogo: null,
    location: 'Tripoli, Lebanon',
    type: 'Full-time',
    mode: 'Onsite',
    appliedDate: '2025-05-12',
    deadline: '2025-09-01',
    status: 'pending',
    jobId: '4',
    note: '',
  },
  {
    id: 'a5',
    jobTitle: 'AI Engineer',
    company: 'NeuralLab',
    companyLogo: null,
    location: 'Remote',
    type: 'Full-time',
    mode: 'Remote',
    appliedDate: '2025-04-28',
    deadline: '2025-08-20',
    status: 'removed',
    jobId: '5',
    note: 'This job listing has been removed by the company.',
  },
  {
    id: 'a6',
    jobTitle: 'Full-stack Developer',
    company: 'WebAgency',
    companyLogo: null,
    location: 'Beirut, Lebanon',
    type: 'Full-time',
    mode: 'Hybrid',
    appliedDate: '2025-05-13',
    deadline: '2025-09-10',
    status: 'pending',
    jobId: '6',
    note: '',
  },
];

const STATUS_FILTERS = ['All', 'pending', 'accepted', 'rejected', 'removed'];

const STATUS_STATS = [
  { key: 'pending',  label: 'Pending',  icon: <Clock size={18} />,       color: '#c47d00', bg: '#fff8e6' },
  { key: 'accepted', label: 'Accepted', icon: <CheckCircle size={18} />, color: '#1a8a5a', bg: '#e6f9f1' },
  { key: 'rejected', label: 'Rejected', icon: <XCircle size={18} />,     color: '#b91c1c', bg: '#fef2f2' },
  { key: 'removed',  label: 'Removed',  icon: <AlertCircle size={18} />, color: '#6B7A99', bg: '#f3f4f6' },
];

/* ── Application Card ── */
const AppCard = ({ app, onViewJob }) => {
  const [expanded, setExpanded] = useState(false);

  const formattedApplied = new Date(app.appliedDate).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  const hasNote = app.note && app.note.trim().length > 0;

  return (
    <div className={`mac__card mac__card--${app.status}`}>
      {/* Top Section */}
      <div className="mac__card-top">
        <div className="mac__logo">
          {app.companyLogo
            ? <img src={app.companyLogo} alt={app.company} />
            : <span>{app.company.charAt(0)}</span>
          }
        </div>

        <div className="mac__meta">
          <div className="mac__meta-top">
            <div>
              <h3 className="mac__title">{app.jobTitle}</h3>
              <p className="mac__company">{app.company}</p>
            </div>
            <ApplicationStatusBadge status={app.status} size="md" />
          </div>

          <div className="mac__info-row">
            <span className="mac__info"><MapPin size={12} /> {app.location}</span>
            <span className="mac__info"><Briefcase size={12} /> {app.type}</span>
            <span className="mac__info"><Clock size={12} /> {app.mode}</span>
            <span className="mac__info"><Calendar size={12} /> Applied {formattedApplied}</span>
          </div>
        </div>
      </div>

      {/* Note (if accepted/rejected/removed) */}
      {hasNote && expanded && (
        <div className={`mac__note mac__note--${app.status}`}>
          <p>{app.note}</p>
        </div>
      )}

      {/* Actions Row */}
      <div className="mac__actions">
        <button
          className="mac__action-btn mac__action-btn--view"
          onClick={() => onViewJob(app.jobId)}
        >
          <ExternalLink size={13} /> View Job
        </button>

        {hasNote && (
          <button
            className="mac__action-btn mac__action-btn--expand"
            onClick={() => setExpanded(v => !v)}
          >
            <FileText size={13} />
            {expanded ? 'Hide' : 'View'} Message
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        )}
      </div>
    </div>
  );
};

/* ── Main Component ── */
const MyApplicationsPage = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  const counts = STATUS_STATS.reduce((acc, { key }) => {
    acc[key] = APPLICATIONS.filter(a => a.status === key).length;
    return acc;
  }, {});

  const filtered = APPLICATIONS.filter(app => {
    const matchStatus = statusFilter === 'All' || app.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      app.jobTitle.toLowerCase().includes(q) ||
      app.company.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div className="mac">
      <StudentNavbar studentName="Ahmed" notifCount={2} />

      <main className="mac__main">

        {/* ── Header ── */}
        <div className="mac__header">
          <div>
            <h1 className="mac__title-page">My Applications</h1>
            <p className="mac__sub">{APPLICATIONS.length} total applications</p>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="mac__stats">
          <div className="mac__stat mac__stat--total">
            <p className="mac__stat-value">{APPLICATIONS.length}</p>
            <p className="mac__stat-label">Total Applied</p>
          </div>
          {STATUS_STATS.map(({ key, label, icon, color, bg }) => (
            <div
              key={key}
              className="mac__stat"
              style={{ '--stat-color': color, '--stat-bg': bg }}
            >
              <div className="mac__stat-icon" style={{ background: bg, color }}>
                {icon}
              </div>
              <div>
                <p className="mac__stat-value" style={{ color }}>{counts[key] || 0}</p>
                <p className="mac__stat-label">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Search & Filter ── */}
        <div className="mac__toolbar">
          <div className="mac__search-wrap">
            <Search size={16} className="mac__search-icon" />
            <input
              className="mac__search"
              placeholder="Search by job title or company..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="mac__filter-tabs">
            <Filter size={14} className="mac__filter-icon" />
            {STATUS_FILTERS.map(f => (
              <button
                key={f}
                className={`mac__filter-tab ${statusFilter === f ? 'mac__filter-tab--active' : ''}`}
                onClick={() => setStatusFilter(f)}
              >
                {f === 'All' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                {f !== 'All' && counts[f] > 0 && (
                  <span className="mac__filter-count">{counts[f]}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Applications List ── */}
        {filtered.length > 0
          ? (
            <div className="mac__list">
              {filtered.map(app => (
                <AppCard
                  key={app.id}
                  app={app}
                  onViewJob={(jobId) => navigate(`/student/jobs/${jobId}`)}
                />
              ))}
            </div>
          )
          : (
            <div className="mac__empty">
              <div className="mac__empty-icon">
                <Inbox size={48} />
              </div>
              <h3>No applications found</h3>
              <p>
                {statusFilter !== 'All'
                  ? `You have no ${statusFilter} applications.`
                  : "You haven't applied to any jobs yet."
                }
              </p>
              <button
                className="mac__browse-btn"
                onClick={() => navigate('/student/jobs')}
              >
                Browse Jobs
              </button>
            </div>
          )
        }

      </main>
    </div>
  );
};

export default MyApplicationsPage;
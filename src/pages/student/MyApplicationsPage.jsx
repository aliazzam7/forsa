import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase, MapPin, Clock, Calendar, ChevronDown,
  ChevronUp, FileText, ExternalLink, Search, Filter,
  CheckCircle, XCircle, AlertCircle, Inbox
} from 'lucide-react';
import StudentNavbar from '../../components/student/StudentNavbar';
import ApplicationStatusBadge from '../../components/student/ApplicationStatusBadge';
import studentService from '../../services/studentService';
import './MyApplicationsPage.css';

const STATUS_FILTERS = ['All', 'pending', 'accepted', 'rejected'];

const STATUS_STATS = [
  { key: 'pending',  label: 'Pending',  icon: <Clock size={18} />,       color: '#c47d00', bg: '#fff8e6' },
  { key: 'accepted', label: 'Accepted', icon: <CheckCircle size={18} />, color: '#1a8a5a', bg: '#e6f9f1' },
  { key: 'rejected', label: 'Rejected', icon: <XCircle size={18} />,     color: '#b91c1c', bg: '#fef2f2' },
];

/* ── Application Card ── */
const AppCard = ({ app, onViewJob }) => {
  const [expanded, setExpanded] = useState(false);

  const formattedApplied = app.applied_at
    ? new Date(app.applied_at).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : '—';

  const hasNote = app.note && app.note.trim().length > 0;

  return (
    <div className={`mac__card mac__card--${app.status}`}>
      <div className="mac__card-top">
        <div className="mac__logo">
          {app.company_logo
            ? <img src={app.company_logo} alt={app.company_name} />
            : <span>{(app.company_name || '?').charAt(0)}</span>
          }
        </div>

        <div className="mac__meta">
          <div className="mac__meta-top">
            <div>
              <h3 className="mac__title">{app.job_title}</h3>
              <p className="mac__company">{app.company_name}</p>
            </div>
            <ApplicationStatusBadge status={app.status} size="md" />
          </div>

          <div className="mac__info-row">
            {app.location  && <span className="mac__info"><MapPin size={12} />     {app.location}</span>}
            {app.type      && <span className="mac__info"><Briefcase size={12} />  {app.type}</span>}
            {app.mode      && <span className="mac__info"><Clock size={12} />      {app.mode}</span>}
            <span className="mac__info"><Calendar size={12} /> Applied {formattedApplied}</span>
          </div>
        </div>
      </div>

      {hasNote && expanded && (
        <div className={`mac__note mac__note--${app.status}`}>
          <p>{app.note}</p>
        </div>
      )}

      <div className="mac__actions">
        <button
          className="mac__action-btn mac__action-btn--view"
          onClick={() => onViewJob(app.job_id)}
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
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch]             = useState('');
  const [studentName, setStudentName]   = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const [data, profile] = await Promise.all([
          studentService.getMyApplications(),
          studentService.getProfile().catch(() => ({ name: '' })),
        ]);
        setApplications(Array.isArray(data) ? data : []);
        setStudentName(profile.name || '');
      } catch (err) {
        setError(err.message || 'Failed to load applications.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const counts = STATUS_STATS.reduce((acc, { key }) => {
    acc[key] = applications.filter(a => a.status === key).length;
    return acc;
  }, {});

  const filtered = applications.filter(app => {
    const matchStatus = statusFilter === 'All' || app.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (app.job_title    || '').toLowerCase().includes(q) ||
      (app.company_name || '').toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  if (loading) {
    return (
      <div className="mac">
        <StudentNavbar studentName={studentName} notifCount={0} />  {/* ✅ fixed */}
        <main className="mac__main">
          <div style={{ textAlign: 'center', padding: '4rem', color: '#6B7A99' }}>
            Loading applications...
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mac">
        <StudentNavbar studentName={studentName} notifCount={0} />  {/* ✅ fixed */}
        <main className="mac__main">
          <div style={{ textAlign: 'center', padding: '4rem', color: '#b91c1c' }}>
            {error}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="mac">
      <StudentNavbar studentName={studentName} notifCount={2} />  {/* ✅ fixed */}

      <main className="mac__main">

        <div className="mac__header">
          <div>
            <h1 className="mac__title-page">My Applications</h1>
            <p className="mac__sub">{applications.length} total applications</p>
          </div>
        </div>

        <div className="mac__stats">
          <div className="mac__stat mac__stat--total">
            <p className="mac__stat-value">{applications.length}</p>
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

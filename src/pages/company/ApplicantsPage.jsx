import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Loader2, Search, ArrowUpDown } from 'lucide-react';
import CompanySidebar     from '../../components/company/CompanySidebar';
import CompanyHeader      from '../../components/company/CompanyHeader';
import ApplicantCard      from '../../components/company/ApplicantCard';
import applicationService from '../../services/applicationService';
import './ApplicantsPage.css';

const TABS      = ['all', 'pending', 'accepted', 'rejected'];
const SORT_OPTS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'az',     label: 'Name A → Z'   },
  { value: 'za',     label: 'Name Z → A'   },
];

const ApplicantsPage = () => {
  const { jobId } = useParams();
  const navigate  = useNavigate();

  const [applicants,   setApplicants]   = useState([]);
  const [jobTitle,     setJobTitle]     = useState('');
  const [filter,       setFilter]       = useState('all');
  const [searchQuery,  setSearchQuery]  = useState('');
  const [sortOrder,    setSortOrder]    = useState('newest');
  const [showSort,     setShowSort]     = useState(false);
  const [loading,      setLoading]      = useState(true);
  const [apiError,     setApiError]     = useState('');

  /* ── Load applicants ── */
  useEffect(() => {
    const load = async () => {
      try {
        const data = await applicationService.getJobApplicants(jobId);
        const raw  = Array.isArray(data) ? data : (data.applicants ?? []);

        if (raw.length > 0 && raw[0].job_title) {
          setJobTitle(raw[0].job_title);
        }

        const normalised = raw.map(a => ({
          id:          a.id    ?? a._id,
          name:        a.student_name  ?? a.name  ?? 'Unknown',
          email:       a.student_email ?? a.email ?? '',
          skills:      Array.isArray(a.skills)
                         ? a.skills
                         : (a.skills ? String(a.skills).split(',').map(s => s.trim()) : []),
          status:      a.status ?? 'pending',
          cvUrl:       a.cv_url     ?? a.cvUrl        ?? a.cv_path ?? null,
          coverLetter: a.cover_letter ?? a.coverLetter ?? null,
          appliedAt:   a.applied_at  ?? a.created_at  ?? a.createdAt ?? null,
          profileUrl:  a.profile_url ?? a.profileUrl  ?? null,
        }));

        setApplicants(normalised);
      } catch (err) {
        setApiError('Failed to load applicants: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [jobId]);

  /* ── Accept / Reject ── */
  const handleAccept = async (id) => {
    try {
      await applicationService.updateStatus(id, 'accepted');
      setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: 'accepted' } : a));
    } catch (err) {
      setApiError('Action failed: ' + err.message);
    }
  };

  const handleReject = async (id) => {
    try {
      await applicationService.updateStatus(id, 'rejected');
      setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
    } catch (err) {
      setApiError('Action failed: ' + err.message);
    }
  };

  /* ── Counts ── */
  const counts = useMemo(() => ({
    all:      applicants.length,
    pending:  applicants.filter(a => a.status === 'pending').length,
    accepted: applicants.filter(a => a.status === 'accepted').length,
    rejected: applicants.filter(a => a.status === 'rejected').length,
  }), [applicants]);

  /* ── Filter + Search + Sort ── */
  const displayed = useMemo(() => {
    let list = filter === 'all' ? applicants : applicants.filter(a => a.status === filter);

    /* search by name OR skill */
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.skills.some(s => s.toLowerCase().includes(q))
      );
    }

    /* sort */
    list = [...list].sort((a, b) => {
      if (sortOrder === 'az') return a.name.localeCompare(b.name);
      if (sortOrder === 'za') return b.name.localeCompare(a.name);
      const da = a.appliedAt ? new Date(a.appliedAt) : new Date(0);
      const db = b.appliedAt ? new Date(b.appliedAt) : new Date(0);
      return sortOrder === 'newest' ? db - da : da - db;
    });

    return list;
  }, [applicants, filter, searchQuery, sortOrder]);

  const sortLabel = SORT_OPTS.find(o => o.value === sortOrder)?.label ?? 'Sort';

  /* ── Close sort dropdown on outside click ── */
  useEffect(() => {
    if (!showSort) return;
    const close = () => setShowSort(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [showSort]);

  return (
    <div className="company-layout">
      <CompanySidebar />
      <div className="company-main">
        <CompanyHeader
          title={jobTitle ? `Applicants — ${jobTitle}` : 'Applicants'}
          subtitle={`${counts.all} total · ${counts.pending} pending review`}
        />

        <div className="company-content">

          {/* ── Error banner ── */}
          {apiError && (
            <div className="api-error-banner">
              {apiError}
              <button onClick={() => setApiError('')}>✕</button>
            </div>
          )}

          {/* ── Toolbar row 1: back + tabs ── */}
          <div className="page-toolbar">
            <button className="btn-back" onClick={() => navigate('/company/my-jobs')}>
              <ArrowLeft size={15} strokeWidth={2} aria-hidden="true" />
              Back to My Jobs
            </button>
            <div className="filter-tabs">
              {TABS.map(tab => (
                <button
                  key={tab}
                  className={`filter-tab ${filter === tab ? 'filter-tab--active' : ''}`}
                  onClick={() => setFilter(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  <span className="tab-count">{counts[tab]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Toolbar row 2: search + sort ── */}
          <div className="search-sort-bar">
            <div className="search-wrapper">
              <Search size={15} className="search-icon" aria-hidden="true" />
              <input
                type="text"
                className="search-input"
                placeholder="Search by name, email or skill…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="search-clear" onClick={() => setSearchQuery('')} aria-label="Clear search">✕</button>
              )}
            </div>

            <div className="sort-wrapper" onClick={e => e.stopPropagation()}>
              <button className="sort-btn" onClick={() => setShowSort(v => !v)}>
                <ArrowUpDown size={14} strokeWidth={2} aria-hidden="true" />
                {sortLabel}
              </button>
              {showSort && (
                <div className="sort-dropdown">
                  {SORT_OPTS.map(opt => (
                    <button
                      key={opt.value}
                      className={`sort-option ${sortOrder === opt.value ? 'sort-option--active' : ''}`}
                      onClick={() => { setSortOrder(opt.value); setShowSort(false); }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Content ── */}
          {loading ? (
            <div className="loading-state">
              <Loader2 size={28} className="spin" color="#1B2D6B" />
            </div>
          ) : displayed.length === 0 ? (
            <div className="empty-state">
              <Users size={40} strokeWidth={1.4} color="#c4cce0" aria-hidden="true" />
              <p>
                {searchQuery
                  ? `No results for "${searchQuery}"`
                  : `No ${filter !== 'all' ? filter : ''} applicants yet.`}
              </p>
              {searchQuery && (
                <button className="empty-link-btn" onClick={() => setSearchQuery('')}>
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="applicants-grid">
              {displayed.map(applicant => (
                <ApplicantCard
                  key={applicant.id}
                  applicant={applicant}
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ApplicantsPage;

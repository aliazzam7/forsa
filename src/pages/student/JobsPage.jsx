import React, { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StudentNavbar from '../../components/student/StudentNavbar';
import JobListCard from '../../components/student/JobListCard';
import jobService from '../../services/jobService';
import studentService from '../../services/studentService'; 
import { BASE_URL } from '../../services/api';              
import './JobsPage.css';

const TYPES  = ['All', 'Full-time', 'Part-time', 'Internship'];
const MODES  = ['All', 'Remote', 'Onsite', 'Hybrid'];
const FIELDS = ['All', 'Frontend', 'Backend', 'Full-stack', 'AI/ML', 'Design', 'Mobile', 'DevOps', 'Security', 'Testing'];
const PER_PAGE = 6;


const mapJob = (job) => ({
  id: String(job.id),
  title:       job.title        || '',
  company:     job.company_name || job.company || '',
  
  companyLogo: job.logo
    ? (job.logo.startsWith('http') ? job.logo : `${BASE_URL.replace('/api', '')}/${job.logo}`)
    : null,
  location:    job.location  || '',
  type:        job.type      || 'Full-time',
  mode:        job.mode      || 'Remote',
  field:       job.field     || '',
  skills: job.skills_required
    ? (Array.isArray(job.skills_required) ? job.skills_required : [])
    : (job.skills
        ? (Array.isArray(job.skills) ? job.skills : (() => { try { return JSON.parse(job.skills); } catch { return []; } })())
        : []),
  deadline:  job.deadline   || '',
  postedAgo: job.posted_ago || job.postedAgo || '',
});

const JobsPage = () => {
  const navigate = useNavigate();
  const [allJobs,     setAllJobs]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [search,      setSearch]      = useState('');
  const [typeFilter,  setTypeFilter]  = useState('All');
  const [modeFilter,  setModeFilter]  = useState('All');
  const [fieldFilter, setFieldFilter] = useState('All');
  const [page,        setPage]        = useState(1);
  const [saved,       setSaved]       = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // [FIX 2] جيب الـ jobs والاسم بنفس الوقت
        const [data, profile] = await Promise.all([
          jobService.getAllJobs(),
          studentService.getProfile().catch(() => ({ name: '' })),
        ]);
        setAllJobs(Array.isArray(data) ? data.map(mapJob) : []);
        setStudentName(profile.name || '');
      } catch (err) {
        setError(err.message || 'Failed to load jobs.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleSave = (id) =>
    setSaved(prev => prev.includes(id) ? prev.filter(j => j !== id) : [...prev, id]);

  const clearFilters = () => {
    setTypeFilter('All'); setModeFilter('All');
    setFieldFilter('All'); setSearch(''); setPage(1);
  };

  const activeFilterCount = [
    typeFilter  !== 'All',
    modeFilter  !== 'All',
    fieldFilter !== 'All',
    search !== '',
  ].filter(Boolean).length;

  const filtered = useMemo(() => {
    return allJobs.filter(job => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.skills.some(s => s.toLowerCase().includes(q));
      const matchType  = typeFilter  === 'All' || job.type  === typeFilter;
      const matchMode  = modeFilter  === 'All' || job.mode  === modeFilter;
      const matchField = fieldFilter === 'All' || job.field === fieldFilter;
      return matchSearch && matchType && matchMode && matchField;
    });
  }, [allJobs, search, typeFilter, modeFilter, fieldFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleFilter = (setter) => (val) => { setter(val); setPage(1); };

  if (loading) {
    return (
      <div className="jp">
        <StudentNavbar studentName={studentName} notifCount={2} />
        <main className="jp__main">
          <div style={{ textAlign: 'center', padding: '4rem', color: '#6B7A99' }}>
            Loading jobs...
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="jp">
        <StudentNavbar studentName={studentName} notifCount={2} />
        <main className="jp__main">
          <div style={{ textAlign: 'center', padding: '4rem', color: '#b91c1c' }}>
            {error}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="jp">
      <StudentNavbar studentName={studentName} notifCount={2} />

      <main className="jp__main">

        <div className="jp__header">
          <div>
            <h1 className="jp__title">Browse Jobs</h1>
            <p className="jp__sub">{filtered.length} opportunities available for you</p>
          </div>
        </div>

        <div className="jp__search-row">
          <div className="jp__search-wrap">
            <Search size={17} className="jp__search-icon" />
            <input
              className="jp__search"
              placeholder="Search by title, company, or skill..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
            {search && (
              <button className="jp__search-clear" onClick={() => { setSearch(''); setPage(1); }}>
                <X size={14} />
              </button>
            )}
          </div>
          <button
            className={`jp__filter-toggle ${showFilters ? 'jp__filter-toggle--active' : ''}`}
            onClick={() => setShowFilters(v => !v)}
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && <span className="jp__filter-badge">{activeFilterCount}</span>}
          </button>
        </div>

        {showFilters && (
          <div className="jp__filters">
            <div className="jp__filter-group">
              <p className="jp__filter-label">Job Type</p>
              <div className="jp__chips">
                {TYPES.map(t => (
                  <button key={t} className={`jp__chip ${typeFilter === t ? 'jp__chip--active' : ''}`}
                    onClick={() => handleFilter(setTypeFilter)(t)}>{t}</button>
                ))}
              </div>
            </div>
            <div className="jp__filter-group">
              <p className="jp__filter-label">Work Mode</p>
              <div className="jp__chips">
                {MODES.map(m => (
                  <button key={m} className={`jp__chip ${modeFilter === m ? 'jp__chip--active' : ''}`}
                    onClick={() => handleFilter(setModeFilter)(m)}>{m}</button>
                ))}
              </div>
            </div>
            <div className="jp__filter-group">
              <p className="jp__filter-label">Field</p>
              <div className="jp__chips">
                {FIELDS.map(f => (
                  <button key={f} className={`jp__chip ${fieldFilter === f ? 'jp__chip--active' : ''}`}
                    onClick={() => handleFilter(setFieldFilter)(f)}>{f}</button>
                ))}
              </div>
            </div>
            {activeFilterCount > 0 && (
              <button className="jp__clear-btn" onClick={clearFilters}>
                <X size={13} /> Clear All Filters
              </button>
            )}
          </div>
        )}

        {activeFilterCount > 0 && (
          <div className="jp__active-tags">
            {search && (
              <span className="jp__active-tag">
                "{search}" <button onClick={() => setSearch('')}><X size={10} /></button>
              </span>
            )}
            {typeFilter !== 'All' && (
              <span className="jp__active-tag">
                {typeFilter} <button onClick={() => setTypeFilter('All')}><X size={10} /></button>
              </span>
            )}
            {modeFilter !== 'All' && (
              <span className="jp__active-tag">
                {modeFilter} <button onClick={() => setModeFilter('All')}><X size={10} /></button>
              </span>
            )}
            {fieldFilter !== 'All' && (
              <span className="jp__active-tag">
                {fieldFilter} <button onClick={() => setFieldFilter('All')}><X size={10} /></button>
              </span>
            )}
          </div>
        )}

        {paginated.length > 0
          ? (
            <div className="jp__grid">
              {paginated.map(job => (
                <JobListCard
                  key={job.id}
                  {...job}
                  saved={saved.includes(job.id)}
                  onSave={toggleSave}
                  onViewAll={() => navigate('/student/jobs')}
                />
              ))}
            </div>
          )
          : (
            <div className="jp__empty">
              <Search size={40} />
              <h3>No jobs found</h3>
              <p>Try adjusting your search or filters</p>
              <button className="jp__clear-btn" onClick={clearFilters}>Clear Filters</button>
            </div>
          )
        }

        {totalPages > 1 && (
          <div className="jp__pagination">
            <button className="jp__page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} className={`jp__page-num ${page === n ? 'jp__page-num--active' : ''}`}
                onClick={() => setPage(n)}>{n}</button>
            ))}
            <button className="jp__page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
              <ChevronRight size={16} />
            </button>
            <span className="jp__page-info">
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
            </span>
          </div>
        )}

      </main>
    </div>
  );
};

export default JobsPage;
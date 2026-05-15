import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StudentNavbar from '../../components/student/StudentNavbar';
import JobListCard from '../../components/student/JobListCard';
import './JobsPage.css';

/* ── Mock Jobs Data (20 jobs) ── */
const ALL_JOBS = [
  { id:'1',  title:'Frontend Developer',      company:'TechCorp',      location:'Beirut, Lebanon', type:'Full-time',  mode:'Remote',  field:'Frontend', skills:['React','TypeScript','Tailwind','REST APIs'], deadline:'2025-08-30', postedAgo:'2 days ago' },
  { id:'2',  title:'React Intern',             company:'StartupXYZ',    location:'Remote',          type:'Internship', mode:'Remote',  field:'Frontend', skills:['React','CSS','JavaScript'],                  deadline:'2025-07-15', postedAgo:'1 day ago' },
  { id:'3',  title:'UI/UX Developer',          company:'DesignHub',     location:'Beirut, Lebanon', type:'Part-time',  mode:'Hybrid',  field:'Design',   skills:['Figma','React','CSS','UX Research'],         deadline:'2025-08-01', postedAgo:'3 days ago' },
  { id:'4',  title:'Node.js Developer',        company:'CloudBase',     location:'Tripoli, Lebanon',type:'Full-time',  mode:'Onsite',  field:'Backend',  skills:['Node.js','MongoDB','Express','Docker'],      deadline:'2025-09-01', postedAgo:'5 hours ago' },
  { id:'5',  title:'AI Engineer',              company:'NeuralLab',     location:'Remote',          type:'Full-time',  mode:'Remote',  field:'AI/ML',    skills:['Python','TensorFlow','PyTorch','NLP'],       deadline:'2025-08-20', postedAgo:'12 hours ago' },
  { id:'6',  title:'Full-stack Developer',     company:'WebAgency',     location:'Beirut, Lebanon', type:'Full-time',  mode:'Hybrid',  field:'Full-stack',skills:['React','Node.js','PostgreSQL'],            deadline:'2025-09-10', postedAgo:'1 day ago' },
  { id:'7',  title:'Mobile Developer',         company:'AppFactory',    location:'Remote',          type:'Full-time',  mode:'Remote',  field:'Mobile',   skills:['React Native','iOS','Android','Firebase'],  deadline:'2025-08-25', postedAgo:'4 days ago' },
  { id:'8',  title:'DevOps Engineer',          company:'InfraCloud',    location:'Beirut, Lebanon', type:'Full-time',  mode:'Onsite',  field:'DevOps',   skills:['Docker','Kubernetes','AWS','CI/CD'],        deadline:'2025-09-15', postedAgo:'6 hours ago' },
  { id:'9',  title:'Data Scientist',           company:'DataMinds',     location:'Remote',          type:'Full-time',  mode:'Remote',  field:'AI/ML',    skills:['Python','Pandas','ML','SQL'],                deadline:'2025-08-18', postedAgo:'2 days ago' },
  { id:'10', title:'Backend Intern',           company:'CodeBase',      location:'Beirut, Lebanon', type:'Internship', mode:'Onsite',  field:'Backend',  skills:['Node.js','Express','MySQL'],                 deadline:'2025-07-30', postedAgo:'3 days ago' },
  { id:'11', title:'Vue.js Developer',         company:'FrontLab',      location:'Remote',          type:'Part-time',  mode:'Remote',  field:'Frontend', skills:['Vue.js','Vuex','TypeScript'],                deadline:'2025-08-12', postedAgo:'1 day ago' },
  { id:'12', title:'Cybersecurity Analyst',    company:'SecureIT',      location:'Beirut, Lebanon', type:'Full-time',  mode:'Onsite',  field:'Security', skills:['Networking','Pentesting','Linux','Python'],  deadline:'2025-09-05', postedAgo:'7 hours ago' },
  { id:'13', title:'Cloud Architect',          company:'SkyTech',       location:'Remote',          type:'Full-time',  mode:'Remote',  field:'DevOps',   skills:['AWS','Azure','GCP','Terraform'],             deadline:'2025-09-20', postedAgo:'2 days ago' },
  { id:'14', title:'Graphic Design Intern',    company:'CreativeStudio',location:'Beirut, Lebanon', type:'Internship', mode:'Hybrid',  field:'Design',   skills:['Figma','Illustrator','Photoshop'],           deadline:'2025-07-20', postedAgo:'4 days ago' },
  { id:'15', title:'PHP Developer',            company:'WebSolutions',  location:'Sidon, Lebanon',  type:'Full-time',  mode:'Onsite',  field:'Backend',  skills:['PHP','Laravel','MySQL','REST'],              deadline:'2025-09-01', postedAgo:'5 days ago' },
  { id:'16', title:'Machine Learning Intern',  company:'AIHub',         location:'Remote',          type:'Internship', mode:'Remote',  field:'AI/ML',    skills:['Python','Scikit-learn','Jupyter','Pandas'], deadline:'2025-08-10', postedAgo:'1 day ago' },
  { id:'17', title:'React Native Developer',   company:'MobileFirst',   location:'Beirut, Lebanon', type:'Full-time',  mode:'Hybrid',  field:'Mobile',   skills:['React Native','Redux','Firebase'],           deadline:'2025-09-08', postedAgo:'3 hours ago' },
  { id:'18', title:'WordPress Developer',      company:'DigitalPress',  location:'Remote',          type:'Part-time',  mode:'Remote',  field:'Full-stack',skills:['WordPress','PHP','CSS','MySQL'],           deadline:'2025-08-15', postedAgo:'6 days ago' },
  { id:'19', title:'Database Administrator',   company:'DataVault',     location:'Beirut, Lebanon', type:'Full-time',  mode:'Onsite',  field:'Backend',  skills:['PostgreSQL','MongoDB','Oracle','Backup'],   deadline:'2025-09-25', postedAgo:'1 day ago' },
  { id:'20', title:'QA Engineer',              company:'TestPro',       location:'Remote',          type:'Full-time',  mode:'Remote',  field:'Testing',  skills:['Selenium','Jest','Cypress','Manual Testing'],deadline:'2025-09-12', postedAgo:'2 days ago' },
];

const TYPES  = ['All', 'Full-time', 'Part-time', 'Internship'];
const MODES  = ['All', 'Remote', 'Onsite', 'Hybrid'];
const FIELDS = ['All', 'Frontend', 'Backend', 'Full-stack', 'AI/ML', 'Design', 'Mobile', 'DevOps', 'Security', 'Testing'];
const PER_PAGE = 6;

const JobsPage = () => {
  const navigate = useNavigate();
  const [search,     setSearch]     = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [modeFilter, setModeFilter] = useState('All');
  const [fieldFilter,setFieldFilter]= useState('All');
  const [page,       setPage]       = useState(1);
  const [saved,      setSaved]      = useState([]);
  const [showFilters,setShowFilters]= useState(false);

  const toggleSave = (id) =>
    setSaved(prev => prev.includes(id) ? prev.filter(j => j !== id) : [...prev, id]);

  const clearFilters = () => {
    setTypeFilter('All'); setModeFilter('All');
    setFieldFilter('All'); setSearch(''); setPage(1);
  };

  const activeFilterCount = [
    typeFilter !== 'All', modeFilter !== 'All',
    fieldFilter !== 'All', search !== ''
  ].filter(Boolean).length;

  const filtered = useMemo(() => {
    return ALL_JOBS.filter(job => {
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
  }, [search, typeFilter, modeFilter, fieldFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleFilter = (setter) => (val) => { setter(val); setPage(1); };

  return (
    <div className="jp">
      <StudentNavbar studentName="Ahmed" notifCount={2} />

      <main className="jp__main">

        {/* ── Page Title ── */}
        <div className="jp__header">
          <div>
            <h1 className="jp__title">Browse Jobs</h1>
            <p className="jp__sub">{filtered.length} opportunities available for you</p>
          </div>
        </div>

        {/* ── Search Bar ── */}
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

        {/* ── Filters Panel ── */}
        {showFilters && (
          <div className="jp__filters">
            <div className="jp__filter-group">
              <p className="jp__filter-label">Job Type</p>
              <div className="jp__chips">
                {TYPES.map(t => (
                  <button
                    key={t}
                    className={`jp__chip ${typeFilter === t ? 'jp__chip--active' : ''}`}
                    onClick={() => handleFilter(setTypeFilter)(t)}
                  >{t}</button>
                ))}
              </div>
            </div>

            <div className="jp__filter-group">
              <p className="jp__filter-label">Work Mode</p>
              <div className="jp__chips">
                {MODES.map(m => (
                  <button
                    key={m}
                    className={`jp__chip ${modeFilter === m ? 'jp__chip--active' : ''}`}
                    onClick={() => handleFilter(setModeFilter)(m)}
                  >{m}</button>
                ))}
              </div>
            </div>

            <div className="jp__filter-group">
              <p className="jp__filter-label">Field</p>
              <div className="jp__chips">
                {FIELDS.map(f => (
                  <button
                    key={f}
                    className={`jp__chip ${fieldFilter === f ? 'jp__chip--active' : ''}`}
                    onClick={() => handleFilter(setFieldFilter)(f)}
                  >{f}</button>
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

        {/* ── Active Filter Tags ── */}
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

        {/* ── Jobs Grid ── */}
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

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="jp__pagination">
            <button
              className="jp__page-btn"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                className={`jp__page-num ${page === n ? 'jp__page-num--active' : ''}`}
                onClick={() => setPage(n)}
              >{n}</button>
            ))}

            <button
              className="jp__page-btn"
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
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
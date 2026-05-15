import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Briefcase } from 'lucide-react';
import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyHeader  from '../../components/company/CompanyHeader';
import JobCard        from '../../components/company/JobCard';
import './MyJobsPage.css';

const MyJobsPage = () => {
  const navigate = useNavigate();
  const [jobs,    setJobs]    = useState([]);
  const [filter,  setFilter]  = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: replace with real API call → GET /api/jobs
    setTimeout(() => {
      setJobs([
        { id: 1, title: 'Frontend Developer', type: 'Full-time',  mode: 'Remote', skills: ['React', 'TypeScript', 'CSS'],        applicantsCount: 43, status: 'active', postedAt: '2025-05-01' },
        { id: 2, title: 'AI / ML Intern',      type: 'Internship', mode: 'Onsite', skills: ['Python', 'AI/ML', 'TensorFlow'],     applicantsCount: 18, status: 'active', postedAt: '2025-05-03' },
        { id: 3, title: 'Backend Engineer',    type: 'Full-time',  mode: 'Onsite', skills: ['Node.js', 'MongoDB', 'Express'],     applicantsCount: 27, status: 'closed', postedAt: '2025-04-20' },
        { id: 4, title: 'UI/UX Designer',      type: 'Part-time',  mode: 'Remote', skills: ['Figma', 'CSS'],                      applicantsCount: 11, status: 'active', postedAt: '2025-05-06' },
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Delete this job? All related applications will be removed.')) {
      setJobs(prev => prev.filter(j => (j._id ?? j.id) !== id));
    }
  };

  const handleEdit = (job) => {
    // TODO: navigate to edit page or open modal
    alert(`Edit "${job.title}" — coming soon!`);
  };

  const TABS = ['all', 'active', 'closed'];

  const filtered = filter === 'all'
    ? jobs
    : jobs.filter(j => j.status === filter);

  const countFor = (tab) =>
    tab === 'all' ? jobs.length : jobs.filter(j => j.status === tab).length;

  return (
    <div className="company-layout">
      <CompanySidebar />
      <div className="company-main">
        <CompanyHeader title="My Jobs" subtitle="Manage your posted job listings" />

        <div className="company-content">

          {/* Toolbar */}
          <div className="page-toolbar">
            <div className="filter-tabs">
              {TABS.map(tab => (
                <button
                  key={tab}
                  className={`filter-tab ${filter === tab ? 'filter-tab--active' : ''}`}
                  onClick={() => setFilter(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  <span className="tab-count">{countFor(tab)}</span>
                </button>
              ))}
            </div>

            <button
              className="btn-post-new"
              onClick={() => navigate('/company/post-job')}
            >
              <PlusCircle size={16} strokeWidth={2} aria-hidden="true" />
              Post New Job
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="loading-state">Loading jobs…</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <Briefcase size={40} strokeWidth={1.4} color="#c4cce0" aria-hidden="true" />
              <p>No jobs found.</p>
              <button
                className="empty-link-btn"
                onClick={() => navigate('/company/post-job')}
              >
                Post your first job →
              </button>
            </div>
          ) : (
            <div className="jobs-grid">
              {filtered.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default MyJobsPage;
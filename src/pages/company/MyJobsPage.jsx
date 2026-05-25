import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Briefcase, Loader2 } from 'lucide-react';
import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyHeader  from '../../components/company/CompanyHeader';
import JobCard        from '../../components/company/JobCard';
import companyService from '../../services/companyService';
import './MyJobsPage.css';

const MyJobsPage = () => {
  const navigate = useNavigate();
  const [jobs,     setJobs]     = useState([]);
  const [filter,   setFilter]   = useState('all');
  const [loading,  setLoading]  = useState(true);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await companyService.getMyJobs();
        const raw = Array.isArray(data) ? data : (data.jobs ?? []);

        // Normalize fields to match JobCard props
        const normalised = raw.map(j => ({
          id:             j.id ?? j._id,
          title:          j.title,
          type:           j.type,
          mode:           j.mode,
          skills:         Array.isArray(j.skills)
                            ? j.skills
                            : (j.skills ? String(j.skills).split(',').map(s => s.trim()) : []),
          applicantsCount: j.applicants_count ?? j.applicantsCount ?? 0,
          status:         j.is_active === 1 || j.is_active === true || j.status === 'active'
                            ? 'active' : 'closed',
          postedAt:       j.created_at ?? j.postedAt ?? '',
        }));

        setJobs(normalised);
      } catch (err) {
        setApiError('Failed to load jobs: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job? All related applications will be removed.')) return;
    try {
      await companyService.deleteJob(id);
      setJobs(prev => prev.filter(j => j.id !== id));
    } catch (err) {
      setApiError('Delete failed: ' + err.message);
    }
  };

  const handleEdit = (job) => {
    navigate(`/company/edit-job/${job.id}`);
  };

  const TABS = ['all', 'active', 'closed'];

  const filtered = filter === 'all' ? jobs : jobs.filter(j => j.status === filter);
  const countFor = (tab) => tab === 'all' ? jobs.length : jobs.filter(j => j.status === tab).length;

  return (
    <div className="company-layout">
      <CompanySidebar />
      <div className="company-main">
        <CompanyHeader title="My Jobs" subtitle="Manage your posted job listings" />

        <div className="company-content">

          {apiError && (
            <div className="api-error-banner">
              {apiError}
              <button onClick={() => setApiError('')}>✕</button>
            </div>
          )}

          <div className="page-toolbar">
            <div className="filter-tabs">
              {TABS.map(tab => (
                <button key={tab}
                  className={`filter-tab ${filter === tab ? 'filter-tab--active' : ''}`}
                  onClick={() => setFilter(tab)}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  <span className="tab-count">{countFor(tab)}</span>
                </button>
              ))}
            </div>
            <button className="btn-post-new" onClick={() => navigate('/company/post-job')}>
              <PlusCircle size={16} strokeWidth={2} aria-hidden="true" />
              Post New Job
            </button>
          </div>

          {loading ? (
            <div className="loading-state">
              <Loader2 size={28} className="spin" color="#1B2D6B" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <Briefcase size={40} strokeWidth={1.4} color="#c4cce0" aria-hidden="true" />
              <p>No {filter !== 'all' ? filter : ''} jobs found.</p>
              <button className="empty-link-btn" onClick={() => navigate('/company/post-job')}>
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
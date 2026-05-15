import React, { useState, useEffect } from 'react';
import { AlertTriangle, Trash2, Search, Briefcase } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import './ManageJobsPage.css';

const ManageJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setJobs([
      { id: 1, title: 'Frontend Developer',  company: 'Pixels Design',   type: 'Full-time',  mode: 'Remote', applicants: 12, status: 'active', postedAt: '2025-05-01' },
      { id: 2, title: 'AI Intern',           company: 'DataMinds AI',    type: 'Internship', mode: 'Onsite', applicants: 8,  status: 'active', postedAt: '2025-05-03' },
      { id: 3, title: 'Make Money Fast!!!',  company: 'Fake Corp',       type: 'Part-time',  mode: 'Remote', applicants: 0,  status: 'spam',   postedAt: '2025-05-06' },
      { id: 4, title: 'Backend Engineer',    company: 'TechCo Lebanon',  type: 'Full-time',  mode: 'Onsite', applicants: 5,  status: 'active', postedAt: '2025-04-28' },
    ]);
  }, []);

  const handleDelete   = (id) => { if (window.confirm('Delete this job posting?')) setJobs(prev => prev.filter(j => j.id !== id)); };
  const handleMarkSpam = (id) => setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'spam' } : j));

  const TABS = ['all', 'active', 'spam'];
  const counts = {
    all:    jobs.length,
    active: jobs.filter(j => j.status === 'active').length,
    spam:   jobs.filter(j => j.status === 'spam').length,
  };

  const filtered = jobs.filter(j => {
    const matchFilter = filter === 'all' || j.status === filter;
    const matchSearch = j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        j.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="Manage Jobs" subtitle="Monitor and remove spam or inappropriate job postings" />
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

            <div className="toolbar-search">
              <Search size={15} className="toolbar-search-icon" />
              <input
                type="text"
                className="toolbar-search-input"
                placeholder="Search jobs or companies..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="jobs-table-wrapper">
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Type</th>
                  <th>Mode</th>
                  <th>Applicants</th>
                  <th>Posted</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? filtered.map(job => (
                  <tr key={job.id} className={job.status === 'spam' ? 'spam-row' : ''}>
                    <td className="job-title-cell">{job.title}</td>
                    <td className="text-muted">{job.company}</td>
                    <td>
                      <span className={`type-badge type-badge--${job.type.toLowerCase().replace(/[\s-]/g, '')}`}>
                        {job.type}
                      </span>
                    </td>
                    <td>
                      <span className={`mode-badge mode-badge--${job.mode.toLowerCase()}`}>
                        {job.mode}
                      </span>
                    </td>
                    <td className="text-center applicants-cell">{job.applicants}</td>
                    <td className="text-muted">
                      {new Date(job.postedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                      <div className="status-cell">
                        <span className={`status-dot status-dot--${job.status}`} />
                        <span className={`status-badge status-badge--${job.status}`}>{job.status}</span>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {job.status !== 'spam' && (
                          <button className="btn-action btn-spam" onClick={() => handleMarkSpam(job.id)} title="Mark as spam">
                            <AlertTriangle size={13} strokeWidth={2.2} />
                            <span>Spam</span>
                          </button>
                        )}
                        <button className="btn-action btn-delete-sm" onClick={() => handleDelete(job.id)} title="Delete job">
                          <Trash2 size={13} strokeWidth={2.2} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="8" className="empty-state">
                      <div className="empty-inner">
                        <Briefcase size={30} strokeWidth={1.4} />
                        <p>No jobs found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ManageJobsPage;

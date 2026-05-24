import React, { useState, useEffect } from 'react';
import { AlertTriangle, Trash2, Search, Briefcase, RotateCcw } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import adminService from '../../services/adminService';
import useAdminProfile from '../../components/hooks/useAdminProfile';
import './ManageJobsPage.css';

const ManageJobsPage = () => {
  const adminProfile = useAdminProfile(); 

  const [jobs, setJobs]               = useState([]);
  const [filter, setFilter]           = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminService.getAllJobs();
        setJobs(data.map(j => ({
          ...j,
          company:    j.company_name,
          type:       j.job_type  ?? j.type  ?? 'N/A',
          mode:       j.work_mode ?? j.mode  ?? 'N/A',
          applicants: j.applications_count ?? 0,
          postedAt:   j.created_at,
          status:     j.status ?? 'active',
        })));
      } catch (err) {
        setError(err.message || 'Failed to load jobs.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleMarkSpam = async (id) => {
    if (!window.confirm('Mark this job as spam?')) return;
    try {
      await adminService.updateJobStatus(id, 'spam');
      setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'spam' } : j));
    } catch (err) { alert(err.message || 'Failed to mark as spam.'); }
  };

  const handleSoftDelete = async (id) => {
    if (!window.confirm('Move this job to deleted?')) return;
    try {
      await adminService.updateJobStatus(id, 'deleted');
      setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'deleted' } : j));
    } catch (err) { alert(err.message || 'Failed to delete job.'); }
  };

  const handleUndelete = async (id) => {
    if (!window.confirm('Restore this job to active?')) return;
    try {
      await adminService.updateJobStatus(id, 'active');
      setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'active' } : j));
    } catch (err) { alert(err.message || 'Failed to restore job.'); }
  };

  const handleHardDelete = async (id) => {
    if (!window.confirm('Permanently delete this job? This cannot be undone.')) return;
    try {
      await adminService.deleteJob(id);
      setJobs(prev => prev.filter(j => j.id !== id));
    } catch (err) { alert(err.message || 'Delete failed.'); }
  };

  const TABS = ['all', 'active', 'spam', 'deleted'];
  const counts = {
    all:     jobs.length,
    active:  jobs.filter(j => j.status === 'active').length,
    spam:    jobs.filter(j => j.status === 'spam').length,
    deleted: jobs.filter(j => j.status === 'deleted').length,
  };
  const filtered = jobs.filter(j => {
    const matchFilter = filter === 'all' || j.status === filter;
    const matchSearch = j.title.toLowerCase().includes(searchQuery.toLowerCase()) || j.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader
          title="Manage Jobs"
          subtitle="Monitor, flag spam, and manage job postings"
          adminName={adminProfile.name}
          adminAvatar={adminProfile.avatar}
        />
        <div className="admin-content">
          {loading && <p className="loading-msg">Loading jobs…</p>}
          {error   && <p className="error-msg">{error}</p>}
          {!loading && !error && (
            <>
              <div className="page-toolbar">
                <div className="filter-tabs">
                  {TABS.map(tab => (
                    <button key={tab} className={`filter-tab ${filter === tab ? 'active' : ''}`} onClick={() => setFilter(tab)}>
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      <span className="tab-count">{counts[tab]}</span>
                    </button>
                  ))}
                </div>
                <div className="toolbar-search">
                  <Search size={15} className="toolbar-search-icon" />
                  <input type="text" className="toolbar-search-input" placeholder="Search jobs or companies..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
              </div>
              <div className="jobs-table-wrapper">
                <table className="jobs-table">
                  <thead>
                    <tr><th>Job Title</th><th>Company</th><th>Type</th><th>Mode</th><th>Applicants</th><th>Posted</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {filtered.length > 0 ? filtered.map(job => (
                      <tr key={job.id} className={job.status === 'spam' ? 'spam-row' : job.status === 'deleted' ? 'deleted-row' : ''}>
                        <td className="job-title-cell">{job.title}</td>
                        <td className="text-muted">{job.company}</td>
                        <td><span className={`type-badge type-badge--${job.type.toLowerCase().replace(/[\s-]/g, '')}`}>{job.type}</span></td>
                        <td><span className={`mode-badge mode-badge--${job.mode.toLowerCase()}`}>{job.mode}</span></td>
                        <td className="text-center applicants-cell">{job.applicants}</td>
                        <td className="text-muted">{new Date(job.postedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                        <td>
                          <div className="status-cell">
                            <span className={`status-dot status-dot--${job.status}`} />
                            <span className={`status-badge status-badge--${job.status}`}>{job.status}</span>
                          </div>
                        </td>
                        <td>
                          <div className="action-buttons">
                            {job.status === 'active' && (
                              <>
                                <button className="btn-action btn-spam"      onClick={() => handleMarkSpam(job.id)}    title="Mark as spam"><AlertTriangle size={13} strokeWidth={2.2} /><span>Spam</span></button>
                                <button className="btn-action btn-delete-sm" onClick={() => handleSoftDelete(job.id)}  title="Delete job"><Trash2 size={13} strokeWidth={2.2} /><span>Delete</span></button>
                              </>
                            )}
                            {job.status === 'spam' && (
                              <>
                                <button className="btn-action btn-restore"   onClick={() => handleUndelete(job.id)}    title="Restore to active"><RotateCcw size={13} strokeWidth={2.2} /><span>Restore</span></button>
                                <button className="btn-action btn-delete-sm" onClick={() => handleSoftDelete(job.id)}  title="Move to deleted"><Trash2 size={13} strokeWidth={2.2} /><span>Delete</span></button>
                              </>
                            )}
                            {job.status === 'deleted' && (
                              <>
                                <button className="btn-action btn-restore"    onClick={() => handleUndelete(job.id)}   title="Restore to active"><RotateCcw size={13} strokeWidth={2.2} /><span>Restore</span></button>
                                <button className="btn-action btn-hard-delete" onClick={() => handleHardDelete(job.id)} title="Permanently delete"><Trash2 size={13} strokeWidth={2.2} /><span>Perm. Delete</span></button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="8" className="empty-state"><div className="empty-inner"><Briefcase size={30} strokeWidth={1.4} /><p>No jobs found.</p></div></td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageJobsPage;

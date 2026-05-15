import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import CompanySidebar  from '../../components/company/CompanySidebar';
import CompanyHeader   from '../../components/company/CompanyHeader';
import ApplicantCard   from '../../components/company/ApplicantCard';
import './ApplicantsPage.css';

const ApplicantsPage = () => {
  const { jobId } = useParams();
  const navigate  = useNavigate();

  const [applicants, setApplicants] = useState([]);
  const [jobTitle,   setJobTitle]   = useState('');
  const [filter,     setFilter]     = useState('all');
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    // TODO: replace with real API calls
    // GET /api/jobs/:jobId          → job title
    // GET /api/jobs/:jobId/applicants → list
    setTimeout(() => {
      setJobTitle('Frontend Developer');
      setApplicants([
        { id: 1, name: 'Ali Hassan',    email: 'ali@mail.com',   skills: ['React', 'TypeScript', 'CSS'],     status: 'pending',  cvUrl: '#' },
        { id: 2, name: 'Sara Khalil',   email: 'sara@mail.com',  skills: ['Vue', 'JavaScript', 'Tailwind'],  status: 'accepted', cvUrl: '#' },
        { id: 3, name: 'Omar Khalil',   email: 'omar@mail.com',  skills: ['React', 'Node.js', 'MongoDB'],    status: 'pending',  cvUrl: '#' },
        { id: 4, name: 'Lara Nasser',   email: 'lara@mail.com',  skills: ['Figma', 'CSS', 'React'],          status: 'rejected', cvUrl: '#' },
        { id: 5, name: 'Karim Saad',    email: 'karim@mail.com', skills: ['TypeScript', 'React', 'GraphQL'], status: 'pending',  cvUrl: '#' },
      ]);
      setLoading(false);
    }, 600);
  }, [jobId]);

  const handleAccept = (id) => {
    // TODO: PUT /api/applications/:id  { status: 'accepted' }
    setApplicants(prev =>
      prev.map(a => (a._id ?? a.id) === id ? { ...a, status: 'accepted' } : a)
    );
  };

  const handleReject = (id) => {
    // TODO: PUT /api/applications/:id  { status: 'rejected' }
    setApplicants(prev =>
      prev.map(a => (a._id ?? a.id) === id ? { ...a, status: 'rejected' } : a)
    );
  };

  const counts = {
    all:      applicants.length,
    pending:  applicants.filter(a => a.status === 'pending').length,
    accepted: applicants.filter(a => a.status === 'accepted').length,
    rejected: applicants.filter(a => a.status === 'rejected').length,
  };

  const TABS = ['all', 'pending', 'accepted', 'rejected'];

  const filtered = filter === 'all'
    ? applicants
    : applicants.filter(a => a.status === filter);

  return (
    <div className="company-layout">
      <CompanySidebar />
      <div className="company-main">
        <CompanyHeader
          title={`Applicants — ${jobTitle}`}
          subtitle={`${counts.all} total · ${counts.pending} pending review`}
        />

        <div className="company-content">

          {/* Toolbar */}
          <div className="page-toolbar">
            <button
              className="btn-back"
              onClick={() => navigate('/company/my-jobs')}
            >
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

          {/* Content */}
          {loading ? (
            <div className="loading-state">Loading applicants…</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <Users size={40} strokeWidth={1.4} color="#c4cce0" aria-hidden="true" />
              <p>No {filter !== 'all' ? filter : ''} applicants yet.</p>
            </div>
          ) : (
            <div className="applicants-grid">
              {filtered.map(applicant => (
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
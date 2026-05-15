import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Briefcase, CheckCircle, Clock, ArrowRight, Sparkles } from 'lucide-react';
import StudentNavbar from '../../components/student/StudentNavbar';
import JobListCard from '../../components/student/JobListCard';
import './StudentDashboard.css';

/* ── Mock Data ── */
const STUDENT = { name: 'Ahmed Khalil', field: 'Frontend Developer', profileComplete: 75 };

const STATS = [
  { label: 'Applied Jobs',   value: 8,  icon: <Briefcase size={20} />,   color: '#2A3F8F' },
  { label: 'Accepted',       value: 2,  icon: <CheckCircle size={20} />, color: '#1a8a5a' },
  { label: 'Pending',        value: 5,  icon: <Clock size={20} />,       color: '#c47d00' },
];

const SUGGESTED_JOBS = [
  {
    id: '1', title: 'Frontend Developer', company: 'TechCorp', location: 'Beirut, Lebanon',
    type: 'Full-time', mode: 'Remote', field: 'Frontend',
    skills: ['React', 'TypeScript', 'Tailwind', 'REST APIs'],
    deadline: '2025-05-20', postedAgo: '2 days ago',
  },
  {
    id: '2', title: 'React Intern', company: 'StartupXYZ', location: 'Remote',
    type: 'Internship', mode: 'Remote', field: 'Frontend',
    skills: ['React', 'CSS', 'JavaScript'],
    deadline: '2025-07-15', postedAgo: '1 day ago',
  },
  {
    id: '3', title: 'UI/UX Developer', company: 'DesignHub', location: 'Beirut, Lebanon',
    type: 'Part-time', mode: 'Hybrid', field: 'Design',
    skills: ['Figma', 'React', 'CSS', 'UX Research'],
    deadline: '2025-08-01', postedAgo: '3 days ago',
  },
];

const LATEST_JOBS = [
  {
    id: '4', title: 'Node.js Developer', company: 'CloudBase', location: 'Tripoli, Lebanon',
    type: 'Full-time', mode: 'Onsite', field: 'Backend',
    skills: ['Node.js', 'MongoDB', 'Express', 'Docker'],
    deadline: '2025-05-20', postedAgo: '5 hours ago',
  },
  {
    id: '5', title: 'AI Engineer', company: 'NeuralLab', location: 'Remote',
    type: 'Full-time', mode: 'Remote', field: 'AI/ML',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'NLP'],
    deadline: '2025-08-20', postedAgo: '12 hours ago',
  },
  {
    id: '6', title: 'Full-stack Developer', company: 'WebAgency', location: 'Beirut, Lebanon',
    type: 'Full-time', mode: 'Hybrid', field: 'Full-stack',
    skills: ['React', 'Node.js', 'PostgreSQL'],
    deadline: '2025-09-10', postedAgo: '1 day ago',
  },
];

/* ── Component ── */
const StudentDashboard = () => {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);

  const toggleSave = (id) =>
    setSavedJobs(prev => prev.includes(id) ? prev.filter(j => j !== id) : [...prev, id]);

  return (
    <div className="sd">
      <StudentNavbar studentName={STUDENT.name} notifCount={3} />

      <main className="sd__main">

        {/* ── Hero Welcome ── */}
        <section className="sd__hero">
          <div className="sd__hero-text">
            <p className="sd__greeting">Good morning 👋</p>
            <h1 className="sd__name">Welcome back, <span>{STUDENT.name.split(' ')[0]}</span></h1>
            <p className="sd__sub">Here's what's happening with your job search today.</p>
          </div>

          {/* Profile completion */}
          {STUDENT.profileComplete < 100 && (
            <div className="sd__profile-alert">
              <Sparkles size={16} />
              <div>
                <p className="sd__alert-title">Complete your profile to apply</p>
                <div className="sd__progress-bar">
                  <div className="sd__progress-fill" style={{ width: `${STUDENT.profileComplete}%` }} />
                </div>
                <p className="sd__alert-sub">{STUDENT.profileComplete}% completed</p>
              </div>
              <button className="sd__alert-btn" onClick={() => navigate('/student/profile')}>
                Complete <ArrowRight size={13} />
              </button>
            </div>
          )}
        </section>

        {/* ── Stats ── */}
        <section className="sd__stats">
          {STATS.map(({ label, value, icon, color }) => (
            <div className="sd__stat-card" key={label}>
              <div className="sd__stat-icon" style={{ background: `${color}18`, color }}>
                {icon}
              </div>
              <div>
                <p className="sd__stat-value">{value}</p>
                <p className="sd__stat-label">{label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ── Suggested Jobs ── */}
        <section className="sd__section">
          <div className="sd__section-header">
            <div>
              <h2 className="sd__section-title">Suggested for You</h2>
              <p className="sd__section-sub">Jobs matching your skills & preferences</p>
            </div>
            <button className="sd__see-all" onClick={() => navigate('/student/jobs')}>
              See All Jobs <ArrowRight size={14} />
            </button>
          </div>
          <div className="sd__grid">
            {SUGGESTED_JOBS.map(job => (
              <JobListCard
                key={job.id}
                {...job}
                saved={savedJobs.includes(job.id)}
                onSave={toggleSave}
                onViewAll={() => navigate('/student/jobs')}
              />
            ))}
          </div>
        </section>

        {/* ── Latest Jobs ── */}
        <section className="sd__section">
          <div className="sd__section-header">
            <div>
              <h2 className="sd__section-title">Latest Openings</h2>
              <p className="sd__section-sub">Fresh opportunities posted recently</p>
            </div>
            <button className="sd__see-all" onClick={() => navigate('/student/jobs')}>
              See All Jobs <ArrowRight size={14} />
            </button>
          </div>
          <div className="sd__grid">
            {LATEST_JOBS.map(job => (
              <JobListCard
                key={job.id}
                {...job}
                saved={savedJobs.includes(job.id)}
                onSave={toggleSave}
                onViewAll={() => navigate('/student/jobs')}
              />
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

export default StudentDashboard;
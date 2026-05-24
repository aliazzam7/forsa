import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Briefcase, CheckCircle, Clock, ArrowRight, Sparkles } from 'lucide-react';
import StudentNavbar from '../../components/student/StudentNavbar';
import JobListCard from '../../components/student/JobListCard';
import Footer from '../../components/landing/Footer/Footer'; 
import studentService from '../../services/studentService';
import authService from '../../services/authService';
import { BASE_URL } from '../../services/api'; // ← [FIX 1] أضفنا import لـ BASE_URL
import './StudentDashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [studentName, setStudentName] = useState('');
  const [profileComplete, setProfileComplete] = useState(0);
  const [stats, setStats] = useState({ total_applications: 0, accepted: 0, pending: 0 });
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApps, setRecentApps] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashData, profileData] = await Promise.all([
          studentService.getDashboard(),
          studentService.getProfile(),
        ]);
        setStats(dashData.stats || { total_applications: 0, accepted: 0, pending: 0 });
        setRecentJobs(dashData.recent_jobs || []);
        setRecentApps(dashData.recent_applications || []);
        setStudentName(profileData.name || 'Student');
        setProfileComplete(calcCompletion(profileData));
      } catch (err) {
        setError(err.message || 'Failed to load dashboard.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // [FIX 2] زبطنا calcCompletion — حذفنا website/linkedin/github من الحساب
  // وأضفنا graduation_year عشان الـ 100% تكون منطقية
  const calcCompletion = (p) => {
    if (!p) return 0;
    const fields = [
      p.name,
      p.email,
      p.phone,
      p.location,
      p.bio,
      p.university,
      p.major,
      p.graduation_year,
      p.skills?.length > 0,
      p.experience?.length > 0,
      p.cv_path,
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  const toggleSave = (id) =>
    setSavedJobs(prev =>
      prev.includes(id) ? prev.filter(j => j !== id) : [...prev, id]
    );

  // [FIX 3] زبطنا mapJob — logo بحاجة base URL، وskills_required بدل skills
  const mapJob = (job) => ({
    id: String(job.id),
    title: job.title,
    company: job.company_name || job.company || '',
    companyLogo: job.logo
      ? `${BASE_URL.replace('/api', '')}/${job.logo}`
      : null,
    location: job.location || '',
    type: job.type || 'Full-time',
    mode: job.mode || 'Remote',
    field: job.field || '',
    skills: job.skills_required
      ? (Array.isArray(job.skills_required) ? job.skills_required : [])
      : (job.skills
          ? (Array.isArray(job.skills) ? job.skills : [])
          : []),
    deadline: job.deadline || '',
    postedAgo: job.posted_ago || job.postedAgo || '',
  });

  const STATS_CONFIG = [
    { label: 'Applied Jobs', value: stats.total_applications, icon: <Briefcase size={20} />, color: '#2A3F8F' },
    { label: 'Accepted',     value: stats.accepted,           icon: <CheckCircle size={20} />, color: '#1a8a5a' },
    { label: 'Pending',      value: stats.pending,            icon: <Clock size={20} />,       color: '#c47d00' },
  ];

  const firstName = studentName.split(' ')[0];

  if (loading) {
    return (
      <div className="sd">
        <StudentNavbar studentName="..." notifCount={0} />
        <main className="sd__main">
          <div style={{ textAlign: 'center', padding: '4rem', color: '#6B7A99' }}>
            Loading your dashboard...
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sd">
        <StudentNavbar studentName="Student" notifCount={0} />
        <main className="sd__main">
          <div style={{ textAlign: 'center', padding: '4rem', color: '#b91c1c' }}>
            {error}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="sd">
      <StudentNavbar studentName={firstName} notifCount={3} />

      <main className="sd__main">

        <section className="sd__hero">
          <div className="sd__hero-text">
            <p className="sd__greeting">Good morning 👋</p>
            <h1 className="sd__name">
              Welcome back, <span>{firstName}</span>
            </h1>
            <p className="sd__sub">Here's what's happening with your job search today.</p>
          </div>

          {profileComplete < 100 && (
            <div className="sd__profile-alert">
              <Sparkles size={16} />
              <div>
                <p className="sd__alert-title">Complete your profile to apply</p>
                <div className="sd__progress-bar">
                  <div
                    className="sd__progress-fill"
                    style={{ width: `${profileComplete}%` }}
                  />
                </div>
                <p className="sd__alert-sub">{profileComplete}% completed</p>
              </div>
              <button
                className="sd__alert-btn"
                onClick={() => navigate('/student/profile')}
              >
                Complete <ArrowRight size={13} />
              </button>
            </div>
          )}
        </section>

        <section className="sd__stats">
          {STATS_CONFIG.map(({ label, value, icon, color }) => (
            <div className="sd__stat-card" key={label}>
              <div
                className="sd__stat-icon"
                style={{ background: `${color}18`, color }}
              >
                {icon}
              </div>
              <div>
                <p className="sd__stat-value">{value}</p>
                <p className="sd__stat-label">{label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* [FIX 4] Recent Jobs — كانت بتتطلع بس لما recentJobs.length > 0
            تأكدنا أن mapJob يعمل صح مع الـ logo والـ skills */}
        {recentJobs.length > 0 && (
          <section className="sd__section">
            <div className="sd__section-header">
              <div>
                <h2 className="sd__section-title">Latest Openings</h2>
                <p className="sd__section-sub">Fresh opportunities posted recently</p>
              </div>
              <button
                className="sd__see-all"
                onClick={() => navigate('/student/jobs')}
              >
                See All Jobs <ArrowRight size={14} />
              </button>
            </div>
            <div className="sd__grid">
              {recentJobs.map(job => (
                <JobListCard
                  key={job.id}
                  {...mapJob(job)}
                  saved={savedJobs.includes(String(job.id))}
                  onSave={toggleSave}
                  onViewAll={() => navigate('/student/jobs')}
                />
              ))}
            </div>
          </section>
        )}

      </main>
      <Footer />
    </div>
  );
};

export default StudentDashboard;

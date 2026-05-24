import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FeaturedJobSection.css';
import {
  BriefcaseBusiness,
  MapPin,
  ArrowRight,
  Building2,
} from 'lucide-react';
import jobService from '../../../services/jobService';

const BASE_UPLOAD_URL = 'http://localhost/forsa-platform-backend/';

const FeaturedJobsSection = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await jobService.getAllJobs();
        setJobs(data.slice(0, 3));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleApply = (jobId) => {
    const token = localStorage.getItem('forsa_token');
    if (!token) {
      navigate('/login');
    } else {
      navigate(`/student/jobs/${jobId}`);
    }
  };

  if (loading) {
    return (
      <section className="fjs-section" id="jobs">
        <div className="fjs-container">
          <div className="fjs-header">
            <h2 className="fjs-title">
              Featured <span>Jobs</span>
            </h2>
            <p className="fjs-subtitle">
              Discover hand-picked opportunities from trusted companies and
              launch your professional journey with confidence.
            </p>
          </div>
          <div className="fjs-grid">
            {[1, 2, 3].map((i) => (
              <div className="fjs-card fjs-card--skeleton" key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="fjs-section" id="jobs">
        <div className="fjs-container">
          <p style={{ textAlign: 'center', color: '#e74c3c' }}>
            Failed to load jobs. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="fjs-section" id="jobs">
      <div className="fjs-container">
        <div className="fjs-header">
          <h2 className="fjs-title">
            Featured <span>Jobs</span>
          </h2>
          <p className="fjs-subtitle">
            Discover hand-picked opportunities from trusted companies and
            launch your professional journey with confidence.
          </p>
        </div>

        <div className="fjs-grid">
          {jobs.map((job) => {
            const skills =
              typeof job.skills_required === 'string'
                ? JSON.parse(job.skills_required)
                : job.skills_required ?? [];

            const logoUrl = job.logo
              ? `${BASE_UPLOAD_URL}${job.logo}`
              : null;

            return (
              <div className="fjs-card" key={job.id}>
                <div className="fjs-card-top">
                  <div className="fjs-company-icon">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt={job.company_name}
                        style={{
                          width: 40,
                          height: 40,
                          objectFit: 'contain',
                          borderRadius: 8,
                        }}
                      />
                    ) : (
                      <Building2 size={24} />
                    )}
                  </div>

                  <span
                    className={`fjs-badge ${
                      job.type?.toLowerCase().replace('-', '') ?? ''
                    }`}
                  >
                    {job.type}
                  </span>
                </div>

                <h3 className="fjs-job-title">{job.title}</h3>

                <div className="fjs-company">
                  <BriefcaseBusiness size={16} />
                  <span>{job.company_name}</span>
                </div>

                <div className="fjs-location">
                  <MapPin size={16} />
                  <span>{job.mode}</span>
                </div>

                <div className="fjs-skills">
                  {skills.map((skill, i) => (
                    <span key={i} className="fjs-skill">
                      {skill}
                    </span>
                  ))}
                </div>

                <button
                  className="fjs-button"
                  onClick={() => handleApply(job.id)}
                >
                  Apply Now
                  <ArrowRight size={18} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="fjs-bottom">
          <button className="fjs-view-btn" onClick={() => navigate('/student/jobs')}>
            View All Jobs
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobsSection;
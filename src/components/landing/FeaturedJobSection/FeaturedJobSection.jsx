import './FeaturedJobSection.css';
import {
  BriefcaseBusiness,
  MapPin,
  Clock3,
  ArrowRight,
  Building2,
} from 'lucide-react';

const featuredJobs = [
  {
    title: 'Frontend Developer',
    company: 'TechNova',
    type: 'Full-time',
    location: 'Remote',
    skills: ['React', 'TypeScript', 'Tailwind'],
  },
  {
    title: 'Backend Engineer',
    company: 'DataCore',
    type: 'Internship',
    location: 'Onsite',
    skills: ['Node.js', 'MongoDB', 'Express'],
  },
  {
    title: 'UI / UX Designer',
    company: 'PixelLab',
    type: 'Part-time',
    location: 'Hybrid',
    skills: ['Figma', 'Adobe XD', 'UI Design'],
  },
];

const FeaturedJobsSection = () => {
  return (
    <section className="fjs-section" id="jobs">
      <div className="fjs-container">
        <div className="fjs-header">
          {/* <span className="fjs-tag">Career Opportunities</span> */}

          <h2 className="fjs-title">
            Featured <span>Jobs</span>
          </h2>

          <p className="fjs-subtitle">
            Discover hand-picked opportunities from trusted companies and
            launch your professional journey with confidence.
          </p>
        </div>

        <div className="fjs-grid">
          {featuredJobs.map((job, index) => (
            <div className="fjs-card" key={index}>
              <div className="fjs-card-top">
                <div className="fjs-company-icon">
                  <Building2 size={24} />
                </div>

                <span className={`fjs-badge ${job.type.toLowerCase().replace('-', '')}`}>
                  {job.type}
                </span>
              </div>

              <h3 className="fjs-job-title">{job.title}</h3>

              <div className="fjs-company">
                <BriefcaseBusiness size={16} />
                <span>{job.company}</span>
              </div>

              <div className="fjs-location">
                <MapPin size={16} />
                <span>{job.location}</span>
              </div>

              <div className="fjs-skills">
                {job.skills.map((skill, i) => (
                  <span key={i} className="fjs-skill">
                    {skill}
                  </span>
                ))}
              </div>

              <button className="fjs-button">
                Apply Now
                <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="fjs-bottom">
          <button className="fjs-view-btn">
            View All Jobs
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobsSection;
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Clock, Briefcase, Globe, Calendar,
  CheckCircle, BookmarkPlus, Share2, Building2, Users,
  X, Upload, Send, AlertCircle
} from 'lucide-react';
import StudentNavbar from '../../components/student/StudentNavbar';
import './JobDetailsPage.css';

/* ── Mock Jobs ── */
const JOBS_DB = {
  '1': {
    id: '1', title: 'Frontend Developer', company: 'TechCorp',
    companyLogo: null, companySize: '50–200 employees', companyWebsite: 'https://techcorp.com',
    companyAbout: 'TechCorp is a leading software solutions company specializing in building scalable web applications for enterprise clients across the MENA region.',
    location: 'Beirut, Lebanon', type: 'Full-time', mode: 'Remote', field: 'Frontend',
    salary: '$1,500 – $2,500 / month',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'REST APIs', 'Git', 'Figma'],
    deadline: '2025-08-30', postedAgo: '2 days ago', applicants: 24,
    description: `We're looking for a skilled Frontend Developer to join our growing team. You'll work on building and maintaining modern web applications, collaborating closely with designers and backend engineers to deliver exceptional user experiences.

This is a great opportunity to work with cutting-edge technologies in a fast-paced, remote-friendly environment.`,
    responsibilities: [
      'Build and maintain responsive React-based web applications',
      'Collaborate with UI/UX designers to implement pixel-perfect designs',
      'Optimize application performance and ensure cross-browser compatibility',
      'Write clean, well-documented, and testable code',
      'Participate in code reviews and contribute to team best practices',
      'Integrate RESTful APIs and third-party services',
    ],
    requirements: [
      '2+ years of experience with React.js',
      'Strong proficiency in TypeScript and modern JavaScript (ES6+)',
      'Experience with state management (Redux, Zustand, or Context API)',
      'Familiarity with CSS frameworks (Tailwind CSS preferred)',
      'Understanding of RESTful APIs and async programming',
      'Good eye for detail and UI/UX sensibility',
    ],
    niceToHave: [
      'Experience with Next.js',
      'Knowledge of testing libraries (Jest, React Testing Library)',
      'Contributions to open-source projects',
    ],
  },
  '2': {
    id: '2', title: 'React Intern', company: 'StartupXYZ',
    companyLogo: null, companySize: '10–50 employees', companyWebsite: 'https://startupxyz.com',
    companyAbout: 'StartupXYZ is an innovative startup building the next generation of productivity tools. We believe in learning by doing and offer a great environment for interns to grow.',
    location: 'Remote', type: 'Internship', mode: 'Remote', field: 'Frontend',
    salary: '$400 – $700 / month',
    skills: ['React', 'CSS', 'JavaScript', 'HTML'],
    deadline: '2025-07-15', postedAgo: '1 day ago', applicants: 41,
    description: `An exciting internship opportunity for a junior developer looking to gain hands-on React experience. You'll be building real features that users will actually use, guided by senior engineers.`,
    responsibilities: [
      'Develop new UI components using React.js',
      'Fix bugs and improve existing features',
      'Write documentation for components you build',
      'Attend daily standups and weekly planning sessions',
    ],
    requirements: [
      'Basic knowledge of React.js',
      'Solid understanding of HTML, CSS, and JavaScript',
      'Eagerness to learn and grow',
      'Good communication skills',
    ],
    niceToHave: ['Familiarity with Git', 'Personal projects on GitHub'],
  },
};

/* Fallback job for unknown IDs */
const DEFAULT_JOB = JOBS_DB['1'];

/* ── Apply Modal ── */
const ApplyModal = ({ job, onClose, onSubmit }) => {
  const [form, setForm] = useState({ coverLetter: '', phone: '', cvFile: null });
  const [submitted, setSubmitted] = useState(false);
  const fileRef = React.useRef();

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') setForm(f => ({ ...f, cvFile: file }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => { onSubmit(); onClose(); }, 1800);
  };

  if (submitted) return (
    <div className="jd__modal-overlay" onClick={onClose}>
      <div className="jd__modal jd__modal--success" onClick={e => e.stopPropagation()}>
        <div className="jd__success-icon"><CheckCircle size={48} /></div>
        <h3>Application Submitted!</h3>
        <p>Your application to <strong>{job.company}</strong> has been sent successfully. You'll be notified once they review it.</p>
      </div>
    </div>
  );

  return (
    <div className="jd__modal-overlay" onClick={onClose}>
      <div className="jd__modal" onClick={e => e.stopPropagation()}>
        <div className="jd__modal-header">
          <div>
            <h3>Apply to {job.title}</h3>
            <p>{job.company} · {job.location}</p>
          </div>
          <button className="jd__modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="jd__modal-body">
          {/* CV Upload */}
          <div className="jd__form-group">
            <label className="jd__form-label">Resume / CV <span className="jd__required">*</span></label>
            <input ref={fileRef} type="file" accept="application/pdf" style={{ display:'none' }} onChange={handleFile} />
            {form.cvFile
              ? (
                <div className="jd__file-selected">
                  <CheckCircle size={16} className="jd__file-ok" />
                  <span>{form.cvFile.name}</span>
                  <button onClick={() => setForm(f => ({ ...f, cvFile: null }))}><X size={13} /></button>
                </div>
              )
              : (
                <button className="jd__file-upload-btn" onClick={() => fileRef.current.click()}>
                  <Upload size={15} /> Upload CV (PDF only)
                </button>
              )
            }
          </div>

          {/* Phone */}
          <div className="jd__form-group">
            <label className="jd__form-label">Phone Number <span className="jd__required">*</span></label>
            <input
              className="jd__form-input"
              type="tel"
              placeholder="+961 XX XXX XXX"
              value={form.phone}
              onChange={set('phone')}
            />
          </div>

          {/* Cover Letter */}
          <div className="jd__form-group">
            <label className="jd__form-label">Cover Letter <span className="jd__optional">(Optional)</span></label>
            <textarea
              className="jd__form-textarea"
              rows={5}
              placeholder={`Tell ${job.company} why you're a great fit for this role...`}
              value={form.coverLetter}
              onChange={set('coverLetter')}
            />
            <p className="jd__char-count">{form.coverLetter.length} / 1000 characters</p>
          </div>

          <div className="jd__modal-note">
            <AlertCircle size={13} />
            Your profile info and skills will be included automatically.
          </div>
        </div>

        <div className="jd__modal-footer">
          <button className="jd__modal-cancel" onClick={onClose}>Cancel</button>
          <button
            className="jd__modal-submit"
            onClick={handleSubmit}
            disabled={!form.phone}
          >
            <Send size={14} /> Submit Application
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Main Component ── */
const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = JOBS_DB[id] || DEFAULT_JOB;

  const [saved,       setSaved]       = useState(false);
  const [applied,     setApplied]     = useState(false);
  const [showModal,   setShowModal]   = useState(false);

  const formattedDeadline = new Date(job.deadline).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  const daysLeft = Math.ceil((new Date(job.deadline) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="jd">
      <StudentNavbar studentName="Ahmed" notifCount={2} />

      <main className="jd__main">

        {/* ── Back ── */}
        <button className="jd__back" onClick={() => navigate('/student/jobs')}>
          <ArrowLeft size={16} /> Back to Jobs
        </button>

        <div className="jd__layout">

          {/* ════════ LEFT — Main Content ════════ */}
          <div className="jd__content">

            {/* Job Hero Card */}
            <div className="jd__hero-card">
              <div className="jd__hero-top">
                <div className="jd__company-logo">
                  {job.companyLogo
                    ? <img src={job.companyLogo} alt={job.company} />
                    : <span>{job.company.charAt(0)}</span>
                  }
                </div>
                <div className="jd__hero-meta">
                  <h1 className="jd__job-title">{job.title}</h1>
                  <p className="jd__company-name">{job.company}</p>
                  <div className="jd__hero-tags">
                    <span className="jd__tag jd__tag--type"><Briefcase size={12} /> {job.type}</span>
                    <span className="jd__tag jd__tag--mode"><Globe size={12} /> {job.mode}</span>
                    <span className="jd__tag jd__tag--field">{job.field}</span>
                  </div>
                </div>
                <div className="jd__hero-actions">
                  <button
                    className={`jd__save-btn ${saved ? 'jd__save-btn--saved' : ''}`}
                    onClick={() => setSaved(v => !v)}
                    title="Save job"
                  >
                    <BookmarkPlus size={17} />
                  </button>
                  <button className="jd__share-btn" title="Share">
                    <Share2 size={17} />
                  </button>
                </div>
              </div>

              <div className="jd__hero-info">
                <div className="jd__info-item"><MapPin size={14} /> {job.location}</div>
                <div className="jd__info-item"><Clock size={14} /> Posted {job.postedAgo}</div>
                <div className="jd__info-item"><Users size={14} /> {job.applicants} applicants</div>
                <div className="jd__info-item"><Calendar size={14} /> Deadline: {formattedDeadline}</div>
              </div>

              {daysLeft <= 10 && daysLeft > 0 && (
                <div className="jd__deadline-warn">
                  <AlertCircle size={14} /> Only {daysLeft} day{daysLeft !== 1 ? 's' : ''} left to apply!
                </div>
              )}
              {daysLeft <= 0 && (
                <div className="jd__deadline-expired">
                  <AlertCircle size={14} /> Application deadline has passed.
                </div>
              )}
            </div>

            {/* Description */}
            <div className="jd__card">
              <h2 className="jd__section-title">About the Role</h2>
              <p className="jd__description">{job.description}</p>
            </div>

            {/* Responsibilities */}
            <div className="jd__card">
              <h2 className="jd__section-title">Responsibilities</h2>
              <ul className="jd__list">
                {job.responsibilities.map((r, i) => (
                  <li key={i} className="jd__list-item">
                    <span className="jd__list-dot" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="jd__card">
              <h2 className="jd__section-title">Requirements</h2>
              <ul className="jd__list">
                {job.requirements.map((r, i) => (
                  <li key={i} className="jd__list-item">
                    <CheckCircle size={14} className="jd__list-check" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Nice to Have */}
            {job.niceToHave && (
              <div className="jd__card">
                <h2 className="jd__section-title">Nice to Have</h2>
                <ul className="jd__list">
                  {job.niceToHave.map((r, i) => (
                    <li key={i} className="jd__list-item jd__list-item--soft">
                      <span className="jd__list-dot jd__list-dot--soft" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            <div className="jd__card">
              <h2 className="jd__section-title">Required Skills</h2>
              <div className="jd__skills">
                {job.skills.map(s => (
                  <span key={s} className="jd__skill">{s}</span>
                ))}
              </div>
            </div>

          </div>

          {/* ════════ RIGHT — Sidebar ════════ */}
          <div className="jd__sidebar">

            {/* Apply Card */}
            <div className="jd__apply-card">
              {job.salary && (
                <div className="jd__salary">
                  <p className="jd__salary-label">Salary Range</p>
                  <p className="jd__salary-value">{job.salary}</p>
                </div>
              )}

              {applied
                ? (
                  <div className="jd__applied-msg">
                    <CheckCircle size={20} />
                    <div>
                      <p className="jd__applied-title">Application Sent!</p>
                      <p className="jd__applied-sub">We'll notify you of any updates.</p>
                    </div>
                  </div>
                )
                : (
                  <button
                    className="jd__apply-btn"
                    onClick={() => setShowModal(true)}
                    disabled={daysLeft <= 0}
                  >
                    <Send size={16} />
                    {daysLeft <= 0 ? 'Deadline Passed' : 'Apply Now'}
                  </button>
                )
              }

              <button
                className={`jd__save-full ${saved ? 'jd__save-full--saved' : ''}`}
                onClick={() => setSaved(v => !v)}
              >
                <BookmarkPlus size={15} />
                {saved ? 'Saved' : 'Save Job'}
              </button>
            </div>

            {/* Company Card */}
            <div className="jd__company-card">
              <div className="jd__company-card-logo">
                {job.companyLogo
                  ? <img src={job.companyLogo} alt={job.company} />
                  : <span>{job.company.charAt(0)}</span>
                }
              </div>
              <h3 className="jd__company-card-name">{job.company}</h3>
              <p className="jd__company-card-size"><Building2 size={13} /> {job.companySize}</p>
              <p className="jd__company-about">{job.companyAbout}</p>
              {job.companyWebsite && (
                <a
                  href={job.companyWebsite}
                  target="_blank"
                  rel="noreferrer"
                  className="jd__company-link"
                >
                  <Globe size={13} /> Visit Website
                </a>
              )}
            </div>

            {/* Quick Info */}
            <div className="jd__quick-card">
              <h3 className="jd__quick-title">Job Overview</h3>
              {[
                { label: 'Job Type',   value: job.type,      icon: <Briefcase size={14} /> },
                { label: 'Work Mode',  value: job.mode,      icon: <Globe size={14} /> },
                { label: 'Field',      value: job.field,     icon: <Building2 size={14} /> },
                { label: 'Location',   value: job.location,  icon: <MapPin size={14} /> },
                { label: 'Deadline',   value: formattedDeadline, icon: <Calendar size={14} /> },
                { label: 'Applicants', value: `${job.applicants} applied`, icon: <Users size={14} /> },
              ].map(({ label, value, icon }) => (
                <div className="jd__quick-row" key={label}>
                  <span className="jd__quick-label">{icon} {label}</span>
                  <span className="jd__quick-value">{value}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </main>

      {/* ── Apply Modal ── */}
      {showModal && (
        <ApplyModal
          job={job}
          onClose={() => setShowModal(false)}
          onSubmit={() => setApplied(true)}
        />
      )}
    </div>
  );
};

export default JobDetailsPage;
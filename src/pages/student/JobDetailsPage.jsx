import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Clock, Briefcase, Globe, Calendar,
  CheckCircle, BookmarkPlus, Share2, Building2, Users,
  X, Upload, Send, AlertCircle
} from 'lucide-react';
import StudentNavbar from '../../components/student/StudentNavbar';
import jobService from '../../services/jobService';
import applicationService from '../../services/applicationService';
import studentService from '../../services/studentService';
import { BASE_URL } from '../../services/api';
import './JobDetailsPage.css';

/* ── Apply Modal ── */
const ApplyModal = ({ job, onClose, onSubmit }) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [cvFile, setCvFile]           = useState(null);
  const [submitted, setSubmitted]     = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const fileRef = React.useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') setCvFile(file);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setSubmitError(null);
      if (cvFile) {
        await studentService.uploadCV(cvFile);
      }
      await applicationService.applyToJob(job.id);
      setSubmitted(true);
      setTimeout(() => { onSubmit(); onClose(); }, 1800);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) return (
    <div className="jd__modal-overlay" onClick={onClose}>
      <div className="jd__modal jd__modal--success" onClick={e => e.stopPropagation()}>
        <div className="jd__success-icon"><CheckCircle size={48} /></div>
        <h3>Application Submitted!</h3>
        <p>Your application to <strong>{job.company}</strong> has been sent successfully.</p>
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
          <div className="jd__form-group">
            <label className="jd__form-label">
              Resume / CV <span className="jd__optional">(Optional — uses your profile CV if not provided)</span>
            </label>
            <input ref={fileRef} type="file" accept="application/pdf" style={{ display:'none' }} onChange={handleFile} />
            {cvFile
              ? (
                <div className="jd__file-selected">
                  <CheckCircle size={16} className="jd__file-ok" />
                  <span>{cvFile.name}</span>
                  <button onClick={() => setCvFile(null)}><X size={13} /></button>
                </div>
              )
              : (
                <button className="jd__file-upload-btn" onClick={() => fileRef.current.click()}>
                  <Upload size={15} /> Upload CV (PDF only)
                </button>
              )
            }
          </div>
          <div className="jd__form-group">
            <label className="jd__form-label">
              Cover Letter <span className="jd__optional">(Optional)</span>
            </label>
            <textarea
              className="jd__form-textarea"
              rows={5}
              placeholder={`Tell ${job.company} why you're a great fit...`}
              value={coverLetter}
              onChange={e => setCoverLetter(e.target.value)}
            />
            <p className="jd__char-count">{coverLetter.length} / 1000 characters</p>
          </div>
          {submitError && (
            <div className="jd__modal-error">
              <AlertCircle size={14} /> {submitError}
            </div>
          )}
          <div className="jd__modal-note">
            <AlertCircle size={13} />
            Your profile info and skills will be included automatically.
          </div>
        </div>
        <div className="jd__modal-footer">
          <button className="jd__modal-cancel" onClick={onClose}>Cancel</button>
          <button className="jd__modal-submit" onClick={handleSubmit} disabled={submitting}>
            <Send size={14} /> {submitting ? 'Submitting...' : 'Submit Application'}
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

  const [job,       setJob]       = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [saved,     setSaved]     = useState(false);
  const [applied,   setApplied]   = useState(false); // [FIX 5] هاد بيتحدث من الـ API
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);

        // [FIX 5] جيب الـ job وتحقق من applications بنفس الوقت
        const [data, myApps] = await Promise.all([
          jobService.getJobById(id),
          studentService.getMyApplications().catch(() => []), // لو فشل ما يأثر
        ]);

        // [FIX 5] تحقق إذا الطالب قدّم على هالوظيفة قبل
        const alreadyApplied = myApps.some(a => String(a.job_id) === String(id));
        setApplied(alreadyApplied);

        const normalized = {
          id:              String(data.id),
          title:           data.title           || '',
          company:         data.company_name    || data.company || '',
          // [FIX 6] logo بحاجة base URL
          companyLogo:     data.logo
            ? `${BASE_URL.replace('/api', '')}/${data.logo}`
            : null,
          companySize:     data.company_size    || '',
          companyWebsite:  data.company_website || data.website || '',
          companyAbout:    data.company_desc    || data.company_about || data.about || '',
          location:        data.location        || '',
          type:            data.type            || 'Full-time',
          mode:            data.mode            || 'Remote',
          field:           data.field           || '',
          salary:          data.salary          || '',
          // [FIX 7] skills_required هو الاسم الصح من الـ DB
          skills: data.skills_required
            ? (Array.isArray(data.skills_required) ? data.skills_required : [])
            : (data.skills
                ? (Array.isArray(data.skills)
                    ? data.skills
                    : (() => { try { return JSON.parse(data.skills); } catch { return []; } })())
                : []),
          deadline:        data.deadline        || '',
          postedAgo:       data.posted_ago      || data.postedAgo || '',
          applicants:      data.applicants      || data.applicants_count || 0,
          description:     data.description     || '',
          responsibilities: data.responsibilities
            ? (Array.isArray(data.responsibilities)
                ? data.responsibilities
                : (() => { try { return JSON.parse(data.responsibilities); } catch { return [data.responsibilities]; } })())
            : [],
          requirements: data.requirements
            ? (Array.isArray(data.requirements)
                ? data.requirements
                : (() => { try { return JSON.parse(data.requirements); } catch { return [data.requirements]; } })())
            : [],
          niceToHave: data.nice_to_have || data.niceToHave
            ? (Array.isArray(data.nice_to_have || data.niceToHave)
                ? (data.nice_to_have || data.niceToHave)
                : (() => { try { return JSON.parse(data.nice_to_have || data.niceToHave); } catch { return []; } })())
            : [],
        };

        setJob(normalized);
      } catch (err) {
        setError(err.message || 'Job not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="jd">
        <StudentNavbar studentName="Ahmed" notifCount={2} />
        <main className="jd__main">
          <div style={{ textAlign: 'center', padding: '4rem', color: '#6B7A99' }}>
            Loading job details...
          </div>
        </main>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="jd">
        <StudentNavbar studentName="Ahmed" notifCount={2} />
        <main className="jd__main">
          <button className="jd__back" onClick={() => navigate('/student/jobs')}>
            <ArrowLeft size={16} /> Back to Jobs
          </button>
          <div style={{ textAlign: 'center', padding: '4rem', color: '#b91c1c' }}>
            {error || 'Job not found.'}
          </div>
        </main>
      </div>
    );
  }

  const formattedDeadline = job.deadline
    ? new Date(job.deadline).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : '—';

  const daysLeft = job.deadline
    ? Math.ceil((new Date(job.deadline) - new Date()) / (1000 * 60 * 60 * 24))
    : 999;

  return (
    <div className="jd">
      <StudentNavbar studentName="Ahmed" notifCount={2} />

      <main className="jd__main">

        <button className="jd__back" onClick={() => navigate('/student/jobs')}>
          <ArrowLeft size={16} /> Back to Jobs
        </button>

        <div className="jd__layout">

          <div className="jd__content">
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
                    {job.field && <span className="jd__tag jd__tag--field">{job.field}</span>}
                  </div>
                </div>
                <div className="jd__hero-actions">
                  <button
                    className={`jd__save-btn ${saved ? 'jd__save-btn--saved' : ''}`}
                    onClick={() => setSaved(v => !v)}
                  >
                    <BookmarkPlus size={17} />
                  </button>
                  <button className="jd__share-btn"><Share2 size={17} /></button>
                </div>
              </div>

              <div className="jd__hero-info">
                {job.location   && <div className="jd__info-item"><MapPin size={14} />   {job.location}</div>}
                {job.postedAgo  && <div className="jd__info-item"><Clock size={14} />    Posted {job.postedAgo}</div>}
                {job.applicants > 0 && <div className="jd__info-item"><Users size={14} /> {job.applicants} applicants</div>}
                {job.deadline   && <div className="jd__info-item"><Calendar size={14} /> Deadline: {formattedDeadline}</div>}
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

            {job.description && (
              <div className="jd__card">
                <h2 className="jd__section-title">About the Role</h2>
                <p className="jd__description">{job.description}</p>
              </div>
            )}

            {job.responsibilities.length > 0 && (
              <div className="jd__card">
                <h2 className="jd__section-title">Responsibilities</h2>
                <ul className="jd__list">
                  {job.responsibilities.map((r, i) => (
                    <li key={i} className="jd__list-item">
                      <span className="jd__list-dot" />{r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.requirements.length > 0 && (
              <div className="jd__card">
                <h2 className="jd__section-title">Requirements</h2>
                <ul className="jd__list">
                  {job.requirements.map((r, i) => (
                    <li key={i} className="jd__list-item">
                      <CheckCircle size={14} className="jd__list-check" />{r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.niceToHave.length > 0 && (
              <div className="jd__card">
                <h2 className="jd__section-title">Nice to Have</h2>
                <ul className="jd__list">
                  {job.niceToHave.map((r, i) => (
                    <li key={i} className="jd__list-item jd__list-item--soft">
                      <span className="jd__list-dot jd__list-dot--soft" />{r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.skills.length > 0 && (
              <div className="jd__card">
                <h2 className="jd__section-title">Required Skills</h2>
                <div className="jd__skills">
                  {job.skills.map(s => (
                    <span key={s} className="jd__skill">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="jd__sidebar">
            <div className="jd__apply-card">
              {job.salary && (
                <div className="jd__salary">
                  <p className="jd__salary-label">Salary Range</p>
                  <p className="jd__salary-value">{job.salary}</p>
                </div>
              )}

              {/* [FIX 5] Apply button — disabled لو already applied أو الـ deadline فات */}
              {applied
                ? (
                  <div className="jd__applied-msg">
                    <CheckCircle size={20} />
                    <div>
                      <p className="jd__applied-title">Already Applied</p>
                      <p className="jd__applied-sub">You've already submitted an application for this job.</p>
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

            {(job.company || job.companyAbout) && (
              <div className="jd__company-card">
                <div className="jd__company-card-logo">
                  {job.companyLogo
                    ? <img src={job.companyLogo} alt={job.company} />
                    : <span>{job.company.charAt(0)}</span>
                  }
                </div>
                <h3 className="jd__company-card-name">{job.company}</h3>
                {job.companySize && (
                  <p className="jd__company-card-size"><Building2 size={13} /> {job.companySize}</p>
                )}
                {job.companyAbout && (
                  <p className="jd__company-about">{job.companyAbout}</p>
                )}
                {job.companyWebsite && (
                  <a href={job.companyWebsite} target="_blank" rel="noreferrer" className="jd__company-link">
                    <Globe size={13} /> Visit Website
                  </a>
                )}
              </div>
            )}

            <div className="jd__quick-card">
              <h3 className="jd__quick-title">Job Overview</h3>
              {[
                { label: 'Job Type',   value: job.type,              icon: <Briefcase size={14} /> },
                { label: 'Work Mode',  value: job.mode,              icon: <Globe size={14} /> },
                job.field     && { label: 'Field',      value: job.field,             icon: <Building2 size={14} /> },
                job.location  && { label: 'Location',   value: job.location,          icon: <MapPin size={14} /> },
                job.deadline  && { label: 'Deadline',   value: formattedDeadline,     icon: <Calendar size={14} /> },
                job.applicants > 0 && { label: 'Applicants', value: `${job.applicants} applied`, icon: <Users size={14} /> },
              ].filter(Boolean).map(({ label, value, icon }) => (
                <div className="jd__quick-row" key={label}>
                  <span className="jd__quick-label">{icon} {label}</span>
                  <span className="jd__quick-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check, Rocket, Clock, Trophy, GraduationCap,
  Globe, Building2, Loader2, MapPin, Calendar, DollarSign, Briefcase,
} from 'lucide-react';
import CompanySidebar  from '../../components/company/CompanySidebar';
import CompanyHeader   from '../../components/company/CompanyHeader';
import companyService  from '../../services/companyService';
import './PostJobPage.css';

/* ─────────────────────────── constants ─────────────────────────── */

const SKILLS_OPTIONS = [
  'React', 'Vue', 'Angular', 'Node.js', 'Express', 'Python', 'Django',
  'MongoDB', 'PostgreSQL', 'MySQL', 'TypeScript', 'JavaScript', 'CSS',
  'Tailwind', 'Docker', 'AWS', 'Git', 'AI/ML', 'Flutter', 'Figma',
];

const JOB_TYPES = [
  { value: 'full-time',  label: 'Full-time',  icon: Trophy        },
  { value: 'part-time',  label: 'Part-time',  icon: Clock         },
  { value: 'internship', label: 'Internship', icon: GraduationCap },
];

const WORK_MODES = [
  { value: 'remote', label: 'Remote', icon: Globe     },
  { value: 'onsite', label: 'Onsite', icon: Building2 },
  { value: 'hybrid', label: 'Hybrid', icon: Briefcase },
];

const FIELD_OPTIONS = [
  'Frontend', 'Backend', 'Mobile', 'AI/ML', 'Data Science',
  'UI/UX', 'Design', 'DevOps', 'Cybersecurity', 'Other',
];

/* ─────────────────────────── component ─────────────────────────── */

const PostJobPage = () => {
  const navigate = useNavigate();
  const [loading,    setLoading]    = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [apiError,   setApiError]   = useState('');
  const [skillInput, setSkillInput] = useState('');

  const [form, setForm] = useState({
    title:       '',
    description: '',
    type:        'full-time',
    mode:        'remote',
    field:       '',
    location:    '',
    deadline:    '',
    salary:      '',
    skills:      [],
  });

  const [errors, setErrors] = useState({});

  /* handlers */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const toggleSkill = (skill) => {
    setForm(p => ({
      ...p,
      skills: p.skills.includes(skill)
        ? p.skills.filter(s => s !== skill)
        : [...p.skills, skill],
    }));
    if (errors.skills) setErrors(p => ({ ...p, skills: '' }));
  };

  const addCustomSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !form.skills.includes(trimmed)) {
      setForm(p => ({ ...p, skills: [...p.skills, trimmed] }));
      setSkillInput('');
    }
  };

  /* validation */
  const validate = () => {
    const errs = {};
    if (!form.title.trim())       errs.title       = 'Job title is required';
    if (!form.description.trim()) errs.description = 'Job description is required';
    if (form.skills.length === 0) errs.skills      = 'Select at least one skill';
    return errs;
  };

  /* submit */
  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError('');
    try {
      await companyService.postJob({
        title:           form.title,
        description:     form.description,
        type:            form.type,
        mode:            form.mode,
        field:           form.field,
        location:        form.location,
        deadline:        form.deadline  || null,
        salary:          form.salary    ? parseFloat(form.salary) : null,
        skills_required: form.skills,
      });
      setSuccess(true);
      setTimeout(() => navigate('/company/my-jobs'), 1800);
    } catch (err) {
      setApiError(err.message || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Success screen ── */
  if (success) {
    return (
      <div className="company-layout">
        <CompanySidebar />
        <div className="company-main">
          <CompanyHeader title="Post a Job" />
          <div className="company-content content-center">
            <div className="success-box">
              <div className="success-icon-wrap">
                <Check size={36} strokeWidth={3} color="#0f6e56" aria-hidden="true" />
              </div>
              <h2>Job Posted Successfully!</h2>
              <p>Redirecting to My Jobs…</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main form ── */
  return (
    <div className="company-layout">
      <CompanySidebar />
      <div className="company-main">
        <CompanyHeader
          title="Post a Job"
          subtitle="Fill in the details to attract the right candidates"
        />

        <div className="company-content">

          {apiError && (
            <div className="api-error-banner">
              {apiError}
              <button onClick={() => setApiError('')}>✕</button>
            </div>
          )}

          <div className="post-job-card">

            {/* ── Job Title ── */}
            <div className="form-section">
              <label className="form-label">
                Job Title <span className="required">*</span>
              </label>
              <input
                type="text" name="title"
                className={`form-input ${errors.title ? 'form-input--error' : ''}`}
                placeholder="e.g. Frontend Developer, AI Intern…"
                value={form.title}
                onChange={handleChange}
              />
              {errors.title && <p className="error-msg">{errors.title}</p>}
            </div>

            {/* ── Job Type + Work Mode ── */}
            <div className="form-row">
              <div className="form-section">
                <label className="form-label">Job Type</label>
                <div className="radio-group">
                  {JOB_TYPES.map(({ value, label, icon: Icon }) => (
                    <label key={value}
                      className={`radio-card ${form.type === value ? 'radio-card--active' : ''}`}>
                      <input type="radio" name="type" value={value}
                        checked={form.type === value} onChange={handleChange} />
                      <Icon size={14} strokeWidth={2} aria-hidden="true" />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <label className="form-label">Work Mode</label>
                <div className="radio-group">
                  {WORK_MODES.map(({ value, label, icon: Icon }) => (
                    <label key={value}
                      className={`radio-card ${form.mode === value ? 'radio-card--active' : ''}`}>
                      <input type="radio" name="mode" value={value}
                        checked={form.mode === value} onChange={handleChange} />
                      <Icon size={14} strokeWidth={2} aria-hidden="true" />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Field ── */}
            <div className="form-section">
              <label className="form-label">Field / Category</label>
              <select
                name="field"
                className="form-input"
                value={form.field}
                onChange={handleChange}
              >
                <option value="">Select a field…</option>
                {FIELD_OPTIONS.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* ── Location + Salary ── */}
            <div className="form-row">
              <div className="form-section">
                <label className="form-label">
                  <MapPin size={13} aria-hidden="true" /> Location
                </label>
                <input
                  type="text" name="location"
                  className="form-input"
                  placeholder="e.g. Beirut, Lebanon"
                  value={form.location}
                  onChange={handleChange}
                />
              </div>

              <div className="form-section">
                <label className="form-label">
                  <DollarSign size={13} aria-hidden="true" /> Salary ($/month)
                </label>
                <input
                  type="number" name="salary"
                  className="form-input"
                  placeholder="e.g. 1500"
                  min="0"
                  value={form.salary}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* ── Deadline ── */}
            <div className="form-section">
              <label className="form-label">
                <Calendar size={13} aria-hidden="true" /> Application Deadline
              </label>
              <input
                type="date" name="deadline"
                className="form-input"
                value={form.deadline}
                onChange={handleChange}
              />
            </div>

            {/* ── Description ── */}
            <div className="form-section">
              <label className="form-label">
                Job Description <span className="required">*</span>
              </label>
              <textarea
                name="description"
                className={`form-textarea ${errors.description ? 'form-input--error' : ''}`}
                placeholder="Describe the role, responsibilities, and what you're looking for…"
                rows={5}
                value={form.description}
                onChange={handleChange}
              />
              {errors.description && <p className="error-msg">{errors.description}</p>}
            </div>

            {/* ── Skills ── */}
            <div className="form-section">
              <label className="form-label">
                Required Skills <span className="required">*</span>
              </label>

              <div className="skills-grid">
                {SKILLS_OPTIONS.map(skill => (
                  <button key={skill} type="button"
                    className={`skill-toggle ${form.skills.includes(skill) ? 'skill-toggle--active' : ''}`}
                    onClick={() => toggleSkill(skill)}>
                    {form.skills.includes(skill) && (
                      <Check size={11} strokeWidth={3} aria-hidden="true" />
                    )}
                    {skill}
                  </button>
                ))}
              </div>

              <div className="custom-skill-row">
                <input
                  type="text" className="form-input"
                  placeholder="Add custom skill…"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCustomSkill()}
                />
                <button className="btn-add-skill" onClick={addCustomSkill}>+ Add</button>
              </div>

              {form.skills.length > 0 && (
                <div className="selected-skills">
                  {form.skills.map(s => (
                    <span key={s} className="selected-skill-tag">
                      {s}
                      <button onClick={() => toggleSkill(s)} aria-label={`Remove ${s}`}>×</button>
                    </span>
                  ))}
                </div>
              )}

              {errors.skills && <p className="error-msg">{errors.skills}</p>}
            </div>

            {/* ── Actions ── */}
            <div className="form-actions">
              <button className="btn-cancel" onClick={() => navigate('/company/my-jobs')}>
                Cancel
              </button>
              <button className="btn-post" onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <><Loader2 size={15} className="spin" /> Posting…</>
                ) : (
                  <><Rocket size={15} strokeWidth={2} aria-hidden="true" /> Post Job</>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJobPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Rocket, Clock, Trophy, GraduationCap, Globe, Building2 } from 'lucide-react';
import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyHeader  from '../../components/company/CompanyHeader';
import './PostJobPage.css';

const SKILLS_OPTIONS = [
  'React', 'Vue', 'Angular', 'Node.js', 'Express', 'Python', 'Django',
  'MongoDB', 'PostgreSQL', 'MySQL', 'TypeScript', 'JavaScript', 'CSS',
  'Tailwind', 'Docker', 'AWS', 'Git', 'AI/ML', 'Flutter', 'Figma',
];

const JOB_TYPES = [
  { value: 'Full-time',  label: 'Full-time',  icon: Trophy },
  { value: 'Part-time',  label: 'Part-time',  icon: Clock  },
  { value: 'Internship', label: 'Internship', icon: GraduationCap },
];

const WORK_MODES = [
  { value: 'Remote', label: 'Remote', icon: Globe     },
  { value: 'Onsite', label: 'Onsite', icon: Building2 },
];

const PostJobPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const [form, setForm] = useState({
    title: '', description: '', type: 'Full-time', mode: 'Remote', skills: [],
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const toggleSkill = (skill) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
    if (errors.skills) setErrors(prev => ({ ...prev, skills: '' }));
  };

  const addCustomSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !form.skills.includes(trimmed)) {
      setForm(prev => ({ ...prev, skills: [...prev.skills, trimmed] }));
      setSkillInput('');
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim())        errs.title       = 'Job title is required';
    if (!form.description.trim())  errs.description = 'Job description is required';
    if (form.skills.length === 0)  errs.skills      = 'Select at least one skill';
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    // TODO: replace with real API call
    // await axios.post('/api/jobs', form, { headers: { Authorization: `Bearer ${token}` } });
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate('/company/my-jobs'), 1800);
    }, 1000);
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

  return (
    <div className="company-layout">
      <CompanySidebar />
      <div className="company-main">
        <CompanyHeader
          title="Post a Job"
          subtitle="Fill in the details to attract the right candidates"
        />

        <div className="company-content">
          <div className="post-job-card">

            {/* ── Job title ── */}
            <div className="form-section">
              <label className="form-label">
                Job Title <span className="required">*</span>
              </label>
              <input
                type="text"
                name="title"
                className={`form-input ${errors.title ? 'form-input--error' : ''}`}
                placeholder="e.g. Frontend Developer, AI Intern…"
                value={form.title}
                onChange={handleChange}
              />
              {errors.title && <p className="error-msg">{errors.title}</p>}
            </div>

            {/* ── Type + Mode ── */}
            <div className="form-row">
              <div className="form-section">
                <label className="form-label">Job Type</label>
                <div className="radio-group">
                  {JOB_TYPES.map(({ value, label, icon: Icon }) => (
                    <label
                      key={value}
                      className={`radio-card ${form.type === value ? 'radio-card--active' : ''}`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={value}
                        checked={form.type === value}
                        onChange={handleChange}
                      />
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
                    <label
                      key={value}
                      className={`radio-card ${form.mode === value ? 'radio-card--active' : ''}`}
                    >
                      <input
                        type="radio"
                        name="mode"
                        value={value}
                        checked={form.mode === value}
                        onChange={handleChange}
                      />
                      <Icon size={14} strokeWidth={2} aria-hidden="true" />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
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
                  <button
                    key={skill}
                    type="button"
                    className={`skill-toggle ${form.skills.includes(skill) ? 'skill-toggle--active' : ''}`}
                    onClick={() => toggleSkill(skill)}
                  >
                    {form.skills.includes(skill) && (
                      <Check size={11} strokeWidth={3} aria-hidden="true" />
                    )}
                    {skill}
                  </button>
                ))}
              </div>

              {/* Custom skill input */}
              <div className="custom-skill-row">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Add custom skill…"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCustomSkill()}
                />
                <button className="btn-add-skill" onClick={addCustomSkill}>
                  + Add
                </button>
              </div>

              {/* Selected skills */}
              {form.skills.length > 0 && (
                <div className="selected-skills">
                  {form.skills.map(s => (
                    <span key={s} className="selected-skill-tag">
                      {s}
                      <button
                        onClick={() => toggleSkill(s)}
                        aria-label={`Remove ${s}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {errors.skills && <p className="error-msg">{errors.skills}</p>}
            </div>

            {/* ── Actions ── */}
            <div className="form-actions">
              <button
                className="btn-cancel"
                onClick={() => navigate('/company/my-jobs')}
              >
                Cancel
              </button>
              <button
                className="btn-post"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  'Posting…'
                ) : (
                  <>
                    <Rocket size={15} strokeWidth={2} aria-hidden="true" />
                    Post Job
                  </>
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
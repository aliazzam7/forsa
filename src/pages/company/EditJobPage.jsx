import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Check, Clock, Trophy, GraduationCap,
  Globe, Building2, Loader2, MapPin, Calendar,
  DollarSign, Briefcase, AlertCircle,
} from 'lucide-react';
import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyHeader  from '../../components/company/CompanyHeader';
import companyService from '../../services/companyService';
import jobService     from '../../services/jobService';
import './EditJobPage.css';

/* ───────────────────────── constants ───────────────────────── */

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

/* ───────────────────────── component ───────────────────────── */

const EditJobPage = () => {
  const { id }   = useParams();   // route: /company/edit-job/:id
  const navigate = useNavigate();

  const [pageLoading, setPageLoading] = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [success,     setSuccess]     = useState(false);
  const [apiError,    setApiError]    = useState('');
  const [skillInput,  setSkillInput]  = useState('');
  const [errors,      setErrors]      = useState({});

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
    status:      'active',
  });

  /* ── fetch job on mount ── */
  useEffect(() => {
    const load = async () => {
      try {
        // GET /api/jobs/:id  (public route — already exists in your router)
        const data = await jobService.getJobById(id);
        const j    = data.job ?? data; // handle { job:{} } or direct object

        /* skills_required: may arrive as array or JSON string */
        let skills = [];
        if (Array.isArray(j.skills_required)) {
          skills = j.skills_required;
        } else if (typeof j.skills_required === 'string') {
          try { skills = JSON.parse(j.skills_required); } catch { skills = []; }
        }

        /* deadline: "2026-11-30 00:00:00" → "2026-11-30" */
        const deadline = j.deadline ? String(j.deadline).split(' ')[0] : '';

        /* status: derive from is_active + status fields */
        const isActive =
          j.is_active === 1 || j.is_active === true || j.status === 'active';

        setForm({
          title:       j.title        ?? '',
          description: j.description  ?? '',
          type:        j.type         ?? 'full-time',
          mode:        j.mode         ?? 'remote',
          field:       j.field        ?? '',
          location:    j.location     ?? '',
          deadline,
          salary:      j.salary != null ? String(j.salary) : '',
          skills,
          status:      isActive ? 'active' : 'closed',
        });
      } catch (err) {
        setApiError('Failed to load job: ' + (err.message ?? 'Unknown error'));
      } finally {
        setPageLoading(false);
      }
    };
    load();
  }, [id]);

  /* ── field change ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  /* ── skill toggle ── */
  const toggleSkill = (skill) => {
    setForm(p => ({
      ...p,
      skills: p.skills.includes(skill)
        ? p.skills.filter(s => s !== skill)
        : [...p.skills, skill],
    }));
    if (errors.skills) setErrors(p => ({ ...p, skills: '' }));
  };

  /* ── add custom skill ── */
  const addCustomSkill = () => {
    const t = skillInput.trim();
    if (t && !form.skills.includes(t)) {
      setForm(p => ({ ...p, skills: [...p.skills, t] }));
      setSkillInput('');
    }
  };

  /* ── validate ── */
  const validate = () => {
    const errs = {};
    if (!form.title.trim())       errs.title       = 'Job title is required';
    if (!form.description.trim()) errs.description = 'Job description is required';
    if (form.skills.length === 0) errs.skills      = 'Select at least one skill';
    return errs;
  };

  /* ── submit ── */
  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    setApiError('');
    try {
      // PUT /api/company/jobs/:id
      await companyService.updateJob(id, {
        title:           form.title,
        description:     form.description,
        type:            form.type,
        mode:            form.mode,
        field:           form.field,
        location:        form.location,
        deadline:        form.deadline || null,
        salary:          form.salary   ? parseFloat(form.salary) : null,
        skills_required: form.skills,
        is_active:       form.status === 'active' ? 1 : 0,
      });
      setSuccess(true);
      setTimeout(() => navigate('/company/my-jobs'), 1800);
    } catch (err) {
      setApiError(err.message || 'Failed to update job. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  /* ════════════════ RENDER ════════════════ */

  /* success */
  if (success) {
    return (
      <div className="ej-layout">
        <CompanySidebar />
        <div className="ej-main">
          <CompanyHeader title="Edit Job" />
          <div className="ej-content ej-center">
            <div className="ej-success-box">
              <div className="ej-success-icon">
                <Check size={38} strokeWidth={3} color="#0f6e56" />
              </div>
              <h2>Job Updated Successfully!</h2>
              <p>Redirecting to My Jobs…</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* loading */
  if (pageLoading) {
    return (
      <div className="ej-layout">
        <CompanySidebar />
        <div className="ej-main">
          <CompanyHeader title="Edit Job" />
          <div className="ej-content ej-center">
            <Loader2 size={34} className="ej-spin" color="#1B2D6B" />
          </div>
        </div>
      </div>
    );
  }

  /* main form */
  return (
    <div className="ej-layout">
      <CompanySidebar />
      <div className="ej-main">
        <CompanyHeader
          title="Edit Job"
          subtitle="Update the details below and save your changes"
        />

        <div className="ej-content">

          {/* ── API error banner ── */}
          {apiError && (
            <div className="ej-error-banner">
              <AlertCircle size={15} />
              <span>{apiError}</span>
              <button onClick={() => setApiError('')} aria-label="Dismiss">✕</button>
            </div>
          )}

          <div className="ej-card">

            {/* ── Title ── */}
            <div className="ej-section">
              <label className="ej-label">
                Job Title <span className="ej-required">*</span>
              </label>
              <input
                type="text" name="title"
                className={`ej-input ${errors.title ? 'ej-input--err' : ''}`}
                placeholder="e.g. Frontend Developer, AI Intern…"
                value={form.title}
                onChange={handleChange}
              />
              {errors.title && <p className="ej-err-msg">{errors.title}</p>}
            </div>

            {/* ── Type + Mode ── */}
            <div className="ej-row">
              <div className="ej-section">
                <label className="ej-label">Job Type</label>
                <div className="ej-radio-group">
                  {JOB_TYPES.map(({ value, label, icon: Icon }) => (
                    <label key={value}
                      className={`ej-radio-card ${form.type === value ? 'ej-radio-card--active' : ''}`}>
                      <input type="radio" name="type" value={value}
                        checked={form.type === value} onChange={handleChange} />
                      <Icon size={14} strokeWidth={2} />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="ej-section">
                <label className="ej-label">Work Mode</label>
                <div className="ej-radio-group">
                  {WORK_MODES.map(({ value, label, icon: Icon }) => (
                    <label key={value}
                      className={`ej-radio-card ${form.mode === value ? 'ej-radio-card--active' : ''}`}>
                      <input type="radio" name="mode" value={value}
                        checked={form.mode === value} onChange={handleChange} />
                      <Icon size={14} strokeWidth={2} />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Field + Status ── */}
            <div className="ej-row">
              <div className="ej-section">
                <label className="ej-label">Field / Category</label>
                <select name="field" className="ej-input" value={form.field} onChange={handleChange}>
                  <option value="">Select a field…</option>
                  {FIELD_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              <div className="ej-section">
                <label className="ej-label">Job Status</label>
                <select name="status" className="ej-input ej-status-select" value={form.status} onChange={handleChange}>
                  <option value="active">🟢 Active</option>
                  <option value="closed">🔴 Closed</option>
                </select>
              </div>
            </div>

            {/* ── Location + Salary ── */}
            <div className="ej-row">
              <div className="ej-section">
                <label className="ej-label">
                  <MapPin size={13} /> Location
                </label>
                <input
                  type="text" name="location" className="ej-input"
                  placeholder="e.g. Beirut, Lebanon"
                  value={form.location} onChange={handleChange}
                />
              </div>

              <div className="ej-section">
                <label className="ej-label">
                  <DollarSign size={13} /> Salary ($/month)
                </label>
                <input
                  type="number" name="salary" className="ej-input"
                  placeholder="e.g. 1500" min="0"
                  value={form.salary} onChange={handleChange}
                />
              </div>
            </div>

            {/* ── Deadline ── */}
            <div className="ej-section">
              <label className="ej-label">
                <Calendar size={13} /> Application Deadline
              </label>
              <input
                type="date" name="deadline" className="ej-input ej-input--date"
                value={form.deadline} onChange={handleChange}
              />
            </div>

            {/* ── Description ── */}
            <div className="ej-section">
              <label className="ej-label">
                Job Description <span className="ej-required">*</span>
              </label>
              <textarea
                name="description"
                className={`ej-textarea ${errors.description ? 'ej-input--err' : ''}`}
                placeholder="Describe the role, responsibilities, and what you're looking for…"
                rows={5}
                value={form.description}
                onChange={handleChange}
              />
              {errors.description && <p className="ej-err-msg">{errors.description}</p>}
            </div>

            {/* ── Skills ── */}
            <div className="ej-section">
              <label className="ej-label">
                Required Skills <span className="ej-required">*</span>
              </label>

              <div className="ej-skills-grid">
                {SKILLS_OPTIONS.map(skill => (
                  <button key={skill} type="button"
                    className={`ej-skill-btn ${form.skills.includes(skill) ? 'ej-skill-btn--active' : ''}`}
                    onClick={() => toggleSkill(skill)}>
                    {form.skills.includes(skill) && <Check size={11} strokeWidth={3} />}
                    {skill}
                  </button>
                ))}
              </div>

              {/* custom skill */}
              <div className="ej-custom-skill-row">
                <input
                  type="text" className="ej-input"
                  placeholder="Add custom skill…"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCustomSkill()}
                />
                <button className="ej-btn-add" onClick={addCustomSkill}>+ Add</button>
              </div>

              {/* selected tags (including custom ones) */}
              {form.skills.length > 0 && (
                <div className="ej-selected-skills">
                  {form.skills.map(s => (
                    <span key={s} className="ej-skill-tag">
                      {s}
                      <button onClick={() => toggleSkill(s)} aria-label={`Remove ${s}`}>×</button>
                    </span>
                  ))}
                </div>
              )}

              {errors.skills && <p className="ej-err-msg">{errors.skills}</p>}
            </div>

            {/* ── Actions ── */}
            <div className="ej-actions">
              <button className="ej-btn-cancel" onClick={() => navigate('/company/my-jobs')}>
                Cancel
              </button>
              <button className="ej-btn-save" onClick={handleSubmit} disabled={saving}>
                {saving
                  ? <><Loader2 size={15} className="ej-spin" /> Saving…</>
                  : <><Check size={15} strokeWidth={2.5} /> Save Changes</>}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EditJobPage;
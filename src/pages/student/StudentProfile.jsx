import React, { useState, useRef, useEffect } from 'react';
import {
  User, Mail, Phone, MapPin, Briefcase, GraduationCap,
  Upload, Plus, X, Edit3, Save, CheckCircle, FileText,
  Globe, Linkedin, Github, Star, Camera, Shield, Lock,
  Eye, EyeOff, UserCircle
} from 'lucide-react';
import StudentNavbar from '../../components/student/StudentNavbar';
import studentService from '../../services/studentService';
import { BASE_URL } from '../../services/api';
import './StudentProfile.css';

const SUGGESTED_SKILLS = [
  'React', 'Vue', 'Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind',
  'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Python', 'Django', 'Flask',
  'REST APIs', 'GraphQL', 'Docker', 'Git', 'Figma', 'AWS', 'Firebase', 'Redux',
  'Next.js', 'PHP', 'Laravel', 'Java', 'Spring Boot', 'C++', 'Machine Learning',
];

const EMPTY_PROFILE = {
  name: '', email: '', phone: '', location: '', bio: '',
  university: '', major: '', graduation_year: '',
  website: '', linkedin: '', github: '',
  skills: [], experience: [], cv_path: '', avatar: '',
};

const calcCompletion = (profile) => {
  const fields = [
    profile.name, profile.email, profile.phone, profile.location,
    profile.bio, profile.university, profile.major, profile.graduation_year,
    profile.skills?.length > 0, profile.experience?.length > 0, profile.cv_path,
  ];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
};

const StudentProfile = () => {
  const [profile, setProfile]             = useState(EMPTY_PROFILE);
  const [activeTab, setActiveTab]         = useState('details');
  const [editing, setEditing]             = useState(false);
  const [draft, setDraft]                 = useState(EMPTY_PROFILE);
  const [skillInput, setSkillInput]       = useState('');
  const [showSkillDrop, setShowSkillDrop] = useState(false);
  const [saved, setSaved]                 = useState(false);
  const [newExp, setNewExp]               = useState({ role: '', company: '', duration: '', description: '' });
  const [addingExp, setAddingExp]         = useState(false);
  const [loading, setLoading]             = useState(true);
  const [saving, setSaving]               = useState(false);
  const [error, setError]                 = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Password state
  const [pwData, setPwData]       = useState({ current: '', newPw: '', confirm: '' });
  const [pwSaving, setPwSaving]   = useState(false);
  const [pwError, setPwError]     = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const [showPw, setShowPw]       = useState({ current: false, newPw: false, confirm: false });

  const fileRef      = useRef();
  const avatarRef    = useRef();
  const skillInputRef = useRef();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await studentService.getProfile();
        const normalized = {
          name: data.name || '', email: data.email || '',
          phone: data.phone || '', location: data.location || '',
          bio: data.bio || '', university: data.university || '',
          major: data.major || '', graduation_year: data.graduation_year || '',
          website: data.website || '', linkedin: data.linkedin || '',
          github: data.github || '',
          skills: Array.isArray(data.skills) ? data.skills : [],
          experience: Array.isArray(data.experience)
            ? data.experience.map((e, i) => ({ ...e, id: e.id || i + 1 })) : [],
          cv_path: data.cv_path || '', avatar: data.avatar || '',
        };
        setProfile(normalized);
        setDraft(normalized);
      } catch (err) {
        setError(err.message || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (skillInputRef.current && !skillInputRef.current.contains(e.target))
        setShowSkillDrop(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const completion = calcCompletion(profile);

  const handleEdit   = () => { setDraft({ ...profile }); setEditing(true); setSaved(false); };
  const handleCancel = () => { setEditing(false); setSkillInput(''); setAddingExp(false); setShowSkillDrop(false); };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        name: draft.name, bio: draft.bio, phone: draft.phone,
        location: draft.location, university: draft.university,
        major: draft.major, graduation_year: draft.graduation_year,
        website: draft.website, linkedin: draft.linkedin, github: draft.github,
        skills: draft.skills,
        experience: draft.experience.map(({ id, ...rest }) => rest),
      };
      await studentService.updateProfile(payload);
      const fresh = await studentService.getProfile();
      const normalized = {
        name: fresh.name || '', email: fresh.email || '',
        phone: fresh.phone || '', location: fresh.location || '',
        bio: fresh.bio || '', university: fresh.university || '',
        major: fresh.major || '', graduation_year: fresh.graduation_year || '',
        website: fresh.website || '', linkedin: fresh.linkedin || '',
        github: fresh.github || '',
        skills: Array.isArray(fresh.skills) ? fresh.skills : [],
        experience: Array.isArray(fresh.experience)
          ? fresh.experience.map((e, i) => ({ ...e, id: e.id || i + 1 })) : [],
        cv_path: fresh.cv_path || '', avatar: fresh.avatar || '',
      };
      setProfile(normalized);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPwError('');
    if (!pwData.current || !pwData.newPw || !pwData.confirm) {
      setPwError('Please fill in all fields.'); return;
    }
    if (pwData.newPw.length < 6) {
      setPwError('New password must be at least 6 characters.'); return;
    }
    if (pwData.newPw !== pwData.confirm) {
      setPwError('New passwords do not match.'); return;
    }
    try {
      setPwSaving(true);
      await studentService.changePassword(pwData.current, pwData.newPw);
      setPwData({ current: '', newPw: '', confirm: '' });
      setPwSuccess(true);
      setTimeout(() => setPwSuccess(false), 4000);
    } catch (err) {
      setPwError(err.message || 'Failed to change password.');
    } finally {
      setPwSaving(false);
    }
  };

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (!draft.skills.includes(trimmed))
      setDraft(d => ({ ...d, skills: [...d.skills, trimmed] }));
    setSkillInput('');
    setShowSkillDrop(false);
  };
  const removeSkill = (skill) =>
    setDraft(d => ({ ...d, skills: d.skills.filter(s => s !== skill) }));

  const suggestions = SUGGESTED_SKILLS.filter(
    s => s.toLowerCase().includes(skillInput.toLowerCase()) && !draft.skills.includes(s)
  );

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); if (skillInput.trim()) addSkill(skillInput); }
    if (e.key === 'Escape') setShowSkillDrop(false);
  };

  const handleExpAdd = () => {
    if (!newExp.role || !newExp.company) return;
    setDraft(d => ({ ...d, experience: [...d.experience, { ...newExp, id: Date.now() }] }));
    setNewExp({ role: '', company: '', duration: '', description: '' });
    setAddingExp(false);
  };
  const removeExp = (id) =>
    setDraft(d => ({ ...d, experience: d.experience.filter(e => e.id !== id) }));

  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') return;
    try {
      const result = await studentService.uploadCV(file);
      setProfile(p => ({ ...p, cv_path: result.cv_path }));
      setDraft(d => ({ ...d, cv_path: result.cv_path }));
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch (err) { alert(err.message || 'Failed to upload CV.'); }
  };

  const handleCVDelete = async () => {
    if (!window.confirm('Are you sure you want to remove your CV?')) return;
    try {
      await studentService.deleteCV();
      setProfile(p => ({ ...p, cv_path: '' }));
      setDraft(d => ({ ...d, cv_path: '' }));
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch (err) { alert(err.message || 'Failed to remove CV.'); }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please upload an image file.'); return; }
    try {
      setAvatarUploading(true);
      const result = await studentService.uploadAvatar(file);
      const newAvatar = result.avatar || result.avatar_path || '';
      setProfile(p => ({ ...p, avatar: newAvatar }));
      setDraft(d => ({ ...d, avatar: newAvatar }));
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch (err) { alert(err.message || 'Failed to upload avatar.');
    } finally { setAvatarUploading(false); if (avatarRef.current) avatarRef.current.value = ''; }
  };

  const set = (key) => (e) => setDraft(d => ({ ...d, [key]: e.target.value }));
  const cvFileName = profile.cv_path ? profile.cv_path.split('/').pop() : null;
  const avatarUrl = profile.avatar
    ? (profile.avatar.startsWith('http') ? profile.avatar : `${BASE_URL.replace('/api', '')}/${profile.avatar}`)
    : null;

  if (loading) return (
    <div className="sp"><StudentNavbar studentName="..." notifCount={0} />
      <main className="sp__main"><div className="sp__loading">Loading profile...</div></main>
    </div>
  );
  if (error) return (
    <div className="sp"><StudentNavbar studentName="Student" notifCount={0} />
      <main className="sp__main"><div className="sp__error">{error}</div></main>
    </div>
  );

  return (
    <div className="sp">
      <StudentNavbar studentName={profile.name} notifCount={2} />
      <main className="sp__main">

        {/* ── Banner ── */}
        <div className="sp__banner">
          <div className="sp__banner-content">
            <div className="sp__avatar-wrap">
              <div className="sp__avatar">
                {avatarUrl
                  ? <img src={avatarUrl} alt={profile.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  : profile.name.charAt(0).toUpperCase()
                }
              </div>
              {completion === 100 && <span className="sp__verified"><CheckCircle size={14} /></span>}
              <button className="sp__avatar-btn" onClick={() => avatarRef.current?.click()} disabled={avatarUploading} title="Change photo">
                {avatarUploading ? <span style={{ fontSize: 9 }}>...</span> : <Camera size={12} />}
              </button>
              <input ref={avatarRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
            </div>
            <div className="sp__banner-info">
              <h1 className="sp__banner-name">{profile.name}</h1>
              <p className="sp__banner-title">{profile.major || 'Student'}</p>
              <p className="sp__banner-loc"><MapPin size={13} />{profile.location || '—'}</p>
            </div>
          </div>
          <div className="sp__completion">
            <div className="sp__completion-top"><span>Profile Completion</span><strong>{completion}%</strong></div>
            <div className="sp__completion-bar"><div className="sp__completion-fill" style={{ width: `${completion}%` }} /></div>
            <p className="sp__completion-hint">
              {completion === 100 ? '✓ Profile complete!' : 'Complete your profile to unlock all features'}
            </p>
          </div>
        </div>

        {/* ── Toast ── */}
        {saved && (
          <div className="sp__toast"><CheckCircle size={16} /> Profile saved successfully!</div>
        )}

        {/* ── Tabs ── */}
        <div className="sp__tabs">
          <button
            className={`sp__tab ${activeTab === 'details' ? 'sp__tab--active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            <UserCircle size={17} />
            <span>Profile Details</span>
          </button>
          <button
            className={`sp__tab ${activeTab === 'security' ? 'sp__tab--active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Shield size={17} />
            <span>Security</span>
          </button>
        </div>

        {/* ════ PROFILE DETAILS TAB ════ */}
        {activeTab === 'details' && (
          <div className="sp__body">

            {/* LEFT */}
            <div className="sp__left">

              {/* Personal Info */}
              <div className="sp__card">
                <div className="sp__card-header">
                  <h2><User size={16} /> Personal Information</h2>
                  {!editing
                    ? <button className="sp__edit-btn" onClick={handleEdit}><Edit3 size={14} /> Edit</button>
                    : (
                      <div className="sp__edit-actions">
                        <button className="sp__cancel-btn" onClick={handleCancel}>Cancel</button>
                        <button className="sp__save-btn" onClick={handleSave} disabled={saving}>
                          <Save size={13} /> {saving ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    )
                  }
                </div>
                <div className="sp__fields">
                  {[
                    { icon: <User size={14} />,   label: 'Full Name', key: 'name',     type: 'text' },
                    { icon: <Mail size={14} />,   label: 'Email',     key: 'email',    type: 'email', readOnly: true },
                    { icon: <Phone size={14} />,  label: 'Phone',     key: 'phone',    type: 'text' },
                    { icon: <MapPin size={14} />, label: 'Location',  key: 'location', type: 'text' },
                  ].map(({ icon, label, key, type, readOnly }) => (
                    <div className="sp__field" key={key}>
                      <label className="sp__label">{icon} {label}</label>
                      {editing
                        ? <input className="sp__input" type={type} value={draft[key]}
                            onChange={readOnly ? undefined : set(key)} readOnly={readOnly}
                            style={readOnly ? { opacity: 0.55, cursor: 'not-allowed' } : {}} />
                        : <p className="sp__value">{profile[key] || '—'}</p>
                      }
                    </div>
                  ))}
                  <div className="sp__field sp__field--full">
                    <label className="sp__label"><Star size={14} /> Bio</label>
                    {editing
                      ? <textarea className="sp__textarea" rows={4} value={draft.bio} onChange={set('bio')} />
                      : <p className="sp__value">{profile.bio || '—'}</p>
                    }
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="sp__card">
                <div className="sp__card-header"><h2><GraduationCap size={16} /> Education</h2></div>
                <div className="sp__fields">
                  {[
                    { label: 'University', key: 'university' },
                    { label: 'Major', key: 'major' },
                    { label: 'Graduation Year', key: 'graduation_year' },
                  ].map(({ label, key }) => (
                    <div className="sp__field" key={key}>
                      <label className="sp__label">{label}</label>
                      {editing
                        ? <input className="sp__input" value={draft[key]} onChange={set(key)} />
                        : <p className="sp__value">{profile[key] || '—'}</p>
                      }
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="sp__card">
                <div className="sp__card-header"><h2><Globe size={16} /> Links & Social</h2></div>
                <div className="sp__fields">
                  {[
                    { icon: <Globe size={14} />,    label: 'Website',  key: 'website',  placeholder: 'https://yourwebsite.com' },
                    { icon: <Linkedin size={14} />, label: 'LinkedIn', key: 'linkedin', placeholder: 'https://linkedin.com/in/...' },
                    { icon: <Github size={14} />,   label: 'GitHub',   key: 'github',   placeholder: 'https://github.com/...' },
                  ].map(({ icon, label, key, placeholder }) => (
                    <div className="sp__field" key={key}>
                      <label className="sp__label">{icon} {label}</label>
                      {editing
                        ? <input className="sp__input" type="url" placeholder={placeholder} value={draft[key]} onChange={set(key)} />
                        : (profile[key]
                          ? <a href={profile[key]} target="_blank" rel="noreferrer" className="sp__value" style={{ color: '#2A3F8F', textDecoration: 'none' }}>{profile[key]}</a>
                          : <p className="sp__value">—</p>)
                      }
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT */}
            <div className="sp__right">

              {/* CV */}
              <div className="sp__card">
                <div className="sp__card-header"><h2><FileText size={16} /> Resume / CV</h2></div>
                <div className="sp__cv">
                  {cvFileName
                    ? (
                      <div className="sp__cv-file">
                        <FileText size={28} />
                        <div><p className="sp__cv-name">{cvFileName}</p><p className="sp__cv-sub">PDF • Uploaded</p></div>
                      </div>
                    )
                    : <p className="sp__cv-empty">No CV uploaded yet</p>
                  }
                  <input ref={fileRef} type="file" accept="application/pdf" style={{ display: 'none' }} onChange={handleCVUpload} />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button className="sp__upload-btn" onClick={() => fileRef.current.click()}>
                      <Upload size={14} /> {cvFileName ? 'Replace CV' : 'Upload CV (PDF)'}
                    </button>
                    {cvFileName && (
                      <button className="sp__upload-btn sp__upload-btn--danger" onClick={handleCVDelete}>
                        <X size={14} /> Remove CV
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="sp__card">
                <div className="sp__card-header"><h2><Star size={16} /> Skills</h2></div>
                <div className="sp__skills-wrap">
                  <div className="sp__skills">
                    {(editing ? draft.skills : profile.skills).map(skill => (
                      <span className="sp__skill" key={skill}>
                        {skill}
                        {editing && (
                          <button className="sp__skill-remove" onClick={() => removeSkill(skill)}><X size={10} /></button>
                        )}
                      </span>
                    ))}
                    {(editing ? draft.skills : profile.skills).length === 0 && (
                      <p className="sp__empty-msg">No skills added yet</p>
                    )}
                  </div>
                  {editing && (
                    <div className="sp__skill-input-wrap" ref={skillInputRef}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <input className="sp__input sp__skill-input"
                          placeholder="Type a skill and press Enter..."
                          value={skillInput}
                          onChange={e => { setSkillInput(e.target.value); setShowSkillDrop(true); }}
                          onFocus={() => setShowSkillDrop(true)}
                          onKeyDown={handleSkillKeyDown}
                          style={{ flex: 1 }}
                        />
                        {skillInput.trim() && (
                          <button className="sp__save-btn" onClick={() => addSkill(skillInput)} style={{ padding: '6px 12px', whiteSpace: 'nowrap' }}>
                            <Plus size={13} /> Add
                          </button>
                        )}
                      </div>
                      {showSkillDrop && skillInput && suggestions.length > 0 && (
                        <div className="sp__skill-drop">
                          {suggestions.slice(0, 6).map(s => (
                            <button key={s} className="sp__skill-opt" onMouseDown={() => addSkill(s)}>{s}</button>
                          ))}
                          {!SUGGESTED_SKILLS.some(s => s.toLowerCase() === skillInput.toLowerCase().trim()) && (
                            <button className="sp__skill-opt" style={{ color: '#2A3F8F', fontStyle: 'italic' }} onMouseDown={() => addSkill(skillInput)}>
                              + Add "{skillInput.trim()}"
                            </button>
                          )}
                        </div>
                      )}
                      {showSkillDrop && skillInput && suggestions.length === 0 && (
                        <div className="sp__skill-drop">
                          <button className="sp__skill-opt" style={{ color: '#2A3F8F', fontStyle: 'italic' }} onMouseDown={() => addSkill(skillInput)}>
                            + Add "{skillInput.trim()}"
                          </button>
                        </div>
                      )}
                      <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
                        Press <strong>Enter</strong> or click <strong>+ Add</strong> to add any custom skill
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Experience */}
              <div className="sp__card">
                <div className="sp__card-header">
                  <h2><Briefcase size={16} /> Experience</h2>
                  {editing && !addingExp && (
                    <button className="sp__add-btn" onClick={() => setAddingExp(true)}><Plus size={13} /> Add</button>
                  )}
                </div>
                <div className="sp__exp-list">
                  {(editing ? draft.experience : profile.experience).map(exp => (
                    <div className="sp__exp-item" key={exp.id}>
                      <div className="sp__exp-dot" />
                      <div className="sp__exp-body">
                        <div className="sp__exp-top">
                          <div>
                            <p className="sp__exp-role">{exp.role}</p>
                            <p className="sp__exp-company">{exp.company} · {exp.duration}</p>
                          </div>
                          {editing && (
                            <button className="sp__exp-remove" onClick={() => removeExp(exp.id)}><X size={13} /></button>
                          )}
                        </div>
                        <p className="sp__exp-desc">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                  {(editing ? draft.experience : profile.experience).length === 0 && !addingExp && (
                    <p className="sp__empty-msg">No experience added yet</p>
                  )}
                </div>
                {editing && addingExp && (
                  <div className="sp__exp-form">
                    <div className="sp__fields">
                      <div className="sp__field">
                        <label className="sp__label">Role / Position</label>
                        <input className="sp__input" placeholder="e.g. Frontend Intern"
                          value={newExp.role} onChange={e => setNewExp(n => ({ ...n, role: e.target.value }))} />
                      </div>
                      <div className="sp__field">
                        <label className="sp__label">Company</label>
                        <input className="sp__input" placeholder="e.g. TechCorp"
                          value={newExp.company} onChange={e => setNewExp(n => ({ ...n, company: e.target.value }))} />
                      </div>
                      <div className="sp__field sp__field--full">
                        <label className="sp__label">Duration</label>
                        <input className="sp__input" placeholder="e.g. Jun 2024 – Sep 2024"
                          value={newExp.duration} onChange={e => setNewExp(n => ({ ...n, duration: e.target.value }))} />
                      </div>
                      <div className="sp__field sp__field--full">
                        <label className="sp__label">Description</label>
                        <textarea className="sp__textarea" rows={3} placeholder="Describe your responsibilities..."
                          value={newExp.description} onChange={e => setNewExp(n => ({ ...n, description: e.target.value }))} />
                      </div>
                    </div>
                    <div className="sp__exp-form-actions">
                      <button className="sp__cancel-btn" onClick={() => setAddingExp(false)}>Cancel</button>
                      <button className="sp__save-btn" onClick={handleExpAdd}><Plus size={13} /> Add Experience</button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ════ SECURITY TAB ════ */}
        {activeTab === 'security' && (
          <div className="sp__security-wrap">
            <div className="sp__card sp__security-card">

              {/* Header */}
              <div className="sp__security-header">
                <div className="sp__security-icon-wrap">
                  <Lock size={22} />
                </div>
                <div>
                  <h2 className="sp__security-title">Change Password</h2>
                  <p className="sp__security-sub">Keep your account safe — use a strong, unique password.</p>
                </div>
              </div>

              <div className="sp__security-divider" />

              {/* Fields */}
              <div className="sp__pw-fields">
                {[
                  { label: 'Current Password', key: 'current',  placeholder: 'Enter your current password' },
                  { label: 'New Password',      key: 'newPw',   placeholder: 'At least 6 characters' },
                  { label: 'Confirm Password',  key: 'confirm', placeholder: 'Repeat your new password' },
                ].map(({ label, key, placeholder }) => (
                  <div className="sp__pw-field" key={key}>
                    <label className="sp__label"><Lock size={13} /> {label}</label>
                    <div className="sp__pw-input-wrap">
                      <input
                        className="sp__input"
                        type={showPw[key] ? 'text' : 'password'}
                        placeholder={placeholder}
                        value={pwData[key]}
                        onChange={e => setPwData(d => ({ ...d, [key]: e.target.value }))}
                      />
                      <button
                        className="sp__pw-eye"
                        type="button"
                        onClick={() => setShowPw(s => ({ ...s, [key]: !s[key] }))}
                        tabIndex={-1}
                      >
                        {showPw[key] ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Password strength hint */}
              {pwData.newPw && (
                <div className="sp__pw-strength">
                  <div className="sp__pw-strength-bars">
                    {[1, 2, 3, 4].map(i => {
                      const len = pwData.newPw.length;
                      const hasUpper = /[A-Z]/.test(pwData.newPw);
                      const hasNum   = /[0-9]/.test(pwData.newPw);
                      const hasSpec  = /[^A-Za-z0-9]/.test(pwData.newPw);
                      const score = (len >= 6 ? 1 : 0) + (len >= 10 ? 1 : 0) + (hasUpper || hasNum ? 1 : 0) + (hasSpec ? 1 : 0);
                      const colors = ['#e03838', '#F5A623', '#3b82f6', '#1a8a5a'];
                      return (
                        <div key={i} className="sp__pw-strength-bar"
                          style={{ background: i <= score ? colors[score - 1] : 'rgba(27,45,107,0.1)' }} />
                      );
                    })}
                  </div>
                  <span className="sp__pw-strength-label">
                    {(() => {
                      const len = pwData.newPw.length;
                      const hasUpper = /[A-Z]/.test(pwData.newPw);
                      const hasNum   = /[0-9]/.test(pwData.newPw);
                      const hasSpec  = /[^A-Za-z0-9]/.test(pwData.newPw);
                      const score = (len >= 6 ? 1 : 0) + (len >= 10 ? 1 : 0) + (hasUpper || hasNum ? 1 : 0) + (hasSpec ? 1 : 0);
                      return ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'][score];
                    })()}
                  </span>
                </div>
              )}

              {/* Messages */}
              {pwError && (
                <div className="sp__pw-msg sp__pw-msg--error">
                  <X size={14} /> {pwError}
                </div>
              )}
              {pwSuccess && (
                <div className="sp__pw-msg sp__pw-msg--success">
                  <CheckCircle size={14} /> Password changed successfully!
                </div>
              )}

              {/* Submit */}
              <button
                className="sp__save-btn sp__pw-submit"
                onClick={handleChangePassword}
                disabled={pwSaving}
              >
                <Lock size={14} /> {pwSaving ? 'Updating...' : 'Update Password'}
              </button>

            </div>

            {/* Info card */}
            <div className="sp__card sp__security-tips">
              <div className="sp__card-header"><h2><Shield size={16} /> Password Tips</h2></div>
              <ul className="sp__tips-list">
                {[
                  'Use at least 8 characters',
                  'Mix uppercase & lowercase letters',
                  'Include numbers and symbols',
                  'Never reuse passwords from other sites',
                  'Avoid using your name or birthday',
                ].map((tip, i) => (
                  <li key={i} className="sp__tip-item">
                    <span className="sp__tip-dot" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default StudentProfile;
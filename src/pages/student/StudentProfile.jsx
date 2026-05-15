import React, { useState, useRef } from 'react';
import {
  User, Mail, Phone, MapPin, Briefcase, GraduationCap,
  Upload, Plus, X, Edit3, Save, CheckCircle, FileText,
  Globe, Linkedin, Github, Star
} from 'lucide-react';
import StudentNavbar from '../../components/student/StudentNavbar';
import './StudentProfile.css';

/* ── Mock Data ── */
const INITIAL_PROFILE = {
  name: 'Ahmed Khalil',
  email: 'ahmed.khalil@example.com',
  phone: '+961 71 234 567',
  location: 'Beirut, Lebanon',
  title: 'Frontend Developer',
  bio: 'Passionate frontend developer with a love for clean UI and great UX. Currently seeking opportunities to grow in the tech industry.',
  university: 'American University of Beirut',
  major: 'Computer Science',
  graduationYear: '2025',
  website: 'https://ahmedkhalil.dev',
  linkedin: 'linkedin.com/in/ahmedkhalil',
  github: 'github.com/ahmedkhalil',
  skills: ['React', 'TypeScript', 'CSS', 'JavaScript', 'Figma', 'REST APIs', 'Git'],
  experience: [
    {
      id: 1,
      role: 'Frontend Intern',
      company: 'TechCorp',
      duration: 'Jun 2024 – Sep 2024',
      description: 'Built reusable React components, improved page load speed by 30%, collaborated with design team.',
    },
  ],
  cvFileName: 'Ahmed_Khalil_CV.pdf',
};

const ALL_SKILLS = [
  'React', 'Vue', 'Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind',
  'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Python', 'Django', 'Flask',
  'REST APIs', 'GraphQL', 'Docker', 'Git', 'Figma', 'AWS', 'Firebase', 'Redux',
  'Next.js', 'PHP', 'Laravel', 'Java', 'Spring Boot', 'C++', 'Machine Learning',
];

const calcCompletion = (profile) => {
  const fields = [
    profile.name, profile.email, profile.phone, profile.location,
    profile.title, profile.bio, profile.university, profile.major,
    profile.skills.length > 0, profile.experience.length > 0, profile.cvFileName,
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
};

const StudentProfile = () => {
  const [profile, setProfile]       = useState(INITIAL_PROFILE);
  const [editing, setEditing]       = useState(false);
  const [draft, setDraft]           = useState(INITIAL_PROFILE);
  const [skillInput, setSkillInput] = useState('');
  const [showSkillDrop, setShowSkillDrop] = useState(false);
  const [saved, setSaved]           = useState(false);
  const [newExp, setNewExp]         = useState({ role: '', company: '', duration: '', description: '' });
  const [addingExp, setAddingExp]   = useState(false);
  const fileRef = useRef();

  const completion = calcCompletion(profile);

  const handleEdit  = () => { setDraft({ ...profile }); setEditing(true); setSaved(false); };
  const handleCancel = () => { setEditing(false); setSkillInput(''); setAddingExp(false); };
  const handleSave  = () => {
    setProfile({ ...draft });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const addSkill = (skill) => {
    if (!draft.skills.includes(skill)) {
      setDraft(d => ({ ...d, skills: [...d.skills, skill] }));
    }
    setSkillInput('');
    setShowSkillDrop(false);
  };

  const removeSkill = (skill) =>
    setDraft(d => ({ ...d, skills: d.skills.filter(s => s !== skill) }));

  const filteredSkills = ALL_SKILLS.filter(
    s => s.toLowerCase().includes(skillInput.toLowerCase()) && !draft.skills.includes(s)
  );

  const handleExpAdd = () => {
    if (!newExp.role || !newExp.company) return;
    setDraft(d => ({ ...d, experience: [...d.experience, { ...newExp, id: Date.now() }] }));
    setNewExp({ role: '', company: '', duration: '', description: '' });
    setAddingExp(false);
  };

  const removeExp = (id) =>
    setDraft(d => ({ ...d, experience: d.experience.filter(e => e.id !== id) }));

  const handleCVUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setDraft(d => ({ ...d, cvFileName: file.name }));
    }
  };

  const set = (key) => (e) => setDraft(d => ({ ...d, [key]: e.target.value }));

  return (
    <div className="sp">
      <StudentNavbar studentName={profile.name} notifCount={2} />

      <main className="sp__main">

        {/* ── Header Banner ── */}
        <div className="sp__banner">
          <div className="sp__banner-content">
            <div className="sp__avatar-wrap">
              <div className="sp__avatar">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              {completion === 100 && (
                <span className="sp__verified"><CheckCircle size={14} /></span>
              )}
            </div>
            <div className="sp__banner-info">
              <h1 className="sp__banner-name">{profile.name}</h1>
              <p className="sp__banner-title">{profile.title}</p>
              <p className="sp__banner-loc"><MapPin size={13} /> {profile.location}</p>
            </div>
          </div>

          {/* Completion */}
          <div className="sp__completion">
            <div className="sp__completion-top">
              <span>Profile Completion</span>
              <strong>{completion}%</strong>
            </div>
            <div className="sp__completion-bar">
              <div className="sp__completion-fill" style={{ width: `${completion}%` }} />
            </div>
            {completion < 100 && (
              <p className="sp__completion-hint">Complete your profile to unlock all features</p>
            )}
          </div>
        </div>

        {/* ── Saved Toast ── */}
        {saved && (
          <div className="sp__toast">
            <CheckCircle size={16} /> Profile saved successfully!
          </div>
        )}

        <div className="sp__body">

          {/* ════════════════════ LEFT COLUMN ════════════════════ */}
          <div className="sp__left">

            {/* Personal Info */}
            <div className="sp__card">
              <div className="sp__card-header">
                <h2><User size={16} /> Personal Information</h2>
                {!editing
                  ? <button className="sp__edit-btn" onClick={handleEdit}><Edit3 size={14} /> Edit</button>
                  : <div className="sp__edit-actions">
                      <button className="sp__cancel-btn" onClick={handleCancel}>Cancel</button>
                      <button className="sp__save-btn"   onClick={handleSave}><Save size={13} /> Save</button>
                    </div>
                }
              </div>

              <div className="sp__fields">
                {[
                  { icon: <User size={14} />,      label: 'Full Name',  key: 'name',     type: 'text' },
                  { icon: <Mail size={14} />,      label: 'Email',      key: 'email',    type: 'email' },
                  { icon: <Phone size={14} />,     label: 'Phone',      key: 'phone',    type: 'text' },
                  { icon: <MapPin size={14} />,    label: 'Location',   key: 'location', type: 'text' },
                  { icon: <Briefcase size={14} />, label: 'Job Title',  key: 'title',    type: 'text' },
                ].map(({ icon, label, key, type }) => (
                  <div className="sp__field" key={key}>
                    <label className="sp__label">{icon} {label}</label>
                    {editing
                      ? <input className="sp__input" type={type} value={draft[key]} onChange={set(key)} />
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
              <div className="sp__card-header">
                <h2><GraduationCap size={16} /> Education</h2>
              </div>
              <div className="sp__fields">
                {[
                  { label: 'University',       key: 'university' },
                  { label: 'Major',            key: 'major' },
                  { label: 'Graduation Year',  key: 'graduationYear' },
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

            {/* Links */}
            <div className="sp__card">
              <div className="sp__card-header">
                <h2><Globe size={16} /> Links & Social</h2>
              </div>
              <div className="sp__fields">
                {[
                  { icon: <Globe size={13} />,    label: 'Website',  key: 'website' },
                  { icon: <Linkedin size={13} />, label: 'LinkedIn', key: 'linkedin' },
                  { icon: <Github size={13} />,   label: 'GitHub',   key: 'github' },
                ].map(({ icon, label, key }) => (
                  <div className="sp__field" key={key}>
                    <label className="sp__label">{icon} {label}</label>
                    {editing
                      ? <input className="sp__input" value={draft[key]} onChange={set(key)} />
                      : <p className="sp__value sp__value--link">{profile[key] || '—'}</p>
                    }
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ════════════════════ RIGHT COLUMN ════════════════════ */}
          <div className="sp__right">

            {/* CV Upload */}
            <div className="sp__card">
              <div className="sp__card-header">
                <h2><FileText size={16} /> Resume / CV</h2>
              </div>
              <div className="sp__cv">
                {profile.cvFileName
                  ? <div className="sp__cv-file">
                      <FileText size={28} />
                      <div>
                        <p className="sp__cv-name">{profile.cvFileName}</p>
                        <p className="sp__cv-sub">PDF • Uploaded</p>
                      </div>
                    </div>
                  : <p className="sp__cv-empty">No CV uploaded yet</p>
                }
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/pdf"
                  style={{ display: 'none' }}
                  onChange={handleCVUpload}
                />
                <button className="sp__upload-btn" onClick={() => fileRef.current.click()}>
                  <Upload size={14} /> {profile.cvFileName ? 'Replace CV' : 'Upload CV (PDF)'}
                </button>
              </div>
            </div>

            {/* Skills */}
            <div className="sp__card">
              <div className="sp__card-header">
                <h2><Star size={16} /> Skills</h2>
              </div>
              <div className="sp__skills-wrap">
                <div className="sp__skills">
                  {(editing ? draft.skills : profile.skills).map(skill => (
                    <span className="sp__skill" key={skill}>
                      {skill}
                      {editing && (
                        <button className="sp__skill-remove" onClick={() => removeSkill(skill)}>
                          <X size={10} />
                        </button>
                      )}
                    </span>
                  ))}
                  {(editing ? draft.skills : profile.skills).length === 0 && (
                    <p className="sp__empty-msg">No skills added yet</p>
                  )}
                </div>

                {editing && (
                  <div className="sp__skill-input-wrap">
                    <input
                      className="sp__input sp__skill-input"
                      placeholder="Search & add skill..."
                      value={skillInput}
                      onChange={e => { setSkillInput(e.target.value); setShowSkillDrop(true); }}
                      onFocus={() => setShowSkillDrop(true)}
                    />
                    {showSkillDrop && skillInput && filteredSkills.length > 0 && (
                      <div className="sp__skill-drop">
                        {filteredSkills.slice(0, 6).map(s => (
                          <button key={s} className="sp__skill-opt" onClick={() => addSkill(s)}>{s}</button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Experience */}
            <div className="sp__card">
              <div className="sp__card-header">
                <h2><Briefcase size={16} /> Experience</h2>
                {editing && !addingExp && (
                  <button className="sp__add-btn" onClick={() => setAddingExp(true)}>
                    <Plus size={13} /> Add
                  </button>
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
                          <button className="sp__exp-remove" onClick={() => removeExp(exp.id)}>
                            <X size={13} />
                          </button>
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

              {/* Add Experience Form */}
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
      </main>
    </div>
  );
};

export default StudentProfile;
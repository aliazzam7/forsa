import React, { useState, useEffect, useRef } from 'react';
import {
  Building2, Phone, Lock,
  Upload, Save, Eye, EyeOff,
  CheckCircle, Loader2,
} from 'lucide-react';
import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyHeader  from '../../components/company/CompanyHeader';
import companyService from '../../services/companyService';
import { BASE_URL }   from '../../services/api';
import './SettingsPage.css';

const TABS = [
  { id: 'company',  label: 'Company Info',    icon: Building2 },
  { id: 'contact',  label: 'Contact Info',    icon: Phone     },
  { id: 'password', label: 'Change Password', icon: Lock      },
];

const INDUSTRIES   = ['Technology','Healthcare','Finance','Education','E-commerce','Media','Manufacturing','Consulting','Other'];
const COMPANY_SIZES = ['1–10','11–50','51–200','201–500','500+'];

const getStrength = (pw) => {
  let s = 0;
  if (pw.length >= 8)          s++;
  if (/[A-Z]/.test(pw))        s++;
  if (/[0-9]/.test(pw))        s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};
const STRENGTH_LABELS = ['','Weak','Fair','Good','Strong'];
const STRENGTH_COLORS = ['','#dc2626','#f59e0b','#3b82f6','#16a34a'];

const Field = ({ label, required, error, children }) => (
  <div className="sp-field">
    <label className="sp-label">
      {label}{required && <span className="sp-required"> *</span>}
    </label>
    {children}
    {error && <p className="sp-error">{error}</p>}
  </div>
);

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('company');
  const [saved,     setSaved]     = useState('');
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [apiError,  setApiError]  = useState('');
  const fileInputRef = useRef(null);
  const [logoPreview, setLogoPreview] = useState(null);

  /*
    Backend getProfile() returns a flat company object:
    {
      id, company_name, email, phone, website, linkedin, twitter,
      industry, size, location, about, logo, status, ...
    }
    NOTE: name field might be "company_name" — we handle both.
  */
  const [company, setCompany] = useState({
    name: '', industry: 'Technology', size: '51–200', location: '', about: '',
  });
  const [companyErrors, setCompanyErrors] = useState({});

  const [contact, setContact] = useState({
    email: '', phone: '', website: '', linkedin: '', twitter: '',
  });
  const [contactErrors, setContactErrors] = useState({});

  const [passwords, setPasswords] = useState({ current: '', newPw: '', confirm: '' });
  const [showPw,    setShowPw]    = useState({ current: false, newPw: false, confirm: false });
  const [passwordErrors, setPasswordErrors] = useState({});
  const strength = getStrength(passwords.newPw);

  /* ── Load profile ── */
  useEffect(() => {
    const load = async () => {
      try {
        const d = await companyService.getProfile();
        // company_name OR name — backend uses company_name
        // const displayName = d.company_name ?? d.name ?? '';
        const displayName = d.company_name ?? d.name ?? '';

           setCompany({
            name:     displayName,
            industry: d.industry     ?? 'Technology',
            size:     d.company_size ?? '51–200',        // ← was d.size
            location: d.location     ?? '',
            about:    d.description  ?? d.about ?? '',   // ← DB returns description
          });

        setContact({
          email:    d.email        ?? '',
          phone:    d.phone_number ?? d.phone    ?? '', 
          website:  d.website      ?? '',
          linkedin: d.linkedin_url ?? d.linkedin ?? '', 
          twitter:  d.twitter_url  ?? d.twitter  ?? '',
        });

        if (d.logo) {
          setLogoPreview(
            d.logo.startsWith('http') ? d.logo : `${BASE_URL}/../${d.logo}`
          );
        }

        localStorage.setItem('forsa_company_name', displayName);
      } catch (err) {
        setApiError('Failed to load profile: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  
  const triggerSaved = (tab) => { setSaved(tab); setTimeout(() => setSaved(''), 2400); };

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompany(p => ({ ...p, [name]: value }));
    if (companyErrors[name]) setCompanyErrors(p => ({ ...p, [name]: '' }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContact(p => ({ ...p, [name]: value }));
    if (contactErrors[name]) setContactErrors(p => ({ ...p, [name]: '' }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(p => ({ ...p, [name]: value }));
    if (passwordErrors[name]) setPasswordErrors(p => ({ ...p, [name]: '' }));
  };

  /* ── Logo upload ── */
  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoPreview(URL.createObjectURL(file));
    try {
      await companyService.uploadLogo(file);
    } catch (err) {
      setApiError('Logo upload failed: ' + err.message);
    }
  };

  /* ── Save company info ── */
  const saveCompany = async () => {
    const errs = {};
    if (!company.name.trim())     errs.name     = 'Company name is required';
    if (!company.location.trim()) errs.location = 'Location is required';
    if (Object.keys(errs).length) { setCompanyErrors(errs); return; }

    setSaving(true); setApiError('');
    try {
      // Backend accepts: company_name (or name), industry, size, location, about
      await companyService.updateProfile({
        company_name: company.name,
        industry:     company.industry,
        size:         company.size,
        location:     company.location,
        about:        company.about,
      });
      localStorage.setItem('forsa_company_name', company.name);
      triggerSaved('company');
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSaving(false);
    }
  };

  /* ── Save contact info ── */
  const saveContact = async () => {
    const errs = {};
    if (!contact.email.trim()) errs.email = 'Email is required';
    if (Object.keys(errs).length) { setContactErrors(errs); return; }

    setSaving(true); setApiError('');
    try {
      await companyService.updateProfile({
        email:    contact.email,
        phone:    contact.phone,
        website:  contact.website,
        linkedin: contact.linkedin,
        twitter:  contact.twitter,
      });
      triggerSaved('contact');
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSaving(false);
    }
  };

  /* ── Save password ── */
  const savePassword = async () => {
    const errs = {};
    if (!passwords.current)                    errs.current = 'Current password is required';
    if (passwords.newPw.length < 6)            errs.newPw   = 'At least 6 characters';
    if (passwords.newPw !== passwords.confirm) errs.confirm = 'Passwords do not match';
    if (Object.keys(errs).length) { setPasswordErrors(errs); return; }

    setSaving(true); setApiError('');
    try {
      // companyService.changePassword sends: current_password, new_password
      await companyService.changePassword(passwords.current, passwords.newPw);
      setPasswords({ current: '', newPw: '', confirm: '' });
      triggerSaved('password');
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="company-layout">
        <CompanySidebar />
        <div className="company-main">
          <CompanyHeader title="Settings" subtitle="Manage your company profile and account" />
          <div className="company-content content-center">
            <Loader2 size={32} className="spin" color="#1B2D6B" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="company-layout">
      <CompanySidebar />
      <div className="company-main">
        <CompanyHeader title="Settings" subtitle="Manage your company profile and account" />

        <div className="company-content">

          {apiError && (
            <div className="api-error-banner">
              {apiError}
              <button onClick={() => setApiError('')}>✕</button>
            </div>
          )}

          <div className="settings-layout">

            {/* ── Side nav ── */}
            <nav className="settings-nav" aria-label="Settings sections">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className={`settings-nav-item ${activeTab === id ? 'settings-nav-item--active' : ''}`}
                  onClick={() => setActiveTab(id)}
                >
                  <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                  <span>{label}</span>
                  {saved === id && <CheckCircle size={14} className="settings-nav-saved" />}
                </button>
              ))}
            </nav>

            <div className="settings-panel">

              {/* ════ COMPANY INFO ════ */}
              {activeTab === 'company' && (
                <div className="settings-section">
                  <div className="avatar-row">
                    <div className="avatar-lg" aria-hidden="true">
                      {logoPreview
                        ? <img src={logoPreview} alt="Company logo" className="avatar-img" />
                        : (company.name.charAt(0).toUpperCase() || 'C')
                      }
                    </div>
                    <div className="avatar-actions">
                      <input
                        ref={fileInputRef} type="file" accept="image/png,image/jpeg"
                        style={{ display: 'none' }} onChange={handleLogoChange}
                      />
                      <button className="btn-upload" onClick={() => fileInputRef.current?.click()}>
                        <Upload size={14} strokeWidth={2} aria-hidden="true" />
                        Upload logo
                      </button>
                      <span className="upload-hint">PNG or JPG · max 2 MB</span>
                    </div>
                  </div>

                  <div className="sp-divider" />
                  <div className="sp-section-head">
                    <p className="sp-section-title">Company information</p>
                    <p className="sp-section-sub">Update your company's public profile details</p>
                  </div>

                  <div className="sp-grid">
                    <Field label="Company name" required error={companyErrors.name}>
                      <input className={`sp-input ${companyErrors.name ? 'sp-input--error' : ''}`}
                        type="text" name="name" value={company.name}
                        onChange={handleCompanyChange} placeholder="e.g. TechCorp" />
                    </Field>

                    <Field label="Industry">
                      <select className="sp-select" name="industry" value={company.industry} onChange={handleCompanyChange}>
                        {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                      </select>
                    </Field>

                    <Field label="Company size">
                      <select className="sp-select" name="size" value={company.size} onChange={handleCompanyChange}>
                        {COMPANY_SIZES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </Field>

                    <Field label="Location" required error={companyErrors.location}>
                      <input className={`sp-input ${companyErrors.location ? 'sp-input--error' : ''}`}
                        type="text" name="location" value={company.location}
                        onChange={handleCompanyChange} placeholder="e.g. Beirut, Lebanon" />
                    </Field>

                    <Field label="About the company">
                      <textarea className="sp-input sp-textarea" name="about"
                        value={company.about} onChange={handleCompanyChange}
                        rows={4} placeholder="Brief description visible to applicants…" />
                    </Field>
                  </div>

                  <div className="sp-actions">
                    {saved === 'company' && <span className="sp-saved-msg"><CheckCircle size={14} /> Changes saved</span>}
                    <button className="btn-save" onClick={saveCompany} disabled={saving}>
                      {saving ? <Loader2 size={15} className="spin" /> : <Save size={15} strokeWidth={2} />}
                      {saving ? 'Saving…' : 'Save changes'}
                    </button>
                  </div>
                </div>
              )}

              {/* ════ CONTACT INFO ════ */}
              {activeTab === 'contact' && (
                <div className="settings-section">
                  <div className="sp-section-head">
                    <p className="sp-section-title">Contact information</p>
                    <p className="sp-section-sub">How applicants and partners can reach you</p>
                  </div>

                  <div className="sp-grid">
                    <Field label="Email address" required error={contactErrors.email}>
                      <input className={`sp-input ${contactErrors.email ? 'sp-input--error' : ''}`}
                        type="email" name="email" value={contact.email}
                        onChange={handleContactChange} placeholder="hr@yourcompany.com" />
                    </Field>
                    <Field label="Phone number">
                      <input className="sp-input" type="tel" name="phone" value={contact.phone}
                        onChange={handleContactChange} placeholder="+961 1 234 567" />
                    </Field>
                    <Field label="Website">
                      <input className="sp-input" type="url" name="website" value={contact.website}
                        onChange={handleContactChange} placeholder="https://yourcompany.com" />
                    </Field>
                    <Field label="LinkedIn">
                      <input className="sp-input" type="url" name="linkedin" value={contact.linkedin}
                        onChange={handleContactChange} placeholder="https://linkedin.com/company/…" />
                    </Field>
                    <Field label="Twitter / X">
                      <input className="sp-input" type="url" name="twitter" value={contact.twitter}
                        onChange={handleContactChange} placeholder="https://x.com/…" />
                    </Field>
                  </div>

                  <div className="sp-actions">
                    {saved === 'contact' && <span className="sp-saved-msg"><CheckCircle size={14} /> Changes saved</span>}
                    <button className="btn-save" onClick={saveContact} disabled={saving}>
                      {saving ? <Loader2 size={15} className="spin" /> : <Save size={15} strokeWidth={2} />}
                      {saving ? 'Saving…' : 'Save changes'}
                    </button>
                  </div>
                </div>
              )}

              {/* ════ CHANGE PASSWORD ════ */}
              {activeTab === 'password' && (
                <div className="settings-section">
                  <div className="sp-section-head">
                    <p className="sp-section-title">Change password</p>
                    <p className="sp-section-sub">Choose a strong password to keep your account secure</p>
                  </div>

                  <div className="sp-grid sp-grid--narrow">
                    <Field label="Current password" error={passwordErrors.current}>
                      <div className="pw-input-wrap">
                        <input className={`sp-input ${passwordErrors.current ? 'sp-input--error' : ''}`}
                          type={showPw.current ? 'text' : 'password'} name="current"
                          value={passwords.current} onChange={handlePasswordChange}
                          placeholder="••••••••" autoComplete="current-password" />
                        <button className="pw-toggle" type="button"
                          onClick={() => setShowPw(p => ({ ...p, current: !p.current }))}>
                          {showPw.current ? <EyeOff size={16} strokeWidth={1.8} /> : <Eye size={16} strokeWidth={1.8} />}
                        </button>
                      </div>
                    </Field>

                    <Field label="New password" error={passwordErrors.newPw}>
                      <div className="pw-input-wrap">
                        <input className={`sp-input ${passwordErrors.newPw ? 'sp-input--error' : ''}`}
                          type={showPw.newPw ? 'text' : 'password'} name="newPw"
                          value={passwords.newPw} onChange={handlePasswordChange}
                          placeholder="••••••••" autoComplete="new-password" />
                        <button className="pw-toggle" type="button"
                          onClick={() => setShowPw(p => ({ ...p, newPw: !p.newPw }))}>
                          {showPw.newPw ? <EyeOff size={16} strokeWidth={1.8} /> : <Eye size={16} strokeWidth={1.8} />}
                        </button>
                      </div>
                      {passwords.newPw && (
                        <div className="pw-strength">
                          <div className="pw-bars">
                            {[1,2,3,4].map(n => (
                              <div key={n} className="pw-bar"
                                style={{ background: n <= strength ? STRENGTH_COLORS[strength] : '#eaecf4' }} />
                            ))}
                          </div>
                          <span className="pw-strength-label" style={{ color: STRENGTH_COLORS[strength] }}>
                            {STRENGTH_LABELS[strength]}
                          </span>
                        </div>
                      )}
                    </Field>

                    <Field label="Confirm new password" error={passwordErrors.confirm}>
                      <div className="pw-input-wrap">
                        <input className={`sp-input ${passwordErrors.confirm ? 'sp-input--error' : ''}`}
                          type={showPw.confirm ? 'text' : 'password'} name="confirm"
                          value={passwords.confirm} onChange={handlePasswordChange}
                          placeholder="••••••••" autoComplete="new-password" />
                        <button className="pw-toggle" type="button"
                          onClick={() => setShowPw(p => ({ ...p, confirm: !p.confirm }))}>
                          {showPw.confirm ? <EyeOff size={16} strokeWidth={1.8} /> : <Eye size={16} strokeWidth={1.8} />}
                        </button>
                      </div>
                    </Field>

                    <div className="pw-tips">
                      <p className="pw-tips__title">Password requirements</p>
                      {[
                        { text: 'At least 6 characters',         ok: passwords.newPw.length >= 6 },
                        { text: 'One uppercase letter',          ok: /[A-Z]/.test(passwords.newPw) },
                        { text: 'One number',                    ok: /[0-9]/.test(passwords.newPw) },
                        { text: 'One special character (!@#$…)', ok: /[^A-Za-z0-9]/.test(passwords.newPw) },
                      ].map(({ text, ok }) => (
                        <p key={text} className={`pw-tip ${ok ? 'pw-tip--ok' : ''}`}>
                          <CheckCircle size={12} aria-hidden="true" /> {text}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="sp-actions">
                    {saved === 'password' && <span className="sp-saved-msg"><CheckCircle size={14} /> Password updated</span>}
                    <button className="btn-save" onClick={savePassword} disabled={saving}>
                      {saving ? <Loader2 size={15} className="spin" /> : <Lock size={15} strokeWidth={2} />}
                      {saving ? 'Updating…' : 'Update password'}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

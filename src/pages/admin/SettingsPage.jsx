import React, { useState } from 'react';
import { User, Lock, Shield, CheckCircle, Eye, EyeOff, Upload } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import './SettingsPage.css';

/* ─── Password Strength ──────────────────────────────────── */
const getStrength = (pw) => {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8)  score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: '',        color: '',         width: '0%'  },
    { label: 'Weak',    color: '#dc2626',  width: '25%' },
    { label: 'Fair',    color: '#F5A623',  width: '50%' },
    { label: 'Good',    color: '#2e48a8',  width: '75%' },
    { label: 'Strong',  color: '#16a34a',  width: '100%'},
  ];
  return map[score];
};

/* ─── Profile Tab ────────────────────────────────────────── */
const ProfileTab = () => {
  const [form, setForm] = useState({
    firstName: 'Super',
    lastName:  'Admin',
    email:     'admin@forsa.com',
    phone:     '+961 70 000 000',
    bio:       'Platform administrator for Forsa — managing users, companies, and job listings.',
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="settings-card">
      <div className="settings-card-header">
        <h2 className="settings-card-title">Profile Information</h2>
        <p className="settings-card-desc">Update your display name, contact info, and bio.</p>
      </div>
      <div className="settings-card-body">
        {/* Avatar */}
        <div className="profile-avatar-area">
          <div className="profile-avatar-large">
            {form.firstName.charAt(0)}{form.lastName.charAt(0)}
          </div>
          <div className="profile-avatar-info">
            <h3>{form.firstName} {form.lastName}</h3>
            <p>{form.email}</p>
            <button className="btn-change-avatar">
              <Upload size={13} strokeWidth={2.2} />
              Change Photo
            </button>
          </div>
        </div>

        {/* Fields */}
        <div className="form-row">
          <div className="form-field">
            <label className="form-label">First Name</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="form-input"
              placeholder="First name"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Last Name</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="form-input"
              placeholder="Last name"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label className="form-label">Email Address</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="form-input"
              placeholder="admin@forsa.com"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Phone Number</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="form-input"
              placeholder="+961 xx xxx xxx"
            />
          </div>
        </div>

        <div className="form-field full-width">
          <label className="form-label">Bio</label>
          <input
            name="bio"
            value={form.bio}
            onChange={handleChange}
            className="form-input"
            placeholder="Short description..."
          />
          <p className="form-hint">Shown on your admin profile card.</p>
        </div>
      </div>

      <div className="settings-card-footer">
        {saved && (
          <div className="save-toast">
            <CheckCircle size={15} strokeWidth={2.5} />
            Profile saved successfully!
          </div>
        )}
        <button className="btn-cancel" onClick={() => setForm({
          firstName: 'Super', lastName: 'Admin',
          email: 'admin@forsa.com', phone: '+961 70 000 000',
          bio: 'Platform administrator for Forsa — managing users, companies, and job listings.',
        })}>
          Reset
        </button>
        <button className="btn-save" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

/* ─── Security Tab ───────────────────────────────────────── */
const SecurityTab = () => {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [errors,      setErrors]      = useState({});
  const [saved,       setSaved]       = useState(false);

  const strength = getStrength(form.newPassword);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.currentPassword) e.currentPassword = 'Current password is required.';
    if (!form.newPassword)     e.newPassword     = 'New password is required.';
    else if (form.newPassword.length < 8) e.newPassword = 'Must be at least 8 characters.';
    if (form.newPassword !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setSaved(true);
    setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setSaved(false), 3000);
  };

  const PwInput = ({ name, value, show, toggle, label, placeholder }) => (
    <div className="form-field">
      <label className="form-label">{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          name={name}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={handleChange}
          className={`form-input${errors[name] ? ' input-error' : ''}`}
          placeholder={placeholder}
          style={{ paddingRight: '40px' }}
        />
        <button
          type="button"
          onClick={toggle}
          style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7A99', display: 'flex', padding: 0 }}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {errors[name] && <p className="form-error">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="settings-card">
      <div className="settings-card-header">
        <h2 className="settings-card-title">Change Password</h2>
        <p className="settings-card-desc">Update your login credentials. Use a strong password.</p>
      </div>
      <div className="settings-card-body">
        <PwInput
          name="currentPassword"
          value={form.currentPassword}
          show={showCurrent}
          toggle={() => setShowCurrent(p => !p)}
          label="Current Password"
          placeholder="Enter current password"
        />

        <div className="form-field">
          <label className="form-label">New Password</label>
          <div style={{ position: 'relative' }}>
            <input
              name="newPassword"
              type={showNew ? 'text' : 'password'}
              value={form.newPassword}
              onChange={handleChange}
              className={`form-input${errors.newPassword ? ' input-error' : ''}`}
              placeholder="Enter new password"
              style={{ paddingRight: '40px' }}
            />
            <button
              type="button"
              onClick={() => setShowNew(p => !p)}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7A99', display: 'flex', padding: 0 }}
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {form.newPassword && (
            <div className="password-strength">
              <div className="strength-bar">
                <div
                  className="strength-fill"
                  style={{ width: strength.width, background: strength.color }}
                />
              </div>
              <span className="strength-label" style={{ color: strength.color }}>
                {strength.label}
              </span>
            </div>
          )}
          {errors.newPassword && <p className="form-error">{errors.newPassword}</p>}
        </div>

        <div className="form-field">
          <label className="form-label">Confirm New Password</label>
          <input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            className={`form-input${errors.confirmPassword ? ' input-error' : ''}`}
            placeholder="Repeat new password"
          />
          {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
        </div>
      </div>

      <div className="settings-card-footer">
        {saved && (
          <div className="save-toast">
            <CheckCircle size={15} strokeWidth={2.5} />
            Password updated successfully!
          </div>
        )}
        <button className="btn-cancel" onClick={() => setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })}>
          Clear
        </button>
        <button className="btn-save" onClick={handleSave}>
          Update Password
        </button>
      </div>
    </div>
  );
};

/* ─── Danger Zone Tab ────────────────────────────────────── */
const DangerTab = () => (
  <div className={`settings-card danger-zone-card`}>
    <div className="settings-card-header">
      <h2 className="settings-card-title">Danger Zone</h2>
      <p className="settings-card-desc">These actions are irreversible. Proceed with caution.</p>
    </div>
    <div className="settings-card-body">
      <div className="danger-item">
        <div className="danger-item-info">
          <h4>Clear All Messages</h4>
          <p>Permanently delete all contact form messages from the inbox.</p>
        </div>
        <button className="btn-danger" onClick={() => window.confirm('Clear all messages?')}>
          Clear Messages
        </button>
      </div>
      <div className="danger-item">
        <div className="danger-item-info">
          <h4>Reset Platform Data</h4>
          <p>Remove all user, company, and job data. Cannot be undone.</p>
        </div>
        <button className="btn-danger" onClick={() => window.confirm('Reset ALL platform data? This cannot be undone.')}>
          Reset Data
        </button>
      </div>
      <div className="danger-item">
        <div className="danger-item-info">
          <h4>Deactivate Admin Account</h4>
          <p>Lock this admin account. You will be logged out immediately.</p>
        </div>
        <button className="btn-danger" onClick={() => window.confirm('Deactivate your admin account?')}>
          Deactivate Account
        </button>
      </div>
    </div>
  </div>
);

/* ─── Main Page ──────────────────────────────────────────── */
const TABS = [
  { id: 'profile',  label: 'Profile',     icon: User    },
  { id: 'security', label: 'Security',    icon: Lock    },
  { id: 'danger',   label: 'Danger Zone', icon: Shield  },
];

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="Settings" subtitle="Manage your admin profile and account preferences" />
        <div className="admin-content">
          <div className="settings-layout">

            {/* Nav */}
            <nav className="settings-nav">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className={`settings-nav-item${activeTab === id ? ' active' : ''}`}
                  onClick={() => setActiveTab(id)}
                >
                  <Icon size={16} strokeWidth={2} />
                  {label}
                </button>
              ))}
            </nav>

            {/* Content */}
            <div className="settings-content">
              {activeTab === 'profile'  && <ProfileTab />}
              {activeTab === 'security' && <SecurityTab />}
              {activeTab === 'danger'   && <DangerTab />}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
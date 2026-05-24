import React, { useState, useEffect } from 'react';
import { User, Lock, CheckCircle, Eye, EyeOff, Upload, AlertCircle } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import adminService from '../../services/adminService';
import uploadService from '../../services/uploadService';
import useAdminProfile from '../../components/hooks/useAdminProfile';
import './SettingsPage.css';

const getStrength = (pw) => {
  if (!pw) return { score: 0, label: '', color: '', width: '0%' };
  let score = 0;
  if (pw.length >= 8)           score++;
  if (/[A-Z]/.test(pw))         score++;
  if (/[0-9]/.test(pw))         score++;
  if (/[^A-Za-z0-9]/.test(pw))  score++;
  const map = [
    { label: '',       color: '',        width: '0%'   },
    { label: 'Weak',   color: '#dc2626', width: '25%'  },
    { label: 'Fair',   color: '#F5A623', width: '50%'  },
    { label: 'Good',   color: '#2e48a8', width: '75%'  },
    { label: 'Strong', color: '#16a34a', width: '100%' },
  ];
  return map[score];
};

const ConfirmBanner = ({ message, onConfirm, onCancel }) => (
  <div className="confirm-banner">
    <AlertCircle size={16} strokeWidth={2.2} className="confirm-banner__icon" />
    <span className="confirm-banner__msg">{message}</span>
    <div className="confirm-banner__actions">
      <button className="confirm-banner__btn confirm-banner__btn--cancel" onClick={onCancel}>Cancel</button>
      <button className="confirm-banner__btn confirm-banner__btn--ok" onClick={onConfirm}>Yes, Save</button>
    </div>
  </div>
);

const ProfileTab = () => {
  const [form, setForm]           = useState({ name: '', email: '' });
  const [original, setOriginal]   = useState({ name: '', email: '' });
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved]         = useState(false);
  const [error, setError]         = useState(null);
  const [pendingAvatar, setPendingAvatar] = useState(null);
  const [showConfirm, setShowConfirm]     = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const me = await adminService.getProfile();
        const data = { name: me.name ?? '', email: me.email ?? '' };
        setForm(data);
        setOriginal(data);
        if (me.avatar) setAvatarUrl(me.avatar);
      } catch {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const isDirty = form.name.trim() !== original.name.trim() || form.email.trim() !== original.email.trim();

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingAvatar(file);
  };

  const confirmAvatarUpload = async () => {
    if (!pendingAvatar) return;
    setUploading(true);
    setPendingAvatar(null);
    try {
      const result = await uploadService.uploadAvatar(pendingAvatar);
      const newAvatar = result?.avatar ?? result?.path ?? result?.url ?? null;
      if (newAvatar) {
        await adminService.updateProfile({ avatar: newAvatar });
        setAvatarUrl(newAvatar);
      }
      flashSaved();
    } catch (err) {
      alert(err.message || 'Avatar upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveClick = () => {
    if (!form.name.trim())  { setError('Name is required.');  return; }
    if (!form.email.trim()) { setError('Email is required.'); return; }
    setError(null);
    setShowConfirm(true);
  };

  const confirmSave = async () => {
    setShowConfirm(false);
    setSaving(true);
    setError(null);
    try {
      await adminService.updateProfile({ name: form.name.trim(), email: form.email.trim() });
      setOriginal({ name: form.name.trim(), email: form.email.trim() });
      flashSaved();
    } catch (err) {
      setError(err.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const flashSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  if (loading) return <p className="loading-msg">Loading profile...</p>;

  const BASE_URL = 'http://localhost/forsa-platform-backend';
  const avatarSrc = avatarUrl ? (avatarUrl.startsWith('http') ? avatarUrl : `${BASE_URL}/${avatarUrl}`) : null;

  return (
    <div className="settings-card">
      <div className="settings-card-header">
        <h2 className="settings-card-title">Profile Information</h2>
        <p className="settings-card-desc">Update your display name, email, and profile photo.</p>
      </div>
      <div className="settings-card-body">
        {error && <p className="form-error-banner">{error}</p>}
        {pendingAvatar && <ConfirmBanner message={`Update your profile photo to "${pendingAvatar.name}"?`} onConfirm={confirmAvatarUpload} onCancel={() => setPendingAvatar(null)} />}
        {showConfirm   && <ConfirmBanner message="You're about to update your profile info. Continue?" onConfirm={confirmSave} onCancel={() => setShowConfirm(false)} />}
        <div className="profile-avatar-area">
          <div className="profile-avatar-large">
            {avatarSrc ? <img src={avatarSrc} alt="avatar" className="profile-avatar-img" /> : (form.name.charAt(0).toUpperCase() || 'A')}
            {uploading && <div className="avatar-uploading-overlay">...</div>}
          </div>
          <div className="profile-avatar-info">
            <h3>{form.name || 'Admin'}</h3>
            <p>{form.email}</p>
            <input id="avatar-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
            <label htmlFor="avatar-upload" className="btn-change-avatar" style={{ cursor: 'pointer' }}>
              <Upload size={13} strokeWidth={2.2} />
              {uploading ? 'Uploading...' : 'Change Photo'}
            </label>
          </div>
        </div>
        <div className="form-field full-width">
          <label className="form-label">Full Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="form-input" placeholder="Your name" />
        </div>
        <div className="form-field full-width">
          <label className="form-label">Email Address</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} className="form-input" placeholder="admin@forsa.com" />
        </div>
      </div>
      <div className="settings-card-footer">
        {saved && <div className="save-toast"><CheckCircle size={15} strokeWidth={2.5} /> Saved successfully!</div>}
        <button className="btn-save" onClick={handleSaveClick} disabled={saving || !isDirty}>{saving ? 'Saving...' : 'Save Changes'}</button>
      </div>
    </div>
  );
};

const SecurityTab = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword,     setNewPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors,  setErrors]  = useState({});
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  const strength = getStrength(newPassword);
  const clearError = (field) => setErrors(prev => ({ ...prev, [field]: '' }));

  const validate = () => {
    const e = {};
    if (!currentPassword)          e.currentPassword = 'Current password is required.';
    if (!newPassword)              e.newPassword = 'New password is required.';
    else if (newPassword.length < 8) e.newPassword = 'Must be at least 8 characters.';
    if (newPassword !== confirmPassword) e.confirmPassword = 'Passwords do not match.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await adminService.changePassword(currentPassword, newPassword);
      setSaved(true);
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); setErrors({});
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setErrors({ currentPassword: err.message || 'Current password is incorrect.' });
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => { setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); setErrors({}); };
  const newAndConfirmDisabled = !currentPassword;

  return (
    <div className="settings-card">
      <div className="settings-card-header">
        <h2 className="settings-card-title">Change Password</h2>
        <p className="settings-card-desc">Enter your current password to verify, then set a new one.</p>
      </div>
      <div className="settings-card-body">
        <div className="form-field">
          <label className="form-label">Current Password</label>
          <div className="pw-input-wrap">
            <input type={showCurrent ? 'text' : 'password'} value={currentPassword} onChange={e => { setCurrentPassword(e.target.value); clearError('currentPassword'); }} className={`form-input${errors.currentPassword ? ' input-error' : ''}`} placeholder="Enter your current password" />
            <button type="button" className="pw-eye-btn" onClick={() => setShowCurrent(p => !p)}>{showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          </div>
          {errors.currentPassword && <p className="form-error">{errors.currentPassword}</p>}
        </div>
        <div className="form-field">
          <label className="form-label">New Password</label>
          <div className="pw-input-wrap">
            <input type={showNew ? 'text' : 'password'} value={newPassword} onChange={e => { setNewPassword(e.target.value); clearError('newPassword'); }} className={`form-input${errors.newPassword ? ' input-error' : ''}`} placeholder={newAndConfirmDisabled ? 'Enter current password first' : 'Enter your new password'} disabled={newAndConfirmDisabled} />
            {!newAndConfirmDisabled && <button type="button" className="pw-eye-btn" onClick={() => setShowNew(p => !p)}>{showNew ? <EyeOff size={16} /> : <Eye size={16} />}</button>}
          </div>
          {newPassword && (
            <div className="password-strength">
              <div className="strength-bar"><div className="strength-fill" style={{ width: strength.width, background: strength.color }} /></div>
              <span className="strength-label" style={{ color: strength.color }}>{strength.label}</span>
            </div>
          )}
          {errors.newPassword && <p className="form-error">{errors.newPassword}</p>}
        </div>
        <div className="form-field">
          <label className="form-label">Confirm New Password</label>
          <div className="pw-input-wrap">
            <input type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); clearError('confirmPassword'); }} className={`form-input${errors.confirmPassword ? ' input-error' : ''}`} placeholder={newAndConfirmDisabled ? 'Enter current password first' : 'Repeat your new password'} disabled={newAndConfirmDisabled} />
            {!newAndConfirmDisabled && <button type="button" className="pw-eye-btn" onClick={() => setShowConfirm(p => !p)}>{showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}</button>}
          </div>
          {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
        </div>
      </div>
      <div className="settings-card-footer">
        {saved && <div className="save-toast"><CheckCircle size={15} strokeWidth={2.5} /> Password updated successfully!</div>}
        <button className="btn-cancel" onClick={handleClear}>Clear</button>
        <button className="btn-save" onClick={handleSave} disabled={saving}>{saving ? 'Updating...' : 'Update Password'}</button>
      </div>
    </div>
  );
};

const TABS = [
  { id: 'profile',  label: 'Profile',  icon: User },
  { id: 'security', label: 'Security', icon: Lock },
];

const SettingsPage = () => {
  const adminProfile = useAdminProfile(); // ← hook مشترك
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader
          title="Settings"
          subtitle="Manage your admin profile and account preferences"
          adminName={adminProfile.name}
          adminAvatar={adminProfile.avatar}
        />
        <div className="admin-content">
          <div className="settings-layout">
            <nav className="settings-nav">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button key={id} className={`settings-nav-item${activeTab === id ? ' active' : ''}`} onClick={() => setActiveTab(id)}>
                  <Icon size={16} strokeWidth={2} />{label}
                </button>
              ))}
            </nav>
            <div className="settings-content">
              {activeTab === 'profile'  && <ProfileTab />}
              {activeTab === 'security' && <SecurityTab />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
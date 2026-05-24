// src/pages/auth/RegisterCompanyPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, Lock, ShieldCheck, Globe, Briefcase, ChevronRight } from 'lucide-react';
import './AuthPages.css';
import logo from '../../assets/images/logoforsa.jpeg';
import authService from '../../services/authService';
import Toast from '../../components/common/Toast';
import useToast from '../../components/hooks/useToast';

const RegisterCompanyPage = () => {
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  const [form, setForm]       = useState({ companyName: '', email: '', password: '', confirm: '', industry: '', website: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.companyName || !form.email || !form.password || !form.confirm) {
      setError('Please fill in all required fields.'); return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.'); return;
    }
    setLoading(true);
    setError('');
    try {
      await authService.registerCompany({
        companyName: form.companyName,
        email:       form.email,
        password:    form.password,
        industry:    form.industry,
        website:     form.website,
      });

      showToast(
        '🎉 Company registered! Your account is pending admin approval. You\'ll be able to login once approved.',
        'success'
      );

      setTimeout(() => navigate('/login'), 3500);

    } catch (err) {
      const msg = err.message || 'Registration failed. Please try again.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} duration={5000} />}

      {/* ── Left Panel ── */}
      <div className="auth-left">
        <div className="auth-left-inner">
          <img src={logo} alt="Forsa Logo" className="auth-logo-img" />
          <div className="auth-left-text">
            <h2 className="auth-left-title">Find Your Next Hire</h2>
            <p className="auth-left-sub">
              Post positions, browse verified student profiles, and build your dream team with Forsa.
            </p>
          </div>
          <div className="auth-left-steps">
            <div className="auth-step"><ChevronRight size={16}/><span>Post jobs & internships easily</span></div>
            <div className="auth-step"><ChevronRight size={16}/><span>Review CVs and shortlist talent</span></div>
            <div className="auth-step"><ChevronRight size={16}/><span>Manage your full hiring pipeline</span></div>
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-card-icon"><Building2 size={22} strokeWidth={2.5}/></div>
            <div>
              <h2 className="auth-title">Company Registration</h2>
              <p className="auth-sub">Create your company account</p>
            </div>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Company Name <span className="required">*</span></label>
              <div className="input-wrapper">
                <Building2 size={17} className="input-icon"/>
                <input type="text" name="companyName" placeholder="Your company name"
                  value={form.companyName} onChange={handleChange} className="form-input"/>
              </div>
            </div>

            <div className="form-group">
              <label>Email <span className="required">*</span></label>
              <div className="input-wrapper">
                <Mail size={17} className="input-icon"/>
                <input type="email" name="email" placeholder="company@email.com"
                  value={form.email} onChange={handleChange} className="form-input"/>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Industry</label>
                <div className="input-wrapper">
                  <Briefcase size={17} className="input-icon"/>
                  <select name="industry" value={form.industry} onChange={handleChange} className="form-input">
                    <option value="">Select industry</option>
                    <option value="tech">Technology</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="education">Education</option>
                    <option value="marketing">Marketing</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Website</label>
                <div className="input-wrapper">
                  <Globe size={17} className="input-icon"/>
                  <input type="url" name="website" placeholder="https://..."
                    value={form.website} onChange={handleChange} className="form-input"/>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password <span className="required">*</span></label>
                <div className="input-wrapper">
                  <Lock size={17} className="input-icon"/>
                  <input type="password" name="password" placeholder="Create a password"
                    value={form.password} onChange={handleChange} className="form-input"/>
                </div>
              </div>
              <div className="form-group">
                <label>Confirm Password <span className="required">*</span></label>
                <div className="input-wrapper">
                  <ShieldCheck size={17} className="input-icon"/>
                  <input type="password" name="confirm" placeholder="Confirm password"
                    value={form.confirm} onChange={handleChange} className="form-input"/>
                </div>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Registering…' : <><Building2 size={18}/> Register Company</>}
            </button>
          </form>

          <div className="auth-divider"><span>Already have an account?</span></div>

          <div className="auth-links-row">
            <button className="auth-link" onClick={() => navigate('/login')}>Sign In</button>
            <span className="auth-links-sep">·</span>
            <button className="auth-link" onClick={() => navigate('/register/student')}>Register as Student</button>
          </div>

          <button className="back-home-btn" onClick={() => navigate('/')}>← Back to Home</button>
        </div>
      </div>
    </div>
  );
};

export default RegisterCompanyPage;
// src/pages/auth/RegisterStudentPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ShieldCheck, GraduationCap, ChevronRight } from 'lucide-react';
import './AuthPages.css';
import logo from '../../assets/images/logoforsa.jpeg';
import authService from '../../services/authService';
import Toast from '../../components/common/Toast';
import useToast from '../../components/hooks/useToast';

const RegisterStudentPage = () => {
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError('Please fill in all fields.'); return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.'); return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await authService.registerStudent({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      if (data?.token) {
        localStorage.setItem('forsa_token', data.token);
        localStorage.setItem('forsa_role', 'student');
      }

      showToast('Account created successfully! Welcome to Forsa 🎉', 'success');

      setTimeout(() => {
        if (data?.token) {
          navigate('/student/dashboard');
        } else {
          navigate('/login');
        }
      }, 2000);

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
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      {/* ── Left Panel ── */}
      <div className="auth-left">
        <div className="auth-left-inner">
          <img src={logo} alt="Forsa Logo" className="auth-logo-img" />
          <div className="auth-left-text">
            <h2 className="auth-left-title">Launch Your Career</h2>
            <p className="auth-left-sub">
              Join thousands of students already finding internships and jobs through Forsa.
            </p>
          </div>
          <div className="auth-left-steps">
            <div className="auth-step"><ChevronRight size={16}/><span>Build your professional profile & CV</span></div>
            <div className="auth-step"><ChevronRight size={16}/><span>Apply to curated opportunities</span></div>
            <div className="auth-step"><ChevronRight size={16}/><span>Get discovered by top employers</span></div>
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-card-icon"><GraduationCap size={22} strokeWidth={2.5}/></div>
            <div>
              <h2 className="auth-title">Student Registration</h2>
              <p className="auth-sub">Create your free student account</p>
            </div>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-wrapper">
                <User size={17} className="input-icon"/>
                <input type="text" name="name" placeholder="Your full name"
                  value={form.name} onChange={handleChange} className="form-input"/>
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <div className="input-wrapper">
                <Mail size={17} className="input-icon"/>
                <input type="email" name="email" placeholder="your@email.com"
                  value={form.email} onChange={handleChange} className="form-input"/>
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock size={17} className="input-icon"/>
                <input type="password" name="password" placeholder="Create a password"
                  value={form.password} onChange={handleChange} className="form-input"/>
              </div>
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-wrapper">
                <ShieldCheck size={17} className="input-icon"/>
                <input type="password" name="confirm" placeholder="Confirm your password"
                  value={form.confirm} onChange={handleChange} className="form-input"/>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Creating account…' : <><GraduationCap size={18}/> Create Student Account</>}
            </button>
          </form>

          <div className="auth-divider"><span>Already have an account?</span></div>

          <div className="auth-links-row">
            <button className="auth-link" onClick={() => navigate('/login')}>Sign In</button>
            <span className="auth-links-sep">·</span>
            <button className="auth-link" onClick={() => navigate('/register/company')}>Register as Company</button>
          </div>

          <button className="back-home-btn" onClick={() => navigate('/')}>← Back to Home</button>
        </div>
      </div>
    </div>
  );
};

export default RegisterStudentPage;
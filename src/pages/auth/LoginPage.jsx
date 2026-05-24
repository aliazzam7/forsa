// src/pages/auth/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, UserCircle2, ChevronRight } from 'lucide-react';
import './AuthPages.css';
import logo from '../../assets/images/logoforsa.jpeg';
import authService from '../../services/authService';
import Toast from '../../components/common/Toast';
import useToast from '../../components/hooks/useToast';

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  const [form, setForm]       = useState({ email: '', password: '', role: 'student' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    try {
      const data = await authService.login(form.email, form.password);
      const actualRole = data.user?.role || data.role;

      if (actualRole !== form.role) {
        authService.logout();
        const msg = `This account is registered as "${actualRole}". Please select the correct role.`;
        setError(msg);
        showToast(msg, 'error');
        return;
      }

      showToast('Welcome back! Redirecting to your dashboard…', 'success');

      setTimeout(() => {
        if (actualRole === 'student')      navigate('/student/dashboard');
        else if (actualRole === 'company') navigate('/company/dashboard');
        else if (actualRole === 'admin')   navigate('/admin/dashboard');
        else setError('Unknown role. Please contact support.');
      }, 1200);

    } catch (err) {
      const msg = err.message || 'Login failed. Please try again.';
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
            <h2 className="auth-left-title">Welcome Back!</h2>
            <p className="auth-left-sub">
              Sign in and pick up right where you left off — your next opportunity is waiting.
            </p>
          </div>
          <div className="auth-left-steps">
            <div className="auth-step"><ChevronRight size={16}/><span>Access your personalized dashboard</span></div>
            <div className="auth-step"><ChevronRight size={16}/><span>Track your applications in real time</span></div>
            <div className="auth-step"><ChevronRight size={16}/><span>Connect with top companies</span></div>
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-card-icon"><LogIn size={22} strokeWidth={2.5}/></div>
            <div>
              <h2 className="auth-title">Sign In</h2>
              <p className="auth-sub">Enter your credentials to continue</p>
            </div>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Login As</label>
              <div className="input-wrapper">
                <UserCircle2 size={17} className="input-icon"/>
                <select name="role" value={form.role} onChange={handleChange} className="form-input">
                  <option value="student">Student</option>
                  <option value="company">Company</option>
                  <option value="admin">Admin</option>
                </select>
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
                <input type="password" name="password" placeholder="Enter your password"
                  value={form.password} onChange={handleChange} className="form-input"/>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Signing in…' : <><LogIn size={18}/> Sign In</>}
            </button>
          </form>

          <div className="auth-divider"><span>New to Forsa?</span></div>

          <div className="auth-links-row">
            <button className="auth-link" onClick={() => navigate('/register/student')}>Register as Student</button>
            <span className="auth-links-sep">·</span>
            <button className="auth-link" onClick={() => navigate('/register/company')}>Register as Company</button>
          </div>

          <button className="back-home-btn" onClick={() => navigate('/')}>← Back to Home</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

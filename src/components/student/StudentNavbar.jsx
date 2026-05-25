import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Bookmark, ChevronDown, LogOut, User, Briefcase, LayoutDashboard, FileText } from 'lucide-react';
import logoForsa from "../../../src/assets/images/logoforsa.jpeg";
import './StudentNavbar.css';

const NAV_LINKS = [
  { label: 'Home',            path: '/student/dashboard',    icon: <LayoutDashboard size={16} /> },
  { label: 'Jobs',            path: '/student/jobs',         icon: <Briefcase size={16} />       },
  { label: 'My Applications', path: '/student/applications', icon: <FileText size={16} />        },
  { label: 'Profile',         path: '/student/profile',      icon: <User size={16} />            },
];

const StudentNavbar = ({
  studentName = 'Ahmed',
  avatarUrl   = null,

}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('.sn__user-menu') && !e.target.closest('.sn__saved-wrap')) {
        setDropdownOpen(false);

      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <nav className={`sn ${scrolled ? 'sn--scrolled' : ''}`}>
      <div className="sn__inner">

        {/* ── Logo ── */}
        <button
          className="sn__brand"
          onClick={() => navigate('/student/dashboard')}
        >
          <img
            src={logoForsa}
            alt="Forsa Logo"
            className="sn__logo-image"
          />
        </button>

        {/* ── Desktop Links ── */}
        <div className="sn__links">
          {NAV_LINKS.map(({ label, path, icon }) => (
            <button
              key={path}
              className={`sn__link ${isActive(path) ? 'sn__link--active' : ''}`}
              onClick={() => navigate(path)}
            >
              {icon}
              {label}
              {isActive(path) && <span className="sn__link-dot" />}
            </button>
          ))}
        </div>

        {/* ── Right Side ── */}
        <div className="sn__right">

          {/* User Menu */}
          <div className="sn__user-menu">
            <button
              className="sn__user-btn"
              onClick={() => { setDropdownOpen(o => !o); }}
            >
              <div className="sn__avatar">
                {avatarUrl
                  ? <img src={avatarUrl} alt={studentName} />
                  : <span>{studentName.charAt(0).toUpperCase()}</span>
                }
              </div>
              <span className="sn__username">{studentName}</span>
              <ChevronDown
                size={14}
                className={`sn__chevron ${dropdownOpen ? 'sn__chevron--open' : ''}`}
              />
            </button>

            {dropdownOpen && (
              <div className="sn__dropdown">
                <button
                  className="sn__dropdown-item"
                  onClick={() => { setDropdownOpen(false); navigate('/student/profile'); }}
                >
                  <User size={15} /> My Profile
                </button>
                <button
                  className="sn__dropdown-item"
                  onClick={() => { setDropdownOpen(false); navigate('/student/applications'); }}
                >
                  <FileText size={15} /> My Applications
                </button>
                <div className="sn__dropdown-divider" />
                <button
                  className="sn__dropdown-item sn__dropdown-item--danger"
                  onClick={handleLogout}
                >
                  <LogOut size={15} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Hamburger ── */}
        <button
          className="sn__hamburger"
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      <div className={`sn__mobile ${mobileOpen ? 'sn__mobile--open' : ''}`}>
        {NAV_LINKS.map(({ label, path, icon }) => (
          <button
            key={path}
            className={`sn__mobile-link ${isActive(path) ? 'sn__mobile-link--active' : ''}`}
            onClick={() => { setMobileOpen(false); navigate(path); }}
          >
            {icon} {label}
          </button>
        ))}
       
        <button className="sn__mobile-logout" onClick={handleLogout}>
          <LogOut size={15} /> Logout
        </button>
      </div>
    </nav>
  );
};

export default StudentNavbar;

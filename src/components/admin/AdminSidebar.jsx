import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  LogOut,
  Menu,
  X,
  ChevronRight,
  MessageSquare,
  Settings,
} from 'lucide-react';
import logoForsa from '../../assets/images/logoforsa.jpeg';
import './AdminSidebar.css';

const NAV_ITEMS = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users',     icon: Users,           label: 'Manage Users' },
  { to: '/admin/companies', icon: Building2,        label: 'Manage Companies' },
  { to: '/admin/jobs',      icon: Briefcase,        label: 'Manage Jobs' },
  { to: '/admin/messages',  icon: MessageSquare,    label: 'Messages' },
  { to: '/admin/settings',  icon: Settings,         label: 'Settings' },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Lock body scroll when sidebar open on mobile */
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  /* Close sidebar on resize to desktop */
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth > 768) setMobileOpen(false);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('forsa_token');
    localStorage.removeItem('forsa_role');
    navigate('/login');
  };

  const close = () => setMobileOpen(false);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="sidebar-hamburger"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Backdrop overlay */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={close} aria-hidden="true" />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar${mobileOpen ? ' mobile-open' : ''}`}>

        {/* Logo */}
        <div className="sidebar-logo">
          <img
            src={logoForsa}
            alt="Forsa Logo"
            className="logo-image"
          />
          <div className="logo-text">
            <span className="logo-name">Forsa</span>
            <span className="logo-badge">Admin</span>
          </div>
          <button
            className="sidebar-close-btn"
            onClick={close}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <p className="nav-section-label">Main Menu</p>
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              onClick={close}
            >
              <span className="nav-icon-wrap">
                <Icon size={18} strokeWidth={2} />
              </span>
              <span className="nav-label">{label}</span>
              <ChevronRight size={14} className="nav-arrow" />
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-divider" />
          <button className="sidebar-logout" onClick={handleLogout}>
            <span className="logout-icon-wrap">
              <LogOut size={17} strokeWidth={2} />
            </span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
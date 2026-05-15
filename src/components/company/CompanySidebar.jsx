import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import logoForsa from '../../assets/images/logoforsa.jpeg';
import './CompanySidebar.css';

const NAV_ITEMS = [
  { to: '/company/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/company/post-job',  icon: PlusCircle,      label: 'Post a Job' },
  { to: '/company/my-jobs',   icon: Briefcase,       label: 'My Jobs'    },
  { to: '/company/settings',  icon: Settings,        label: 'Settings'   },
];

const CompanySidebar = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('forsa_token');
    localStorage.removeItem('forsa_role');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile toggle button — only visible on small screens */}
      <button
        className="sidebar-mobile-toggle"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`company-sidebar ${mobileOpen ? 'company-sidebar--open' : ''}`}>

        {/* Logo */}
        <div className="sidebar-logo">
          <img
            src={logoForsa}
            alt="Forsa Logo"
            className="logo-image"
          />

          <div className="logo-text">
            <span className="logo-name">Company</span>
            <span className="logo-badge">Pages</span>
          </div>

          <button
            className="sidebar-close-btn"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `nav-item${isActive ? ' nav-item--active' : ''}`
              }
            >
              <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <button className="sidebar-logout" onClick={handleLogout}>
          <LogOut size={17} strokeWidth={1.8} aria-hidden="true" />
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
};

export default CompanySidebar;
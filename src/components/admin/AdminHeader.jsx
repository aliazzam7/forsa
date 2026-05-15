import React from 'react';
import { Bell, Search } from 'lucide-react';
import './AdminHeader.css';

const AdminHeader = ({ title, subtitle }) => {
  return (
    <header className="admin-header">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
        {subtitle && <p className="header-subtitle">{subtitle}</p>}
      </div>

      <div className="header-right">
        {/* Search bar */}
        <div className="header-search">
          <Search size={15} className="search-icon" />
          <input type="text" placeholder="Search..." className="search-input" />
        </div>

        {/* Notification bell */}
        <button className="header-icon-btn" aria-label="Notifications">
          <Bell size={18} strokeWidth={2} />
          <span className="notif-dot" />
        </button>

        {/* Admin badge */}
        <div className="header-admin-badge">
          <div className="admin-avatar">A</div>
          <div className="admin-info">
            <span className="admin-name">Super Admin</span>
            <span className="admin-role">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
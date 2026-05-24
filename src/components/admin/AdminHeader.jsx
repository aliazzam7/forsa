import React from 'react';
import { Bell, Search } from 'lucide-react';
import './AdminHeader.css';

const API_BASE = 'http://localhost/forsa-platform-backend';

const AdminHeader = ({ title, subtitle, adminName, adminAvatar }) => {
  const initial = adminName ? adminName.charAt(0).toUpperCase() : 'A';

  const avatarUrl = adminAvatar
    ? adminAvatar.startsWith('http')
      ? adminAvatar                         
      : `${API_BASE}/${adminAvatar}`         
    : null;

  return (
    <header className="admin-header">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
        {subtitle && <p className="header-subtitle">{subtitle}</p>}
      </div>

      <div className="header-right">
        {/* Search bar */}
        {/* <div className="header-search">
          <Search size={15} className="search-icon" />
          <input type="text" placeholder="Search..." className="search-input" />
        </div> */}

        {/* Notification bell */}
        {/* <button className="header-icon-btn" aria-label="Notifications">
          <Bell size={18} strokeWidth={2} />
          <span className="notif-dot" />
        </button> */}

        {/* Admin badge */}
        <div className="header-admin-badge">
          <div className="admin-avatar">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={adminName || 'Admin'}
                onError={(e) => {
                 
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            {/* Fallback initial */}
            <span
              className="avatar-initial"
              style={{ display: avatarUrl ? 'none' : 'flex' }}
            >
              {initial}
            </span>
          </div>

          <div className="admin-info">
            <span className="admin-name">{adminName || 'Admin'}</span>
            <span className="admin-role">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

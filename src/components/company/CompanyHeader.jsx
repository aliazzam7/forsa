// src/components/company/CompanyHeader.jsx
import React, { useState } from 'react';
import useCompanyProfile from '../hooks/useCompanyProfile';
import './CompanyHeader.css';

const API_BASE = 'http://localhost/forsa-platform-backend';

const CompanyHeader = ({ title, subtitle }) => {
  const { name, logo } = useCompanyProfile();
  const [imgError, setImgError] = useState(false);

  const companyName = name || 'Your Company';
  const initial = companyName.charAt(0).toUpperCase();

  const logoUrl = logo
    ? logo.startsWith('http')
      ? logo
      : `${API_BASE}/${logo}`
    : null;

  return (
    <header className="company-header">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
        {subtitle && <p className="header-subtitle">{subtitle}</p>}
      </div>

      <div className="header-right">
        <div className="company-badge">

          <div className="company-avatar" aria-hidden="true">
            {logoUrl && !imgError ? (
              <img
                src={logoUrl}
                alt={companyName}
                onError={() => setImgError(true)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 'inherit',
                  display: 'block',
                }}
              />
            ) : (
              <span className="avatar-initial">{initial}</span>
            )}
          </div>

          <div className="company-info">
            <span className="company-name">{companyName}</span>
            <span className="company-role">Company Account</span>
          </div>

        </div>
      </div>
    </header>
  );
};

export default CompanyHeader;
import React from 'react';
import { Building2 } from 'lucide-react';
import './CompanyHeader.css';

const CompanyHeader = ({ title, subtitle }) => {
  const companyName = localStorage.getItem('forsa_company_name') || 'Your Company';
  const initial = companyName.charAt(0).toUpperCase();

  return (
    <header className="company-header">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
        {subtitle && <p className="header-subtitle">{subtitle}</p>}
      </div>

      <div className="header-right">
        <div className="company-badge">
          <div className="company-avatar" aria-hidden="true">{initial}</div>
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
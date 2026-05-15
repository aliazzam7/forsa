import React from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import './ApplicationStatusBadge.css';

const STATUS_CONFIG = {
  pending:  { label: 'Pending',  icon: <Clock size={13} />,        cls: 'asb--pending'  },
  accepted: { label: 'Accepted', icon: <CheckCircle size={13} />,  cls: 'asb--accepted' },
  rejected: { label: 'Rejected', icon: <XCircle size={13} />,      cls: 'asb--rejected' },
  removed:  { label: 'Job Removed', icon: <AlertCircle size={13} />, cls: 'asb--removed' },
};

const ApplicationStatusBadge = ({ status = 'pending', size = 'md' }) => {
  const cfg = STATUS_CONFIG[status.toLowerCase()] || STATUS_CONFIG.pending;
  return (
    <span className={`asb ${cfg.cls} asb--${size}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
};

export default ApplicationStatusBadge;
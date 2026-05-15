import React from 'react';
import { FileText, Check, X } from 'lucide-react';
import './ApplicantCard.css';

const STATUS_CHIP = {
  pending:  'orange',
  accepted: 'green',
  rejected: 'red',
};

const ApplicantCard = ({ applicant, onAccept, onReject }) => {
  const status = applicant.status || 'pending';
  const chipColor = STATUS_CHIP[status] || 'orange';

  return (
    <div className={`applicant-card applicant-card--${status}`}>
      {/* ── Header ── */}
      <div className="ac-header">
        <div className="ac-avatar" aria-hidden="true">
          {applicant.name ? applicant.name.charAt(0).toUpperCase() : 'S'}
        </div>

        <div className="ac-info">
          <h3 className="ac-name">{applicant.name}</h3>
          <p className="ac-email">{applicant.email}</p>
        </div>

        <span className={`ac-chip ac-chip--${chipColor}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      {/* ── Skills ── */}
      {applicant.skills?.length > 0 && (
        <div className="ac-skills">
          {applicant.skills.map((skill, i) => (
            <span key={i} className="ac-skill-tag">{skill}</span>
          ))}
        </div>
      )}

      {/* ── Footer ── */}
      <div className="ac-footer">
        {applicant.cvUrl && (
          <a
            href={applicant.cvUrl}
            target="_blank"
            rel="noreferrer"
            className="ac-btn ac-btn--cv"
          >
            <FileText size={14} strokeWidth={2} aria-hidden="true" />
            View CV
          </a>
        )}

        {status === 'pending' && (
          <div className="ac-decision-btns">
            <button
              className="ac-btn ac-btn--accept"
              onClick={() => onAccept && onAccept(applicant._id ?? applicant.id)}
            >
              <Check size={14} strokeWidth={2.5} aria-hidden="true" />
              Accept
            </button>
            <button
              className="ac-btn ac-btn--reject"
              onClick={() => onReject && onReject(applicant._id ?? applicant.id)}
            >
              <X size={14} strokeWidth={2.5} aria-hidden="true" />
              Reject
            </button>
          </div>
        )}

        {status !== 'pending' && (
          <p className="ac-decision-done">
            {status === 'accepted'
              ? <><Check size={13} strokeWidth={2.5} /> Accepted — notification sent</>
              : <><X    size={13} strokeWidth={2.5} /> Rejected — notification sent</>
            }
          </p>
        )}
      </div>
    </div>
  );
};

export default ApplicantCard;
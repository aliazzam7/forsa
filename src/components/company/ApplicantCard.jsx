import React, { useState } from 'react';
import { FileText, Check, X, User, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { BASE_URL } from '../../services/api';
import './ApplicantCard.css';

/* ── helpers ── */
const STATUS_CHIP = { pending: 'orange', accepted: 'green', rejected: 'red' };

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day:   'numeric',
      month: 'short',
      year:  'numeric',
    });
  } catch {
    return null;
  }
};

const ApplicantCard = ({ applicant, onAccept, onReject }) => {
  const [showCover, setShowCover] = useState(false);

  const status    = applicant.status || 'pending';
  const chipColor = STATUS_CHIP[status] || 'orange';
  const dateLabel = formatDate(applicant.appliedAt);

  /* Build full CV URL when it's a relative path */
  const cvUrl = applicant.cvUrl
    ? applicant.cvUrl.startsWith('http')
      ? applicant.cvUrl
      : `${BASE_URL}/../${applicant.cvUrl}`
    : null;

  const handleAccept = () => onAccept && onAccept(applicant.id ?? applicant._id);
  const handleReject = () => onReject && onReject(applicant.id ?? applicant._id);

  const handleViewProfile = () => {
    if (applicant.profileUrl) {
      window.open(applicant.profileUrl, '_blank', 'noreferrer');
    }
  };

  return (
    <div className={`applicant-card applicant-card--${status}`}>

      {/* ── Header ── */}
      <div className="ac-header">
        <div className="ac-avatar" aria-hidden="true">
          {applicant.name ? applicant.name.charAt(0).toUpperCase() : '?'}
        </div>
        <div className="ac-info">
          <h3 className="ac-name">{applicant.name}</h3>
          <p className="ac-email">{applicant.email}</p>
          {dateLabel && (
            <p className="ac-date">
              <Calendar size={11} strokeWidth={2} aria-hidden="true" />
              Applied {dateLabel}
            </p>
          )}
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

      {/* ── Cover letter (collapsible) ── */}
      {applicant.coverLetter && (
        <div className="ac-cover">
          <button
            className="ac-cover-toggle"
            onClick={() => setShowCover(v => !v)}
            aria-expanded={showCover}
          >
            {showCover
              ? <><ChevronUp size={13} strokeWidth={2} aria-hidden="true" /> Hide cover letter</>
              : <><ChevronDown size={13} strokeWidth={2} aria-hidden="true" /> Read cover letter</>
            }
          </button>
          {showCover && (
            <p className="ac-cover-text">{applicant.coverLetter}</p>
          )}
        </div>
      )}

      {/* ── Footer ── */}
      <div className="ac-footer">
        {/* CV link */}
        {cvUrl && (
          <a href={cvUrl} target="_blank" rel="noreferrer" className="ac-btn ac-btn--cv">
            <FileText size={14} strokeWidth={2} aria-hidden="true" />
            View CV
          </a>
        )}

        {/* Profile link */}
        {applicant.profileUrl && (
          <button className="ac-btn ac-btn--profile" onClick={handleViewProfile}>
            <User size={14} strokeWidth={2} aria-hidden="true" />
            Profile
          </button>
        )}

        {/* Accept / Reject (pending only) */}
        {status === 'pending' && (
          <div className="ac-decision-btns">
            <button className="ac-btn ac-btn--accept" onClick={handleAccept}>
              <Check size={14} strokeWidth={2.5} aria-hidden="true" />
              Accept
            </button>
            <button className="ac-btn ac-btn--reject" onClick={handleReject}>
              <X size={14} strokeWidth={2.5} aria-hidden="true" />
              Reject
            </button>
          </div>
        )}

        {/* Final decision label */}
        {status !== 'pending' && (
          <p className="ac-decision-done">
            {status === 'accepted'
              ? <><Check size={13} strokeWidth={2.5} aria-hidden="true" /> Accepted — notification sent</>
              : <><X    size={13} strokeWidth={2.5} aria-hidden="true" /> Rejected — notification sent</>
            }
          </p>
        )}
      </div>

    </div>
  );
};

export default ApplicantCard;

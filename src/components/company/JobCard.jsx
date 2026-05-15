import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Pencil, Trash2, Globe, Building2 } from 'lucide-react';
import './JobCard.css';

const TYPE_COLORS = {
  'Full-time':  'blue',
  'Part-time':  'orange',
  'Internship': 'green',
};

const JobCard = ({ job, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const typeColor = TYPE_COLORS[job.type] || 'blue';

  return (
    <div className="job-card">
      {/* ── Header ── */}
      <div className="job-card__header">
        <div className="job-card__title-row">
          <h3 className="job-card__title">{job.title}</h3>
          <span className={`jc-badge jc-badge--${typeColor}`}>{job.type}</span>
        </div>

        <div className="job-card__tags">
          <span className={`jc-badge ${job.mode === 'Remote' ? 'jc-badge--purple' : 'jc-badge--gray'}`}>
            {job.mode === 'Remote'
              ? <Globe size={11} strokeWidth={2} aria-hidden="true" />
              : <Building2 size={11} strokeWidth={2} aria-hidden="true" />
            }
            {job.mode}
          </span>

          {job.skills && job.skills.slice(0, 3).map((skill, i) => (
            <span key={i} className="jc-badge jc-badge--skill">{skill}</span>
          ))}
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="job-card__stats">
        <div className="jc-stat">
          <span className="jc-stat__value">{job.applicantsCount ?? 0}</span>
          <span className="jc-stat__label">Applicants</span>
        </div>
        <div className="jc-stat-divider" />
        <div className="jc-stat">
          <span className="jc-stat__value">
            {job.postedAt
              ? new Date(job.postedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
              : 'N/A'}
          </span>
          <span className="jc-stat__label">Posted</span>
        </div>
        <div className="jc-stat-divider" />
        <div className="jc-stat">
          <span className={`jc-stat__value jc-stat__value--${job.status ?? 'active'}`}>
            {job.status === 'closed' ? 'Closed' : 'Active'}
          </span>
          <span className="jc-stat__label">Status</span>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="job-card__actions">
        <button
          className="jc-btn jc-btn--primary"
          onClick={() => navigate(`/company/applicants/${job._id ?? job.id}`)}
        >
          <Users size={15} strokeWidth={2} aria-hidden="true" />
          View Applicants
        </button>

        <button
          className="jc-btn jc-btn--secondary"
          onClick={() => onEdit && onEdit(job)}
          aria-label="Edit job"
        >
          <Pencil size={14} strokeWidth={2} aria-hidden="true" />
          Edit
        </button>

        <button
          className="jc-btn jc-btn--danger"
          onClick={() => onDelete && onDelete(job._id ?? job.id)}
          aria-label="Delete job"
        >
          <Trash2 size={15} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default JobCard;
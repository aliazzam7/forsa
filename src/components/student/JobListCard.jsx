import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Briefcase, ArrowRight } from 'lucide-react';
import { BASE_URL } from '../../services/api';
import './JobListCard.css';

const TYPE_COLORS = {
  'Full-time':  { bg: '#e8f0ff', color: '#2A3F8F' },
  'Part-time':  { bg: '#fff4e0', color: '#c47d00' },
  'Internship': { bg: '#e6f9f1', color: '#1a8a5a' },
};

const MODE_COLORS = {
  'Remote':  { bg: '#f0fdf4', color: '#15803d' },
  'Onsite':  { bg: '#fef3f2', color: '#b91c1c' },
  'Hybrid':  { bg: '#faf5ff', color: '#7e22ce' },
};

const JobListCard = ({
  id,
  title       = 'Frontend Developer',
  company     = 'TechCorp',
  companyLogo = null,
  location    = 'Beirut, Lebanon',
  type        = 'Full-time',
  mode        = 'Remote',
  field       = 'Frontend',
  skills      = ['React', 'CSS', 'TypeScript'],
  deadline    = '2025-08-30',
  postedAgo   = '2 days ago',
  onViewAll,
}) => {
  const navigate = useNavigate();

  const typeStyle = TYPE_COLORS[type] || { bg: '#f0f0f0', color: '#333' };
  const modeStyle = MODE_COLORS[mode] || { bg: '#f0f0f0', color: '#333' };

  const formattedDeadline = deadline
    ? new Date(deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  const logoSrc = companyLogo
    ? (companyLogo.startsWith('http') ? companyLogo : `${BASE_URL.replace('/api', '')}/${companyLogo}`)
    : null;

  return (
    <div className="jlc">
      {/* Top Row */}
      <div className="jlc__top">
        <div className="jlc__logo">
          {logoSrc
            ? <img src={logoSrc} alt={company} />
            : <span>{company.charAt(0)}</span>}
        </div>
        <div className="jlc__meta">
          <h3 className="jlc__title">{title}</h3>
          <p className="jlc__company">{company}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="jlc__tags">
        <span className="jlc__tag" style={{ background: typeStyle.bg, color: typeStyle.color }}>
          <Briefcase size={11} /> {type}
        </span>
        <span className="jlc__tag" style={{ background: modeStyle.bg, color: modeStyle.color }}>
          <MapPin size={11} /> {mode}
        </span>
        {field && (
          <span className="jlc__tag jlc__tag--field">{field}</span>
        )}
      </div>

      {/* Location & Posted */}
      <div className="jlc__info-row">
        <span className="jlc__info"><MapPin size={12} /> {location}</span>
      </div>

      {/* Skills */}
      <div className="jlc__skills">
        {skills.slice(0, 4).map(s => (
          <span key={s} className="jlc__skill">{s}</span>
        ))}
        {skills.length > 4 && <span className="jlc__skill jlc__skill--more">+{skills.length - 4}</span>}
      </div>

      {/* Deadline */}
      {formattedDeadline && (
        <p className="jlc__deadline">Deadline: <strong>{formattedDeadline}</strong></p>
      )}

      {/* Action Buttons */}
      <div className="jlc__actions">
        <button
          className="jlc__btn jlc__btn--secondary"
          onClick={() => onViewAll ? onViewAll() : navigate('/student/jobs')}
        >
          View All Jobs
        </button>
        <button
          className="jlc__btn jlc__btn--primary"
          onClick={() => navigate(`/student/jobs/${id}`)}
        >
          View Details <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default JobListCard;

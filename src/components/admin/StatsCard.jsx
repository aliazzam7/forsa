import React from 'react';
import './StatsCard.css';

const StatsCard = ({ title, value, icon: Icon, color, change }) => {
  const isPositive = change > 0;

  return (
    <div className={`stats-card stats-card--${color}`}>
      <div className="stats-card__top">
        <div className="stats-card__icon-wrap">
          {Icon && <Icon size={22} strokeWidth={1.8} />}
        </div>
        {change !== undefined && (
          <span className={`stats-card__change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '↑' : '↓'} {Math.abs(change)}%
          </span>
        )}
      </div>

      <div className="stats-card__body">
        <h2 className="stats-card__value">{value}</h2>
        <p className="stats-card__title">{title}</p>
      </div>

      {change !== undefined && (
        <p className="stats-card__footer">
          {isPositive ? 'Up' : 'Down'} from last month
        </p>
      )}
    </div>
  );
};

export default StatsCard;

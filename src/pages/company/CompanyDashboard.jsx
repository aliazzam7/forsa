import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import {
  Briefcase, Users, Clock, CheckCircle,
  TrendingUp, ArrowRight, PlusCircle,
} from 'lucide-react';
import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyHeader  from '../../components/company/CompanyHeader';
import './CompanyDashboard.css';

/* ─── chart data ─── */
const CHART_DATA = [
  { month: 'Dec', jobs: 3,  apps: 22 },
  { month: 'Jan', jobs: 5,  apps: 48 },
  { month: 'Feb', jobs: 4,  apps: 35 },
  { month: 'Mar', jobs: 6,  apps: 61 },
  { month: 'Apr', jobs: 8,  apps: 75 },
  { month: 'May', jobs: 7,  apps: 43 },
];

/* ─── custom tooltip ─── */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="chart-tooltip__item">
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

const STATUS_CHIP_COLOR = { pending: 'orange', accepted: 'green', rejected: 'red' };

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalJobs: 0, totalApplicants: 0, pending: 0, accepted: 0,
  });
  const [recentApplicants, setRecentApplicants] = useState([]);

  useEffect(() => {
    // TODO: replace with real API calls
    setStats({ totalJobs: 12, totalApplicants: 248, pending: 52, accepted: 38 });
    setRecentApplicants([
      { id: 1, name: 'Ali Hassan',    role: 'Frontend Developer', status: 'pending',  time: '10 min ago' },
      { id: 2, name: 'Sara Khalil',   role: 'UI/UX Designer',      status: 'accepted', time: '1 hr ago'   },
      { id: 3, name: 'Omar Khalil',   role: 'Backend Engineer',    status: 'pending',  time: '3 hr ago'   },
      { id: 4, name: 'Lara Nasser',   role: 'Data Analyst',        status: 'rejected', time: 'Yesterday'  },
    ]);
  }, []);

  const STAT_CARDS = [
    {
      label: 'Active Jobs',
      value: stats.totalJobs,
      icon: Briefcase,
      color: 'blue',
      trend: '+3 this month',
    },
    {
      label: 'Total Applicants',
      value: stats.totalApplicants,
      icon: Users,
      color: 'amber',
      trend: '+41 this week',
    },
    {
      label: 'Accepted',
      value: stats.accepted,
      icon: CheckCircle,
      color: 'green',
      trend: `${((stats.accepted / stats.totalApplicants) * 100).toFixed(1)}% rate`,
    },
    {
      label: 'Pending Review',
      value: stats.pending,
      icon: Clock,
      color: 'purple',
      trend: 'Needs attention',
    },
  ];

  return (
    <div className="company-layout">
      <CompanySidebar />
      <div className="company-main">
        <CompanyHeader
          title="Dashboard"
          subtitle="Here's an overview of your hiring activity"
        />

        <div className="company-content">

          {/* ── Stat cards ── */}
          <div className="stats-grid">
            {STAT_CARDS.map(({ label, value, icon: Icon, color, trend }) => (
              <div key={label} className={`stat-card stat-card--${color}`}>
                <div className="stat-card__icon">
                  <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                </div>
                <div className="stat-card__body">
                  <p className="stat-card__label">{label}</p>
                  <h2 className="stat-card__value">{value}</h2>
                  <p className="stat-card__trend">
                    <TrendingUp size={11} aria-hidden="true" /> {trend}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Charts ── */}
          <div className="charts-grid">
            {/* Bar chart */}
            <div className="chart-card">
              <div className="chart-card__head">
                <p className="chart-card__title">Jobs vs Applications</p>
                <p className="chart-card__sub">Monthly comparison — last 6 months</p>
              </div>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={CHART_DATA} barGap={4} barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f3fa" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7A99' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#6B7A99' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                  <Bar dataKey="jobs" name="Jobs posted"   fill="#1B2D6B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="apps" name="Applications"  fill="#F5A623" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Line chart */}
            <div className="chart-card">
              <div className="chart-card__head">
                <p className="chart-card__title">Application activity</p>
                <p className="chart-card__sub">Applications received over time</p>
              </div>
              <ResponsiveContainer width="100%" height={210}>
                <LineChart data={CHART_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f3fa" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7A99' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#6B7A99' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                  <Line
                    type="monotone"
                    dataKey="apps"
                    name="Applications"
                    stroke="#1B2D6B"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#1B2D6B', strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Bottom grid: recent applicants + quick actions ── */}
          <div className="dashboard-bottom">

            {/* Recent applicants */}
            <div className="dash-box">
              <div className="dash-box__head">
                <h2 className="dash-box__title">Recent Applicants</h2>
                <button
                  className="dash-link-btn"
                  onClick={() => navigate('/company/my-jobs')}
                >
                  View all <ArrowRight size={13} aria-hidden="true" />
                </button>
              </div>

              <div className="applicant-list">
                {recentApplicants.map(a => (
                  <div key={a.id} className="applicant-row">
                    <div className="applicant-row__avatar" aria-hidden="true">
                      {a.name.charAt(0)}
                    </div>
                    <div className="applicant-row__info">
                      <span className="applicant-row__name">{a.name}</span>
                      <span className="applicant-row__role">{a.role}</span>
                    </div>
                    <div className="applicant-row__right">
                      <span className={`chip chip--${STATUS_CHIP_COLOR[a.status]}`}>
                        {a.status}
                      </span>
                      <span className="applicant-row__time">{a.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions + progress */}
            <div className="dash-box">
              <h2 className="dash-box__title">Quick Actions</h2>
              <div className="quick-actions">
                <button
                  className="quick-action-btn quick-action-btn--primary"
                  onClick={() => navigate('/company/post-job')}
                >
                  <PlusCircle size={17} strokeWidth={2} aria-hidden="true" />
                  Post a New Job
                </button>
                <button
                  className="quick-action-btn"
                  onClick={() => navigate('/company/my-jobs')}
                >
                  <Briefcase size={17} strokeWidth={2} aria-hidden="true" />
                  View My Jobs
                </button>
              </div>

              {/* Application progress */}
              <div className="progress-section">
                <p className="progress-section__title">Application breakdown</p>
                {[
                  { label: 'Pending',  value: stats.pending,                                               color: '#F5A623' },
                  { label: 'Accepted', value: stats.accepted,                                              color: '#16a34a' },
                  { label: 'Rejected', value: stats.totalApplicants - stats.pending - stats.accepted,      color: '#dc2626' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="progress-row">
                    <span className="progress-row__label">{label}</span>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: stats.totalApplicants
                            ? `${(value / stats.totalApplicants) * 100}%`
                            : '0%',
                          background: color,
                        }}
                      />
                    </div>
                    <span className="progress-row__num">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>{/* .company-content */}
      </div>
    </div>
  );
};

export default CompanyDashboard;
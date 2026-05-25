import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import {
  Briefcase, Users, Clock, CheckCircle,
  TrendingUp, ArrowRight, PlusCircle, Loader2,
} from 'lucide-react';
import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyHeader  from '../../components/company/CompanyHeader';
import companyService from '../../services/companyService';
import './CompanyDashboard.css';

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

  const [stats,            setStats]            = useState({
    total_jobs: 0, total_applicants: 0, accepted: 0, pending: 0, rejected: 0,
  });
  const [recentApplicants, setRecentApplicants] = useState([]);
  const [chartData,        setChartData]        = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [apiError,         setApiError]         = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await companyService.getDashboard();
        setStats(data.stats ?? {
          total_jobs: 0, total_applicants: 0, accepted: 0, pending: 0, rejected: 0,
        });

        setRecentApplicants(data.recent_applicants ?? []);

        setChartData(data.chart_data ?? []);

      } catch (err) {
        setApiError('Failed to load dashboard: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const STAT_CARDS = [
    {
      label: 'Active Jobs',
      value: stats.total_jobs,
      icon:  Briefcase,
      color: 'blue',
      trend: 'Total posted',
    },
    {
      label: 'Total Applicants',
      value: stats.total_applicants,
      icon:  Users,
      color: 'amber',
      trend: 'All applications',
    },
    {
      label: 'Accepted',
      value: stats.accepted,
      icon:  CheckCircle,
      color: 'green',
      trend: stats.total_applicants
        ? `${((stats.accepted / stats.total_applicants) * 100).toFixed(1)}% rate`
        : '0% rate',
    },
    {
      label: 'Pending Review',
      value: stats.pending,
      icon:  Clock,
      color: 'purple',
      trend: 'Needs attention',
    },
  ];

  if (loading) {
    return (
      <div className="company-layout">
        <CompanySidebar />
        <div className="company-main">
          <CompanyHeader
  title="Company Dashboard"
  subtitle="Welcome back"
/>
          <div className="company-content content-center">
            <Loader2 size={32} className="spin" color="#1B2D6B" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="company-layout">
      <CompanySidebar />
      <div className="company-main">
        <CompanyHeader
          title="Dashboard"
          subtitle="Here's an overview of your hiring activity"
        />

        <div className="company-content">

          {apiError && (
            <div className="api-error-banner">
              {apiError}
              <button onClick={() => setApiError('')}>✕</button>
            </div>
          )}

          {/* ── Stat cards ── */}
          <div className="stats-grid">
            {STAT_CARDS.map(({ label, value, icon: Icon, color, trend }) => (
              <div key={label} className={`stat-card stat-card--${color}`}>
                <div className="stat-card__icon">
                  <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                </div>
                <div className="stat-card__body">
                  <p className="stat-card__label">{label}</p>
                  <h2 className="stat-card__value">{value ?? 0}</h2>
                  <p className="stat-card__trend">
                    <TrendingUp size={11} aria-hidden="true" /> {trend}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Charts (only if we have data) ── */}
          {chartData.length > 0 && (
            <div className="charts-grid">
              <div className="chart-card">
                <div className="chart-card__head">
                  <p className="chart-card__title">Jobs vs Applications</p>
                  <p className="chart-card__sub">Monthly comparison — last 6 months</p>
                </div>
                <ResponsiveContainer width="100%" height={210}>
                  <BarChart data={chartData} barGap={4} barSize={14}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f3fa" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7A99' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#6B7A99' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                    <Bar dataKey="jobs" name="Jobs posted"  fill="#1B2D6B" radius={[4,4,0,0]} />
                    <Bar dataKey="apps" name="Applications" fill="#F5A623" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <div className="chart-card__head">
                  <p className="chart-card__title">Application activity</p>
                  <p className="chart-card__sub">Applications received over time</p>
                </div>
                <ResponsiveContainer width="100%" height={210}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f3fa" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7A99' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#6B7A99' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                    <Line
                      type="monotone" dataKey="apps" name="Applications"
                      stroke="#1B2D6B" strokeWidth={2.5}
                      dot={{ r: 4, fill: '#1B2D6B', strokeWidth: 0 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* ── Bottom grid ── */}
          <div className="dashboard-bottom">

            {/* Recent applicants */}
            <div className="dash-box">
              <div className="dash-box__head">
                <h2 className="dash-box__title">Recent Applicants</h2>
                <button className="dash-link-btn" onClick={() => navigate('/company/my-jobs')}>
                  View all <ArrowRight size={13} aria-hidden="true" />
                </button>
              </div>

              {recentApplicants.length === 0 ? (
                <p className="empty-msg">No applicants yet.</p>
              ) : (
                <div className="applicant-list">
                  {recentApplicants.map(a => (
                    <div key={a.id} className="applicant-row">
                      <div className="applicant-row__avatar" aria-hidden="true">
                        {(a.student_name ?? '?').charAt(0).toUpperCase()}
                      </div>
                      <div className="applicant-row__info">
                        <span className="applicant-row__name">{a.student_name}</span>
                        <span className="applicant-row__role">{a.job_title}</span>
                      </div>
                      <div className="applicant-row__right">
                        <span className={`chip chip--${STATUS_CHIP_COLOR[a.status] ?? 'orange'}`}>
                          {a.status}
                        </span>
                        <span className="applicant-row__time">
                          {a.applied_at
                            ? new Date(a.applied_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                            : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

              {/* Application breakdown */}
              <div className="progress-section">
                <p className="progress-section__title">Application breakdown</p>
                {[
                  { label: 'Pending',  value: stats.pending,  color: '#F5A623' },
                  { label: 'Accepted', value: stats.accepted, color: '#16a34a' },
                  { label: 'Rejected', value: stats.rejected, color: '#dc2626' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="progress-row">
                    <span className="progress-row__label">{label}</span>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: stats.total_applicants
                            ? `${((value ?? 0) / stats.total_applicants) * 100}%`
                            : '0%',
                          background: color,
                        }}
                      />
                    </div>
                    <span className="progress-row__num">{value ?? 0}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
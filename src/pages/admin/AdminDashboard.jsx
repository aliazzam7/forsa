import React, { useState, useEffect, useRef } from 'react';
import {
  GraduationCap, Building2, Briefcase, ClipboardList,
  CheckCircle, Trash2, Users, AlertCircle,
} from 'lucide-react';
import { Chart, registerables } from 'chart.js';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import StatsCard from '../../components/admin/StatsCard';
import adminService from '../../services/adminService';
import useAdminProfile from '../../components/hooks/useAdminProfile';
import './AdminDashboard.css';

Chart.register(...registerables);

const buildMonthlyData = (dbRows) => {
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push(d.toLocaleString('en', { month: 'short' }));
  }
  const map = {};
  (dbRows || []).forEach(row => { map[row.month] = parseInt(row.count, 10); });
  return { labels: months, values: months.map(m => map[m] ?? 0) };
};

const BarChartCard = ({ monthlyStudents, monthlyCompanies }) => {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);
  useEffect(() => {
    const students  = buildMonthlyData(monthlyStudents);
    const companies = buildMonthlyData(monthlyCompanies);
    const ctx = canvasRef.current.getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: students.labels,
        datasets: [
          { label: 'Students',  data: students.values,  backgroundColor: '#1B2D6B', borderRadius: 6, borderSkipped: false },
          { label: 'Companies', data: companies.values, backgroundColor: '#F5A623', borderRadius: 6, borderSkipped: false },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', align: 'end', labels: { boxWidth: 10, boxHeight: 10, borderRadius: 3, useBorderRadius: true, font: { size: 12, weight: '600' }, color: '#6B7A99', padding: 16 } },
          tooltip: { backgroundColor: '#1B2D6B', titleColor: '#fff', bodyColor: '#fff', padding: 10, cornerRadius: 8 },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#9aabc2', font: { size: 12 } } },
          y: { grid: { color: '#f0f3fa' }, ticks: { color: '#9aabc2', font: { size: 12 }, stepSize: 5 }, border: { display: false } },
        },
      },
    });
    return () => chartRef.current?.destroy();
  }, [monthlyStudents, monthlyCompanies]);
  return (
    <div className="dashboard-card">
      <div className="card-header">
        <h2 className="section-title">Monthly Registrations</h2>
        <span className="card-badge">Last 6 months</span>
      </div>
      <div className="chart-canvas-wrap"><canvas ref={canvasRef} /></div>
    </div>
  );
};

const DonutChartCard = ({ stats }) => {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);
  const data = [
    { label: 'Students',     value: stats.totalStudents,     color: '#1B2D6B' },
    { label: 'Companies',    value: stats.totalCompanies,    color: '#F5A623' },
    { label: 'Jobs',         value: stats.totalJobs,         color: '#16a34a' },
    { label: 'Applications', value: stats.totalApplications, color: '#7c3aed' },
  ];
  const total = data.reduce((s, d) => s + d.value, 0);
  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map(d => d.label),
        datasets: [{ data: data.map(d => d.value), backgroundColor: data.map(d => d.color), borderWidth: 3, borderColor: '#ffffff', hoverBorderWidth: 3 }],
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '68%',
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: '#1B2D6B', titleColor: '#fff', bodyColor: '#fff', padding: 10, cornerRadius: 8, callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed}` } },
        },
      },
    });
    return () => chartRef.current?.destroy();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats]);
  return (
    <div className="dashboard-card">
      <div className="card-header">
        <h2 className="section-title">Platform Overview</h2>
        <span className="card-badge">Total: {total}</span>
      </div>
      <div className="chart-canvas-wrap" style={{ height: '180px' }}><canvas ref={canvasRef} /></div>
      <div className="donut-legend">
        {data.map((d) => (
          <div key={d.label} className="legend-item">
            <div className="legend-left">
              <span className="legend-dot" style={{ background: d.color }} />
              <span className="legend-label">{d.label}</span>
            </div>
            <span className="legend-value">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const RecentTable = ({ recentStudents, recentCompanies }) => (
  <div className="recent-table-section">
    <div className="recent-table-grid">
      <div className="dashboard-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="card-header" style={{ padding: '20px 20px 0' }}>
          <h2 className="section-title">Recent Students</h2>
          <span className="card-badge">Latest 5</span>
        </div>
        <table className="recent-mini-table" style={{ marginTop: '12px' }}>
          <thead><tr><th>Name</th><th>Email</th><th>Status</th></tr></thead>
          <tbody>
            {recentStudents.length === 0
              ? <tr><td colSpan={3} style={{ textAlign: 'center', color: '#9aabc2', padding: '16px' }}>No students yet</td></tr>
              : recentStudents.map((s) => (
                <tr key={s.id}>
                  <td><div className="mini-user-cell"><div className="mini-avatar">{s.name.charAt(0)}</div><span className="mini-name">{s.name}</span></div></td>
                  <td className="mini-email">{s.email}</td>
                  <td><span className={`mini-status-badge mini-status-badge--${s.status}`}>{s.status}</span></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="dashboard-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="card-header" style={{ padding: '20px 20px 0' }}>
          <h2 className="section-title">Recent Companies</h2>
          <span className="card-badge">Latest 5</span>
        </div>
        <table className="recent-mini-table" style={{ marginTop: '12px' }}>
          <thead><tr><th>Company</th><th>Email</th><th>Status</th></tr></thead>
          <tbody>
            {recentCompanies.length === 0
              ? <tr><td colSpan={3} style={{ textAlign: 'center', color: '#9aabc2', padding: '16px' }}>No companies yet</td></tr>
              : recentCompanies.map((c) => {
              //  const status = c.is_approved == 1 ? 'approved' : 'pending'; 
                const status = c.status;
                return (
                  <tr key={c.id}>
                    <td><div className="mini-user-cell"><div className="mini-avatar" style={{ borderRadius: '8px', background: 'linear-gradient(135deg, #F5A623, #e09418)' }}>{c.company_name.charAt(0)}</div><span className="mini-name">{c.company_name}</span></div></td>
                    <td className="mini-email">{c.email}</td>
                    <td><span className={`mini-status-badge mini-status-badge--${status}`}>{status}</span></td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const ErrorBanner = ({ message, onRetry }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '14px 18px', marginBottom: '24px' }}>
    <AlertCircle size={20} color="#dc2626" />
    <span style={{ color: '#dc2626', flex: 1 }}>{message}</span>
    <button onClick={onRetry} style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer', fontSize: '13px' }}>Retry</button>
  </div>
);

const LoadingSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
    <div className="stats-grid">
      {[1,2,3,4].map(i => (
        <div key={i} style={{ height: '120px', borderRadius: '16px', background: 'linear-gradient(90deg, #f0f3fa 25%, #e8ecf5 50%, #f0f3fa 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
      ))}
    </div>
    <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
  </div>
);

const AdminDashboard = () => {
  const adminProfile = useAdminProfile(); // ← hook مشترك — بيجيب name + avatar من DB

  const [stats, setStats] = useState({ totalStudents: 0, totalCompanies: 0, totalJobs: 0, totalApplications: 0 });
  const [recentStudents,   setRecentStudents]   = useState([]);
  const [recentCompanies,  setRecentCompanies]  = useState([]);
  const [monthlyStudents,  setMonthlyStudents]  = useState([]);
  const [monthlyCompanies, setMonthlyCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getDashboard();
      setStats({
        totalStudents:     data.stats?.totalStudents     ?? 0,
        totalCompanies:    data.stats?.totalCompanies    ?? 0,
        totalJobs:         data.stats?.totalJobs         ?? 0,
        totalApplications: data.stats?.totalApplications ?? 0,
      });
      setRecentStudents(data.recentStudents   ?? []);
      setRecentCompanies(data.recentCompanies ?? []);
      setMonthlyStudents(data.monthlyStudents   ?? []);
      setMonthlyCompanies(data.monthlyCompanies ?? []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  const quickActions = [
    { href: '/admin/companies', icon: CheckCircle, label: 'Approve Companies', color: 'green' },
    { href: '/admin/jobs',      icon: Trash2,      label: 'Remove Spam Jobs',  color: 'red'   },
    { href: '/admin/users',     icon: Users,       label: 'Manage Users',      color: 'blue'  },
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader
          title="Admin Dashboard"
          subtitle="Welcome back — here's what's happening on Forsa"
          adminName={adminProfile.name}
          adminAvatar={adminProfile.avatar}
        />
        <div className="admin-content">
          {error && <ErrorBanner message={error} onRetry={fetchDashboard} />}
          {loading ? <LoadingSkeleton /> : (
            <>
              <div className="stats-grid">
                <StatsCard title="Total Students"  value={stats.totalStudents}     icon={GraduationCap} color="blue"   change={null} />
                <StatsCard title="Total Companies" value={stats.totalCompanies}    icon={Building2}     color="orange" change={null} />
                <StatsCard title="Active Jobs"     value={stats.totalJobs}         icon={Briefcase}     color="green"  change={null} />
                <StatsCard title="Applications"    value={stats.totalApplications} icon={ClipboardList} color="purple" change={null} />
              </div>
              <div className="charts-row">
                <BarChartCard monthlyStudents={monthlyStudents} monthlyCompanies={monthlyCompanies} />
                <DonutChartCard stats={stats} />
              </div>
              <div className="dashboard-card quick-actions-standalone">
                <div className="card-header"><h2 className="section-title">Quick Actions</h2></div>
                <div className="actions-list">
                  {quickActions.map(({ href, icon: Icon, label, color }) => (
                    <a key={href} href={href} className={`quick-action-btn quick-action-btn--${color}`}>
                      <span className="qa-icon-wrap"><Icon size={18} strokeWidth={2} /></span>
                      <span className="qa-label">{label}</span>
                      <span className="qa-arrow">→</span>
                    </a>
                  ))}
                </div>
              </div>
              <RecentTable recentStudents={recentStudents} recentCompanies={recentCompanies} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
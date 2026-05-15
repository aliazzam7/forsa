import React, { useState, useEffect, useRef } from 'react';
import {
  GraduationCap, Building2, Briefcase, ClipboardList,
  CheckCircle, Trash2, Users,
} from 'lucide-react';
import { Chart, registerables } from 'chart.js';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import StatsCard from '../../components/admin/StatsCard';
import './AdminDashboard.css';

Chart.register(...registerables);

/* ─── Bar Chart: Monthly Registrations ──────────────────── */
const BarChartCard = () => {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Students',
            data: [18, 24, 20, 30, 22, 28],
            backgroundColor: '#1B2D6B',
            borderRadius: 6,
            borderSkipped: false,
          },
          {
            label: 'Companies',
            data: [5, 8, 6, 10, 7, 9],
            backgroundColor: '#F5A623',
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 10,
              boxHeight: 10,
              borderRadius: 3,
              useBorderRadius: true,
              font: { size: 12, weight: '600' },
              color: '#6B7A99',
              padding: 16,
            },
          },
          tooltip: {
            backgroundColor: '#1B2D6B',
            titleColor: '#fff',
            bodyColor: '#fff',
            padding: 10,
            cornerRadius: 8,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#9aabc2', font: { size: 12 } },
          },
          y: {
            grid: { color: '#f0f3fa' },
            ticks: { color: '#9aabc2', font: { size: 12 }, stepSize: 10 },
            border: { display: false },
          },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, []);

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <h2 className="section-title">Monthly Registrations</h2>
        <span className="card-badge">Last 6 months</span>
      </div>
      <div className="chart-canvas-wrap">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

/* ─── Donut Chart: Platform Overview ─────────────────────── */
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
        datasets: [{
          data: data.map(d => d.value),
          backgroundColor: data.map(d => d.color),
          borderWidth: 3,
          borderColor: '#ffffff',
          hoverBorderWidth: 3,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1B2D6B',
            titleColor: '#fff',
            bodyColor: '#fff',
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.parsed}`,
            },
          },
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
      <div className="chart-canvas-wrap" style={{ height: '180px' }}>
        <canvas ref={canvasRef} />
      </div>
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

/* ─── Recent Table ───────────────────────────────────────── */
const RecentTable = ({ recentStudents, recentCompanies }) => (
  <div className="recent-table-section">
    <div className="recent-table-grid">
      {/* Recent Students */}
      <div className="dashboard-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="card-header" style={{ padding: '20px 20px 0' }}>
          <h2 className="section-title">Recent Students</h2>
          <span className="card-badge">Latest 2</span>
        </div>
        <table className="recent-mini-table" style={{ marginTop: '12px' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentStudents.map((s) => (
              <tr key={s.id}>
                <td>
                  <div className="mini-user-cell">
                    <div className="mini-avatar">{s.name.charAt(0)}</div>
                    <span className="mini-name">{s.name}</span>
                  </div>
                </td>
                <td className="mini-email">{s.email}</td>
                <td>
                  <span className={`mini-status-badge mini-status-badge--${s.status}`}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Companies */}
      <div className="dashboard-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="card-header" style={{ padding: '20px 20px 0' }}>
          <h2 className="section-title">Recent Companies</h2>
          <span className="card-badge">Latest 2</span>
        </div>
        <table className="recent-mini-table" style={{ marginTop: '12px' }}>
          <thead>
            <tr>
              <th>Company</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentCompanies.map((c) => (
              <tr key={c.id}>
                <td>
                  <div className="mini-user-cell">
                    <div className="mini-avatar" style={{ borderRadius: '8px', background: 'linear-gradient(135deg, #F5A623, #e09418)' }}>
                      {c.name.charAt(0)}
                    </div>
                    <span className="mini-name">{c.name}</span>
                  </div>
                </td>
                <td className="mini-email">{c.email}</td>
                <td>
                  <span className={`mini-status-badge mini-status-badge--${c.status}`}>
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

/* ─── Main Dashboard ─────────────────────────────────────── */
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCompanies: 0,
    totalJobs: 0,
    totalApplications: 0,
  });

  const [recentStudents, setRecentStudents] = useState([]);
  const [recentCompanies, setRecentCompanies] = useState([]);

  useEffect(() => {
    setStats({
      totalStudents: 128,
      totalCompanies: 34,
      totalJobs: 76,
      totalApplications: 312,
    });

    setRecentStudents([
      { id: 1, name: 'Ahmad Ali',   email: 'ahmad@mail.com', status: 'active' },
      { id: 2, name: 'Sara Hassan', email: 'sara@mail.com',  status: 'active' },
    ]);

    setRecentCompanies([
      { id: 1, name: 'TechCo Lebanon', email: 'admin@techco.com', status: 'pending'  },
      { id: 2, name: 'Pixels Design',  email: 'info@pixels.com',  status: 'approved' },
    ]);
  }, []);

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
        />
        <div className="admin-content">

          {/* Stats */}
          <div className="stats-grid">
            <StatsCard title="Total Students"  value={stats.totalStudents}     icon={GraduationCap} color="blue"   change={12} />
            <StatsCard title="Total Companies" value={stats.totalCompanies}    icon={Building2}     color="orange" change={5}  />
            <StatsCard title="Active Jobs"     value={stats.totalJobs}         icon={Briefcase}     color="green"  change={8}  />
            <StatsCard title="Applications"    value={stats.totalApplications} icon={ClipboardList} color="purple" change={18} />
          </div>

          {/* Charts */}
          <div className="charts-row">
            <BarChartCard />
            <DonutChartCard stats={stats} />
          </div>

          {/* Quick Actions */}
          <div className="dashboard-card quick-actions-standalone">
            <div className="card-header">
              <h2 className="section-title">Quick Actions</h2>
            </div>
            <div className="actions-list">
              {quickActions.map(({ href, icon: Icon, label, color }) => (
                <a key={href} href={href} className={`quick-action-btn quick-action-btn--${color}`}>
                  <span className="qa-icon-wrap">
                    <Icon size={18} strokeWidth={2} />
                  </span>
                  <span className="qa-label">{label}</span>
                  <span className="qa-arrow">→</span>
                </a>
              ))}
            </div>
          </div>

          {/* Recent Students & Companies Table */}
          <RecentTable
            recentStudents={recentStudents}
            recentCompanies={recentCompanies}
          />

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
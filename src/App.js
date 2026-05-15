import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// ── Admin Pages ──────────────────────────────────────────────────
import AdminDashboard      from './pages/admin/AdminDashboard';
import ManageUsersPage     from './pages/admin/ManageUsersPage';
import ManageCompaniesPage from './pages/admin/ManageCompaniesPage';
import ManageJobsPage      from './pages/admin/ManageJobsPage';
import MessagesPage        from './pages/admin/MessagesPage';
import AdminSettingsPage   from './pages/admin/SettingsPage';

// ── Company Pages ────────────────────────────────────────────────
import CompanyDashboard    from './pages/company/CompanyDashboard';
import PostJobPage         from './pages/company/PostJobPage';
import MyJobsPage          from './pages/company/MyJobsPage';
import ApplicantsPage      from './pages/company/ApplicantsPage';
import CompanySettingsPage from './pages/company/SettingsPage';

// ── Auth Pages ───────────────────────────────────────────────────
import LoginPage           from './pages/auth/LoginPage';
import RegisterStudentPage from './pages/auth/RegisterStudentPage';
import RegisterCompanyPage from './pages/auth/RegisterCompanyPage';

// ── Landing Page ─────────────────────────────────────────────────
import LandingPage         from './pages/landing/LandingPage';

// ── Student Pages ────────────────────────────────────────────────
import StudentDashboard    from './pages/student/StudentDashboard';
import StudentProfile      from './pages/student/StudentProfile';
import JobsPage            from './pages/student/JobsPage';
import JobDetailsPage      from './pages/student/JobDetailsPage';
import MyApplicationsPage  from './pages/student/MyApplicationsPage';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>

        {/* ── Default redirect ── */}
        <Route path="/" element={<LandingPage />} />

        {/* ── Landing ── */}
        <Route path="/landing" element={<LandingPage />} />

        {/* ── Auth ── */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/student" element={<RegisterStudentPage />} />
        <Route path="/register/company" element={<RegisterCompanyPage />} />

        {/* ── Student ── */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/jobs" element={<JobsPage />} />
        <Route path="/student/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/student/applications" element={<MyApplicationsPage />} />

        {/* ── Company ── */}
        <Route path="/company/dashboard" element={<CompanyDashboard />} />
        <Route path="/company/post-job" element={<PostJobPage />} />
        <Route path="/company/my-jobs" element={<MyJobsPage />} />
        <Route path="/company/applicants/:jobId" element={<ApplicantsPage />} />
        <Route path="/company/settings" element={<CompanySettingsPage />} />

        {/* ── Admin ── */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<ManageUsersPage />} />
        <Route path="/admin/companies" element={<ManageCompaniesPage />} />
        <Route path="/admin/jobs" element={<ManageJobsPage />} />
        <Route path="/admin/messages" element={<MessagesPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />

        {/* ── 404 fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;

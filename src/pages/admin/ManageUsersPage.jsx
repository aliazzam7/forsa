import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import UserTable from '../../components/admin/UserTable';
import './ManageUsersPage.css';

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setUsers([
      { id: 1, name: 'Ahmad Ali',    email: 'ahmad@mail.com',    role: 'student', status: 'active',  createdAt: '2025-01-10' },
      { id: 2, name: 'Sara Hassan',  email: 'sara@mail.com',     role: 'student', status: 'active',  createdAt: '2025-02-14' },
      { id: 3, name: 'TechCo Admin', email: 'admin@techco.com',  role: 'company', status: 'pending', createdAt: '2025-03-01' },
      { id: 4, name: 'Pixels Ltd',   email: 'info@pixels.com',   role: 'company', status: 'active',  createdAt: '2025-01-22' },
      { id: 5, name: 'Spam User',    email: 'spam@bad.com',      role: 'student', status: 'banned',  createdAt: '2025-04-05' },
    ]);
  }, []);

  const handleBan = (id) => {
    if (window.confirm('Ban this user?'))
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'banned' } : u));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this user permanently?'))
      setUsers(prev => prev.filter(u => u.id !== id));
  };

  const TABS = ['all', 'student', 'company'];
  const counts = {
    all:     users.length,
    student: users.filter(u => u.role === 'student').length,
    company: users.filter(u => u.role === 'company').length,
  };

  const filtered = users.filter(u => {
    const matchRole   = filter === 'all' || u.role === filter;
    const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="Manage Users" subtitle="View, ban, or delete platform users" />
        <div className="admin-content">

          <div className="page-toolbar">
            <div className="filter-tabs">
              {TABS.map(tab => (
                <button
                  key={tab}
                  className={`filter-tab ${filter === tab ? 'active' : ''}`}
                  onClick={() => setFilter(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  <span className="tab-count">{counts[tab]}</span>
                </button>
              ))}
            </div>

            <div className="toolbar-search">
              <Search size={15} className="toolbar-search-icon" />
              <input
                type="text"
                className="toolbar-search-input"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <UserTable users={filtered} onBan={handleBan} onDelete={handleDelete} />

        </div>
      </div>
    </div>
  );
};

export default ManageUsersPage;

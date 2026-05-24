import React, { useState, useEffect } from 'react';
import { Search, X, Save } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import UserTable from '../../components/admin/UserTable';
import adminService from '../../services/adminService';
import useAdminProfile from '../../components/hooks/useAdminProfile';
import './ManageUsersPage.css';

const EditUserModal = ({ user, onClose, onSave }) => {
  const [form, setForm]     = useState({ name: user.name, email: user.email, status: user.status });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState(null);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const toggleStatus = () =>
    setForm(prev => ({ ...prev, status: prev.status === 'banned' ? 'active' : 'banned' }));

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim()) { setError('Name and email are required.'); return; }
    if (!window.confirm(`Save changes for "${user.name}"?`)) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await adminService.updateUser(user.id, { name: form.name.trim(), email: form.email.trim() });
      if (form.status !== user.status) {
        await adminService.banUser(user.id, form.status === 'banned');
      }
      onSave({ ...user, name: form.name.trim(), email: form.email.trim(), status: form.status, is_banned: form.status === 'banned', ...(updated || {}) });
    } catch (err) {
      setError(err.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  const isBanned = form.status === 'banned';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Edit User</h3>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          {error && <p className="modal-error">{error}</p>}
          <div className="modal-field">
            <label className="modal-label">Full Name</label>
            <input name="name" className="modal-input" value={form.name} onChange={handleChange} placeholder="Full name" />
          </div>
          <div className="modal-field">
            <label className="modal-label">Email Address</label>
            <input name="email" type="email" className="modal-input" value={form.email} onChange={handleChange} placeholder="email@example.com" />
          </div>
          <div className="modal-field">
            <label className="modal-label">Role</label>
            <input className="modal-input modal-input--disabled" value={user.role} disabled />
          </div>
          <div className="modal-field">
            <label className="modal-label">Status</label>
            <div className="status-toggle-row">
              <span className={`status-toggle-label ${!isBanned ? 'status-toggle-label--active' : ''}`}>Active</span>
              <button type="button" className={`status-toggle-btn ${isBanned ? 'status-toggle-btn--banned' : 'status-toggle-btn--active'}`} onClick={toggleStatus} title={isBanned ? 'Click to unban' : 'Click to ban'}>
                <span className="status-toggle-thumb" />
              </button>
              <span className={`status-toggle-label ${isBanned ? 'status-toggle-label--banned' : ''}`}>Banned</span>
              <span className={`status-toggle-badge status-toggle-badge--${form.status}`}>{isBanned ? 'Will be banned' : 'Currently active'}</span>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-modal-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-modal-save" onClick={handleSubmit} disabled={saving}>
            <Save size={14} strokeWidth={2.2} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ManageUsersPage = () => {
  const adminProfile = useAdminProfile();

  const [users, setUsers]             = useState([]);
  const [filter, setFilter]           = useState('student');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminService.getAllUsers();
        setUsers(data.map(u => ({ ...u, status: u.is_banned ? 'banned' : 'active', createdAt: u.created_at })));
      } catch (err) {
        setError(err.message || 'Failed to load users.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleBan = async (id) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    const shouldBan = user.status !== 'banned';
    if (!window.confirm(shouldBan ? 'Ban this user?' : 'Unban this user?')) return;
    try {
      await adminService.banUser(id, shouldBan);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: shouldBan ? 'banned' : 'active', is_banned: shouldBan } : u));
    } catch (err) {
      alert(err.message || 'Action failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await adminService.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      alert(err.message || 'Delete failed.');
    }
  };

  const handleEditSave = (updatedUser) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setEditingUser(null);
  };

  const TABS = ['student', 'all'];
  const counts = { student: users.filter(u => u.role === 'student').length, all: users.length };

  const filtered = users.filter(u => {
    const matchRole   = filter === 'all' || u.role === filter;
    const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader
          title="Manage Users"
          subtitle="View and manage student accounts"
          adminName={adminProfile.name}
          adminAvatar={adminProfile.avatar}
        />
        <div className="admin-content">
          {loading && <p className="loading-msg">Loading users...</p>}
          {error   && <p className="error-msg">{error}</p>}
          {!loading && !error && (
            <>
              <div className="page-toolbar">
                <div className="filter-tabs">
                  {TABS.map(tab => (
                    <button key={tab} className={`filter-tab ${filter === tab ? 'active' : ''}`} onClick={() => setFilter(tab)}>
                      {tab === 'student' ? 'Students' : 'All Users'}
                      <span className="tab-count">{counts[tab]}</span>
                    </button>
                  ))}
                </div>
                <div className="toolbar-search">
                  <Search size={15} className="toolbar-search-icon" />
                  <input type="text" className="toolbar-search-input" placeholder="Search by name or email..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
              </div>
              <UserTable users={filtered} onBan={handleBan} onDelete={handleDelete} onEdit={(user) => setEditingUser(user)} />
            </>
          )}
        </div>
      </div>
      {editingUser && <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} onSave={handleEditSave} />}
    </div>
  );
};

export default ManageUsersPage;
import React from 'react';
import { Ban, Trash2, MoreHorizontal, Pencil } from 'lucide-react';
import './UserTable.css';

const UserTable = ({ users, onBan, onDelete, onEdit }) => {
  return (
    <div className="user-table-wrapper">
      <table className="user-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users && users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id || user.id}>
                {/* Name + Avatar */}
                <td>
                  <div className="user-cell">
                    <div className="user-avatar">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="user-name">{user.name}</span>
                  </div>
                </td>

                {/* Email */}
                <td className="text-muted">{user.email}</td>

                {/* Role */}
                <td>
                  <span className={`role-badge role-badge--${user.role}`}>
                    {user.role}
                  </span>
                </td>

                {/* Status */}
                <td>
                  <div className="status-cell">
                    <span className={`status-dot status-dot--${user.status || 'active'}`} />
                    <span className={`status-badge status-badge--${user.status || 'active'}`}>
                      {user.status || 'Active'}
                    </span>
                  </div>
                </td>

                {/* Date */}
                <td className="text-muted">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'N/A'}
                </td>

                {/* Actions */}
                <td>
                  <div className="action-buttons">
                    {/* Edit */}
                    <button
                      className="btn-action btn-edit"
                      onClick={() => onEdit && onEdit(user)}
                      title="Edit user"
                    >
                      <Pencil size={14} strokeWidth={2.2} />
                      <span>Edit</span>
                    </button>

                    {/* Ban / Unban */}
                    <button
                      className={`btn-action ${user.status === 'banned' ? 'btn-unban' : 'btn-ban'}`}
                      onClick={() => onBan && onBan(user._id || user.id)}
                      title={user.status === 'banned' ? 'Unban user' : 'Ban user'}
                    >
                      <Ban size={14} strokeWidth={2.2} />
                      <span>{user.status === 'banned' ? 'Unban' : 'Ban'}</span>
                    </button>

                    {/* Delete */}
                    <button
                      className="btn-action btn-delete"
                      onClick={() => onDelete && onDelete(user._id || user.id)}
                      title="Delete user"
                    >
                      <Trash2 size={14} strokeWidth={2.2} />
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="empty-state">
                <div className="empty-inner">
                  <MoreHorizontal size={32} strokeWidth={1.5} />
                  <p>No users found.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
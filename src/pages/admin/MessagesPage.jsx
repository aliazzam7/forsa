import React, { useState, useEffect } from 'react';
import { Search, Mail, MailOpen, Clock, User, Inbox } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader  from '../../components/admin/AdminHeader';
import useAdminProfile from '../../components/hooks/useAdminProfile';
import './MessagesPage.css';

const BASE_URL = 'http://localhost/forsa-platform-backend/api';

const MessagesPage = () => {
  const adminProfile = useAdminProfile();

  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search,   setSearch]   = useState('');
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('forsa_token');
    fetch(`${BASE_URL}/admin/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(json => { if (json.data) setMessages(json.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (msg) => {
    setSelected(msg);
    if (!msg.is_read) {
      setMessages(prev =>
        prev.map(m => m.id === msg.id ? { ...m, is_read: 1 } : m)
      );
      const token = localStorage.getItem('forsa_token');
      fetch(`${BASE_URL}/admin/messages/${msg.id}/read`, {
        method:  'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  };

  const filtered = messages.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase())  ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.message.toLowerCase().includes(search.toLowerCase())
  );

  const unreadCount = messages.filter(m => !m.is_read).length;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) {
      return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const formatFullDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    }) + ' at ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Color palette for avatars based on first letter
  const avatarColors = [
    '#3B5BDB', '#1098AD', '#2F9E44', '#E67700', '#C2255C',
    '#6741D9', '#0C8599', '#2B8A3E', '#E8590C', '#862E9C'
  ];
  const getAvatarColor = (name) => {
    const idx = name.charCodeAt(0) % avatarColors.length;
    return avatarColors[idx];
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader
          title="Messages"
          subtitle={`${unreadCount} unread message${unreadCount !== 1 ? 's' : ''}`}
          adminName={adminProfile.name}
          adminAvatar={adminProfile.avatar}
        />
        <div className="admin-content">
          <div className="messages-layout">

            {/* ── Sidebar / Inbox List ── */}
            <aside className="inbox-panel">
              {/* Stats bar */}
              <div className="inbox-stats">
                <div className="stat-chip">
                  <Mail size={13} />
                  <span>{messages.length} total</span>
                </div>
                {unreadCount > 0 && (
                  <div className="stat-chip stat-chip--unread">
                    <span className="stat-dot" />
                    <span>{unreadCount} unread</span>
                  </div>
                )}
              </div>

              {/* Search */}
              <div className="inbox-search-wrap">
                <Search size={14} className="search-icon" />
                <input
                  type="text"
                  className="inbox-search-input"
                  placeholder="Search messages…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              {/* Divider label */}
              <div className="inbox-label">
                <Inbox size={12} />
                <span>Inbox</span>
              </div>

              {/* List */}
              <div className="inbox-list">
                {loading && (
                  <div className="state-placeholder">
                    <div className="skeleton-list">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="skeleton-item">
                          <div className="skeleton-avatar" />
                          <div className="skeleton-lines">
                            <div className="skeleton-line skeleton-line--name" />
                            <div className="skeleton-line skeleton-line--email" />
                            <div className="skeleton-line skeleton-line--preview" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {!loading && filtered.length === 0 && (
                  <div className="state-placeholder">
                    <Mail size={32} strokeWidth={1.2} />
                    <p>No messages found</p>
                  </div>
                )}
                {!loading && filtered.map(msg => (
                  <div
                    key={msg.id}
                    className={`inbox-item${selected?.id === msg.id ? ' inbox-item--active' : ''}${!msg.is_read ? ' inbox-item--unread' : ''}`}
                    onClick={() => handleSelect(msg)}
                  >
                    <div
                      className="inbox-avatar"
                      style={{ background: getAvatarColor(msg.name) }}
                    >
                      {getInitials(msg.name)}
                    </div>

                    <div className="inbox-body">
                      <div className="inbox-row-top">
                        <span className="inbox-name">{msg.name}</span>
                        <span className="inbox-time">{formatDate(msg.created_at)}</span>
                      </div>
                      <span className="inbox-email">{msg.email}</span>
                      <p className="inbox-preview">
                        {msg.message.length > 65 ? msg.message.slice(0, 65) + '…' : msg.message}
                      </p>
                    </div>

                    {!msg.is_read && <span className="unread-badge" />}
                  </div>
                ))}
              </div>
            </aside>

            {/* ── Detail View ── */}
            <main className="detail-panel">
              {!selected ? (
                <div className="detail-empty">
                  <div className="empty-icon-wrap">
                    <MailOpen size={36} strokeWidth={1.2} />
                  </div>
                  <h3>No message selected</h3>
                  <p>Click on a message from the inbox to read it</p>
                </div>
              ) : (
                <div className="detail-inner">
                  {/* Header */}
                  <div className="detail-header">
                    <div className="detail-header-top">
                      <div
                        className="detail-avatar"
                        style={{ background: getAvatarColor(selected.name) }}
                      >
                        {getInitials(selected.name)}
                      </div>
                      <div className="detail-sender">
                        <h2 className="detail-sender-name">{selected.name}</h2>
                        <a
                          href={`mailto:${selected.email}`}
                          className="detail-sender-email"
                        >
                          {selected.email}
                        </a>
                      </div>
                      <div className="detail-badge-read">
                        <MailOpen size={12} />
                        <span>Read</span>
                      </div>
                    </div>

                    <div className="detail-meta-row">
                      <div className="meta-item">
                        <User size={12} />
                        <span>From user</span>
                      </div>
                      <div className="meta-divider" />
                      <div className="meta-item">
                        <Clock size={12} />
                        <span>{formatFullDate(selected.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="detail-body">
                    <div className="message-bubble">
                      <p className="message-text">{selected.message}</p>
                    </div>
                  </div>
                </div>
              )}
            </main>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
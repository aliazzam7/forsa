import React, { useState } from 'react';
import { Search, Mail, Send, MessageSquare } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import './MessagesPage.css';

const MOCK_MESSAGES = [
  {
    id: 1,
    sender: 'Ahmad Khalil',
    email: 'ahmad.khalil@gmail.com',
    subject: 'Issue with job application',
    preview: "I've been trying to apply for a job and the system keeps showing an error...",
    message: "Hello,\n\nI've been trying to apply for a job on your platform and the system keeps showing an error message every time I click 'Submit Application'. I've tried multiple browsers and devices but the issue persists.\n\nCould you please look into this?\n\nThank you,\nAhmad Khalil",
    time: '10:32 AM',
    date: '14 May 2026',
    unread: true,
  },
  {
    id: 2,
    sender: 'Lara Mansour',
    email: 'lara.mansour@techco.com',
    subject: 'Company profile verification request',
    preview: 'We submitted our company profile 3 days ago but it has not been approved...',
    message: "Dear Admin,\n\nWe submitted our company profile (TechCo Lebanon) 3 days ago but it has not been approved yet. We have a job posting we urgently need to publish.\n\nPlease advise on the expected timeline for approval.\n\nBest regards,\nLara Mansour\nHR Manager, TechCo Lebanon",
    time: '9:15 AM',
    date: '14 May 2026',
    unread: true,
  },
  {
    id: 3,
    sender: 'Omar Farhat',
    email: 'omar.f@outlook.com',
    subject: 'Unable to reset password',
    preview: "I requested a password reset yesterday but haven't received any email...",
    message: "Hi there,\n\nI requested a password reset yesterday but haven't received any email. I've checked my spam folder as well. My registered email is omar.f@outlook.com.\n\nPlease help me regain access to my account.\n\nThank you,\nOmar",
    time: '8:47 AM',
    date: '13 May 2026',
    unread: false,
  },
  {
    id: 4,
    sender: 'Maya Rizk',
    email: 'maya.rizk@university.edu',
    subject: 'Suggestion: Add internship filter',
    preview: 'It would be great if you could add a dedicated filter for internship positions...',
    message: "Hello Forsa Team,\n\nI'm a university student and I regularly use your platform. It would be great if you could add a dedicated filter for internship positions on the search page, as currently it's hard to separate internships from full-time jobs.\n\nJust a suggestion that I believe would help many students like me!\n\nBest,\nMaya Rizk",
    time: '5:20 PM',
    date: '12 May 2026',
    unread: false,
  },
];

const MessagesPage = () => {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [reply, setReply] = useState('');

  const filtered = messages.filter(m =>
    m.sender.toLowerCase().includes(search.toLowerCase()) ||
    m.subject.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (msg) => {
    setSelected(msg);
    setReply('');
    /* Mark as read */
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, unread: false } : m));
  };

  const handleSendReply = () => {
    if (!reply.trim()) return;
    alert(`Reply sent to ${selected.email}:\n\n${reply}`);
    setReply('');
  };

  const unreadCount = messages.filter(m => m.unread).length;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader
          title="Messages"
          subtitle={`${unreadCount} unread message${unreadCount !== 1 ? 's' : ''} from users`}
        />
        <div className="admin-content">
          <div className="messages-layout">

            {/* ─── Inbox Panel ─────────────────────────────── */}
            <div className="inbox-panel">
              <div className="inbox-header">
                <h2 className="section-title" style={{ fontSize: '15px' }}>
                  Inbox
                </h2>
                <div className="inbox-search">
                  <Search size={14} color="#9aabc2" />
                  <input
                    type="text"
                    className="inbox-search-input"
                    placeholder="Search messages..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="inbox-list">
                {filtered.length === 0 && (
                  <div style={{ textAlign: 'center', color: '#9aabc2', padding: '40px 20px', fontSize: '13px' }}>
                    No messages found.
                  </div>
                )}
                {filtered.map(msg => (
                  <div
                    key={msg.id}
                    className={`inbox-item${selected?.id === msg.id ? ' selected' : ''}`}
                    onClick={() => handleSelect(msg)}
                  >
                    <div className="inbox-avatar">
                      {msg.sender.charAt(0)}
                    </div>
                    <div className="inbox-item-body">
                      <div className="inbox-item-top">
                        <span className="inbox-sender">{msg.sender}</span>
                        <span className="inbox-time">{msg.time}</span>
                      </div>
                      <p className="inbox-subject">{msg.subject}</p>
                      <p className="inbox-preview">{msg.preview}</p>
                    </div>
                    {msg.unread && <div className="unread-dot" />}
                  </div>
                ))}
              </div>
            </div>

            {/* ─── Detail Panel ─────────────────────────────── */}
            <div className="message-detail-panel">
              {!selected ? (
                <div className="detail-empty">
                  <MessageSquare size={40} strokeWidth={1.4} />
                  <p>Select a message to read</p>
                </div>
              ) : (
                <>
                  <div className="detail-header">
                    <h2 className="detail-subject">{selected.subject}</h2>
                    <div className="detail-meta">
                      <div className="detail-sender-info">
                        <div className="detail-avatar">{selected.sender.charAt(0)}</div>
                        <div>
                          <div className="detail-sender-name">{selected.sender}</div>
                          <div className="detail-sender-email">{selected.email}</div>
                        </div>
                      </div>
                      <span className="detail-timestamp">{selected.date} · {selected.time}</span>
                    </div>
                  </div>

                  <div className="detail-body">
                    <p className="detail-message-text">{selected.message}</p>
                  </div>

                  <div className="detail-reply">
                    <textarea
                      className="reply-input"
                      placeholder={`Reply to ${selected.email}...`}
                      value={reply}
                      onChange={e => setReply(e.target.value)}
                      rows={2}
                    />
                    <button className="btn-reply" onClick={handleSendReply}>
                      <Send size={15} strokeWidth={2} />
                      Send
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
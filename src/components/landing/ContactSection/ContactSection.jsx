import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import './ContactSection.css';

const CONTACT_DETAILS = [
  { icon: Mail,   label: 'Email',    value: 'malak.mhmdd.17@gmail.com' },
  { icon: Phone,  label: 'Phone',    value: '+961 70 258 628'          },
  { icon: MapPin, label: 'Location', value: 'Beirut, Lebanon'          },
];

const ContactSection = () => {
  const [form, setForm]       = useState({ name: '', email: '', message: '' });
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        'http://localhost/forsa-platform-backend/api/contact',
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(form),
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Something went wrong');

      setSent(true);
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="contact__bg-orb contact__bg-orb--1" />
      <div className="contact__bg-orb contact__bg-orb--2" />

      <div className="contact__inner">

        <div className="contact__info">
          <h2 className="contact__title">Contact Us</h2>
          <p className="contact__intro">
            Have questions? Want to partner with us? We'd love to hear from you.
            Fill out the form or reach us directly through the details below.
          </p>
          <div className="contact__details">
            {CONTACT_DETAILS.map(({ icon: Icon, label, value }, i) => (
              <div key={i} className="contact__detail">
                <div className="contact__detail-icon-wrap">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="contact__detail-label">{label}</p>
                  <p className="contact__detail-value">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="contact__form-wrap">
          {sent ? (
            <div className="contact__success">
              <div className="contact__success-icon-wrap">
                <CheckCircle2 size={32} />
              </div>
              <h3>Message Sent!</h3>
              <p>Thanks For Reaching Out .</p>
            </div>
          ) : (
            <>
              <h3 className="contact__form-title">Send a Message</h3>

              {error && (
                <p style={{ color: '#e74c3c', marginBottom: '12px', fontSize: '13px' }}>
                  {error}
                </p>
              )}

              <form className="contact__form" onSubmit={handleSubmit}>
                <div className="contact__form-row">
                  <div className="contact__form-group">
                    <label>Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Ghadeer Abdallah"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      required
                      className="contact__input"
                    />
                  </div>
                  <div className="contact__form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      placeholder="forsa@gmail.com"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      required
                      className="contact__input"
                    />
                  </div>
                </div>

                <div className="contact__form-group contact__form-group--full">
                  <label>Message</label>
                  <textarea
                    rows={5}
                    placeholder="Write your message here..."
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    required
                    className="contact__input contact__textarea"
                  />
                </div>

                <button
                  type="submit"
                  className={`contact__submit ${loading ? 'contact__submit--loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="contact__spinner" /> Sending…</>
                  ) : (
                    <>Send Message <Send size={15} /></>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

      </div>
    </section>
  );
};

export default ContactSection;
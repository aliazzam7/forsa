import React from 'react';
import {
  Target,
  Eye,
  Code2,
  Server,
  Palette,
  CalendarDays,
  Users,
  Infinity,
  MessageCircle,
} from 'lucide-react';
import './AboutSection.css';

const TEAM = [
  { initials: 'GA', name: ' Ghadeer Abdallah ', role: 'Lead Developer',   icon: Code2,   phone: '70258628' },
  { initials: 'M',  name: ' Malak Mohamad ',            role: 'Backend Engineer', icon: Server,  phone: '71592870' },
  { initials: 'J',  name: ' Jana Zeer ',             role: 'UI / UX Designer', icon: Palette, phone: '71475669' },
];

const VALUES = [
  {
    icon: Target,
    title: 'Our Mission',
    desc: 'Empower students to launch their careers through real, meaningful opportunities that match their skills.',
  },
  {
    icon: Eye,
    title: 'Our Vision',
    desc: 'A world where talent meets opportunity without barriers — regardless of background or connections.',
  },
];

const HIGHLIGHTS = [
  { icon: CalendarDays, num: '2026', label: 'Founded'    },
  { icon: Users,        num: '3',    label: 'Developers' },
  { icon: Infinity,     num: '∞',    label: 'Ambition'   },
];

const AboutSection = () => (
  <section id="about" className="about">
    <div className="about__inner">

      {/* ── Left ── */}
      <div className="about__text">
        <h2 className="about__title">About Forsa Platform</h2>

        <p className="about__p">
          <strong>Forsa</strong> (meaning "Opportunity" ) is a student–company job matching
          platform built to bridge the gap between university talent and leading employers.
        </p>
        <p className="about__p">
          We believe every student deserves access to meaningful work experience. Our platform
          makes it easy to discover internships, part-time roles, and full-time opportunities —
          all in one place, with zero fees and no friction.
        </p>

        <div className="about__values">
          {VALUES.map(({ icon: Icon, title, desc }, i) => (
            <div key={i} className="about__value">
              <div className="about__value-icon-wrap">
                <Icon size={20} />
              </div>
              <div>
                <h4 className="about__value-title">{title}</h4>
                <p  className="about__value-desc">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right ── */}
      <div className="about__right">
        <p className="about__team-label">Meet the Team</p>

        <div className="about__team-cards">
          {TEAM.map(({ initials, name, role, icon: RoleIcon, phone }, i) => (
            <a
              key={i}
              className="about__team-card"
              href={`https://wa.me/961${phone}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Chat with ${name} on WhatsApp`}
            >
              <div className="about__avatar">{initials}</div>
              <div className="about__team-info">
                <p className="about__team-name">{name}</p>
                <div className="about__team-role">
                  <RoleIcon size={12} />
                  {role}
                </div>
              </div>
              <div className="about__whatsapp-btn" aria-hidden="true">
                <MessageCircle size={16} />
                <span>Chat</span>
              </div>
            </a>
          ))}
        </div>

        <div className="about__highlights">
          {HIGHLIGHTS.map(({ icon: Icon, num, label }, i) => (
            <div key={i} className="about__hl">
              <Icon size={18} className="about__hl-icon" />
              <span className="about__hl-num">{num}</span>
              <span className="about__hl-lbl">{label}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  </section>
);

export default AboutSection;
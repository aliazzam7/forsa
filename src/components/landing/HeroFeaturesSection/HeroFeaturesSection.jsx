import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  Building2,
  Users,
} from 'lucide-react';
import './HeroFeaturesSection.css';

/* ── Constants ─────────────────────────────── */
const FULL_TEXT = 'Connect Students with Top Companies';

const STATS = [
  { icon: Briefcase, num: '500+',   label: 'Active Jobs' },
  { icon: Building2, num: '200+',   label: 'Companies'   },
  { icon: Users,     num: '1,500+', label: 'Students'    },
];

const TYPE_SPEED  = 55;
const PAUSE_FULL  = 2200;
const ERASE_SPEED = 28;
const PAUSE_EMPTY = 500;

/* ── Typing Hook ───────────────────────────── */
function useTypingLoop(text) {
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase]         = useState('typing');
  const timeoutRef = useRef(null);

  useEffect(() => {
    const clear = () => clearTimeout(timeoutRef.current);

    if (phase === 'typing') {
      if (displayed.length < text.length) {
        timeoutRef.current = setTimeout(
          () => setDisplayed(text.slice(0, displayed.length + 1)),
          TYPE_SPEED
        );
      } else {
        timeoutRef.current = setTimeout(() => setPhase('erasing'), PAUSE_FULL);
      }
    }

    if (phase === 'erasing') {
      if (displayed.length > 0) {
        timeoutRef.current = setTimeout(
          () => setDisplayed(prev => prev.slice(0, -1)),
          ERASE_SPEED
        );
      } else {
        timeoutRef.current = setTimeout(() => setPhase('typing'), PAUSE_EMPTY);
      }
    }

    return clear;
  }, [displayed, phase, text]);

  return displayed;
}

/* ── Component ─────────────────────────────── */
const HeroFeaturesSection = ({ scrollTo }) => {
  const navigate  = useNavigate();
  const displayed = useTypingLoop(FULL_TEXT);

  return (
    <section id="hero" className="hf">
      {/* Background orbs */}
      <div className="hf__orb hf__orb--1" />
      <div className="hf__orb hf__orb--2" />
      <div className="hf__orb hf__orb--3" />

      <div className="hf__inner">
        <div className="hf__hero-split">

          {/* ── LEFT: badge + title + sub + buttons ── */}
          <div className="hf__hero-left">

            {/* Badge */}
            <div className="hf__badge">
              <span className="hf__badge-flag">🇱🇧</span>
              <span className="hf__badge-divider" />
              <span className="hf__badge-dot" />
              Now live in Lebanon
            </div>

            {/* Typing title */}
            <h1 className="hf__title">
              <span className="hf__title-typed">{displayed}</span>
              <span className="hf__cursor" aria-hidden="true" />
            </h1>

            {/* Subtitle */}
            <p className="hf__sub">
              Forsa bridges university talent with leading employers.
              Discover internships, part-time roles, and full-time positions
              tailored to your skills — zero fees, real results.
            </p>

            {/* CTAs */}
            <div className="hf__cta">
              <button
                className="hf__btn-primary"
                onClick={() => navigate('/register/student')}
              >
                Get Started — It's Free
                <ArrowRight size={16} />
              </button>
              <button
                className="hf__btn-outline"
                onClick={() => scrollTo && scrollTo('jobs')}
              >
                Browse Jobs
              </button>
            </div>
          </div>

          {/* ── RIGHT: stat boxes (vertical) ── */}
          <div className="hf__stats">
            {STATS.map(({ icon: Icon, num, label }) => (
              <div className="hf__stat-box" key={label}>
                <div className="hf__stat-icon-wrap">
                  <Icon size={20} />
                </div>
                <div className="hf__stat-info">
                  <span className="hf__stat-num">{num}</span>
                  <span className="hf__stat-lbl">{label}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroFeaturesSection;
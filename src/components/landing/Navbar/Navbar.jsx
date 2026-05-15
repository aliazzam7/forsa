import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';
import logo from '../../../assets/images/rmvlogoforsa.png'; 
import './Navbar.css';

const NAV_LINKS = [
  { label: 'About',   id: 'about'   },
  { label: 'Jobs',    id: 'jobs'    },
  { label: 'Contact', id: 'contact' },
];

const Navbar = ({ scrollTo }) => {
  const navigate = useNavigate();
  const [scrolled,       setScrolled]       = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleScroll = (id) => {
    setMobileMenuOpen(false);
    if (scrollTo) scrollTo(id);
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">

        {/* ── Logo ── */}
        <button className="navbar__brand" onClick={() => handleScroll('hero')}>
          <img
            src={logo}
            alt="Forsa Platform"
            className="navbar__logo-img"
          />
        </button>

        {/* ── Desktop links + auth ── */}
        <div className="navbar__right">
          <div className="navbar__links">
            {NAV_LINKS.map(({ label, id }) => (
              <button key={id} className="navbar__link" onClick={() => handleScroll(id)}>
                {label}
              </button>
            ))}
          </div>
          <div className="navbar__auth">
            <button className="navbar__btn-ghost" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="navbar__btn-primary" onClick={() => navigate('/register/student')}>
              Get Started <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* ── Hamburger ── */}
        <button
          className="navbar__hamburger"
          onClick={() => setMobileMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile dropdown ── */}
      <div className={`navbar__mobile ${mobileMenuOpen ? 'navbar__mobile--open' : ''}`}>
        {NAV_LINKS.map(({ label, id }) => (
          <button key={id} className="navbar__mobile-link" onClick={() => handleScroll(id)}>
            {label}
          </button>
        ))}
        <div className="navbar__mobile-auth">
          <button
            className="navbar__btn-ghost navbar__btn-ghost--dark"
            onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
          >
            Login
          </button>
          <button
            className="navbar__btn-primary"
            onClick={() => { setMobileMenuOpen(false); navigate('/register/student'); }}
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
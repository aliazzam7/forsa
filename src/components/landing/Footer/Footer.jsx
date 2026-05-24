import logo from '../../../assets/images/rmvlogoforsa.png'; 
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Instagram,
  ArrowUpRight,
} from 'lucide-react';
import logo1 from '../../../assets/images/rmvlogoforsa.png'; 
import './Footer.css';

const Footer = ({ scrollTo }) => {
  const navigate = useNavigate();

  const handleScroll = (id) => {
    if (scrollTo) scrollTo(id);
  };

  return (
    <footer className="footer">
      <div className="footer__inner">

        {/* Col 1 — Brand */}
        <div className="footer__col footer__col--brand">
          <button className="footer__brand" onClick={() => handleScroll('hero')}>
            <img src={logo1} alt="Forsa Logo" className="footer__logo-img" />
            {/* <span className="footer__brand-name">Forsa<span className="footer__brand-dot">.</span></span> */}
          </button>

          {/* <p className="footer__tagline">Opportunities Start Here</p> */}

          <p className="footer__desc">
            Connecting students with the best companies in Lebanon and beyond.
            Build your career from day one — zero fees, real opportunities.
          </p>

          <div className="footer__social-row">
            <a href="#" className="footer__social-btn" aria-label="LinkedIn">
              <Linkedin size={16} />
            </a>
            <a href="#" className="footer__social-btn" aria-label="Twitter">
              <Twitter size={16} />
            </a>
            <a href="#" className="footer__social-btn" aria-label="Instagram">
              <Instagram size={16} />
            </a>
          </div>
        </div>

        {/* Col 2 — Quick Links */}
        <div className="footer__col">
          <h4 className="footer__col-title">Quick Links</h4>
          <ul className="footer__links">
            <li>
              <button onClick={() => handleScroll('hero')} className="footer__link">
                Home <ArrowUpRight size={12} />
              </button>
            </li>
            <li>
              <button onClick={() => handleScroll('about')} className="footer__link">
                About Us <ArrowUpRight size={12} />
              </button>
            </li>
            <li>
              <button onClick={() => handleScroll('jobs')} className="footer__link">
                Browse Jobs <ArrowUpRight size={12} />
              </button>
            </li>
            <li>
              <button onClick={() => handleScroll('contact')} className="footer__link">
                Contact <ArrowUpRight size={12} />
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/register/company')} className="footer__link">
                Post a Job <ArrowUpRight size={12} />
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3 — For Users */}
        <div className="footer__col">
          <h4 className="footer__col-title">For Users</h4>
          <ul className="footer__links">
            <li>
              <button onClick={() => navigate('/register/student')} className="footer__link">
                Student Sign Up <ArrowUpRight size={12} />
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/register/company')} className="footer__link">
                Company Sign Up <ArrowUpRight size={12} />
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/login')} className="footer__link">
                Login <ArrowUpRight size={12} />
              </button>
            </li>
          </ul>

          <div className="footer__contact-mini">
            <div className="footer__contact-item">
              <Mail size={14} className="footer__contact-icon" />
              <span>malak.mhmdd.17@gmail.com</span>
            </div>
            <div className="footer__contact-item">
              <Phone size={14} className="footer__contact-icon" />
              <span>+961 70 258 628</span>
            </div>
            <div className="footer__contact-item">
              <MapPin size={14} className="footer__contact-icon" />
              <span>Beirut, Lebanon</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <p>© 2026 Forsa Platform. All rights reserved.</p>
        <p>Built With Care By 3 Students, For  Students.</p>
      </div>
    </footer>
  );
};

export default Footer;
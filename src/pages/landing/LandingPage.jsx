import { useRef } from 'react';
import Navbar from '../../components/landing/Navbar/Navbar';
import FeaturedJobsSection from '../../components/landing/FeaturedJobSection/FeaturedJobSection';
import HowItWorksSection from '../../components/landing/HowItWorksSection/HowItWorksSection';
import AboutSection from '../../components/landing/AboutSection/AboutSection';
import ContactSection from '../../components/landing/ContactSection/ContactSection';
import Footer from '../../components/landing/Footer/Footer';
import HeroFeaturesSection from '../../components/landing/HeroFeaturesSection/HeroFeaturesSection';
import './LandingPage.css';

const LandingPage = () => {
  const refs = {
    hero:    useRef(null),
    jobs:    useRef(null),
    howitworks: useRef(null),
    about:   useRef(null),
    contact: useRef(null),
  };

  const scrollTo = (id) => {
    refs[id]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <Navbar scrollTo={scrollTo} />
      <div ref={refs.hero}>    <HeroFeaturesSection />   </div>
      <div ref={refs.jobs}>    <FeaturedJobsSection />  </div>
      <div ref={refs.howitworks}><HowItWorksSection />  </div>
      <div ref={refs.about}>   <AboutSection />         </div>
      <div ref={refs.contact}> <ContactSection />       </div>
      <Footer />
    </>
  );
};

export default LandingPage;
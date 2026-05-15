import './HowItWorksSection.css';

import {
  UserPlus,
  SearchCheck,
  Rocket,
  ArrowRight,
} from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: <UserPlus size={42} />,
    title: 'Create Your Profile',
    description:
      'Build your professional student profile and showcase your skills, education, and experience.',
  },
  {
    number: '02',
    icon: <SearchCheck size={42} />,
    title: 'Explore Opportunities',
    description:
      'Browse internships and jobs tailored to your interests using smart filtering tools.',
  },
  {
    number: '03',
    icon: <Rocket size={42} />,
    title: 'Apply & Grow',
    description:
      'Apply instantly, connect with companies, and start building your future career.',
  },
];

const HowItWorksSection = () => {
  return (
    <section className="hiw-section">
      <div className="hiw-container">
        <div className="hiw-header">
          {/* <span className="hiw-tag">Easy Process</span> */}

          <h2 className="hiw-title">
            How <span>It Works</span>
          </h2>

          <p className="hiw-subtitle">
            A streamlined process designed to help students connect with the
            right opportunities faster and smarter.
          </p>
        </div>

        <div className="hiw-grid">
          {steps.map((step, index) => (
            <div className="hiw-card" key={index}>
              <div className="hiw-step-number">{step.number}</div>

              <div className="hiw-icon">
                {step.icon}
              </div>

              <h3 className="hiw-card-title">
                {step.title}
              </h3>

              <p className="hiw-description">
                {step.description}
              </p>

              <div className="hiw-arrow">
                <ArrowRight size={20} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
import React from 'react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../constants/theme';

const DEFAULT_DESC =
  'Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus maecenas.';

const DzMedia = ({ Image, alt }) => {
  return (
    <div className="col-xl-3 col-md-6">
      <div className="dz-media">
        <img src={Image} alt={alt ?? 'Fitness service'} />
      </div>
    </div>
  );
};

const DzInfo1 = ({ title, subtitle, description }) => {
  return (
    <div className="col-xl-3 col-md-6">
      <div className="dz-info bg-secondary">
        <div className="clearfix text-white">
          <span className="text-primary subtitle">{title}</span>
          <h4 className="title text-white">{subtitle}</h4>
          <p>{description ?? DEFAULT_DESC}</p>
          <Link to="/services-details" className="btn btn-primary btn-skew">
            <span>Read More</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

const DzInfo2 = ({ title, subtitle, description }) => {
  return (
    <div className="col-xl-3 col-md-6">
      <div className="dz-info bg-primary">
        <div className="clearfix theme-text-color">
          <span className="subtitle">{title}</span>
          <h4 className="title theme-text-color">{subtitle}</h4>
          <p>{description ?? DEFAULT_DESC}</p>
          <Link to="/services-details" className="btn btn-secondary btn-skew">
            <span>Read More</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

const FitnessTraining = () => {
  return (
    <>
      <div className="row g-0">
        <DzInfo1
          title="BODY SHAPE"
          subtitle="CALISTHENICS"
          description="High-intensity functional circuits that build strength, stamina, and skill."
        />
        <DzMedia Image={IMAGES.services1} alt="Calisthenics training" />

        <DzInfo2
          title="RELAX PROGRAM"
          subtitle="BODY BALANCE"
          description="Low-impact mobility and breathwork to reset joints and calm the nervous system."
        />
        <DzMedia Image={IMAGES.services3} alt="Body balance session" />

        <DzMedia Image={IMAGES.services4} alt="Cardio workout" />
        <DzInfo2
          title="CARDIO WORKFLOW"
          subtitle="CARDIO"
          description="Smart intervals to improve heart health and endurance—no equipment required."
        />

        <DzMedia Image={IMAGES.services2} alt="Weight lifting training" />
        <DzInfo1
          title="ORDINARY"
          subtitle="WEIGHT LIFTING"
          description="Progressive strength blocks with perfect form and trackable PRs."
        />
      </div>
    </>
  );
};

export default FitnessTraining;


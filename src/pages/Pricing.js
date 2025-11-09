import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../constants/theme';
import NewsLetter from '../elements/NewsLetter';
import PageTitle from '../elements/PageTitle';

// PRICING DATA: tailor prices/features here
const pricingBlog = [
  {
    id: 'basic',
    title: 'Basic',
    prime: '', // add 'premium' to highlight
    currency: 'R',
    rate: 129, // per month
    blurb: 'On-demand follow-along workouts with weekly structure.',
    features: [
      'On-demand video library',
      '30-min programs (4×/week)',
      'Progress tracker & streaks',
      'Community challenges',
      'Email support',
    ],
    ctaLabel: 'Start Basic',
  },
  {
    id: 'pro',
    title: 'Pro',
    prime: 'premium', // visually highlight the middle/best value
    currency: 'R',
    rate: 249,
    blurb: 'Guided plans + weekly Q&A for steady, measurable results.',
    features: [
      'Everything in Basic',
      '4-week periodized plans',
      'Weekly live coach Q&A (recordings)',
      'Form tips via comments',
      'Goal tracks: Fat loss / Lean muscle / Mobility',
    ],
    ctaLabel: 'Upgrade to Pro',
  },
    {
    id: 'ultra',
    title: 'Ultra',
    prime: '', // add 'premium' if you want this to be highlighted instead
    currency: 'R',
    rate: 399,
    blurb: 'High-touch coaching: custom plans, form checks, and live classes.',
    features: [
      'Everything in Pro',
      'Personal onboarding call',
      'Monthly custom plan refresh',
      '2×/month video form checks',
      'Live classes + priority support',
    ],
    ctaLabel: 'Go Ultra',
  },
];

const Pricing = () => {
  const [hoverEffect, setHoverEffect] = useState(1);

  return (
    <>
      <div className="page-content bg-white">
        <PageTitle activePage={'Pricing'} parentTitle="Pages" />

        <section
          className="content-inner rounded-shape-top overflow-hidden"
          style={{ backgroundImage: 'url(' + IMAGES.BgImage1 + ')' }}
        >
          <div className="container">
            <div className="row">
              {pricingBlog.map((data, ind) => (
                <div className="col-lg-4 col-md-6 m-b30" key={data.id}>
                  <div
                    className={`pricingtable-wrapper box-hover style-1 ${ind === hoverEffect ? 'active' : ''}`}
                    onMouseEnter={() => setHoverEffect(ind)}
                  >
                    <div className="pricingtable-inner">
                      <div className={`pricingtable-title ${data.prime}`}>{data.title}</div>

                      <div className="pricingtable-price">
                        <h2 className="pricingtable-bx text-primary">
                          {data.currency}
                          {data.rate}
                          <small>/ Month</small>
                        </h2>
                        <p>{data.blurb}</p>
                      </div>

                      <ul className="pricingtable-features">
                        {data.features.map((feat, i) => (
                          <li key={i}>{feat}</li>
                        ))}
                      </ul>

                      <div className="pricingtable-footer">
                        <Link to="/contact-us" className="btn btn-primary btn-skew">
                          <span>{data.ctaLabel}</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Optional helper text / policy line */}
            <div className="text-center m-t20">
              <small>
                ...
              </small>
            </div>
          </div>
        </section>

        <section className="call-action style-1 footer-action">
          <div className="container">
            <NewsLetter />
          </div>
        </section>
      </div>
    </>
  );
};

export default Pricing;



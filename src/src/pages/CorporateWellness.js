import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ClientSlider from '../components/ClientSlider';
import { IMAGES, SVGICON } from '../constants/theme';
import LatestSlider from '../elements/LatestSlider';
import NewsLetter from '../elements/NewsLetter';
import PageTitle from '../elements/PageTitle';
import WorkoutSlider from '../elements/WorkoutSlider';

function CorporateWellness() {
  return (
    <div className="page-content bg-white">
      <div className="dz-bnr-inr style-1 text-center overlay-black-light" style={{backgroundImage: "url(/assets/images/banner/bnr3.jpg)"}}>
        <div className="container">
          <h1 className="dz-title">Corporate Wellness</h1>
          <p className="m-t10 m-b0">Short, guided movement for busy teams. Measurable outcomes.</p>
        </div>
      </div>

      <section className="content-inner">
        <div className="container">
          <div className="section-head style-1 text-center">
            <h2 className="title">Packages</h2>
            <p>Zoom-first delivery • POPIA-aligned • Aggregated reports only</p>
          </div>
          <div className="row">
            {["Wellness Starter","Wellness Pro","Executive Coaching Pods"].map((t,i)=>(
              <div key={i} className="col-xl-4 col-lg-4 col-md-6 m-b30">
                <div className="dz-card style-1">
                  <div className="dz-info">
                    <h4 className="dz-title m-b10">{t}</h4>
                    <p>See Services page for full detail and pricing.</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center m-t10">
            <a className="btn btn-outline-primary m-r10" href="/assets/docs/FortyPlusFit_Corporate_Wellness_ROI.pdf" target="_blank" rel="noreferrer">Download ROI PDF</a>
            <a className="btn btn-primary" href="mailto:corporate@fortyplusfit.co.za">Talk to Sales</a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CorporateWellness;


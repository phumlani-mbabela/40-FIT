import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ClientSlider from '../components/ClientSlider';
import { IMAGES, SVGICON } from '../constants/theme';
import LatestSlider from '../elements/LatestSlider';
import NewsLetter from '../elements/NewsLetter';
import PageTitle from '../elements/PageTitle';
import WorkoutSlider from '../elements/WorkoutSlider';


const PlanCard = ({ title, price, bullets, ctas }) => (
  <div className="col-xl-4 col-lg-4 col-md-6 m-b30">
    <div className="dz-card style-1">
      <div className="dz-info">
        <h4 className="dz-title m-b10">{title}</h4>
        <div className="m-b10"><strong className="text-primary">{price}</strong></div>
        <ul className="list-checked primary m-b20">
          {bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
        {ctas?.map((c, i) => (
          <a key={i} className="btn btn-primary m-r10 m-b10" href={c.href} target="_blank" rel="noreferrer">
            {c.label}
          </a>
        ))}
      </div>
    </div>
  </div>
);

function ServicesFortyPlusFit() {
  return (
    <>
      <div className="page-content bg-white">
        {/* Hero */}
		<PageTitle activePage="AllServices" parentTitle="Services" />


        {/* Memberships */}
        <section className="content-inner">
          <div className="container">
            <div className="section-head style-1 text-center">
              <h2 className="title">Memberships</h2>
              <p>Choose the plan that fits your season. Upgrade anytime.</p>
            </div>
            <div className="row">
              <PlanCard
                title="Basic"
                price="R199 / month"
                bullets={[
                  "Video library: mobility, core, posture, low‑impact HIIT",
                  "Weekly program calendar (PDF)",
                  "Nutrition basics for 40+",
                  "Community + monthly Q&A",
                ]}
                ctas={[
                  { label: "Start Basic (PayFast)", href: "https://fortyplusfit.co.za/checkout/essentials?provider=payfast" },
                  { label: "Start Basic (Yoco)", href: "https://fortyplusfit.co.za/checkout/essentials?provider=yoco" },
                  { label: "Start Basic (Paystack)", href: "https://fortyplusfit.co.za/checkout/essentials?provider=paystack" },
                ]}
              />
              <PlanCard
                title="Ultra"
                price="R699 / month"
                bullets={[
                  "Everything in Basic",
                  "12‑week periodized plan (updated monthly)",
                  "Bi‑weekly video form checks",
                  "Personalized macros & sleep protocol",
                ]}
                ctas={[
                  { label: "Join Ultra (PayFast)", href: "https://fortyplusfit.co.za/checkout/coach-guided?provider=payfast" },
                  { label: "Join Ultra (Yoco)", href: "https://fortyplusfit.co.za/checkout/coach-guided?provider=yoco" },
                  { label: "Join Ultra (Paystack)", href: "https://fortyplusfit.co.za/checkout/coach-guided?provider=paystack" },
                ]}
              />
              <PlanCard
                title="Pro"
                price="R2,999 / month"
                bullets={[
                  "60‑min onboarding & movement screen",
                  "Weekly 1:1 check‑ins",
                  "Custom training, mobility, deloads",
                  "Labs‑aware nutrition periodization",
                ]}
                ctas={[
                  { label: "Apply for Pro (PayFast)", href: "https://fortyplusfit.co.za/checkout/premium-1to1?provider=payfast" },
                  { label: "Apply for Pro (Yoco)", href: "https://fortyplusfit.co.za/checkout/premium-1to1?provider=yoco" },
                  { label: "Apply for Pro (Paystack)", href: "https://fortyplusfit.co.za/checkout/premium-1to1?provider=paystack" },
                ]}
              />
            </div>
          </div>
        </section>

        {/* Programs */}
        <section className="content-inner bg-light">
          <div className="container">
            <div className="section-head style-1 text-center">
              <h2 className="title">Programs & Challenges</h2>
              <p>Once‑off or cohort-based accelerators to hit a goal fast.</p>
            </div>
            <div className="row">
              {[
                { title: "Strong @ 40+ (8 Weeks)"    , price: "R299", desc: "Strength & mobility split. 4 sessions/week. Printable plan + video cues." },
                { title: "Calisthenics Foundations"  , price: "R99",  desc: "Push‑up, dip, pull‑up progressions. Joint‑friendly volume." },
                { title: "28‑Day Gut‑Friendly Reset" , price: "R899", desc: "Shopping lists, prep maps, plate‑method targets. No fads." },
                { title: "10‑Day Posture & Back‑Care", price: "R99",  desc: "Micro‑sessions for desk bodies: thoracic, hips, core." },
              ].map((p, i) => (
                <div key={i} className="col-xl-3 col-lg-4 col-md-6 m-b30">
                  <div className="dz-card style-1">
                    <div className="dz-info">
                      <h5 className="dz-title m-b5">{p.title}</h5>
                      <p className="m-b10">{p.desc}</p>
                      <span className="badge bg-primary">{p.price} once‑off</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Corporate */}
        <section className="content-inner">
          <div className="container">
            <div className="section-head style-1 text-center">
              <h2 className="title">Corporate & Group</h2>
              <p>Zoom-first delivery. POPIA-aligned. Aggregate reporting only.</p>
            </div>
            <div className="row">
              {[
                {
                  title: "Wellness Starter",
                  price: "R29,500 / month (≤50 staff)",
                  bullets: [
                    "Weekly 30‑min live class",
                    "Monthly wellness webinar",
                    "8‑week team challenge + leaderboard",
                    "Quarterly outcomes report",
                  ],
                },
                {
                  title: "Wellness Pro",
                  price: "R89,500 / month (≤150 staff)",
                  bullets: [
                    "2× live classes/week + Q&A",
                    "Manager toolkit (micro‑breaks, active meetings)",
                    "Hybrid work ergonomics micro‑courses",
                    "Advanced outcomes report",
                  ],
                },
                {
                  title: "Executive Coaching Pods",
                  price: "R3,500 / person / month",
                  bullets: [
                    "5–10 leaders per pod",
                    "Travel‑aware blocks",
                    "Confidential progress tracking",
                    "Optional biomarker‑aware planning",
                  ],
                },
              ].map((pkg, i) => (
                <div key={i} className="col-xl-4 col-lg-4 col-md-6 m-b30">
                  <div className="dz-card style-1">
                    <div className="dz-info">
                      <h4 className="dz-title m-b10">{pkg.title}</h4>
                      <div className="m-b10"><strong className="text-primary">{pkg.price}</strong></div>
                      <ul className="list-check primary">
                        {pkg.bullets.map((b, bi) => <li key={bi}>{b}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center m-t10">
              <a className="btn btn-outline-primary m-r10" href="/assets/docs/FortyPlusFit_Corporate_Wellness_ROI.pdf" target="_blank" rel="noreferrer">Download Corporate ROI PDF</a>
              <a className="btn btn-primary" href="mailto:info@fortyplusfit.co.za">Book a 15‑min Discovery Call</a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default ServicesFortyPlusFit;


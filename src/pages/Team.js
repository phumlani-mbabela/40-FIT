import React from "react";
import { Link } from "react-router-dom";
import { IMAGES } from "../constants/theme";
import NewsLetter from "../elements/NewsLetter";
import PageTitle from "../elements/PageTitle";

const DEFAULT_ROLE = "Yoga trainer";

const mediaBlog = [
  { images: IMAGES.team1, title: "Kaida",  role: "Calisthenics Coach" },
  { images: IMAGES.team2, title: "Kaida",   role: "Balance Trainer" },
  //{ images: IMAGES.team3, title: "OLIVER", role: "Nutrition Specialist" },
  //{ images: IMAGES.team4, title: "ELIJAH", role: "Cardio & Conditioning" },
  //{ images: IMAGES.team5, title: "JAMES",  role: "Recovery & Breathwork" },
  //{ images: IMAGES.team6, title: "AMELIA", role: "Pilates Instructor" },
];

const Team = () => {
  return (
    <>
      <div className="page-content bg-white">
        <PageTitle parentTitle="Pages" activePage="Our Team" />
        <section className="content-inner">
          <div className="container">
            <div className="row ">
              {mediaBlog.map((item, index) => (
                <div className="col-lg-4 col-sm-6 m-b30" key={item.title}>
                  <div className="dz-team style-1">
                    <div className="dz-media">
                      <Link to={"#"}>
                        <img src={item.images} alt={`${item.title} - ${item.role || DEFAULT_ROLE}`} />
                      </Link>
                      <ul className="team-social">
                        <li>
                          <Link target="_blank" to="https://www.facebook.com/" rel="noreferrer">
                            <i className="fab fa-facebook-f"></i>
                          </Link>
                        </li>
                        <li>
                          <Link target="_blank" to="https://twitter.com/?lang=en" rel="noreferrer">
                            <i className="fab fa-twitter"></i>
                          </Link>
                        </li>
                        <li>
                          <Link target="_blank" to="https://www.instagram.com/?hl=en" rel="noreferrer">
                            <i className="fab fa-instagram"></i>
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className="dz-content ">
                      <h4 className="dz-name">{item.title}</h4>
                      <span className="dz-position">{item.role || DEFAULT_ROLE}</span>
                    </div>
                  </div>
                </div>
              ))}
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

export default Team;






import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import DonutChart2 from "../elements/DonutChart2";
import { IMAGES } from "../constants/theme";

const ComingSoon = () => {
  const [subscribe, setSubscribe] = useState(false);

  const [timerDays, setTimerDays] = useState("00");
  const [timerHours, setTimerHours] = useState("00");
  const [timerMinutes, setTimerMinutes] = useState("00");
  const [timerSeconds, setTimerSeconds] = useState("00");

  const intervalRef = useRef(null);

  // ------------ NEW: fixed due date 31-Oct-2025 13:00 local ------------
  const TARGET_DATE = new Date(2025, 9, 31, 13, 0, 0).getTime(); // months are 0-based; 9 = October
  // ---------------------------------------------------------------------

  const startTimer = () => {
    // clear any prior interval just in case
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const distance = TARGET_DATE - now;

      if (distance <= 0) {
        // Stop the timer and clamp to zeros
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setTimerDays("00");
        setTimerHours("00");
        setTimerMinutes("00");
        setTimerSeconds("00");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // pad to 2 digits for display
      setTimerDays(String(days).padStart(2, "0"));
      setTimerHours(String(hours).padStart(2, "0"));
      setTimerMinutes(String(minutes).padStart(2, "0"));
      setTimerSeconds(String(seconds).padStart(2, "0"));
    }, 1000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        className="coming-soon"
        data-text="HEALTH"
        style={{ backgroundImage: "url(" + IMAGES.BgAppoint + ")" }}
      >
        <div className="inner-content">
          <div className="logo-header logo-dark">
            <Link to={"/"}>
              <img src={IMAGES.logo} alt="" />
            </Link>
          </div>
          <h1 className="dz-head">
            We Are Coming <span className="text-primary">Soon !</span>
          </h1>
          <p>We`ll be here soon with our new awesome site, subscribe to be notified.</p>

          <div className="countdown countdown-timer">
            <div className="date clock-days">
              <div className="items-days">
                <div id="canvas-days" className="clock-canvas">
                  <DonutChart2
                    value={Number(timerDays)}
                    backgroundColor="rgba(0,0,0,1)"
                    backgroundColor2="rgba(0,0,0,0.1)"
                  />
                </div>
                <p className="val">{timerDays}</p>
              </div>
              <span className="type-days type-time" data-border-color="#000">Days</span>
            </div>

            <div className="date clock-hours">
              <div className="items-days">
                <div id="canvas-hours" className="clock-canvas">
                  <DonutChart2
                    value={Number(timerHours)}
                    backgroundColor="rgba(0,0,0,1)"
                    backgroundColor2="rgba(0,0,0,0.1)"
                  />
                </div>
                <p className="val">{timerHours}</p>
              </div>
              <span className="type-hours type-time" data-border-color="#000">Hours</span>
            </div>

            <div className="date clock-minutes">
              <div className="items-days">
                <div id="canvas-minutes" className="clock-canvas">
                  <DonutChart2
                    value={Number(timerMinutes)}
                    backgroundColor="rgba(0,0,0,1)"
                    backgroundColor2="rgba(0,0,0,0.1)"
                  />
                </div>
                <p className="val">{timerMinutes}</p>
              </div>
              <span className="type-minutes type-time" data-border-color="#000">Minutes</span>
            </div>

            <div className="date clock-seconds">
              <div className="items-days">
                <div id="canvas-seconds" className="clock-canvas">
                  <DonutChart2
                    value={Number(timerSeconds)}
                    backgroundColor="rgba(0,0,0,1)"
                    backgroundColor2="rgba(0,0,0,0.1)"
                  />
                </div>
                <p className="val">{timerSeconds}</p>
              </div>
              <span className="type-seconds type-time" data-border-color="#000">Seconds</span>
            </div>
          </div>

          <Link to={"/contact-us"} className="btn btn-primary btn-skew m-r15">
            <span>GET IN TOUCH</span>
          </Link>
          <Link
            to={"#"}
            onClick={() => setSubscribe(true)}
            data-bs-target="#SubscribeModal"
            className="btn btn-skew btn-secondary ms-3"
          >
            <span>SUBSCRIBE NOW</span>
          </Link>
        </div>

        <img className="shape1 rotate-360" src={IMAGES.circlesvg1} alt="" />
        <img className="shape2 rotate-360" src={IMAGES.circlesvg1} alt="" />
        <img className="shape3 dzmove1" src={IMAGES.circlesvg2} alt="" />
        <img className="shape4 dzmove2" src={IMAGES.circlesvg2} alt="" />
        <img className="girl-img" src={IMAGES.footergril1} alt="" />
      </div>

      <Modal
        className="modal fade inquiry-modal"
        show={subscribe}
        onHide={() => setSubscribe(false)}
        centered
      >
        <div className="inquiry-adv">
          <img src={IMAGES.modalpic} alt="Image" />
        </div>
        <div className="contact-modal">
          <div className="modal-header">
            <i className="fa-solid fa-envelope"></i>
            <h5 className="modal-title" id="exampleModalLongTitle">Subscribe To Our Newsletter</h5>
          </div>
          <div className="modal-body">
            <form className="dz-subscription dzSubscribe">
              <div className="dzSubscribeMsg"></div>
              <div className="input-group mb-3">
                <input name="dzName" required type="text" className="form-control" placeholder="Your Name" />
              </div>
              <div className="input-group mb-3">
                <input name="dzEmail" required type="email" className="form-control" placeholder="Your Email Address" />
              </div>
              <div className="text-center">
                <button name="submit" type="submit" value="Submit" className="btn btn-primary">
                  SUBSCRIBE NOW
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ComingSoon;



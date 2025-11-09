import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import { IMAGES } from "../constants/theme";

const testimonials = [
  {
    id: "sakhele-mzalazala",
    name: "Sakhele Mzalazala",
    role: "Member · Fat-loss journey",
    image: IMAGES.avatarlarge1,
    rating: 5,
    text:
      "Eight weeks in, I’m down 8 kg and my energy is back. The 30-minute home sessions fit my workday, and the nutrition cues were simple to follow. No fads—just structure that works."
  },
  {
    id: "sindiso-mpofu",
    name: "Sindiso Mpofu",
    role: "Member · Strength & definition",
    image: IMAGES.avatarlarge2,
    rating: 5,
    text:
      "I wasn’t chasing weight loss—I wanted definition and confidence. I went from 0 to 3 strict push-ups and cut 1:10 off my 5K. The mobility resets are magic."
  },
  {
    id: "lungelo-nyembezi",
    name: "Lungelo Nyembezi",
    role: "Member · Lean muscle",
    image: IMAGES.avatarlarge3,
    rating: 5,
    text:
      "I’ve always been lean. These progressive bodyweight blocks finally added visible muscle. I sleep better, stand taller, and my pull-ups jumped from 3 to 8."
  }
];

function StarRating({ rating = 5 }) {
  return (
    <ul className="testimonial-rating" aria-label={`Rating: ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <li key={i}>
          <i
            className={`fa-solid fa-star${i < rating ? "" : "-o"}`}
            aria-hidden="true"
          ></i>
        </li>
      ))}
    </ul>
  );
}

function ClientSlider() {
  const navigationPrevRef = React.useRef(null);
  const navigationNextRef = React.useRef(null);
  const paginationRef = React.useRef(null);

  return (
    <>
      <Swiper
        className="testimonial-swiper"
        slidesPerView={"auto"}
        spaceBetween={0}
        loop={true}
        speed={1500}
        navigation={{
          nextEl: ".btn-next",
          prevEl: ".btn-prev"
        }}
        pagination={{
          el: ".swiper-pagination",
          clickable: true,
          renderBullet: function (index, className) {
            return '<span className="' + className + '"> 0' + (index + 1) + "</span>";
          }
        }}
        modules={[Navigation, Pagination]}
      >
        {testimonials.map((t) => (
          <SwiperSlide key={t.id}>
            <div className="testimonial-1">
              <div className="testimonial-pic">
                <img src={t.image} alt={`${t.name} testimonial`} />
              </div>

              <StarRating rating={t.rating} />

              <div className="testimonial-info">
                <p className="testimonial-text">{t.text}</p>
                <h4 className="testimonial-name">{t.name}</h4>
                <span className="testimonial-position text-primary">{t.role}</span>
              </div>
            </div>
          </SwiperSlide>
        ))}

        <div className="num-pagination">
          <div className="testimonial-button-prev btn-prev" ref={navigationPrevRef}>
            <i className="fa-solid fa-arrow-left"></i>
          </div>
          <div className="swiper-pagination style-1" ref={paginationRef}></div>
          <div className="testimonial-button-next btn-next" ref={navigationNextRef}>
            <i className="fa-solid fa-arrow-right"></i>
          </div>
        </div>
      </Swiper>
    </>
  );
}

export default ClientSlider;



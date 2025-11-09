import React from 'react';
import { Accordion } from 'react-bootstrap';
import NewsLetter from '../elements/NewsLetter';
import PageTitle from '../elements/PageTitle';

const DEFAULT_DESC =
  'Vestibulum nibh risus, lobortis in neque eleifend, varius vulputate sem. Donec maximus, sapien id auctor ornare.';

const accordBlog = [
  {
    content: [
      {
        title: 'How does calisthenics help with weight loss?',
        description:
          'Compound bodyweight moves raise energy spend and preserve lean mass, supporting a calorie deficit without crashing your metabolism.'
      },
      {
        title: 'Do I need cardio on top of calisthenics?',
        description:
          'Not required, but 2–3 short cardio sessions (walks or intervals) can accelerate fat loss and improve heart health.'
      },
      {
        title: 'How many days per week should I train?',
        description:
          'Start with 3 full-body sessions on non-consecutive days; progress to 4 when recovery is solid.'
      },
      {
        title: 'What’s a simple beginner routine?',
        description:
          '3 rounds: push-ups, squats, glute bridge/hip hinge, row, plank. Rest 60–90s. Add reps or slow the tempo weekly.'
      },
      {
        title: 'How should I eat for fat loss while doing calisthenics?',
        description:
          'Small calorie deficit (≈300–500 kcal), protein 1.6–2.2 g/kg, veggies/fiber, hydrate, limit liquid calories.'
      },
    ],
  },
  {
    content: [
      {
        title: 'Will I lose muscle if I’m cutting?',
        description:
          'Keep protein high, train with progressive overload, and avoid aggressive deficits. Sleep 7–9 hours.'
      },
      {
        title: 'How do I progress bodyweight exercises without weights?',
        description:
          'Use harder variations, tempo (e.g., 3-1-3), pauses, range of motion, or density (same work, less time).'
      },
      {
        title: 'What results can I expect and how fast?',
        description:
          'Energy and skill improve in 2–4 weeks; visible changes in 4–12 weeks with consistency and a deficit.'
      },
      {
        title: 'How do I track progress beyond the scale?',
        description:
          'Measure waist/hip weekly, log reps/holds, take photos in consistent light, track sleep and protein.'
      },
      {
        title: 'Common mistakes to avoid?',
        description:
          'Training to exhaustion without a plan, cutting too hard, skipping protein/sleep, and not logging work.'
      },
    ],
  },
];

const Faq = () => {
  return (
    <>
      <div className="page-content bg-white">
        <PageTitle activePage="Faq" parentTitle="Pages" />
        <section className="content-inner-1 overflow-hidden">
          <div className="container">
            <div className="row">
              {accordBlog.map((data, colIdx) => (
                <div className="col-lg-6" key={colIdx}>
                  <Accordion className="dz-accordion dz-accordion-skew" id={`accordionFaq${colIdx}`} defaultActiveKey="0">
                    {data.content.map((item, index) => (
                      <Accordion.Item className="accordion-item" key={index} eventKey={String(index)}>
                        <Accordion.Header as="h2" id={`heading-${colIdx}-${index}`}>
                          {item.title}
                          <span className="toggle-close"></span>
                        </Accordion.Header>
                        <Accordion.Body>
                          <p className="m-b0">
                            {item.description ?? DEFAULT_DESC}
                          </p>
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>
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

export default Faq;



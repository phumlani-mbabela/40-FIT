import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { IMAGES } from '../constants/theme';
import NewsLetter from '../elements/NewsLetter';
import PageTitle from '../elements/PageTitle';

function bmiCategory(bmi) {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Healthy';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

const WeightCalculator = () => {
  const [selectBtn, setSelectBtn] = useState('Male');
  const [heightCm, setHeightCm] = useState(''); // cm
  const [weightKg, setWeightKg] = useState(''); // kg
  const [age, setAge] = useState('');
  const [result, setResult] = useState(null);   // { bmi, category } | null
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const h = parseFloat(heightCm);
    const w = parseFloat(weightKg);

    if (!h || !w || h <= 0 || w <= 0) {
      setError('Please enter a valid height (cm) and weight (kg).');
      setResult(null);
      return;
    }
    setError('');

    const meters = h / 100.0;
    const bmiRaw = w / (meters * meters);
    const bmi = Math.round(bmiRaw * 10) / 10; // 1 decimal
    setResult({ bmi, category: bmiCategory(bmi) });
  };

  return (
    <>
      <div className="page-content bg-white">
        <PageTitle activePage="Weight Calculator" parentTitle="Pages" />
        <section className="content-inner overflow-hidden" style={{ backgroundImage: `url(${IMAGES.BgImage1})` }}>
          <div className="container">
            <div className="row justify-content-between align-items-center m-b20">
              <div className="col-lg-6">
                <div className="section-head">
                  <h2 className="title">Body Mass Index</h2>
                  <p>
                    BMI estimates weight status from height and weight:{' '}
                    <strong>BMI = kg ÷ (m{'\u00B2'})</strong>. Adult ranges:
                    <strong> &lt;18.5</strong> underweight, <strong>18.5–24.9</strong> healthy,{' '}
                    <strong>25–29.9</strong> overweight, <strong>≥30</strong> obesity.
                  </p>
                </div>

                <form className="dzForm calculator-form p-r10" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-sm-6">
                      <label htmlFor="height" className="form-label text-primary">Height</label>
                      <div className="input-group input-line">
                        <input
                          id="height"
                          name="dzHeight"
                          className="form-control"
                          placeholder="Height / cm"
                          inputMode="decimal"
                          value={heightCm}
                          onChange={(e) => setHeightCm(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="col-sm-6">
                      <label htmlFor="weight" className="form-label text-primary">Weight / kg</label>
                      <div className="input-group input-line">
                        <input
                          id="weight"
                          name="weight"
                          className="form-control"
                          placeholder="Your weight"
                          inputMode="decimal"
                          value={weightKg}
                          onChange={(e) => setWeightKg(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="col-sm-6">
                      <label htmlFor="age" className="form-label text-primary">Age</label>
                      <div className="input-group input-line">
                        <input
                          id="age"
                          name="Age"
                          className="form-control"
                          placeholder="Age"
                          inputMode="numeric"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="col-sm-6">
                      <label className="form-label text-primary">Gender</label>
                      <div className="mb-4 mb-sm-0">
                        <Dropdown className="select-dropdown style-1">
                          <Dropdown.Toggle as="div" className="select-dropdown-toggle">
                            {selectBtn} <i className="fa-sharp fa-solid fa-caret-down"></i>
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="mt-2">
                            <Dropdown.Item onClick={() => setSelectBtn('Male')}>Male</Dropdown.Item>
                            <Dropdown.Item onClick={() => setSelectBtn('Female')}>Female</Dropdown.Item>
                            <Dropdown.Item onClick={() => setSelectBtn('Other')}>Other</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>

                    <div className="col-sm-12">
                      <button type="submit" className="btn btn-secondary btn-skew m-b30">
                        <span>Calculate BMI</span>
                      </button>
                    </div>

                    <div className="col-sm-12">
                      <div className="dzFormBmi">
                        {error && <div className="alert alert-danger p-2">{error}</div>}
                        {result && (
                          <div className="alert alert-success p-2">
                            <strong>BMI:</strong> {result.bmi} &nbsp;|&nbsp; <strong>Status:</strong> {result.category}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="col-lg-6 m-md-t40">
                <div className="calculate-table">
                  <table>
                    <thead>
                      <tr>
                        <th>BMI</th>
                        <th>Weight Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>Below 18.5</td><td>Underweight</td></tr>
                      <tr><td>18.5 - 24.9</td><td>Healthy</td></tr>
                      <tr><td>25.0 - 29.9</td><td>Overweight</td></tr>
                      <tr><td>30.0 and Above</td><td>Obese</td></tr>
                    </tbody>
                  </table>
                  <div className="weight-info">
                    <span><b>BMR</b> Metabolic Rate / <b>BMI</b> Body Mass Index </span>
                  </div>
                </div>
              </div>

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

export default WeightCalculator;



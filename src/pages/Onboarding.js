import React, { useMemo, useState } from "react";

/**
 * Forty+Fit Onboarding Questionnaire
 * - No extra libraries
 * - Unit toggles (cm/ft+in, kg/lb)
 * - Conditional fields
 * - Minimal validation
 * - Accessible labels + helper text
 *
 * You can style using your existing "allservices" section classes:
 *  - section-full / content-inner / container / row / col-*
 *  - section-head / title / subtitle etc.
 */

const countries = ["United States", "United Kingdom", "Canada", "Australia", "Kenya", "South Africa", "India", "Other"];

const genderOptions = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "nonbinary", label: "Non-binary" },
  { value: "prefer_not", label: "Prefer not to say" },
  { value: "self", label: "Self-describe" },
];

const primaryGoals = [
  { value: "lose_fat", label: "Lose fat" },
  { value: "build_muscle", label: "Build muscle" },
  { value: "mobility_pain", label: "Improve mobility & pain" },
  { value: "fitter", label: "Get fitter overall" },
  { value: "recomp", label: "Recomp (lose fat + gain muscle)" },
];

const secondaryGoals = [
  "Posture",
  "Core strength",
  "Flexibility",
  "Balance",
  "Cardiometabolic health",
];

const timeline = ["4–6 weeks", "8–12 weeks", "3–6 months", "Not sure"];

const conditions = [
  "Hypertension",
  "Heart condition",
  "Diabetes",
  "Osteoporosis",
  "Arthritis",
  "Hernia",
];

const painAreas = ["Knee", "Hip", "Shoulder", "Back", "Neck"];

const dayActivity = ["Mostly sitting", "Lightly active", "On feet a lot", "Very active"];

const freq = ["0", "1–2×", "3–4×", "5+× per week"];

const locations = ["Home", "Gym", "Outdoors", "Mixed"];

const equipment = [
  "Bodyweight",
  "Dumbbells",
  "Kettlebells",
  "Barbell",
  "Resistance bands",
  "Bench",
  "Pull-up bar",
  "Cardio machine",
  "None",
];

const durations = ["20 min", "30–40 min", "45–60 min"];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const focusAreas = [
  "Visible abs",
  "Defined chest",
  "Bigger arms",
  "Broad shoulders",
  "Wider back",
  "Strong legs",
  "Glutes",
  "Posture",
  "Cardio fitness",
];

const dreamBody = ["Athletic", "Balanced", "Strong", "I’m not sure"];

const dietPrefs = ["No preference", "Balanced", "Low-carb", "Mediterranean", "Vegetarian", "Vegan"];

const alcohol = ["None", "1–3 drinks/week", "4–7", "8+"];

const sleep = ["<5h", "5–6h", "7–8h", "9h+"];

const steps = ["<3k", "3–6k", "6–9k", "9–12k", "12k+"];

const coachingStyle = ["Gentle & supportive", "Balanced", "Push me hard"];

const reminders = ["App push", "Email", "SMS", "None"];

function CheckboxGroup({ label, options, values = [], onChange, name }) {
  const toggle = (opt) => {
    const exists = values.includes(opt);
    const next = exists ? values.filter((v) => v !== opt) : [...values, opt];
    onChange(next);
  };
  return (
    <div className="form-group">
      <label className="form-label d-block">{label}</label>
      <div className="row">
        {options.map((opt) => (
          <div className="col-sm-6 col-md-4" key={`${name}-${opt}`}>
            <label className="d-flex align-items-center gap-2">
              <input
                type="checkbox"
                checked={values.includes(opt)}
                onChange={() => toggle(opt)}
              />
              <span>{opt}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

function RadioGroup({ label, options, value, onChange, name }) {
  return (
    <div className="form-group">
      <label className="form-label d-block">{label}</label>
      <div className="row">
        {options.map((opt) => {
          const val = typeof opt === "string" ? opt : opt.value;
          const txt = typeof opt === "string" ? opt : opt.label;
          return (
            <div className="col-sm-6 col-md-4" key={`${name}-${val}`}>
              <label className="d-flex align-items-center gap-2">
                <input
                  type="radio"
                  name={name}
                  value={val}
                  checked={value === val}
                  onChange={(e) => onChange(e.target.value)}
                />
                <span>{txt}</span>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Select({ label, options, value, onChange, name, placeholder, required }) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={name}>{label}</label>
      <select
        id={name}
        className="form-control"
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => {
          if (typeof opt === "string") {
            return <option key={`${name}-${opt}`} value={opt}>{opt}</option>;
          }
          return <option key={`${name}-${opt.value}`} value={opt.value}>{opt.label}</option>;
        })}
      </select>
    </div>
  );
}

export default function Onboarding() {
  // Default units by country (metric unless US)
  const [country, setCountry] = useState("Kenya");
  const defaultMetric = useMemo(() => country !== "United States", [country]);

  // Form state
  const [agreed, setAgreed] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [gender, setGender] = useState("");
  const [genderSelf, setGenderSelf] = useState("");
  const [age, setAge] = useState("");

  // Height
  const [heightUnit, setHeightUnit] = useState(defaultMetric ? "cm" : "ftin");
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");

  // Weight
  const [weightUnit, setWeightUnit] = useState(defaultMetric ? "kg" : "lb");
  const [weight, setWeight] = useState("");

  // Waist (optional)
  const [waist, setWaist] = useState("");
  const [waistUnit, setWaistUnit] = useState(defaultMetric ? "cm" : "in");

  const [primaryGoal, setPrimaryGoal] = useState("");
  const [secondary, setSecondary] = useState([]);
  const [targetTimeline, setTargetTimeline] = useState("");
  const [goalImportance, setGoalImportance] = useState("3");
  const [successText, setSuccessText] = useState("");

  const [doctorNoExercise, setDoctorNoExercise] = useState("no");
  const [doctorDetails, setDoctorDetails] = useState("");
  const [medConditions, setMedConditions] = useState([]);
  const [otherCondition, setOtherCondition] = useState("");
  const [pain, setPain] = useState([]);
  const [kneeLimits, setKneeLimits] = useState([]);
  const [otherPain, setOtherPain] = useState("");
  const kneeLimitOpts = ["Deep knee bend", "Impact (running/jumping)", "Lateral moves", "Stairs", "Other"];

  const [medications, setMedications] = useState("");
  const [pregnancy, setPregnancy] = useState("");

  const [experience, setExperience] = useState("");
  const [activity, setActivity] = useState("");
  const [frequency, setFrequency] = useState("");
  const [trainPlace, setTrainPlace] = useState("");
  const [equip, setEquip] = useState([]);
  const [duration, setDuration] = useState("");
  const [trainDays, setTrainDays] = useState([]);

  const [focus, setFocus] = useState([]);
  const [dream, setDream] = useState("");

  const [diet, setDiet] = useState("");
  const [dietOther, setDietOther] = useState("");
  const [dietRestrictions, setDietRestrictions] = useState("");
  const [mealsPerDay, setMealsPerDay] = useState("");
  const [proteinConfidence, setProteinConfidence] = useState("");
  const [alcoholUse, setAlcoholUse] = useState("");
  const [sleepLen, setSleepLen] = useState("");
  const [stress, setStress] = useState("3");
  const [dailySteps, setDailySteps] = useState("");

  const [squatReps, setSquatReps] = useState("");
  const [pushupReps, setPushupReps] = useState("");
  const [plankHold, setPlankHold] = useState("");

  const [confidenceLikert, setConfidenceLikert] = useState("3");
  const [barrier, setBarrier] = useState("");
  const [coachStyle, setCoachStyle] = useState("");
  const [reminderPrefs, setReminderPrefs] = useState([]);

  const [extra, setExtra] = useState("");

  // Convert height to cm if entered ft/in
  const heightInCm = useMemo(() => {
    if (heightUnit === "cm") return Number(heightCm) || 0;
    const ft = Number(heightFt) || 0;
    const inch = Number(heightIn) || 0;
    return Math.round((ft * 12 + inch) * 2.54);
  }, [heightUnit, heightCm, heightFt, heightIn]);

  const weightInKg = useMemo(() => {
    const w = Number(weight) || 0;
    return weightUnit === "kg" ? w : Math.round(w * 0.453592 * 10) / 10;
  }, [weight, weightUnit]);

  const waistInCm = useMemo(() => {
    const w = Number(waist) || 0;
    return waistUnit === "cm" ? w : Math.round(w * 2.54);
  }, [waist, waistUnit]);

  const isUS = country === "United States";

  // Keep units synced when country changes
  React.useEffect(() => {
    setHeightUnit(defaultMetric ? "cm" : "ftin");
    setWeightUnit(defaultMetric ? "kg" : "lb");
    setWaistUnit(defaultMetric ? "cm" : "in");
  }, [defaultMetric]);

  // Simple checks (soft validation)
  const errors = [];
  if (!agreed) errors.push("Please agree to data use so we can personalize your plan.");
  if (!name) errors.push("Name is required.");
  if (!email) errors.push("Email is required.");
  if (!age || age < 13 || age > 100) errors.push("Age must be between 13 and 100.");
  if (!heightInCm || heightInCm < 130 || heightInCm > 220) errors.push("Height should be between 130–220 cm.");
  if (!weightInKg || weightInKg < 40 || weightInKg > 180) errors.push("Weight should be between 40–180 kg.");
  if (!primaryGoal) errors.push("Select a primary goal.");
  if (!targetTimeline) errors.push("Select a target timeline.");

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name,
      email,
      country,
      agreed,
      gender: gender === "self" ? genderSelf : gender,
      age: Number(age),
      height_cm: heightInCm,
      weight_kg: weightInKg,
      waist_cm: waistInCm || null,
      goals: {
        primary: primaryGoal,
        secondary,
        timeline: targetTimeline,
        importance_1to5: Number(goalImportance),
        success_text: successText,
      },
      health: {
        doctorNoExercise,
        doctorDetails: doctorNoExercise === "yes" ? doctorDetails : "",
        conditions: [...medConditions, ...(otherCondition ? [otherCondition] : [])],
        pain: [...pain, ...(otherPain ? [otherPain] : [])],
        kneeLimits: pain.includes("Knee") ? kneeLimits : [],
        medications,
        pregnancy: gender === "female" ? pregnancy : "not_applicable",
      },
      training: {
        experience,
        dayActivity: activity,
        frequency,
        location: trainPlace,
        equipment: equip,
        duration,
        days: trainDays,
      },
      focus: {
        areas: focus,
        dream: dream,
      },
      nutrition: {
        preference: diet === "Other" ? dietOther : diet,
        restrictions: dietRestrictions,
        mealsPerDay,
        proteinConfidence,
        alcohol: alcoholUse,
      },
      lifestyle: {
        sleep: sleepLen,
        stress_1to5: Number(stress),
        dailySteps,
      },
      benchmarks: {
        squatReps: squatReps ? Number(squatReps) : null,
        pushupReps: pushupReps ? Number(pushupReps) : null,
        plankHold,
      },
      motivation: {
        confidence_statement_1to5: Number(confidenceLikert),
        biggestBarrier: barrier,
        coachingStyle: coachStyle,
        reminders: reminderPrefs,
      },
      extra,
      meta: { version: "v1.0" },
    };

    if (errors.length) {
      // Soft-stop; you can replace with toast or inline messages
      alert("Please review:\n\n" + errors.join("\n"));
      return;
    }

    // TODO: replace with your API call
    console.log("Onboarding payload:", payload);
    alert("Thanks! Your onboarding is saved. (Check console for payload)");
  };

  return (
    <div className="section-full content-inner">
      <div className="container">
        <div className="section-head text-center m-b30">
          <h2 className="title">Welcome to Forty+Fit</h2>
          <p className="subtitle">Tell us about you so we can build a plan that fits your life.</p>
        </div>

        <form onSubmit={handleSubmit} className="onboarding-form">
          {/* Basics */}
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label" htmlFor="name">Name *</label>
                <input id="name" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email *</label>
                <input id="email" type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="col-md-6">
              <Select
                label="Country/Region"
                name="country"
                value={country}
                onChange={setCountry}
                options={countries}
              />
              <small className="text-muted d-block m-t5">We’ll default units (cm/kg vs ft+in/lb) from your country, but you can change them.</small>
            </div>
            <div className="col-md-6 d-flex align-items-end">
              <label className="d-flex align-items-center gap-2 m-b0">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                <span>I agree to share my info to personalize my plan.</span>
              </label>
            </div>
          </div>

          <hr />

          {/* Body profile */}
          <div className="row">
            <div className="col-md-6">
              <Select
                label="Gender"
                name="gender"
                value={gender}
                onChange={setGender}
                options={genderOptions}
                placeholder="Select gender"
              />
              {gender === "self" && (
                <div className="form-group">
                  <label className="form-label" htmlFor="genderSelf">Self-describe</label>
                  <input id="genderSelf" className="form-control" value={genderSelf} onChange={(e) => setGenderSelf(e.target.value)} />
                </div>
              )}
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label" htmlFor="age">Age *</label>
                <input id="age" type="number" className="form-control" min={13} max={100} value={age} onChange={(e) => setAge(e.target.value)} required />
              </div>
            </div>

            {/* Height */}
            <div className="col-md-6">
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label">Height *</label>
                  <div className="btn-group">
                    <button type="button" className={`btn btn-sm ${heightUnit === "cm" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setHeightUnit("cm")}>cm</button>
                    <button type="button" className={`btn btn-sm ${heightUnit === "ftin" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setHeightUnit("ftin")}>ft+in</button>
                  </div>
                </div>
                {heightUnit === "cm" ? (
                  <input type="number" className="form-control" placeholder="e.g., 175" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
                ) : (
                  <div className="d-flex gap-2">
                    <input type="number" className="form-control" placeholder="ft" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} />
                    <input type="number" className="form-control" placeholder="in" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} />
                  </div>
                )}
                <small className="text-muted d-block m-t5">We’ll store {heightInCm || 0} cm.</small>
              </div>
            </div>

            {/* Weight */}
            <div className="col-md-6">
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label">Weight *</label>
                  <div className="btn-group">
                    <button type="button" className={`btn btn-sm ${weightUnit === "kg" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setWeightUnit("kg")}>kg</button>
                    <button type="button" className={`btn btn-sm ${weightUnit === "lb" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setWeightUnit("lb")}>lb</button>
                  </div>
                </div>
                <input type="number" className="form-control" placeholder={weightUnit === "kg" ? "e.g., 78" : "e.g., 172"} value={weight} onChange={(e) => setWeight(e.target.value)} />
                <small className="text-muted d-block m-t5">We’ll store {weightInKg || 0} kg.</small>
              </div>
            </div>

            {/* Waist (optional) */}
            <div className="col-md-6">
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label">Waist (optional)</label>
                  <div className="btn-group">
                    <button type="button" className={`btn btn-sm ${waistUnit === "cm" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setWaistUnit("cm")}>cm</button>
                    <button type="button" className={`btn btn-sm ${waistUnit === "in" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setWaistUnit("in")}>in</button>
                  </div>
                </div>
                <input type="number" className="form-control" placeholder={waistUnit === "cm" ? "e.g., 90" : "e.g., 35"} value={waist} onChange={(e) => setWaist(e.target.value)} />
                {waist && <small className="text-muted d-block m-t5">We’ll store {waistInCm || 0} cm.</small>}
              </div>
            </div>
          </div>

          <hr />

          {/* Goals */}
          <div className="row">
            <div className="col-md-6">
              <Select
                label="Primary goal *"
                name="primaryGoal"
                value={primaryGoal}
                onChange={setPrimaryGoal}
                options={primaryGoals}
                placeholder="Select your main goal"
                required
              />
            </div>
            <div className="col-md-6">
              <Select
                label="Target timeline *"
                name="timeline"
                value={targetTimeline}
                onChange={setTargetTimeline}
                options={timeline}
                placeholder="Select timeline"
                required
              />
            </div>
            <div className="col-md-6">
              <CheckboxGroup
                label="Secondary goals (optional)"
                name="secondary"
                options={secondaryGoals}
                values={secondary}
                onChange={setSecondary}
              />
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">How important is this right now?</label>
                <input type="range" min="1" max="5" value={goalImportance} onChange={(e) => setGoalImportance(e.target.value)} className="form-range w-100" />
                <small className="text-muted d-block">1 = low, 5 = very high</small>
              </div>
              <div className="form-group">
                <label className="form-label">What would success look like in 8–12 weeks?</label>
                <textarea className="form-control" rows="3" value={successText} onChange={(e) => setSuccessText(e.target.value)} />
              </div>
            </div>
          </div>

          <hr />

          {/* Health & safety */}
          <div className="row">
            <div className="col-md-6">
              <RadioGroup
                label="Have you been advised by a doctor to avoid exercise?"
                name="doc"
                value={doctorNoExercise}
                onChange={setDoctorNoExercise}
                options={["yes", "no"]}
              />
              {doctorNoExercise === "yes" && (
                <div className="form-group">
                  <label className="form-label">Please share details or restrictions</label>
                  <textarea className="form-control" rows="2" value={doctorDetails} onChange={(e) => setDoctorDetails(e.target.value)} />
                </div>
              )}
            </div>
            <div className="col-md-6">
              <CheckboxGroup
                label="Medical conditions (optional)"
                name="conditions"
                options={[...conditions, "None"]}
                values={medConditions}
                onChange={setMedConditions}
              />
              <div className="form-group m-t10">
                <label className="form-label">Other condition (optional)</label>
                <input className="form-control" value={otherCondition} onChange={(e) => setOtherCondition(e.target.value)} />
              </div>
            </div>

            <div className="col-md-6">
              <CheckboxGroup
                label="Injuries or pain (optional)"
                name="pain"
                options={[...painAreas, "None"]}
                values={pain}
                onChange={setPain}
              />
              {pain.includes("Knee") && (
                <CheckboxGroup
                  label="Knee pain limits"
                  name="kneeLimits"
                  options={kneeLimitOpts}
                  values={kneeLimits}
                  onChange={setKneeLimits}
                />
              )}
              <div className="form-group m-t10">
                <label className="form-label">Other pain/injury (optional)</label>
                <input className="form-control" value={otherPain} onChange={(e) => setOtherPain(e.target.value)} />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">Medications impacting exercise (optional)</label>
                <textarea className="form-control" rows="2" value={medications} onChange={(e) => setMedications(e.target.value)} />
              </div>
              {gender === "female" && (
                <Select
                  label="Pregnancy / postpartum"
                  name="pregnancy"
                  value={pregnancy}
                  onChange={setPregnancy}
                  options={["Pregnant", "Postpartum (<12 months)", "Not applicable"]}
                  placeholder="Select one"
                />
              )}
            </div>
          </div>

          <hr />

          {/* Experience & activity */}
          <div className="row">
            <div className="col-md-6">
              <Select
                label="Previous workout experience"
                name="experience"
                value={experience}
                onChange={setExperience}
                options={[
                  "Currently train regularly",
                  "Trained within the past year",
                  "Trained >1 year ago",
                  "New to training",
                ]}
                placeholder="Select one"
              />
            </div>
            <div className="col-md-6">
              <Select
                label="How active is your typical day?"
                name="activity"
                value={activity}
                onChange={setActivity}
                options={dayActivity}
                placeholder="Select one"
              />
            </div>

            <div className="col-md-6">
              <Select
                label="How often do you exercise?"
                name="frequency"
                value={frequency}
                onChange={setFrequency}
                options={freq}
                placeholder="Select one"
              />
            </div>
            <div className="col-md-6">
              <Select
                label="Where do you prefer to train?"
                name="place"
                value={trainPlace}
                onChange={setTrainPlace}
                options={locations}
                placeholder="Select one"
              />
            </div>

            <div className="col-md-6">
              <CheckboxGroup
                label="Equipment available"
                name="equip"
                options={equipment}
                values={equip}
                onChange={setEquip}
              />
            </div>
            <div className="col-md-6">
              <Select
                label="Session duration you can commit to"
                name="duration"
                value={duration}
                onChange={setDuration}
                options={durations}
                placeholder="Select one"
              />
              <CheckboxGroup
                label="Preferred training days"
                name="days"
                options={days}
                values={trainDays}
                onChange={setTrainDays}
              />
            </div>
          </div>

          <hr />

          {/* Focus areas & dream body */}
          <div className="row">
            <div className="col-md-6">
              <CheckboxGroup
                label="What do you want to focus on?"
                name="focus"
                options={focusAreas}
                values={focus}
                onChange={setFocus}
              />
            </div>
            <div className="col-md-6">
              <Select
                label="Dream body style"
                name="dream"
                value={dream}
                onChange={setDream}
                options={dreamBody}
                placeholder="Select one"
              />
            </div>
          </div>

          <hr />

          {/* Nutrition & lifestyle */}
          <div className="row">
            <div className="col-md-6">
              <Select
                label="Diet preference"
                name="diet"
                value={diet}
                onChange={setDiet}
                options={[...dietPrefs, "Other"]}
                placeholder="Select one"
              />
              {diet === "Other" && (
                <div className="form-group">
                  <label className="form-label">Please specify</label>
                  <input className="form-control" value={dietOther} onChange={(e) => setDietOther(e.target.value)} />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Dietary restrictions / allergies (optional)</label>
                <input className="form-control" value={dietRestrictions} onChange={(e) => setDietRestrictions(e.target.value)} />
              </div>
              <Select
                label="Typical meals per day"
                name="meals"
                value={mealsPerDay}
                onChange={setMealsPerDay}
                options={["2", "3", "4", "5+"]}
                placeholder="Select one"
              />
              <Select
                label="Protein intake confidence"
                name="protein"
                value={proteinConfidence}
                onChange={setProteinConfidence}
                options={["I meet it", "I probably don’t", "Not sure"]}
                placeholder="Select one"
              />
            </div>

            <div className="col-md-6">
              <Select
                label="Alcohol"
                name="alcohol"
                value={alcoholUse}
                onChange={setAlcoholUse}
                options={alcohol}
                placeholder="Select one"
              />
              <Select
                label="Sleep"
                name="sleep"
                value={sleepLen}
                onChange={setSleepLen}
                options={sleep}
                placeholder="Select one"
              />
              <div className="form-group">
                <label className="form-label">Stress level</label>
                <input type="range" min="1" max="5" value={stress} onChange={(e) => setStress(e.target.value)} className="form-range w-100" />
                <small className="text-muted d-block">1 = low, 5 = high</small>
              </div>
              <Select
                label="Daily steps (approx.)"
                name="steps"
                value={dailySteps}
                onChange={setDailySteps}
                options={steps}
                placeholder="Select one"
              />
            </div>
          </div>

          <hr />

          {/* Benchmarks */}
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label className="form-label">Bodyweight squat (reps in one set)</label>
                <input type="number" className="form-control" min="0" value={squatReps} onChange={(e) => setSquatReps(e.target.value)} placeholder="Optional" />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="form-label">Push-ups (reps in one set)</label>
                <input type="number" className="form-control" min="0" value={pushupReps} onChange={(e) => setPushupReps(e.target.value)} placeholder="Optional" />
              </div>
            </div>
            <div className="col-md-4">
              <Select
                label="Plank hold"
                name="plank"
                value={plankHold}
                onChange={setPlankHold}
                options={["<30s", "30–60s", "60–90s", ">90s", "Not sure"]}
                placeholder="Select one (optional)"
              />
            </div>
          </div>

          <hr />

          {/* Motivation & support */}
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">“I wish to feel more confident in myself.”</label>
                <input type="range" min="1" max="5" value={confidenceLikert} onChange={(e) => setConfidenceLikert(e.target.value)} className="form-range w-100" />
                <small className="text-muted d-block">1 = strongly disagree, 5 = strongly agree</small>
              </div>
              <Select
                label="Biggest barrier right now"
                name="barrier"
                value={barrier}
                onChange={setBarrier}
                options={["Time", "Motivation", "Pain or injury", "Equipment", "Knowledge", "Other"]}
                placeholder="Select one"
              />
            </div>
            <div className="col-md-6">
              <Select
                label="Coaching style you prefer"
                name="coachStyle"
                value={coachStyle}
                onChange={setCoachStyle}
                options={coachingStyle}
                placeholder="Select one"
              />
              <CheckboxGroup
                label="How would you like reminders?"
                name="reminders"
                options={reminders}
                values={reminderPrefs}
                onChange={setReminderPrefs}
              />
            </div>
          </div>

          <hr />

          {/* Final */}
          <div className="form-group">
            <label className="form-label">Anything else we should know?</label>
            <textarea className="form-control" rows="3" value={extra} onChange={(e) => setExtra(e.target.value)} />
          </div>

          {errors.length > 0 && (
            <div className="alert alert-warning m-t20">
              <strong>Please review:</strong>
              <ul className="m-b0">
                {errors.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-center m-t30">
            <button type="submit" className="btn btn-primary btn-lg">Save & Continue</button>
          </div>
        </form>
      </div>
    </div>
  );
}



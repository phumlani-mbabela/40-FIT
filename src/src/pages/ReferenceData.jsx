import React from "react"; import { useReferenceData } from "../hooks/useReferenceData";
export default function ReferenceData() {
  const { loading, error, genders, bodyTypes, tiers, ranks, countries, provinces, cities } = useReferenceData();
  if (loading) return <div className="container py-5">Loading reference data…</div>;
  if (error) return <div className="container py-5 text-danger">Error: {error}</div>;
  const Section = ({ title, items }) => (<div className="mb-4"><h5 className="mb-2">{title}</h5><ul className="list-group">{items.map((x,i)=><li className="list-group-item" key={i}>{x.name || x.code}</li>)}</ul></div>);
  return (<div className="container py-5">
      <h3 className="mb-4">Reference Data</h3>
      <Section title="Subscription Tiers" items={tiers} />
      <Section title="Genders" items={genders} />
      <Section title="Body Types" items={bodyTypes} />
      <Section title="Ranks" items={ranks} />
      <Section title="Countries" items={countries} />
      <Section title="Provinces (ZA)" items={provinces} />
      <Section title="Cities (Gauteng)" items={cities} />
    </div>);
}


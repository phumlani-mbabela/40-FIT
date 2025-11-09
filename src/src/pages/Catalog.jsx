import React, { useMemo, useState } from "react";
import { useCourses } from "../hooks/useCourses";
import { usePrograms } from "../hooks/usePrograms";
import PremiumGuard from "../components/guards/PremiumGuard";
function Badge({ tier }) { const cls = tier === "premium" ? "badge bg-danger" : "badge bg-success"; return <span className={cls} style={{ textTransform: "capitalize" }}>{tier}</span>; }
export default function Catalog() {
  const { items: programs, loading: loadingP } = usePrograms();
  const { items: courses, loading: loadingC } = useCourses();
  const [filter, setFilter] = useState("all");
  const filteredPrograms = useMemo(()=> programs.filter(p => filter==="all" ? true : p.tier===filter), [programs, filter]);
  const filteredCourses = useMemo(()=> courses.filter(c => filter==="all" ? true : c.tier===filter), [courses, filter]);
  return (
    <div className="page-content">
      <div className="container py-4">
        <h2 className="mb-2">Catalog</h2>
        <p className="text-muted">Programs & Courses (free and premium)</p>
        <div className="d-flex gap-2 mt-3">
          <button className={`btn ${filter==="all"?"btn-primary":"btn-outline-primary"}`} onClick={()=>setFilter("all")}>All</button>
          <button className={`btn ${filter==="free"?"btn-success":"btn-outline-success"}`} onClick={()=>setFilter("free")}>Free</button>
          <button className={`btn ${filter==="premium"?"btn-danger":"btn-outline-danger"}`} onClick={()=>setFilter("premium")}>Premium</button>
        </div>
      </div>
      <div className="container pb-5">
        <h4 className="mb-3">Programs</h4>
        {loadingP ? <p>Loading programs…</p> : (
          <div className="row">
            {filteredPrograms.map(p => (
              <div className="col-md-6 col-lg-4 mb-4" key={p.id}>
                <div className="card h-100"><div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <h5 className="card-title">{p.title}</h5><Badge tier={p.tier} />
                  </div>
                  <p className="card-text">{p.description}</p>
                  {p.tier === "premium" ? <PremiumGuard><a href={`/programs/${p.id}`} className="btn btn-primary">Open Program</a></PremiumGuard>
                    : <a href={`/programs/${p.id}`} className="btn btn-outline-primary">Open Program</a>}
                </div></div>
              </div>
            ))}
          </div>
        )}
        <h4 className="mt-4 mb-3">Courses</h4>
        {loadingC ? <p>Loading courses…</p> : (
          <div className="row">
            {filteredCourses.map(c => (
              <div className="col-md-6 col-lg-4 mb-4" key={c.id}>
                <div className="card h-100"><div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <h5 className="card-title">{c.title}</h5><Badge tier={c.tier} />
                  </div>
                  <p className="card-text">{c.summary}</p>
                  {c.tier === "premium" ? <PremiumGuard><a href={`/courses/${c.id}`} className="btn btn-primary">Open Course</a></PremiumGuard>
                    : <a href={`/courses/${c.id}`} className="btn btn-outline-primary">Open Course</a>}
                </div></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


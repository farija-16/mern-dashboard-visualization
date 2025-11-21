import { useEffect, useState } from "react";

export default function FilterPanel({ filters, setFilters }) {
  const [show, setShow] = useState(true);

  const [options, setOptions] = useState({
    end_year: [],
    topic: [],
    sector: [],
    region: [],
    pestle: [],
    source: [],
    published: [],
    country: [],
    impact: [],
  });

  // Load filter option lists from backend
  useEffect(() => {
    async function loadOptions() {
      try {
        const res = await fetch("http://localhost:5000/api/filters/options");
        const data = await res.json();
        setOptions(data);
      } catch (err) {
        console.error("Failed to load filter options:", err);
      }
    }

    loadOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value === "All" ? "" : value,
    }));
  };

  // Helper to bind dropdown values
  const bindValue = (field) => filters[field] || "All";

  return (
    <div className="filters-card">
      {/* Header */}
      <div className="filters-header" onClick={() => setShow(!show)}>
        <h3 className="filters-title">Filters</h3>
        <span className="filters-toggle">{show ? "Hide ▲" : "Show ▼"}</span>
      </div>

      {/* Body */}
      {show && (
        <div className="filters-body">
          <div className="filters-grid">
            
            {/* End Year */}
            <div className="filter-field">
              <label className="filter-label">End Year</label>
              <select
                name="end_year"
                value={bindValue("end_year")}
                className="filter-control"
                onChange={handleChange}
              >
                <option>All</option>
                {options.end_year.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Topic */}
            <div className="filter-field">
              <label className="filter-label">Topic</label>
              <select
                name="topic"
                value={bindValue("topic")}
                className="filter-control"
                onChange={handleChange}
              >
                <option>All</option>
                {options.topic.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Sector */}
            <div className="filter-field">
              <label className="filter-label">Sector</label>
              <select
                name="sector"
                value={bindValue("sector")}
                className="filter-control"
                onChange={handleChange}
              >
                <option>All</option>
                {options.sector.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Region */}
            <div className="filter-field">
              <label className="filter-label">Region</label>
              <select
                name="region"
                value={bindValue("region")}
                className="filter-control"
                onChange={handleChange}
              >
                <option>All</option>
                {options.region.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* PESTLE */}
            <div className="filter-field">
              <label className="filter-label">PESTLE</label>
              <select
                name="pestle"
                value={bindValue("pestle")}
                className="filter-control"
                onChange={handleChange}
              >
                <option>All</option>
                {options.pestle.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Source */}
            <div className="filter-field">
              <label className="filter-label">Source</label>
              <select
                name="source"
                value={bindValue("source")}
                className="filter-control"
                onChange={handleChange}
              >
                <option>All</option>
                {options.source.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Published */}
            <div className="filter-field">
              <label className="filter-label">Published</label>
              <select
                name="published"
                value={bindValue("published")}
                className="filter-control"
                onChange={handleChange}
              >
                <option>All</option>
                {options.published.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Country */}
            <div className="filter-field">
              <label className="filter-label">Country</label>
              <select
                name="country"
                value={bindValue("country")}
                className="filter-control"
                onChange={handleChange}
              >
                <option>All</option>
                {options.country.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Impact */}
            <div className="filter-field">
              <label className="filter-label">Impact</label>
              <select
                name="impact"
                value={bindValue("impact")}
                className="filter-control"
                onChange={handleChange}
              >
                <option>All</option>
                {options.impact.map((i) => (
                  <option key={i}>{i}</option>
                ))}
              </select>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

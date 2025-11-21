import { useEffect, useState } from "react";
import "./index.css";
import FilterPanel from "./components/FilterPanel";

import TopicBarChart from "./charts/TopicBarChart";
import CountryIntensityChart from "./charts/CountryIntensityChart";
import YearTrendChart from "./charts/YearTrendChart";
import ScatterPlot from "./charts/ScatterPlot";

import KpiSection from "./components/KpiSection";

import { fetchDashboard, fetchKPIs } from "./services/api";

export default function App() {
  const [filters, setFilters] = useState({});
  const [topicData, setTopicData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [yearData, setYearData] = useState([]);
  const [scatterData, setScatterData] = useState([]);
  const [records, setRecords] = useState([]);

  const [kpi, setKpi] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = async (f = {}) => {
    try {
      setLoading(true);
      setError("");

      const res = await fetchDashboard(f);
      const kpiRes = await fetchKPIs(f);

      setTopicData(res.data.topic || []);
      setCountryData(res.data.country || []);
      setYearData(res.data.years || []);
      setScatterData(res.data.scatter || []);
      setRecords(res.data.records || []);

      setKpi(kpiRes.data || null);
    } catch (err) {
      console.error("Dashboard load error:", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard(filters);
  }, [filters]);

  return (
    <div className="app-container">
      <h1 className="page-title">Visualization Dashboard</h1>
      <p className="page-subtitle">
        Insights from intensity, likelihood, relevance, topics & regions
      </p>

      {/* ------------ KPI SECTION  ----------- */}
      <KpiSection data={kpi} />
      {/* ------------------------------------------------ */}

      <FilterPanel filters={filters} setFilters={setFilters} />

      {error && <div className="error-banner">{error}</div>}
      {loading && <div className="loading-banner">Loading...</div>}

      {/* Chart Row 1 */}
      <div className="dashboard-row">
        <div className="dashboard-card">
          <h3 className="card-title">Topic Distribution</h3>
          <TopicBarChart data={topicData} />
        </div>

        <div className="dashboard-card">
          <h3 className="card-title">Intensity by Country</h3>
          <CountryIntensityChart data={countryData} />
        </div>
      </div>

      {/* Chart Row 2 */}
      <div className="dashboard-row">
        <div className="dashboard-card">
          <h3 className="card-title">Trend by Year</h3>
          <YearTrendChart data={yearData} />
        </div>

        <div className="dashboard-card">
          <h3 className="card-title">Intensity vs Likelihood</h3>
          <ScatterPlot data={scatterData} />
        </div>
      </div>

      {/* Records Table */}
      <div className="dashboard-card table-card">
        <h3 className="card-title">Records Table</h3>

        <div className="table-wrapper">
          <table className="records-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Country</th>
                <th>Topic</th>
                <th>Sector</th>
                <th>Intensity</th>
              </tr>
            </thead>

            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-cell">
                    No records match the selected filters.
                  </td>
                </tr>
              ) : (
                records.map((r, index) => (
                  <tr key={index}>
                    <td>{r.title}</td>
                    <td>{r.country || "-"}</td>
                    <td>{r.topic || "-"}</td>
                    <td>{r.sector || "-"}</td>
                    <td>{r.intensity || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

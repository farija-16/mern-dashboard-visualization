import React from "react";

export default function KpiSection({ data }) {
  if (!data) return null;

  const { totalRecords, countryCount, avgIntensity, topTopic, topSector } = data;

  const cards = [
    { label: "Records", value: totalRecords ?? "-" },
    { label: "Countries", value: countryCount ?? "-" },
    { label: "Avg Intensity", value: avgIntensity ? avgIntensity.toFixed(2) : "-" },
    { label: "Top Topic", value: topTopic?._id ?? "-" },
    { label: "Top Sector", value: topSector?._id ?? "-" }
  ];

  return (
    <div className="kpi-row">
      {cards.map((kpi) => (
        <div key={kpi.label} className="kpi-card">
          <div className="kpi-label">{kpi.label}</div>
          <div className="kpi-value">{kpi.value}</div>
        </div>
      ))}
    </div>
  );
}

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function YearTrendChart({ data = [] }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!Array.isArray(data)) return;

    const container = d3.select(svgRef.current);
    container.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 60, left: 60 };
    const width = svgRef.current.clientWidth || 700;
    const height = 300;

    const svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const items = data
      .map((d) => ({
        year: d._id || d.year,
        count: d.count,
      }))
      .filter((d) => d.year != null)
      .sort((a, b) => a.year - b.year);

    const x = d3
      .scaleBand()
      .domain(items.map((d) => d.year))
      .range([0, innerW])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(items, (d) => d.count) || 1])
      .range([innerH, 0])
      .nice();

    g.append("g").call(d3.axisLeft(y));
    g.append("g")
    .attr("transform", `translate(0, ${innerH})`)
    .call(d3.axisBottom(x)
    .tickValues(
      items.map((d) => d.year)
      .filter((_ , i) => i % 1 === 0)
    ).tickFormat((d) => d))
    .selectAll("text")
    .attr("transform","rotate(-40)")
    .style("text-anchor","end");

    const line = d3
      .line()
      .x((d) => x(d.year) + x.bandwidth() / 2)
      .y((d) => y(d.count));

    g.append("path")
      .datum(items)
      .attr("fill", "none")
      .attr("stroke", "#2b6cb0")
      .attr("stroke-width", 3)
      .attr("d", line);

    g.selectAll("circle")
      .data(items)
      .join("circle")
      .attr("cx", (d) => x(d.year) + x.bandwidth() / 2)
      .attr("cy", (d) => y(d.count))
      .attr("r", 5)
      .attr("fill", "#2b6cb0");
  }, [data]);

  return <div ref={svgRef} style={{ width: "100%" }}></div>;
}

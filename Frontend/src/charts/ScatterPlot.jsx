import React, { useEffect, useRef } from "react";
import * as d3 from "d3";


export default function ScatterPlot ({ data = []}){
    const svgRef = useRef();

    useEffect(() => {
        if (!Array.isArray(data)) return;

        const container = d3.select(svgRef.current);
        container.selectAll("*").remove();
        const margin = { top : 20, right : 20, bottom : 50, left : 60};
        const width = svgRef.current.clientWidth || 700;
        const height = 320;

        const svg  = container.append("svg").attr("width",width).attr("height",height);

        const innerW = width - margin.left - margin.right;
        const innerH = height - margin.top - margin.bottom;

        const g = svg.append("g").attr("transform",`translate(${margin.left}, ${margin.top})`);

        //Format & Sort
        const items = data.filter((d) => d.likelihood != null && d.intensity != null)
        .map((d) => ({ 
            intensity  : d.intensity,
            likelihood : d.likelihood, 
            label : `${d.country || ""} - ${d.topic || ""}`,
        }));

        const x = d3.scaleLinear().domain([0,d3.max(items, (d) => d.likelihood || 1)])
        .range([0,innerW]).nice();

        const y = d3.scaleLinear().domain([0,d3.max(items, (d) => d.intensity || 1)])
        .range([innerH,0]).nice();
        
        // Axes
        g.append("g").call(d3.axisLeft(y));
        g.append("g").attr("transform",`translate(0, ${innerH})`)
        .call(d3.axisBottom(x));

        g.selectAll("circle").data(items).join("circle").attr("cx", (d) => x(d.likelihood))
        .attr("cy",(d) => y(d.intensity))
        .attr("r",5)
        .attr("fill","#e53e3e").attr("opacity",0.7)
        .on("mouseenter" , function() {
            d3.select(this).attr("r",8).attr("opacity",1);
        })
        .on("mouseleave" , function() {
            d3.select(this).attr("r",5).attr("opacity",0.7);
        });
    }, [data]);
        
    return <div ref={svgRef} style={{ width : "100%" }}></div>
}
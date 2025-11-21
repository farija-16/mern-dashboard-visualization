import React, {useEffect,useRef} from "react";
import *  as d3 from "d3";

export default function CountryByIntensity ({data = []}) {
    const svgRef = useRef();

    useEffect(() => {
        if(!Array.isArray(data)) return;

        const container = d3.select(svgRef.current);
        container.selectAll("*").remove();
        
        const margin = { top : 20, right : 20, bottom : 80, left : 70};
        const width = svgRef.current.clientWidth || 700;
        const height = 320;

        const svg    = container.append("svg").attr("width",width).attr("height",height);

        const innerW = width - margin.left - margin.right;
        const innerH = height - margin.top - margin.bottom;
        const g = svg.append("g").attr("transform",`translate(${margin.left}, ${margin.top})`);

        //Format & Sort
        const items = data.map((d) => ({ 
            country : d._id || d.country || "Unknown",
            avgIntensity : d.avgIntensity || 0,
        })).sort((a,b) => b.avgIntensity - a.avgIntensity).slice(0,15);

        const x = d3.scaleBand().domain(items.map((d) => d.country))
                .range([0,innerW]).padding(0.25);
        
        const y = d3.scaleLinear().domain([0,d3.max(items, (d) => d.avgIntensity) || 1])
                .range([innerH, 0]).nice();
        
        //Y Axis
        g.append("g").call(d3.axisLeft(y));

        //X Axis
        g.append("g").attr("transform",`translate(0, ${innerH})`)
        .call(d3.axisBottom(x)).selectAll("text")
        .attr("transform","rotate(-45)")
        .style("text-anchor","end");

        //Bars
        g.selectAll(".bar").data(items).join("rect").attr("class","bar")
        .attr("x",(d) => x(d.country)).attr("y", (d) => y(d.avgIntensity))
        .attr("width",x.bandwidth).attr("height", (d) => innerH - y(d.avgIntensity))
        .attr("fill","#3182ce")
        .on("mouseenter",function (){
            d3.select(this).attr("fill","#63b3ed");
        })
        .on("mouseleave", function() {
           d3.select(this).attr("fill","#3182ce");
        })

        //Labels
        g.selectAll(".label").data(items).join("text")
        .text((d) => d.avgIntensity.toFixed(1))
        .attr("x", (d) => x(d.country) + x.bandwidth()/2)
        .attr("y", (d) => y(d.avgIntensity) - 6)
        .attr("text-anchor","middle")
        .attr("font-size",11)
        .attr("fill","#333");
    }, [data]);
    return <div ref={svgRef} style={ { width : "100%" }}></div>
            
            
            
}
            
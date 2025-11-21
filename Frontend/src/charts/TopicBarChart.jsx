import React, {useEffect , useRef } from "react";
import * as d3 from "d3";

export default function TopicBarChart({ data = []}) {
    const svgRef = useRef();

    useEffect(() => {
        if (!Array.isArray(data)) return;

        const container = d3.select(svgRef.current);
        container.selectAll("*").remove();

        const margin = { top : 20, right : 12, bottom : 80, left : 60};
        const width  = svgRef.current.clientWidth || 700;
        const height = 300;

        const svg    = container.append("svg").attr("width",width).attr("height",height);
        
        const innerW = width - margin.left - margin.right;
        const innerH = height - margin.top - margin.bottom;

        const g = svg.append("g").attr("transform",`translate(${margin.left},${margin.top})`);

        //Format items correctly
        const items = data.map((d) => ({ 
            topic : d._id,
            count : d.count || 0,
        })).sort((a,b) => b.count - a.count).slice(0,20);

        const x = d3.scaleBand().domain(items.map((d) => d.topic))
        .range([0,innerW]).padding(0.2);

        const y = d3.scaleLinear().domain([0,d3.max(items, (d) => d.count) || 1])
        .range([innerH, 0]).nice();
        
        //Y axis
        g.append("g").call(d3.axisLeft(y).ticks(5));

        // X axis
        g.append("g").attr("transform",`translate(0,${innerH})`)
        .call(d3.axisBottom(x)).selectAll("text").attr("transform","rotate(-45)")
        .style("text-anchor","end")

        //Bars
        g.selectAll(".bar").data(items).join("rect").attr("class","bar")
        .attr("x",(d) => x(d.topic)).attr("y", (d) => y(d.count))
        .attr("width",x.bandwidth())
        .attr("height", (d) => innerH - y(d.count))
        .attr("fill","#6b46c1")
        .on("mouseenter",function (){
            d3.select(this).attr("fill","#805ad5");
        })
        .on("mouseleave", function() {
            d3.select(this).attr("fill","#6b46c1");
        })

        //Labels
        g.selectAll(".label").data(items).join("text")
        .text((d) => d.count)
        .attr("x", (d) => x(d.topic) + x.bandwidth()/2)
        .attr("y", (d) => y(d.count) - 6)
        .attr("text-anchor","middle")
        .attr("font-size",11)
        .attr("fill","#333");

    }, [data]);
    return <div ref={svgRef} style={ { width : "100%"}}></div>;
}
           
           
           
            
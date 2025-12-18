import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const LineChart = ({ data, width = 700, height = 350 }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // --- Chart Setup ---
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Select the SVG container and clear previous renders
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .html(''); // Clear previous chart

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // --- Scales ---
    const xScale = d3.scaleLinear()
      .domain([0, data.length - 1]) // X-axis is the index of the data point
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([d3.min(data), d3.max(data)]) // Y-axis is the heart rate value
      .range([innerHeight, 0])
      .nice();

    // --- Axes ---
    const xAxis = d3.axisBottom(xScale).ticks(10);
    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis)
      .attr('color', '#9ca3af'); // Gray color for axis text

    const yAxis = d3.axisLeft(yScale).ticks(5);
    g.append('g')
      .call(yAxis)
      .attr('color', '#9ca3af'); // Gray color for axis text

    // Axis labels
    g.append('text')
      .attr('class', 'y-label')
      .attr('x', -innerHeight / 2)
      .attr('y', -35)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .style('fill', '#e5e7eb')
      .text('Heart Rate (BPM)');

    g.append('text')
      .attr('class', 'x-label')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 35)
      .attr('text-anchor', 'middle')
      .style('fill', '#e5e7eb')
      .text('Sample Number');
      
    // --- Line Generator ---
    const lineGenerator = d3.line()
      .x((d, i) => xScale(i))
      .y(d => yScale(d))
      .curve(d3.curveBasis);

    // --- Draw the Line ---
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#22d3ee') // A nice cyan color
      .attr('stroke-width', 1.5)
      .attr('d', lineGenerator);

  }, [data, width, height]); // Redraw chart if data or dimensions change

  return (
    <svg ref={svgRef}></svg>
  );
};

export default LineChart;


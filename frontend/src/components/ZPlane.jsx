import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const ZPlane = ({ zeros, poles, width = 350, height = 350 }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!zeros || !poles) return;

    // --- Setup ---
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .html('');

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // --- Scales ---
    // The Z-plane is centered at (0,0) and typically extends from -1 to 1 on both axes.
    // We'll give it a little extra space.
    const domain = 1.2;
    const xScale = d3.scaleLinear().domain([-domain, domain]).range([0, innerWidth]);
    const yScale = d3.scaleLinear().domain([-domain, domain]).range([innerHeight, 0]);

    // --- Draw Axes and Unit Circle ---
    // X-Axis
    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', yScale(0))
      .attr('y2', yScale(0))
      .attr('stroke', '#4b5563');

    // Y-Axis
    g.append('line')
      .attr('x1', xScale(0))
      .attr('x2', xScale(0))
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#4b5563');

    // Unit Circle
    g.append('circle')
      .attr('cx', xScale(0))
      .attr('cy', yScale(0))
      .attr('r', xScale(1) - xScale(0)) // Radius corresponds to 1 unit
      .attr('stroke', '#6b7280')
      .attr('stroke-dasharray', '4 4')
      .attr('fill', 'none');

    // --- Plot Zeros (Circles) ---
    g.selectAll('.zero')
      .data(zeros)
      .enter()
      .append('circle')
      .attr('class', 'zero')
      .attr('cx', d => xScale(d.re))
      .attr('cy', d => yScale(d.im))
      .attr('r', 5)
      .attr('fill', 'none')
      .attr('stroke', '#34d399') // Green
      .attr('stroke-width', 2);

    // --- Plot Poles (Crosses) ---
    const cross = d3.symbol().type(d3.symbolCross).size(50);
    g.selectAll('.pole')
      .data(poles)
      .enter()
      .append('path')
      .attr('class', 'pole')
      .attr('d', cross)
      .attr('transform', d => `translate(${xScale(d.re)}, ${yScale(d.im)})`)
      .attr('stroke', '#fb7185') // Red
      .attr('stroke-width', 2);
      
  }, [zeros, poles, width, height]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-cyan-300">Filter Z-Plane</h2>
      <div className="w-full bg-gray-700 rounded-md flex items-center justify-center">
         <svg ref={svgRef}></svg>
      </div>
      <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-400">
        <span><b className="text-red-400">X</b> Pole</span>
        <span><b className="text-green-400">O</b> Zero</span>
      </div>
    </div>
  );
};

export default ZPlane;

import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import './analysis.css';

const SongListNetworkGraph = () => {
  const chartRef = useRef(null);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/getLibrary', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('token'),
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setSongs(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      drawChart();
    }
  }, [songs]);

  const drawChart = () => {
    const width = 600;
    const height = 400;

    const svg = d3.select(chartRef.current).attr('width', width).attr('height', height);

    const simulation = d3.forceSimulation().force('link', d3.forceLink().id((d) => d.id));

    const nodes = new Map();

    songs.forEach((song) => {
      song.artists.forEach((artist) => {
        const artistId = artist.toLowerCase();
        if (!nodes.has(artistId)) {
          nodes.set(artistId, { id: artistId });
        }
      });
    });

    simulation.nodes(Array.from(nodes.values())).on('tick', () => {
      node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
    });

    // Create nodes
    const node = svg
      .selectAll('.node')
      .data(nodes.values())
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('r', 8)
      .style('fill', '#1f78b4')
      .call(
        d3
          .drag()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    const label = svg
      .selectAll('.label')
      .data(nodes.values())
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('dy', 3)
      .text((d) => d.id);

    svg.call(d3.zoom().on('zoom', (event) => svg.attr('transform', event.transform)));

    node.append('title').text((d) => d.id);
  };

  return (
    <div className='analysis-table'>
      <h2>Song List Network Graph</h2>
      <svg ref={chartRef}></svg>
    </div>
  );
};

export default function RecomPlaylist() {
  return <SongListNetworkGraph />;
}

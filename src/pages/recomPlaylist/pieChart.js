import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import './analysis.css';

const SongListPieChart = () => {
  const chartRef = useRef(null);
  const [songs, setSongs] = useState([]);
  const [type, setType] = useState('genre');

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
  }, [songs, type]);

  const drawChart = () => {
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3
      .select(chartRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const dataMap = new Map();

    songs.forEach((song) => {
      const key =
        type === 'genre'
          ? song.genre.toLowerCase()
          : type === 'artist'
          ? song.artist.toLowerCase()
          : song.album.toLowerCase();

      const songSet = dataMap.get(key) || new Set();
      songSet.add(song.song);
      dataMap.set(key, songSet);
    });

    const labels = [...dataMap.keys()];
    const data = labels.map((key) => dataMap.get(key).size);

    const color = d3.scaleOrdinal().range(d3.schemeCategory10);

    const pie = d3.pie();
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const arcs = pie(data);

    svg
      .selectAll('path')
      .data(arcs)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (_, i) => color(i))
      .attr('stroke', 'white')
      .style('stroke-width', '2px');

    // Create legend
    const legend = svg
      .selectAll('.legend')
      .data(labels)
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(0,${i * 20})`);

    legend
      .append('rect')
      .attr('x', width / 2 + 20)
      .attr('width', 18)
      .attr('height', 18)
      .attr('fill', (_, i) => color(i));

    legend
      .append('text')
      .attr('x', width / 2 + 44)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('text-anchor', 'start')
      .text((d) => d);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  return (
    <div className='analysis-table'>
      <h2>Song List Pie Chart</h2>
      <div>
        <label>Select Type: </label>
        <select value={type} onChange={handleTypeChange}>
          <option value='genre'>Genre</option>
          <option value='artist'>Artist</option>
          <option value='album'>Album</option>
        </select>
      </div>
      <svg ref={chartRef}></svg>
    </div>
  );
};

export default function RecomPlaylist() {
  return <SongListPieChart />;
}

import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import './analysis.css';

const SongListHistogram = () => {
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
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

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

    const xScale = d3.scaleBand().domain(labels).range([0, width]).padding(0.1);
    const yScale = d3.scaleLinear().domain([0, d3.max(data)]).range([height, 0]);


    svg
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d, i) => xScale(labels[i]))
      .attr('width', xScale.bandwidth())
      .attr('y', (d) => yScale(d))
      .attr('height', (d) => height - yScale(d));

    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    svg.append('g').call(d3.axisLeft(yScale));
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  return (
    <div className='analysis-table'>
      <h2>Song List Histogram</h2>
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
  return <SongListHistogram />;
}

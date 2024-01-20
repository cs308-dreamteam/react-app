import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './analysis_new.css';

const SongListNetworkGraph = () => {
  const svgRef = useRef();
  const [songs, setSongs] = useState([]);
  const [type, setType] = useState('genre');
  const [avgs, setAvgs] = useState([0,0,0,0])

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
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/analysis_data', {
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
        console.log(data.result[0]);
        setAvgs([data.result[0].danceability, data.result[0].energy,data.result[0].valence,data.result[0].popularity]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  const paragraph = () => {
    let result = "You listen to songs that are ";
    result += "characterized by their unique qualities. Specifically, ";
    result += (avgs[0] > 0.5) ? "<b><i>they are easy to dance to</i></b>, " : "<b><i>they are not quite suited for dancing</i></b>, ";
    result += "which shows a distinct rhythm pattern. Furthermore, the tempo of your songs is ";
    result += (avgs[1] > 0.5) ? "<b><i>upbeat</i></b>, " : "<b><i>slower-paced</i></b>, ";
    result += "reflecting your preference for either a lively or a relaxed listening experience. In terms of mood, ";
    result += (avgs[2] > 0.5) ? "<b><i>they tend to be happy</i></b>, " : "<b><i>they lean towards being more melancholic</i></b>, ";
    result += "which resonates with the emotional tone you prefer in your music. Finally, regarding popularity, ";
    result += (avgs[3] > 0.5) ? "<b><i>your choices are often mainstream and popular.</i></b> " : "<b><i>you seem to favor more niche and less known tracks.</i></b> ";
    result += "This blend of qualities defines your unique taste in music.";
    console.log(result);
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: result }} 
        style={{ paddingBottom: '20px', paddingLeft: '12px', paddingRight: '12px' }}
      />
  );
}

  useEffect(() => {
    if (songs.length > 0) {
      // Create a map for counting instances based on the type
      const dataMap = new Map();
      songs.forEach((song) => {
        const key = song[type].toLowerCase();
        dataMap.set(key, (dataMap.get(key) || 0) + 1);
      });

      const nodes = Array.from(dataMap, ([id, value]) => ({ id, value }));

      const sizeScale = d3.scaleSqrt()
        .domain(d3.extent(nodes, node => node.value))
        .range([60, 100]);

      const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
      
    // Clear any previous SVG elements
    d3.select(svgRef.current).selectAll('*').remove();
    
    // Set up the SVG and the force simulation
    const svg = d3.select(svgRef.current)
      .attr('viewBox', [-window.innerWidth / 2, -window.innerHeight / 2, window.innerWidth, window.innerHeight])
      .style("width", "100%")
      .style("height", "auto");

    const simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(-5))
      .force('center', d3.forceCenter())
      .force('collision', d3.forceCollide().radius(d => sizeScale(d.value)))
      .on('tick', ticked);

    function ticked() {
      const node = svg.selectAll('.node')
        .data(nodes, d => d.id) // Use a key function for object constancy
        .join('circle')
        .classed('node', true)
        .attr('r', d => sizeScale(d.value))
        .attr('fill', d => colorScale(d.id))
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      const label = svg.selectAll('.label')
        .data(nodes, d => d.id) // Use a key function for object constancy
        .join('text')
        .classed('label', true)
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em') // to vertically center text
        .text(d => d.id);
    }
  }
}, [songs, type]);

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };
  
  return (
    <div className='analysis-table'>
      <h2>Song List Network Graph</h2>
      <div>
        <label>Select Type: </label>
        <select value={type} onChange={handleTypeChange}>
          <option value="genre">Genre</option>
          <option value="artist">Artist</option>
          <option value="album">Album</option>
        </select>
      </div>
      <svg ref={svgRef} />
      {paragraph()}
    </div>
  );
  
};


export default function RecomPlaylist() {
  return <SongListNetworkGraph />;
}
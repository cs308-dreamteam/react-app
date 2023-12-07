import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import './analysis.css';

const SongListHistogram = () => {
  const [chart, setChart] = useState(null);
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
    if (chart) {
      chart.destroy();
    }

    if (songs.length > 0) {
      const newChart = new Chart('songListChart', {
        type: 'bar',
        data: generateHistogramData(type),
        options: histogramOptions,
      });
      setChart(newChart);
    }
  }, [songs, type]);

  const generateHistogramData = (selectedType) => {
    const dataMap = new Map();

    songs.forEach((song) => {
      const key = selectedType === 'genre' ? song.genre :
                  selectedType === 'artist' ? song.artist : song.album;
  
      const songSet = dataMap.get(key) || new Set();
      songSet.add(song.song); // Assuming "title" is the property containing the song name
      dataMap.set(key, songSet);
    });
  
    const labels = [...dataMap.keys()];
    const data = labels.map((key) => dataMap.get(key).size);
  
    return {
      labels,
      datasets: [
        {
          label: `Number of ${selectedType}s`,
          backgroundColor: 'rgba(75,192,192,0.6)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(75,192,192,0.8)',
          hoverBorderColor: 'rgba(75,192,192,1)',
          data,
        },
      ],
    };
  };

  const histogramOptions = {
    scales: {
      x: {
        type: 'category',
        title: { display: true, text: `${type.charAt(0).toUpperCase() + type.slice(1)}s` },
      },
      y: { title: { display: true, text: 'Number of Songs' }, beginAtZero: true },
    },
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
          <option value="genre">Genre</option>
          <option value="artist">Artist</option>
          <option value="album">Album</option>
        </select>
      </div>
      <div>
        <canvas id="songListChart"></canvas>
      </div>
    </div>
  );
};

export default function RecomPlaylist() {
  return <SongListHistogram />;
}

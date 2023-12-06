import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import './analysis.css'
import Chart from 'chart.js/auto';
const SongListHistogram = () => {
  const [songList, setSongList] = useState([]);
  const [chart, setChart] = useState(null);

  useEffect(() => {
    // Fetch song list from the backend API endpoint
    fetch('/api/songList')  // Replace with your actual API endpoint
      .then(response => response.json())
      .then(data => setSongList(data))
      .catch(error => {
        console.error('Error fetching song list:', error);
        // In case of an error, populate with sample data
        const sampleData = generateSampleData(50);
        setSongList(sampleData);
      });
  }, []);

  useEffect(() => {
    if (chart) {
      chart.destroy(); // Destroy the existing chart before rendering a new one
    }

    if (songList.length > 0) {
      const newChart = new Chart('songListChart', {
        type: 'bar',
        data: generateHistogramData(),
        options: histogramOptions,
      });
      setChart(newChart);
    }
  }, [songList]);

  const generateSampleData = (count) => {
    // Generate sample data with random values for testing
    const genres = ['Pop', 'Rock', 'Hip Hop', 'Country', 'Jazz'];
    const sampleData = [];

    for (let i = 0; i < count; i++) {
      const randomGenre = genres[Math.floor(Math.random() * genres.length)];
      sampleData.push({
        title: `Song ${i + 1}`,
        artist: `Artist ${i + 1}`,
        album: `Album ${i + 1}`,
        genre: randomGenre,
        rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1 and 5
      });
    }

    return sampleData;
  };

  const generateHistogramData = () => {
    const genresMap = new Map();

    // Count the occurrences of each genre
    songList.forEach(song => {
      const genre = song.genre;
      genresMap.set(genre, (genresMap.get(genre) || 0) + 1);
    });

    // Convert the map data to arrays for Chart.js
    const labels = [...genresMap.keys()];
    const data = [...genresMap.values()];

    return {
      labels,
      datasets: [
        {
          label: 'Number of Songs',
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
        type: 'category', // Use 'category' for string values (e.g., genres)
        title: { display: true, text: 'Genres' },
      },
      y: { title: { display: true, text: 'Number of Songs' }, beginAtZero: true },
    },
  };

  return (
    <div className='analysis-table'>
      <h2>Song List Histogram</h2>
      <div>
        <canvas id="songListChart"></canvas>
      </div>
    </div>
  );
};

export default function RecomPlaylist() {
  return (
    <SongListHistogram />
  );
}

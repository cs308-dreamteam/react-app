import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import './analysis.css';

const SongListHistogram = () => {
  const [chart, setChart] = useState(null);
  const [songs, setSongs] = useState([]);
  const [type, setType] = useState('genre');
  const [chartType, setChartType] = useState('bar');

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

  const [avgs, setAvgs] = useState([0, 0, 0, 0]);

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
        setAvgs([data.result[0].danceability, data.result[0].energy, data.result[0].valence, data.result[0].popularity]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const paragraph = () => {
    let result = "You listen to songs that are ";
    result += "characterized by their unique qualities. Specifically, ";
    result += avgs[0] > 0.5 ? "<b><i>they are easy to dance to</i></b>, " : "<b><i>they are not quite suited for dancing</i></b>, ";
    result += "which shows a distinct rhythm pattern. Furthermore, the tempo of your songs is ";
    result += avgs[1] > 0.5 ? "<b><i>upbeat</i></b>, " : "<b><i>slower-paced</i></b>, ";
    result += "reflecting your preference for either a lively or a relaxed listening experience. In terms of mood, ";
    result += avgs[2] > 0.5 ? "<b><i>they tend to be happy</i></b>, " : "<b><i>they lean towards being more melancholic</i></b>, ";
    result += "which resonates with the emotional tone you prefer in your music. Finally, regarding popularity, ";
    result += avgs[3] > 0.5 ? "<b><i>your choices are often mainstream and popular.</i></b> " : "<b><i>you seem to favor more niche and less known tracks.</i></b> ";
    result += "This blend of qualities defines your unique taste in music.";
    console.log(result);
    return <div className="paragraph" dangerouslySetInnerHTML={{ __html: result }} style={{ paddingBottom: '20px', paddingLeft: '12px', paddingRight: '12px' }} />;
  };

  function toTitle(s) {
    return s.charAt(0).toUpperCase() + s.substring(1);
  }

  useEffect(() => {
    if (chart) {
      chart.destroy();
    }

    if (songs.length > 0) {
      const newChart = new Chart('songListChart', {
        type: chartType,
        data: generateChartData(type),
        options: getChartOptions(type),
      });
      setChart(newChart);
    }
  }, [songs, type, chartType]);

// ... (previous code)

const getRandomColor = () => {
  const randomColor = () => Math.floor(Math.random() * 256);
  return `rgba(${randomColor()}, ${randomColor()}, ${randomColor()}, 0.6)`;
};

const generateChartData = (selectedType) => {
  const dataMap = new Map();

  songs.forEach((song) => {
    const key =
      selectedType === 'genre'
        ? song.genre.toLowerCase()
        : selectedType === 'artist'
        ? song.artist.toLowerCase()
        : song.album.toLowerCase();

    const songSet = dataMap.get(key) || new Set();
    songSet.add(song.song);
    dataMap.set(key, songSet);
  });

  let labels = [...dataMap.keys()];
  labels = labels.map((l) => toTitle(l));
  const data = labels.map(() => getRandomColor());

  return {
    labels,
    datasets: [
      {
        label: `Number of ${selectedType}s`,
        backgroundColor: data,
        borderColor: 'rgba(255, 119, 0, 1)',
        borderWidth: 1,
        hoverBackgroundColor: data,
        hoverBorderColor: 'rgba(255, 119, 0, 1)',
        data: labels.map((key) => dataMap.get(key.toLowerCase()).size),
      },
    ],
  };
};

// ... (rest of the code)


  const getChartOptions = (selectedType) => {
    return {
      scales: {
        x: {
          type: 'category',
          title: { display: true, text: `${type.charAt(0).toUpperCase() + type.slice(1)}s` },
        },
        y: { title: { display: true, text: 'Number of Songs' }, beginAtZero: true },
      },
    };
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  const handleChartTypeChange = (e) => {
    setChartType(e.target.value);
  };

  return (
    <div className="analysis-table col a-center">
      <div className="chart">
        <h2 style={{ textAlign: 'center' }}>Song List Chart & NLP Generated Analysis</h2>

        <div>
          <label>Select Type: </label>
          <select value={type} onChange={handleTypeChange}>
            <option value="genre">Genre</option>
            <option value="artist">Artist</option>
            <option value="album">Album</option>
          </select>
        </div>

        <div>
          <label>Select Chart Type: </label>
          <select value={chartType} onChange={handleChartTypeChange}>
            <option value="bar">Bar Chart (Default)</option>
            <option value="line">Line Chart</option>
            <option value="doughnut">Doughnut Chart</option>
          </select>
        </div>

        <canvas id="songListChart"></canvas>
      </div>
      <div className="paragraph-container">
        
        {paragraph()}
      </div>
    </div>
  );
};

export default function RecomPlaylist() {
  return <SongListHistogram />;
}



import React, { useState, useEffect } from 'react';
import "./library.css";

const generateRandomSong = () => {
  // Function to generate a random song
  return {
    id: Math.random().toString(36).substring(7),
    title: `Song ${Math.floor(Math.random() * 100)}`,
    artists: [`Artist ${Math.floor(Math.random() * 10)}`],
    album: `Album ${Math.floor(Math.random() * 50)}`,
    genre: `Genre ${Math.floor(Math.random() * 5)}`,
    rating: Math.floor(Math.random() * 5) + 1,
  };
};

const SongTable = () => {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    // Replace 'your_backend_url' with the actual URL of your backend endpoint
    fetch('your_backend_url')
      .then((response) => response.json())
      .then((data) => setSongs(data))
      .catch((error) => {
        console.error('Error fetching data:', error)
        const randomSongs = Array.from({ length: 10 }, () => generateRandomSong());
        setSongs(randomSongs);
      });
  }, []);

  return (
    <div className='song_table'>
      <h2>My Library</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Artist</th>
            <th>Album</th>
            <th>Genre</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song) => (
            <tr key={song.id}>
              <td>{song.title}</td>
              <td>{song.artists.join(', ')}</td>
              <td>{song.album}</td>
              <td>{song.genre}</td>
              <td>{song.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};



export default function Library() {
  return (<SongTable/>);
}
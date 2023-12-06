

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
  
        // Parse the response body as JSON
        const data = await response.json();
        console.log("HERE");
        console.log(data);
  
        // Set the state with the parsed JSON data
        setSongs(data);
      } catch (error) {
        console.error('Error fetching data:', error);
  
        // If an error occurs, you can set some default or placeholder data
        const randomSongs = Array.from({ length: 10 }, () => generateRandomSong());
        setSongs(randomSongs);
      }
    };
  
    fetchData();
  }, []);
  
  // Create a map to store unique songs based on their titles
  const uniqueSongsMap = new Map();

  // Iterate through the songs and update the map
  songs.forEach((song) => {
    const { title, album, genre, rating, artist } = song;

    // If the song title is not in the map, add it with the current details
    if (!uniqueSongsMap.has(title)) {
      uniqueSongsMap.set(title, {
        title: title,
        artists: artist,
        albums: album,
        genres: genre,
        rating: rating,
      });
    } else {
      
      // If the song title is already in the map, update the details
      uniqueSongsMap.get(title).artists += (", " + artist);
      uniqueSongsMap.get(title).albums += (", " + album);
      uniqueSongsMap.get(title).genres += (", " + genre);
      // You might want to update the rating differently, depending on your requirements
      // For simplicity, this example keeps the rating of the first occurrence
    }
  });

  // Convert the map values (unique songs) to an array
  const uniqueSongsArray = Array.from(uniqueSongsMap.values());

  // Now, uniqueSongsArray contains the desired JSON structure
  console.log("below y")
  console.log(uniqueSongsArray);

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
          {uniqueSongsArray.map((song) => (
            <tr key={song.title}>
              <td>{song.title}</td>
              <td>{song.artists}</td>
              <td>{song.albums}</td>
              <td>{song.genres}</td>
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
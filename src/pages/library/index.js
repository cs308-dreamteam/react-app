

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

const combineSongs = (songList) => {
  const combinedSongs = {};

  // Combine songs with the same name
  songList.forEach((songInfo) => {
    const { song, album, genre, rating, artist } = songInfo;

    if (!combinedSongs[song]) {
      combinedSongs[song] = {
        song,
        album: [album],
        genre: [genre],
        rating,
        artist: [artist],
      };
    } else {
      combinedSongs[song].album.push(album);
      combinedSongs[song].genre.push(genre);
      combinedSongs[song].artist.push(artist);
    }
  });

  // Convert combined songs object to an array
  const resultArray = Object.values(combinedSongs);

  // Format arrays to strings
  resultArray.forEach((songInfo) => {
    songInfo.album = [...new Set(songInfo.album)].join(', ');
    songInfo.genre = [...new Set(songInfo.genre)].join(', ');
    songInfo.artist = [...new Set(songInfo.artist)].join(', ');
  });

  return resultArray;
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

        localStorage.setItem('token', '');
        window.location.reload();

      }
    };
  
    fetchData();
    const intervalId = setInterval(fetchData, 1000);

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  const downloadJson = () => {
    const jsonString = JSON.stringify(combineSongs(songs), null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = 'combinedSongs.json';
  
    // Append the anchor to the body
    document.body.appendChild(a);
  
    // Trigger a click on the anchor
    a.click();
  
    // Remove the anchor from the body
    document.body.removeChild(a);
  
    // Release the object URL
    URL.revokeObjectURL(url);
  };

  const handleDeleteClick = async (title) => {
    try {
      const response = await fetch('http://localhost:3000/delete_song', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({ title }), // Send the title in the request body
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      //setSongs((prevSongs) => prevSongs.filter((song) => song.title !== title));
      //window.location.reload();

      // Handle success, maybe update the state or fetch the updated data
      console.log('Song deleted successfully!');
    } catch (error) {
      console.error('Error deleting song:', error);
    }
  };

  const handleReRate = async (song) => {
    let newRating = window.prompt(('Enter a new rating for ' +song.song+ ':'), song.rating);
    while (newRating > 5){
      newRating = window.prompt(('Again, enter a new rating for ' +song.song+ ':'), song.rating);
    }
    try {
      const response = await fetch('http://localhost:3000/changeRating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({"song_name": song.song, "new_rating": newRating})
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

    } catch (error) {
      console.error('Error fetching data:', error);

      localStorage.setItem('token', '');
      window.location.reload();

    }


  }

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
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {combineSongs(songs).map((song) => (
            <tr key={song.song}>
              <td>{song.song}</td>
              <td>{song.artist}</td>
              <td>{song.album}</td>
              <td>{song.genre}</td>
              <td> <button onClick={() => handleReRate(song)} >{song.rating}</button></td>
              <td>
                <button onClick={() => handleDeleteClick(song.song)}>DELETE</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={downloadJson}>DOWNLOAD</button>
    </div>
  );
};




export default function Library() {
  return (<SongTable/>);
}
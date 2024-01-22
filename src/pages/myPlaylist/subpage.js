import "./playlist.css";
import React from 'react';

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



export default function Subpage(props)
{
    const recommendations =  (props.title === "Our Recommendations") ?  props.data.attributes : props.data;
    console.log(recommendations);
    if (!recommendations || !Array.isArray(recommendations)) return (<div>loading...</div>)

    
    const combinedSongs = combineSongs(recommendations);

    const downloadJson = () => {
      const jsonString = JSON.stringify(combinedSongs, null, 2);
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

    const addSongToLibrary = async (song) => {
        // Prompt the user for a rating
      const userRating = window.prompt("Please enter your rating for this song (1-5):", "5");
      if (!userRating) return;  // User cancelled the prompt
      const songData = {
        songList: [{
          title: song.song,
          albums: song.album.split(', '),
          artists: song.artist.split(', '),
          genres: song.genre.split(', '),
          rating: parseInt(userRating)
        }]
      };
    
      try {
        const response = await fetch('http://localhost:3000/add_song', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('token'),
          },
          body: JSON.stringify(songData),
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Server responded with an error:', errorData);
          throw new Error('Network response was not ok');
        }
    
        console.log('Song added to library successfully');
      } catch (error) {
        console.error('Error adding song to library:', error.message);
      }
    };
    
  

return (
    <>
    <div className='recomm_table'>
   
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Artist</th>
            <th>Album</th>
            <th>Genre</th>
          </tr>
        </thead>
        <tbody>
          {combineSongs(recommendations).map((song) => (
            <tr key={song.song}>
              <td>{song.song}</td>
              <td>{song.artist}</td>
              <td>{song.album}</td>
              <td>{song.genre}</td>
              <td>
                <button onClick={() => addSongToLibrary(song)}>Add to Library</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={downloadJson}>DOWNLOAD</button>
    </div>
    </>
);
};
        

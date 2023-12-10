import "./playlist.css";

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
    if (!recommendations) return (<div>loading...</div>)
        

return (
    <>
    <div className='recomm_table'>
    <h2>{props.title}</h2>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
);
};
        

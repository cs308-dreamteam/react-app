import React, { useState, useEffect, useRef } from "react";
import "./profile.css";

const CameraComponent = ({ onClose }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      streamRef.current = null;
    }

    onClose(); // Close the camera pop-up
  };

  const takePicture = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg');
    setImageSrc(dataUrl);

    // Call the function to send the image to the backend
    sendImageToBackend(dataUrl);
  };

  const sendImageToBackend = async (dataUrl) => {
    try {
      const response = await fetch('http://localhost:3000/upload_image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({ image: dataUrl }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className="camera-popup">
      <h2>Camera Component</h2>
      <button onClick={startCamera}>Start Camera</button>
      <button onClick={takePicture}>Take Picture</button>
      <button onClick={stopCamera}>Stop Camera</button>
      {imageSrc && <img src={imageSrc} alt="Captured" />}
      <video ref={videoRef} style={{ display: 'block', margin: '10px 0' }} autoPlay />
    </div>
  );
};

const ListParser = (props) => {
  let songs = props.input;
  if (!songs || songs.length === 0) {
    // If songs is still undefined or empty, return a loading state or an empty component
    return <p>Loading...</p>;
  }

  const combinedSongs = {};

  // Combine songs with the same name
  songs.forEach((songInfo) => {
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
  resultArray.forEach((songInfo) => {
    songInfo.album = [...new Set(songInfo.album)];
    songInfo.genre = [...new Set(songInfo.genre)];
    songInfo.artist = [...new Set(songInfo.artist)];
  });

  songs = resultArray;
    // Step 1: Find the highest rating
    const highestRating = Math.max(...songs.map(song => song.rating));

    // Step 2: Collect songs with the highest rating
    let highestRatedSongs = songs.filter(song => song.rating === highestRating);
  
    // Step 3: Extract and count occurrences of titles, artists, albums, and genres
    const titleCount = {};
    const artistCount = {};
    const albumCount = {};
    const genreCount = {};
  
    highestRatedSongs.forEach(song => {
      // Count occurrences of titles
      titleCount[song.song] = (titleCount[song.song] || 0) + 1;
  
      // Count occurrences of artists
      song.artist.forEach(artist => {
        artistCount[artist] = (artistCount[artist] || 0) + 1;
      });
  
      // Count occurrences of albums
      song.album.forEach(album => {
        albumCount[album] = (albumCount[album] || 0) + 1;
      });
  
      // Count occurrences of genres
      song.genre.forEach(genre => {
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      });
    });

    highestRatedSongs = highestRatedSongs.slice(0, 5);
  
    // Step 4: Find the most occurring ones for each category
    const mostOccurringTitle = Object.keys(titleCount).reduce((a, b) => titleCount[a] > titleCount[b] ? a : b);
    const mostOccurringArtist = Object.keys(artistCount).reduce((a, b) => artistCount[a] > artistCount[b] ? a : b);
    const mostOccurringAlbum = Object.keys(albumCount).reduce((a, b) => albumCount[a] > albumCount[b] ? a : b);
    const mostOccurringGenre = Object.keys(genreCount).reduce((a, b) => genreCount[a] > genreCount[b] ? a : b);
  
    return (
    <div className="taste-details">
          <h2>Top 5 Songs</h2>
          <ul>
            {highestRatedSongs.map((song, index) => (
              <li key={index}>
                <strong>Title:</strong> {song.song}, 
                <strong> Artists:</strong> {song.artist.join(', ')}, 
                <strong> Albums:</strong> {song.album.join(', ')}, 
                <strong> Genres:</strong> {song.genre.join(', ')}, 
                <strong> Rating:</strong> {song.rating}
              </li>
            ))}
          </ul>
      
          <h2>Most Favorites</h2>
          <p>Most Favorite Song: <strong>{mostOccurringTitle}</strong></p>
          <p>Most Favorite Artist: <strong>{mostOccurringArtist}</strong></p>
          <p>Most Favorite Album: <strong>{mostOccurringAlbum}</strong></p>
          <p>Most Favorite Genre: <strong>{mostOccurringGenre}</strong></p>
        </div>
      );
}

const SongList = () => {
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
  }, []);

  return(
    <>
      <ListParser input = {songs}/>
    </>
  );

};

const Network = () => {
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/get_usernames", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'x-access-token': localStorage.getItem('token'),
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data = await response.json();
        data = data.map(user => user.username);
        
        setUserData(data);

      } catch (error) {
        console.error("Error fetching user data:", error);
        localStorage.setItem('token', '');
        window.location.reload();
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleClick = async () => {

    if (!userData.includes(inputValue)) return;
    try {
      const response = await fetch("http://localhost:3000/follows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'x-access-token': localStorage.getItem('token'),

        },
        body: JSON.stringify({inputValue})
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let data = await response.json();
      data = data.result.map(user => user.username);
      setUserData(data);

    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  const [count, setCount] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/follower-count", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'x-access-token': localStorage.getItem('token'),
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        setCount(data.followerCount);

      } catch (error) {
        console.error("Error fetching user data:", error);
        localStorage.setItem('token', '');
        window.location.reload();
      }
    };

    const intervalId = setInterval(() => {
      fetchData();
      //console.log(count); // This will log the current state value, not the updated one
    }, 1000);

    // Run fetchData immediately when the component mounts
    fetchData();

    return () => clearInterval(intervalId);
  }, [count]); 




  return (
    <div>
      <p>Follower count: {count}</p>
      <label htmlFor="autocomplete">Choose a user to follow:</label>
      <input
        type="text"
        id="autocomplete"
        list="options"
        onChange={handleInputChange}
      />
      <datalist id="options">
        {userData.map((option, index) => (
          <option key={index} value={option} />
        ))}
      </datalist>
      <button onClick={handleClick}>follow</button>
    </div>
  )
}


const Profile = () => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    mail: "",
    avatarPath: "",
  });




  const [isCameraOpen, setIsCameraOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/get_user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'x-access-token': localStorage.getItem('token'),
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const userData = await response.json();

        // Update state with user data
        setUserInfo({
          username: userData.username,
          mail: userData.mail,
          avatarPath: userData.avatarPath,
          avatarBase64: userData.avatarBase64,
        });
        //console.log(userInfo);
      } catch (error) {
        console.error("Error fetching user data:", error);
        localStorage.setItem('token', '');
        window.location.reload();
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const openCamera = () => {
    setIsCameraOpen(true);
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
  };

  return (
    <>
      <div className="user-info">
        <h2>User Profile</h2>
        <p>Username: {userInfo.username}</p>
        <p>Email: {userInfo.mail}</p>
        <p>Profile Photo: </p>
        <img className="profile-page-photo" src={`data:image/jpeg;base64, ${userInfo.avatarBase64}`} alt="User Avatar" />
        <br/> 
        <button onClick={openCamera}>Change Your Profile Photo</button>
        <Network/>
      </div>
      <SongList/>
      {isCameraOpen && <CameraComponent onClose={closeCamera} />}
    </>
  );
};

export default Profile;

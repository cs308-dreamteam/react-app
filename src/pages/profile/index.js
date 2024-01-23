import React, { useState, useEffect, useRef } from "react";
import "./profile.css";

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
        <>
          <div className="topRatedSongContainer a-center col">
            <h2>Top Rated Songs</h2>
            <div className="row j-center topRatedContainer">
              {highestRatedSongs.map((song) => (
                  <div className="topRatedEntry">
                    <strong>{song.song}</strong>,<br></br>
                    by <strong>{song.artist.join(', ')}</strong>,<br></br>
                    in <strong>{song.album.join(', ')}</strong>,<br></br>
                    <span className="textOverflow">Genres: <strong>{song.genre.join(', ')}</strong>,</span>
                    Rating: <strong>{song.rating}</strong>
                  </div>
              ))}
            </div>
          </div>

          <div className="favouritesContainer a-center col">
            <h2>Favorites</h2>
            <div className="favouriteInformationContainer row">
              <div className="favouriteInformationEntry col a-center">
                <span>Song</span><span className="favouriteInformation"><strong>{mostOccurringTitle}</strong></span>
              </div>
              <div className="favouriteInformationEntry col a-center">
                <span>Genre</span><span className="favouriteInformation"><strong>{mostOccurringGenre}</strong></span>
              </div>
              <div className="favouriteInformationEntry col a-center">
                <span>Artist</span><span className="favouriteInformation"><strong>{mostOccurringArtist}</strong></span>
              </div>
              <div className="favouriteInformationEntry col a-center">
                <span>Album</span><span className="favouriteInformation"><strong>{mostOccurringAlbum}</strong></span>
              </div>
            </div>
          </div>
        </>
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
      /*
      let data = await response.json();
      data = data.result.map(user => user.username);
      setUserData(data);*/

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


  const [followeds, setFolloweds] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/followed_users", {
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
        const array = data.followed_users.map(user => user.followed);
        setFolloweds(array);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
    const intervalId = setInterval(fetchData, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const [inputValue2, setInputValue2] = useState('');
  const [inputValue3, setInputValue3] = useState('');

  const handleInputChange2 = (e) => {
    setInputValue2(e.target.value);
  };

  const [followed_top5, setFollowed_top5] = useState([]);
  const getUserInfo = async  () => {
    try {
      
      const response = await fetch("http://localhost:3000/get_top5?user=" +inputValue2, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'x-access-token': localStorage.getItem('token'),
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const array = data.songs.map(song => song.songTitle);
      console.log(array);
      setFollowed_top5(array);
      setInputValue3(inputValue2);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  return (
    <>
      <span className="networkingTitle">Networking</span>
      <span className="networkingFollowerCount">Follower count: {count}</span>
      <label htmlFor="userFollowInput">Follow a User:</label>
      <div className="row">
        <input
            type="text"
            id="userFollowInput"
            list="allUsers"
            placeholder="Username"
            onChange={handleInputChange}
        />
        <datalist id="allUsers">
          {userData.map((option, index) => (
              <option key={index} value={option} />
          ))}
        </datalist>
        <button onClick={handleClick}>Follow</button>
      </div>

      <label htmlFor="userGatherInput">Users I follow: </label>
      <div className="row">
        <input
            type="text"
            id="userGatherInput"
            list="followedUsers"
            placeholder="Username"
            onChange={handleInputChange2}
        />
        <datalist id="followedUsers">
          {followeds.map((option, index) => (
              <option key={index} value={option} />
          ))}
        </datalist>
        <button onClick={getUserInfo}>Get Info</button>
      </div>
      <div>
      {followed_top5.length > 0 ? (
        <div>
          <h2>{inputValue3} Top 5:</h2>
          <ul>
            {followed_top5.map((song, index) => (
              <li key={index}>{song}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p></p>
      )}
    </div>
    </>
  )
}


const ProfileImage = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [avatarBase64, setAvatarBase64] = useState("");

  const openCamera = () => {
    setIsCameraOpen(true);
    startCamera();
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      streamRef.current = null;
    }

    closeCamera();
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
    closeCamera();
  };

  const [imageSrc, setImageSrc] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      console.log(navigator);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  useEffect(
      () => {
        fetchData().then( (userData) => {
              setAvatarBase64(
                  userData.avatarBase64
              );
            }
        );
      }
  );

  const handleClick = () => {
    if(isCameraOpen) {
      takePicture();
      closeCamera();
    } else {
      openCamera();
    }
  }

  return (
      isCameraOpen ?
          <video ref={videoRef} autoPlay onClick={handleClick} className="profileImage"/>:
          <img alt="User Profile" src={"data:image/png;base64," + avatarBase64} className="profileImage" onClick={handleClick}/>
  );

}

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

    return await response.json();

    // Update state with user data

    //console.log(userInfo);
  } catch (error) {
    console.error("Error fetching user data:", error);
    localStorage.setItem('token', '');
    window.location.reload();
  }
};


const Profile = () => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    mail: "",
    avatarPath: "",
  });

  useEffect( () => {
    fetchData().then( (userData) => {
          setUserInfo({
            username: userData.username,
            mail: userData.mail,
            avatarPath: userData.avatarPath,
            avatarBase64: userData.avatarBase64,
          });
      }
    );
  });

  return (
      <div className="top col">
        <div className="profileHeader row j-center">
          <div className="profileBackdrop"></div>
          <div className="profileInformationContainer col absolute">
            <div className="profileUsername">
              {userInfo.username}
            </div>
            <div className="profileImageContainer a-center overflow-hidden">
              <ProfileImage/>
            </div>
          </div>
        </div>
        <div className="profileHero row">
          <div className="networkContainer col a-center">
            <Network/>
          </div>
          <div className="songListContainer col a-center">
            <SongList/>
          </div>
        </div>
      </div>

      /*
      <div className="row j-center w-100">
        <div className="topLevel">
          <div className="informationContainer">
            <div className="generalInformationContainer">
              <span className="usernameSpan">Dospacite</span>
              <div className="userProfilePictureContainer">
                {
                  isCameraOpen ?
                      <video ref={videoRef} style={{ width: 256 }} autoPlay /> :
                      <img onClick={openCamera} src={`data:image/jpeg;base64, ${userInfo.avatarBase64}`} alt="" className="userProfilePicture"></img>
                }
                {isCameraOpen && <button className="takePictureButton" onClick={takePicture}>Take Picture</button>}
              </div>
              <span className="emailSpan">{userInfo.mail}</span>
            </div>
            <div className="row">
              <Network/>
              <SongList/>
            </div>
          </div>
        </div>
      </div>
       */
  )
};

export default Profile;

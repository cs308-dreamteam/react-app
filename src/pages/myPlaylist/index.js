import React, { useState, useEffect } from "react";
import "./playlist.css";
import Subpage from "./subpage"; 



export default function MyPlaylist() {
  const [recommendations, setRecommendations] = useState({
    friendRecommendations: [],
    ourRecom: [],
    spotifyRecom: []
  });

  useEffect(() => {
    const getRecommendations = async () => {
      try {
        const token = localStorage.getItem('token'); // Replace with your actual token retrieval logic
        const response = await fetch('http://localhost:3000/getRecommendations', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setRecommendations(data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        // Handle error appropriately, e.g., show an error message to the user
      }
    };

    getRecommendations();
  }, []); // The empty dependency array ensures that this effect runs only once when the component mounts


  const [selectedSubpage, setSelectedSubpage] = useState("subpage1");

  const handleSubpageChange = (subpage) => {
    setSelectedSubpage(subpage);
  };

  return (
    <div className="myplaylist-container">
      <div className="nav-buttons">
        <button
          onClick={() => handleSubpageChange("subpage1")}
          className={selectedSubpage === "subpage1" ? "active" : ""}
        >
          Subpage 1
        </button>
        <button
          onClick={() => handleSubpageChange("subpage2")}
          className={selectedSubpage === "subpage2" ? "active" : ""}
        >
          Subpage 2
        </button>
        <button
          onClick={() => handleSubpageChange("subpage3")}
          className={selectedSubpage === "subpage3" ? "active" : ""}
        >
          Subpage 3
        </button>
      </div>

      <div className="subpage-content">
        {selectedSubpage === "subpage1" && <Subpage title = "Friend Recommendations" data = {recommendations.friendRecommendations}/>}
        {selectedSubpage === "subpage2" && <Subpage title = "Our Recommendations" data = {recommendations.ourRecom}/>}
        {selectedSubpage === "subpage3" && <Subpage title = "Spotify Recommendations" data = {recommendations.spotifyRecom}/>}
      </div>
    </div>
  );
}

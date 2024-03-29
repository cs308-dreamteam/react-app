import React, { useState, useEffect } from "react";
import "./playlist.css";
import Subpage from "./subpage"; 



export default function MyPlaylist() {
  const [recommendations, setRecommendations] = useState({
    friendRecommendations: [],
    ourRecom: [],
    spotifyRecom: [],
    aiRecom: []
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
          Friend Recommendations
        </button>
        <button
          onClick={() => handleSubpageChange("subpage2")}
          className={selectedSubpage === "subpage2" ? "active" : ""}
        >
          Our Recommendations
        </button>
        <button
          onClick={() => handleSubpageChange("subpage3")}
          className={selectedSubpage === "subpage3" ? "active" : ""}
        >
          Spotify Recommendations
        </button>
        <button
          onClick={() => handleSubpageChange("subpage4")}
          className={selectedSubpage === "subpage4" ? "active" : ""}
        >
          AI Recommendations
        </button>
      </div>

      <div className="subpage-content">
        {selectedSubpage === "subpage1" && <Subpage title = "Friend Recommendations" data = {recommendations.friendRecommendations}/>}
        {selectedSubpage === "subpage2" && <Subpage title = "Our Recommendations" data = {recommendations.ourRecom}/>}
        {selectedSubpage === "subpage3" && <Subpage title = "Spotify Recommendations" data = {recommendations.spotifyRecom}/>}
        {selectedSubpage === "subpage4" && <Subpage title = "AI Recommendations" data = {recommendations.aiRecom}/>}
      </div>
    </div>
  );
}

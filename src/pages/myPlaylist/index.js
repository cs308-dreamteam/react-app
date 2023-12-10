import React, { useState } from "react";
import "./myPlaylist.css";
import Subpage1 from "./subpage1"; 
import Subpage2 from "./subpage2";
import Subpage3 from "./subpage3"; 

export default function MyPlaylist() {
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
        {selectedSubpage === "subpage1" && <Subpage1 />}
        {selectedSubpage === "subpage2" && <Subpage2 />}
        {selectedSubpage === "subpage3" && <Subpage3 />}
      </div>
    </div>
  );
}

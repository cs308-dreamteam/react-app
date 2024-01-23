import React, { useState, useEffect } from "react";
import SidebarButton from "./sidebarButton";
import { MdFavorite } from "react-icons/md";
import { SiGoogleanalytics } from "react-icons/si";
import { IoLibrary } from "react-icons/io5";
import { CgAdd } from "react-icons/cg";
import { FaSignOutAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';
/*import apiClient from "../../spotify";*/
import "./sidebar.css";

export default function Sidebar() {

  const [image, setImage] = useState("");

  useEffect(() =>{
    const fetchData = async () =>{
      try{
        const response = await fetch("http://localhost:3000/get_user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'x-access-token': localStorage.getItem('token'),
          },
        });

        const userData = await response.json();
        setImage(userData.avatarBase64)
      }
      catch (error) {
      console.error("Error fetching user data:", error);
    }
    }

    fetchData();
    const intervalId = setInterval(fetchData, 1000);
    return () => clearInterval(intervalId);
  }, [])

  //<SidebarButton title="spoti deneme" to="/deneme"  />
  return (
    <div className="sidebar-container">
      <Link to="/profile">
      <img src={`data:image/jpeg;base64, ${image}`} className='pp' alt="User Avatar" />
      </Link>
      
      <div>
      
        <SidebarButton title="Add Song" to="/add" icon={<CgAdd />} />
        <SidebarButton
          title="Analysis"
          to="/recomPlaylist"
          icon={<SiGoogleanalytics />}
        />
        <SidebarButton
          title="My Songs"
          to="/myPlaylist"
          icon={<MdFavorite />}
        />
        <SidebarButton title="Library" to="/" icon={<IoLibrary />} />
      </div>
      <SidebarButton title="Sign Out" to=""  icon={<FaSignOutAlt />} />
    </div>
  );
}

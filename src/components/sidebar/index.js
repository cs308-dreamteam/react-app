import React, { useState, useEffect } from "react";
import SidebarButton from "./sidebarButton";
import { MdFavorite } from "react-icons/md";
import { SiGoogleanalytics } from "react-icons/si";
import { IoLibrary } from "react-icons/io5";
import { CgAdd } from "react-icons/cg";
import { FaSignOutAlt } from "react-icons/fa";
/*import apiClient from "../../spotify";*/
import "./sidebar.css";

export default function Sidebar() {
  const [image, setImage] = useState(
    "https://static.ticimax.cloud/cdn-cgi/image/width=530,quality=85/6389/uploads/urunresimleri/buyuk/mustafa-kemal-ataturk-portre-iii-kanva-b4c3-4.jpg"
  );/*
  useEffect(() => {
    apiClient.get("me").then((response) => {
      if (response.data.images && response.data.images.length > 0) {
        setImage(response.data.images[0].url);
      }
    });
  }, []);*/
  return (
    <div className="sidebar-container">
      <img src={image} className="profile_img" alt="profile" />
      <div>
      <SidebarButton title="spoti deneme" to="/deneme"  />
        <SidebarButton title="Add Song" to="/add" icon={<CgAdd />} />
        <SidebarButton
          title="analysis"
          to="/recomPlaylist"
          icon={<SiGoogleanalytics />}
        />
        <SidebarButton
          title="MyPlaylist"
          to="/myPlaylist"
          icon={<MdFavorite />}
        />
        <SidebarButton title="Libray" to="/" icon={<IoLibrary />} />
      </div>
      <SidebarButton title="Sign Out" to="" icon={<FaSignOutAlt />} />
    </div>
  );
}

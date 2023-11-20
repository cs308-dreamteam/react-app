import React, { useState, useEffect } from "react";
import SidebarButton from "./sidebarButton";
import { MdFavorite } from "react-icons/md";
import { SiGoogleanalytics } from "react-icons/si";
import { IoLibrary } from "react-icons/io5";
import { CgAdd } from "react-icons/cg";
import { FaSignOutAlt } from "react-icons/fa";
import "./sidebar.css";

export default function Sidebar() {
  return (
    <div className="sidebar-container">
      <div>
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
      <div class="Sing_Out">
        <SidebarButton title="Sign Out" to="" icon={<FaSignOutAlt />} />
      </div>
    </div>
  );
}

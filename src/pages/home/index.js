import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Deneme from "../deneme";

import Add from "../add";
import Library from "../library";
import MyPlaylist from "../myPlaylist";
import RecomPlaylist from "../recomPlaylist";
import Login from "../authentication/login";
import SignInUp from "../authentication/sign_in_up";




import { setClientToken } from "../../spotify";
import "./home.css";
import Sidebar from "../../components/sidebar";

export default function Home() {
  const [token, setToken] = useState("");

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    const hash = window.location.hash;
    window.location.hash = "";
    if (!token && hash) {
      const _token = hash.split("&")[0].split("=")[1];
      window.localStorage.setItem("token", _token);
      setToken(_token);
      setClientToken(_token);
    } else {
      setToken(token);
      setClientToken(token);
    }
  }, []);

  return !token ? (
    <SignInUp />
  ) : (
    <Router>
      <div className="main-body">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Library />} />
          <Route path="/add" element={<Add />} />
          <Route path="/recomPlaylist" element={<RecomPlaylist />} />
          <Route path="/myplaylist" element={<MyPlaylist />} />

          <Route path="/deneme" element={<Deneme />} />
        </Routes>
      </div>
    </Router>
  );
}

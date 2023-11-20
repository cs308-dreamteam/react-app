import { Component } from "react";
import React, { useState, useEffect } from "react";
import apiClient from "../../spotify";
import "./NavbarStyles.css";

export default function Navbar() {
  const [active, setActive] = useState("nav__menu");
  const [icon, setIcon] = useState("nav__toggler");
  const navToggle = () => {
    if (active === "nav__menu") {
      setActive("nav__menu nav__active");
    } else setActive("nav__menu");

    // Icon Toggler
    if (icon === "nav__toggler") {
      setIcon("nav__toggler toggle");
    } else setIcon("nav__toggler");
  };
  const [image, setImage] = useState(
    "https://static.ticimax.cloud/cdn-cgi/image/width=530,quality=85/6389/uploads/urunresimleri/buyuk/mustafa-kemal-ataturk-portre-iii-kanva-b4c3-4.jpg"
  );
  useEffect(() => {
    apiClient.get("me").then((response) => {
      if (response.data.images && response.data.images.length > 0) {
        setImage(response.data.images[0].url);
      }
    });
  }, []);
  return (
    <nav className="nav">
      <ul className={active}>
        <li className="nav__item">
          <a href="#" className="nav__link">
            Profil
          </a>
          <a href="#" className="nav__link">
            <img src={image} className="profile_img" alt="profile" />
          </a>
        </li>
      </ul>
      <div onClick={navToggle} className={icon}>
        <div className="line1"></div>
        <div className="line2"></div>
        <div className="line3"></div>
      </div>
    </nav>
  );
}

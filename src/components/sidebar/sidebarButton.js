import React from "react";
import { IconContext } from "react-icons";
import { Link, useLocation } from "react-router-dom";
import "./sidebarbutton.css";

export default function SidebarButton(props) {
  const location = useLocation();

  const isActive = location.pathname === props.to;

  const btnClass = isActive ? "btn-body active" : "btn-body";

  const handleClick = () => {
    if(props.title != "Sign Out") return;
    else{
      localStorage.setItem('token', '');
      window.location.reload();
    }
  }



  return (
    <div onClick={handleClick}>
      <Link to={props.to}>
        <div className={btnClass}>
          <IconContext.Provider value={{ size: "24px", className: "btn-icon" }}>
            {props.icon}
            <p className="btn-title">{props.title}</p>
          </IconContext.Provider>
        </div>
      </Link>
    </div>
  );
}

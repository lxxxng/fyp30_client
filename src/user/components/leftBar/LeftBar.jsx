import "./leftBar.scss";
import Friends from "../../../assets/1.png";
import Groups from "../../../assets/2.png";
import Market from "../../../assets/3.png";
import Watch from "../../../assets/4.png";
import Memories from "../../../assets/5.png";
import Events from "../../../assets/6.png";
import Gaming from "../../../assets/7.png";
import Gallery from "../../../assets/8.png";
import Videos from "../../../assets/9.png";
import Messages from "../../../assets/10.png";
import Tutorials from "../../../assets/11.png";
import Courses from "../../../assets/12.png";
import Fund from "../../../assets/13.png";
import { AuthContext } from "../../../context/authContext";
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';

const LeftBar = () => {

  const { currentUser } = useContext(AuthContext);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const viewFriend = () => {
    alert("View Friends");
  }

  const viewGroup = () => {
    alert("View Groups");
  }

  const viewEvents = () => {
    alert("View Events");
  }

  const logout = async (e) => {
    localStorage.removeItem('user');
    e.preventDefault();

    try {
      // Use await for the axios request inside an async function
      await axios.post("http://localhost:3001/auth/logout");
      navigate("/")
    } catch (err) {
      setErr(err.response.data);
    }
  }

  

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="user">
            <img
              src={"/upload/" + currentUser.profilePic}
              alt=""
            />
            <span>{currentUser.name}</span>
          </div>

          <div className="item" onClick={viewFriend}>
            <img src={Friends} alt="" />
            <span>Friends</span>
          </div>

          <div className="item" onClick={viewGroup}>
            <img src={Groups} alt="" />
            <span>Groups</span>
          </div>

          <div className="item">
            <img src={Events} alt="" onClick={viewEvents}/>
            <span>Events</span>
          </div>

        </div>
        <hr />
        <button className="logoutBtn" onClick={logout}>
          <LogoutIcon /> Logout
        </button>
      </div>
    </div>
  );
};

export default LeftBar;

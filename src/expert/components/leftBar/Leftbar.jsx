import "./leftBar.scss";
import Friends from "../../../assets/1.png";
import Groups from "../../../assets/2.png";
import Edit from '@mui/icons-material/AutoFixHigh';
import Events from "../../../assets/6.png";
import { AuthContext } from "../../../context/authContext";
import LogoutIcon from '@mui/icons-material/Logout';
import { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const LeftBar = () => {
  const { currentUser } = useContext(AuthContext);

  const [err, setErr] = useState(null);

  const navigate = useNavigate();

  const viewFriend = () => {
    alert("View Friends");
  };

  const viewGroup = () => {
    alert("View Groups");
  };

  const viewEvents = () => {
    alert("View Events");
  };

  // New functions for post operations
  const editPost = () => {
    navigate("/expert/editpost");
  };

  const logout = async (e) => {
    localStorage.removeItem('user');
    e.preventDefault();

    try {
      // Use await for the axios request inside an async function
      await axios.post("https://fyp30-b07db14946ce.herokuapp.com/auth/logout");
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
            <img src={currentUser.profilePic} alt="" />
            <span>{currentUser.name}</span>
          </div>
          <button className="item" onClick={viewFriend}>
            <img src={Friends} alt="" />
            <span>Friends</span>
          </button>
          <button className="item" onClick={viewGroup}>
            <img src={Groups} alt="" />
            <span>Groups</span>
          </button>
          <button className="item">
            <img src={Events} alt="" onClick={viewEvents} />
            <span>Events</span>
          </button>
          <button className="item" onClick={editPost}>
            <Edit style={{ color: "black", fontSize: "30px" }} />
            <span>Edit Post</span>
          </button>
          <hr />
          <button onClick={logout}>
          <LogoutIcon /> Logout
          </button>
        </div>
        <hr />
      </div>
    </div>
  );
};

export default LeftBar;

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
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";

const LeftBar = () => {
  const { currentUser } = useContext(AuthContext);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const viewShopListing = () => {
    navigate("/owner/shoplisting");
  };

  const viewEvents = () => {
    navigate("/owner/events");
  };

  const logout = async (e) => {
    e.preventDefault();
    localStorage.removeItem("user");

    try {
      await axios.post("http://localhost:3001/auth/logout");
      navigate("/");
    } catch (err) {
      setErr(err.response.data);
    }
  };

  const viewProfile = () => {
    navigate("/owner/profile/" + currentUser.id);
  };

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="user" onClick={viewProfile}>
            <img src={currentUser.profilePic} alt="Profile" />
            <span>{currentUser.name}</span>
          </div>
          <button className="item" onClick={viewShopListing}>
            <img src={Market} alt="Market" />
            <span>Shop Listing</span>
          </button>
          <button className="item" onClick={viewEvents}>
            <img src={Events} alt="Events" />
            <span>Events</span>
          </button>
        </div>
        <hr />
        <button className="logoutBtn" onClick={logout}>
          <LogoutIcon className="icon" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default LeftBar;

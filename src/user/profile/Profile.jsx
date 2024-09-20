import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import {useContext, useState} from 'react';
import Update from "../components/update/Update";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();
  const userId = parseInt(location.pathname.split("/")[3]);

  // get user profile info
  const { isLoading, error, data } = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      makeRequest.get("/users/find/" + userId).then((res) => res.data),
  });
  console.log(data);

  const { isLoading:relationshipLoading, data:relationshipData } = useQuery({
    queryKey: ["relationship"],
    queryFn: () =>
      makeRequest.get("/relationships?followedUserId="+ userId).then((res) => res.data),
  });
  
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (followed) => {
      if (followed) {
        return makeRequest.delete("/relationships?userId=" + userId);
      } else {
        return makeRequest.post("/relationships", { userId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['relationship']);
    },
  });
  
  const handleFollow = () => {
    const followed = relationshipData.includes(currentUser.id);
    mutation.mutate(followed);
  };

  if (isLoading) {
    return <div>Loading...</div>; // Show loading state while fetching data
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Handle potential errors
  }

  if (relationshipLoading) {
    return <div>Loading...relationship</div>; // Show loading state while fetching data
  }

  console.log(data);
  
  return (
    <div className="profile">
      <div className="images">
        {data.coverPic && (
          <img
            src={"/upload/" + data.coverPic}
            alt="Cover"
            className="cover"
          />
        )}
        {data.profilePic && (
          <img
            src={"/upload/" + data.profilePic}
            alt="Profile"
            className="profilePic"
          />
        )}
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="http://instagram.com">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="http://twitter.com">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="http://linkedin.com">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="http://pinterest.com">
              <PinterestIcon fontSize="large" />
            </a>
          </div>
          <div className="center">
            <span>{data.name}</span> 
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{data.city}</span> 
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{data.website}</span> 
              </div>
            </div>
            {userId == currentUser.id
              ? <button onClick={() => setOpenUpdate(true)}>update</button>
              : <button onClick={handleFollow}>
                {relationshipData.includes(currentUser.id)? "Following": "Follow"}</button>
            }
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>

          {/* Render profile information below the uInfo section */}
          <div className="profile-info-box">
            <p><strong>Bio:</strong> {data.bio || "No bio available"}</p>
            <p><strong>Favorite Beans:</strong> {data.fav_beans ? data.fav_beans.join(", ") : "No favorite beans"}</p>
            <p><strong>Favorite Brewing Methods:</strong> {data.fav_brewing_methods ? data.fav_brewing_methods.join(", ") : "No favorite brewing methods"}</p>
            <p><strong>Favorite Coffee Place:</strong> {data.fav_coffee_place ? data.fav_coffee_place.join(", ") : "No favorite coffee place"}</p>
            <p><strong>Favorite Coffee Type:</strong> {data.fav_coffee_type ? data.fav_coffee_type.join(", ") : "No favorite coffee type"}</p>
            <p><strong>Allergies:</strong> {data.allergies ? data.allergies.join(", ") : "No allergies"}</p>
            <p><strong>Tags:</strong> {data.tags ? data.tags.join(", ") : "No tags"}</p>
          </div>
        
        </div>
        
        
  
        <Posts userId={userId}/>
      </div>
      
      {openUpdate && 
        <Update
          openUpdate={openUpdate} 
          setOpenUpdate={setOpenUpdate} 
          user={data} 
        />
      }
    </div>
  );
}  

export default Profile;

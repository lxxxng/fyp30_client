import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../../context/authContext";
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import { makeRequest } from "../../../axios";
import moment from 'moment';

const Comments = ({postId}) => {
  const [ desc, setDesc ] = useState("");
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery({
    queryKey: ['comments'],
    queryFn: () => 
      makeRequest.get("/comments?postId=" + postId).then((res) => res.data)
  });
  
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newComment) => makeRequest.post("/comments", newComment),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["comments"]);
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    
    mutation.mutate({desc, postId});
    setDesc("");
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePic} alt="" />
        <input type="text" placeholder="write a comment" 
            onChange={e=>setDesc(e.target.value)}
            value={desc}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {isLoading 
        ? "loading" 
        : (Array.isArray(data) && data.length > 0) ? (
            data.map((comment) => (
              <div className="comment" key={comment.id}>
                <img src={comment.profilepic} alt="" />
                <div className="info">
                  <span>{comment.name}</span>
                  <p>{comment.desc}</p>
                </div>
                <span className="date">{moment(comment.createdAt).fromNow()}</span>
              </div>
            ))
          ) : (
            <p>No comments available.</p>
          )
      }
    </div>
  );
};

export default Comments;

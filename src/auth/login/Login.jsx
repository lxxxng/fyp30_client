import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";

const Login = () => {
  const { login, currentUser } = useContext(AuthContext);

  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });

  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(inputs);
      if (currentUser.type === "regular") {
        navigate("/user");
      } else if (currentUser.type === "owner") {
        navigate("/owner");
      } else if (currentUser.type === "expert") {
        navigate("/expert");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErr(error.response.data);
        alert(error.response.data);
      } else {
        setErr("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>I Like That Coffee</h1>
          <p>
            Dive into a world of coffee discovery. Share your favorite shops,
            find new brews, and connect with fellow enthusiasts!
          </p>
          <span>Don't you have an account?</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            <button onClick={handleLogin}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

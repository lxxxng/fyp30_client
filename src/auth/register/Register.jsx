import { Link, useNavigate } from "react-router-dom";
import "./register.scss";
import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

const Register = () => {
  const [type, setRole] = useState("Regular User"); // Track the selected role
  const typeOfUsers = [
    { type: "Regular User" },
    { type: "Coffee Shop Owner" },
    { type: "Coffee Expert" },
  ];

  const navigate = useNavigate();
  const [err, setErr] = useState(null);

  // Formik validation schema using Yup
  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    name: Yup.string().required("Name is required"),
    type: Yup.string().required("Please select a user type"),
  });

  // Formik hook for form handling
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      name: "",
      type: "Regular User", // Default role
    },
    validationSchema,
    onSubmit: async (values) => {
      let modifiedValues = { ...values };

      if (modifiedValues.type === "Regular User") {
        modifiedValues.type = "regular";
      } else if (modifiedValues.type === "Coffee Shop Owner") {
        modifiedValues.type = "owner";
      } else if (modifiedValues.type === "Coffee Expert") {
        modifiedValues.type = "expert";
      }

      try {
        await axios.post("https://fyp30-b07db14946ce.herokuapp.com/auth/register", modifiedValues);
        navigate("/");
      } catch (err) {
        setErr(err.response?.data || "Something went wrong");
      }
    },
  });

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Discover Your Perfect Brew.</h1>
          <p>
            Join our community of coffee lovers! Share your experiences,
            discover new coffee shops, and connect with fellow enthusiasts.
            Whether you're a casual drinker or a coffee expert, there's a place
            for you here.
          </p>
          <span>Already have an account?</span>
          <Link to="/">
            <button>Login</button>
          </Link>
        </div>

        <div className="right">
          <h1>Register</h1>
          <form onSubmit={formik.handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
            />
            {formik.touched.username && formik.errors.username ? (
              <div style={{ color: "red" }}>{formik.errors.username}</div>
            ) : null}

            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <div style={{ color: "red" }}>{formik.errors.email}</div>
            ) : null}

            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password ? (
              <div style={{ color: "red" }}>{formik.errors.password}</div>
            ) : null}

            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name ? (
              <div style={{ color: "red" }}>{formik.errors.name}</div>
            ) : null}

            <select
              name="type"
              value={formik.values.type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="Regular User">Regular User</option>
              <option value="Coffee Shop Owner">Coffee Shop Owner</option>
              <option value="Coffee Expert">Coffee Expert</option>
            </select>
            {formik.touched.type && formik.errors.type ? (
              <div style={{ color: "red" }}>{formik.errors.type}</div>
            ) : null}

            {err && <span style={{ color: "red" }}>{err}</span>}

            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

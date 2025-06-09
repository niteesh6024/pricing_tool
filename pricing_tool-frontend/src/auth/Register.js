import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/User";
import "../css/Login.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    registerUser(
            formData.username,
            formData.email,
            formData.password,
            formData.role
        )
        .then((res) => {
            alert(res.data.msg);
            navigate("/login");
        })
        .catch(()=> {
            alert("Registration failed!");
        });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Register</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <div className="role-row">
              <label className="role-label">Role: </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="Select Role">Select Role</option>
                <option value="buyer">Buyer</option>
                <option value="admin">Admin</option>
                <option value="seller">Seller</option>
              </select>
            </div>
          </div>

          <button type="submit" className="login-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

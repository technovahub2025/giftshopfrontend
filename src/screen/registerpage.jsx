import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";
import "../style/register.css";

import InputField from "../components/inputfield";
import Button from "../components/button";
import { apiBaseUrl } from "../api/base";
import { useAuth } from "../contexts/AuthContext";

import giftImage from "../assets/gift.png";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (!apiBaseUrl) {
        alert("Missing REACT_APP_API_URL in .env (restart dev server after changing it)");
        return;
      }

      const response = await fetch(`${apiBaseUrl}/userregister`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        alert("Registered successfully");
        console.log(data);
        
        // Auto-login after registration
        if (data.token && data.user) {
          const userData = {
            ...data.user,
            token: data.token,
            role: data.user?.role || 'user'
          };
          
          login(userData, true); // Mark as new user
          navigate("/");
        } else {
          navigate("/login");
        }
      } else {
        alert(data?.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      alert(error?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-container">
        <div className="auth-left" aria-hidden="true">
          <img src={giftImage} alt="" />
        </div>

        <div className="auth-right">
          <div className="auth-formBox">
            <h2>
              <i className="fa fa-user-plus" aria-hidden="true"></i> Register
            </h2>

            <InputField
              type="text"
              name="name"
              placeholder="Name"
              icon="fa fa-user"
              onChange={handleChange}
            />

            <InputField
              type="text"
              name="phone"
              placeholder="Phone"
              icon="fa fa-phone"
              onChange={handleChange}
            />

            <InputField
              type="email"
              name="email"
              placeholder="Email"
              icon="fa fa-envelope"
              onChange={handleChange}
            />

            <InputField
              type="password"
              name="password"
              placeholder="Password"
              icon="fa fa-lock"
              onChange={handleChange}
            />

            <Button text="Register" icon="fa fa-user-plus" onClick={handleSubmit} />

            <p className="auth-loginText">
              Already have an account?{" "}
              <a className="auth-link" href="#/login">
                <i className="fa fa-sign-in" aria-hidden="true"></i> Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

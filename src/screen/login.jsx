import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";
import "../style/register.css";

import InputField from "../components/inputfield";
import Button from "../components/button";
import { apiBaseUrl } from "../api/base";
import { useAuth } from "../contexts/AuthContext";

import giftImage from "../assets/gift.png";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ FIX ADDED
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiBaseUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // Save in localStorage
      if (data.token) localStorage.setItem("token", data.token);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
      if (data.user?.role) localStorage.setItem("role", data.user.role);

      window.dispatchEvent(new Event("authchange"));

      const role = data.user?.role;

      const userData = {
        ...data.user,
        token: data.token,
        role: role,
      };

      login(userData);

      alert("Login successful");

      // 🔥 IMPORTANT FIX (checkout return support)
      const from = location.state?.from || "/";

      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate(from, { replace: true });
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
          <img src={giftImage} alt="Gift" />
        </div>

        <div className="auth-right">
          <div className="auth-formBox">

            <h2>
              <i className="fa fa-sign-in" /> Login
            </h2>

            <form onSubmit={handleSubmit}>
              <InputField
                type="email"
                name="email"
                placeholder="Email"
                icon="fa fa-envelope"
                value={formData.email}
                onChange={handleChange}
              />

              <InputField
                type="password"
                name="password"
                placeholder="Password"
                icon="fa fa-lock"
                value={formData.password}
                onChange={handleChange}
              />

              <div className="auth-forgotPassword">
                <span>Forgot Password?</span>
              </div>

              <Button
                text="Login"
                className="auth-btn"
                type="submit"
              />
            </form>

            <div className="auth-switch">
              <span>
                Don't have an account?{" "}
                <span
                  style={{ color: "blue", cursor: "pointer" }}
                  onClick={() => navigate("/register")}
                >
                  Register
                </span>
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
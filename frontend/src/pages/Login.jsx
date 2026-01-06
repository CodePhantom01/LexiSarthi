import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  //read admin email from frontend env matche with backend .env
  const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || "")
    .trim()
    .toLowerCase();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const adminEmail = ADMIN_EMAIL;
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/login`,
        formData
      );

      localStorage.setItem("token", res.data.token);
      setFormData({ email: "", password: "" });
      // Decode token to read email set by backend
      let emailFromToken = "";
      try {
        const payload = JSON.parse(
          atob((res.data.token || "").split(".")[1] || "")
        );
        emailFromToken = (payload.email || "").trim().toLowerCase();
      } catch {
        emailFromToken = "";
      }

      // redirect based on token email vs env admin email
      if (adminEmail && emailFromToken === adminEmail) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/home";
      }
    } catch (error) {
      alert(error.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <h2 className="text-xl sm:text-2xl font-semibold text-center mb-5">
        Login
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border rounded text-sm sm:text-base"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border rounded text-sm sm:text-base"
          required
        />

        <button className="w-full bg-blue-600 text-white py-2.5 rounded text-sm sm:text-base hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;

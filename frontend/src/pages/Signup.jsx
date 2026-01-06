import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/signup`,
        formData
      );

      localStorage.setItem("token", res.data.token);
      setFormData({ name: "", email: "", password: "" });
      // After signup, go to authenticaiton page
      window.location.href = "/home";
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <h2 className="text-xl sm:text-2xl font-semibold text-center mb-5">
        Create Account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border rounded text-sm sm:text-base"
          required
        />

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
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;

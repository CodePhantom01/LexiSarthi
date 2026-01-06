import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editData, setEditData] = useState({
    name: "",
    email: "",
  });
  const [saving, setSaving] = useState(false);
  const [togglingEmail, setTogglingEmail] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token) {
          setError("Please login first");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(res.data.user);
        setEditData({
          name: res.data.user.name || "",
          email: res.data.user.email || "",
        });
        setError(null);
      } catch (err) {
        const msg =
          err.response?.data?.message || "Failed to load profile";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!token) return;

    setSaving(true);
    setMessage("");

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/updateProfile`,
        {
          name: editData.name,
          email: editData.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(res.data.user);
      setMessage("Profile updated successfully");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Failed to update profile";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleDailyEmail = async () => {
    if (!token || !user) return;

    setTogglingEmail(true);
    setMessage("");

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/users/enable-daily-email`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // flip value in UI
      setUser((prev) =>
        prev ? { ...prev, dailyWordEmail: !prev.dailyWordEmail } : prev
      );
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Failed to update daily word email setting";
      setError(msg);
    } finally {
      setTogglingEmail(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!token) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone."
    );
    if (!confirmDelete) return;

    setDeleting(true);
    setMessage("");

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/users/deleteProfile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // clear token and go to auth page
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (err) {
      const msg =
        err.response?.data?.message || "Failed to delete account";
      setError(msg);
    } finally {
      setDeleting(false);
    }
  };

  const handleBack = () => {
    navigate("/home");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-700">Loading profile...</div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md bg-white border rounded-xl shadow p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-4">
      <div className="max-w-3xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Profile</h1>
          <button
            onClick={handleBack}
            className="px-4 py-2 text-sm rounded-lg border bg-white hover:bg-slate-100 text-slate-700"
          >
            Back to Words
          </button>
        </div>

        {/* Card */}
        <div className="bg-white border rounded-xl shadow-lg p-5 space-y-5">
          {/* Basic info */}
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">
              Account Info
            </h2>
            <p className="text-sm text-slate-600">
              Name: <span className="font-medium">{user?.name}</span>
            </p>
            <p className="text-sm text-slate-600 mt-1">
              Email: <span className="font-medium">{user?.email}</span>
            </p>
          </div>

          {/* Daily word email toggle */}
          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">
              Daily Word Email
            </h2>
            <p className="text-sm text-slate-600 mb-3">
              Get one vocabulary word on your email every day.
            </p>
            <button
              onClick={handleToggleDailyEmail}
              disabled={togglingEmail}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                user?.dailyWordEmail
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-slate-200 text-slate-800 hover:bg-slate-300"
              } disabled:opacity-60`}
            >
              {togglingEmail
                ? "Updating..."
                : user?.dailyWordEmail
                ? "Turn OFF"
                : "Turn ON"}
            </button>
          </div>

          {/* Edit form */}
          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              Edit Profile
            </h2>
            <form onSubmit={handleSave} className="space-y-3 max-w-md">
              <input
                name="name"
                value={editData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full px-3 py-2 border rounded text-sm"
              />
              <input
                name="email"
                type="email"
                value={editData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-3 py-2 border rounded text-sm"
              />
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          {/* Delete account */}
          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold text-red-600 mb-2">
              Danger Zone
            </h2>
            <p className="text-sm text-slate-600 mb-3">
              Deleting your account will remove your profile permanently.
            </p>
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-60"
            >
              {deleting ? "Deleting..." : "Delete Account"}
            </button>
          </div>

          {/* Messages */}
          {(message || error) && (
            <div className="border-t pt-4">
              {message && (
                <p className="text-sm text-green-600">{message}</p>
              )}
              {error && (
                <p className="text-sm text-red-600 mt-1">{error}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;



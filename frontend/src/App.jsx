import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Authentication from "./pages/Authentication.jsx";
import Home from "./pages/Home.jsx";
import WordDetails from "./pages/WordDetails.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import AdminPage from "./pages/AdminPage.jsx";

function App() {
  // Store token in React state so UI updates when it changes
  const [token, setToken] = useState(localStorage.getItem("token"));

  // logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null); // forces React to re-render
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Login / Signup */}
        <Route
          path="/"
          element={token ? <Navigate to="/home" replace /> : <Authentication />}
        />

        {/* Home */}
        <Route
          path="/home"
          element={token ? <Home onLogout={handleLogout} /> : <Navigate to="/" replace />}
        />

        {/* Word details */}
        <Route
          path="/word/:word"
          element={token ? <WordDetails /> : <Navigate to="/" replace />}
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={token ? <UserProfile /> : <Navigate to="/" replace />}
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={token ? <AdminPage onLogout={handleLogout} /> : <Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

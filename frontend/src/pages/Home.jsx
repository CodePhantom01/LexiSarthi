import React, { useState, useEffect } from "react";
import { UserCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login to view words");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/words/getAllWords`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Store full word data for navigation
        setWords(res.data.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch words");
        console.error("Error fetching words:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, []);

  const handleSearch = async () => {
    const term = searchTerm.trim();
    if (!term) {
      // reload full list
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/words/getAllWords`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setWords(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch words");
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/words/searchWord/${encodeURIComponent(
          term
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWords(res.data.data ? [res.data.data] : []);
    } catch (err) {
      setWords([]);
      setError(err.response?.data?.message || "Word not found");
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between max-w-6xl mx-auto mb-6">
        <h1 className="text-2xl font-bold text-slate-800">LexiSarthi</h1>

        <div className="flex items-center gap-2">
          {/* Profile Button */}
          <button
            onClick={handleProfile}
            className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Profile"
          >
            <UserCircle size={20} />
            <span className="hidden sm:inline">Profile</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg border p-5">
        {/* Title + search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">
              Vocabulary Words List
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Click on any word to view detailed information including meaning,
              pronunciation, examples, synonyms, and antonyms.
            </p>
          </div>
          <div className="flex gap-2">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search word"
              className="px-3 py-2 border rounded text-sm"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-slate-800 text-white rounded text-sm hover:bg-slate-900"
            >
              Search
            </button>
          </div>
        </div>

        {/* Table Wrapper */}
        <div className="border rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-600">
              Loading words...
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              {error === "Please login to view words" ? (
                <button
                  onClick={() => {
                    window.location.href = "/";
                  }}
                  className="text-red-600 hover:text-red-800 underline font-medium transition-colors cursor-pointer"
                >
                  {error} - Click here to login
                </button>
              ) : (
                <div className="text-red-600">{error}</div>
              )}
            </div>
          ) : words.length === 0 ? (
            <div className="p-8 text-center text-slate-600">
              No words available
            </div>
          ) : (
            <div className="max-h-[360px] overflow-y-auto">
              <table className="w-full table-fixed">
                <thead className="bg-slate-100 sticky top-0">
                  <tr className="text-left text-sm font-semibold text-slate-700">
                    <th className="w-1/2 px-4 py-2">Word</th>
                    <th className="w-1/2 px-4 py-2">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {words.map((item, index) => (
                    <tr
                      key={item.word || index}
                      onClick={() =>
                        navigate(
                          `/word/${encodeURIComponent(item.word)}`
                        )
                      }
                      className="border-t text-sm text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                    >
                      <td className="w-1/2 px-4 py-2 font-medium">
                        {item.word}
                      </td>
                      <td className="w-1/2 px-4 py-2">
                        {item.meaningHindi}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

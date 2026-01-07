import React, { useEffect, useState } from "react";
import { UserCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = ({ onLogout }) => {
  const [allWords, setAllWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const token = window.localStorage.getItem("token");

  const fetchWords = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/api/words/getAllWords`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAllWords(res.data.data);
      setFilteredWords(res.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch words");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    const term = searchTerm.trim().toLowerCase();

    // Empty search, show all
    if (!term) {
      setFilteredWords(allWords);
      return;
    }

    // Small data, client-side search
    if (allWords.length <= 500) {
      const result = allWords.filter(item =>
        item.word.toLowerCase().includes(term)
      );
      setFilteredWords(result);
      return;
    }

    // Large data, backend search
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/api/words/searchWord/${searchTerm}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFilteredWords(res.data.data ? [res.data.data] : []);
    } catch {
      setFilteredWords([]);
    } finally {
      setLoading(false);
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    if (!token) {
      navigate("/");  // redirect to authentication
    } else {
      fetchWords();
    }
  }, [token, navigate]);  
  

  // LOGOUT
  const handleLogout = () => {
    onLogout();               // update App state, this function passes as prop from app.jsx
    navigate("/", { replace: true });
  };
  

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-4">
      {/* Top Bar */}
      <div className="flex justify-between max-w-6xl mx-auto mb-6">
        <h1 className="text-2xl font-bold">LexiSarthi</h1>

        <div className="flex gap-2">
          <button
            onClick={() => navigate("/profile")}
            className="flex gap-2 px-3 py-2 hover:bg-slate-100 rounded"
          >
            <UserCircle size={20} /> Profile
          </button>

          <button
            onClick={handleLogout}
            className="flex gap-2 px-4 py-2 hover:bg-slate-100 rounded"
          >
            <LogOut size={20} /> Logout
          </button>

        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow border p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Vocabulary Words List</h2>
            <p className="text-sm text-slate-600">
              Click a word to see details
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search word"
              className="w-full sm:w-56 px-3 py-2 border rounded text-sm"
            />
            <button
              onClick={handleSearch}
              className="w-full sm:w-auto px-4 py-2 bg-slate-800 text-white rounded text-sm"
            >
              Search
            </button>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">{error}</div>
          ) : filteredWords.length === 0 ? (
            <div className="p-8 text-center">No words found</div>
          ) : (
            <div className="max-h-[360px] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Word</th>
                    <th className="px-4 py-2 text-left">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWords.map((item, index) => (
                    <tr
                      key={index}
                      onClick={() => navigate(`/word/${item.word}`)}
                      className="border-t hover:bg-slate-100 cursor-pointer"
                    >
                      <td className="px-4 py-2 font-medium">{item.word}</td>
                      <td className="px-4 py-2">{item.meaningHindi}</td>
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

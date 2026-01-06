import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut } from "lucide-react";
import axios from "axios";

const WordDetails = () => {
  // Get word from URL
  const { word } = useParams();

  // Navigation back button
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Run when page loads
  useEffect(() => {
    getWordDetails();
  }, [word]);

  const getWordDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view word details");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/words/searchWord/${word}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(response.data.data);
    } catch (err) {
      setError("Failed to fetch word details");
    } finally {
      setLoading(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-4 flex items-center justify-center">
        <div className="text-slate-600">Loading word details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-4 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  // No data found
  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-4 flex items-center justify-center">
        <div className="text-slate-600">Word not found</div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-4">
      <div className="max-w-4xl mx-auto">

        {/* Top Bar with Back and Logout */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Vocabulary List</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

        {/* Word Details Card */}
        <div className="bg-white rounded-xl shadow-lg border p-6 sm:p-8">

          {/* Word Header */}
          <div className="mb-6 pb-6 border-b">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
              {data.word}
            </h1>

            {data.pronunciation && (
              <p className="text-lg text-slate-600 italic">
                /{data.pronunciation}/
              </p>
            )}
          </div>

          {/* Meaning */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              Meaning
            </h2>
            <p className="text-base text-slate-700">
              {data.meaningHindi}
            </p>
          </div>

          {/* Examples */}
          {data.example && data.example.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-3">
                Examples
              </h2>

              <div className="space-y-2">
                {data.example.map((ex, index) => (
                  <div
                    key={index}
                    className="bg-slate-50 p-3 rounded-lg border-l-4 border-indigo-500"
                  >
                    <p className="text-sm text-slate-700">
                      {ex}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Synonyms */}
          {data.synonyms && data.synonyms.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-3">
                Synonyms
              </h2>

              <div className="flex flex-wrap gap-2">
                {data.synonyms.map((syn, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                  >
                    {syn}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Antonyms */}
          {data.antonyms && data.antonyms.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">
                Antonyms
              </h2>

              <div className="flex flex-wrap gap-2">
                {data.antonyms.map((ant, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                  >
                    {ant}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default WordDetails;

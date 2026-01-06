import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    word: "",
    meaningHindi: "",
    pronunciation: "",
    examples: "",
    synonyms: "",
    antonyms: "",
  });

  const [editingWord, setEditingWord] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const authHeaders = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchAll();
  }, [token]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/api/words/getAllWords",
        authHeaders
      );
      setWords(res.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load words");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      word: "",
      meaningHindi: "",
      pronunciation: "",
      examples: "",
      synonyms: "",
      antonyms: "",
    });
    setEditingWord(null);
    setMessage("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //to seperate ',' values to array
  const toArray = (value) =>
    value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    setSaving(true);
    setMessage("");
    setError(null);

    const body = {
      word: formData.word.trim(),
      meaningHindi: formData.meaningHindi,
      pronunciation: formData.pronunciation,
      example: toArray(formData.examples),
      synonyms: toArray(formData.synonyms),
      antonyms: toArray(formData.antonyms),
    };

    try {
      if (editingWord) {
        await axios.put(
          `http://localhost:5000/api/words/updateWord/${editingWord}`,
          body,
          authHeaders
        );
        setMessage("Word updated successfully");
      } else {
        await axios.post(
          "http://localhost:5000/api/words/addWord",
          body,
          authHeaders
        );
        setMessage("Word added successfully");
      }

      fetchAll();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save word");
    } finally {
      setSaving(false);
    }
  };

  const handleEditSelect = (item) => {
    setEditingWord(item.word);
    setFormData({
      word: item.word || "",
      meaningHindi: item.meaningHindi || "",
      pronunciation: item.pronunciation || "",
      examples: (item.example || []).join(", "),
      synonyms: (item.synonyms || []).join(", "),
      antonyms: (item.antonyms || []).join(", "),
    });
    setMessage("");
  };

  const handleDelete = async (word) => {
    const ok = window.confirm(`Delete "${word}"?`);
    if (!ok) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/words/deleteWord/${word}`,
        authHeaders
      );
      setMessage("Word deleted");
      if (editingWord === word) resetForm();
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete word");
    }
  };

  const handleSearch = async () => {
    const term = searchTerm.trim();
    if (!term) {
      fetchAll();
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/words/searchWord/${term}`,
        authHeaders
      );
      setWords(res.data.data ? [res.data.data] : []);
      setError(null);
    } catch (err) {
      setWords([]);
      setError(err.response?.data?.message || "Not found");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-4">
      <div className="max-w-6xl mx-auto">

        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm border rounded bg-white hover:bg-slate-100"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Form */}
          <div className="bg-white border rounded-xl shadow-lg p-5 space-y-4">
            <h2 className="text-lg font-semibold">
              {editingWord ? "Edit Word" : "Add Word"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input name="word" value={formData.word} onChange={handleChange} placeholder="Word" className="w-full px-3 py-2 border rounded" required />
              <input name="meaningHindi" value={formData.meaningHindi} onChange={handleChange} placeholder="Meaning (Hindi)" className="w-full px-3 py-2 border rounded" required />
              <input name="pronunciation" value={formData.pronunciation} onChange={handleChange} placeholder="Pronunciation" className="w-full px-3 py-2 border rounded" />
              <input name="examples" value={formData.examples} onChange={handleChange} placeholder="Examples (comma separated)" className="w-full px-3 py-2 border rounded" />
              <input name="synonyms" value={formData.synonyms} onChange={handleChange} placeholder="Synonyms (comma separated)" className="w-full px-3 py-2 border rounded" />
              <input name="antonyms" value={formData.antonyms} onChange={handleChange} placeholder="Antonyms (comma separated)" className="w-full px-3 py-2 border rounded" />

              <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">
                {saving ? "Saving..." : editingWord ? "Update Word" : "Add Word"}
              </button>
            </form>

            {message && <p className="text-green-600 text-sm">{message}</p>}
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>

          {/* Table, fixed height, scroll, 10 rows */}
          <div className="bg-white border rounded-xl shadow-lg p-5">
            <div className="flex gap-2 mb-3">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search word"
                className="flex-1 px-3 py-2 border rounded"
              />
              <button onClick={handleSearch} className="px-4 py-2 bg-slate-800 text-white rounded">
                Search
              </button>
              <button onClick={fetchAll} className="px-3 py-2 border rounded">
                Reset
              </button>
            </div>

            <div className="border rounded-lg max-h-[420px] overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center">Loading...</div>
              ) : words.length === 0 ? (
                <div className="p-4 text-center">No words found</div>
              ) : (
                <table className="w-full table-fixed">
                  <thead className="bg-slate-100 sticky top-0">
                    <tr>
                      <th className="w-2/5 px-4 py-2 text-left">Word</th>
                      <th className="w-2/5 px-4 py-2 text-left">Meaning</th>
                      <th className="w-1/5 px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {words.map((item) => (
                      <tr key={item._id} className="border-t">
                        <td className="px-4 py-2 font-medium">{item.word}</td>
                        <td className="px-4 py-2">{item.meaningHindi}</td>
                        <td className="px-4 py-2 space-x-2">
                          <button onClick={() => handleEditSelect(item)} className="text-blue-600">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(item.word)} className="text-red-600">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminPage;

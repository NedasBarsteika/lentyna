// src/pages/forum/TopicFormPage.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import axios from "axios";

function TopicFormPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim() || !formData.description.trim()) {
      setError("Užpildykite visus laukus");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "https://localhost:7296/api/forum/topics",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Tema sėkmingai sukurta!");
      navigate(`/forumas/${response.data.id}`);
    } catch (err: any) {
      setError(err.response?.data || "Nepavyko sukurti temos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-grow max-w-screen-lg mx-auto w-full p-6"
      >
        <h1 className="text-4xl font-bold mb-6">
          {isEditMode ? "Temos redagavimo langas" : "Temos sukūrimo langas"}
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-lg p-6 space-y-6"
        >
          <div>
            <label className="block font-semibold mb-2">Pavadinimas *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Įveskite temos pavadinimą..."
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Aprašymas *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={10}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Parašykite temos aprašymą..."
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              {isEditMode ? "Temos redagavimo langas" : "Temos sukūrimo langas"}
            </button>
            <button
              type="button"
              onClick={() =>
                navigate(isEditMode ? `/forumas/tema/${id}` : "/forumas")
              }
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Atšaukti
            </button>
          </div>
        </form>
      </motion.div>

      <Footer />
    </div>
  );
}

export default TopicFormPage;

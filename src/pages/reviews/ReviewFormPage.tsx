// src/pages/reviews/ReviewFormPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import type { Book } from "../../types";
import axios from "axios";
import { mockBooks } from "../../mockData";

function ReviewFormPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const { reviewId } = useParams<{ reviewId?: string }>();
  const isEditMode = !!reviewId;
  const navigate = useNavigate();

  const [book, setBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({
    text: "",
    rating: 5,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBook();
  }, [bookId]);

  // Real API call - for future use
  const fetchBookFromAPI = async () => {
    const response = await axios.get(
      `https://localhost:7296/api/books/${bookId}`,
    );
    return response.data;
  };

  // Mock data fetching - currently used
  const fetchBook = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const foundBook = mockBooks.find((b) => b.id === bookId);
      setBook(foundBook || null);
    } catch (err) {
      setError("Nepavyko užkrauti knygos informacijos");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "rating" ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.text.trim()) {
      setError("Parašykite atsiliepimą");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        "https://localhost:7296/api/reviews",
        {
          bookId,
          text: formData.text,
          rating: formData.rating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Atsiliepimas sėkmingai paskelbtas!");
      navigate(`/knygos/${bookId}`);
    } catch (err: any) {
      setError(err.response?.data || "Nepavyko paskelbti atsiliepimo");
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
        <h1 className="text-4xl font-bold mb-2">
          {isEditMode ? "Komentaro redagavimo langas" : "Komentaro sukūrimo langas"}
        </h1>
        {book && (
          <p className="text-xl text-gray-600 mb-6">
            Apie knygą: <span className="font-semibold">{book.title}</span>
          </p>
        )}

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
            <label className="block font-semibold mb-2">Įvertinimas *</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                name="rating"
                min="1"
                max="5"
                value={formData.rating}
                onChange={handleChange}
                className="flex-grow"
              />
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-3xl ${i < formData.rating ? "text-yellow-500" : "text-gray-300"}`}
                  >
                    ⭐
                  </span>
                ))}
              </div>
              <span className="text-2xl font-bold w-8">{formData.rating}</span>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Jūsų atsiliepimas *
            </label>
            <textarea
              name="text"
              value={formData.text}
              onChange={handleChange}
              rows={10}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Parašykite savo nuomonę apie knygą..."
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Simbolių: {formData.text.length}
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? "Skelbiama..." : "Paskelbti atsiliepimą"}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/knygos/${bookId}`)}
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

export default ReviewFormPage;

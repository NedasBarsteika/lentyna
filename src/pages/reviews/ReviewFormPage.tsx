// src/pages/reviews/ReviewFormPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import type { Book } from "../../types";
import { booksService, reviewsService } from "../../api";

function ReviewFormPage() {
  const { bookId, reviewId } = useParams<{ bookId: string; reviewId?: string }>();
  const isEditMode = !!reviewId;
  const navigate = useNavigate();

  const [book, setBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({
    komentaro_tekstas: "",
    vertinimas: 5,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookId) {
      fetchBook();
    }
    if (isEditMode && reviewId) {
      fetchReview();
    }
  }, [bookId, reviewId]);

  const fetchBook = async () => {
    try {
      const data = await booksService.getById(bookId!);
      setBook(data);
    } catch (err) {
      setError("Nepavyko užkrauti knygos informacijos");
    }
  };

  const fetchReview = async () => {
    try {
      const reviews = await reviewsService.getByBookId(bookId!);
      const review = reviews.find(r => r.Id === reviewId);
      if (review) {
        setFormData({
          komentaro_tekstas: review.komentaro_tekstas,
          vertinimas: review.vertinimas,
        });
      }
    } catch (err) {
      setError("Nepavyko užkrauti atsiliepimo");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "vertinimas" ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.komentaro_tekstas.trim()) {
      setError("Parašykite atsiliepimą");
      return;
    }

    setLoading(true);

    try {
      if (isEditMode && reviewId) {
        await reviewsService.update(reviewId, {
          komentaro_tekstas: formData.komentaro_tekstas,
          vertinimas: formData.vertinimas,
        });
        alert("Atsiliepimas sėkmingai atnaujintas!");
      } else {
        await reviewsService.create({
          KnygaId: bookId,
          komentaro_tekstas: formData.komentaro_tekstas,
          vertinimas: formData.vertinimas,
        });
        alert("Atsiliepimas sėkmingai paskelbtas!");
      }
      navigate(`/knygos/${bookId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Nepavyko išsaugoti atsiliepimo");
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
            Apie knygą: <span className="font-semibold">{book.knygos_pavadinimas}</span>
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
                name="vertinimas"
                min="1"
                max="5"
                value={formData.vertinimas}
                onChange={handleChange}
                className="flex-grow"
              />
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-3xl ${i < formData.vertinimas ? "text-yellow-500" : "text-gray-300"}`}
                  >
                    ⭐
                  </span>
                ))}
              </div>
              <span className="text-2xl font-bold w-8">{formData.vertinimas}</span>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Jūsų atsiliepimas *
            </label>
            <textarea
              name="komentaro_tekstas"
              value={formData.komentaro_tekstas}
              onChange={handleChange}
              rows={10}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Parašykite savo nuomonę apie knygą..."
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Simbolių: {formData.komentaro_tekstas.length}
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? "Saugoma..." : isEditMode ? "Atnaujinti" : "Paskelbti atsiliepimą"}
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

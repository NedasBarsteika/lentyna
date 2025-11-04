// src/pages/books/BookFormPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ImageUpload from "../../components/ImageUpload";
import type { Author, Genre } from "../../types";
import axios from "axios";
import { mockAuthors, mockBooks, mockGenres } from "../../mockData";

function BookFormPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [authors, setAuthors] = useState<Author[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    authorId: string;
    publishYear: number;
    genreId: string;
  }>({
    title: "",
    description: "",
    authorId: "",
    publishYear: new Date().getFullYear(),
    genreId: "",
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [currentCoverImageUrl, setCurrentCoverImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAuthors();
    fetchGenres();
    if (isEditMode) {
      fetchBook();
    }
  }, [id]);

  // Real API calls - for future use
  const fetchAuthorsFromAPI = async () => {
    const response = await axios.get("https://localhost:7296/api/authors");
    return response.data;
  };

  const fetchBookFromAPI = async () => {
    const response = await axios.get(`https://localhost:7296/api/books/${id}`);
    return response.data;
  };

  // Mock data fetching - currently used
  const fetchAuthors = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setAuthors(mockAuthors);
    } catch (err) {
      console.error("Failed to fetch authors", err);
    }
  };

  const fetchGenres = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setGenres(mockGenres);
    } catch (err) {
      console.error("Failed to fetch genres", err);
    }
  };

  const fetchBook = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const book = mockBooks.find((b) => b.id === id);
      if (book) {
        setFormData({
          title: book.title,
          description: book.description,
          authorId: book.authorId,
          publishYear: book.publishYear,
          genreId: book.genreId,
        });
        setCurrentCoverImageUrl(book.coverImageUrl || "");
      }
    } catch (err) {
      setError("Nepavyko užkrauti knygos informacijos");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (
      !formData.title ||
      !formData.description ||
      !formData.authorId ||
      !formData.genreId
    ) {
      setError("Užpildykite visus privalomus laukus");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");

      // Create FormData for multipart upload
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("authorId", formData.authorId);
      submitData.append("publishYear", formData.publishYear.toString());
      submitData.append("genreId", formData.genreId);

      // Append cover image file if a new one was uploaded
      if (coverImage) {
        submitData.append("coverImage", coverImage);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (isEditMode) {
        await axios.put(
          `https://localhost:7296/api/books/${id}`,
          submitData,
          config,
        );
        alert("Knyga sėkmingai atnaujinta!");
      } else {
        const response = await axios.post(
          "https://localhost:7296/api/books",
          submitData,
          config,
        );
        alert("Knyga sėkmingai sukurta!");
        navigate(`/knygos/${response.data.id}`);
      }
    } catch (err: any) {
      setError(err.response?.data || "Nepavyko išsaugoti knygos");
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
          {isEditMode ? "Knygos redagavimo langas" : "Knygos pridėjimo langas"}
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
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Aprašymas *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Autorius *</label>
            <select
              name="authorId"
              value={formData.authorId}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            >
              <option value="">Pasirinkite autorių</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.firstName} {author.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">Leidimo metai *</label>
            <input
              type="number"
              name="publishYear"
              value={formData.publishYear}
              onChange={handleChange}
              min="1000"
              max={new Date().getFullYear() + 1}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Žanras *</label>
            <select
              name="genreId"
              value={formData.genreId}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            >
              <option value="">Pasirinkite žanrą</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.pavadinimas}
                </option>
              ))}
            </select>
            {formData.genreId && (
              <p className="mt-2 text-sm text-gray-600">
                Nuotaikos:{" "}
                {genres
                  .find((g) => g.id === formData.genreId)
                  ?.moods?.map((m) => m.pavadinimas)
                  .join(", ")}
              </p>
            )}
          </div>

          <ImageUpload
            value={coverImage}
            onChange={setCoverImage}
            currentImageUrl={currentCoverImageUrl}
            label="Knygos viršelis"
            maxSizeMB={5}
          />

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? "Saugoma..." : isEditMode ? "Atnaujinti" : "Sukurti"}
            </button>
            <button
              type="button"
              onClick={() => navigate(isEditMode ? `/knygos/${id}` : "/knygos")}
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

export default BookFormPage;

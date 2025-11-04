// src/pages/authors/AuthorFormPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ImageUpload from "../../components/ImageUpload";
import axios from "axios";

function AuthorFormPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    biography: "",
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode) {
      fetchAuthor();
    }
  }, [id]);

  const fetchAuthor = async () => {
    try {
      const response = await axios.get(
        `https://localhost:7296/api/authors/${id}`,
      );
      const author = response.data;
      setFormData({
        firstName: author.firstName,
        lastName: author.lastName,
        biography: author.biography,
      });
      setCurrentPhotoUrl(author.photoUrl || "");
    } catch (err) {
      setError("Nepavyko užkrauti autoriaus informacijos");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.firstName || !formData.lastName || !formData.biography) {
      setError("Užpildykite visus privalomus laukus");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");

      // Create FormData for multipart upload
      const submitData = new FormData();
      submitData.append("firstName", formData.firstName);
      submitData.append("lastName", formData.lastName);
      submitData.append("biography", formData.biography);

      // Append photo file if a new one was uploaded
      if (photo) {
        submitData.append("photo", photo);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (isEditMode) {
        await axios.put(
          `https://localhost:7296/api/authors/${id}`,
          submitData,
          config,
        );
        alert("Autorius sėkmingai atnaujintas!");
        navigate(`/autoriai/${id}`);
      } else {
        const response = await axios.post(
          "https://localhost:7296/api/authors",
          submitData,
          config,
        );
        alert("Autorius sėkmingai sukurtas!");
        navigate(`/autoriai/${response.data.id}`);
      }
    } catch (err: any) {
      setError(err.response?.data || "Nepavyko išsaugoti autoriaus");
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
          {isEditMode ? "Autoriaus redagavimo langas" : "Autoriaus pridėjimo langas"}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2">Vardas *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Pavardė *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Biografija *</label>
            <textarea
              name="biography"
              value={formData.biography}
              onChange={handleChange}
              rows={10}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Parašykite autoriaus biografiją..."
              required
            />
          </div>

          <ImageUpload
            value={photo}
            onChange={setPhoto}
            currentImageUrl={currentPhotoUrl}
            label="Autoriaus nuotrauka"
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
              onClick={() =>
                navigate(isEditMode ? `/autoriai/${id}` : "/autoriai")
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

export default AuthorFormPage;

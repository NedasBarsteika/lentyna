// src/pages/authors/AuthorFormPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { authorsService, uploadsService } from "../../api";
import ImageUpload from "../../components/ImageUpload";

function AuthorFormPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    vardas: "",
    pavarde: "",
    gimimo_metai: "",
    mirties_data: "",
    curiculum_vitae: "",
    nuotrauka: "",
    tautybe: "",
  });

  const [authorImage, setAuthorImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && id) {
      fetchAuthor();
    }
  }, [id]);

  const fetchAuthor = async () => {
    try {
      const author = await authorsService.getById(id!);
      setFormData({
        vardas: author.vardas,
        pavarde: author.pavarde,
        gimimo_metai: author.gimimo_metai || "",
        mirties_data: author.mirties_data || "",
        curiculum_vitae: author.curiculum_vitae || "",
        nuotrauka: author.nuotrauka || "",
        tautybe: author.tautybe || "",
      });
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

    if (!formData.vardas || !formData.pavarde) {
      setError("Užpildykite visus privalomus laukus");
      return;
    }

    setLoading(true);

    try {
      // Įkelti nuotrauką, jei pasirinkta nauja
      let imageUrl = formData.nuotrauka;
      if (authorImage) {
        imageUrl = await uploadsService.uploadAuthorPhoto(authorImage);
      }

      const authorData = {
        vardas: formData.vardas,
        pavarde: formData.pavarde,
        gimimo_metai: formData.gimimo_metai || undefined,
        mirties_data: formData.mirties_data || undefined,
        curiculum_vitae: formData.curiculum_vitae || undefined,
        nuotrauka: imageUrl || undefined,
        tautybe: formData.tautybe || undefined,
      };

      if (isEditMode && id) {
        await authorsService.update(id, authorData);
        alert("Autorius sėkmingai atnaujintas!");
        navigate(`/autoriai/${id}`);
      } else {
        const response = await authorsService.create(authorData);
        alert("Autorius sėkmingai sukurtas!");
        navigate(`/autoriai/${response.Id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Nepavyko išsaugoti autoriaus");
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
                name="vardas"
                value={formData.vardas}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
                maxLength={100}
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Pavardė *</label>
              <input
                type="text"
                name="pavarde"
                value={formData.pavarde}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
                maxLength={100}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2">Gimimo data</label>
              <input
                type="date"
                name="gimimo_metai"
                value={formData.gimimo_metai}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Mirties data</label>
              <input
                type="date"
                name="mirties_data"
                value={formData.mirties_data}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Tautybė</label>
            <input
              type="text"
              name="tautybe"
              value={formData.tautybe}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              maxLength={100}
              placeholder="pvz. Lietuvis"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Biografija</label>
            <textarea
              name="curiculum_vitae"
              value={formData.curiculum_vitae}
              onChange={handleChange}
              rows={10}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Parašykite autoriaus biografiją..."
            />
          </div>

          <ImageUpload
            value={authorImage}
            onChange={setAuthorImage}
            currentImageUrl={formData.nuotrauka}
            label="Autoriaus nuotrauka"
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

// src/pages/books/BookFormPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ImageUpload from "../../components/ImageUpload";
import type { Author, Genre } from "../../types";
import { booksService, authorsService, uploadsService } from "../../api";

function BookFormPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [authors, setAuthors] = useState<Author[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [formData, setFormData] = useState({
    knygos_pavadinimas: "",
    aprasymas: "",
    AutoriusId: "",
    leidimo_metai: new Date().toISOString().split("T")[0],
    ZanrasId: "",
    psl_skaicius: "",
    ISBN: "",
    kalba: "",
    bestseleris: false,
    virselio_nuotrauka: "",
  });
  console.log(formData);

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInitialData();
  }, [id]);

  const loadInitialData = async () => {
    try {
      const [authorsResponse, genresData] = await Promise.all([
        authorsService.getAll(),
        booksService.getGenres(),
      ]);
      setAuthors(authorsResponse.items);
      setGenres(genresData);

      if (isEditMode && id) {
        const book = await booksService.getById(id);
        setFormData({
          knygos_pavadinimas: book.knygos_pavadinimas,
          aprasymas: book.aprasymas || "",
          AutoriusId: book.AutoriusId,
          leidimo_metai: book.leidimo_metai
            ? new Date(book.leidimo_metai).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          ZanrasId: book.ZanrasId,
          psl_skaicius: book.psl_skaicius?.toString() || "",
          ISBN: book.ISBN || "",
          kalba: book.kalba || "",
          bestseleris: book.bestseleris,
          virselio_nuotrauka: book.virselio_nuotrauka || "",
        });
      }
    } catch (err) {
      setError("Nepavyko užkrauti duomenų");
      console.error(err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (
      !formData.knygos_pavadinimas ||
      !formData.AutoriusId ||
      !formData.ZanrasId
    ) {
      setError("Užpildykite visus privalomus laukus");
      return;
    }

    setLoading(true);

    try {
      if (isEditMode && id) {
        // EDIT MODE: Upload image first (entity already exists)
        let imageUrl = formData.virselio_nuotrauka;
        if (coverImage) {
          try {
            imageUrl = await uploadsService.uploadBookCover(id, coverImage);
          } catch (uploadErr: any) {
            if (uploadErr.response?.status === 404) {
              setError("Knyga neegzistuoja");
              return;
            }
            throw uploadErr;
          }
        }

        const bookData = {
          knygos_pavadinimas: formData.knygos_pavadinimas,
          aprasymas: formData.aprasymas || undefined,
          AutoriusId: formData.AutoriusId,
          leidimo_metai: formData.leidimo_metai || undefined,
          ZanrasId: formData.ZanrasId,
          psl_skaicius: formData.psl_skaicius
            ? parseInt(formData.psl_skaicius)
            : undefined,
          ISBN: formData.ISBN || undefined,
          kalba: formData.kalba || undefined,
          bestseleris: formData.bestseleris,
          virselio_nuotrauka: imageUrl || undefined,
        };

        await booksService.update(id, bookData);
        alert("Knyga sėkmingai atnaujinta!");
        navigate(`/knygos/${id}`);
      } else {
        // CREATE MODE: Two-phase approach
        // Phase 1: Create book WITHOUT image
        const bookData = {
          knygos_pavadinimas: formData.knygos_pavadinimas,
          aprasymas: formData.aprasymas || undefined,
          AutoriusId: formData.AutoriusId,
          leidimo_metai: formData.leidimo_metai || undefined,
          ZanrasId: formData.ZanrasId,
          psl_skaicius: formData.psl_skaicius
            ? parseInt(formData.psl_skaicius)
            : undefined,
          ISBN: formData.ISBN || undefined,
          kalba: formData.kalba || undefined,
          bestseleris: formData.bestseleris,
          virselio_nuotrauka: undefined, // No image yet
        };

        const createdBook = await booksService.create(bookData);
        const bookId = createdBook.Id;

        // Phase 2: Upload image if selected (now we have book ID)
        if (coverImage) {
          try {
            const imageUrl = await uploadsService.uploadBookCover(
              bookId,
              coverImage,
            );

            // Phase 3: Update book with image URL
            await booksService.update(bookId, { virselio_nuotrauka: imageUrl });

            alert("Knyga sėkmingai sukurta!");
            navigate(`/knygos/${bookId}`);
          } catch (uploadErr) {
            // Book created but image upload failed - allow user to edit later
            console.error("Image upload failed:", uploadErr);
            alert(
              "Knyga sukurta, bet nepavyko įkelti viršelio. Redaguokite knygą ir įkelkite viršelį vėliau.",
            );
            navigate(`/knygos/${bookId}`);
          }
        } else {
          alert("Knyga sėkmingai sukurta!");
          navigate(`/knygos/${bookId}`);
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Nepavyko išsaugoti knygos");
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
              name="knygos_pavadinimas"
              value={formData.knygos_pavadinimas}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
              maxLength={255}
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Aprašymas</label>
            <textarea
              name="aprasymas"
              value={formData.aprasymas}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Autorius *</label>
            <select
              name="AutoriusId"
              value={formData.AutoriusId}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            >
              <option value="">Pasirinkite autorių</option>
              {authors.map((author) => (
                <option key={author.Id} value={author.Id}>
                  {author.vardas} {author.pavarde}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">Leidimo data</label>
            <input
              type="date"
              name="leidimo_metai"
              value={formData.leidimo_metai}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Žanras *</label>
            <select
              name="ZanrasId"
              value={formData.ZanrasId}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            >
              <option value="">Pasirinkite žanrą</option>
              {genres.map((genre) => (
                <option key={genre.Id} value={genre.Id}>
                  {genre.pavadinimas}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">
                Puslapių skaičius
              </label>
              <input
                type="number"
                name="psl_skaicius"
                value={formData.psl_skaicius}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">ISBN</label>
              <input
                type="text"
                name="ISBN"
                value={formData.ISBN}
                onChange={handleChange}
                maxLength={20}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Kalba</label>
            <input
              type="text"
              name="kalba"
              value={formData.kalba}
              onChange={handleChange}
              maxLength={50}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="pvz. Lietuvių"
            />
          </div>

          <ImageUpload
            value={coverImage}
            onChange={setCoverImage}
            currentImageUrl={formData.virselio_nuotrauka}
            label="Viršelio nuotrauka"
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="bestseleris"
              id="bestseleris"
              checked={formData.bestseleris}
              onChange={handleChange}
              className="w-5 h-5"
            />
            <label htmlFor="bestseleris" className="font-semibold">
              Bestseleris
            </label>
          </div>

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

// src/pages/books/BookFormPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { MultiSelect } from '../../components/MultiSelect';
import type { Author } from '../../types';
import { BookMood } from '../../types';
import axios from 'axios';
import { mockAuthors, mockBooks } from '../../mockData';

// Available genre options
const GENRE_OPTIONS = [
  { value: 'Istorinis romanas', label: 'Istorinis romanas' },
  { value: 'Lietuvių literatūra', label: 'Lietuvių literatūra' },
  { value: 'Šeimos saga', label: 'Šeimos saga' },
  { value: 'Jaunimo literatūra', label: 'Jaunimo literatūra' },
  { value: 'Karo drama', label: 'Karo drama' },
  { value: 'Poezija', label: 'Poezija' },
  { value: 'Filosofinė poezija', label: 'Filosofinė poezija' },
  { value: 'Šiuolaikinė proza', label: 'Šiuolaikinė proza' },
  { value: 'Psichologinis romanas', label: 'Psichologinis romanas' },
  { value: 'Maginis realizmas', label: 'Maginis realizmas' },
  { value: 'Socialinė drama', label: 'Socialinė drama' },
  { value: 'Romantiška drama', label: 'Romantiška drama' },
  { value: 'Fantastika', label: 'Fantastika' },
  { value: 'Mokslinė fantastika', label: 'Mokslinė fantastika' },
  { value: 'Detektyvas', label: 'Detektyvas' },
  { value: 'Trileris', label: 'Trileris' },
  { value: 'Nuotykių romanas', label: 'Nuotykių romanas' },
  { value: 'Biografija', label: 'Biografija' },
  { value: 'Autobiografija', label: 'Autobiografija' },
  { value: 'Esė', label: 'Esė' },
  { value: 'Drama', label: 'Drama' },
  { value: 'Komedija', label: 'Komedija' },
  { value: 'Klasika', label: 'Klasika' }
];

function BookFormPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [authors, setAuthors] = useState<Author[]>([]);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    authorId: string;
    publishYear: number;
    genres: string[];
    mood: BookMood;
    coverImageUrl: string;
  }>({
    title: '',
    description: '',
    authorId: '',
    publishYear: new Date().getFullYear(),
    genres: [],
    mood: BookMood.NEUTRAL,
    coverImageUrl: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAuthors();
    if (isEditMode) {
      fetchBook();
    }
  }, [id]);

  // Real API calls - for future use
  const fetchAuthorsFromAPI = async () => {
    const response = await axios.get('https://localhost:7296/api/authors');
    return response.data;
  };

  const fetchBookFromAPI = async () => {
    const response = await axios.get(`https://localhost:7296/api/books/${id}`);
    return response.data;
  };

  // Mock data fetching - currently used
  const fetchAuthors = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      setAuthors(mockAuthors);
    } catch (err) {
      console.error('Failed to fetch authors', err);
    }
  };

  const fetchBook = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      const book = mockBooks.find(b => b.id === id);
      if (book) {
        setFormData({
          title: book.title,
          description: book.description,
          authorId: book.authorId,
          publishYear: book.publishYear,
          genres: book.genres,
          mood: book.mood,
          coverImageUrl: book.coverImageUrl || ''
        });
      }
    } catch (err) {
      setError('Nepavyko užkrauti knygos informacijos');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Handle mood field specially to ensure correct type
    if (name === 'mood') {
      setFormData({ ...formData, [name]: value as BookMood });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleGenresChange = (selectedGenres: string[]) => {
    setFormData({ ...formData, genres: selectedGenres });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title || !formData.description || !formData.authorId || formData.genres.length === 0) {
      setError('Užpildykite visus privalomus laukus');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      if (isEditMode) {
        await axios.put(`https://localhost:7296/api/books/${id}`, formData, config);
        alert('Knyga sėkmingai atnaujinta!');
      } else {
        const response = await axios.post('https://localhost:7296/api/books', formData, config);
        alert('Knyga sėkmingai sukurta!');
        navigate(`/knygos/${response.data.id}`);
      }
    } catch (err: any) {
      setError(err.response?.data || 'Nepavyko išsaugoti knygos');
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
          {isEditMode ? 'Redaguoti knygą' : 'Pridėti naują knygą'}
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
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
            <label className="block font-semibold mb-2">Nuotaika *</label>
            <select
              name="mood"
              value={formData.mood}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            >
              <option value={BookMood.HAPPY}>Džiugi</option>
              <option value={BookMood.SAD}>Liūdna</option>
              <option value={BookMood.NEUTRAL}>Neutrali</option>
            </select>
          </div>

          <div>
            <MultiSelect
              label="Žanrai *"
              options={GENRE_OPTIONS}
              value={formData.genres}
              onChange={handleGenresChange}
              placeholder="Pasirinkite žanrus..."
              className="w-full"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Viršelio nuotrauka (URL)</label>
            <input
              type="url"
              name="coverImageUrl"
              value={formData.coverImageUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Saugoma...' : isEditMode ? 'Atnaujinti' : 'Sukurti'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/knygos')}
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

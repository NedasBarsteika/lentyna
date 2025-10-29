// src/pages/authors/AuthorsPage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import type { Author } from '../../types';
import axios from 'axios';
import { mockAuthors } from '../../mockData';

function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditor, setIsEditor] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setIsEditor(user.role === 'editor' || user.role === 'admin');

    fetchAuthors();
  }, []);

  // Real API call - for future use
  const fetchAuthorsFromAPI = async () => {
    const response = await axios.get('https://localhost:7296/api/authors');
    return response.data;
  };

  // Mock data fetching - currently used
  const fetchAuthors = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setAuthors(mockAuthors);
    } catch (err: any) {
      setError('Nepavyko užkrauti autorių');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAuthors = authors.filter(author =>
    `${author.firstName} ${author.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-grow max-w-screen-xl mx-auto w-full p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">Autoriai</h1>
          {isEditor && (
            <Link
              to="/autoriai/naujas"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              + Pridėti autorių
            </Link>
          )}
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Ieškoti autorių..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg text-lg"
          />
        </div>

        {/* Authors Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Kraunama...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-xl text-red-600">{error}</p>
          </div>
        ) : filteredAuthors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Autorių nerasta</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAuthors.map((author) => (
              <Link
                key={author.id}
                to={`/autoriai/${author.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6"
              >
                <div className="flex items-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-4">
                    {author.photoUrl ? (
                      <img
                        src={author.photoUrl}
                        alt={`${author.firstName} ${author.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">👤</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{author.firstName} {author.lastName}</h3>
                    {author.books && (
                      <p className="text-gray-600 text-sm">{author.books.length} knygos</p>
                    )}
                  </div>
                </div>
                <p className="text-gray-700 line-clamp-3">
                  {author.biography}
                </p>
              </Link>
            ))}
          </div>
        )}
      </motion.div>

      <Footer />
    </div>
  );
}

export default AuthorsPage;

// src/pages/authors/AuthorDetailsPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import type { Author } from '../../types';
import axios from 'axios';
import { mockAuthors } from '../../mockData';

function AuthorDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setIsAuthenticated(!!token);
    setIsEditor(user.role === 'editor' || user.role === 'admin');

    fetchAuthorDetails();
    if (token) {
      checkFavoriteStatus();
    }
  }, [id]);

  // Real API calls - for future use
  const fetchAuthorDetailsFromAPI = async () => {
    const response = await axios.get(`https://localhost:7296/api/authors/${id}`);
    return response.data;
  };

  const checkFavoriteStatusFromAPI = async () => {
    const response = await axios.get(`https://localhost:7296/api/favorite-authors/check/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    return response.data.isFavorite;
  };

  // Mock data fetching - currently used
  const fetchAuthorDetails = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const foundAuthor = mockAuthors.find(a => a.id === id);
      setAuthor(foundAuthor || null);
      if (!foundAuthor) {
        setError('Autorius nerastas');
      }
    } catch (err) {
      setError('Nepavyko užkrauti autoriaus informacijos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      // Mock - randomly set favorite status
      setIsFavorite(Math.random() > 0.5);
    } catch (err) {
      console.error('Failed to check favorite status', err);
    }
  };

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await axios.delete(`https://localhost:7296/api/favorite-authors/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        setIsFavorite(false);
        alert('Autorius pašalintas iš mėgstamų');
      } else {
        await axios.post(`https://localhost:7296/api/favorite-authors`, {
          authorId: id
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        setIsFavorite(true);
        alert('Autorius pridėtas į mėgstamus! Gausite pranešimus apie naujas knygas.');
      }
    } catch (err) {
      alert('Nepavyko atnaujinti mėgstamų sąrašo');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Ar tikrai norite ištrinti šį autorių?')) {
      try {
        await axios.delete(`https://localhost:7296/api/authors/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        navigate('/autoriai');
      } catch (err) {
        alert('Nepavyko ištrinti autoriaus');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl text-gray-600">Kraunama...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl text-red-600">{error || 'Autorius nerastas'}</p>
        </div>
        <Footer />
      </div>
    );
  }

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
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Author Photo */}
            <div className="md:w-1/3">
              <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                {author.photoUrl ? (
                  <img
                    src={author.photoUrl}
                    alt={`${author.firstName} ${author.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-9xl">👤</span>
                )}
              </div>

              {/* Favorite Button */}
              {isAuthenticated && (
                <button
                  onClick={toggleFavorite}
                  className={`w-full mt-4 px-4 py-2 rounded-lg font-semibold ${
                    isFavorite
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-yellow-600 text-white hover:bg-yellow-700'
                  }`}
                >
                  {isFavorite ? '❤️ Mėgstamas autorius' : '🤍 Pridėti į mėgstamus'}
                </button>
              )}
            </div>

            {/* Author Info */}
            <div className="md:w-2/3">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-4xl font-bold">{author.firstName} {author.lastName}</h1>
                {isEditor && (
                  <div className="flex gap-2">
                    <Link
                      to={`/autoriai/${id}/redaguoti`}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Redaguoti
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Ištrinti
                    </button>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Biografija</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{author.biography}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Author's Books */}
        <div>
          <h2 className="text-3xl font-bold mb-6">Autoriaus knygos</h2>
          {author.books && author.books.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {author.books.map((book) => (
                <Link
                  key={book.id}
                  to={`/knygos/${book.id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
                >
                  <div className="h-64 bg-gray-200 flex items-center justify-center">
                    {book.coverImageUrl ? (
                      <img
                        src={book.coverImageUrl}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl">📚</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2">{book.title}</h3>
                    <p className="text-gray-600 mb-2">{book.publishYear}</p>
                    {book.averageRating && (
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">⭐</span>
                        <span className="font-semibold">{book.averageRating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Autoriaus knygų dar nėra sistemoje</p>
          )}
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}

export default AuthorDetailsPage;

// src/pages/books/BookDetailsPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import type { Book, Review } from '../../types';
import { BookMood } from '../../types';
import axios from 'axios';
import { mockBooks, mockReviews } from '../../mockData';

function BookDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setIsAuthenticated(!!token);
    setIsEditor(user.role === 'editor' || user.role === 'admin');
    setUserId(user.id || '');

    fetchBookDetails();
    fetchReviews();
  }, [id]);

  // Real API calls - for future use
  const fetchBookDetailsFromAPI = async () => {
    const response = await axios.get(`https://localhost:7296/api/books/${id}`);
    return response.data;
  };

  const fetchReviewsFromAPI = async () => {
    const response = await axios.get(`https://localhost:7296/api/reviews/book/${id}`);
    return response.data;
  };

  // Mock data fetching - currently used
  const fetchBookDetails = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const foundBook = mockBooks.find(b => b.id === id);
      setBook(foundBook || null);
      if (!foundBook) {
        setError('Knyga nerasta');
      }
    } catch (err) {
      setError('Nepavyko užkrauti knygos informacijos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      const bookReviews = mockReviews.filter(r => r.bookId === id);
      setReviews(bookReviews);
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Ar tikrai norite ištrinti šią knygą?')) {
      try {
        await axios.delete(`https://localhost:7296/api/books/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        navigate('/knygos');
      } catch (err) {
        alert('Nepavyko ištrinti knygos');
      }
    }
  };

  const addToBookshelf = async (status: string) => {
    try {
      await axios.post('https://localhost:7296/api/bookshelf', {
        bookId: id,
        status
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      alert('Knyga pridėta į jūsų sąrašą!');
    } catch (err) {
      alert('Nepavyko pridėti knygos į sąrašą');
    }
  };

  const getMoodText = (mood: BookMood) => {
    switch (mood) {
      case BookMood.HAPPY:
        return 'Džiugi';
      case BookMood.SAD:
        return 'Liūdna';
      case BookMood.NEUTRAL:
        return 'Neutrali';
      default:
        return '';
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

  if (error || !book) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl text-red-600">{error || 'Knyga nerasta'}</p>
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
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Book Cover */}
            <div className="md:col-span-1">
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                {book.coverImageUrl ? (
                  <img
                    src={book.coverImageUrl}
                    alt={book.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-9xl">📚</span>
                )}
              </div>

              {/* Add to Bookshelf */}
              {isAuthenticated && (
                <div className="mt-4">
                  <p className="font-semibold mb-2">Pridėti į sąrašą:</p>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => addToBookshelf('read')}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Perskaitytos
                    </button>
                    <button
                      onClick={() => addToBookshelf('reading')}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Skaitomos
                    </button>
                    <button
                      onClick={() => addToBookshelf('want_to_read')}
                      className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                    >
                      Norimos skaityti
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Book Details */}
            <div className="md:col-span-2">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-4xl font-bold">{book.title}</h1>
                {isEditor && (
                  <div className="flex gap-2">
                    <Link
                      to={`/knygos/${id}/redaguoti`}
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

              <Link
                to={`/autoriai/${book.authorId}`}
                className="text-xl text-blue-600 hover:underline mb-2 block"
              >
                {book.author?.firstName} {book.author?.lastName}
              </Link>

              <p className="text-gray-600 mb-4">Leidimo metai: {book.publishYear}</p>

              <div className="mb-4">
                <span className="font-semibold">Nuotaika: </span>
                <span className="text-gray-700">{getMoodText(book.mood)}</span>
              </div>

              {book.averageRating && (
                <div className="flex items-center mb-4">
                  <span className="text-yellow-500 text-2xl mr-2">⭐</span>
                  <span className="text-2xl font-bold">{book.averageRating.toFixed(1)}</span>
                  <span className="text-gray-600 ml-2">({book.reviewCount} atsiliepimai)</span>
                </div>
              )}

              <div className="mb-4">
                <h3 className="font-semibold mb-2">Žanrai:</h3>
                <div className="flex flex-wrap gap-2">
                  {book.genres.map((genre, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Aprašymas:</h3>
                <p className="text-gray-700 leading-relaxed">{book.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold">Atsiliepimai</h2>
            {isAuthenticated && (
              <Link
                to={`/knygos/${id}/atsiliepimas`}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Rašyti atsiliepimą
              </Link>
            )}
          </div>

          {reviews.length === 0 ? (
            <p className="text-gray-600">Atsiliepimų dar nėra</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className={`bg-white rounded-lg shadow-md p-6 ${review.isAiGenerated ? 'border-2 border-purple-500' : ''}`}
                >
                  {review.isAiGenerated && (
                    <div className="mb-2 flex items-center">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                        🤖 DI sugeneruotas atsiliepimas
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="font-semibold mr-2">
                        {review.user?.username || 'Nežinomas'}
                      </span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}>
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}

export default BookDetailsPage;

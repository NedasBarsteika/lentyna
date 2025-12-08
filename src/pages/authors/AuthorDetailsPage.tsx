// src/pages/authors/AuthorDetailsPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import type { Author, Book, Citation } from '../../types';
import { authorsService, followingService } from '../../api';
import { UserRole } from '../../types';

function AuthorDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [author, setAuthor] = useState<Author | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setIsAuthenticated(!!token);
    setIsEditor(user.role === UserRole.EDITOR || user.role === UserRole.ADMIN);

    if (id) {
      fetchAuthorDetails();
      fetchAuthorBooks();
      fetchAuthorCitations();
      if (token) {
        checkFollowingStatus();
      }
    }
  }, [id]);

  const fetchAuthorDetails = async () => {
    try {
      const data = await authorsService.getById(id!);
      setAuthor(data);
    } catch (err) {
      setError('Nepavyko užkrauti autoriaus informacijos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthorBooks = async () => {
    try {
      const data = await authorsService.getAuthorBooks(id!);
      setBooks(data);
    } catch (err) {
      console.error('Failed to fetch author books', err);
    }
  };

  const fetchAuthorCitations = async () => {
    try {
      const data = await authorsService.getAuthorCitations(id!);
      setCitations(data);
    } catch (err) {
      console.error('Failed to fetch citations', err);
    }
  };

  const checkFollowingStatus = async () => {
    try {
      const result = await followingService.isFollowing(id!);
      setIsFollowing(result);
    } catch (err) {
      console.error('Failed to check following status', err);
    }
  };

  const toggleFollowing = async () => {
    try {
      if (isFollowing) {
        await followingService.unfollow(id!);
        setIsFollowing(false);
        alert('Autorius pašalintas iš sekamų');
      } else {
        await followingService.follow({ AutoriusId: id! });
        setIsFollowing(true);
        alert('Autorius pridėtas į sekamus! Gausite pranešimus apie naujas knygas.');
      }
    } catch (err) {
      alert('Nepavyko atnaujinti sekamų sąrašo');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Ar tikrai norite ištrinti šį autorių?')) {

      try {
        if (books.length != 0) {
          alert('Autorius turi knygų');
          return;
        }
        await authorsService.delete(id!);
        alert('Ištrynimas sėkmingas');
        navigate('/autoriai');
      } catch (err) {
        alert('Nepavyko ištrinti autoriaus');
      }
    } else {
        alert('Atšaukta');
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
                {author.nuotrauka ? (
                  <img
                    src={author.nuotrauka}
                    alt={`${author.vardas} ${author.pavarde}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-9xl">👤</span>
                )}
              </div>

              {/* Follow Button */}
              {isAuthenticated && (
                <button
                  onClick={toggleFollowing}
                  className={`w-full mt-4 px-4 py-2 rounded-lg font-semibold ${
                    isFollowing
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-yellow-600 text-white hover:bg-yellow-700'
                  }`}
                >
                  {isFollowing ? '❤️ Sekamas autorius' : '🤍 Sekti autorių'}
                </button>
              )}
            </div>

            {/* Author Info */}
            <div className="md:w-2/3">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-4xl font-bold">{author.vardas} {author.pavarde}</h1>
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

              {author.tautybe && (
                <p className="text-gray-600 mb-2">Tautybė: {author.tautybe}</p>
              )}

              {author.gimimo_metai && (
                <p className="text-gray-600 mb-2">
                  Gimimo data: {new Date(author.gimimo_metai).toLocaleDateString('lt-LT')}
                  {author.mirties_data && ` - ${new Date(author.mirties_data).toLocaleDateString('lt-LT')}`}
                </p>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Biografija</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {author.curiculum_vitae || 'Biografija nepateikta'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Citations */}
        {citations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6">Citatos</h2>
            <div className="space-y-4">
              {citations.map((citation) => (
                <blockquote
                  key={citation.Id}
                  className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600"
                >
                  <p className="text-lg italic text-gray-700">"{citation.citatos_tekstas}"</p>
                  {citation.citatos_saltinis && (
                    <cite className="text-sm text-gray-500 mt-2 block">— {citation.citatos_saltinis}</cite>
                  )}
                </blockquote>
              ))}
            </div>
          </div>
        )}

        {/* Author's Books */}
        <div>
          <h2 className="text-3xl font-bold mb-6">Autoriaus knygos</h2>
          {books.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <Link
                  key={book.Id}
                  to={`/knygos/${book.Id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
                >
                  <div className="h-64 bg-gray-200 flex items-center justify-center">
                    {book.virselio_nuotrauka ? (
                      <img
                        src={book.virselio_nuotrauka}
                        alt={book.knygos_pavadinimas}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl">📚</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2">{book.knygos_pavadinimas}</h3>
                    <p className="text-gray-600 mb-2">
                      {book.leidimo_metai ? new Date(book.leidimo_metai).getFullYear() : 'Nežinoma'}
                    </p>
                    {book.vidutinis_vertinimas !== undefined && book.vidutinis_vertinimas > 0 && (
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">⭐</span>
                        <span className="font-semibold">{book.vidutinis_vertinimas.toFixed(1)}</span>
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

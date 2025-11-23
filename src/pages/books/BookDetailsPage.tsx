// src/pages/books/BookDetailsPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import type { Book, Review } from "../../types";
import { booksService, reviewsService, bookshelfService } from "../../api";
import { UserRole, BookshelfStatus } from "../../types";

function BookDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setIsAuthenticated(!!token);
    setIsEditor(user.role === UserRole.EDITOR || user.role === UserRole.ADMIN);
    setIsAdmin(user.role === UserRole.ADMIN);
    setUserId(user.Id || "");

    if (id) {
      fetchBookDetails();
      fetchReviews();
    }
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      const data = await booksService.getById(id!);
      setBook(data);
    } catch (err) {
      setError("Nepavyko užkrauti knygos informacijos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const data = await reviewsService.getByBookId(id!);
      setReviews(data);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Ar tikrai norite ištrinti šią knygą?")) {
      try {
        await booksService.delete(id!);
        navigate("/knygos");
      } catch (err) {
        alert("Nepavyko ištrinti knygos");
      }
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm("Ar tikrai norite ištrinti šį atsiliepimą?")) {
      try {
        await reviewsService.delete(reviewId);
        setReviews(reviews.filter(r => r.Id !== reviewId));
      } catch (err) {
        alert("Nepavyko ištrinti atsiliepimo");
      }
    }
  };

  const addToBookshelf = async (status: BookshelfStatus) => {
    try {
      await bookshelfService.create({
        KnygaId: id!,
        tipas: status
      });
      alert('Knyga pridėta į jūsų sąrašą!');
    } catch (err) {
      alert('Nepavyko pridėti knygos į sąrašą');
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
          <p className="text-xl text-red-600">{error || "Knyga nerasta"}</p>
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
                {book.virselio_nuotrauka ? (
                  <img
                    src={book.virselio_nuotrauka}
                    alt={book.knygos_pavadinimas}
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
                      onClick={() => addToBookshelf(BookshelfStatus.READ)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Perskaitytos
                    </button>
                    <button
                      onClick={() => addToBookshelf(BookshelfStatus.READING)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Skaitomos
                    </button>
                    <button
                      onClick={() => addToBookshelf(BookshelfStatus.WANT_TO_READ)}
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
                <h1 className="text-4xl font-bold">{book.knygos_pavadinimas}</h1>
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
                to={`/autoriai/${book.AutoriusId}`}
                className="text-xl text-blue-600 hover:underline mb-2 block"
              >
                {book.autorius_vardas || (book.Autorius ? `${book.Autorius.vardas} ${book.Autorius.pavarde}` : 'Nežinomas autorius')}
              </Link>

              <p className="text-gray-600 mb-4">
                Leidimo metai: {book.leidimo_metai ? new Date(book.leidimo_metai).getFullYear() : 'Nežinoma'}
              </p>

              {book.vidutinis_vertinimas !== undefined && book.vidutinis_vertinimas > 0 && (
                <div className="flex items-center mb-4">
                  <span className="text-yellow-500 text-2xl mr-2">⭐</span>
                  <span className="text-2xl font-bold">
                    {book.vidutinis_vertinimas.toFixed(1)}
                  </span>
                  <span className="text-gray-600 ml-2">
                    ({book.komentaru_skaicius} komentarai)
                  </span>
                </div>
              )}

              <div className="mb-4">
                <h3 className="font-semibold mb-2">Žanras:</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {book.Zanras?.pavadinimas || "Nežinomas žanras"}
                </span>
                {book.bestseleris && (
                  <span className="ml-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                    Bestseleris
                  </span>
                )}
              </div>

              {book.kalba && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Kalba:</h3>
                  <span>{book.kalba}</span>
                </div>
              )}

              {book.psl_skaicius && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Puslapių skaičius:</h3>
                  <span>{book.psl_skaicius}</span>
                </div>
              )}

              {book.ISBN && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">ISBN:</h3>
                  <span>{book.ISBN}</span>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Aprašymas:</h3>
                <p className="text-gray-700 leading-relaxed">
                  {book.aprasymas || 'Aprašymas nepateiktas'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Comment Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold">Komentarai</h2>
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
                  key={review.Id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                      <span className="font-semibold">
                        {review.Naudotojas?.slapyvardis || "Nežinomas"}
                      </span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < review.vertinimas
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }
                          >
                            ⭐
                          </span>
                        ))}
                      </div>

                      {(review.NaudotojasId === userId || isAdmin) && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDeleteReview(review.Id)}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                          >
                            Ištrinti
                          </button>
                          {review.NaudotojasId === userId && (
                            <Link
                              to={`/knygos/${id}/atsiliepimas/redaguoti/${review.Id}`}
                              className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700"
                            >
                              Redaguoti
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.komentaro_data).toLocaleDateString('lt-LT')}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.komentaro_tekstas}</p>
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

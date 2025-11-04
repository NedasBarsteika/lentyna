// src/pages/bookshelf/BookshelfPage.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import type { BookshelfEntry, BookRecommendation, Book } from "../../types";
import { BookshelfStatus } from "../../types";
import axios from "axios";
import {
  mockBookshelfEntries,
  mockRecommendations,
  mockBooks,
} from "../../mockData";

function BookshelfPage() {
  const [bookshelfEntries, setBookshelfEntries] = useState<BookshelfEntry[]>(
    []
  );
  const [recommendations, setRecommendations] = useState<BookRecommendation[]>(
    []
  );
  const [activeTab, setActiveTab] = useState<"all" | BookshelfStatus>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [tempStatus, setTempStatus] = useState<BookshelfStatus | null>(null);

  // New state for book selection
  const [availableBooks, setAvailableBooks] = useState<Book[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookshelf();
    fetchRecommendations();
  }, []);

  // Fetch available books when modal opens
  useEffect(() => {
    if (showAddModal) {
      fetchAvailableBooks();
    }
  }, [showAddModal, bookshelfEntries]);

  // Real API calls - for future use
  const fetchBookshelfFromAPI = async () => {
    const token = localStorage.getItem("authToken");
    const response = await axios.get("https://localhost:7296/api/bookshelf", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  const fetchRecommendationsFromAPI = async () => {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(
      "https://localhost:7296/api/recommendations",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  };

  // Mock data fetching - currently used
  const fetchBookshelf = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setBookshelfEntries(mockBookshelfEntries);
    } catch (err: any) {
      setError("Nepavyko užkrauti knygų sąrašo");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setRecommendations(mockRecommendations);
    } catch (err) {
      console.error("Failed to fetch recommendations", err);
    }
  };

  const fetchAvailableBooks = async () => {
    setLoadingBooks(true);
    setSaveError(null);
    try {
      // Get IDs of books already in bookshelf
      const bookshelfBookIds = bookshelfEntries.map((entry) => entry.bookId);

      // Filter out books already in bookshelf
      const filteredBooks = mockBooks.filter(
        (book) => !bookshelfBookIds.includes(book.id)
      );

      setAvailableBooks(filteredBooks);
    } catch (err) {
      console.error("Failed to fetch books", err);
      setSaveError("Nepavyko užkrauti knygų sąrašo");
    } finally {
      setLoadingBooks(false);
    }
  };

  const handleRemove = async (entryId: string) => {
    if (window.confirm("Ar tikrai norite pašalinti šią knygą iš sąrašo?")) {
      try {
        const token = localStorage.getItem("authToken");
        await axios.delete(`https://localhost:7296/api/bookshelf/${entryId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookshelfEntries(
          bookshelfEntries.filter((entry) => entry.id !== entryId)
        );
        alert("Knyga pašalinta iš sąrašo");
      } catch (err) {
        alert("Nepavyko pašalinti knygos");
      }
    }
  };

  const handleStatusChange = async (
    entryId: string,
    newStatus: BookshelfStatus
  ) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `https://localhost:7296/api/bookshelf/${entryId}`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBookshelfEntries(
        bookshelfEntries.map((entry) =>
          entry.id === entryId ? { ...entry, status: newStatus } : entry
        )
      );
    } catch (err) {
      alert("Nepavyko pakeisti būsenos");
    }
  };

  const handleAddBook = async () => {
    if (!selectedBookId) {
      setSaveError("Prašome pasirinkti knygą");
      return;
    }

    setSaveError(null);
    setLoadingBooks(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "https://localhost:7296/api/bookshelf",
        {
          bookId: selectedBookId,
          status: BookshelfStatus.WANT_TO_READ,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Add the new entry to bookshelf
      const selectedBook = availableBooks.find(
        (book) => book.id === selectedBookId
      );
      if (selectedBook) {
        const newEntry: BookshelfEntry = {
          id: response.data.id || `temp-${Date.now()}`,
          userId: response.data.userId || "1",
          bookId: selectedBookId,
          book: selectedBook,
          status: BookshelfStatus.WANT_TO_READ,
          addedAt: new Date(),
        };
        setBookshelfEntries([...bookshelfEntries, newEntry]);
      }

      // Close modal and reset state
      setShowAddModal(false);
      setSelectedBookId(null);
      setSearchQuery("");
      alert("Knyga sėkmingai pridėta į sąrašą!");
    } catch (err: any) {
      console.error("Failed to add book", err);
      setSaveError(
        err.response?.data?.message || "Nepavyko pridėti knygos į sąrašą"
      );
    } finally {
      setLoadingBooks(false);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setSelectedBookId(null);
    setSearchQuery("");
    setSaveError(null);
  };

  const getStatusText = (status: BookshelfStatus) => {
    switch (status) {
      case BookshelfStatus.READ:
        return "Perskaitytos";
      case BookshelfStatus.READING:
        return "Skaitomos";
      case BookshelfStatus.WANT_TO_READ:
        return "Norimos skaityti";
    }
  };

  const getStatusColor = (status: BookshelfStatus) => {
    switch (status) {
      case BookshelfStatus.READ:
        return "bg-green-100 text-green-800";
      case BookshelfStatus.READING:
        return "bg-blue-100 text-blue-800";
      case BookshelfStatus.WANT_TO_READ:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const filteredEntries =
    activeTab === "all"
      ? bookshelfEntries
      : bookshelfEntries.filter((entry) => entry.status === activeTab);

  const countByStatus = (status: BookshelfStatus) =>
    bookshelfEntries.filter((entry) => entry.status === status).length;

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
        <h1 className="text-4xl font-bold mb-6">Mano knygų sąrašas</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {bookshelfEntries.length}
            </div>
            <div className="text-gray-600">Iš viso</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-3xl font-bold text-green-600">
              {countByStatus(BookshelfStatus.READ)}
            </div>
            <div className="text-gray-600">Perskaitytos</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {countByStatus(BookshelfStatus.READING)}
            </div>
            <div className="text-gray-600">Skaitomos</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {countByStatus(BookshelfStatus.WANT_TO_READ)}
            </div>
            <div className="text-gray-600">Norimos</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeTab === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Visos ({bookshelfEntries.length})
          </button>
          <button
            onClick={() => setActiveTab(BookshelfStatus.READ)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeTab === BookshelfStatus.READ
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Perskaitytos ({countByStatus(BookshelfStatus.READ)})
          </button>
          <button
            onClick={() => setActiveTab(BookshelfStatus.READING)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeTab === BookshelfStatus.READING
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Skaitomos ({countByStatus(BookshelfStatus.READING)})
          </button>
          <button
            onClick={() => setActiveTab(BookshelfStatus.WANT_TO_READ)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeTab === BookshelfStatus.WANT_TO_READ
                ? "bg-yellow-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Norimos ({countByStatus(BookshelfStatus.WANT_TO_READ)})
          </button>
        </div>

        {/* Add Book Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
          >
            + Pridėti knygą
          </button>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Kraunama...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-xl text-red-600">{error}</p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Knygų nerasta</p>
            <Link
              to="/knygos"
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              Naršyti knygas
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
              >
                <Link to={`/knygos/${entry.bookId}`}>
                  <div className="h-64 bg-gray-200 flex items-center justify-center">
                    {entry.book?.coverImageUrl ? (
                      <img
                        src={entry.book.coverImageUrl}
                        alt={entry.book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl">📚</span>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link to={`/knygos/${entry.bookId}`}>
                    <h3 className="text-xl font-bold mb-2 hover:text-blue-600">
                      {entry.book?.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 mb-3">
                    {entry.book?.author?.firstName}{" "}
                    {entry.book?.author?.lastName}
                  </p>

                  <div className="mb-3">
                    {editingEntryId === entry.id ? (
                      // --- RODOMA, KAI REDAGUOJAMA ---
                      <>
                        <select
                          value={tempStatus ?? entry.status}
                          onChange={(e) =>
                            setTempStatus(e.target.value as BookshelfStatus)
                          }
                          className={`w-full px-3 py-2 rounded-lg font-semibold mb-3 ${getStatusColor(
                            tempStatus ?? entry.status
                          )}`}
                        >
                          <option value={BookshelfStatus.READ}>
                            Perskaitytos
                          </option>
                          <option value={BookshelfStatus.READING}>
                            Skaitomos
                          </option>
                          <option value={BookshelfStatus.WANT_TO_READ}>
                            Norimos skaityti
                          </option>
                        </select>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              if (tempStatus && tempStatus !== entry.status) {
                                handleStatusChange(entry.id, tempStatus);
                              }
                              setEditingEntryId(null);
                              setTempStatus(null);
                            }}
                            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Išsaugoti
                          </button>
                          <button
                            onClick={() => {
                              setEditingEntryId(null);
                              setTempStatus(null);
                            }}
                            className="flex-1 px-3 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                          >
                            Atšaukti
                          </button>
                        </div>
                      </>
                    ) : (
                      // --- RODOMA IŠ PRADŽIŲ ---
                      <>
                        <div
                          className={`w-full text-center px-3 py-2 rounded-lg font-semibold mb-3 ${getStatusColor(
                            entry.status
                          )}`}
                        >
                          {getStatusText(entry.status)}
                        </div>
                        <button
                          onClick={() => {
                            setEditingEntryId(entry.id);
                            setTempStatus(entry.status);
                          }}
                          className="w-full px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                        >
                          Redaguoti
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => handleRemove(entry.id)}
                    className="w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Pašalinti
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6">
              Rekomenduojamos knygos jums
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.slice(0, 6).map((rec) => (
                <Link
                  key={rec.book.id}
                  to={`/knygos/${rec.book.id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
                >
                  <div className="h-64 bg-gray-200 flex items-center justify-center">
                    {rec.book.coverImageUrl ? (
                      <img
                        src={rec.book.coverImageUrl}
                        alt={rec.book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl">📚</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2">{rec.book.title}</h3>
                    <p className="text-gray-600 mb-2">
                      {rec.book.author?.firstName} {rec.book.author?.lastName}
                    </p>
                    <p className="text-sm text-blue-600 italic">{rec.reason}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-5 text-center">
              Pridėti knygą į sąrašą
            </h2>

            {loadingBooks ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Kraunama...</p>
              </div>
            ) : availableBooks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Visos knygos jau pridėtos į jūsų sąrašą!
                </p>
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Uždaryti
                </button>
              </div>
            ) : (
              <>
                {/* Search Input */}
                <div className="mb-4">
                  <label className="block mb-2 font-semibold">
                    Ieškoti knygos
                  </label>
                  <input
                    type="text"
                    placeholder="Įveskite knygos pavadinimą arba autoriaus vardą..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Books List */}
                <div className="mb-4">
                  <label className="block mb-2 font-semibold">
                    Pasirinkite knygą (
                    {
                      availableBooks.filter((book) => {
                        const query = searchQuery.toLowerCase();
                        return (
                          book.title.toLowerCase().includes(query) ||
                          `${book.author?.firstName} ${book.author?.lastName}`
                            .toLowerCase()
                            .includes(query)
                        );
                      }).length
                    }{" "}
                    rasta)
                  </label>
                  <div className="border border-gray-300 rounded-lg max-h-96 overflow-y-auto">
                    {availableBooks
                      .filter((book) => {
                        const query = searchQuery.toLowerCase();
                        return (
                          book.title.toLowerCase().includes(query) ||
                          `${book.author?.firstName} ${book.author?.lastName}`
                            .toLowerCase()
                            .includes(query)
                        );
                      })
                      .map((book) => (
                        <div
                          key={book.id}
                          onClick={() => setSelectedBookId(book.id)}
                          className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-blue-50 transition-colors ${
                            selectedBookId === book.id
                              ? "bg-blue-100 border-l-4 border-l-blue-600"
                              : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-12 h-16 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                              {book.coverImageUrl ? (
                                <img
                                  src={book.coverImageUrl}
                                  alt={book.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-2xl">📚</span>
                              )}
                            </div>
                            <div className="flex-grow">
                              <h3 className="font-bold text-lg">
                                {book.title}
                              </h3>
                              <p className="text-gray-600">
                                {book.author?.firstName} {book.author?.lastName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {book.publishYear} • {book.genre?.pavadinimas}
                              </p>
                            </div>
                            {selectedBookId === book.id && (
                              <div className="flex-shrink-0">
                                <svg
                                  className="w-6 h-6 text-blue-600"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <label className="block mb-1 font-semibold">Sąrašas</label>
                <select className="w-full border rounded-lg px-3 py-2 mb-5">
                  <option>Perskaityta</option>
                  <option>Skaitoma</option>
                  <option>Norima skaityti</option>
                </select>

                {/* Error Message */}
                {saveError && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {saveError}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                  >
                    Atšaukti
                  </button>
                  <button
                    onClick={handleAddBook}
                    disabled={!selectedBookId || loadingBooks}
                    className={`px-4 py-2 rounded-lg ${
                      selectedBookId && !loadingBooks
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-400 text-gray-200 cursor-not-allowed"
                    }`}
                  >
                    {loadingBooks ? "Pridedama..." : "Pridėti"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default BookshelfPage;

// src/pages/bookshelf/BookshelfPage.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import type { BookshelfEntry, BookRecommendation, Book } from "../../types";
import { BookshelfStatus } from "../../types";
import { bookshelfService, booksService } from "../../api";

function BookshelfPage() {
  const [bookshelfEntries, setBookshelfEntries] = useState<BookshelfEntry[]>([]);
  const [recommendations, setRecommendations] = useState<BookRecommendation[]>([]);
  const [recommendationsLoaded, setRecommendationsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | BookshelfStatus>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [tempStatus, setTempStatus] = useState<BookshelfStatus | null>(null);

  const [availableBooks, setAvailableBooks] = useState<Book[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookshelf();
    fetchRecommendations();
  }, []);

  useEffect(() => {
    if (showAddModal) {
      fetchAvailableBooks();
    }
  }, [showAddModal, bookshelfEntries]);

  const fetchBookshelf = async () => {
    setLoading(true);
    try {
      const data = await bookshelfService.getAll();
      setBookshelfEntries(data);
    } catch (err: any) {
      setError("Nepavyko užkrauti knygų lentynos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const data = await bookshelfService.getRecommendations();
      setRecommendations(data);
    } catch (err) {
      console.error("Failed to fetch recommendations", err);
    } finally {
      setRecommendationsLoaded(true);
    }
  };

  const fetchAvailableBooks = async () => {
    setLoadingBooks(true);
    setSaveError(null);
    try {
      const bookshelfBookIds = bookshelfEntries.map((entry) => entry?.Knyga?.Id);
      const response = await booksService.getAll({ pageSize: 100 });
      const filteredBooks = response.items.filter(
        (book) => !bookshelfBookIds.includes(book.Id)
      );
      setAvailableBooks(filteredBooks);
    } catch (err) {
      console.error("Failed to fetch books", err);
      setSaveError("Nepavyko užkrauti knygų lentynos");
    } finally {
      setLoadingBooks(false);
    }
  };

  const handleRemove = async (entryId: string) => {
    if (window.confirm("Ar tikrai norite pašalinti šią knygą iš lentynos?")) {
      try {
        await bookshelfService.delete(entryId);
        setBookshelfEntries(
          bookshelfEntries.filter((entry) => entry.Id !== entryId)
        );
        alert("Knyga pašalinta iš lentynos");
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
      await bookshelfService.update(entryId, { tipas: newStatus });
      setBookshelfEntries(
        bookshelfEntries.map((entry) =>
          entry.Id === entryId ? { ...entry, tipas: newStatus } : entry
        )
      );
    } catch (err) {
      alert("Nepavyko pakeisti įrašo tipo");
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
      const response = await bookshelfService.create({
        KnygaId: selectedBookId,
        tipas: BookshelfStatus.WANT_TO_READ,
      });

      const selectedBook = availableBooks.find(
        (book) => book.Id === selectedBookId
      );
      if (selectedBook) {
        const newEntry: BookshelfEntry = {
          ...response,
          Knyga: selectedBook,
        };
        setBookshelfEntries([...bookshelfEntries, newEntry]);
      }

      setShowAddModal(false);
      setSelectedBookId(null);
      setSearchQuery("");
      alert("Knyga sėkmingai pridėta į lentyną!");
    } catch (err: any) {
      console.error("Failed to add book", err);
      setSaveError(
        err.response?.data?.message || "Nepavyko pridėti knygos į lentyną"
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
      : bookshelfEntries.filter((entry) => entry.tipas === activeTab);

  const countByStatus = (status: BookshelfStatus) =>
    bookshelfEntries.filter((entry) => entry.tipas === status).length;

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
        <h1 className="text-4xl font-bold mb-6">Mano knygų lentyna</h1>

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
                key={entry.Id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
              >
                <Link to={`/knygos/${entry?.Knyga?.Id}`}>
                  <div className="h-64 bg-gray-200 flex items-center justify-center">
                    {entry.Knyga?.virselio_nuotrauka ? (
                      <img
                        src={entry.Knyga.virselio_nuotrauka}
                        alt={entry.Knyga.knygos_pavadinimas}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl">📚</span>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link to={`/knygos/${entry?.Knyga?.Id}`}>
                    <h3 className="text-xl font-bold mb-2 hover:text-blue-600">
                      {entry.Knyga?.knygos_pavadinimas}
                    </h3>
                  </Link>
                  <p className="text-gray-600 mb-3">
                    {entry.Knyga?.autorius_vardas}
                  </p>

                  <div className="mb-3">
                    {editingEntryId === entry.Id ? (
                      <>
                        <select
                          value={tempStatus ?? entry.tipas}
                          onChange={(e) =>
                            setTempStatus(Number(e.target.value) as BookshelfStatus)
                          }
                          className={`w-full px-3 py-2 rounded-lg font-semibold mb-3 ${getStatusColor(
                            tempStatus ?? entry.tipas
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
                              if (tempStatus !== null && tempStatus !== entry.tipas) {
                                handleStatusChange(entry.Id, tempStatus);
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
                      <>
                        <div
                          className={`w-full text-center px-3 py-2 rounded-lg font-semibold mb-3 ${getStatusColor(
                            entry.tipas
                          )}`}
                        >
                          {getStatusText(entry.tipas)}
                        </div>
                        <button
                          onClick={() => {
                            setEditingEntryId(entry.Id);
                            setTempStatus(entry.tipas);
                          }}
                          className="w-full px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                        >
                          Redaguoti
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => handleRemove(entry.Id)}
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
        {recommendations?.length > 0 ? (
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6">
              Rekomenduojamos knygos jums
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations?.slice(0, 6).map((book) => (
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
                      {book.autorius_vardas}
                    </p>
                    <p className="text-sm text-gray-500">{book.Zanras?.pavadinimas}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          recommendationsLoaded && (
            <div className="mt-12 text-gray-600">
              nebuvo pateikta jokių rekomendacijų
            </div>
          )
        )}
      </motion.div>

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-5 text-center">
              Pridėti knygą į lentyną
            </h2>

            {loadingBooks ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Kraunama...</p>
              </div>
            ) : availableBooks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Visos knygos jau pridėtos į jūsų lentyną!
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

                <div className="mb-4">
                  <label className="block mb-2 font-semibold">
                    Pasirinkite knygą (
                    {
                      availableBooks.filter((book) => {
                        const query = searchQuery.toLowerCase();
                        return (
                          book.knygos_pavadinimas.toLowerCase().includes(query) ||
                          (book.autorius_vardas || '').toLowerCase().includes(query)
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
                          book.knygos_pavadinimas.toLowerCase().includes(query) ||
                          (book.autorius_vardas || '').toLowerCase().includes(query)
                        );
                      })
                      .map((book) => (
                        <div
                          key={book.Id}
                          onClick={() => setSelectedBookId(book.Id)}
                          className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-blue-50 transition-colors ${
                            selectedBookId === book.Id
                              ? "bg-blue-100 border-l-4 border-l-blue-600"
                              : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-12 h-16 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                              {book.virselio_nuotrauka ? (
                                <img
                                  src={book.virselio_nuotrauka}
                                  alt={book.knygos_pavadinimas}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-2xl">📚</span>
                              )}
                            </div>
                            <div className="flex-grow">
                              <h3 className="font-bold text-lg">
                                {book.knygos_pavadinimas}
                              </h3>
                              <p className="text-gray-600">
                                {book.autorius_vardas}
                              </p>
                              <p className="text-sm text-gray-500">
                                {book.leidimo_metai ? new Date(book.leidimo_metai).getFullYear() : ''} {book?.Zanras?.pavadinimas && `• ${book.Zanras?.pavadinimas}`}
                              </p>
                            </div>
                            {selectedBookId === book.Id && (
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

                {saveError && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {saveError}
                  </div>
                )}

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

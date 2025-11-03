// src/pages/bookshelf/BookshelfPage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import type { BookshelfEntry, BookRecommendation } from '../../types';
import { BookshelfStatus } from '../../types';
import axios from 'axios';
import { mockBookshelfEntries, mockRecommendations } from '../../mockData';

function BookshelfPage() {
  const [bookshelfEntries, setBookshelfEntries] = useState<BookshelfEntry[]>([]);
  const [recommendations, setRecommendations] = useState<BookRecommendation[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | BookshelfStatus>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchBookshelf();
    fetchRecommendations();
  }, []);

  // Real API calls - for future use
  const fetchBookshelfFromAPI = async () => {
    const token = localStorage.getItem('authToken');
    const response = await axios.get('https://localhost:7296/api/bookshelf', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  };

  const fetchRecommendationsFromAPI = async () => {
    const token = localStorage.getItem('authToken');
    const response = await axios.get('https://localhost:7296/api/recommendations', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  };

  // Mock data fetching - currently used
  const fetchBookshelf = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setBookshelfEntries(mockBookshelfEntries);
    } catch (err: any) {
      setError('Nepavyko užkrauti knygų sąrašo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      setRecommendations(mockRecommendations);
    } catch (err) {
      console.error('Failed to fetch recommendations', err);
    }
  };

  const handleRemove = async (entryId: string) => {
    if (window.confirm('Ar tikrai norite pašalinti šią knygą iš sąrašo?')) {
      try {
        const token = localStorage.getItem('authToken');
        await axios.delete(`https://localhost:7296/api/bookshelf/${entryId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setBookshelfEntries(bookshelfEntries.filter(entry => entry.id !== entryId));
        alert('Knyga pašalinta iš sąrašo');
      } catch (err) {
        alert('Nepavyko pašalinti knygos');
      }
    }
  };

  const handleStatusChange = async (entryId: string, newStatus: BookshelfStatus) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`https://localhost:7296/api/bookshelf/${entryId}`, {
        status: newStatus
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBookshelfEntries(bookshelfEntries.map(entry =>
        entry.id === entryId ? { ...entry, status: newStatus } : entry
      ));
    } catch (err) {
      alert('Nepavyko pakeisti būsenos');
    }
  };

  const getStatusText = (status: BookshelfStatus) => {
    switch (status) {
      case BookshelfStatus.READ:
        return 'Perskaitytos';
      case BookshelfStatus.READING:
        return 'Skaitomos';
      case BookshelfStatus.WANT_TO_READ:
        return 'Norimos skaityti';
    }
  };

  const getStatusColor = (status: BookshelfStatus) => {
    switch (status) {
      case BookshelfStatus.READ:
        return 'bg-green-100 text-green-800';
      case BookshelfStatus.READING:
        return 'bg-blue-100 text-blue-800';
      case BookshelfStatus.WANT_TO_READ:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const filteredEntries = activeTab === 'all'
    ? bookshelfEntries
    : bookshelfEntries.filter(entry => entry.status === activeTab);

  const countByStatus = (status: BookshelfStatus) =>
    bookshelfEntries.filter(entry => entry.status === status).length;

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
            <div className="text-3xl font-bold text-blue-600">{bookshelfEntries.length}</div>
            <div className="text-gray-600">Iš viso</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{countByStatus(BookshelfStatus.READ)}</div>
            <div className="text-gray-600">Perskaitytos</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{countByStatus(BookshelfStatus.READING)}</div>
            <div className="text-gray-600">Skaitomos</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-3xl font-bold text-yellow-600">{countByStatus(BookshelfStatus.WANT_TO_READ)}</div>
            <div className="text-gray-600">Norimos</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Visos ({bookshelfEntries.length})
          </button>
          <button
            onClick={() => setActiveTab(BookshelfStatus.READ)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeTab === BookshelfStatus.READ
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Perskaitytos ({countByStatus(BookshelfStatus.READ)})
          </button>
          <button
            onClick={() => setActiveTab(BookshelfStatus.READING)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeTab === BookshelfStatus.READING
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Skaitomos ({countByStatus(BookshelfStatus.READING)})
          </button>
          <button
            onClick={() => setActiveTab(BookshelfStatus.WANT_TO_READ)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeTab === BookshelfStatus.WANT_TO_READ
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
            <Link to="/knygos" className="text-blue-600 hover:underline mt-2 inline-block">
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
                    <h3 className="text-xl font-bold mb-2 hover:text-blue-600">{entry.book?.title}</h3>
                  </Link>
                  <p className="text-gray-600 mb-3">{entry.book?.author?.firstName} {entry.book?.author?.lastName}</p>

                  <div className="mb-3">
                    <select
                      value={entry.status}
                      onChange={(e) => handleStatusChange(entry.id, e.target.value as BookshelfStatus)}
                      className={`w-full px-3 py-2 rounded-lg font-semibold ${getStatusColor(entry.status)}`}
                    >
                      <option value={BookshelfStatus.READ}>Perskaitytos</option>
                      <option value={BookshelfStatus.READING}>Skaitomos</option>
                      <option value={BookshelfStatus.WANT_TO_READ}>Norimos skaityti</option>
                    </select>
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
            <h2 className="text-3xl font-bold mb-6">Rekomenduojamos knygos jums</h2>
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
                    <p className="text-gray-600 mb-2">{rec.book.author?.firstName} {rec.book.author?.lastName}</p>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-5 text-center">Pridėti naują knygą</h2>

            <div className="mb-4">
              <label className="block mb-1 font-semibold">Būsena</label>
              <select className="w-full border rounded-lg px-3 py-2">
                <option>Perskaityta</option>
                <option>Skaitoma</option>
                <option>Norima skaityti</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-semibold">Pavadinimas</label>
              <input
                type="text"
                placeholder="Įveskite pavadinimą"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div className="mb-6">
              <label className="block mb-1 font-semibold">Autorius</label>
              <input
                type="text"
                placeholder="Įveskite autoriaus vardą ir pavardę"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Atšaukti
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Išsaugoti
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default BookshelfPage;

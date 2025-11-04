// src/pages/books/BooksPage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { MultiSelect } from '../../components/MultiSelect';
import type { Book, BookSearchDto, Genre, Mood } from '../../types';
import axios from 'axios';
import { mockBooks, mockGenres, mockMoods } from '../../mockData';

function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditor, setIsEditor] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [moods, setMoods] = useState<Mood[]>([]);

  const [searchFilters, setSearchFilters] = useState<BookSearchDto>({
    scenarioDescription: '',
    genreIds: [],
    moodIds: []
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setIsEditor(user.role === 'editor' || user.role === 'admin');

    // Load genres and moods
    setGenres(mockGenres);
    setMoods(mockMoods);

    fetchBooks();
  }, []);

  // Real API call - Backend uses OpenAI GPT-4o mini for scenario-based search
  const fetchBooksFromAPI = async () => {
    const response = await axios.get('https://localhost:7296/api/books', {
      params: {
        ...searchFilters,
        // Backend will process scenarioDescription with AI to match books
        // Genres and moods are applied as strict AND filters
      }
    });
    return response.data;
  };

  // Mock data fetch - currently used
  const fetchBooksFromMock = () => {
    let filtered = [...mockBooks];

    // Filter by scenario description (simple text search in title and description)
    // In production, this would be handled by AI on the backend
    if (searchFilters.scenarioDescription && searchFilters.scenarioDescription.trim()) {
      const searchTerm = searchFilters.scenarioDescription.toLowerCase();
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchTerm) ||
        book.description.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by genres (OR logic - book can have ANY selected genre)
    if (searchFilters.genreIds && searchFilters.genreIds.length > 0) {
      filtered = filtered.filter(book =>
        searchFilters.genreIds!.includes(book.genreId)
      );
    }

    // Filter by moods (OR logic - book's genre must have ANY selected mood)
    if (searchFilters.moodIds && searchFilters.moodIds.length > 0) {
      filtered = filtered.filter(book => {
        const bookGenre = mockGenres.find(g => g.id === book.genreId);
        if (!bookGenre) return false;
        // Check if genre has any of the selected moods
        return searchFilters.moodIds!.some(moodId => bookGenre.moodIds.includes(moodId));
      });
    }

    return filtered;
  };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      // Use mock data for now - switch to fetchBooksFromAPI() when backend is ready
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
      const data = fetchBooksFromMock();
      setBooks(data);
    } catch (err: any) {
      setError('Nepavyko užkrauti knygų');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBooks();
  };

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
          <h1 className="text-4xl font-bold">Knygos</h1>
          {isEditor && (
            <Link
              to="/knygos/nauja"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              + Pridėti knygą
            </Link>
          )}
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Knygų Paieška ir Filtravimas</h2>
          <p className="text-gray-600 mb-6 text-sm">
            Užpildykite bet kurį ar kelis laukus. Visos paieškos sąlygos taikomos kartu.
          </p>

          <div className="space-y-6">
            {/* Scenario Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scenarijaus aprašymas
                <span className="text-gray-500 font-normal ml-2">
                  (Dirbtinis intelektas ieškos knygų pagal jūsų aprašytą scenarijų)
                </span>
              </label>
              <textarea
                placeholder="Pvz: 'Noriu knygos apie stiprią moterį kovoje už laisvę karo metu' arba 'Ieškau romantiškos istorijos su giliu filosofiniu pagrindu'..."
                value={searchFilters.scenarioDescription}
                onChange={(e) => setSearchFilters({ ...searchFilters, scenarioDescription: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            {/* Genres and Moods - Side by side on larger screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Genres Multi-select */}
              <MultiSelect
                label="Žanrai"
                placeholder="Pasirinkite žanrus..."
                options={genres.map(genre => ({ value: genre.id, label: genre.pavadinimas }))}
                value={searchFilters.genreIds || []}
                onChange={(selected) => setSearchFilters({ ...searchFilters, genreIds: selected })}
              />

              {/* Moods Multi-select */}
              <MultiSelect
                label="Nuotaikos"
                placeholder="Pasirinkite nuotaikas..."
                options={moods.map(mood => ({ value: mood.id, label: mood.pavadinimas }))}
                value={searchFilters.moodIds || []}
                onChange={(selected) => setSearchFilters({ ...searchFilters, moodIds: selected })}
              />
            </div>

            {/* Search Button and Clear Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                🔍 Ieškoti Knygų
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchFilters({ scenarioDescription: '', genreIds: [], moodIds: [] });
                  // Trigger search with empty filters
                  setTimeout(() => fetchBooks(), 0);
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                ✕ Išvalyti
              </button>
            </div>
          </div>
        </form>

        {/* Active Filters Display */}
        {(searchFilters.scenarioDescription ||
          (searchFilters.genreIds && searchFilters.genreIds.length > 0) ||
          (searchFilters.moodIds && searchFilters.moodIds.length > 0)) && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-grow">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Aktyvūs Filtrai:</h3>
                <div className="flex flex-wrap gap-2">
                  {/* Scenario Description Chip */}
                  {searchFilters.scenarioDescription && (
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      <span className="font-medium">Scenarijus:</span>
                      <span className="max-w-xs truncate">
                        "{searchFilters.scenarioDescription}"
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchFilters({ ...searchFilters, scenarioDescription: '' });
                          setTimeout(() => fetchBooks(), 0);
                        }}
                        className="hover:text-purple-600 transition-colors ml-1"
                      >
                        ✕
                      </button>
                    </span>
                  )}

                  {/* Genre Chips */}
                  {searchFilters.genreIds?.map((genreId) => {
                    const genreName = genres.find(g => g.id === genreId)?.pavadinimas || genreId;
                    return (
                      <span
                        key={genreId}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        <span className="font-medium">Žanras:</span> {genreName}
                        <button
                          type="button"
                          onClick={() => {
                            const newGenreIds = searchFilters.genreIds!.filter(g => g !== genreId);
                            setSearchFilters({ ...searchFilters, genreIds: newGenreIds });
                            setTimeout(() => fetchBooks(), 0);
                          }}
                          className="hover:text-green-600 transition-colors"
                        >
                          ✕
                        </button>
                      </span>
                    );
                  })}

                  {/* Mood Chips */}
                  {searchFilters.moodIds?.map((moodId) => {
                    const moodName = moods.find(m => m.id === moodId)?.pavadinimas || moodId;
                    return (
                      <span
                        key={moodId}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
                      >
                        <span className="font-medium">Nuotaika:</span> {moodName}
                        <button
                          type="button"
                          onClick={() => {
                            const newMoodIds = searchFilters.moodIds!.filter(m => m !== moodId);
                            setSearchFilters({ ...searchFilters, moodIds: newMoodIds });
                            setTimeout(() => fetchBooks(), 0);
                          }}
                          className="hover:text-amber-600 transition-colors"
                        >
                          ✕
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Clear All Filters Button */}
              <button
                type="button"
                onClick={() => {
                  setSearchFilters({ scenarioDescription: '', genreIds: [], moodIds: [] });
                  setTimeout(() => fetchBooks(), 0);
                }}
                className="ml-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium whitespace-nowrap"
              >
                Išvalyti visus
              </button>
            </div>

            {/* Results Count */}
            {!loading && (
              <p className="text-sm text-gray-600 mt-3">
                Rasta <span className="font-semibold text-blue-700">{books.length}</span> {books.length === 1 ? 'knyga' : books.length < 10 ? 'knygos' : 'knygų'}
              </p>
            )}
          </div>
        )}

        {/* Books Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-xl text-gray-600">
              {searchFilters.scenarioDescription
                ? '🤖 Dirbtinis intelektas analizuoja jūsų scenarijų...'
                : 'Kraunama...'}
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-xl text-red-600">{error}</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Knygų nerasta</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
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
                  <p className="text-gray-600 mb-2">{book.author?.firstName} {book.author?.lastName}</p>
                  <p className="text-gray-500 text-sm mb-2">{book.publishYear}</p>
                  <div className="mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {book.genre?.pavadinimas || 'Nežinomas žanras'}
                    </span>
                  </div>
                  {book.genre?.moods && book.genre.moods.length > 0 && (
                    <p className="text-gray-500 text-xs mb-2">
                      Nuotaikos: {book.genre.moods.map(m => m.pavadinimas).join(', ')}
                    </p>
                  )}
                  {book.averageRating && (
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">⭐</span>
                      <span className="font-semibold">{book.averageRating.toFixed(1)}</span>
                      <span className="text-gray-500 text-sm ml-2">({book.reviewCount} komentarai)</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>

      <Footer />
    </div>
  );
}

export default BooksPage;

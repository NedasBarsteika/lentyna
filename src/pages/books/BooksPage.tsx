// src/pages/books/BooksPage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { MultiSelect } from '../../components/MultiSelect';
import type { Book, BookSearchDto, Genre, Mood } from '../../types';
import { booksService } from '../../api';
import { UserRole } from '../../types';

function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditor, setIsEditor] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [moods, setMoods] = useState<Mood[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchFilters, setSearchFilters] = useState<BookSearchDto>({
    ScenarijausAprasymas: '',
    ZanruIds: [],
    NuotaikuIds: []
  });

  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setIsEditor(user.role === UserRole.EDITOR || user.role === UserRole.ADMIN);

    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [genresData, moodsData] = await Promise.all([
        booksService.getGenres(),
        booksService.getMoods()
      ]);
      setGenres(genresData);
      setMoods(moodsData);
      await fetchBooks();
    } catch (err) {
      console.error('Klaida kraunant pradinius duomenis:', err);
      setError('Nepavyko užkrauti duomenų');
      setLoading(false);
    }
  };

  const fetchBooks = async (pageNum: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await booksService.getAll({ page: pageNum, pageSize: 12 });
      setBooks(response.items);
      setTotalCount(response.totalCount);
      setTotalPages(response.totalPages);
      setPage(response.page);
    } catch (err: any) {
      setError('Nepavyko užkrauti knygų');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdvancedSearch = async () => {
    setLoading(true);
    setError(null);
    setIsAdvancedSearch(true);
    try {
      const results = await booksService.advancedSearch(searchFilters);
      setBooks(results);
      setTotalCount(results.length);
      setTotalPages(1);
      setPage(1);
    } catch (err: any) {
      setError('Nepavyko atlikti paieškos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Check if any advanced filters are set
    if (searchFilters.ScenarijausAprasymas ||
        (searchFilters.ZanruIds && searchFilters.ZanruIds.length > 0) ||
        (searchFilters.NuotaikuIds && searchFilters.NuotaikuIds.length > 0)) {
      handleAdvancedSearch();
    } else {
      setIsAdvancedSearch(false);
      fetchBooks(1);
    }
  };

  const clearFilters = () => {
    setSearchFilters({ ScenarijausAprasymas: '', ZanruIds: [], NuotaikuIds: [] });
    setIsAdvancedSearch(false);
    fetchBooks(1);
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
                value={searchFilters.ScenarijausAprasymas}
                onChange={(e) => setSearchFilters({ ...searchFilters, ScenarijausAprasymas: e.target.value })}
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
                options={genres.map(genre => ({ value: genre.Id, label: genre.pavadinimas }))}
                value={searchFilters.ZanruIds || []}
                onChange={(selected) => setSearchFilters({ ...searchFilters, ZanruIds: selected })}
              />

              {/* Moods Multi-select */}
              <MultiSelect
                label="Nuotaikos"
                placeholder="Pasirinkite nuotaikas..."
                options={moods.map(mood => ({ value: mood.Id, label: mood.pavadinimas }))}
                value={searchFilters.NuotaikuIds || []}
                onChange={(selected) => setSearchFilters({ ...searchFilters, NuotaikuIds: selected })}
              />
            </div>

            {/* Search Button and Clear Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Ieškoti Knygų
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Išvalyti
              </button>
            </div>
          </div>
        </form>

        {/* Active Filters Display */}
        {(searchFilters.ScenarijausAprasymas ||
          (searchFilters.ZanruIds && searchFilters.ZanruIds.length > 0) ||
          (searchFilters.NuotaikuIds && searchFilters.NuotaikuIds.length > 0)) && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-grow">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Aktyvūs Filtrai:</h3>
                <div className="flex flex-wrap gap-2">
                  {/* Scenario Description Chip */}
                  {searchFilters.ScenarijausAprasymas && (
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      <span className="font-medium">Scenarijus:</span>
                      <span className="max-w-xs truncate">
                        "{searchFilters.ScenarijausAprasymas}"
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchFilters({ ...searchFilters, ScenarijausAprasymas: '' });
                        }}
                        className="hover:text-purple-600 transition-colors ml-1"
                      >
                        x
                      </button>
                    </span>
                  )}

                  {/* Genre Chips */}
                  {searchFilters.ZanruIds?.map((genreId) => {
                    const genreName = genres.find(g => g.Id === genreId)?.pavadinimas || genreId;
                    return (
                      <span
                        key={genreId}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        <span className="font-medium">Žanras:</span> {genreName}
                        <button
                          type="button"
                          onClick={() => {
                            const newGenreIds = searchFilters.ZanruIds!.filter(g => g !== genreId);
                            setSearchFilters({ ...searchFilters, ZanruIds: newGenreIds });
                          }}
                          className="hover:text-green-600 transition-colors"
                        >
                          x
                        </button>
                      </span>
                    );
                  })}

                  {/* Mood Chips */}
                  {searchFilters.NuotaikuIds?.map((moodId) => {
                    const mood = moods.find(m => m.Id === moodId);
                    const moodName = mood?.pavadinimas || moodId;
                    const genreNames = mood?.zanrai?.map(z => z.pavadinimas).join(', ') || '';
                    return (
                      <span
                        key={moodId}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
                      >
                        <span className="font-medium">Nuotaika:</span> {moodName}
                        {genreNames && (
                          <span className="text-xs opacity-75">({genreNames})</span>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const newMoodIds = searchFilters.NuotaikuIds!.filter(m => m !== moodId);
                            setSearchFilters({ ...searchFilters, NuotaikuIds: newMoodIds });
                          }}
                          className="hover:text-amber-600 transition-colors"
                        >
                          x
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Clear All Filters Button */}
              <button
                type="button"
                onClick={clearFilters}
                className="ml-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium whitespace-nowrap"
              >
                Išvalyti visus
              </button>
            </div>

            {/* Results Count */}
            {!loading && (
              <p className="text-sm text-gray-600 mt-3">
                Rasta <span className="font-semibold text-blue-700">{totalCount}</span> {totalCount === 1 ? 'knyga' : totalCount < 10 ? 'knygos' : 'knygų'}
              </p>
            )}
          </div>
        )}

        {/* Books Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-xl text-gray-600">
              {searchFilters.ScenarijausAprasymas
                ? 'Dirbtinis intelektas analizuoja jūsų scenarijų...'
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books?.map((book) => (
                <Link
                  key={book?.Id}
                  to={`/knygos/${book?.Id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
                >
                  <div className="h-64 bg-gray-200 flex items-center justify-center">
                    {book?.virselio_nuotrauka ? (
                      <img
                        src={book?.virselio_nuotrauka}
                        alt={book?.knygos_pavadinimas}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl">📚</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2">{book?.knygos_pavadinimas}</h3>
                    <p className="text-gray-600 mb-2">{book?.autorius_vardas}</p>
                    <p className="text-gray-500 text-sm mb-2">
                      {book?.leidimo_metai ? new Date(book?.leidimo_metai).getFullYear() : 'Nežinoma'}
                    </p>
                    <div className="mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {book?.Zanras?.pavadinimas || 'Nežinomas žanras'}
                      </span>
                      {book?.bestseleris && (
                        <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                          Bestseleris
                        </span>
                      )}
                    </div>
                    {book?.vidutinis_vertinimas !== undefined && book?.vidutinis_vertinimas > 0 && (
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">⭐</span>
                        <span className="font-semibold">{book?.vidutinis_vertinimas.toFixed(1)}</span>
                        <span className="text-gray-500 text-sm ml-2">({book?.komentaru_skaicius} komentarai)</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {!isAdvancedSearch && totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <button
                  onClick={() => fetchBooks(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                >
                  Ankstesnis
                </button>
                <span className="px-4 py-2">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => fetchBooks(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                >
                  Kitas
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>

      <Footer />
    </div>
  );
}

export default BooksPage;

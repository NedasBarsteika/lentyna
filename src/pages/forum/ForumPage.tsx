// src/pages/forum/ForumPage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import type { ForumTopic, BookClubWeek } from '../../types';
import axios from 'axios';
import { mockForumTopics, mockBookClubWeek } from '../../mockData';

function ForumPage() {
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [bookClubWeek, setBookClubWeek] = useState<BookClubWeek | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);

    fetchTopics();
    fetchBookClubWeek();
  }, []);

  // Real API calls - for future use
  const fetchTopicsFromAPI = async () => {
    const response = await axios.get('https://localhost:7296/api/forum/topics');
    return response.data;
  };

  const fetchBookClubWeekFromAPI = async () => {
    const response = await axios.get('https://localhost:7296/api/bookclub/current');
    return response.data;
  };

  // Mock data fetching - currently used
  const fetchTopics = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setTopics(mockForumTopics);
    } catch (err: any) {
      setError('Nepavyko užkrauti forume temų');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookClubWeek = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));

      // Try to fetch weather from Meteo API
      const meetingDate = mockBookClubWeek.meetingDate;
      let weatherForecast = mockBookClubWeek.weatherForecast;

      try {
        // Open-Meteo API for Kaunas (KTU) coordinates
        const lat = 54.8985;
        const lon = 23.9036;
        const date = new Date(meetingDate);
        const dateStr = date.toISOString().split('T')[0];

        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Europe/Vilnius&start_date=${dateStr}&end_date=${dateStr}`
        );

        if (weatherResponse.ok) {
          const weatherData = await weatherResponse.json();
          const temp = Math.round((weatherData.daily.temperature_2m_max[0] + weatherData.daily.temperature_2m_min[0]) / 2);
          const rainProb = weatherData.daily.precipitation_probability_max[0];

          let description = '';
          let willRain = false;
          let recommendation: 'outdoor' | 'indoor' | 'flexible' = 'flexible';

          if (rainProb > 70) {
            description = 'Tikėtinas lietus';
            willRain = true;
            recommendation = 'indoor';
          } else if (rainProb > 40) {
            description = 'Galimas lietus';
            willRain = true;
            recommendation = 'flexible';
          } else if (temp < 5) {
            description = 'Šalta';
            recommendation = 'indoor';
          } else if (temp < 15) {
            description = 'Vėsu';
            recommendation = 'flexible';
          } else {
            description = 'Gražus oras';
            recommendation = 'outdoor';
          }

          weatherForecast = {
            date: new Date(dateStr),
            temperature: temp,
            description,
            willRain,
            recommendation
          };
        }
      } catch (weatherErr) {
        console.log('Using mock weather data');
      }

      setBookClubWeek({
        ...mockBookClubWeek,
        weatherForecast
      });
    } catch (err) {
      console.error('Failed to fetch book club week', err);
    }
  };

  const pinnedTopics = topics.filter(t => t.isPinned);
  const regularTopics = topics.filter(t => !t.isPinned);

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
          <h1 className="text-4xl font-bold">Forumas</h1>
          {isAuthenticated && (
            <Link
              to="/forumas/nauja-tema"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              + Sukurti temą
            </Link>
          )}
        </div>

        {/* Book Club Week - Pinned */}
        {bookClubWeek && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">📌</span>
              <h2 className="text-2xl font-bold">Knygų klubas - {bookClubWeek.weekNumber} savaitė</h2>
            </div>

            <p className="mb-4 text-lg">
              Susitikimo data: {new Date(bookClubWeek.meetingDate).toLocaleDateString('lt-LT')}
            </p>

            {bookClubWeek.weatherForecast && (
              <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4 text-gray-900">
                <h3 className="font-semibold mb-2">Oro prognozė KTU miesteliui:</h3>
                <p className="text-lg">
                  🌡️ {bookClubWeek.weatherForecast.temperature}°C - {bookClubWeek.weatherForecast.description}
                </p>
                <p className="mt-2">
                  {bookClubWeek.weatherForecast.recommendation === 'outdoor' && '🌳 Rekomenduojame susitikti lauke!'}
                  {bookClubWeek.weatherForecast.recommendation === 'indoor' && '🏠 Rekomenduojame susitikti viduje.'}
                  {bookClubWeek.weatherForecast.recommendation === 'flexible' && '🤔 Galite susitikti lauke arba viduje.'}
                </p>
              </div>
            )}

            <h3 className="font-semibold mb-3 text-lg">Balsuokite už knygą šiai savaitei:</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {bookClubWeek.nominatedBooks?.map((nomination) => (
                <div key={nomination.id} className="bg-white bg-opacity-20 rounded-lg p-3 text-gray-900">
                  <Link to={`/knygos/${nomination.bookId}`} className="block mb-2">
                    {nomination.book?.coverImageUrl ? (
                      <img
                        src={nomination.book.coverImageUrl}
                        alt={nomination.book.title}
                        className="w-full h-48 object-cover rounded-lg mb-2 hover:opacity-90 transition-opacity"
                      />
                    ) : (
                      <div className="w-full h-48 bg-white bg-opacity-40 rounded-lg mb-2 flex items-center justify-center">
                        <span className="text-4xl">📚</span>
                      </div>
                    )}
                    <p className="font-semibold text-sm hover:underline line-clamp-2">{nomination.book?.title}</p>
                    <p className="text-xs opacity-90 mt-1">
                      {nomination.book?.author ?
                        `${nomination.book.author.firstName} ${nomination.book.author.lastName}` :
                        'Nežinomas autorius'
                      }
                    </p>
                  </Link>
                  <div className="text-center mt-2">
                    <p className="text-xl font-bold mb-2">{nomination.voteCount} balsai</p>
                    {isAuthenticated && (
                      <button
                        onClick={async () => {
                          try {
                            await axios.post(`https://localhost:7296/api/bookclub/vote`, {
                              weekId: bookClubWeek.id,
                              bookId: nomination.bookId
                            }, {
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem('authToken')}`
                              }
                            });
                            fetchBookClubWeek();
                            alert('Balsas užskaitytas!');
                          } catch (err) {
                            alert('Nepavyko balsuoti');
                          }
                        }}
                        className="w-full px-3 py-1 bg-white text-purple-600 rounded hover:bg-gray-100 font-semibold"
                      >
                        Balsuoti
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pinned Topics */}
        {pinnedTopics.length > 0 && (
          <div className="mb-6">
            {pinnedTopics.map((topic) => (
              <Link
                key={topic.id}
                to={`/forumas/${topic.id}`}
                className="block bg-yellow-50 border-l-4 border-yellow-500 rounded-lg shadow-md p-4 mb-3 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-grow">
                    <div className="flex items-center mb-2">
                      <span className="text-xl mr-2">📌</span>
                      <h3 className="text-xl font-bold">{topic.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-2">{topic.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-4">👤 {topic.author?.username || 'Nežinomas'}</span>
                      <span className="mr-4">💬 {topic.commentCount} komentarai</span>
                      <span>{new Date(topic.createdAt).toLocaleDateString('lt-LT')}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Regular Topics */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Kraunama...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-xl text-red-600">{error}</p>
          </div>
        ) : regularTopics.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Temų dar nėra</p>
          </div>
        ) : (
          <div className="space-y-3">
            {regularTopics.map((topic) => (
              <Link
                key={topic.id}
                to={`/forumas/${topic.id}`}
                className="block bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold mb-2">{topic.title}</h3>
                <p className="text-gray-600 mb-2">{topic.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-4">👤 {topic.author?.username || 'Nežinomas'}</span>
                  <span className="mr-4">💬 {topic.commentCount} komentarai</span>
                  <span>{new Date(topic.createdAt).toLocaleDateString('lt-LT')}</span>
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

export default ForumPage;

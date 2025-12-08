// src/pages/forum/BookClubPage.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import type { Voting, WeatherForecast } from "../../types";
import { votingService } from "../../api";

function BookClubPage() {
  const [voting, setVoting] = useState<Voting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [weatherForecast, setWeatherForecast] =
    useState<WeatherForecast | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);

    fetchCurrentVoting();
  }, []);

  const fetchCurrentVoting = async () => {
    try {
      const data = await votingService.getCurrent();
      setVoting(data);
    } catch (err) {
      setError("Nepavyko užkrauti balsavimo");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherForecast = async (votingId: string) => {
    try {
      const forecast = await votingService.getWeatherForecast(votingId);
      setWeatherForecast(forecast);
    } catch (err) {
      console.error("Failed to fetch weather forecast", err);
    }
  };

  const handleVote = async (knygaId: string) => {
    if (!voting?.Id) return;

    try {
      await votingService.vote({
        BalsavimasId: voting.Id,
        KnygaId: knygaId,
      });
      fetchCurrentVoting();
      alert("Balsas užskaitytas!");
    } catch (err) {
      alert("Nepavyko balsuoti");
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

  if (error || !voting) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl text-red-600">
            {error || "Balsavimas nerastas"}
          </p>
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
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-2">📖</span>
            <h2 className="text-2xl font-bold">Knygų klubas - Balsavimas</h2>
          </div>

          <p className="mb-4">
            Balsavimas vyksta iki:{" "}
            {new Date(voting.balsavimo_pabaiga).toLocaleDateString("lt-LT")}
          </p>

          {voting.Id && (
            <button
              type="button"
              onClick={() => fetchWeatherForecast(voting.Id)}
              className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg mb-4 transition transform hover:scale-105 hover:shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-300 active:scale-95 cursor-pointer"
            >
              Gauti oro prognozę
            </button>
          )}

          {weatherForecast && (
            <div className="bg-white rounded-lg p-4 mb-4 text-gray-800">
              <h3 className="font-semibold mb-2">🌤️ Oro prognozė:</h3>
              <p className="text-lg">{weatherForecast.oro_prognoze}</p>
            </div>
          )}

          {!voting.uzbaigtas && (
            <div>
              <h3 className="font-semibold mb-3 text-lg text-white">
                Balsuokite už knygą šiai savaitei:
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {voting?.nominuotos_knygos?.map((nomination) => (
                  <div
                    key={nomination.Id}
                    className="bg-white rounded-lg p-3 text-gray-900 shadow-md"
                  >
                    <Link
                      to={`/knygos/${nomination.Id}`}
                      className="block mb-2"
                    >
                      {nomination.virselio_nuotrauka ? (
                        <img
                          src={nomination.virselio_nuotrauka}
                          alt={nomination.knygos_pavadinimas}
                          className="w-full h-48 object-cover rounded-lg mb-2 hover:opacity-90 transition-opacity"
                        />
                      ) : (
                        <div className="w-full h-48 bg-white bg-opacity-40 rounded-lg mb-2 flex items-center justify-center">
                          <span className="text-4xl">📚</span>
                        </div>
                      )}
                      <p className="font-semibold text-sm hover:underline line-clamp-2">
                        {nomination.knygos_pavadinimas}
                      </p>
                      <p className="text-xs opacity-90 mt-1">
                        {nomination.autorius_vardas || "Nežinomas autorius"}
                      </p>
                    </Link>
                    <div className="text-center mt-2">
                      <p className="text-xl font-bold mb-2">
                        {nomination.balsu_skaicius} balsai
                      </p>
                      {isAuthenticated && !voting.uzbaigtas && (
                        <button
                          onClick={() => handleVote(nomination.Id)}
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

          {voting.uzbaigtas && voting.isrinkta_knyga?.Id && (
            <div className="grid grid-cols-1 md:grid-cols-5">
              <div className="text-black mt-6 bg-white bg-opacity-20 rounded-lg p-4 text-center">
                <h3 className="text-xl font-bold mb-2">Balsavimas baigtas!</h3>
                <p>Išrinkta knyga bus aptarta susitikime.</p>
                <div className="bg-white rounded-lg p-3 text-gray-900 shadow-md">
                  <Link
                    to={`/knygos/${voting.isrinkta_knyga.Id}`}
                    className="block mb-2"
                  >
                    {voting.isrinkta_knyga.virselio_nuotrauka ? (
                      <img
                        src={voting.isrinkta_knyga.virselio_nuotrauka}
                        alt={voting.isrinkta_knyga.knygos_pavadinimas}
                        className="w-full h-48 object-cover rounded-lg mb-2 hover:opacity-90 transition-opacity"
                      />
                    ) : (
                      <div className="w-full h-48 bg-white bg-opacity-40 rounded-lg mb-2 flex items-center justify-center">
                        <span className="text-4xl">📚</span>
                      </div>
                    )}
                    <p className="font-semibold text-sm hover:underline line-clamp-2">
                      {voting.isrinkta_knyga.knygos_pavadinimas}
                    </p>
                    <p className="text-xs opacity-90 mt-1">
                      {voting.isrinkta_knyga.autorius_vardas ||
                        "Nežinomas autorius"}
                    </p>
                  </Link>
                  <div className="text-center mt-2">
                    <p className="text-xl font-bold mb-2">
                      {voting.isrinkta_knyga.balsu_skaicius} balsai
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}

export default BookClubPage;

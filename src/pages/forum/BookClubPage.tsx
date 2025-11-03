// src/pages/forum/BookClubPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import type { BookClubWeek, ForumTopic, ForumComment } from "../../types";
import axios from "axios";
import { mockForumTopics, mockBookClubWeek } from "../../mockData";

function BookClubPage() {
  const [topic, setTopic] = useState<ForumTopic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [forecastHidden, setForecastHidden] = useState(true);

  const [bookClubWeek, setBookClubWeek] = useState<BookClubWeek | null>(null);

  useEffect(() => {
    fetchBookClubWeek();
  }, []);

  const fetchBookClubWeek = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Try to fetch weather from Meteo API
      const meetingDate = mockBookClubWeek.meetingDate;
      let weatherForecast = mockBookClubWeek.weatherForecast;

      try {
        // Open-Meteo API for Kaunas (KTU) coordinates
        const lat = 54.8985;
        const lon = 23.9036;
        const date = new Date(meetingDate);
        const dateStr = date.toISOString().split("T")[0];

        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Europe/Vilnius&start_date=${dateStr}&end_date=${dateStr}`,
        );

        if (weatherResponse.ok) {
          const weatherData = await weatherResponse.json();
          const temp = Math.round(
            (weatherData.daily.temperature_2m_max[0] +
              weatherData.daily.temperature_2m_min[0]) /
              2,
          );
          const rainProb = weatherData.daily.precipitation_probability_max[0];

          let description = "";
          let willRain = false;
          let recommendation: "outdoor" | "indoor" | "flexible" = "flexible";

          if (rainProb > 70) {
            description = "Tikėtinas lietus";
            willRain = true;
            recommendation = "indoor";
          } else if (rainProb > 40) {
            description = "Galimas lietus";
            willRain = true;
            recommendation = "flexible";
          } else if (temp < 5) {
            description = "Šalta";
            recommendation = "indoor";
          } else if (temp < 15) {
            description = "Vėsu";
            recommendation = "flexible";
          } else {
            description = "Gražus oras";
            recommendation = "outdoor";
          }

          weatherForecast = {
            date: new Date(dateStr),
            temperature: temp,
            description,
            willRain,
            recommendation,
          };
        }
      } catch (weatherErr) {
        console.log("Using mock weather data");
      }

      setBookClubWeek({
        ...mockBookClubWeek,
        weatherForecast,
      });

      setLoading(false);
    } catch (err) {
      setError("Failed to fetch book club week");
    }
  };
  // Mock data fetching - currently used
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

  if (error || !bookClubWeek) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl text-red-600">{error || "Tema nerasta"}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-2">📌</span>
          <h2 className="text-2xl font-bold">
            Knygų klubas - {bookClubWeek.weekNumber} savaitė
          </h2>
        </div>

        <p className="mb-4 text-lg">
          Susitikimo data:{" "}
          {new Date(bookClubWeek.meetingDate).toLocaleDateString("lt-LT")}
        </p>

        <button
          type="button"
          onClick={() => setForecastHidden(false)}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Gauti prognozę
        </button>

        {bookClubWeek.weatherForecast && (
          <div
            className="bg-white bg-opacity-20 rounded-lg p-4 mb-4 text-gray-900"
            hidden={forecastHidden}
          >
            <h3 className="font-semibold mb-2">Oro prognozė KTU miesteliui:</h3>
            <p className="text-lg">
              🌡️ {bookClubWeek.weatherForecast.temperature}°C -{" "}
              {bookClubWeek.weatherForecast.description}
            </p>
            <p className="mt-2">
              {bookClubWeek.weatherForecast.recommendation === "outdoor" &&
                "🌳 Rekomenduojame susitikti lauke!"}
              {bookClubWeek.weatherForecast.recommendation === "indoor" &&
                "🏠 Rekomenduojame susitikti viduje."}
              {bookClubWeek.weatherForecast.recommendation === "flexible" &&
                "🤔 Galite susitikti lauke arba viduje."}
            </p>
          </div>
        )}

        <h3 className="font-semibold mb-3 text-lg">
          Balsuokite už knygą šiai savaitei:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {bookClubWeek.nominatedBooks?.map((nomination) => (
            <div
              key={nomination.id}
              className="bg-white bg-opacity-20 rounded-lg p-3 text-gray-900"
            >
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
                <p className="font-semibold text-sm hover:underline line-clamp-2">
                  {nomination.book?.title}
                </p>
                <p className="text-xs opacity-90 mt-1">
                  {nomination.book?.author
                    ? `${nomination.book.author.firstName} ${nomination.book.author.lastName}`
                    : "Nežinomas autorius"}
                </p>
              </Link>
              <div className="text-center mt-2">
                <p className="text-xl font-bold mb-2">
                  {nomination.voteCount} balsai
                </p>
                {isAuthenticated && (
                  <button
                    onClick={async () => {
                      try {
                        await axios.post(
                          `https://localhost:7296/api/bookclub/vote`,
                          {
                            weekId: bookClubWeek.id,
                            bookId: nomination.bookId,
                          },
                          {
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                            },
                          },
                        );
                        fetchBookClubWeek();
                        alert("Balsas užskaitytas!");
                      } catch (err) {
                        alert("Nepavyko balsuoti");
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

      <Footer />
    </div>
  );
}

export default BookClubPage;

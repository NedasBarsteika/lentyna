// src/pages/forum/ForumPage.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import type { ForumTopic, Voting } from "../../types";
import { nuomoniuForumasService, knyguKlubasService } from "../../api";

function ForumPage() {
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [currentVoting, setCurrentVoting] = useState<Voting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Calculate meeting date as 2 days after voting end date
  const getMeetingDate = (votingEndDate: string): Date => {
    const endDate = new Date(votingEndDate);
    endDate.setDate(endDate.getDate() + 2);
    return endDate;
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);

    fetchTopics();
    fetchCurrentVoting();
  }, []);

  const fetchTopics = async (pageNum: number = 1) => {
    setLoading(true);
    try {
      const response = await nuomoniuForumasService.getAllTopics({
        page: pageNum,
        pageSize: 20,
      });
      setTopics(response.items);
      setTotalPages(response.totalPages);
      setPage(response.page);
    } catch (err: any) {
      setError("Nepavyko užkrauti forumo temų");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentVoting = async () => {
    try {
      const voting = await knyguKlubasService.getCurrent();
      setCurrentVoting(voting);
    } catch (err) {
      console.error("Failed to fetch current voting", err);
    }
  };

  const regularTopics = topics;

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

        {/* Book Club Link */}
        {currentVoting && (
          <Link
            to="/forumas/klubas"
            className="block bg-yellow-50 border-l-4 border-yellow-500 rounded-lg shadow-md p-4 mb-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-2">
              <span className="text-xl mr-2">📌</span>
              <h3 className="text-xl font-bold">Knygų Klubas - Balsavimas</h3>
            </div>
            <p className="text-gray-600 mb-2">
              Dalyvaukite balsavime už savaitės knygą!
              <span className="ml-2">
                Susitikimas:{" "}
                {getMeetingDate(
                  currentVoting.balsavimo_pabaiga,
                ).toLocaleDateString("lt-LT")}
              </span>
            </p>
          </Link>
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
          <>
            <div className="space-y-3">
              {regularTopics.map((topic) => (
                <Link
                  key={topic.Id}
                  to={`/forumas/tema/${topic.Id}`}
                  className="block bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-bold mb-2">
                    {topic.pavadinimas}
                  </h3>
                  <p className="text-gray-600 mb-2 line-clamp-2">
                    {topic.tekstas}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-4">
                      👤 {topic?.autorius_slapyvardis || "Nežinomas"}
                    </span>
                    <span className="mr-4">
                      {new Date(topic.sukurimo_data).toLocaleDateString(
                        "lt-LT",
                      )}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <button
                  onClick={() => fetchTopics(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                >
                  Ankstesnis
                </button>
                <span className="px-4 py-2">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => fetchTopics(page + 1)}
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

export default ForumPage;

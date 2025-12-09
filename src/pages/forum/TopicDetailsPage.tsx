// src/pages/forum/TopicDetailsPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import type { ForumTopic } from "../../types";
import { forumService } from "../../api";
import { UserRole } from "../../types";

function TopicDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [topic, setTopic] = useState<ForumTopic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModerator, setIsModerator] = useState(false);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setIsModerator(
      user.role === UserRole.MODERATOR || user.role === UserRole.ADMIN,
    );
    setUserId(user.Id || "");

    if (id) {
      fetchTopic();
    }
  }, [id]);

  const fetchTopic = async () => {
    try {
      const data = await forumService.getTopicById(id!);
      setTopic(data);
    } catch (err) {
      setError("Nepavyko užkrauti temos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTopic = async () => {
    if (window.confirm("Ar tikrai norite ištrinti šią temą?")) {
      try {
        await forumService.deleteTopic(id!);
        navigate("/forumas");
      } catch (err) {
        alert("Nepavyko ištrinti temos");
      }
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

  if (error || !topic) {
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-grow max-w-screen-xl mx-auto w-full p-6"
      >
        {/* Topic */}
        <div
          className={`bg-white rounded-lg shadow-lg p-6 mb-6 ${topic.prikabinta ? "border-l-4 border-yellow-500" : ""}`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-grow">
              {topic.prikabinta && (
                <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold mb-2">
                  Prikabinta
                </span>
              )}
              <h1 className="text-4xl font-bold mb-2">{topic.pavadinimas}</h1>
              <div className="flex items-center text-gray-600">
                <div className="flex items-center gap-2 mr-4">
                  {topic.autorius_nuotrauka ? (
                    <img
                      src={topic.autorius_nuotrauka}
                      alt={topic.autorius_slapyvardis}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs text-gray-500">
                        {(topic.autorius_slapyvardis || "?")
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span>{topic.autorius_slapyvardis || "Nežinomas"}</span>
                </div>
                <span>
                  {new Date(topic.sukurimo_data).toLocaleDateString("lt-LT")}
                </span>
              </div>
            </div>
            {(isModerator || topic.NaudotojasId === userId) && (
              <div className="flex gap-2">
                {topic.NaudotojasId === userId && (
                  <Link
                    to={`/forumas/tema/${id}/redaguoti`}
                    className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                  >
                    Redaguoti
                  </Link>
                )}
                <button
                  onClick={handleDeleteTopic}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Ištrinti
                </button>
              </div>
            )}
          </div>
          <p className="text-gray-700 text-lg whitespace-pre-line">
            {topic.tekstas}
          </p>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}

export default TopicDetailsPage;

// src/pages/forum/TopicDetailsPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import type { ForumTopic, ForumComment } from "../../types";
import axios from "axios";
import { mockForumTopics, mockForumComments } from "../../mockData";

function TopicDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [topic, setTopic] = useState<ForumTopic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setIsAuthenticated(!!token);
    setIsModerator(user.role === "moderator" || user.role === "admin");
    setUserId(user.id || "");

    fetchTopic();
  }, [id]);

  // Real API calls - for future use
  const fetchTopicFromAPI = async () => {
    const response = await axios.get(
      `https://localhost:7296/api/forum/topics/${id}`,
    );
    return response.data;
  };

  const fetchCommentsFromAPI = async () => {
    const response = await axios.get(
      `https://localhost:7296/api/forum/topics/${id}/comments`,
    );
    return response.data;
  };

  // Mock data fetching - currently used
  const fetchTopic = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const foundTopic = mockForumTopics.find((t) => t.id === id);
      setTopic(foundTopic || null);
      if (!foundTopic) {
        setError("Tema nerasta");
      }
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
        const token = localStorage.getItem("authToken");
        await axios.delete(`https://localhost:7296/api/forum/topics/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
          className={`bg-white rounded-lg shadow-lg p-6 mb-6 ${topic.isPinned ? "border-l-4 border-yellow-500" : ""}`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-grow">
              {topic.isPinned && (
                <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold mb-2">
                  📌 Prikabinta
                </span>
              )}
              <h1 className="text-4xl font-bold mb-2">{topic.title}</h1>
              <div className="flex items-center text-gray-600">
                <span className="mr-4">
                  👤 {topic.author?.username || "Nežinomas"}
                </span>
                <span>
                  {new Date(topic.createdAt).toLocaleDateString("lt-LT")}
                </span>
              </div>
            </div>
            {(isModerator || topic.authorId === userId) && (
              <div>
                <button
                  onClick={handleDeleteTopic}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Ištrinti
                </button>
                <Link
                  to={`/forumas/tema/${id}/redaguoti`}
                  className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                >
                  Redaguoti
                </Link>
              </div>
            )}
          </div>
          <p className="text-gray-700 text-lg whitespace-pre-line">
            {topic.description}
          </p>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}

export default TopicDetailsPage;

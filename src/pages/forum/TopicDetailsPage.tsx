// src/pages/forum/TopicDetailsPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import type { ForumTopic, ForumComment } from '../../types';
import axios from 'axios';
import { mockForumTopics, mockForumComments } from '../../mockData';

function TopicDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [topic, setTopic] = useState<ForumTopic | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setIsAuthenticated(!!token);
    setIsModerator(user.role === 'moderator' || user.role === 'admin');
    setUserId(user.id || '');

    fetchTopic();
    fetchComments();
  }, [id]);

  // Real API calls - for future use
  const fetchTopicFromAPI = async () => {
    const response = await axios.get(`https://localhost:7296/api/forum/topics/${id}`);
    return response.data;
  };

  const fetchCommentsFromAPI = async () => {
    const response = await axios.get(`https://localhost:7296/api/forum/topics/${id}/comments`);
    return response.data;
  };

  // Mock data fetching - currently used
  const fetchTopic = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const foundTopic = mockForumTopics.find(t => t.id === id);
      setTopic(foundTopic || null);
      if (!foundTopic) {
        setError('Tema nerasta');
      }
    } catch (err) {
      setError('Nepavyko užkrauti temos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      const topicComments = mockForumComments.filter(c => c.topicId === id);
      setComments(topicComments);
    } catch (err) {
      console.error('Failed to fetch comments', err);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`https://localhost:7296/api/forum/comments`, {
        topicId: id,
        text: newComment
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setNewComment('');
      fetchComments();
      fetchTopic(); // Refresh comment count
      alert('Komentaras paskelbtas!');
    } catch (err) {
      alert('Nepavyko paskelbti komentaro');
    }
  };

  const handleDeleteTopic = async () => {
    if (window.confirm('Ar tikrai norite ištrinti šią temą?')) {
      try {
        const token = localStorage.getItem('authToken');
        await axios.delete(`https://localhost:7296/api/forum/topics/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        navigate('/forumas');
      } catch (err) {
        alert('Nepavyko ištrinti temos');
      }
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm('Ar tikrai norite ištrinti šį komentarą?')) {
      try {
        const token = localStorage.getItem('authToken');
        await axios.delete(`https://localhost:7296/api/forum/comments/${commentId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setComments(comments.filter(c => c.id !== commentId));
        fetchTopic(); // Refresh comment count
      } catch (err) {
        alert('Nepavyko ištrinti komentaro');
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
          <p className="text-xl text-red-600">{error || 'Tema nerasta'}</p>
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
        <div className={`bg-white rounded-lg shadow-lg p-6 mb-6 ${topic.isPinned ? 'border-l-4 border-yellow-500' : ''}`}>
          <div className="flex justify-between items-start mb-4">
            <div className="flex-grow">
              {topic.isPinned && (
                <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold mb-2">
                  📌 Prikabinta
                </span>
              )}
              <h1 className="text-4xl font-bold mb-2">{topic.title}</h1>
              <div className="flex items-center text-gray-600">
                <span className="mr-4">👤 {topic.author?.username || 'Nežinomas'}</span>
                <span className="mr-4">💬 {topic.commentCount} komentarai</span>
                <span>{new Date(topic.createdAt).toLocaleDateString('lt-LT')}</span>
              </div>
            </div>
            {(isModerator || topic.authorId === userId) && (
              <button
                onClick={handleDeleteTopic}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Ištrinti
              </button>
            )}
          </div>
          <p className="text-gray-700 text-lg whitespace-pre-line">{topic.description}</p>
        </div>

        {/* Comment Form */}
        {isAuthenticated ? (
          <form onSubmit={handleSubmitComment} className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Rašyti komentarą</h2>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg mb-4"
              placeholder="Parašykite savo nuomonę..."
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Paskelbti
            </button>
          </form>
        ) : (
          <div className="bg-gray-100 rounded-lg p-6 mb-6 text-center">
            <p className="text-gray-600">Prisijunkite, kad galėtumėte komentuoti</p>
          </div>
        )}

        {/* Comments */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Komentarai ({comments.length})</h2>
          {comments.length === 0 ? (
            <p className="text-gray-600">Komentarų dar nėra</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <span className="font-semibold mr-2">
                        {comment.author?.username || 'Nežinomas'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString('lt-LT')}
                      </span>
                    </div>
                    {(isModerator || comment.authorId === userId) && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Ištrinti
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">{comment.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}

export default TopicDetailsPage;

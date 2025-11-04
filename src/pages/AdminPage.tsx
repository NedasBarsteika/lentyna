// src/pages/AdminPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import type { User, Book, Author, ForumTopic, Review } from '../types';
import { UserRole } from '../types';
import { mockUsers, mockBooks, mockAuthors, mockForumTopics, mockReviews } from '../mockData';

type TabType = 'dashboard' | 'users' | 'content' | 'settings';

function AdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Data states
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [authors, setAuthors] = useState<Author[]>(mockAuthors);
  const [topics, setTopics] = useState<ForumTopic[]>(mockForumTopics);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);

  // Edit state
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');

  useEffect(() => {
    // Check if user is admin
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      navigate('/prisijungimas', { state: { from: '/admin' } });
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser.role !== UserRole.ADMIN) {
        alert('Prieiga uždrausta! Tik administratoriai gali pasiekti šį puslapį.');
        navigate('/');
        return;
      }

      setCurrentUser(parsedUser);
    } catch (err) {
      navigate('/prisijungimas');
    }
  }, [navigate]);

  const getRoleLabel = (role: string) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'Administratorius';
      case UserRole.MODERATOR:
        return 'Moderatorius';
      case UserRole.EDITOR:
        return 'Redaktorius';
      case UserRole.READER:
        return 'Skaitytojas';
      default:
        return role;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-red-100 text-red-800';
      case UserRole.MODERATOR:
        return 'bg-purple-100 text-purple-800';
      case UserRole.EDITOR:
        return 'bg-blue-100 text-blue-800';
      case UserRole.READER:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRoleChange = (userId: string) => {
    if (userId === currentUser?.id) {
      alert('Negalite pakeisti savo rolės!');
      return;
    }

    const confirmed = window.confirm('Ar tikrai norite pakeisti šio naudotojo rolę?');
    if (confirmed) {
      setUsers(users.map(user =>
        user.id === userId ? { ...user, role: selectedRole as any } : user
      ));

      // Update in localStorage if it's the current user
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.id === userId) {
          parsedUser.role = selectedRole;
          localStorage.setItem('user', JSON.stringify(parsedUser));
        }
      }

      setEditingUserId(null);
      setSelectedRole('');
      alert('Rolė sėkmingai pakeista!');
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser?.id) {
      alert('Negalite ištrinti savo paskyros iš admin puslapio!');
      return;
    }

    const confirmed = window.confirm('Ar tikrai norite ištrinti šį naudotoją? Šis veiksmas negrįžtamas!');
    if (confirmed) {
      setUsers(users.filter(user => user.id !== userId));
      alert('Naudotojas sėkmingai ištrintas!');
    }
  };

  const handleDeleteBook = (bookId: string) => {
    const confirmed = window.confirm('Ar tikrai norite ištrinti šią knygą?');
    if (confirmed) {
      setBooks(books.filter(book => book.id !== bookId));
      alert('Knyga ištrinta!');
    }
  };

  const handleDeleteAuthor = (authorId: string) => {
    const confirmed = window.confirm('Ar tikrai norite ištrinti šį autorių?');
    if (confirmed) {
      setAuthors(authors.filter(author => author.id !== authorId));
      alert('Autorius ištrintas!');
    }
  };

  const handleDeleteTopic = (topicId: string) => {
    const confirmed = window.confirm('Ar tikrai norite ištrinti šią forumo temą?');
    if (confirmed) {
      setTopics(topics.filter(topic => topic.id !== topicId));
      alert('Tema ištrinta!');
    }
  };

  const handleDeleteReview = (reviewId: string) => {
    const confirmed = window.confirm('Ar tikrai norite ištrinti šį atsiliepimą?');
    if (confirmed) {
      setReviews(reviews.filter(review => review.id !== reviewId));
      alert('Atsiliepimas ištrintas!');
    }
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p>Kraunama...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Sistemos Statistika</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Viso Naudotojų</p>
              <p className="text-3xl font-bold text-blue-600">{users.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Viso Knygų</p>
              <p className="text-3xl font-bold text-green-600">{books.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Viso Autorių</p>
              <p className="text-3xl font-bold text-purple-600">{authors.length}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Forumo Temų</p>
              <p className="text-3xl font-bold text-orange-600">{topics.length}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Naudotojų Pasiskirstymas</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Administratoriai</span>
              <span className="font-semibold text-red-600">
                {users.filter(u => u.role === UserRole.ADMIN).length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Moderatoriai</span>
              <span className="font-semibold text-purple-600">
                {users.filter(u => u.role === UserRole.MODERATOR).length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Redaktoriai</span>
              <span className="font-semibold text-blue-600">
                {users.filter(u => u.role === UserRole.EDITOR).length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Skaitytojai</span>
              <span className="font-semibold text-gray-600">
                {users.filter(u => u.role === UserRole.READER).length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Greiti Veiksmai</h3>
          <div className="space-y-2">
            <Link
              to="/knygos/nauja"
              className="block w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-center"
            >
              + Pridėti Naują Knygą
            </Link>
            <Link
              to="/autoriai/naujas"
              className="block w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center"
            >
              + Pridėti Naują Autorių
            </Link>
            <button
              onClick={() => setActiveTab('users')}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Valdyti Naudotojus
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Naudotojų Valdymas</h2>
        <div className="text-sm text-gray-600">
          Viso naudotojų: <span className="font-semibold">{users.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Naudotojas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  El. Paštas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rolė
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registracija
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Veiksmai
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className={user.id === currentUser.id ? 'bg-blue-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.username}
                          {user.id === currentUser.id && (
                            <span className="ml-2 text-xs text-blue-600">(Jūs)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUserId === user.id ? (
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value={UserRole.READER}>Skaitytojas</option>
                        <option value={UserRole.EDITOR}>Redaktorius</option>
                        <option value={UserRole.MODERATOR}>Moderatorius</option>
                        <option value={UserRole.ADMIN}>Administratorius</option>
                      </select>
                    ) : (
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('lt-LT')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {editingUserId === user.id ? (
                      <>
                        <button
                          onClick={() => handleRoleChange(user.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Išsaugoti
                        </button>
                        <button
                          onClick={() => {
                            setEditingUserId(null);
                            setSelectedRole('');
                          }}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Atšaukti
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingUserId(user.id);
                            setSelectedRole(user.role);
                          }}
                          disabled={user.id === currentUser.id}
                          className={`${
                            user.id === currentUser.id
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-blue-600 hover:text-blue-900'
                          }`}
                        >
                          Keisti Rolę
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={user.id === currentUser.id}
                          className={`${
                            user.id === currentUser.id
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-red-600 hover:text-red-900'
                          }`}
                        >
                          Ištrinti
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Turinio Valdymas</h2>

      {/* Books Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Knygos ({books.length})</h3>
          <Link
            to="/knygos/nauja"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
          >
            + Pridėti Knygą
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pavadinimas</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Autorius</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Metai</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Veiksmai</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {books.slice(0, 5).map((book) => (
                <tr key={book.id}>
                  <td className="px-4 py-3 text-sm text-gray-900">{book.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {book.author ? `${book.author.firstName} ${book.author.lastName}` : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{book.publishYear}</td>
                  <td className="px-4 py-3 text-sm space-x-2">
                    <Link to={`/knygos/${book.id}/redaguoti`} className="text-blue-600 hover:text-blue-900">
                      Redaguoti
                    </Link>
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Ištrinti
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {books.length > 5 && (
            <div className="mt-4 text-center">
              <Link to="/knygos" className="text-blue-600 hover:text-blue-900 text-sm">
                Žiūrėti visas knygas →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Authors Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Autoriai ({authors.length})</h3>
          <Link
            to="/autoriai/naujas"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
          >
            + Pridėti Autorių
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vardas</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pavardė</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Knygų</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Veiksmai</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {authors.slice(0, 5).map((author) => (
                <tr key={author.id}>
                  <td className="px-4 py-3 text-sm text-gray-900">{author.firstName}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{author.lastName}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{author.books?.length || 0}</td>
                  <td className="px-4 py-3 text-sm space-x-2">
                    <Link to={`/autoriai/${author.id}/redaguoti`} className="text-blue-600 hover:text-blue-900">
                      Redaguoti
                    </Link>
                    <button
                      onClick={() => handleDeleteAuthor(author.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Ištrinti
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {authors.length > 5 && (
            <div className="mt-4 text-center">
              <Link to="/autoriai" className="text-blue-600 hover:text-blue-900 text-sm">
                Žiūrėti visus autorius →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Forum Topics Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Forumo Temos ({topics.length})</h3>
          <Link
            to="/forumas"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            Peržiūrėti Forumą
          </Link>
        </div>
        <div className="space-y-2">
          {topics.slice(0, 5).map((topic) => (
            <div key={topic.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
              <div className="flex-1">
                <Link to={`/forumas/${topic.id}`} className="text-blue-600 hover:text-blue-900 font-medium">
                  {topic.title}
                </Link>
                {topic.isPinned && (
                  <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Prikabinta</span>
                )}
              </div>
              <button
                onClick={() => handleDeleteTopic(topic.id)}
                className="text-red-600 hover:text-red-900 text-sm"
              >
                Ištrinti
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Naujausi Komentarai ({reviews.length})</h3>
        <div className="space-y-2">
          {reviews.slice(0, 5).map((review) => (
            <div key={review.id} className="flex justify-between items-start p-3 border rounded hover:bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{review.user?.username || 'Nežinomas'}</span>
                  <span className="text-yellow-500">{'⭐'.repeat(review.rating)}</span>
                  {review.isAiGenerated && (
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">DI</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{review.text}</p>
              </div>
              <button
                onClick={() => handleDeleteReview(review.id)}
                className="text-red-600 hover:text-red-900 text-sm ml-4"
              >
                Ištrinti
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Sistemos Nustatymai</h2>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Bendri Nustatymai</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sistemos Pavadinimas
            </label>
            <input
              type="text"
              defaultValue="Lentyna.lt"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sistemos Aprašymas
            </label>
            <textarea
              defaultValue="Knygų vertinimo ir nuomonių dalinimosi svetainė"
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Išsaugoti Nustatymus
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Funkcionalumas</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input type="checkbox" defaultChecked className="mr-2" />
            <span>Leisti registraciją naujiem naudotojams</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" defaultChecked className="mr-2" />
            <span>Leisti rašyti atsiliepimus</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" defaultChecked className="mr-2" />
            <span>Rodyti DI generuotus atsiliepimus</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" defaultChecked className="mr-2" />
            <span>Aktyvuoti knygų klubą</span>
          </label>
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mt-4">
            Išsaugoti Funkcijas
          </button>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-red-600">Pavojinga Zona</h3>
        <p className="text-gray-700 mb-4">
          Šie veiksmai gali turėti didelę įtaką sistemos veikimui.
        </p>
        <div className="space-y-2">
          <button className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700 mr-2">
            Išvalyti Talpyklą
          </button>
          <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
            Atkurti Gamyklinius Nustatymus
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-grow bg-gray-100 py-8 px-4"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <span className="text-red-600">⚙️</span>
              Administratoriaus Pultas
            </h1>
            <p className="text-gray-600 mt-1">Sveiki sugrįžę, {currentUser.username}!</p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="flex border-b overflow-x-auto">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-6 py-3 font-medium whitespace-nowrap ${
                  activeTab === 'dashboard'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-3 font-medium whitespace-nowrap ${
                  activeTab === 'users'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                👥 Naudotojai
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`px-6 py-3 font-medium whitespace-nowrap ${
                  activeTab === 'content'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                📚 Turinys
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-3 font-medium whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                ⚙️ Nustatymai
              </button>
            </div>
          </div>

          {/* Content */}
          <div>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'content' && renderContent()}
            {activeTab === 'settings' && renderSettings()}
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}

export default AdminPage;

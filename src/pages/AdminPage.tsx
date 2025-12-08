// src/pages/AdminPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import type { User } from '../types';
import { UserRole, roleToNumber } from '../types';
import { authService } from '../api/authService';

function AdminPage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Data state
  const [users, setUsers] = useState<User[]>([]);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Error state
  const [error, setError] = useState<string | null>(null);

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

      // Load users from API
      fetchUsers();
    } catch (err) {
      navigate('/prisijungimas');
    }
  }, [navigate]);

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError('Nepavyko užkrauti naudotojų');
    } finally {
      setLoading(false);
    }
  };

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

  const handleRoleChange = async (userId: string) => {
    if (userId === currentUser?.Id) {
      alert('Negalite pakeisti savo rolės!');
      return;
    }

    const confirmed = window.confirm('Ar tikrai norite pakeisti šio naudotojo rolę?');
    if (!confirmed) {
      setEditingUserId(null);
      setSelectedRole('');
      return;
    }

    try {
      // Convert string role to number for backend
      const roleNumber = roleToNumber(selectedRole);
      await authService.changeUserRole(userId, roleNumber);

      setUsers(users.map(user =>
        user.Id === userId ? { ...user, role: selectedRole as any } : user
      ));

      setEditingUserId(null);
      setSelectedRole('');
      alert('Rolė sėkmingai pakeista!');
    } catch (err: any) {
      console.error('Error changing role:', err);
      alert('Klaida keičiant rolę: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === currentUser?.Id) {
      alert('Negalite ištrinti savo paskyros iš admin puslapio!');
      return;
    }

    const confirmed = window.confirm('Ar tikrai norite ištrinti šį naudotoją? Šis veiksmas negrįžtamas!');
    if (!confirmed) return;

    try {
      await authService.deleteUser(userId);

      setUsers(users.filter(user => user.Id !== userId));
      alert('Naudotojas sėkmingai ištrintas!');
    } catch (err: any) {
      console.error('Error deleting user:', err);

      if (err.response?.status === 404) {
        alert('Naudotojų trynimas dar nepalaikomas backend sistemoje.');
      } else {
        alert('Klaida trinant naudotoją: ' + (err.response?.data?.message || err.message));
      }
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
            <p className="text-gray-600 mt-1">Sveiki sugrįžę, {currentUser.slapyvardis}!</p>
          </div>

          {/* Users Management Content */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Naudotojų Valdymas</h2>
              <div className="text-sm text-gray-600">
                Viso naudotojų: <span className="font-semibold">{users.length}</span>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12 bg-white rounded-lg shadow-md">
                <p className="text-gray-600">Kraunami naudotojai...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-600 mb-2">{error}</p>
                <button
                  onClick={fetchUsers}
                  className="text-sm text-red-600 underline hover:text-red-800"
                >
                  Bandyti dar kartą
                </button>
              </div>
            ) : (
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
                        <tr key={user.Id} className={user.Id === currentUser.Id ? 'bg-blue-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {user.slapyvardis}
                                  {user.Id === currentUser.Id && (
                                    <span className="ml-2 text-xs text-blue-600">(Jūs)</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.el_pastas}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingUserId === user.Id ? (
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
                            {new Date(user.sukurimo_data).toLocaleDateString('lt-LT')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            {editingUserId === user.Id ? (
                              <>
                                <button
                                  onClick={() => handleRoleChange(user.Id)}
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
                                    setEditingUserId(user.Id);
                                    setSelectedRole(user.role);
                                  }}
                                  disabled={user.Id === currentUser.Id}
                                  className={`${
                                    user.Id === currentUser.Id
                                      ? 'text-gray-400 cursor-not-allowed'
                                      : 'text-blue-600 hover:text-blue-900'
                                  }`}
                                >
                                  Keisti Rolę
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.Id)}
                                  disabled={user.Id === currentUser.Id}
                                  className={`${
                                    user.Id === currentUser.Id
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
            )}
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}

export default AdminPage;

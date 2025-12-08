// src/pages/ProfilePage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ImageUpload from '../components/ImageUpload';
import type { User } from '../types';
import { UserRole } from '../types';
import { authService, uploadsService } from '../api';

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      navigate('/prisijungimas', { state: { from: '/profilis' } });
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData({
        username: parsedUser.username,
        email: parsedUser.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(null);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate password change if attempting
    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        setError('Įveskite dabartinį slaptažodį');
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setError('Nauji slaptažodžiai nesutampa');
        return;
      }

      if (formData.newPassword.length < 6) {
        setError('Naujas slaptažodis turi būti bent 6 simbolių');
        return;
      }
    }

    setLoading(true);

    try {
      // Įkelti profilio nuotrauką, jei pasirinkta nauja
      let imageUrl = user?.profilio_nuotrauka;
      if (profileImage) {
        imageUrl = await uploadsService.uploadProfilePhoto(profileImage);
      }

      // Atnaujinti profilį per API
      const updatedUser = await authService.updateProfile({
        slapyvardis: formData.username,
        profilio_nuotrauka: imageUrl,
      });

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSuccess('Profilis sėkmingai atnaujintas!');
      setIsEditing(false);
      setProfileImage(null);

      // Clear password fields
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Reload page to update navbar
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setError('Nepavyko atnaujinti profilio');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Ar tikrai norite ištrinti paskyrą? Šis veiksmas negrįžtamas!'
    );

    if (confirmed) {
      const doubleConfirm = window.confirm(
        'Paskutinis patvirtinimas: Ar tikrai norite ištrinti paskyrą?'
      );

      if (doubleConfirm) {
        try {
          await authService.deleteProfile();
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          navigate('/');
        } catch (err) {
          setError('Nepavyko ištrinti paskyros');
        }
      }
    }
  };

  if (!user) {
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Mano Profilis</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Paskyros Informacija</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Redaguoti
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {user.profilio_nuotrauka ? (
                    <img
                      src={user.profilio_nuotrauka}
                      alt="Profilio nuotrauka"
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-3xl text-gray-500">
                        {user.slapyvardis.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-xl font-medium">{user.slapyvardis}</p>
                    <p className="text-gray-600">{user.el_pastas}</p>
                  </div>
                </div>

                <div>
                  <label className="text-gray-600 text-sm">Rolė</label>
                  <p className="text-lg font-medium">{getRoleLabel(user.role)}</p>
                </div>

                <div>
                  <label className="text-gray-600 text-sm">Registracijos data</label>
                  <p className="text-lg font-medium">
                    {new Date(user.sukurimo_data).toLocaleDateString('lt-LT', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <ImageUpload
                  value={profileImage}
                  onChange={setProfileImage}
                  currentImageUrl={user.profilio_nuotrauka}
                  label="Profilio nuotrauka"
                />

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Slapyvardis
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                    minLength={3}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    El. paštas
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">El. pašto keisti negalima</p>
                </div>

                <div className="border-t pt-4 mt-4">
                  <h3 className="text-lg font-semibold mb-3">Keisti Slaptažodį (neprivaloma)</h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Dabartinis slaptažodis
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        placeholder="Įveskite tik jei norite keisti slaptažodį"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Naujas slaptažodis
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        minLength={6}
                        placeholder="Bent 6 simboliai"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Pakartokite naują slaptažodį
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        placeholder="Pakartokite naują slaptažodį"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                  >
                    {loading ? 'Saugoma...' : 'Išsaugoti'}
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setIsEditing(false);
                      setProfileImage(null);
                      setFormData({
                        username: user.slapyvardis,
                        email: user.el_pastas,
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                      setError(null);
                    }}
                    className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 disabled:bg-gray-300"
                  >
                    Atšaukti
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-red-600">Paskyros ištrynimas</h2>
            <p className="text-gray-600 mb-4">
              Ištrynus paskyrą, visi jūsų duomenys bus pašalinti ir nebegalės būti atstatyti.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
            >
              Ištrinti Paskyrą
            </button>
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}

export default ProfilePage;

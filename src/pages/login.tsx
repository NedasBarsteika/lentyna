// src/pages/login.tsx
import { motion } from "framer-motion";
import "../App.css";
import NavbarOnlyLogo from "../components/NavbarOnlyLogo";
import Footer from "../components/Footer";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from "../api";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    el_pastas: "",
    slaptazodis: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.el_pastas || !formData.slaptazodis) {
      setError("Įveskite prisijungimo duomenis");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login({
        el_pastas: formData.el_pastas,
        slaptazodis: formData.slaptazodis,
      });

      const token = response.token;
      const user = response.naudotojas;
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      document.cookie = `token=${token}; path=/; max-age=3600; Secure; SameSite=Strict`;
      const previousPage = location.state?.from || "/";
      navigate(previousPage, { replace: true });
    } catch (err: any) {
      console.error("Prisijungimo klaida:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError("Neteisingas el. paštas arba slaptažodis");
      } else {
        setError("Įvyko klaida prisijungiant. Bandykite dar kartą.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarOnlyLogo />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="flex flex-col flex-grow justify-center items-center bg-gray-100 p-4"
      >
        <div className="flex flex-1 justify-center items-center bg-gray-100 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Prisijungimas
            </h2>

            {error && (
              <p className="text-red-500 text-sm text-center mb-5">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                name="el_pastas"
                placeholder="El. paštas"
                value={formData.el_pastas}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="password"
                name="slaptazodis"
                placeholder="Slaptažodis"
                value={formData.slaptazodis}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400 hover:cursor-pointer"
                disabled={loading}
              >
                {loading ? "Prisijungiama..." : "Prisijungti"}
              </button>
            </form>
            <div className="w-full max-w-md text-center mt-2">
              <button
                onClick={() => navigate("/registracija")}
                className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 cursor-pointer"
              >
                Registruotis
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}

export default LoginPage;

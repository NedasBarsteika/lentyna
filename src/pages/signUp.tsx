// src/pages/signUp.tsx
import { motion } from "framer-motion";
import "../App.css";
import NavbarOnlyLogo from "../components/NavbarOnlyLogo";
import Footer from "../components/Footer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../api";

function SignUpPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    slapyvardis: "",
    el_pastas: "",
    slaptazodis: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (
      !formData.slapyvardis ||
      !formData.el_pastas ||
      !formData.slaptazodis ||
      !formData.confirmPassword
    ) {
      setError("Įveskite visus duomenis");
      return;
    }

    if (formData.slaptazodis !== formData.confirmPassword) {
      setError("Slaptažodžiai skiriasi!");
      return;
    }

    if (formData.slaptazodis.length < 6) {
      setError("Slaptažodis turi būti bent 6 simbolių");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register({
        slapyvardis: formData.slapyvardis,
        el_pastas: formData.el_pastas,
        slaptazodis: formData.slaptazodis,
      });

      // Auto-login after successful registration
      const token = response.token;
      const user = response.naudotojas;
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      document.cookie = `token=${token}; path=/; max-age=3600; Secure; SameSite=Strict`;

      navigate("/", { replace: true });
    } catch (err: any) {
      console.error("Registracijos klaida:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 400) {
        setError("El. paštas arba slapyvardis jau užimtas");
      } else {
        setError("Įvyko klaida registruojantis. Bandykite dar kartą.");
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
              Paskyros kūrimas
            </h2>

            {error && (
              <p className="text-red-500 text-sm text-center mb-5">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="slapyvardis"
                placeholder="Slapyvardis"
                value={formData.slapyvardis}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                minLength={3}
                maxLength={100}
              />
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
                minLength={6}
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Pakartokite slaptažodį"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400 hover:cursor-pointer"
                disabled={loading}
              >
                {loading ? "Registruojama..." : "Registruotis"}
              </button>
            </form>
            <div className="w-full max-w-md text-center mt-2">
              <button
                onClick={() => navigate("/prisijungimas")}
                className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 cursor-pointer"
              >
                Prisijungti
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}

export default SignUpPage;

// src/pages/home.tsx
import { motion } from 'framer-motion';
import '../App.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="flex-grow"
      >
        {/* HERO SECTION */}
        <section className="flex flex-col justify-center items-center my-12 max-w-screen-xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Sveiki atvykę į Lentyną.lt
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Dalinkitės nuomone apie knygas, rašykite atsiliepimus ir atraskite bendraminčius
          </p>
          <div className="flex gap-4">
            <a
              href="/knygos"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Naršyti knygas
            </a>
            <a
              href="/registracija"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Registruotis
            </a>
          </div>
        </section>

        {/* CARDS SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-screen-xl mx-auto p-6">
          <a href="/knygos" className="p-6 border rounded-xl shadow-lg text-center hover:shadow-xl block bg-gray-100 transition-all">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-xl font-bold text-black mt-4">Knygos</h2>
            <p className="text-gray-600 mt-2">Naršykite knygų katalogą ir raskite savo mėgstamas knygas</p>
          </a>
          <a href="/autoriai" className="p-6 border rounded-xl shadow-lg text-center hover:shadow-xl block bg-gray-100 transition-all">
            <div className="text-6xl mb-4">✍️</div>
            <h2 className="text-xl font-bold text-black mt-4">Autoriai</h2>
            <p className="text-gray-600 mt-2">Susipažinkite su autoriais ir jų biografijomis</p>
          </a>
          <a href="/forumas" className="p-6 border rounded-xl shadow-lg text-center hover:shadow-xl block bg-gray-100 transition-all">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-xl font-bold text-black mt-4">Forumas</h2>
            <p className="text-gray-600 mt-2">Dalinkitės nuomone ir diskutuokite apie knygas</p>
          </a>
        </section>

        {/* FEATURES SECTION */}
        <section className="bg-gray-50 py-12 mt-12">
          <div className="max-w-screen-xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-8">Kodėl Lentyna?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">⭐</div>
                <h3 className="font-semibold text-lg mb-2">Vertinkite knygas</h3>
                <p className="text-gray-600 text-sm">Rašykite atsiliepimus ir dalinatės įspūdžiais</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">📖</div>
                <h3 className="font-semibold text-lg mb-2">Knygų lentyna</h3>
                <p className="text-gray-600 text-sm">Tvarkykite savo asmeninę knygų lentyną</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="font-semibold text-lg mb-2">Rekomendacijos</h3>
                <p className="text-gray-600 text-sm">Gaukite knygų pasiūlymus pagal jūsų skonį</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">👥</div>
                <h3 className="font-semibold text-lg mb-2">Knygų klubas</h3>
                <p className="text-gray-600 text-sm">Dalyvaukite gyvuose susitikimuose</p>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
      
      <Footer />
    </div>
  );
}

export default HomePage;

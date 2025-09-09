// src/App.tsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from './pages/home';
import SignUpPage from './pages/signUp';
import LoginPage from './pages/login';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/registracija" element={<SignUpPage />} />
          <Route path="/prisijungimas" element={<LoginPage />} />
        </Routes>
      </Router>
  );
}

export default App;

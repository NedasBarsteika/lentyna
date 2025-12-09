// src/App.tsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home";
import SignUpPage from "./pages/signUp";
import LoginPage from "./pages/login";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";

// Books
import BooksPage from "./pages/books/BooksPage";
import BookDetailsPage from "./pages/books/BookDetailsPage";
import BookFormPage from "./pages/books/BookFormPage";

// Authors
import AuthorsPage from "./pages/authors/AuthorsPage";
import AuthorDetailsPage from "./pages/authors/AuthorDetailsPage";
import AuthorFormPage from "./pages/authors/AuthorFormPage";

// Reviews
import ReviewFormPage from "./pages/reviews/ReviewFormPage";

// Bookshelf
import BookshelfPage from "./pages/bookshelf/BookshelfPage";

// Forum
import ForumPage from "./pages/forum/ForumPage";
import TopicDetailsPage from "./pages/forum/TopicDetailsPage";
import TopicFormPage from "./pages/forum/TopicFormPage";
import BookClubPage from "./pages/forum/BookClubPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Main */}
        <Route path="/" element={<HomePage />} />
        <Route path="/registracija" element={<SignUpPage />} />
        <Route path="/prisijungimas" element={<LoginPage />} />
        <Route path="/profilis" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminPage />} />

        {/* Books */}
        <Route path="/knygos" element={<BooksPage />} />
        <Route path="/knygos/nauja" element={<BookFormPage />} />
        <Route path="/knygos/:id" element={<BookDetailsPage />} />
        <Route path="/knygos/:id/redaguoti" element={<BookFormPage />} />
        <Route
          path="/knygos/:bookId/atsiliepimas"
          element={<ReviewFormPage />}
        />
        <Route
          path="/knygos/:bookId/atsiliepimas/redaguoti/:reviewId"
          element={<ReviewFormPage />}
        />

        {/* Authors */}
        <Route path="/autoriai" element={<AuthorsPage />} />
        <Route path="/autoriai/naujas" element={<AuthorFormPage />} />
        <Route path="/autoriai/:id" element={<AuthorDetailsPage />} />
        <Route path="/autoriai/:id/redaguoti" element={<AuthorFormPage />} />

        {/* Bookshelf */}
        <Route path="/mano-knygos" element={<BookshelfPage />} />

        {/* Forum */}
        <Route path="/forumas" element={<ForumPage />} />
        <Route path="/forumas/nauja-tema" element={<TopicFormPage />} />
        <Route path="/forumas/klubas" element={<BookClubPage />} />
        <Route path="/forumas/tema/:id" element={<TopicDetailsPage />} />
        <Route path="/forumas/tema/:id/redaguoti" element={<TopicFormPage />} />
        <Route
          path="/forumas/tema/:id/redaguoti"
          element={<TopicDetailsPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;

// src/types/index.ts

// Const objects instead of enums (for verbatimModuleSyntax compatibility)
export const UserRole = {
  ADMIN: "admin",
  MODERATOR: "moderator",
  EDITOR: "editor",
  READER: "reader"
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const BookMood = {
  HAPPY: "happy",
  SAD: "sad",
  NEUTRAL: "neutral"
} as const;

export type BookMood = typeof BookMood[keyof typeof BookMood];

export const BookshelfStatus = {
  READ: "read",
  READING: "reading",
  WANT_TO_READ: "want_to_read"
} as const;

export type BookshelfStatus = typeof BookshelfStatus[keyof typeof BookshelfStatus];

// Mood Types (Nuotaika)
export interface Mood {
  id: string;
  pavadinimas: string; // "Džiugi", "Liūdna", "Neutrali"
}

// Genre Types (Žanras)
export interface Genre {
  id: string;
  pavadinimas: string;
  moodIds: string[]; // Many-to-many relationship with Moods
  moods?: Mood[]; // Populated moods
}

// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

// Author Types
export interface Author {
  id: string;
  firstName: string;
  lastName: string;
  biography: string;
  photoUrl?: string;
  books?: Book[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthorCreateDto {
  firstName: string;
  lastName: string;
  biography: string;
  photoUrl?: string;
}

// Book Types
export interface Book {
  id: string;
  title: string;
  description: string;
  authorId: string;
  author?: Author;
  publishYear: number;
  genreId: string; // One genre (changed from genres: string[])
  genre?: Genre; // Populated genre with moods
  coverImageUrl?: string;
  averageRating?: number;
  reviewCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookCreateDto {
  title: string;
  description: string;
  authorId: string;
  publishYear: number;
  genreId: string; // Changed from genres: string[]
  coverImageUrl?: string;
}

export interface BookSearchDto {
  scenarioDescription?: string;
  genreIds?: string[]; // Changed from genres: string[]
  moodIds?: string[]; // Changed from moods: BookMood[]
  authorId?: string;
  minYear?: number;
  maxYear?: number;
}

// Review Types
export interface Review {
  id: string;
  bookId: string;
  userId: string;
  user?: User;
  text: string;
  rating: number; // 1-5
  isAiGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewCreateDto {
  bookId: string;
  text: string;
  rating: number;
}

// Bookshelf Types
export interface BookshelfEntry {
  id: string;
  userId: string;
  bookId: string;
  book?: Book;
  status: BookshelfStatus;
  addedAt: Date;
}

export interface BookshelfCreateDto {
  bookId: string;
  status: BookshelfStatus;
}

// Forum Types
export interface ForumTopic {
  id: string;
  title: string;
  description: string;
  authorId: string;
  author?: User;
  isPinned: boolean;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ForumTopicCreateDto {
  title: string;
  description: string;
}

export interface ForumComment {
  id: string;
  topicId: string;
  authorId: string;
  author?: User;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ForumCommentCreateDto {
  topicId: string;
  text: string;
}

// Book Club Types
export interface BookClubWeek {
  id: string;
  weekNumber: number;
  year: number;
  nominatedBooks: BookClubNomination[];
  meetingDate: Date;
  weatherForecast?: WeatherForecast;
  winnerId?: string;
  createdAt: Date;
}

export interface BookClubNomination {
  id: string;
  weekId: string;
  bookId: string;
  book?: Book;
  voteCount: number;
}

export interface BookClubVote {
  id: string;
  weekId: string;
  bookId: string;
  userId: string;
  createdAt: Date;
}

export interface WeatherForecast {
  date: Date;
  temperature: number;
  description: string;
  willRain: boolean;
  recommendation: "outdoor" | "indoor" | "flexible";
}

// Favorite Authors
export interface FavoriteAuthor {
  id: string;
  userId: string;
  authorId: string;
  author?: Author;
  addedAt: Date;
}

// Book Recommendations
export interface BookRecommendation {
  book: Book;
  score: number;
  reason: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// src/types/index.ts

// User Roles (matching backend)
export const UserRole = {
  ADMIN: "admin",
  MODERATOR: "moderatorius",
  EDITOR: "redaktorius",
  READER: "naudotojas",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// Role to numeric mapping for backend API
export const roleToNumber = (role: string): number => {
  switch (role) {
    case UserRole.READER:
      return 0;
    case UserRole.EDITOR:
      return 1;
    case UserRole.MODERATOR:
      return 2;
    case UserRole.ADMIN:
      return 3;
    default:
      return 0;
  }
};

// Numeric to role mapping for backend responses
export const numberToRole = (num: number): string => {
  switch (num) {
    case 0:
      return UserRole.READER;
    case 1:
      return UserRole.EDITOR;
    case 2:
      return UserRole.MODERATOR;
    case 3:
      return UserRole.ADMIN;
    default:
      return UserRole.READER;
  }
};

// Bookshelf Status (matching backend enum values)
export const BookshelfStatus = {
  READ: 0, // skaityta
  READING: 2, // skaitoma
  WANT_TO_READ: 1, // norima_skaityti
} as const;

export type BookshelfStatus =
  (typeof BookshelfStatus)[keyof typeof BookshelfStatus];

// ============ Backend Response Types ============

// User / Naudotojas
export interface User {
  Id: string;
  slapyvardis: string;
  el_pastas: string;
  role: UserRole;
  sukurimo_data: string;
  profilio_nuotrauka?: string;
}

export interface AuthResponse {
  token: string;
  naudotojas: User;
}

export interface LoginDto {
  el_pastas: string;
  slaptazodis: string;
}

export interface RegisterDto {
  slapyvardis: string;
  el_pastas: string;
  slaptazodis: string;
}

export interface UpdateProfileDto {
  slapyvardis?: string;
  profilio_nuotrauka?: string;
}

// Genre / Žanras
export interface Genre {
  Id: string;
  pavadinimas: string;
}

// Mood / Nuotaika
export interface Mood {
  Id: string;
  pavadinimas: string;
  zanrai?: Genre[]; // Array of genres associated with this mood
}

export interface MoodCreateDto {
  pavadinimas: string;
  zanrasIds: string[]; // Array of genre IDs
}

// Author / Autorius
export interface Author {
  Id: string;
  vardas: string;
  pavarde: string;
  gimimo_metai?: string;
  mirties_data?: string;
  curiculum_vitae?: string;
  nuotrauka?: string;
  tautybe?: string;
  knygu_skaicius?: number;
}

export interface AuthorCreateDto {
  vardas: string;
  pavarde: string;
  gimimo_metai?: string;
  mirties_data?: string;
  curiculum_vitae?: string;
  nuotrauka?: string;
  tautybe?: string;
}

export interface AuthorUpdateDto {
  vardas?: string;
  pavarde?: string;
  gimimo_metai?: string;
  mirties_data?: string;
  curiculum_vitae?: string;
  nuotrauka?: string;
  tautybe?: string;
}

// Book / Knyga
export interface Book {
  Id: string;
  knygos_pavadinimas: string;
  leidimo_metai?: string;
  aprasymas?: string;
  psl_skaicius?: number;
  ISBN?: string;
  virselio_nuotrauka?: string;
  kalba?: string;
  bestseleris: boolean;
  AutoriusId: string;
  ZanrasId: string;
  // Populated fields from API
  autorius_vardas?: string;
  vidutinis_vertinimas?: number;
  komentaru_skaicius?: number;
  Zanras?: Genre;
  Autorius?: Author;
  zanrasObj?: Genre;
  di_komentaras?: AIComment;
}

export interface BookCreateDto {
  knygos_pavadinimas: string;
  leidimo_metai?: string;
  aprasymas?: string;
  psl_skaicius?: number;
  ISBN?: string;
  virselio_nuotrauka?: string;
  kalba?: string;
  bestseleris?: boolean;
  AutoriusId: string;
  ZanrasId: string;
}

export interface BookUpdateDto {
  knygos_pavadinimas?: string;
  leidimo_metai?: string;
  aprasymas?: string;
  psl_skaicius?: number;
  ISBN?: string;
  virselio_nuotrauka?: string;
  kalba?: string;
  bestseleris?: boolean;
  AutoriusId?: string;
  ZanrasId?: string;
}

export interface BookSearchDto {
  ScenarijausAprasymas?: string;
  ZanruIds?: string[];
  NuotaikuIds?: string[];
}

// Review / Komentaras (knygos atsiliepimas)
export interface Review {
  Id: string;
  komentaro_tekstas: string;
  komentaro_data: string;
  vertinimas: number;
  redagavimo_data?: string;
  NaudotojasId: string;
  KnygaId?: string;
  TemaId?: string;
  // Populated
  Naudotojas?: User;
}

export interface ReviewCreateDto {
  komentaro_tekstas: string;
  vertinimas: number;
  KnygaId?: string;
  TemaId?: string;
}

export interface ReviewUpdateDto {
  komentaro_tekstas?: string;
  vertinimas?: number;
}

// AI Generated Comment (DI komentaras)
export interface AIComment {
  Id: string;
  modelis: string;
  sugeneravimo_data: string;
  tekstas: string;
}

// AI Generated Review
export interface AIReview {
  Id: string;
  sugeneravimo_data: string;
  tekstas: string;
  modelis: string;
  KnygaId: string;
}

// Bookshelf Entry / Įrašas
export interface BookshelfEntry {
  Id: string;
  tipas: BookshelfStatus;
  sukurimo_data: string;
  redagavimo_data?: string;
  NaudotojasId: string;
  KnygaId: string;
  Knyga?: Book;
}

export interface BookshelfCreateDto {
  KnygaId: string;
  tipas: BookshelfStatus;
}

export interface BookshelfUpdateDto {
  tipas: BookshelfStatus;
}

// Citation / Citata
export interface Citation {
  Id: string;
  citatos_tekstas: string;
  citatos_data?: string;
  citatos_saltinis?: string;
  AutoriusId: string;
}

export interface CitationCreateDto {
  citatos_tekstas: string;
  citatos_data?: string;
  citatos_saltinis?: string;
  AutoriusId: string;
}

// Forum Topic / Tema
export interface ForumTopic {
  Id: string;
  pavadinimas: string;
  tekstas: string;
  sukurimo_data: string;
  redagavimo_data?: string;
  istrynimo_data?: string;
  prikabinta: boolean;
  NaudotojasId: string;
  // Plokšti autoriaus laukai iš backend
  autorius_slapyvardis?: string;
  autorius_nuotrauka?: string;
}

export interface ForumTopicCreateDto {
  pavadinimas: string;
  tekstas: string;
}

export interface ForumTopicUpdateDto {
  pavadinimas?: string;
  tekstas?: string;
}

// Voting / Balsavimas
export interface Voting {
  Id: string;
  balsavimo_pradzia: string;
  balsavimo_pabaiga: string;
  susitikimo_data?: string;
  isrinkta_knyga?: {
    Id: string;
    knygos_pavadinimas: string;
    autorius_vardas?: string;
    virselio_nuotrauka?: string;
    balsu_skaicius: number;
  };
  uzbaigtas: boolean;
  nominuotos_knygos: VotingBook[];
}

export interface VotingBook {
  Id: string;
  knygos_pavadinimas: string;
  autorius_vardas?: string;
  virselio_nuotrauka?: string;
  balsu_skaicius: number;
}

export interface VotingCreateDto {
  balsavimo_pradzia: string;
  balsavimo_pabaiga: string;
  nominuotos_knygos: string[];
}

export interface VoteDto {
  BalsavimasId: string;
  KnygaId: string;
}

// Following / Sekimas
export interface Following {
  NaudotojasId: string;
  AutoriusId: string;
  sekimo_pradzia: string;
  autorius?: Author;
}

export interface FollowDto {
  AutoriusId: string;
}

// Weather Forecast
export interface WeatherForecast {
  oro_prognoze: string;
}

// Book Recommendation (backend grąžina tiesiog Book objektus)
export type BookRecommendation = Book;

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Pagination response from backend
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

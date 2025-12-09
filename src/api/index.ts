// src/api/index.ts
export { api, API_BASE_URL } from './config';
export type { PaginatedResponse } from './config';
export { authService } from './authService';
export { booksService, type BooksQueryParams } from './booksService';
export { authorsService, type AuthorsQueryParams } from './authorsService';
export { reviewsService } from './reviewsService';
export { bookshelfService, type BookshelfQueryParams } from './bookshelfService';
export { nuomoniuForumasService, type TopicsQueryParams } from './nuomoniuForumasService';
export { knyguKlubasService } from './knyguKlubasService';
export { followingService } from './followingService';
export { uploadsService } from './uploadsService';

// src/api/index.ts
export { api, API_BASE_URL } from './config';
export type { PaginatedResponse } from './config';
export { authService } from './authService';
export { booksService, type BooksQueryParams } from './booksService';
export { authorsService, type AuthorsQueryParams } from './authorsService';
export { reviewsService } from './reviewsService';
export { bookshelfService, type BookshelfQueryParams } from './bookshelfService';
export { forumService, type TopicsQueryParams } from './forumService';
export { votingService } from './votingService';
export { followingService } from './followingService';
export { uploadsService } from './uploadsService';

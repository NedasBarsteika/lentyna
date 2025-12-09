// src/mockData.ts - Mock data for development without backend

import type { Book, Author, Review, ForumTopic, ForumComment, BookshelfEntry, BookClubWeek, User, Mood, Genre } from './types';
import { BookshelfStatus, UserRole } from './types';

// Mock Users with passwords for local testing
// Passwords: admin123, editor123, mod123, reader123
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@test.lt',
    role: UserRole.ADMIN,
    createdAt: new Date('2025-01-01')
  },
  {
    id: '2',
    username: 'editor',
    email: 'editor@test.lt',
    role: UserRole.EDITOR,
    createdAt: new Date('2025-01-02')
  },
  {
    id: '3',
    username: 'moderator',
    email: 'moderator@test.lt',
    role: UserRole.MODERATOR,
    createdAt: new Date('2025-01-03')
  },
  {
    id: '4',
    username: 'reader',
    email: 'reader@test.lt',
    role: UserRole.READER,
    createdAt: new Date('2025-01-04')
  }
];

// Mock passwords for testing (in real app, these would be hashed)
export const mockPasswords: Record<string, string> = {
  '1': 'admin123',
  '2': 'editor123',
  '3': 'mod123',
  '4': 'reader123'
};

// Mock Authors
export const mockAuthors: Author[] = [
  {
    id: '1',
    firstName: 'Kristina',
    lastName: 'Sabaliauskaitė',
    biography: 'Kristina Sabaliauskaitė – lietuvių rašytoja, istorikė, meno kritikė. Geriausiai žinoma dėl savo istorinių romanų trilogijos „Silva rerum", kuri pasakoja apie Lietuvos Didžiosios Kunigaikštystės istoriją XVII–XVIII amžiais. Jos kūryba pasižymi kruopščiu istoriniu tikslumu ir gilia personažų psichologine analize.',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  },
  {
    id: '2',
    firstName: 'Ruta',
    lastName: 'Šepetys',
    biography: 'Ruta Šepetys – lietuvių kilmės amerikietė rašytoja, žinoma dėl savo istorinių romanų jaunimui. Jos knygos pasakoja apie mažai žinomas XX amžiaus istorijos tragedijas. „Tarp pilkų debesų" – tarptautiniu mastu pripažintas bestseleris, verčiamas į daugiau nei 60 kalbų.',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  },
  {
    id: '3',
    firstName: 'Tomas',
    lastName: 'Venclova',
    biography: 'Tomas Venclova – vienas žymiausių lietuvių poetų, eseistų, vertėjų ir literatūros kritikų. Disidentas sovietmečiu, emigravęs į JAV. Jo poezija pasižymi filosofiškumu, intertekstualumu ir kruopščia forma. Yra parašęs ne tik poezijos rinkinius, bet ir esė apie lietuvių literatūrą bei istoriją.',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  },
  {
    id: '4',
    firstName: 'Jurga',
    lastName: 'Ivanauskaitė',
    biography: 'Jurga Ivanauskaitė – lietuvių rašytoja, dramaturgė, tapytoja. Jos kūryba pasižymi emocingumu, psichologiniu gilumu ir drąsiu tabu temų nagrinėjimu. Romanai „Ragana ir lietus", „Šešėlių žaidimas" tapo kultiniais lietuvių literatūroje.',
    photoUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  },
  {
    id: '5',
    firstName: 'Marius',
    lastName: 'Ivaškevičius',
    biography: 'Marius Ivaškevičius – vienas populiariausių šiuolaikinių lietuvių rašytojų ir dramaturgų. Jo kūryba pasižymi ironija, socialine kritika ir šiuolaikinio Vilniaus gyvenimo aprašymais. Romanai „Žali" ir „Paskutinė atostogų diena" sulaukė didelio skaitytojų susidomėjimo.',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  }
];

// Mock Moods (Nuotaikos) with associated genres
export const mockMoods: Mood[] = [
  {
    Id: '1',
    pavadinimas: 'Džiugi',
    zanrai: [
      { Id: '2', pavadinimas: 'Lietuvių literatūra' },
      { Id: '8', pavadinimas: 'Šiuolaikinė proza' },
      { Id: '12', pavadinimas: 'Romantiška drama' }
    ]
  },
  {
    Id: '2',
    pavadinimas: 'Liūdna',
    zanrai: [
      { Id: '1', pavadinimas: 'Istorinis romanas' },
      { Id: '4', pavadinimas: 'Jaunimo literatūra' },
      { Id: '5', pavadinimas: 'Karo drama' }
    ]
  },
  {
    Id: '3',
    pavadinimas: 'Neutrali',
    zanrai: [
      { Id: '3', pavadinimas: 'Šeimos saga' },
      { Id: '6', pavadinimas: 'Poezija' },
      { Id: '7', pavadinimas: 'Filosofinė poezija' },
      { Id: '9', pavadinimas: 'Psichologinis romanas' },
      { Id: '10', pavadinimas: 'Maginis realizmas' },
      { Id: '11', pavadinimas: 'Socialinė drama' }
    ]
  }
];

// Mock Genres (Žanrai)
export const mockGenres: Genre[] = [
  {
    Id: '1',
    pavadinimas: 'Istorinis romanas'
  },
  {
    Id: '2',
    pavadinimas: 'Lietuvių literatūra'
  },
  {
    Id: '3',
    pavadinimas: 'Šeimos saga'
  },
  {
    Id: '4',
    pavadinimas: 'Jaunimo literatūra'
  },
  {
    Id: '5',
    pavadinimas: 'Karo drama'
  },
  {
    Id: '6',
    pavadinimas: 'Poezija'
  },
  {
    Id: '7',
    pavadinimas: 'Filosofinė poezija'
  },
  {
    Id: '8',
    pavadinimas: 'Šiuolaikinė proza'
  },
  {
    Id: '9',
    pavadinimas: 'Psichologinis romanas'
  },
  {
    Id: '10',
    pavadinimas: 'Maginis realizmas'
  },
  {
    Id: '11',
    pavadinimas: 'Socialinė drama'
  },
  {
    Id: '12',
    pavadinimas: 'Romantiška drama'
  }
];

// Mock Books
export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Silva rerum I',
    description: 'Pirmoji trilogijos „Silva rerum" knyga, pasakojanti apie Lietuvos Didžiosios Kunigaikštystės bajorų gyvenimą XVII amžiuje. Romanas perša per kelių kartų istoriją, atskleidžiant to meto kasdienybę, politiką ir kultūrą.',
    authorId: '1',
    author: mockAuthors[0],
    publishYear: 2008,
    genreId: '1', // Istorinis romanas
    genre: mockGenres[0],
    coverImageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    averageRating: 4.8,
    reviewCount: 156,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  },
  {
    id: '2',
    title: 'Tarp pilkų debesų',
    description: 'Jaudinanti istorija apie lietuvių mergaitę Liną, kuri kartu su šeima 1941 metais buvo ištremta į Sibirą. Romanas atskleidžia totalitarizmo aukų kančias ir nenugalimą žmogaus dvasią. Tarptautinis bestseleris, skaitytas milijonų visame pasaulyje.',
    authorId: '2',
    author: mockAuthors[1],
    publishYear: 2011,
    genreId: '5', // Karo drama
    genre: mockGenres[4],
    coverImageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    averageRating: 4.9,
    reviewCount: 342,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  },
  {
    id: '3',
    title: 'Rinktinė',
    description: 'Tomo Venclovos poezijos rinktinė, apimanti keletą dešimtmečių kūrybą. Eilėraščiai nagrinėja filosofines temas, istoriją, tremtį ir atminties svarbą. Vertinga skaitymui visiems lietuvių poezijos mylėtojams.',
    authorId: '3',
    author: mockAuthors[2],
    publishYear: 2015,
    genreId: '7', // Filosofinė poezija
    genre: mockGenres[6],
    coverImageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
    averageRating: 4.6,
    reviewCount: 89,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  },
  {
    id: '4',
    title: 'Ragana ir lietus',
    description: 'Kultinis Jurgos Ivanauskaitės romanas apie jauną moterį, ieškančią savęs ir gyvenimo prasmės. Knyga kupina magijos, filosofijos ir psichologinio gylio. Tapo viena įtakingiausių lietuvių literatūros kūrinių jaunajai kartai.',
    authorId: '4',
    author: mockAuthors[3],
    publishYear: 1993,
    genreId: '10', // Maginis realizmas
    genre: mockGenres[9],
    coverImageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
    averageRating: 4.5,
    reviewCount: 234,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  },
  {
    id: '5',
    title: 'Žali',
    description: 'Mariaus Ivaškevičiaus romanas apie šiuolaikinio Vilniaus jaunimą, jų svajas, nusivylimus ir paieškos. Ironiškas, kartais žiaurus, bet visada teisingas dabartinės lietuvių realybės vaizdas.',
    authorId: '5',
    author: mockAuthors[4],
    publishYear: 2002,
    genreId: '11', // Socialinė drama
    genre: mockGenres[10],
    coverImageUrl: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=400',
    averageRating: 4.3,
    reviewCount: 167,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  },
  {
    id: '6',
    title: 'Silva rerum II',
    description: 'Antroji trilogijos dalis, tęsianti Lietuvos bajorų šeimų istoriją. Romanas giliau atskleidžia to meto visuomenės sluoksnius, intrigas ir kultūrinį gyvenimą.',
    authorId: '1',
    author: mockAuthors[0],
    publishYear: 2011,
    genreId: '1', // Istorinis romanas
    genre: mockGenres[0],
    coverImageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400',
    averageRating: 4.8,
    reviewCount: 142,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  },
  {
    id: '7',
    title: 'Druskos namai',
    description: 'Rutas Šepetys romanas apie Antrojo pasaulinio karo metų tragiškus įvykius Rytų Prūsijoje. Pasakojimas apie jauną mergaitę, kuri bando išgyventi karo chaose.',
    authorId: '2',
    author: mockAuthors[1],
    publishYear: 2016,
    genreId: '5', // Karo drama
    genre: mockGenres[4],
    coverImageUrl: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=400',
    averageRating: 4.7,
    reviewCount: 298,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  },
  {
    id: '8',
    title: 'Paskutinė atostogų diena',
    description: 'Mariaus Ivaškevičiaus romanas, kuriame susipina kelios istorijos apie meilę, išdavystes ir gyvenimo pasirinkimus. Lengva, bet kartu gili proza apie šiuolaikinio žmogaus egzistenciją.',
    authorId: '5',
    author: mockAuthors[4],
    publishYear: 2009,
    genreId: '12', // Romantiška drama
    genre: mockGenres[11],
    coverImageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400',
    averageRating: 4.4,
    reviewCount: 189,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  }
];

// Update authors with their books
mockAuthors[0].books = [mockBooks[0], mockBooks[5]];
mockAuthors[1].books = [mockBooks[1], mockBooks[6]];
mockAuthors[2].books = [mockBooks[2]];
mockAuthors[3].books = [mockBooks[3]];
mockAuthors[4].books = [mockBooks[4], mockBooks[7]];

// Mock Reviews
export const mockReviews: Review[] = [
  {
    id: '1',
    bookId: '1',
    userId: '1',
    user: mockUsers[0],
    text: 'Nuostabi knyga! Labai detalus istorinis aprašymas, jaučiasi tarsi pats gyventum tuo laikotarpiu. Rekomenduoju visiems istorijos mylėtojams.',
    rating: 5,
    isAiGenerated: false,
    createdAt: new Date('2025-10-15'),
    updatedAt: new Date('2025-10-15')
  },
  {
    id: '2',
    bookId: '1',
    userId: '3',
    user: mockUsers[2],
    text: 'Įtraukiantis istorinis romanas. Kristina Sabaliauskaitė puikiai perteikia to meto atmosferą ir žmonių gyvenimą. Verta skaityti visą trilogiją!',
    rating: 5,
    isAiGenerated: false,
    createdAt: new Date('2025-10-20'),
    updatedAt: new Date('2025-10-20')
  },
  {
    id: 'ai-1',
    bookId: '1',
    userId: '0',
    text: 'Remiantis skaitytojų komentarais, "Silva rerum I" yra puikiai parašytas istorinis romanas, pasižymintis kruopščiu istoriniu tikslumu ir įtraukiančiu pasakojimu. Daugelis skaitytojų ypač vertina detalų XVII amžiaus Lietuvos gyvenimo aprašymą ir personažų charakterių gilumą. Rekomenduojama istorinės literatūros mylėtojams.',
    rating: 5,
    isAiGenerated: true,
    createdAt: new Date('2025-10-25'),
    updatedAt: new Date('2025-10-25')
  },
  {
    id: '3',
    bookId: '2',
    userId: '1',
    user: mockUsers[0],
    text: 'Labai jaudinanti istorija. Skaitant riedėjo ašaros. Tai knyga, kurią privalo perskaityti kiekvienas lietuvis.',
    rating: 5,
    isAiGenerated: false,
    createdAt: new Date('2025-09-10'),
    updatedAt: new Date('2025-09-10')
  },
  {
    id: '4',
    bookId: '2',
    userId: '2',
    user: mockUsers[1],
    text: 'Neįtikėtinai stipri knyga. Ruta Šepetys sugebėjo perteikti tą baisų laikotarpį taip, kad skaitytojas jaučia viską kartu su herojais.',
    rating: 5,
    isAiGenerated: false,
    createdAt: new Date('2025-09-15'),
    updatedAt: new Date('2025-09-15')
  },
  {
    id: 'ai-2',
    bookId: '2',
    userId: '0',
    text: 'Skaitytojai vieningai sutaria, kad "Tarp pilkų debesų" yra emocionali ir galinga knyga, kuri labai tiksliai perteikia tremtinių patirtį. Daugelis pažymi, kad knyga juos sujaudino iki ašarų. Būtina knyga kiekvienam, norinčiam suprasti Lietuvos istoriją ir žmogaus ištvermes ribas.',
    rating: 5,
    isAiGenerated: true,
    createdAt: new Date('2025-09-20'),
    updatedAt: new Date('2025-09-20')
  },
  {
    id: '5',
    bookId: '4',
    userId: '3',
    user: mockUsers[2],
    text: 'Kultinė knyga! Skaičiau jau kelis kartus ir kaskart atrandu naujų prasmių. Jurga – tikra lietuvių literatūros legenda.',
    rating: 5,
    isAiGenerated: false,
    createdAt: new Date('2025-10-01'),
    updatedAt: new Date('2025-10-01')
  },
  {
    id: '6',
    bookId: '5',
    userId: '1',
    user: mockUsers[0],
    text: 'Įdomus šiuolaikinio Vilniaus gyvenimo aprašymas. Kartais per daug ciniškas, bet apskritai gera knyga.',
    rating: 4,
    isAiGenerated: false,
    createdAt: new Date('2025-10-12'),
    updatedAt: new Date('2025-10-12')
  }
];

// Mock Bookshelf Entries
export const mockBookshelfEntries: BookshelfEntry[] = [
  {
    id: '1',
    userId: '1',
    bookId: '2',
    book: mockBooks[1],
    status: BookshelfStatus.READ,
    addedAt: new Date('2025-09-01')
  },
  {
    id: '2',
    userId: '1',
    bookId: '1',
    book: mockBooks[0],
    status: BookshelfStatus.READING,
    addedAt: new Date('2025-10-15')
  },
  {
    id: '3',
    userId: '1',
    bookId: '6',
    book: mockBooks[5],
    status: BookshelfStatus.WANT_TO_READ,
    addedAt: new Date('2025-10-20')
  },
  {
    id: '4',
    userId: '1',
    bookId: '4',
    book: mockBooks[3],
    status: BookshelfStatus.READ,
    addedAt: new Date('2025-08-10')
  },
  {
    id: '5',
    userId: '1',
    bookId: '7',
    book: mockBooks[6],
    status: BookshelfStatus.WANT_TO_READ,
    addedAt: new Date('2025-10-22')
  }
];

// Mock Forum Topics
export const mockForumTopics: ForumTopic[] = [
  {
    id: '1',
    title: 'Knygų klubas - 43 savaitė',
    description: 'Šią savaitę renkamės knygą gyviems diskusijoms! Susitikimas vyks spalio 30d. Balsuokite už knygą žemiau.',
    authorId: '4',
    author: mockUsers[3],
    isPinned: true,
    commentCount: 45,
    createdAt: new Date('2025-10-21'),
    updatedAt: new Date('2025-10-21')
  },
  {
    id: '2',
    title: 'Jūsų mėgstamiausi lietuvių autoriai?',
    description: 'Norėčiau sužinoti, kokie lietuvių autoriai jums labiausiai patinka ir kodėl. Gal galėtume pasidalinti rekomendacijomis?',
    authorId: '1',
    author: mockUsers[0],
    isPinned: false,
    commentCount: 23,
    createdAt: new Date('2025-10-18'),
    updatedAt: new Date('2025-10-18')
  },
  {
    id: '3',
    title: 'Istoriniai romanai - kas verta dėmesio?',
    description: 'Ieškau gerų istorinių romanų. Ką rekomenduotumėte? Ypač domina Lietuvos istorija.',
    authorId: '2',
    author: mockUsers[1],
    isPinned: false,
    commentCount: 17,
    createdAt: new Date('2025-10-16'),
    updatedAt: new Date('2025-10-16')
  },
  {
    id: '4',
    title: 'Knygų mugė Vilniuje - kas lankysis?',
    description: 'Vasario mėnesį vyks kasmetinė knygų mugė. Planuoju aplankyti - gal kas nors norėtų susitikti?',
    authorId: '3',
    author: mockUsers[2],
    isPinned: false,
    commentCount: 12,
    createdAt: new Date('2025-10-10'),
    updatedAt: new Date('2025-10-10')
  }
];

// Mock Forum Comments
export const mockForumComments: ForumComment[] = [
  {
    id: '1',
    topicId: '2',
    authorId: '2',
    author: mockUsers[1],
    text: 'Man labiausiai patinka Kristina Sabaliauskaitė. Jos "Silva rerum" serija - tiesiog šedevras!',
    createdAt: new Date('2025-10-19'),
    updatedAt: new Date('2025-10-19')
  },
  {
    id: '2',
    topicId: '2',
    authorId: '3',
    author: mockUsers[2],
    text: 'Sutinku! Dar pridėčiau Marių Ivaškevičių - jo stilius labai unikalus.',
    createdAt: new Date('2025-10-19'),
    updatedAt: new Date('2025-10-19')
  },
  {
    id: '3',
    topicId: '3',
    authorId: '1',
    author: mockUsers[0],
    text: 'Rekomenduoju "Silva rerum" trilogiją ir Rutas Šepetys knygas. Abi labai įtraukiančios!',
    createdAt: new Date('2025-10-17'),
    updatedAt: new Date('2025-10-17')
  }
];

// Mock Book Club Week
export const mockBookClubWeek: BookClubWeek = {
  id: '1',
  weekNumber: 43,
  year: 2025,
  nominatedBooks: [
    { id: '1', weekId: '1', bookId: '1', book: mockBooks[0], voteCount: 15 },
    { id: '2', weekId: '1', bookId: '2', book: mockBooks[1], voteCount: 23 },
    { id: '3', weekId: '1', bookId: '4', book: mockBooks[3], voteCount: 18 },
    { id: '4', weekId: '1', bookId: '5', book: mockBooks[4], voteCount: 12 },
    { id: '5', weekId: '1', bookId: '7', book: mockBooks[6], voteCount: 9 }
  ],
  meetingDate: new Date('2025-10-30T18:00:00'),
  weatherForecast: {
    date: new Date('2025-10-30'),
    temperature: 8,
    description: 'Debesuota, galimas lietus',
    willRain: true,
    recommendation: 'indoor'
  },
  createdAt: new Date('2025-10-21')
};

// Mock Book Recommendations
export const mockRecommendations = [
  {
    book: mockBooks[5],
    score: 95,
    reason: 'Skaičiau pirmąją "Silva rerum" dalį - tau patiks ir antroji!'
  },
  {
    book: mockBooks[6],
    score: 90,
    reason: 'Mėgsti Rutas Šepetys - šis jos kūrinys tau tikrai patiks'
  },
  {
    book: mockBooks[7],
    score: 85,
    reason: 'Panašus stilius kaip "Žali" - lengva ir įtraukianti proza'
  }
];

// Helper function to get current user (for demo purposes)
export const getCurrentUser = (): User => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch {
      return mockUsers[0]; // Default to first user
    }
  }
  return mockUsers[0]; // Default to first user
};

// Helper to simulate login (accepts username OR email)
export const mockLogin = (usernameOrEmail: string, password: string) => {
  // Find user by username or email
  const user = mockUsers.find(u =>
    u.username === usernameOrEmail || u.email === usernameOrEmail
  );

  // Check if user exists and password matches
  if (user && mockPasswords[user.id] === password) {
    const token = 'mock-jwt-token-' + user.id;
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    return { success: true, user, token };
  }
  return { success: false, error: 'Neteisingas slapyvardis/el. paštas arba slaptažodis' };
};

// Helper to simulate registration
export const mockRegister = (username: string, email: string, password: string) => {
  // Check if username already exists
  if (mockUsers.some(u => u.username === username)) {
    return { success: false, error: 'Toks slapyvardis jau egzistuoja' };
  }

  // Check if email already exists
  if (mockUsers.some(u => u.email === email)) {
    return { success: false, error: 'Toks el. paštas jau užregistruotas' };
  }

  // Create new user
  const newUserId = String(mockUsers.length + 1);
  const newUser: User = {
    id: newUserId,
    username,
    email,
    role: UserRole.READER,
    createdAt: new Date()
  };

  // Add user to mock data
  mockUsers.push(newUser);
  mockPasswords[newUserId] = password;

  return { success: true, user: newUser };
};

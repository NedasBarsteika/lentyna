# Lentyna - Knygų Vertinimo Sistema

Knygų vertinimui ir nuomonių dalinimuisi skirta svetainė. Sistema leidžia naudotojams dalintis nuomone apie knygas, rašyti atsiliepimus, kurti asmeninius knygų sąrašus ir atrasti bendraminčius per forumo diskusijas.

## Pagrindinės Funkcijos

### 📚 Knygų Valdymas
- Knygų katalogas su paieška ir filtrais
- Išplėstinė paieška pagal žanrą, nuotaiką
- Knygos informacija: aprašymas, autorius, leidimo metai, žanrai
- Redaktoriai gali kurti, redaguoti ir trinti knygas

### ✍️ Autorių Valdymas
- Autorių profiliai su biografijomis
- Autorių knygų sąrašai
- Galimybė pažymėti mėgstamus autorius
- El. pašto pranešimai apie naujus autorių kūrinius

### ⭐ Atsiliepimų Sistema
- Naudotojai gali rašyti atsiliepimus ir vertinti knygas (1-5 žvaigždutės)
- Dirbtinio intelekto sugeneruotas apibendrintas atsiliepimas
- Viešas atsiliepimų peržiūra visiems

### 📖 Knygų Sąrašas (Bookshelf)
- Asmeninis knygų sąrašas su kategorijomis:
  - Perskaitytos
  - Skaitomos
  - Norimos perskaityti
- Rekomendacijos pagal skaitytų knygų preferencijas

### 💬 Forumas
- Diskusijų temos
- Knygų klubo savaitinė tema:
  - Balsavimas už populiariausias knygas
  - Gyvo susitikimo data
  - Oro prognozė KTU miesteliui
- Moderatoriai prižiūri turinį

## Naudotojų Rolės

- **Administratoriai** - visos sistemos teisės
- **Moderatoriai** - forumo priežiūra
- **Redaktoriai** - knygų ir autorių valdymas
- **Skaitytojai** - registruoti naudotojai (atsiliepimų rašymas, bookshelf, forumas)
- **Lankytojai** - peržiūra be registracijos

## Technologijos

### Frontend
- **React 19** - UI biblioteka
- **TypeScript** - tipizacija
- **Vite** - build tool
- **React Router DOM** - navigacija
- **Tailwind CSS** - stiliai
- **Framer Motion** - animacijos
- **Axios** - HTTP užklausos

### Backend API
- Base URL: `https://localhost:7296/`

## Projekto Struktūra

```
lentyna/
├── src/
│   ├── components/          # Bendri komponentai
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Card.tsx
│   │   └── NavbarOnlyLogo.tsx
│   ├── pages/               # Puslapiai
│   │   ├── home.tsx
│   │   ├── login.tsx
│   │   ├── signUp.tsx
│   │   ├── books/           # Knygų posistemė
│   │   │   ├── BooksPage.tsx
│   │   │   ├── BookDetailsPage.tsx
│   │   │   └── BookFormPage.tsx
│   │   ├── authors/         # Autorių posistemė
│   │   │   ├── AuthorsPage.tsx
│   │   │   ├── AuthorDetailsPage.tsx
│   │   │   └── AuthorFormPage.tsx
│   │   ├── reviews/         # Atsiliepimų sistema
│   │   │   └── ReviewFormPage.tsx
│   │   ├── bookshelf/       # Knygų sąrašas
│   │   │   └── BookshelfPage.tsx
│   │   └── forum/           # Forumas
│   │       ├── ForumPage.tsx
│   │       ├── TopicDetailsPage.tsx
│   │       └── TopicFormPage.tsx
│   ├── types/               # TypeScript tipai
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── public/
├── claude.md                # Pilnas sistemos aprašymas
├── package.json
└── README.md
```

## Instaliacija ir Paleidimas

### Reikalavimai
- Node.js 18+
- npm arba yarn

### Žingsniai

1. **Klonuoti projektą**
```bash
git clone <repository-url>
cd lentyna
```

2. **Įdiegti priklausomybes**
```bash
npm install
```

3. **Paleisti development serverį**
```bash
npm run dev
```

Projektas bus pasiekiamas adresu: `http://localhost:5173`

4. **Build production**
```bash
npm run build
npm run preview
```

## Konfigūracija

### Backend API URL
Backend API URL galite pakeisti kiekviename puslapyje, kur naudojamas axios. Dabartinis URL: `https://localhost:7296/`

### Autentifikacija
Sistema naudoja JWT tokenus, kurie saugomi `localStorage`:
- `authToken` - JWT tokenas
- `user` - naudotojo informacija (name, surname, role, etc.)

## API Endpoint'ai

### Naudotojai
- `POST /user/register` - Registracija
- `POST /user/login` - Prisijungimas

### Knygos
- `GET /api/books` - Knygų sąrašas
- `GET /api/books/:id` - Knygos detalės
- `POST /api/books` - Sukurti knygą (Redaktorius)
- `PUT /api/books/:id` - Atnaujinti knygą (Redaktorius)
- `DELETE /api/books/:id` - Ištrinti knygą (Redaktorius)

### Autoriai
- `GET /api/authors` - Autorių sąrašas
- `GET /api/authors/:id` - Autoriaus detalės
- `POST /api/authors` - Sukurti autorių (Redaktorius)
- `PUT /api/authors/:id` - Atnaujinti autorių (Redaktorius)
- `DELETE /api/authors/:id` - Ištrinti autorių (Redaktorius)

### Atsiliepimai
- `GET /api/reviews/book/:bookId` - Knygos atsiliepimai
- `POST /api/reviews` - Sukurti atsiliepimą
- `DELETE /api/reviews/:id` - Ištrinti atsiliepimą

### Bookshelf
- `GET /api/bookshelf` - Naudotojo knygų sąrašas
- `POST /api/bookshelf` - Pridėti knygą į sąrašą
- `PUT /api/bookshelf/:id` - Atnaujinti statusą
- `DELETE /api/bookshelf/:id` - Pašalinti knygą

### Forumas
- `GET /api/forum/topics` - Temų sąrašas
- `GET /api/forum/topics/:id` - Temos detalės
- `POST /api/forum/topics` - Sukurti temą
- `DELETE /api/forum/topics/:id` - Ištrinti temą
- `GET /api/forum/topics/:id/comments` - Temos komentarai
- `POST /api/forum/comments` - Sukurti komentarą
- `DELETE /api/forum/comments/:id` - Ištrinti komentarą

### Knygų Klubas
- `GET /api/bookclub/current` - Dabartinė savaitė
- `POST /api/bookclub/vote` - Balsuoti už knygą

### Mėgstami Autoriai
- `GET /api/favorite-authors/check/:authorId` - Patikrinti statusą
- `POST /api/favorite-authors` - Pridėti į mėgstamus
- `DELETE /api/favorite-authors/:authorId` - Pašalinti iš mėgstamų

## Tolesnė Plėtra

### Siūlomos funkcijos:
1. Pranešimų sistema (notifications)
2. Naudotojų profilių puslapiai
3. Socialinė sąveika (draugų sistema)
4. Knygų reitingų TOP sąrašai
5. Išplėstinė paieška su AI
6. Knygų citatos ir jų bendrinimas
7. Knygų recenzijų eksportas
8. Mobile aplikacija

## Licencija

© 2025 Lentyna.lt - Visos teisės saugomos

## Kontaktai

Jei turite klausimų ar pasiūlymų, susisiekite per sistemos administratorius.

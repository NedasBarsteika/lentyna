# Lentyna - Knygų Vertinimo Sistema

## Sistemos Aprašymas

Kuriama sistema - knygų vertinimui ir nuomonių dalinimuisi skirta svetainė. Svetainė skirta asmenims, norintiems dalintis nuomone apie knygas, rašyti atsiliepimus, ir atrasti bendraminčius.

## Naudotojų Tipai

Sistemoje egzistuoja keturi naudotojų tipai su skirtingomis prieigos teisėmis:

### 1. Administratoriai
- Prieiga prie visų sistemos funkcijų
- Gali tvarkyti visus naudotojus ir jų roles
- Gali trinti bet kokį turinį

### 2. Moderatoriai
- Prižiūri forumo tvarką
- Gali trinti netinkamas temas ir komentarus
- Prižiūri išreikštų nuomonių etiškumą

### 3. Redaktoriai
- Kuria, redaguoja, trina knygų įrašus
- Tvarko autorių profilius ir biografijas
- Prižiūri informacijos apie knygas ir autorius tikslumą

### 4. Skaitytojai (registruoti naudotojai)
- Rašo atsiliepimus apie knygas
- Kuria savo knygų sąrašus (bookshelf)
- Dalyvauja forume
- Gali pažymėti mėgstamus autorius
- Gauna rekomendacijas

### Neregistruoti lankytojai
- Gali peržiūrėti viešai prieinamą informaciją
- Negali rašyti atsiliepimų ar dalyvauti forume

## Registracija ir Autentifikacija

- Registracijai reikalingas el. paštas ir slapyvardis
- Naujiems naudotojams automatiškai priskiriamas "Skaitytojo" statusas
- Statusas gali būti pakeistas administratorių į Moderatorių, Redaktorių ar Administratorių
- Kiekvienas naudotojas gali tvarkyti ir ištrinti savo profilį

## Posistemės

### 1. Knygų Valdymas

**Funkcionalumas:**
- Knygų įrašų kūrimas (redaktoriai)
- Informacija: pavadinimas, aprašymas, autorius, leidimo metai, žanrai
- Redagavimas, peržiūra, trynimas
- Viešas peržiūra visiems lankytojams

**Išplėstinė Paieška:**
- Paieška pagal scenarijaus aprašymą
- Filtravimas pagal žanrus
- Paieška pagal knygos nuotaiką:
  - Liūdna (gali pravirkdyti, nuliūdinti)
  - Džiugi (pakelia nuotaiką, sukelia geras emocijas)
  - Neutrali

**Teisės:**
- Redaktoriai: CRUD operacijos
- Skaitytojai ir lankytojai: tik peržiūra

### 2. Autorių Valdymas

**Autoriaus profilis apima:**
- Biografiją
- Parašytų knygų sąrašą
- Populiariausias kūrinių citatas
- Autoriaus nuotrauką/avatarą

**Funkcionalumas:**
- Profilių kūrimas ir redagavimas (redaktoriai)
- Viešas peržiūra visiems
- Mėgstamų autorių pažymėjimas (registruoti naudotojai)
- Pranešimai el. paštu apie naujus autoriaus kūrinius

**Teisės:**
- Redaktoriai ir administratoriai: CRUD operacijos
- Visi naudotojai: peržiūra
- Registruoti naudotojai: gali pažymėti mėgstamus autorius

### 3. Knygų Atsiliepimų Valdymas

**Funkcionalumas:**
- Atsiliepimų rašymas po kiekviena knyga (registruoti naudotojai)
- Atsiliepimų redagavimas ir trynimas (autorius ir administratoriai)
- Viešas atsiliepimų peržiūra

**Dirbtinio Intelekto Atsiliepimas:**
- Automatiškai generuojamas apibendrintas atsiliepimas
- Atspindi daugumos pateiktą nuomonę
- Padeda naudotojams greičiau apsispręsti

**Teisės:**
- Registruoti naudotojai: kurti, redaguoti, trinti savo atsiliepimus
- Administratoriai: gali trinti bet kokius atsiliepimus
- Visi: peržiūra

### 4. Knygų Sąrašo (Bookshelf) Valdymas

**Knygų kategorijos:**
- Perskaitytos knygos
- Skaitomos knygos
- Norimos perskaityti knygos

**Funkcionalumas:**
- Asmeninio knygų sąrašo kūrimas
- Knygų pridėjimas į skirtingas kategorijas
- Sąrašo redagavimas ir įrašų trynimas
- Knygų rekomendacijos pagal:
  - Perskaitytų knygų žanrus
  - Mėgstamus autorius
  - Siužeto pobūdį

**Teisės:**
- Tik registruoti naudotojai
- Kiekvienas naudotojas mato tik savo sąrašą

### 5. Nuomonių Forumo Valdymas

**Funkcionalumas:**
- Naujų temų kūrimas (registruoti naudotojai)
- Temų redagavimas/trynimas (temų autoriai)
- Komentarų rašymas temose
- Moderavimas (moderatoriai gali trinti bet kokias temas)

**Knygų Klubo Tema (Nuolatinė):**
- Visada prikabinta viršuje
- Kas savaitę skelbiamos 5 populiariausios knygos
- Naudotojų balsavimas už norimą aptarti knygą
- Gyvo susitikimo data
- Oro sąlygų prognozė KTU miesteliui susitikimo datai
- Padeda nuspręsti ar susitikti lauke ar viduje

**Teisės:**
- Registruoti naudotojai: kurti temas, rašyti komentarus
- Moderatoriai: gali trinti bet kokias temas ir komentarus
- Administratoriai: visos teisės
- Lankytojai: tik peržiūra

## Navigacija

Pagrindiniame meniu:
- **Knygos** - knygų katalogas ir paieška
- **Autoriai** - autorių sąrašas ir profiliai
- **Knygų sąrašas** - naudotojo asmeninis sąrašas
- **Forumas** - diskusijos ir knygų klubas

Papildoma navigacija:
- Atsiliepimus galima pasiekti per knygos detalių puslapį
- Autoriaus knygas galima pasiekti per autoriaus profilį
- Knygą galima pridėti į sąrašą iš knygos detalių puslapio

## Techninė Informacija

**Frontend:**
- React 19 su TypeScript
- Vite build tool
- Tailwind CSS stiliai
- React Router navigacijai
- Framer Motion animacijoms
- Axios HTTP užklausoms

**Autentifikacija:**
- JWT tokenai
- localStorage token saugojimas
- Rolių sistema

**Backend API:**
- Base URL: https://localhost:7296/

## Duomenų Struktūros

### Knyga
- ID
- Pavadinimas
- Aprašymas
- Autorius (ID)
- Leidimo metai
- Žanrai (array)
- Nuotaika (enum: džiugi/liūdna/neutrali)
- Viršelio nuotrauka

### Autorius
- ID
- Vardas
- Pavardė
- Biografija
- Nuotrauka
- Knygų sąrašas

### Atsiliepimas
- ID
- Knygos ID
- Naudotojo ID
- Tekstas
- Įvertinimas (1-5 žvaigždutės)
- Data
- DI generuotas (boolean)

### Knygų Sąrašo Įrašas
- ID
- Naudotojo ID
- Knygos ID
- Statusas (enum: perskaitytos/skaitomos/norimos)
- Pridėjimo data

### Forumo Tema
- ID
- Pavadinimas
- Aprašymas
- Autorius (naudotojo ID)
- Sukūrimo data
- Prikabinta (boolean)
- Komentarų skaičius

### Komentaras
- ID
- Temos ID
- Autorius (naudotojo ID)
- Tekstas
- Data

### Knygų Klubo Balsavimas
- ID
- Savaitės ID
- Knygos ID (5 knygos)
- Balsų skaičius kiekvienai knygai
- Susitikimo data
- Oro prognozė

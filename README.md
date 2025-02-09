
# GameVault: A Digital Marketplace and Top-Up Store

![image](https://github.com/user-attachments/assets/717c878e-ec3b-4b10-bc01-94186035c0ff)


## Description
**GameVault** is a web-based platform where users can purchase video games, top-up in-game currencies, and explore game details. The platform integrates external APIs (like Steam and RAWG) to fetch game data while utilizing a custom backend for user management, transactions, and digital purchases.

## Scope
GameVault is a digital marketplace and top-up store for gamers, providing seamless access to game purchases and in-game currency. It consists of two core modules:
- **Marketplace Module**: Allows users to browse, purchase, and review video games.
- **Top-Up Module**: Enables users to buy in-game currency and digital codes for various platforms.

## Tech Stack
- **Backend**: Express, MongoDB, NodeJS
- **Frontend**: React, Vite, JavaScript, Chakra UI, Tailwind CSS

## Features
### User
- Browse and purchase games from a variety of platforms
- Top-up in-game currencies and digital codes
- User authentication and transaction history
- Game reviews and ratings
- Seamless integration with external APIs (Steam, RAWG)
### Admin(s)
- Add Games to Store
- View Purchases & Ratings
- Customer Support 

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd GameVault
```

### 2. Backend Setup

- Go to the `Express-Backend` folder

```bash
cd Express-Backend
```

- Install dependencies

```bash
npm install
```

- Set up environment variables (e.g., API keys, MongoDB connection string, contact @mariathv in case of any issue)

- Start the backend server

```bash
node app.js
```

### 3. Frontend Setup

- Go to the `React-Frontend` folder

```bash
cd React-Frontend
```

- Install dependencies

```bash
npm install
```

- Start the frontend development server

```bash
npm run dev
```

The web application will be running at `http://localhost:5173`.

## Documentation & Resources

- **Chakra UI** - A simple, modular, and accessible component library for React:  
[Chakra UI Docs](https://v2.chakra-ui.com/)

- **Tailwind CSS* - A utility-first CSS framework for rapidly building modern websites
[TailwindCSS](https://tailwindcss.com/)

- **Font Awesome** - Icon library used for design elements:  
[Font Awesome](https://fontawesome.com/)

- **IGDB** - Database API for fetching Game Data:
[IGDB](https://www.igdb.com/api)

## Collaborators

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

This project is licensed under the MIT License.



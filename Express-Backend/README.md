
# GameVault Backend

Welcome to the GameVault backend! This repository contains the server-side code for handling game-related functionalities, such as searching, filtering, and managing games from multiple sources. We utilize external APIs (Steam, IGDB) and our own custom backend service (GameVault & Kguysh-GameVault) to provide an enriched gaming experience.

## Table of Contents
- [API Overview](#api-overview)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## API Overview

This project leverages the following APIs:

### 1. **Steam API**

The Steam API provides access to the game list and additional information about games available on Steam. We use the `ISteamApps/GetAppList/v2/` endpoint to fetch a comprehensive list of games and their respective Steam App IDs.

- **Base URL**: `https://api.steampowered.com/ISteamApps/GetAppList/v2/`
- **Use Case**: Fetches all games and their respective Steam App IDs. We filter these games based on search queries and display them accordingly.

### 2. **IGDB (Internet Game Database)**

The IGDB API offers detailed game information including descriptions, genres, release dates, and more. IGDB provides richer metadata about games, which can be useful for better filtering and displaying game data.

- **Base URL**: `https://api.igdb.com/v4/games`
- **Use Case**: Used for fetching additional game details that are not available from the Steam API, such as genres, descriptions, release dates, and platform support.

### 3. **GameVault & Kguysh-GameVault (Our Custom Backend)**

Our own custom backend serves as a middleware to interact with both external APIs (Steam & IGDB), filter and process the game data, and serve it to the frontend. This backend helps in managing and storing data for searching, displaying, and sorting game information.

- **Base URL**: The backend runs on `localhost:5000` (or your preferred port for local development).

---

## Technologies

This backend is built using the following technologies:

- **Node.js**: JavaScript runtime for building server-side applications.
- **Express.js**: Web framework for building REST APIs.
- **CORS**: Middleware for enabling Cross-Origin Resource Sharing.
- **dotenv**: To load environment variables from a `.env` file for sensitive information.
- **axios**: For making HTTP requests to external APIs like Steam and IGDB.
- **Nodemon**: For auto-reloading during development.

---

## Installation

Follow these steps to get the backend up and running:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/gamevault-backend.git
   cd gamevault-backend
   ```

2. **Install dependencies**:
   Make sure you have Node.js installed. Then run the following command:
   ```bash
   npm install
   ```

   This will install all necessary backend packages, including:
   - `express`
   - `dotenv`
   - `cors`
   - `axios`
   - `nodemon` (for development)

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add the necessary environment variables:
   ```env
   STEAM_API_KEY=your_steam_api_key
   IGDB_CLIENT_ID=your_igdb_client_id
   IGDB_CLIENT_SECRET=your_igdb_client_secret
   PORT=5000
   ```

   Make sure to replace `your_steam_api_key`, `your_igdb_client_id`, and `your_igdb_client_secret` with your actual credentials.

---

## Usage

1. **Start the server**:
   After installing the dependencies and setting up your environment variables, you can start the server using:

   ```bash
   npm run dev
   ```

   This will start the server on `http://localhost:5000`.

2. **API requests**:
   You can now send requests to the various API endpoints exposed by the backend. For example:

   - `GET /games/search?search_query=<game_name>`: Search for a game using a search term.
   - The server will interact with the Steam and IGDB APIs to return relevant data based on your query.

---

## API Endpoints

### 1. `GET /games/search`
- **Description**: Searches for games based on the provided query.
- **Query Parameters**:
  - `search_query`: The search term to filter games by name.
- **Response**:
  - Returns a list of games that match the search query, sorted by relevance.
  - Includes game details like name, description, and Steam App ID.

**Example Request**:
```http
GET http://localhost:5000/games/search?search_query=gta
```

---

## Environment Variables

- `STEAM_API_KEY`: Your Steam API key for accessing Steam data.
- `IGDB_CLIENT_ID`: Your client ID for IGDB API access.
- `IGDB_CLIENT_SECRET`: Your client secret for IGDB API access.
- `PORT`: Port number for your backend server (default is 5000).

---

## Contributing

We welcome contributions to the GameVault backend! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature/your-feature`).
6. Open a pull request.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

### Additional Notes:
- **Error Handling**: The backend includes error handling for API calls to Steam and IGDB. If there are issues with fetching data from these services, proper error messages will be returned to the client.
- **Rate Limiting**: To prevent hitting the rate limits of external APIs, we may need to implement caching or delay mechanisms if necessary.

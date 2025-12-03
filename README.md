# Multiplayer Pixel Arena

A real-time multiplayer battle royale game featuring retro pixel art graphics. Players can join lobbies, battle in an arena, and compete for the top spot on the leaderboard.

## Features

- **Real-time Multiplayer**: Powered by Socket.io for low-latency gameplay.
- **Lobby System**: Create or join rooms to play with friends.
- **Leaderboard**: Track top players and scores.
- **Pixel Art Graphics**: Retro aesthetic with smooth animations.
- **Responsive Design**: Playable on various screen sizes.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Vanilla CSS
- **Backend**: Node.js, Express, Socket.io, TypeScript
- **State Management**: React Context API

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- npm (comes with Node.js)

## Installation

1.  **Clone the repository:**

    ```bash
    git clone <your-repo-url>
    cd BATTLE
    ```

2.  **Install Server Dependencies:**

    ```bash
    cd server
    npm install
    ```

3.  **Install Client Dependencies:**

    Open a new terminal window/tab, navigate to the client directory:

    ```bash
    cd ../client
    npm install
    ```

## Running the Application

To run the game locally, you need to start both the server and the client.

### 1. Start the Server

In the `server` directory:

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in your environment).

### 2. Start the Client

In the `client` directory:

```bash
npm run dev
```

The client will start, usually on `http://localhost:5173`. Open this URL in your browser to play.

## Project Structure

-   `client/`: Frontend React application.
    -   `src/components/`: UI components (Lobby, Leaderboard, etc.).
    -   `src/context/`: Game state management.
-   `server/`: Backend Node.js application.
    -   `src/`: Source code for the server and socket logic.

## Contributing

Feel free to submit issues and pull requests.

## License

[MIT](LICENSE)

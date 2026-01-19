# Type Battle 🎮

A real-time multiplayer typing battle game where players compete to type the fastest and most accurately. Featuring a stunning cyberpunk aesthetic with neon effects, glassmorphism, and advanced visual feedback systems.

## 🎯 Game Concept

Type Battle is a competitive typing game that transforms the traditional typing test into an exciting multiplayer experience. Players join rooms, compete in real-time typing challenges, and battle for the top spot on the leaderboard. The game combines skill, speed, and accuracy with an immersive cyberpunk visual experience.

### 🎮 How to Play

1. **Create or Join a Room**: Enter your username, choose an avatar, and either create a new room or join an existing one with a room code.
2. **Get Ready**: Once all players are ready, a 3-second countdown begins.
3. **Type Battle**: Type the displayed text as fast and accurately as possible. Your progress is shown in real-time.
4. **Win Conditions**: 
   - First player to finish 100% of the text wins
   - Or the player with the highest progress when the 60-second timer ends
5. **Results**: View the final leaderboard with WPM (Words Per Minute) and accuracy stats.

## ✨ Key Features

### 🎨 Visual Excellence
- **Cyberpunk Aesthetic**: Neon color scheme with green, cyan, magenta, and gold accents
- **Glassmorphism UI**: Frosted glass effects with backdrop blur
- **Dynamic Particle System**: Floating neon particles with randomized animations
- **Advanced Animations**: Smooth transitions, hover effects, and micro-interactions
- **Visual Feedback**: Click ripples, success bursts, combo indicators, and speed lines

### 🔊 Audio System
- **Web Audio API**: Dynamic sound generation without external audio files
- **Context-Aware Sounds**: Different sounds for clicks, typing, success, errors, and victories
- **Volume Control**: Adjustable audio settings with toggle functionality

### 🎯 Game Mechanics
- **Real-time Multiplayer**: Socket.io powered low-latency gameplay
- **WPM Calculation**: Accurate words-per-minute tracking
- **Progress Visualization**: Real-time progress bars for all players
- **Character-by-Character Feedback**: Color-coded typing feedback (correct/incorrect/current)
- **Room Management**: Create private rooms or join with 6-digit codes

### 🏆 Competitive Features
- **Live Leaderboard**: Real-time ranking of all players in the room
- **Winner Celebrations**: Special animations and effects for the victor
- **Performance Stats**: Detailed WPM and accuracy metrics
- **Combo System**: Visual feedback for consecutive correct characters

## 🛠 Technical Architecture

### Frontend (React + TypeScript)
```
client/
├── src/
│   ├── components/          # React UI components
│   │   ├── Home.tsx        # Main menu and room creation
│   │   ├── Lobby.tsx       # Room lobby and player management
│   │   ├── TypingArea.tsx  # Core typing gameplay
│   │   ├── Leaderboard.tsx # Live rankings display
│   │   ├── Results.tsx     # Game results screen
│   │   ├── Layout.tsx      # App layout and routing
│   │   ├── VisualFeedback.tsx # Particle effects and animations
│   │   └── LoadingStates.tsx # Advanced loading components
│   ├── context/            # State management
│   │   ├── GameContext.tsx # Game state and socket management
│   │   └── SocketContext.tsx # Socket.io connection
│   ├── utils/              # Utility functions
│   │   └── SoundManager.ts # Web Audio API sound system
│   └── types.ts            # TypeScript type definitions
```

### Backend (Node.js + TypeScript + Socket.io)
```
server/
├── src/
│   ├── index.ts            # Express server and Socket.io setup
│   ├── roomManager.ts      # Room and player management logic
│   └── types.ts            # Server-side type definitions
```

### 🎨 Design System

#### Color Palette
- **Primary (Neon Green)**: `#00ff9d` - Main actions and highlights
- **Secondary (Neon Red)**: `#ff0055` - Errors and warnings
- **Accent (Cyan)**: `#00d4ff` - Secondary actions and punctuation
- **Purple**: `#b300ff` - Special effects and accents
- **Gold**: `#ffd700` - Winner celebrations and achievements

#### Typography
- **Primary Font**: Inter (UI elements)
- **Monospace Font**: Fira Code (typing area)
- **Font Weights**: 400-900 for visual hierarchy

#### Animation Principles
- **Easing**: Cubic-bezier for natural motion
- **Duration**: 0.2-0.5s for UI, 1-2s for ambient effects
- **Performance**: GPU-accelerated transforms and opacity

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher recommended)
- **npm** (comes with Node.js)
- **Modern web browser** with WebSocket support

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd BATTLE
   ```

2. **Install Server Dependencies:**
   ```bash
   cd server
   npm install
   npm run build  # Compile TypeScript
   ```

3. **Install Client Dependencies:**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

#### Method 1: Development Mode
Start both server and client in separate terminals:

```bash
# Terminal 1 - Start Server
cd server
npm start

# Terminal 2 - Start Client
cd client
npm run dev
```

#### Method 2: Production Build
```bash
# Build Client
cd client
npm run build

# Start Server (serves both API and static files)
cd ../server
npm start
```

### Access Points
- **Client**: `http://localhost:5173` (development) or `http://localhost:3001` (production)
- **Server API**: `http://localhost:3001`
- **WebSocket**: `ws://localhost:3001`

## 🌐 Network Play

### Local Network
To play with others on the same network:

1. **Find your IP address:**
   - Windows: `ipconfig` (look for IPv4 Address)
   - macOS/Linux: `ifconfig` or `ip addr`

2. **Share the URL:**
   ```
   http://<YOUR_IP_ADDRESS>:5173
   ```

3. **Firewall Configuration:**
   - Ensure ports `3001` (server) and `5173` (client) are open
   - Windows Defender may need to allow Node.js connections

### Deployment Considerations
- **HTTPS Required**: For production deployment, use HTTPS
- **CORS Configuration**: Update Socket.io CORS settings for your domain
- **Environment Variables**: Use `.env` files for configuration
- **Reverse Proxy**: Consider Nginx or Apache for production

## 🎮 Game Mechanics Deep Dive

### Scoring System
- **WPM Calculation**: `(correct_characters / 5) / time_in_minutes`
- **Accuracy**: `(correct_characters / total_characters) * 100`
- **Progress**: `(correct_characters / total_text_length) * 100`

### Room Management
- **Room Capacity**: Up to 8 players per room
- **Room Codes**: 6-character alphanumeric codes
- **Auto-cleanup**: Rooms are cleaned up when empty

### Socket Events
```typescript
// Client → Server
create_room: { username, avatar }
join_room: { roomId, username, avatar }
player_update: { roomId, progress, wpm }
player_ready: { roomId }
start_game: { roomId }

// Server → Client
room_created: Room
room_joined: Room
room_updated: Room
game_started: Room
timer_update: number
game_over: Room
countdown: number
error: string
```

## 🎨 Visual Effects System

### Particle System
- **Floating Particles**: 20+ animated neon particles
- **Click Ripples**: Expanding rings on mouse clicks
- **Success Bursts**: Particle explosions for achievements
- **Speed Lines**: Motion blur effects during gameplay

### Animation Library
- **Entrance Animations**: Slide, fade, and scale effects
- **Loading States**: Spinners, progress bars, skeleton loaders
- **Micro-interactions**: Hover states, button ripples, form feedback
- **Celebration Effects**: Winner animations, combo indicators

### Glassmorphism Implementation
```css
.glass-card {
  background: linear-gradient(135deg, 
    rgba(19, 19, 31, 0.9) 0%, 
    rgba(19, 19, 31, 0.7) 50%, 
    rgba(19, 19, 31, 0.9) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}
```

## 🔊 Audio System Architecture

### Web Audio API Implementation
- **Oscillator-based**: No external audio files needed
- **Dynamic Generation**: Sounds created programmatically
- **Context Management**: Proper audio context handling
- **Volume Control**: Master gain node for volume adjustment

### Sound Types
- **Click**: 800Hz sine wave, 0.1s duration
- **Hover**: 600Hz triangle wave, 0.05s duration
- **Success**: 523Hz → 659Hz → 784Hz chord progression
- **Error**: 200Hz sawtooth wave, 0.2s duration
- **Type**: 1000-1500Hz square wave, 0.02s duration
- **Win**: 4-note chord sequence with harmonics

## 🐛 Debugging & Development

### Debug Features
- **Debug Panel**: Real-time socket and game state display
- **Console Logging**: Comprehensive event tracking
- **Error Handling**: User-friendly error messages
- **Performance Monitoring**: FPS and connection status

### Common Issues & Solutions

#### Socket Connection Issues
```javascript
// Check server status
console.log('Socket connected:', socket.connected);
console.log('Socket ID:', socket.id);

// Verify server is running
fetch('http://localhost:3001')
  .then(() => console.log('Server is responding'))
  .catch(() => console.error('Server not reachable'));
```

#### Build Errors
```bash
# Clear build cache
rm -rf client/dist server/dist

# Rebuild
cd client && npm run build
cd ../server && npm run build
```

## 🤝 Contributing

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for React and TypeScript
- **Prettier**: Consistent code formatting
- **File Naming**: PascalCase for components, camelCase for utilities

### Git Workflow
1. **Feature Branches**: `git checkout -b feature/new-feature`
2. **Commit Messages**: Conventional Commits format
3. **Pull Requests**: Detailed descriptions and testing steps
4. **Code Review**: Required for all changes

### Development Guidelines
- **Component Structure**: Single responsibility principle
- **State Management**: Use React Context for global state
- **Performance**: Optimize re-renders and bundle size
- **Accessibility**: ARIA labels and keyboard navigation

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Socket.io**: For real-time communication
- **React**: For the component-based UI framework
- **Vite**: For fast development and building
- **TypeScript**: For type safety and better development experience
- **Web Audio API**: For dynamic sound generation

---

**Made with ❤️ by Kubiat**

*Transform typing practice into an exciting competitive experience with stunning visuals and smooth gameplay.*
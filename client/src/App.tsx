import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Lobby } from './components/Lobby';
import { TypingArea } from './components/TypingArea';
import { Leaderboard } from './components/Leaderboard';
import { Results } from './components/Results';
import './App.css';

const GameContent: React.FC = () => {
  const { gameState } = useGame();

  return (
    <Layout>
      {gameState === 'menu' && <Home />}
      {gameState === 'lobby' && <Lobby />}
      {gameState === 'game' && (
        <div className="game-view">
          <TypingArea />
          <Leaderboard />
        </div>
      )}
      {gameState === 'results' && <Results />}
      {/* Overlay results on top of game view if needed, or separate view */}
    </Layout>
  );
};

function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

export default App;

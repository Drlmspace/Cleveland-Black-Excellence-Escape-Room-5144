import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import { AudioProvider } from './context/AudioContext';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import CompletionPage from './pages/CompletionPage';
import './index.css';

function App() {
  return (
    <AudioProvider>
      <GameProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-delta-navy via-gray-900 to-black">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/game" element={<GamePage />} />
              <Route path="/completion" element={<CompletionPage />} />
            </Routes>
          </div>
        </Router>
      </GameProvider>
    </AudioProvider>
  );
}

export default App;
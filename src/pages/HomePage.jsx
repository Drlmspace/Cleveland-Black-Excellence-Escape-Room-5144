import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { useAudio } from '../context/AudioContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlay, FiVolumeX, FiVolume2, FiInfo } = FiIcons;

export default function HomePage() {
  const navigate = useNavigate();
  const { dispatch } = useGame();
  const { playSound, toggleMute, isMuted } = useAudio();
  const [playerName, setPlayerName] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

  const handleStartGame = () => {
    if (!playerName.trim()) {
      playSound('error');
      return;
    }
    
    playSound('success');
    dispatch({ type: 'START_GAME', payload: { name: playerName } });
    navigate('/game');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-delta-gold rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-delta-gold rotate-45"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 border-2 border-delta-gold"></div>
      </div>

      {/* Audio Control */}
      <motion.button
        onClick={() => { toggleMute(); playSound('click'); }}
        className="absolute top-6 right-6 p-3 bg-delta-gold/20 hover:bg-delta-gold/30 rounded-full transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <SafeIcon 
          icon={isMuted ? FiVolumeX : FiVolume2} 
          className="w-6 h-6 text-delta-gold" 
        />
      </motion.button>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto text-center bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-delta-gold/30"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-5xl md:text-6xl font-display font-bold text-delta-gold mb-4"
        >
          Delta Legacy
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-xl md:text-2xl text-delta-cream mb-2"
        >
          Unlock Cleveland's Black Excellence
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="text-gray-300 mb-8 text-lg"
        >
          Journey through six stages of history, solving puzzles that reveal the untold stories of Cleveland's pioneering Black leaders.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="space-y-6"
        >
          <div>
            <input
              type="text"
              placeholder="Enter your historian name..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleStartGame()}
              className="w-full max-w-md px-6 py-3 bg-white/10 border border-delta-gold/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-delta-gold focus:ring-2 focus:ring-delta-gold/30 text-center text-lg"
            />
          </div>

          <div className="flex gap-4 justify-center">
            <motion.button
              onClick={handleStartGame}
              disabled={!playerName.trim()}
              className="px-8 py-4 bg-gradient-to-r from-delta-gold to-yellow-500 text-black font-bold rounded-lg hover:from-yellow-500 hover:to-delta-gold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 text-lg"
              whileHover={{ scale: playerName.trim() ? 1.05 : 1 }}
              whileTap={{ scale: playerName.trim() ? 0.95 : 1 }}
            >
              <SafeIcon icon={FiPlay} className="w-5 h-5" />
              Begin Your Journey
            </motion.button>

            <motion.button
              onClick={() => { setShowInstructions(true); playSound('click'); }}
              className="px-6 py-4 bg-delta-navy/60 text-delta-cream border border-delta-gold/30 rounded-lg hover:bg-delta-navy/80 transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SafeIcon icon={FiInfo} className="w-5 h-5" />
              Instructions
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Instructions Modal */}
      {showInstructions && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setShowInstructions(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-delta-navy to-gray-900 rounded-2xl p-8 max-w-2xl border border-delta-gold/30"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-display font-bold text-delta-gold mb-6">How to Play</h2>
            <div className="space-y-4 text-delta-cream">
              <p><strong className="text-delta-gold">Mission:</strong> Restore a forgotten museum exhibit by solving historical puzzles across 6 stages.</p>
              <p><strong className="text-delta-gold">Gameplay:</strong> Each stage presents unique challenges based on real Cleveland history.</p>
              <p><strong className="text-delta-gold">Puzzles:</strong> Decode messages, solve equations, match audio clips, and more!</p>
              <p><strong className="text-delta-gold">Rewards:</strong> Unlock historical fact cards and build your knowledge collection.</p>
              <p><strong className="text-delta-gold">Goal:</strong> Complete all stages to reveal the full legacy of Cleveland's Black excellence.</p>
            </div>
            <motion.button
              onClick={() => { setShowInstructions(false); playSound('click'); }}
              className="mt-6 px-6 py-3 bg-delta-gold text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Got it!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
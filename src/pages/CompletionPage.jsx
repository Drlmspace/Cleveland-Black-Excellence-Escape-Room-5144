import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { useAudio } from '../context/AudioContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import confetti from 'canvas-confetti';

const { FiAward, FiClock, FiStar, FiHome, FiRefreshCw } = FiIcons;

export default function CompletionPage() {
  const { state, dispatch } = useGame();
  const { playSound } = useAudio();

  useEffect(() => {
    // Celebration effects
    playSound('unlock');
    
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    
    const randomInRange = (min, max) => Math.random() * (max - min) + min;
    
    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }
      
      confetti({
        particleCount: 50,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.1, 0.9),
          y: randomInRange(0.1, 0.9)
        },
        colors: ['#D4AF37', '#800020', '#F5F5DC']
      });
    }, 250);

    return () => clearInterval(interval);
  }, [playSound]);

  const getCompletionTime = () => {
    if (!state.timeStarted) return 'N/A';
    const totalTime = Date.now() - state.timeStarted;
    const minutes = Math.floor(totalTime / 60000);
    const seconds = Math.floor((totalTime % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getPerformanceRating = () => {
    if (state.totalScore >= 500) return { rating: 'Legendary Historian', color: 'text-delta-gold' };
    if (state.totalScore >= 400) return { rating: 'Master Researcher', color: 'text-yellow-400' };
    if (state.totalScore >= 300) return { rating: 'Skilled Detective', color: 'text-blue-400' };
    return { rating: 'Curious Explorer', color: 'text-green-400' };
  };

  const performance = getPerformanceRating();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center bg-black/60 backdrop-blur-lg rounded-2xl p-8 border border-delta-gold/30"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <SafeIcon icon={FiAward} className="w-20 h-20 text-delta-gold mx-auto mb-4" />
          <h1 className="text-5xl font-display font-bold text-delta-gold mb-4">
            Mission Complete!
          </h1>
          <p className="text-2xl text-delta-cream mb-2">
            Welcome, {state.playerName}
          </p>
          <p className="text-lg text-gray-300">
            You have successfully restored the Delta Legacy exhibit
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-delta-navy/40 rounded-lg p-6 border border-delta-gold/20">
            <SafeIcon icon={FiClock} className="w-8 h-8 text-delta-gold mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-delta-cream">Time</h3>
            <p className="text-2xl font-bold text-white">{getCompletionTime()}</p>
          </div>
          
          <div className="bg-delta-navy/40 rounded-lg p-6 border border-delta-gold/20">
            <SafeIcon icon={FiStar} className="w-8 h-8 text-delta-gold mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-delta-cream">Score</h3>
            <p className="text-2xl font-bold text-white">{state.totalScore}</p>
          </div>
          
          <div className="bg-delta-navy/40 rounded-lg p-6 border border-delta-gold/20">
            <SafeIcon icon={FiAward} className="w-8 h-8 text-delta-gold mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-delta-cream">Rank</h3>
            <p className={`text-lg font-bold ${performance.color}`}>{performance.rating}</p>
          </div>
        </motion.div>

        {/* Historical Cards Unlocked */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-display font-bold text-delta-gold mb-4">
            Historical Knowledge Unlocked
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.unlockedCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="bg-gradient-to-br from-delta-navy/60 to-gray-800/60 rounded-lg p-4 border border-delta-gold/30"
              >
                <h4 className="font-semibold text-delta-gold mb-2">{card.title}</h4>
                <p className="text-sm text-delta-cream">{card.fact}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Final Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="bg-gradient-to-r from-delta-maroon/20 to-delta-navy/20 rounded-lg p-6 mb-8 border border-delta-gold/30"
        >
          <p className="text-lg text-delta-cream italic">
            "Your discovery ignites the next generation. The legacy of Cleveland's Black excellence continues through historians like you who refuse to let these stories be forgotten."
          </p>
          <p className="text-delta-gold font-semibold mt-3">
            — Tim Lampkin & Malik Sinegal, Contemporary Leaders
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="flex gap-4 justify-center"
        >
          <motion.button
            onClick={() => {
              dispatch({ type: 'RESET_GAME' });
              window.location.href = '#/';
            }}
            className="px-6 py-3 bg-delta-gold text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SafeIcon icon={FiHome} className="w-5 h-5" />
            Return Home
          </motion.button>
          
          <motion.button
            onClick={() => {
              dispatch({ type: 'RESET_GAME' });
              window.location.href = '#/game';
            }}
            className="px-6 py-3 bg-delta-navy text-delta-cream border border-delta-gold/30 rounded-lg hover:bg-delta-navy/80 transition-colors flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SafeIcon icon={FiRefreshCw} className="w-5 h-5" />
            Play Again
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
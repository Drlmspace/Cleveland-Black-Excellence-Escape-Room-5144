import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { useAudio } from '../context/AudioContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiVolumeX, FiVolume2, FiStar } = FiIcons;

export default function GameHeader() {
  const { state } = useGame();
  const { playSound, toggleMute, isMuted } = useAudio();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-black/40 backdrop-blur-lg border-b border-delta-gold/30 p-4"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-display font-bold text-delta-gold">
            Delta Legacy
          </h1>
          <div className="text-delta-cream">
            <span className="text-sm">Historian:</span>
            <span className="ml-2 font-semibold">{state.playerName}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-delta-cream">
            <SafeIcon icon={FiStar} className="w-5 h-5 text-delta-gold" />
            <span className="font-semibold">{state.totalScore}</span>
          </div>

          <button
            onClick={() => { toggleMute(); playSound('click'); }}
            className="p-2 bg-delta-gold/20 hover:bg-delta-gold/30 rounded-lg transition-colors"
          >
            <SafeIcon 
              icon={isMuted ? FiVolumeX : FiVolume2} 
              className="w-5 h-5 text-delta-gold" 
            />
          </button>

          <button
            onClick={() => window.location.href = '#/'}
            className="p-2 bg-delta-navy/60 hover:bg-delta-navy/80 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiHome} className="w-5 h-5 text-delta-cream" />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
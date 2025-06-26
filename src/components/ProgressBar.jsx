import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';

export default function ProgressBar() {
  const { state } = useGame();
  const progress = (state.completedStages.length / 6) * 100;

  return (
    <div className="bg-black/20 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-delta-cream font-semibold">
            Progress: Stage {state.currentStage + 1} of 6
          </span>
          <span className="text-delta-gold font-semibold">
            {state.completedStages.length}/6 Complete
          </span>
        </div>
        
        <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-delta-gold to-yellow-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          {['Civil Rights', 'Education', 'Music', 'Business', 'Medicine', 'Legacy'].map((stage, index) => (
            <span 
              key={index}
              className={`${
                index <= state.currentStage ? 'text-delta-gold' : 'text-gray-500'
              } ${index < state.completedStages.length ? 'font-bold' : ''}`}
            >
              {stage}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
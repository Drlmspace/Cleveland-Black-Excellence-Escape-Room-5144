import React from 'react';
import { useGame } from '../context/GameContext';
import GameHeader from '../components/GameHeader';
import StageContainer from '../components/StageContainer';
import ProgressBar from '../components/ProgressBar';
import { stages } from '../data/stagesData';

export default function GamePage() {
  const { state } = useGame();
  const currentStageData = stages[state.currentStage];

  if (state.gameCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold text-delta-gold mb-4">
            Congratulations!
          </h1>
          <p className="text-xl text-delta-cream mb-6">
            You've successfully restored the Delta Legacy exhibit!
          </p>
          <button 
            onClick={() => window.location.href = '#/completion'}
            className="px-8 py-4 bg-gradient-to-r from-delta-gold to-yellow-500 text-black font-bold rounded-lg hover:from-yellow-500 hover:to-delta-gold transition-all duration-300"
          >
            View Your Achievement
          </button>
        </div>
      </div>
    );
  }

  if (!currentStageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl mb-4">Loading stage...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <GameHeader />
      <ProgressBar />
      <StageContainer stage={currentStageData} stageId={state.currentStage} />
    </div>
  );
}
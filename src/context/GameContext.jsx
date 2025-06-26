import React, { createContext, useContext, useReducer } from 'react';

const GameContext = createContext();

const initialState = {
  currentStage: 0,
  completedStages: [],
  unlockedCards: [],
  timeStarted: null,
  gameCompleted: false,
  playerName: '',
  totalScore: 0,
  stageProgress: {
    0: { completed: false, attempts: 0, hints: 0 },
    1: { completed: false, attempts: 0, hints: 0 },
    2: { completed: false, attempts: 0, hints: 0 },
    3: { completed: false, attempts: 0, hints: 0 },
    4: { completed: false, attempts: 0, hints: 0 },
    5: { completed: false, attempts: 0, hints: 0 }
  }
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        timeStarted: Date.now(),
        playerName: action.payload.name
      };
    
    case 'COMPLETE_STAGE':
      const newCompletedStages = [...state.completedStages, action.payload.stageId];
      const newUnlockedCards = [...state.unlockedCards, action.payload.card];
      const scoreBonus = Math.max(100 - (state.stageProgress[action.payload.stageId].attempts * 10), 50);
      
      return {
        ...state,
        completedStages: newCompletedStages,
        unlockedCards: newUnlockedCards,
        currentStage: state.currentStage + 1,
        totalScore: state.totalScore + scoreBonus,
        stageProgress: {
          ...state.stageProgress,
          [action.payload.stageId]: {
            ...state.stageProgress[action.payload.stageId],
            completed: true
          }
        },
        gameCompleted: newCompletedStages.length === 6
      };
    
    case 'INCREMENT_ATTEMPTS':
      return {
        ...state,
        stageProgress: {
          ...state.stageProgress,
          [action.payload.stageId]: {
            ...state.stageProgress[action.payload.stageId],
            attempts: state.stageProgress[action.payload.stageId].attempts + 1
          }
        }
      };
    
    case 'USE_HINT':
      return {
        ...state,
        stageProgress: {
          ...state.stageProgress,
          [action.payload.stageId]: {
            ...state.stageProgress[action.payload.stageId],
            hints: state.stageProgress[action.payload.stageId].hints + 1
          }
        }
      };
    
    case 'RESET_GAME':
      return initialState;
    
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
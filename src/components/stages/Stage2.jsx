import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useAudio } from '../../context/AudioContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiTarget, FiTrendingUp, FiHelpCircle, FiAward, FiInfo, FiRefreshCw } = FiIcons;

// Lusia Harris Basketball Achievement Puzzle - Delta State Integration
const basketballStats = [
  { id: 'titles', value: 3, label: 'National Titles', years: '1975-77', icon: '🏆' },
  { id: 'draft', value: 1, label: 'First Woman NBA Draft', year: '1977', icon: '🏀' },
  { id: 'points', value: 2812, label: 'Career Points', average: 25.9, icon: '⭐' },
  { id: 'integration', value: 1967, label: 'DSU Integration Year', pioneer: 'Shirley Washington', icon: '🎓' }
];

const achievementSequence = [
  { year: 1967, event: 'Shirley Washington integrates DSU', completed: false },
  { year: 1969, event: 'Black Student sit-in protests', completed: false },
  { year: 1975, event: 'First National Championship', completed: false },
  { year: 1977, event: 'NBA Draft History Made', completed: false }
];

const correctStatOrder = ['integration', 'titles', 'points', 'draft'];

export default function Stage2({ stage, stageId }) {
  const { dispatch } = useGame();
  const { playSound } = useAudio();
  const [selectedStats, setSelectedStats] = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [championshipComplete, setChampionshipComplete] = useState(false);

  const handleStatClick = (statId) => {
    if (selectedStats.includes(statId)) return;
    
    const newSelected = [...selectedStats, statId];
    setSelectedStats(newSelected);
    playSound('click');

    // Complete timeline events based on selection
    const eventIndex = newSelected.length - 1;
    if (eventIndex < achievementSequence.length) {
      setCompletedEvents(prev => [...prev, eventIndex]);
      playSound('success');
    }

    // Check completion
    if (newSelected.length === 4) {
      setAttempts(prev => prev + 1);
      dispatch({ type: 'INCREMENT_ATTEMPTS', payload: { stageId } });
      
      if (JSON.stringify(newSelected) === JSON.stringify(correctStatOrder)) {
        setChampionshipComplete(true);
        playSound('unlock');
        
        setTimeout(() => {
          dispatch({
            type: 'COMPLETE_STAGE',
            payload: {
              stageId,
              card: {
                title: "Delta State Integration & Excellence",
                fact: "Shirley Washington became Delta State University's first African-American student in 1967. Lusia 'Lucy' Harris later set three national titles for the Lady Statesmen (1975-77) and became the first woman officially drafted by an NBA team."
              }
            }
          });
        }, 2000);
      } else {
        playSound('error');
        setTimeout(() => {
          setSelectedStats([]);
          setCompletedEvents([]);
        }, 1500);
      }
    }
  };

  const useHint = () => {
    setShowHint(true);
    playSound('click');
    dispatch({ type: 'USE_HINT', payload: { stageId } });
  };

  const resetChampionship = () => {
    setSelectedStats([]);
    setCompletedEvents([]);
    setChampionshipComplete(false);
    playSound('click');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Instructions Panel */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-green-900/30 border border-green-400/50 rounded-lg p-6 mb-6"
      >
        <div className="flex items-start gap-4">
          <SafeIcon icon={FiInfo} className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-green-300 mb-2">Championship Timeline Instructions</h3>
            <div className="space-y-2 text-green-100">
              <p><strong>Step 1:</strong> Click basketball achievements in chronological order</p>
              <p><strong>Step 2:</strong> Watch the integration and athletic timeline unfold</p>
              <p><strong>Step 3:</strong> Complete the sequence to honor Delta State's pioneering athletes</p>
              <p className="text-green-300 text-sm mt-3">💡 Start with integration, then follow the championship years</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Delta State Setting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-green-900/20 to-blue-900/20 rounded-2xl p-8 mb-8 border border-green-400/30"
      >
        <div className="grid md:grid-cols-3 gap-6">
          {/* University Status */}
          <div className="bg-black/40 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <SafeIcon icon={FiUsers} className="text-green-400 w-6 h-6" />
              <h3 className="text-lg font-semibold text-green-200">Delta State University</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Integration:</span>
                <span className="text-green-400">1967</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">First Student:</span>
                <span className="text-blue-400">Shirley Washington</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Student Protests:</span>
                <span className={completedEvents.length > 1 ? 'text-green-400' : 'text-orange-400'}>
                  {completedEvents.length > 1 ? 'Resolved' : '1969'}
                </span>
              </div>
            </div>
          </div>

          {/* Basketball Program */}
          <div className="bg-black/40 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <SafeIcon icon={FiTarget} className="text-green-400 w-6 h-6" />
              <h3 className="text-lg font-semibold text-green-200">Lady Statesmen</h3>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🏀</div>
              <div className="text-sm text-green-200 font-semibold">Women's Basketball</div>
              <div className="text-xs text-gray-400 mt-1">
                Championships: {selectedStats.includes('titles') ? '3' : '0'}
              </div>
              {championshipComplete && (
                <div className="text-xs text-gold-400 mt-2 font-bold animate-pulse">
                  HALL OF FAME LEGACY
                </div>
              )}
            </div>
          </div>

          {/* Historic Achievements */}
          <div className="bg-black/40 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <SafeIcon icon={FiTrendingUp} className="text-green-400 w-6 h-6" />
              <h3 className="text-lg font-semibold text-green-200">National Recognition</h3>
            </div>
            <div className="space-y-2">
              {achievementSequence.map((achievement, index) => (
                <div key={index} className="text-xs text-gray-300 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    completedEvents.includes(index) ? 'bg-green-500 animate-pulse' : 'bg-gray-600'
                  }`}></div>
                  <span>{achievement.year}: {achievement.event}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Basketball Achievement Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-black/60 backdrop-blur-lg rounded-2xl p-8 border border-green-400/30"
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-display font-bold text-green-400 mb-2">
            Delta State Basketball Legacy
          </h3>
          <p className="text-green-200">
            From integration pioneer Shirley Washington to championship legend Lusia Harris
          </p>
        </div>

        {/* Achievement Progress */}
        <div className="mb-8 p-4 bg-gray-800/30 rounded-lg">
          <div className="text-center text-sm text-gray-300 mb-2">
            Historical Milestones: {selectedStats.length}/4
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-green-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(selectedStats.length / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Basketball Statistics Layout */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-green-200 mb-4 text-center">Championship Statistics</h4>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {basketballStats.map((stat) => {
              const isSelected = selectedStats.includes(stat.id);
              const selectionOrder = selectedStats.indexOf(stat.id) + 1;
              
              return (
                <motion.div
                  key={stat.id}
                  onClick={() => handleStatClick(stat.id)}
                  className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-green-400 bg-green-400/20 scale-105' 
                      : 'border-gray-400 bg-gray-800/50 hover:border-green-400/70 hover:scale-102'
                  }`}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{stat.icon}</div>
                    <div className="text-2xl font-bold text-green-200 mb-2">{stat.value}</div>
                    <div className="text-sm text-green-300 font-semibold mb-1">{stat.label}</div>
                    {stat.years && (
                      <div className="text-xs text-gray-400">{stat.years}</div>
                    )}
                    {stat.year && (
                      <div className="text-xs text-gray-400">{stat.year}</div>
                    )}
                    {stat.average && (
                      <div className="text-xs text-blue-400">Avg: {stat.average} PPG</div>
                    )}
                    {stat.pioneer && (
                      <div className="text-xs text-purple-400">{stat.pioneer}</div>
                    )}
                    {isSelected && (
                      <div className="text-xs text-green-400 font-bold mt-2">
                        #{selectionOrder}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Timeline Progress */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {achievementSequence.map((achievement, index) => (
            <div key={index} className="bg-gray-800/30 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-green-400 mb-2">{achievement.year}</div>
              <div className="text-xs text-gray-200">{achievement.event}</div>
              <div className="text-xs text-green-400 mt-2">
                {completedEvents.includes(index) ? '✓ Complete' : `Step ${index + 1}`}
              </div>
            </div>
          ))}
        </div>

        {/* Basketball Court Visualization */}
        <div className="relative bg-gradient-to-br from-green-900/50 to-gray-900/20 rounded-2xl p-8 mb-8 border border-green-400/30" style={{ height: '200px' }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl opacity-20">🏀</div>
          </div>
          
          {/* Championship Banners */}
          {championshipComplete && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-4"
            >
              {['1975', '1976', '1977'].map((year, index) => (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-gold-500/20 border border-gold-400 rounded-lg p-2 text-center"
                >
                  <div className="text-xs text-gold-400 font-bold">{year}</div>
                  <div className="text-xs text-gold-300">Champions</div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={useHint}
            className="px-6 py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/30 rounded-lg text-blue-300 flex items-center gap-2 transition-colors"
          >
            <SafeIcon icon={FiHelpCircle} className="w-5 h-5" />
            Get Hint
          </button>
          
          <button
            onClick={resetChampionship}
            disabled={selectedStats.length === 0}
            className="px-6 py-3 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-400/30 rounded-lg text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <SafeIcon icon={FiRefreshCw} className="w-5 h-5" />
            Reset Timeline
          </button>
        </div>

        {/* Success Display */}
        {championshipComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-6 bg-gradient-to-r from-green-600/20 to-gold-600/20 rounded-lg border border-green-400/50"
          >
            <div className="text-center">
              <div className="text-4xl mb-2">🏆</div>
              <h4 className="text-xl font-bold text-green-400 mb-2">Championship Legacy Complete!</h4>
              <p className="text-green-200">
                You've successfully traced Delta State's journey from Shirley Washington's groundbreaking 
                integration in 1967 to Lusia Harris's unprecedented NBA draft in 1977. Three national 
                championships and a legacy of breaking barriers!
              </p>
            </div>
          </motion.div>
        )}

        {/* Hint Display */}
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-blue-900/20 border border-blue-400/30 rounded-lg"
          >
            <p className="text-blue-300 text-center">
              💡 <strong>Delta State Timeline:</strong><br/>
              1. <strong>Integration (1967):</strong> Shirley Washington breaks the color barrier<br/>
              2. <strong>National Titles (3):</strong> 1975, 1976, 1977 championships<br/>
              3. <strong>Career Points (2,812):</strong> Lusia Harris's scoring record<br/>
              4. <strong>NBA Draft (1st):</strong> Historic 1977 New Orleans Jazz selection
            </p>
          </motion.div>
        )}

        {/* Attempts Counter */}
        <div className="mt-4 text-center text-gray-400 text-sm">
          Timeline Completion Attempts: {attempts}
        </div>
      </motion.div>
    </div>
  );
}
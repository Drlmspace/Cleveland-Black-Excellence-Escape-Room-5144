import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useAudio } from '../../context/AudioContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiStar, FiHeart, FiGift, FiHelpCircle, FiTrendingUp, FiInfo, FiRefreshCw } = FiIcons;

// Legacy Celebration Puzzle - Modern Cleveland Leadership
const legacyElements = [
  { 
    id: 'historical', 
    category: 'Historical Foundation',
    elements: ['Amzie Moore House', 'Dockery Farms Blues', 'Mound Bayou Heritage', 'Civil Rights Activism'],
    icon: '🏛️',
    color: 'from-blue-600/30 to-indigo-600/30'
  },
  { 
    id: 'educational', 
    category: 'Educational Excellence',
    elements: ['Delta State Integration', 'Cleveland Central Unity', 'GRAMMY Museum', 'Community Programs'],
    icon: '🎓',
    color: 'from-green-600/30 to-emerald-600/30'
  },
  { 
    id: 'economic', 
    category: 'Economic Innovation',
    elements: ['Black Entrepreneurship', 'Healthcare Pioneers', 'Agricultural Innovation', 'Export Markets'],
    icon: '💼',
    color: 'from-emerald-600/30 to-green-600/30'
  },
  { 
    id: 'cultural', 
    category: 'Cultural Legacy',
    elements: ['Blues Heritage', 'Juneteenth Celebrations', 'Arts Festivals', 'Community Unity'],
    icon: '🎵',
    color: 'from-purple-600/30 to-pink-600/30'
  }
];

const modernLeaders = [
  { name: 'Tim Lampkin', role: 'Higher Purpose Co. CEO', contribution: 'Economic Development' },
  { name: 'Malik Sinegal', role: 'Community Leader', contribution: 'Youth Mentorship' },
  { name: 'Dr. L.C. Dorsey', role: 'Health Center Director', contribution: 'Healthcare Access' },
  { name: 'Rep. Bennie Thompson', role: 'Congressman', contribution: 'Political Leadership' }
];

const correctLegacyOrder = ['historical', 'educational', 'economic', 'cultural'];

export default function Stage6({ stage, stageId }) {
  const { dispatch } = useGame();
  const { playSound } = useAudio();
  const [assembledLegacy, setAssembledLegacy] = useState([]);
  const [celebrationActive, setCelebrationActive] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [legacyComplete, setLegacyComplete] = useState(false);

  const handleLegacyClick = (legacyId) => {
    if (assembledLegacy.includes(legacyId)) return;
    
    const newAssembled = [...assembledLegacy, legacyId];
    setAssembledLegacy(newAssembled);
    playSound('click');

    // Activate celebration effects
    if (newAssembled.length > 2) {
      setCelebrationActive(true);
    }

    // Check completion
    if (newAssembled.length === 4) {
      setAttempts(prev => prev + 1);
      dispatch({ type: 'INCREMENT_ATTEMPTS', payload: { stageId } });
      
      if (JSON.stringify(newAssembled) === JSON.stringify(correctLegacyOrder)) {
        setLegacyComplete(true);
        setCelebrationActive(true);
        playSound('unlock');
        
        setTimeout(() => {
          dispatch({
            type: 'COMPLETE_STAGE',
            payload: {
              stageId,
              card: {
                title: "Cleveland's Living Legacy",
                fact: "Community-wide Juneteenth celebrations—such as the 2024 'For The People' event—are now part of Cleveland's civic calendar. Cleveland's annual Crosstie Arts & Jazz Festival features African American performers, continuing the rich tradition from Dockery Farms to the GRAMMY Museum."
              }
            }
          });
        }, 3000);
      } else {
        playSound('error');
        setTimeout(() => {
          setAssembledLegacy([]);
          setCelebrationActive(false);
        }, 1500);
      }
    }
  };

  const useHint = () => {
    setShowHint(true);
    playSound('click');
    dispatch({ type: 'USE_HINT', payload: { stageId } });
  };

  const resetLegacy = () => {
    setAssembledLegacy([]);
    setCelebrationActive(false);
    setLegacyComplete(false);
    playSound('click');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Instructions Panel */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gold-900/30 border border-gold-400/50 rounded-lg p-6 mb-6"
      >
        <div className="flex items-start gap-4">
          <SafeIcon icon={FiInfo} className="w-6 h-6 text-gold-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-gold-300 mb-2">Legacy Celebration Instructions</h3>
            <div className="space-y-2 text-gold-100">
              <p><strong>Step 1:</strong> Assemble Cleveland's legacy by selecting foundation elements in order</p>
              <p><strong>Step 2:</strong> Build from historical roots through modern achievements</p>
              <p><strong>Step 3:</strong> Complete the celebration of Cleveland's continuing Black excellence</p>
              <p className="text-gold-300 text-sm mt-3">💡 Start with historical foundation, build toward cultural celebration</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modern Cleveland Setting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gold-900/20 to-purple-900/20 rounded-2xl p-8 mb-8 border border-gold-400/30"
      >
        <div className="grid md:grid-cols-4 gap-6">
          {modernLeaders.map((leader, index) => (
            <div key={index} className="bg-black/40 rounded-lg p-4">
              <div className="text-center">
                <div className="text-2xl mb-2">👤</div>
                <div className="text-sm text-gold-200 font-semibold">{leader.name}</div>
                <div className="text-xs text-gray-400 mb-1">{leader.role}</div>
                <div className="text-xs text-purple-400">{leader.contribution}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <div className="text-lg font-semibold text-gold-400">Contemporary Leaders</div>
          <div className="text-sm text-gray-300">Continuing the legacy of Cleveland excellence</div>
        </div>
      </motion.div>

      {/* Legacy Assembly Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-black/60 backdrop-blur-lg rounded-2xl p-8 border border-gold-400/30"
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-display font-bold text-gold-400 mb-2">
            Cleveland Legacy Celebration
          </h3>
          <p className="text-gold-200">
            Assemble the complete story of Cleveland's Black excellence across generations
          </p>
        </div>

        {/* Legacy Progress */}
        <div className="mb-8 p-4 bg-gray-800/30 rounded-lg">
          <div className="text-center text-sm text-gray-300 mb-2">
            Legacy Elements: {assembledLegacy.length}/4
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gold-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(assembledLegacy.length / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Legacy Elements Selection */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gold-200 mb-6 text-center">Legacy Foundation Elements</h4>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {legacyElements.map((legacy) => {
              const isSelected = assembledLegacy.includes(legacy.id);
              const selectionOrder = assembledLegacy.indexOf(legacy.id) + 1;
              
              return (
                <motion.div
                  key={legacy.id}
                  onClick={() => handleLegacyClick(legacy.id)}
                  className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-gold-400 bg-gold-400/20 scale-105' 
                      : 'border-gray-400 bg-gray-800/50 hover:border-gold-400/70 hover:scale-102'
                  }`}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{legacy.icon}</div>
                    <div className="text-lg font-bold text-gold-200 mb-3">{legacy.category}</div>
                    <div className="space-y-1">
                      {legacy.elements.map((element, idx) => (
                        <div key={idx} className="text-xs text-gray-300">• {element}</div>
                      ))}
                    </div>
                    {isSelected && (
                      <div className="text-sm text-gold-400 font-bold mt-3">
                        #{selectionOrder} ✓
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Legacy Timeline Visualization */}
        <div className="relative bg-gradient-to-br from-gold-900/50 to-purple-900/20 rounded-2xl p-8 mb-8 border border-gold-400/30" style={{ height: '400px' }}>
          {/* Timeline Base */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gold-400/30 transform -translate-x-1/2"></div>
          
          {/* Timeline Nodes */}
          {['1941-1970', '1970-1990', '1990-2010', '2010-Present'].map((era, index) => {
            const isActive = assembledLegacy.length > index;
            
            return (
              <motion.div
                key={era}
                className={`absolute left-1/2 transform -translate-x-1/2 ${
                  index === 0 ? 'top-8' : 
                  index === 1 ? 'top-32' :
                  index === 2 ? 'top-56' : 'top-80'
                }`}
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={isActive ? { scale: 1.2, opacity: 1 } : { scale: 0.8, opacity: 0.5 }}
              >
                <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center ${
                  isActive ? 'border-gold-400 bg-gold-400/20' : 'border-gray-400 bg-gray-800/50'
                }`}>
                  <div className="text-xs font-bold text-center">
                    {index + 1}
                  </div>
                </div>
                <div className="text-xs text-gold-200 text-center mt-2 font-semibold">
                  {era}
                </div>
              </motion.div>
            );
          })}

          {/* Celebration Effects */}
          {celebrationActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 pointer-events-none overflow-hidden"
            >
              {/* Fireworks */}
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  style={{
                    left: `${10 + Math.random() * 80}%`,
                    top: `${10 + Math.random() * 80}%`
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.5, 1],
                    opacity: [0, 1, 0.7],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                >
                  {['🎉', '✨', '🎊', '⭐', '💫'][Math.floor(Math.random() * 5)]}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Modern Celebrations */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800/30 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">🎉</div>
            <div className="text-sm text-gold-200 font-semibold">Juneteenth 2024</div>
            <div className="text-xs text-gray-400">"For The People" Event</div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">🎨</div>
            <div className="text-sm text-gold-200 font-semibold">Crosstie Arts Festival</div>
            <div className="text-xs text-gray-400">Annual Community Celebration</div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">🏛️</div>
            <div className="text-sm text-gold-200 font-semibold">Heritage Center</div>
            <div className="text-xs text-gray-400">Delta Culture & Learning</div>
          </div>
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
            onClick={resetLegacy}
            disabled={assembledLegacy.length === 0}
            className="px-6 py-3 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-400/30 rounded-lg text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <SafeIcon icon={FiRefreshCw} className="w-5 h-5" />
            Reset Legacy
          </button>
        </div>

        {/* Success Display */}
        {legacyComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-6 bg-gradient-to-r from-gold-600/20 to-purple-600/20 rounded-lg border border-gold-400/50"
          >
            <div className="text-center">
              <div className="text-4xl mb-2">🏆</div>
              <h4 className="text-xl font-bold text-gold-400 mb-2">Cleveland Legacy Celebration Complete!</h4>
              <p className="text-gold-200 mb-4">
                You've successfully assembled the complete story of Cleveland's Black excellence! From Amzie Moore's 
                foundational activism through Delta State's integration, from pioneering businesses to the GRAMMY Museum, 
                and continuing today with community celebrations and contemporary leaders.
              </p>
              <div className="bg-black/40 rounded-lg p-4 text-sm">
                <div className="text-gold-400 font-bold mb-2">
                  "Your discovery ignites the next generation. The legacy continues..."
                </div>
                <div className="text-gray-300 italic">
                  — Tim Lampkin & Malik Sinegal, Contemporary Leaders
                </div>
              </div>
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
              💡 <strong>Legacy Assembly Order:</strong><br/>
              1. <strong>Historical Foundation:</strong> Amzie Moore, Dockery Farms, civil rights roots<br/>
              2. <strong>Educational Excellence:</strong> School integration, Delta State, GRAMMY Museum<br/>
              3. <strong>Economic Innovation:</strong> Black businesses, healthcare, agriculture<br/>
              4. <strong>Cultural Legacy:</strong> Blues heritage, festivals, modern celebrations
            </p>
          </motion.div>
        )}

        {/* Attempts Counter */}
        <div className="mt-4 text-center text-gray-400 text-sm">
          Legacy Assembly Attempts: {attempts}
        </div>
      </motion.div>
    </div>
  );
}
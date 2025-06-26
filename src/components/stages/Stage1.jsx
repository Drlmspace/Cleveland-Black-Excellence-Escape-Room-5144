import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useAudio } from '../../context/AudioContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiKey, FiUsers, FiHelpCircle, FiUnlock, FiInfo, FiRotateCcw } = FiIcons;

// Amzie Moore's House Puzzle - Civil Rights Hub
const civilRightsLeaders = [
  { id: 'moore', name: 'Amzie Moore', position: { x: 50, y: 30 }, icon: '🏠', role: 'NAACP President' },
  { id: 'king', name: 'Martin Luther King Jr.', position: { x: 30, y: 50 }, icon: '✊', role: 'Movement Leader' },
  { id: 'hamer', name: 'Fannie Lou Hamer', position: { x: 70, y: 50 }, icon: '🗳️', role: 'MFDP Co-founder' },
  { id: 'moses', name: 'Bob Moses', position: { x: 50, y: 70 }, icon: '📚', role: 'SNCC Organizer' }
];

const houseFeatures = [
  { id: 'brick', name: 'First Black-Owned Brick Home', year: 1941, unlocked: false },
  { id: 'station', name: 'Integrated Pan-Am Station', year: 1954, unlocked: false },
  { id: 'dormitory', name: 'Civil Rights Dormitory', year: 1960, unlocked: false },
  { id: 'museum', name: 'Freedom Trail Museum', year: 2016, unlocked: false }
];

const correctSequence = ['moore', 'king', 'hamer', 'moses'];

export default function Stage1({ stage, stageId }) {
  const { dispatch } = useGame();
  const { playSound } = useAudio();
  const [selectedLeaders, setSelectedLeaders] = useState([]);
  const [unlockedFeatures, setUnlockedFeatures] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [houseComplete, setHouseComplete] = useState(false);

  const handleLeaderClick = (leaderId) => {
    if (selectedLeaders.includes(leaderId)) return;
    
    const newSelected = [...selectedLeaders, leaderId];
    setSelectedLeaders(newSelected);
    playSound('click');

    // Unlock house features based on sequence
    const featureIndex = newSelected.length - 1;
    if (featureIndex < houseFeatures.length) {
      setUnlockedFeatures(prev => [...prev, houseFeatures[featureIndex].id]);
      playSound('success');
    }

    // Check completion
    if (newSelected.length === 4) {
      setAttempts(prev => prev + 1);
      dispatch({ type: 'INCREMENT_ATTEMPTS', payload: { stageId } });
      
      if (JSON.stringify(newSelected) === JSON.stringify(correctSequence)) {
        setHouseComplete(true);
        playSound('unlock');
        
        setTimeout(() => {
          dispatch({
            type: 'COMPLETE_STAGE',
            payload: {
              stageId,
              card: {
                title: "Amzie Moore's Legacy",
                fact: "Amzie Moore built the first brick home ever owned by an African American in Cleveland in 1941. That house at 614 S. Chrisman Ave. is now a Mississippi Freedom Trail museum, serving as the headquarters for civil rights strategy."
              }
            }
          });
        }, 2000);
      } else {
        playSound('error');
        setTimeout(() => {
          setSelectedLeaders([]);
          setUnlockedFeatures([]);
        }, 1500);
      }
    }
  };

  const useHint = () => {
    setShowHint(true);
    playSound('click');
    dispatch({ type: 'USE_HINT', payload: { stageId } });
  };

  const resetHouse = () => {
    setSelectedLeaders([]);
    setUnlockedFeatures([]);
    setHouseComplete(false);
    playSound('click');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Instructions Panel */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-900/30 border border-blue-400/50 rounded-lg p-6 mb-6"
      >
        <div className="flex items-start gap-4">
          <SafeIcon icon={FiInfo} className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-blue-300 mb-2">Civil Rights Hub Instructions</h3>
            <div className="space-y-2 text-blue-100">
              <p><strong>Step 1:</strong> Click civil rights leaders in the order they visited Amzie Moore's house</p>
              <p><strong>Step 2:</strong> Watch as each selection unlocks a historical feature of the house</p>
              <p><strong>Step 3:</strong> Complete the sequence to reveal the full legacy of 614 S. Chrisman Ave.</p>
              <p className="text-blue-300 text-sm mt-3">💡 Start with the homeowner, then follow the movement timeline</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cleveland Setting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-brown-900/20 to-blue-900/20 rounded-2xl p-8 mb-8 border border-blue-400/30"
      >
        <div className="grid md:grid-cols-3 gap-6">
          {/* House Status */}
          <div className="bg-black/40 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <SafeIcon icon={FiHome} className="text-blue-400 w-6 h-6" />
              <h3 className="text-lg font-semibold text-blue-200">614 S. Chrisman Ave</h3>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🏠</div>
              <div className="text-sm text-blue-200">First Black-Owned Brick Home</div>
              <div className="text-xs text-gray-400">Built 1941</div>
              {houseComplete && (
                <div className="text-xs text-green-400 mt-2 font-bold animate-pulse">
                  FREEDOM TRAIL MUSEUM
                </div>
              )}
            </div>
          </div>

          {/* Movement Activity */}
          <div className="bg-black/40 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <SafeIcon icon={FiUsers} className="text-blue-400 w-6 h-6" />
              <h3 className="text-lg font-semibold text-blue-200">Civil Rights Activity</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">NAACP Branch:</span>
                <span className="text-green-400">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Voter Registration:</span>
                <span className={selectedLeaders.length > 2 ? 'text-green-400' : 'text-red-400'}>
                  {selectedLeaders.length > 2 ? 'Operational' : 'Planning'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Strategy Sessions:</span>
                <span className="text-blue-400">{selectedLeaders.length}/4</span>
              </div>
            </div>
          </div>

          {/* Historical Impact */}
          <div className="bg-black/40 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <SafeIcon icon={FiKey} className="text-blue-400 w-6 h-6" />
              <h3 className="text-lg font-semibold text-blue-200">Legacy Features</h3>
            </div>
            <div className="space-y-2">
              {houseFeatures.map((feature, index) => (
                <div key={feature.id} className="text-xs text-gray-300 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    unlockedFeatures.includes(feature.id) ? 'bg-green-500' : 'bg-gray-600'
                  }`}></div>
                  <span>{feature.name} ({feature.year})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Civil Rights Hub Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-black/60 backdrop-blur-lg rounded-2xl p-8 border border-blue-400/30"
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-display font-bold text-blue-400 mb-2">
            Amzie Moore's Civil Rights Hub
          </h3>
          <p className="text-blue-200">
            Moore's home became a "revolving dormitory" for civil rights leaders
          </p>
        </div>

        {/* House Timeline */}
        <div className="mb-8 p-4 bg-gray-800/30 rounded-lg">
          <div className="text-center text-sm text-gray-300 mb-2">
            Leaders Welcomed: {selectedLeaders.length}/4
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(selectedLeaders.length / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Civil Rights Leaders Layout */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-blue-200 mb-4 text-center">Civil Rights Strategy Sessions</h4>
          <div className="relative bg-gradient-to-br from-brown-900/50 to-blue-900/20 rounded-2xl p-8" style={{ height: '400px' }}>
            {civilRightsLeaders.map((leader) => {
              const isSelected = selectedLeaders.includes(leader.id);
              const selectionOrder = selectedLeaders.indexOf(leader.id) + 1;
              
              return (
                <div
                  key={leader.id}
                  className={`absolute w-28 h-28 rounded-lg border-2 cursor-pointer flex flex-col items-center justify-center transition-all transform ${
                    isSelected 
                      ? 'border-blue-400 bg-blue-400/30 scale-110' 
                      : 'border-gray-400 bg-gray-800/50 hover:border-blue-400/70 hover:scale-105'
                  }`}
                  style={{
                    left: `${leader.position.x}%`,
                    top: `${leader.position.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => handleLeaderClick(leader.id)}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-1">{leader.icon}</div>
                    <div className="text-xs text-blue-200 font-semibold text-center">{leader.name}</div>
                    <div className="text-xs text-gray-400">{leader.role}</div>
                    {isSelected && (
                      <div className="text-xs text-blue-400 font-bold mt-1">
                        #{selectionOrder}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* House Features Overlay */}
            {houseComplete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 pointer-events-none"
              >
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 bg-blue-400/60 rounded-full"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3
                    }}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* House Features Progress */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {houseFeatures.map((feature, index) => (
            <div key={feature.id} className="bg-gray-800/30 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">
                {feature.id === 'brick' ? '🧱' : 
                 feature.id === 'station' ? '⛽' :
                 feature.id === 'dormitory' ? '🛏️' : '🏛️'}
              </div>
              <div className="text-sm text-blue-200 font-semibold">{feature.name}</div>
              <div className="text-xs text-gray-400 mt-1">Est. {feature.year}</div>
              <div className="text-xs text-blue-400 mt-2">
                {unlockedFeatures.includes(feature.id) ? '✓ Unlocked' : `Step ${index + 1}`}
              </div>
            </div>
          ))}
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
            onClick={resetHouse}
            disabled={selectedLeaders.length === 0}
            className="px-6 py-3 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-400/30 rounded-lg text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <SafeIcon icon={FiRotateCcw} className="w-5 h-5" />
            Reset House
          </button>
        </div>

        {/* Success Display */}
        {houseComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-6 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg border border-green-400/50"
          >
            <div className="text-center">
              <div className="text-4xl mb-2">🏠</div>
              <h4 className="text-xl font-bold text-green-400 mb-2">Freedom Trail Museum Established!</h4>
              <p className="text-green-200">
                You've successfully recreated the historic sequence of civil rights leaders who used 
                Amzie Moore's home as their strategic headquarters. This house became the nerve center 
                of Mississippi's freedom movement.
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
              💡 <strong>Civil Rights Timeline:</strong><br/>
              1. <strong>Amzie Moore:</strong> Built the house (1941) and founded RCNL (1951)<br/>
              2. <strong>Martin Luther King Jr.:</strong> Stayed during Delta campaigns<br/>
              3. <strong>Fannie Lou Hamer:</strong> Co-founded MFDP, frequent visitor<br/>
              4. <strong>Bob Moses:</strong> Made the Delta SNCC's first full-time project (1961)
            </p>
          </motion.div>
        )}

        {/* Attempts Counter */}
        <div className="mt-4 text-center text-gray-400 text-sm">
          House Restoration Attempts: {attempts}
        </div>
      </motion.div>
    </div>
  );
}
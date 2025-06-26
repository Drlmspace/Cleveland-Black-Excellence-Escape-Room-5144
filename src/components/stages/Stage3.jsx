import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useAudio } from '../../context/AudioContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMusic, FiMic, FiHeadphones, FiHelpCircle, FiPlay, FiInfo, FiVolume2 } = FiIcons;

// Delta Blues Heritage Puzzle - GRAMMY Museum Mississippi
const bluesLegends = [
  { id: 'patton', name: 'Charley Patton', location: 'Dockery Farms', era: '1900s', icon: '🎸', influence: 'Delta Blues Pioneer' },
  { id: 'bbking', name: 'B.B. King', location: 'Indianola', era: '1940s-2015', icon: '🎵', influence: 'King of Blues' },
  { id: 'muddy', name: 'Muddy Waters', location: 'Stovall Plantation', era: '1940s', icon: '🎶', influence: 'Chicago Blues' },
  { id: 'johnson', name: 'Robert Johnson', location: 'Crossroads', era: '1930s', icon: '👹', influence: 'Crossroads Legend' }
];

const museumExhibits = [
  { id: 'dockery', name: 'Dockery Farms Exhibit', year: 1895, status: 'locked' },
  { id: 'trail', name: 'Mississippi Blues Trail', year: 2006, status: 'locked' },
  { id: 'grammy', name: 'GRAMMY Museum', year: 2016, status: 'locked' },
  { id: 'heritage', name: 'Delta Heritage Collection', year: 2023, status: 'locked' }
];

const correctBluesSequence = ['patton', 'johnson', 'muddy', 'bbking'];

export default function Stage3({ stage, stageId }) {
  const { dispatch } = useGame();
  const { playSound } = useAudio();
  const [selectedBlues, setSelectedBlues] = useState([]);
  const [unlockedExhibits, setUnlockedExhibits] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [museumComplete, setMuseumComplete] = useState(false);

  const handleBluesClick = (bluesId) => {
    if (selectedBlues.includes(bluesId)) return;
    
    const newSelected = [...selectedBlues, bluesId];
    setSelectedBlues(newSelected);
    playSound('click');

    // Unlock exhibits based on selection
    const exhibitIndex = newSelected.length - 1;
    if (exhibitIndex < museumExhibits.length) {
      setUnlockedExhibits(prev => [...prev, museumExhibits[exhibitIndex].id]);
      playSound('success');
    }

    // Check completion
    if (newSelected.length === 4) {
      setAttempts(prev => prev + 1);
      dispatch({ type: 'INCREMENT_ATTEMPTS', payload: { stageId } });
      
      if (JSON.stringify(newSelected) === JSON.stringify(correctBluesSequence)) {
        setIsPlaying(true);
        setMuseumComplete(true);
        playSound('unlock');
        
        setTimeout(() => {
          dispatch({
            type: 'COMPLETE_STAGE',
            payload: {
              stageId,
              card: {
                title: "GRAMMY Museum Mississippi",
                fact: "GRAMMY Museum Mississippi opened in Cleveland on 5 March 2016 to showcase Delta music rooted in Black culture. Dockery Farms, founded in 1895, is widely regarded as the birthplace of Delta blues, where Charley Patton influenced later giants."
              }
            }
          });
        }, 3000);
      } else {
        playSound('error');
        setTimeout(() => {
          setSelectedBlues([]);
          setUnlockedExhibits([]);
        }, 1500);
      }
    }
  };

  const useHint = () => {
    setShowHint(true);
    playSound('click');
    dispatch({ type: 'USE_HINT', payload: { stageId } });
  };

  const resetMuseum = () => {
    setSelectedBlues([]);
    setUnlockedExhibits([]);
    setIsPlaying(false);
    setMuseumComplete(false);
    playSound('click');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Instructions Panel */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-purple-900/30 border border-purple-400/50 rounded-lg p-6 mb-6"
      >
        <div className="flex items-start gap-4">
          <SafeIcon icon={FiInfo} className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-purple-300 mb-2">Blues Heritage Instructions</h3>
            <div className="space-y-2 text-purple-100">
              <p><strong>Step 1:</strong> Select Delta blues legends in chronological order of influence</p>
              <p><strong>Step 2:</strong> Watch museum exhibits unlock as you build the heritage timeline</p>
              <p><strong>Step 3:</strong> Complete the sequence to open the GRAMMY Museum Mississippi</p>
              <p className="text-purple-300 text-sm mt-3">💡 Start with Dockery Farms pioneer, follow the musical evolution</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cleveland GRAMMY Museum Setting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 rounded-2xl p-8 mb-8 border border-purple-400/30"
      >
        <div className="grid md:grid-cols-3 gap-6">
          {/* Museum Status */}
          <div className="bg-black/40 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <SafeIcon icon={FiMusic} className="text-purple-400 w-6 h-6" />
              <h3 className="text-lg font-semibold text-purple-200">GRAMMY Museum Mississippi</h3>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🏛️</div>
              <div className="text-sm text-purple-200">Cleveland, Mississippi</div>
              <div className="text-xs text-gray-400">Opened March 5, 2016</div>
              {museumComplete && (
                <div className="text-xs text-gold-400 mt-2 font-bold animate-pulse">
                  DELTA HERITAGE COMPLETE
                </div>
              )}
            </div>
          </div>

          {/* Blues Trail Status */}
          <div className="bg-black/40 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <SafeIcon icon={FiHeadphones} className="text-purple-400 w-6 h-6" />
              <h3 className="text-lg font-semibold text-purple-200">Mississippi Blues Trail</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Markers:</span>
                <span className="text-green-400">200+ (2017)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Started:</span>
                <span className="text-purple-400">2006</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Heritage:</span>
                <span className={selectedBlues.length > 2 ? 'text-green-400' : 'text-orange-400'}>
                  {selectedBlues.length > 2 ? 'Preserved' : 'Building'}
                </span>
              </div>
            </div>
          </div>

          {/* Audio Experience */}
          <div className="bg-black/40 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <SafeIcon icon={FiMic} className="text-purple-400 w-6 h-6" />
              <h3 className="text-lg font-semibold text-purple-200">Delta Audio</h3>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-gray-300">🎵 Dockery Farm Sessions</div>
              <div className="text-xs text-gray-300">🎸 Crossroads Legends</div>
              <div className="text-xs text-gray-300">🎶 Chicago Migration</div>
              <div className="text-xs text-gray-300">👑 B.B. King Legacy</div>
              <div className="text-center mt-3">
                {isPlaying ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-2xl"
                  >
                    🎵
                  </motion.div>
                ) : (
                  <div className="text-gray-500">🔇</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Blues Heritage Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-black/60 backdrop-blur-lg rounded-2xl p-8 border border-purple-400/30"
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-display font-bold text-purple-400 mb-2">
            Delta Blues Heritage Timeline
          </h3>
          <p className="text-purple-200">
            Trace the evolution from Dockery Farms to worldwide recognition
          </p>
        </div>

        {/* Heritage Progress */}
        <div className="mb-8 p-4 bg-gray-800/30 rounded-lg">
          <div className="text-center text-sm text-gray-300 mb-2">
            Blues Legends Selected: {selectedBlues.length}/4
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-purple-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(selectedBlues.length / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Blues Legends Selection */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-purple-200 mb-4 text-center">Delta Blues Legends</h4>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {bluesLegends.map((legend) => {
              const isSelected = selectedBlues.includes(legend.id);
              const selectionOrder = selectedBlues.indexOf(legend.id) + 1;
              
              return (
                <motion.div
                  key={legend.id}
                  onClick={() => handleBluesClick(legend.id)}
                  className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-purple-400 bg-purple-400/20 scale-105' 
                      : 'border-gray-400 bg-gray-800/50 hover:border-purple-400/70 hover:scale-102'
                  }`}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{legend.icon}</div>
                    <div className="text-lg font-bold text-purple-200 mb-1">{legend.name}</div>
                    <div className="text-sm text-purple-300 mb-2">{legend.location}</div>
                    <div className="text-xs text-gray-400 mb-1">{legend.era}</div>
                    <div className="text-xs text-blue-400">{legend.influence}</div>
                    {isSelected && (
                      <div className="text-xs text-purple-400 font-bold mt-2">
                        #{selectionOrder}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Museum Exhibits */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-purple-200 mb-4 text-center">Museum Exhibits</h4>
          <div className="grid grid-cols-4 gap-4">
            {museumExhibits.map((exhibit, index) => (
              <div key={exhibit.id} className="bg-gray-800/30 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">
                  {exhibit.id === 'dockery' ? '🏚️' : 
                   exhibit.id === 'trail' ? '🛤️' :
                   exhibit.id === 'grammy' ? '🏆' : '📜'}
                </div>
                <div className="text-sm text-purple-200 font-semibold">{exhibit.name}</div>
                <div className="text-xs text-gray-400 mt-1">Est. {exhibit.year}</div>
                <div className="text-xs text-purple-400 mt-2">
                  {unlockedExhibits.includes(exhibit.id) ? '✓ Open' : `Level ${index + 1}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delta Heritage Map */}
        <div className="relative bg-gradient-to-br from-purple-900/50 to-indigo-900/20 rounded-2xl p-8 mb-8 border border-purple-400/30" style={{ height: '300px' }}>
          {/* Dockery Farms */}
          <div className="absolute left-1/4 top-1/3 text-center">
            <div className="text-2xl mb-1">🏚️</div>
            <div className="text-xs text-purple-200">Dockery Farms</div>
            <div className="text-xs text-gray-400">Birthplace of Blues</div>
          </div>
          
          {/* Crossroads */}
          <div className="absolute right-1/4 top-1/2 text-center">
            <div className="text-2xl mb-1">✖️</div>
            <div className="text-xs text-purple-200">Crossroads</div>
            <div className="text-xs text-gray-400">Highway 61 & 49</div>
          </div>
          
          {/* Cleveland */}
          <div className="absolute left-1/2 bottom-1/4 text-center transform -translate-x-1/2">
            <div className="text-3xl mb-1">🏛️</div>
            <div className="text-sm text-purple-200 font-bold">Cleveland</div>
            <div className="text-xs text-gold-400">GRAMMY Museum</div>
          </div>

          {/* Musical Notes Animation */}
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 pointer-events-none"
            >
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-purple-400/60 text-xl"
                  style={{
                    left: `${10 + Math.random() * 80}%`,
                    top: `${10 + Math.random() * 80}%`
                  }}
                  animate={{
                    y: [-10, -30, -10],
                    opacity: [0.6, 1, 0.6],
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                >
                  ♪
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
            onClick={resetMuseum}
            disabled={selectedBlues.length === 0}
            className="px-6 py-3 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-400/30 rounded-lg text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <SafeIcon icon={FiVolume2} className="w-5 h-5" />
            Reset Heritage
          </button>
        </div>

        {/* Success Display */}
        {museumComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-6 bg-gradient-to-r from-purple-600/20 to-gold-600/20 rounded-lg border border-purple-400/50"
          >
            <div className="text-center">
              <div className="text-4xl mb-2">🎵</div>
              <h4 className="text-xl font-bold text-purple-400 mb-2">GRAMMY Museum Complete!</h4>
              <p className="text-purple-200 mb-4">
                You've successfully traced the Delta blues heritage from Charley Patton at Dockery Farms 
                through Robert Johnson's crossroads legend to the worldwide recognition celebrated at the 
                GRAMMY Museum Mississippi in Cleveland!
              </p>
              <div className="bg-black/40 rounded-lg p-4 text-sm">
                <div className="text-purple-400 font-bold mb-2">Now Playing: Delta Heritage Collection</div>
                <div className="text-gray-300">
                  🎸 Dockery Farm Sessions → 👹 Crossroads Legends → 🎶 Chicago Migration → 👑 B.B. King Legacy
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
              💡 <strong>Blues Heritage Timeline:</strong><br/>
              1. <strong>Charley Patton:</strong> Delta Blues pioneer at Dockery Farms (1900s)<br/>
              2. <strong>Robert Johnson:</strong> Crossroads legend and influence (1930s)<br/>
              3. <strong>Muddy Waters:</strong> Recorded at Stovall, moved to Chicago (1940s)<br/>
              4. <strong>B.B. King:</strong> From Indianola to worldwide blues royalty
            </p>
          </motion.div>
        )}

        {/* Attempts Counter */}
        <div className="mt-4 text-center text-gray-400 text-sm">
          Heritage Timeline Attempts: {attempts}
        </div>
      </motion.div>
    </div>
  );
}
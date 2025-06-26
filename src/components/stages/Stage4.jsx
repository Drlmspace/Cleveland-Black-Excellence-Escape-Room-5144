import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useAudio } from '../../context/AudioContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiDollarSign, FiTruck, FiHome, FiHelpCircle, FiTrendingUp, FiInfo, FiRefreshCw } = FiIcons;

// Black Entrepreneurship Puzzle - Mississippi Delta Business Heritage
const deltaBusinesses = [
  { 
    id: 'moundBayou', 
    name: 'Mound Bayou', 
    year: 1887, 
    type: 'All-Black Town',
    founder: 'Isaiah T. Montgomery',
    icon: '🏘️',
    impact: 'Self-governing community'
  },
  { 
    id: 'hospital', 
    name: 'Tabor Hospital', 
    year: 1942, 
    type: 'Healthcare',
    founder: 'T.R.M. Howard',
    icon: '🏥',
    impact: 'First Black-owned hospital'
  },
  { 
    id: 'catfish', 
    name: 'Scott Catfish Farm', 
    year: 1982, 
    type: 'Agriculture',
    founder: 'Ed Scott Jr.',
    icon: '🐟',
    impact: 'Foreign export markets'
  },
  { 
    id: 'pharmacy', 
    name: 'Henry Pharmacy', 
    year: 1950, 
    type: 'Healthcare/Activism',
    founder: 'Aaron Henry',
    icon: '💊',
    impact: 'NAACP headquarters basement'
  }
];

const businessMilestones = [
  { year: 1887, event: 'Mound Bayou Founded', completed: false },
  { year: 1942, event: 'First Black Hospital Opens', completed: false },
  { year: 1950, event: 'Civil Rights Pharmacy', completed: false },
  { year: 1982, event: 'Delta Catfish Export', completed: false }
];

const correctBusinessOrder = ['moundBayou', 'hospital', 'pharmacy', 'catfish'];

export default function Stage4({ stage, stageId }) {
  const { dispatch } = useGame();
  const { playSound } = useAudio();
  const [selectedBusinesses, setSelectedBusinesses] = useState([]);
  const [completedMilestones, setCompletedMilestones] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [economyComplete, setEconomyComplete] = useState(false);
  const [totalImpact, setTotalImpact] = useState(0);

  const handleBusinessClick = (businessId) => {
    if (selectedBusinesses.includes(businessId)) return;
    
    const newSelected = [...selectedBusinesses, businessId];
    setSelectedBusinesses(newSelected);
    playSound('click');

    // Complete milestones based on selection
    const milestoneIndex = newSelected.length - 1;
    if (milestoneIndex < businessMilestones.length) {
      setCompletedMilestones(prev => [...prev, milestoneIndex]);
      setTotalImpact(prev => prev + 25); // Each business adds 25% impact
      playSound('success');
    }

    // Check completion
    if (newSelected.length === 4) {
      setAttempts(prev => prev + 1);
      dispatch({ type: 'INCREMENT_ATTEMPTS', payload: { stageId } });
      
      if (JSON.stringify(newSelected) === JSON.stringify(correctBusinessOrder)) {
        setEconomyComplete(true);
        setTotalImpact(100);
        playSound('unlock');
        
        setTimeout(() => {
          dispatch({
            type: 'COMPLETE_STAGE',
            payload: {
              stageId,
              card: {
                title: "Delta Black Entrepreneurship",
                fact: "Isaiah T. Montgomery—born enslaved on Jefferson Davis's plantation—co-founded Mound Bayou in 1887 as an all-Black, self-governing town. T.R.M. Howard founded the Delta's first Black-owned hospital in 1942, and Ed Scott Jr. became the Delta's first Black catfish farmer in 1982."
              }
            }
          });
        }, 2000);
      } else {
        playSound('error');
        setTimeout(() => {
          setSelectedBusinesses([]);
          setCompletedMilestones([]);
          setTotalImpact(0);
        }, 1500);
      }
    }
  };

  const useHint = () => {
    setShowHint(true);
    playSound('click');
    dispatch({ type: 'USE_HINT', payload: { stageId } });
  };

  const resetEconomy = () => {
    setSelectedBusinesses([]);
    setCompletedMilestones([]);
    setEconomyComplete(false);
    setTotalImpact(0);
    playSound('click');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Instructions Panel */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-emerald-900/30 border border-emerald-400/50 rounded-lg p-6 mb-6"
      >
        <div className="flex items-start gap-4">
          <SafeIcon icon={FiInfo} className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-emerald-300 mb-2">Business Heritage Instructions</h3>
            <div className="space-y-2 text-emerald-100">
              <p><strong>Step 1:</strong> Select Delta Black businesses in chronological order</p>
              <p><strong>Step 2:</strong> Watch the economic impact timeline build</p>
              <p><strong>Step 3:</strong> Complete the sequence to showcase entrepreneurial legacy</p>
              <p className="text-emerald-300 text-sm mt-3">💡 Start with the all-Black town, follow the economic evolution</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Delta Economic Setting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-emerald-900/20 to-green-900/20 rounded-2xl p-8 mb-8 border border-emerald-400/30"
      >
        <div className="grid md:grid-cols-3 gap-6">
          {/* Economic Impact */}
          <div className="bg-black/40 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <SafeIcon icon={FiDollarSign} className="text-emerald-400 w-6 h-6" />
              <h3 className="text-lg font-semibold text-emerald-200">Economic Impact</h3>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">{totalImpact}%</div>
              <div className="text-sm text-emerald-200">Community Development</div>
              <div className="w-full bg-gray-700 rounded-full h-3 mt-3">
                <motion.div
                  className="bg-emerald-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${totalImpact}%` }}
                />
              </div>
            </div>
          </div>

          {/* Business Sectors */}
          <div className="bg-black/40 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <SafeIcon icon={FiTruck} className="text-emerald-400 w-6 h-6" />
              <h3 className="text-lg font-semibold text-emerald-200">Business Sectors</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Governance:</span>
                <span className={selectedBusinesses.includes('moundBayou') ? 'text-green-400' : 'text-gray-500'}>
                  {selectedBusinesses.includes('moundBayou') ? 'Self-Rule' : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Healthcare:</span>
                <span className={selectedBusinesses.includes('hospital') ? 'text-green-400' : 'text-gray-500'}>
                  {selectedBusinesses.includes('hospital') ? 'Established' : 'Needed'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Agriculture:</span>
                <span className={selectedBusinesses.includes('catfish') ? 'text-green-400' : 'text-gray-500'}>
                  {selectedBusinesses.includes('catfish') ? 'Export Ready' : 'Traditional'}
                </span>
              </div>
            </div>
          </div>

          {/* Community Development */}
          <div className="bg-black/40 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <SafeIcon icon={FiHome} className="text-emerald-400 w-6 h-6" />
              <h3 className="text-lg font-semibold text-emerald-200">Community Growth</h3>
            </div>
            <div className="space-y-2">
              {businessMilestones.map((milestone, index) => (
                <div key={index} className="text-xs text-gray-300 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    completedMilestones.includes(index) ? 'bg-emerald-500 animate-pulse' : 'bg-gray-600'
                  }`}></div>
                  <span>{milestone.year}: {milestone.event}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Business Heritage Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-black/60 backdrop-blur-lg rounded-2xl p-8 border border-emerald-400/30"
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-display font-bold text-emerald-400 mb-2">
            Delta Black Business Heritage
          </h3>
          <p className="text-emerald-200">
            From self-governing towns to innovative agriculture - building economic independence
          </p>
        </div>

        {/* Business Progress */}
        <div className="mb-8 p-4 bg-gray-800/30 rounded-lg">
          <div className="text-center text-sm text-gray-300 mb-2">
            Businesses Established: {selectedBusinesses.length}/4
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-emerald-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(selectedBusinesses.length / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Delta Businesses Selection */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-emerald-200 mb-4 text-center">Pioneering Delta Businesses</h4>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {deltaBusinesses.map((business) => {
              const isSelected = selectedBusinesses.includes(business.id);
              const selectionOrder = selectedBusinesses.indexOf(business.id) + 1;
              
              return (
                <motion.div
                  key={business.id}
                  onClick={() => handleBusinessClick(business.id)}
                  className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-emerald-400 bg-emerald-400/20 scale-105' 
                      : 'border-gray-400 bg-gray-800/50 hover:border-emerald-400/70 hover:scale-102'
                  }`}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{business.icon}</div>
                    <div className="text-lg font-bold text-emerald-200 mb-1">{business.name}</div>
                    <div className="text-sm text-emerald-300 mb-2">{business.type}</div>
                    <div className="text-xs text-gray-400 mb-1">Founded: {business.year}</div>
                    <div className="text-xs text-blue-400 mb-2">{business.founder}</div>
                    <div className="text-xs text-purple-400">{business.impact}</div>
                    {isSelected && (
                      <div className="text-xs text-emerald-400 font-bold mt-2">
                        #{selectionOrder}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Economic Timeline */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {businessMilestones.map((milestone, index) => (
            <div key={index} className="bg-gray-800/30 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-emerald-400 mb-2">{milestone.year}</div>
              <div className="text-xs text-gray-200">{milestone.event}</div>
              <div className="text-xs text-emerald-400 mt-2">
                {completedMilestones.includes(index) ? '✓ Established' : `Era ${index + 1}`}
              </div>
            </div>
          ))}
        </div>

        {/* Delta Business Map */}
        <div className="relative bg-gradient-to-br from-emerald-900/50 to-green-900/20 rounded-2xl p-8 mb-8 border border-emerald-400/30" style={{ height: '300px' }}>
          {/* Mound Bayou */}
          <div className="absolute left-1/4 top-1/4 text-center">
            <div className="text-2xl mb-1">🏘️</div>
            <div className="text-xs text-emerald-200">Mound Bayou</div>
            <div className="text-xs text-gray-400">All-Black Town</div>
          </div>
          
          {/* Hospital */}
          <div className="absolute right-1/4 top-1/3 text-center">
            <div className="text-2xl mb-1">🏥</div>
            <div className="text-xs text-emerald-200">Tabor Hospital</div>
            <div className="text-xs text-gray-400">Healthcare Pioneer</div>
          </div>
          
          {/* Pharmacy */}
          <div className="absolute left-1/3 bottom-1/3 text-center">
            <div className="text-2xl mb-1">💊</div>
            <div className="text-xs text-emerald-200">Henry Pharmacy</div>
            <div className="text-xs text-gray-400">Civil Rights Hub</div>
          </div>
          
          {/* Catfish Farm */}
          <div className="absolute right-1/3 bottom-1/4 text-center">
            <div className="text-2xl mb-1">🐟</div>
            <div className="text-xs text-emerald-200">Scott Catfish</div>
            <div className="text-xs text-gray-400">Export Innovation</div>
          </div>

          {/* Economic Growth Animation */}
          {economyComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 pointer-events-none"
            >
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-emerald-400/60 text-xl"
                  style={{
                    left: `${10 + Math.random() * 80}%`,
                    top: `${10 + Math.random() * 80}%`
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                >
                  💰
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
            onClick={resetEconomy}
            disabled={selectedBusinesses.length === 0}
            className="px-6 py-3 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-400/30 rounded-lg text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <SafeIcon icon={FiRefreshCw} className="w-5 h-5" />
            Reset Economy
          </button>
        </div>

        {/* Success Display */}
        {economyComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-6 bg-gradient-to-r from-emerald-600/20 to-green-600/20 rounded-lg border border-emerald-400/50"
          >
            <div className="text-center">
              <div className="text-4xl mb-2">💼</div>
              <h4 className="text-xl font-bold text-emerald-400 mb-2">Economic Legacy Complete!</h4>
              <p className="text-emerald-200 mb-4">
                You've successfully traced Delta Black entrepreneurship from Isaiah Montgomery's 
                revolutionary Mound Bayou in 1887 through T.R.M. Howard's healthcare innovation 
                to Ed Scott Jr.'s agricultural exports - building economic independence across generations!
              </p>
              <div className="bg-black/40 rounded-lg p-4 text-sm">
                <div className="text-emerald-400 font-bold mb-2">Economic Impact: 100% Community Development</div>
                <div className="text-gray-300">
                  🏘️ Self-Governance → 🏥 Healthcare Access → 💊 Civil Rights Hub → 🐟 Global Markets
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
              💡 <strong>Business Heritage Timeline:</strong><br/>
              1. <strong>Mound Bayou (1887):</strong> Isaiah Montgomery's all-Black self-governing town<br/>
              2. <strong>Tabor Hospital (1942):</strong> T.R.M. Howard's first Black-owned hospital<br/>
              3. <strong>Henry Pharmacy (1950):</strong> Aaron Henry's civil rights headquarters<br/>
              4. <strong>Scott Catfish (1982):</strong> Ed Scott Jr.'s international export innovation
            </p>
          </motion.div>
        )}

        {/* Attempts Counter */}
        <div className="mt-4 text-center text-gray-400 text-sm">
          Economic Development Attempts: {attempts}
        </div>
      </motion.div>
    </div>
  );
}
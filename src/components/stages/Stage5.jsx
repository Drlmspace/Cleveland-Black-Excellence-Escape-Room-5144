import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useAudio } from '../../context/AudioContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBookOpen, FiUsers, FiAward, FiHelpCircle, FiGraduationCap, FiInfo, FiRefreshCw } = FiIcons;

// Education & Leadership Puzzle - Cleveland School Integration & Beyond
const educationMilestones = [
  { 
    id: 'integration1965', 
    year: 1965, 
    event: 'Cleveland High Integration',
    description: 'First Delta freedom-of-choice plan',
    leader: 'Cleveland Students',
    icon: '🏫',
    impact: 'Broke segregation barrier'
  },
  { 
    id: 'lawsuit1965', 
    year: 1965, 
    event: 'Desegregation Lawsuit Filed',
    description: '50-year legal battle begins',
    leader: 'Civil Rights Lawyers',
    icon: '⚖️',
    impact: 'Legal precedent set'
  },
  { 
    id: 'merger2016', 
    year: 2016, 
    event: 'Federal Court Order',
    description: 'Merge racially divided schools',
    leader: 'Federal Judge',
    icon: '🏛️',
    impact: 'Dual system ended'
  },
  { 
    id: 'central2017', 
    year: 2017, 
    event: 'Cleveland Central Opens',
    description: 'Integrated high school campus',
    leader: 'Unified Community',
    icon: '🎓',
    impact: 'True integration achieved'
  }
];

const communityPrograms = [
  { id: 'juneteenth', name: 'Juneteenth Celebrations', status: 'locked', year: 2024 },
  { id: 'arts', name: 'Crosstie Arts Festival', status: 'locked', year: 'Annual' },
  { id: 'heritage', name: 'Delta Heritage Center', status: 'locked', year: 'Ongoing' },
  { id: 'future', name: 'Next Generation Leaders', status: 'locked', year: 'Future' }
];

const correctEducationOrder = ['integration1965', 'lawsuit1965', 'merger2016', 'central2017'];

export default function Stage5({ stage, stageId }) {
  const { dispatch } = useGame();
  const { playSound } = useAudio();
  const [selectedMilestones, setSelectedMilestones] = useState([]);
  const [unlockedPrograms, setUnlockedPrograms] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [educationComplete, setEducationComplete] = useState(false);

  const handleMilestoneClick = (milestoneId) => {
    if (selectedMilestones.includes(milestoneId)) return;
    
    const newSelected = [...selectedMilestones, milestoneId];
    setSelectedMilestones(newSelected);
    playSound('click');

    // Unlock community programs based on selection
    const programIndex = newSelected.length - 1;
    if (programIndex < communityPrograms.length) {
      setUnlockedPrograms(prev => [...prev, communityPrograms[programIndex].id]);
      playSound('success');
    }

    // Check completion
    if (newSelected.length === 4) {
      setAttempts(prev => prev + 1);
      dispatch({ type: 'INCREMENT_ATTEMPTS', payload: { stageId } });
      
      if (JSON.stringify(newSelected) === JSON.stringify(correctEducationOrder)) {
        setEducationComplete(true);
        playSound('unlock');
        
        setTimeout(() => {
          dispatch({
            type: 'COMPLETE_STAGE',
            payload: {
              stageId,
              card: {
                title: "Cleveland Education Integration",
                fact: "Cleveland High School accepted Black students under a freedom-of-choice plan in 1965, the first such integration in the Delta. After a 50-year lawsuit, Cleveland Central High School opened in August 2017 as a truly integrated campus."
              }
            }
          });
        }, 2000);
      } else {
        playSound('error');
        setTimeout(() => {
          setSelectedMilestones([]);
          setUnlockedPrograms([]);
        }, 1500);
      }
    }
  };

  const useHint = () => {
    setShowHint(true);
    playSound('click');
    dispatch({ type: 'USE_HINT', payload: { stageId } });
  };

  const resetEducation = () => {
    setSelectedMilestones([]);
    setUnlockedPrograms([]);
    setEducationComplete(false);
    playSound('click');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Instructions Panel */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-indigo-900/30 border border-indigo-400/50 rounded-lg p-6 mb-6"
      >
        <div className="flex items-start gap-4">
          <SafeIcon icon={FiInfo} className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-indigo-300 mb-2">Education Integration Instructions</h3>
            <div className="space-y-2 text-indigo-100">
              <p><strong>Step 1:</strong> Select education milestones in chronological order</p>
              <p><strong>Step 2:</strong> Watch community programs unlock as integration progresses</p>
              <p><strong>Step 3:</strong> Complete the 52-year journey to true school integration</p>
              <p className="text-indigo-300 text-sm mt-3">💡 Start with 1965 integration, follow the legal timeline</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cleveland Schools Setting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-2xl p-8 mb-8 border border-indigo-400/30"
      >
        <div className="grid md:grid-cols-3 gap-6">
          {/* School System Status */}
          <div className="bg-black/40 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <SafeIcon icon={FiBookOpen} className="text-indigo-400 w-6 h-6" />
              <h3 className="text-lg font-semibold text-indigo-200">Cleveland Schools</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Integration:</span>
                <span className={educationComplete ? 'text-green-400' : 'text-orange-400'}>
                  {educationComplete ? 'Complete' : 'In Progress'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Lawsuit Duration:</span>
                <span className="text-indigo-400">52 Years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Central HS:</span>
                <span className={selectedMilestones.includes('central2017') ? 'text-green-400' : 'text-gray-500'}>
                  {selectedMilestones.includes('central2017') ? 'Unified' : 'Divided'}
                </span>
              </div>
            </div>
          </div>

          {/* Community Impact */}
          <div className="bg-black/40 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <SafeIcon icon={FiUsers} className="text-indigo-400 w-6 h-6" />
              <h3 className="text-lg font-semibold text-indigo-200">Community Programs</h3>
            </div>
            <div className="space-y-2">
              {communityPrograms.map((program, index) => (
                <div key={program.id} className="text-xs text-gray-300 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    unlockedPrograms.includes(program.id) ? 'bg-indigo-500 animate-pulse' : 'bg-gray-600'
                  }`}></div>
                  <span>{program.name} ({program.year})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Educational Legacy */}
          <div className="bg-black/40 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <SafeIcon icon={FiGraduationCap} className="text-indigo-400 w-6 h-6" />
              <h3 className="text-lg font-semibold text-indigo-200">Legacy Impact</h3>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">
                {educationComplete ? '🎓' : '📚'}
              </div>
              <div className="text-sm text-indigo-200 font-semibold">
                {educationComplete ? 'Integrated Excellence' : 'Building Unity'}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Progress: {selectedMilestones.length}/4
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Education Timeline Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-black/60 backdrop-blur-lg rounded-2xl p-8 border border-indigo-400/30"
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-display font-bold text-indigo-400 mb-2">
            Cleveland School Integration Journey
          </h3>
          <p className="text-indigo-200">
            52 years from first integration to true unified education
          </p>
        </div>

        {/* Integration Progress */}
        <div className="mb-8 p-4 bg-gray-800/30 rounded-lg">
          <div className="text-center text-sm text-gray-300 mb-2">
            Milestones Achieved: {selectedMilestones.length}/4
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-indigo-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(selectedMilestones.length / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Education Milestones Selection */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-indigo-200 mb-4 text-center">Integration Timeline</h4>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {educationMilestones.map((milestone) => {
              const isSelected = selectedMilestones.includes(milestone.id);
              const selectionOrder = selectedMilestones.indexOf(milestone.id) + 1;
              
              return (
                <motion.div
                  key={milestone.id}
                  onClick={() => handleMilestoneClick(milestone.id)}
                  className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-indigo-400 bg-indigo-400/20 scale-105' 
                      : 'border-gray-400 bg-gray-800/50 hover:border-indigo-400/70 hover:scale-102'
                  }`}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{milestone.icon}</div>
                    <div className="text-lg font-bold text-indigo-400 mb-1">{milestone.year}</div>
                    <div className="text-sm text-indigo-200 font-semibold mb-2">{milestone.event}</div>
                    <div className="text-xs text-gray-300 mb-2">{milestone.description}</div>
                    <div className="text-xs text-purple-400 mb-1">{milestone.leader}</div>
                    <div className="text-xs text-green-400">{milestone.impact}</div>
                    {isSelected && (
                      <div className="text-xs text-indigo-400 font-bold mt-2">
                        #{selectionOrder}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Community Programs Progress */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {communityPrograms.map((program, index) => (
            <div key={program.id} className="bg-gray-800/30 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">
                {program.id === 'juneteenth' ? '🎉' : 
                 program.id === 'arts' ? '🎨' :
                 program.id === 'heritage' ? '🏛️' : '🌟'}
              </div>
              <div className="text-sm text-indigo-200 font-semibold">{program.name}</div>
              <div className="text-xs text-gray-400 mt-1">{program.year}</div>
              <div className="text-xs text-indigo-400 mt-2">
                {unlockedPrograms.includes(program.id) ? '✓ Active' : `Phase ${index + 1}`}
              </div>
            </div>
          ))}
        </div>

        {/* Cleveland Central High School Visualization */}
        <div className="relative bg-gradient-to-br from-indigo-900/50 to-purple-900/20 rounded-2xl p-8 mb-8 border border-indigo-400/30" style={{ height: '300px' }}>
          {/* School Building */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <motion.div
              animate={educationComplete ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-2"
            >
              {educationComplete ? '🏫' : '🏗️'}
            </motion.div>
            <div className="text-lg text-indigo-200 font-bold">Cleveland Central High</div>
            <div className="text-sm text-gray-400">
              {educationComplete ? 'Integrated Campus (2017)' : 'Under Development'}
            </div>
          </div>

          {/* Student Diversity Animation */}
          {educationComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 pointer-events-none"
            >
              {/* Diverse student icons around the school */}
              {[
                { icon: '👨🏿‍🎓', pos: { left: '20%', top: '20%' } },
                { icon: '👩🏻‍🎓', pos: { left: '80%', top: '20%' } },
                { icon: '👨🏻‍🎓', pos: { left: '20%', top: '80%' } },
                { icon: '👩🏿‍🎓', pos: { left: '80%', top: '80%' } },
              ].map((student, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  style={student.pos}
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5
                  }}
                >
                  {student.icon}
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
            onClick={resetEducation}
            disabled={selectedMilestones.length === 0}
            className="px-6 py-3 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-400/30 rounded-lg text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <SafeIcon icon={FiRefreshCw} className="w-5 h-5" />
            Reset Timeline
          </button>
        </div>

        {/* Success Display */}
        {educationComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-lg border border-indigo-400/50"
          >
            <div className="text-center">
              <div className="text-4xl mb-2">🎓</div>
              <h4 className="text-xl font-bold text-indigo-400 mb-2">Integration Journey Complete!</h4>
              <p className="text-indigo-200 mb-4">
                You've successfully traced Cleveland's 52-year journey from the first Delta freedom-of-choice 
                integration in 1965 to the opening of truly unified Cleveland Central High School in 2017. 
                This achievement represents generations of perseverance and community dedication.
              </p>
              <div className="bg-black/40 rounded-lg p-4 text-sm">
                <div className="text-indigo-400 font-bold mb-2">Educational Legacy: From Segregation to Unity</div>
                <div className="text-gray-300">
                  🏫 First Integration → ⚖️ Legal Challenge → 🏛️ Federal Order → 🎓 True Unity Achieved
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
              💡 <strong>Education Integration Timeline:</strong><br/>
              1. <strong>1965 Integration:</strong> Cleveland High accepts Black students (first in Delta)<br/>
              2. <strong>1965 Lawsuit:</strong> Desegregation lawsuit filed (50-year battle begins)<br/>
              3. <strong>2016 Court Order:</strong> Federal judge orders merger of divided schools<br/>
              4. <strong>2017 Central HS:</strong> Cleveland Central High opens as unified campus
            </p>
          </motion.div>
        )}

        {/* Attempts Counter */}
        <div className="mt-4 text-center text-gray-400 text-sm">
          Integration Timeline Attempts: {attempts}
        </div>
      </motion.div>
    </div>
  );
}
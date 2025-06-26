import React from 'react';
import { motion } from 'framer-motion';
import Stage1 from './stages/Stage1';
import Stage2 from './stages/Stage2';
import Stage3 from './stages/Stage3';
import Stage4 from './stages/Stage4';
import Stage5 from './stages/Stage5';
import Stage6 from './stages/Stage6';

const stageComponents = {
  0: Stage1,
  1: Stage2,
  2: Stage3,
  3: Stage4,
  4: Stage5,
  5: Stage6
};

export default function StageContainer({ stage, stageId }) {
  const StageComponent = stageComponents[stageId];

  if (!StageComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl mb-4">Stage not found</h2>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      key={stageId}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen p-4"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 text-center"
        >
          <h2 className="text-4xl font-display font-bold text-delta-gold mb-2">
            {stage.title}
          </h2>
          <p className="text-xl text-delta-cream mb-4">
            {stage.setting}
          </p>
          <p className="text-gray-300 max-w-3xl mx-auto">
            {stage.description}
          </p>
        </motion.div>

        <StageComponent stage={stage} stageId={stageId} />
      </div>
    </motion.div>
  );
}
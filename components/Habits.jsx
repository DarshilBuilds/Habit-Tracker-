import React from 'react'
import { motion } from 'framer-motion'
import OverallProgressCard from '../model/OverallProgressCard'
import Habitcard from '../model/Habitcard'
import Dailyprogessgraph from '../model/Dailyprogessgraph';

// Reusable variants
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12
    }
  }
};

function Habits() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={fadeUp} transition={{ duration: 0.4, ease: 'easeOut' }}>
        <h1 className="h-9 font-bold text-[30px] leading-9 tracking-normal text-[#0D1828] dark:text-white rounded-none">
          Habit Tracker
        </h1>
        <p className="mt-1 h-5 font-normal text-[14px] leading-5 tracking-normal text-[#475565] dark:text-gray-400 rounded-none">
          Track your daily habits and build consistency
        </p>
      </motion.div>

      <div>
        <div className='flex gap-3 align-center items-center'>
          {/* Habit Card */}
          <motion.div
            className='flex mt-5'
            variants={fadeUp}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <Habitcard />
          </motion.div>

          {/* Overall Progress Card */}
          <motion.div
            className='m-5'
            variants={fadeUp}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <OverallProgressCard />
          </motion.div>
        </div>

        {/* Graph */}
        <motion.div
          className='mt-5'
          variants={fadeUp}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Dailyprogessgraph />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Habits;
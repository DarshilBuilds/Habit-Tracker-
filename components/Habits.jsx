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
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
      <motion.div
        variants={fadeUp}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)]/90 p-6 shadow-[0_10px_30px_var(--shadow)] sm:p-8"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center rounded-full border border-[var(--accent)]/20 bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              Daily Ritual Hub
            </div>
            <h1 className="text-[30px] font-bold leading-tight text-[var(--text)]">
              Habit Tracker
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
              Track your daily habits and keep momentum going with a calm, focused experience.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-sm text-[var(--text-muted)]">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
            Local-first • private
          </div>
        </div>
      </motion.div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_0.8fr] xl:items-start">
        <motion.div className="min-w-0" variants={fadeUp} transition={{ duration: 0.4, ease: 'easeOut' }}>
          <Habitcard />
        </motion.div>

        <motion.div className="min-w-0" variants={fadeUp} transition={{ duration: 0.4, ease: 'easeOut' }}>
          <OverallProgressCard />
        </motion.div>
      </div>

      <motion.div className="mt-6" variants={fadeUp} transition={{ duration: 0.4, ease: 'easeOut' }}>
        <Dailyprogessgraph />
      </motion.div>
    </motion.div>
  );
}

export default Habits;
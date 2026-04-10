import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Zap, Users, Heart, Circle } from 'lucide-react';

const stats = [
  {
    icon: Target,
    title: "Focus on What Matters",
    desc: "Skills over resumes",
    color: 'cyan',
  },
  {
    icon: Zap,
    title: "Simplify Hiring",
    desc: "Faster, fairer process",
    color: 'blue',
  },
  {
    icon: Users,
    title: "Build Confidence",
    desc: "Trust in every match",
    color: 'green',
  },
  {
    icon: Heart,
    title: "Human-Centered",
    desc: "People first approach",
    color: 'purple',
  },
];

interface Stat {
  icon: React.ElementType;
  title: string;
  desc: string;
  color: string;
}

const StatsSlideshow: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % stats.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="relative w-full max-w-[540px] space-y-6">
      {/* Slides */}
      <div className="relative h-[240px] lg:h-[280px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-slate-800/70 backdrop-blur-md border border-white/15 rounded-3xl shadow-2xl shadow-slate-900/50 hover:shadow-slate-900/70 transition-all duration-300 cursor-default"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className={`w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center mb-6 ${
                stats[currentIndex].color === 'cyan' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' :
                stats[currentIndex].color === 'blue' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                stats[currentIndex].color === 'green' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                'bg-purple-500/20 text-purple-400 border-purple-500/30'
              } border-2 shadow-lg shadow-[currentColor]/25`}
            >
              {React.createElement(stats[currentIndex].icon, { size: 24, className: "lg:size-28" })}
            </motion.div>
            <motion.p
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-3xl lg:text-4xl xl:text-5xl font-black text-white mb-4 tracking-tight leading-tight"
            >
              {stats[currentIndex].title}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-lg lg:text-xl font-semibold text-slate-200 tracking-wide"
            >
              {stats[currentIndex].desc}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots Navigation */}
      <div className="flex items-center justify-center gap-2">
        {stats.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white w-8 scale-125 shadow-lg shadow-white/50'
                : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default StatsSlideshow;

import React from 'react';
import { ChevronRight, ChevronLeft, Play, Pause, RotateCcw, Copy, Check, SkipBack } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { MOVES_DATA } from '../lib/movesData';

interface StepsPanelProps {
  steps: string[];
  currentStep: number;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onRestart: () => void;
  isPlaying: boolean;
  onCopy: () => void;
  copied: boolean;
}

export const StepsPanel: React.FC<StepsPanelProps> = ({
  steps,
  currentStep,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onRestart,
  isPlaying,
  onCopy,
  copied,
}) => {
  if (steps.length === 0) return null;

  const currentMove = currentStep >= 0 && currentStep < steps.length ? steps[currentStep] : null;
  const moveInfo = currentMove ? MOVES_DATA.find(m => m.move === currentMove) : null;
  
  const progress = ((currentStep) / steps.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6 p-6 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl"
    >
      {/* Header & Main Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            Solution Steps
            <span className="text-xs font-normal text-white/40 bg-white/5 px-2 py-1 rounded-full">
              {steps.length} moves
            </span>
          </h3>
          <div className="text-xs text-white/40 font-medium uppercase tracking-wider">
            Step {Math.max(0, currentStep)} of {steps.length}
          </div>
        </div>

        <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded-2xl border border-white/5">
          <button
            onClick={onRestart}
            className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
            title="Restart"
          >
            <SkipBack size={18} />
          </button>
          
          <button
            onClick={onPrevious}
            disabled={currentStep <= 0}
            className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-20 transition-all"
            title="Previous Move"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={isPlaying ? onPause : onPlay}
            className={cn(
              "flex items-center justify-center w-12 h-12 rounded-xl font-bold transition-all shadow-lg",
              isPlaying 
                ? "bg-orange-500 text-white shadow-orange-500/20 hover:bg-orange-400" 
                : "bg-green-500 text-black shadow-green-500/20 hover:bg-green-400"
            )}
          >
            {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-1" />}
          </button>

          <button
            onClick={onNext}
            disabled={currentStep >= steps.length}
            className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-20 transition-all"
            title="Next Move"
          >
            <ChevronRight size={20} />
          </button>

          <div className="w-px h-6 bg-white/10 mx-1" />

          <button
            onClick={onCopy}
            className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
            title="Copy all moves"
          >
            {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-blue-600 to-indigo-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", bounce: 0, duration: 0.5 }}
        />
      </div>

      {/* Move Explanation Card */}
      <AnimatePresence mode="wait">
        {moveInfo ? (
          <motion.div
            key={moveInfo.move}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-start gap-4"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center text-xl font-black font-mono shadow-lg shadow-blue-500/20">
              {moveInfo.move}
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="font-bold text-white text-sm">{moveInfo.name} Rotation</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                {moveInfo.description}. {moveInfo.steps[1] || ""}
              </p>
            </div>
          </motion.div>
        ) : currentStep >= steps.length ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center gap-3"
          >
            <Check size={20} className="text-green-400" />
            <span className="text-sm font-bold text-green-400 uppercase tracking-widest">Cube Solved!</span>
          </motion.div>
        ) : (
          <div className="h-[72px] flex items-center justify-center text-white/20 text-sm font-medium italic">
            Click Play or Next to start solving...
          </div>
        )}
      </AnimatePresence>

      {/* Moves Grid */}
      <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto p-3 rounded-2xl bg-black/40 border border-white/5 custom-scrollbar">
        {steps.map((step, index) => (
          <button
            key={index}
            onClick={() => {/* Maybe allow jumping to step? */}}
            className={cn(
              "flex items-center justify-center min-w-[44px] h-10 px-3 rounded-xl font-mono text-sm transition-all duration-300 border",
              index === currentStep
                ? "bg-blue-600 border-blue-400 text-white scale-110 shadow-[0_0_20px_rgba(59,130,246,0.4)] z-10"
                : index < currentStep
                ? "bg-white/5 border-transparent text-white/20"
                : "bg-white/5 border-white/5 text-white/70 hover:bg-white/10"
            )}
          >
            {step}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

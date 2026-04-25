import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MOVES_DATA } from '../lib/movesData';
import { MoveCube3D } from '../components/MoveCube3D';
import { ArrowLeft, Play, RotateCcw, Settings, Info, CheckCircle2, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export const MoveDetailPage: React.FC = () => {
  const { move } = useParams<{ move: string }>();
  const navigate = useNavigate();
  const decodedMove = decodeURIComponent(move || '');
  const moveInfo = MOVES_DATA.find(m => m.move === decodedMove);

  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [practiceMode, setPracticeMode] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (!moveInfo) {
      navigate('/practice');
    }
  }, [moveInfo, navigate]);

  const handlePlay = () => {
    if (practiceMode && !showAnswer) {
      setShowAnswer(true);
    }
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setShowAnswer(false);
    // The MoveCube3D component handles state reset internally when move changes or key changes
  };

  if (!moveInfo) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <Link to="/practice" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-6">
            <ArrowLeft size={16} />
            Back to Practice Hub
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <h1 className="text-6xl font-black tracking-tighter text-blue-500 font-mono leading-none">
              {moveInfo.move}
            </h1>
            <div className="pb-1">
              <h2 className="text-2xl font-bold text-white/90">{moveInfo.name} Move</h2>
              <p className="text-white/40 uppercase tracking-[0.2em] text-xs font-bold">
                {moveInfo.type} Rotation
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Visualization Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden aspect-square sm:aspect-video lg:aspect-square">
              <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
                  <div className={cn("w-2 h-2 rounded-full animate-pulse", isPlaying ? "bg-green-500" : "bg-blue-500")} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                    {isPlaying ? "Animating" : "Ready"}
                  </span>
                </div>
                {practiceMode && !showAnswer && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30 backdrop-blur-md">
                    <HelpCircle size={12} className="text-orange-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400">
                      Practice Mode: Try it mentally!
                    </span>
                  </div>
                )}
              </div>

              <div className="w-full h-full">
                {(!practiceMode || showAnswer) ? (
                  <MoveCube3D 
                    key={`${moveInfo.move}-${showAnswer}`}
                    move={moveInfo.move} 
                    isPlaying={isPlaying} 
                    speed={speed} 
                    onComplete={() => setIsPlaying(false)}
                    highlightFace={moveInfo.face}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-black/40">
                    <div className="text-center p-8">
                      <HelpCircle size={48} className="mx-auto text-white/20 mb-4" />
                      <h3 className="text-xl font-bold text-white/60 mb-2">Visualize the move</h3>
                      <p className="text-sm text-white/30 mb-6">Think about how the {moveInfo.name} face rotates {moveInfo.type}.</p>
                      <button 
                        onClick={() => setShowAnswer(true)}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all"
                      >
                        Show Answer
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Controls Overlay */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
                <button 
                  onClick={handlePlay}
                  disabled={isPlaying}
                  className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 transition-all"
                >
                  <Play size={20} fill="currentColor" />
                </button>
                <button 
                  onClick={handleReset}
                  className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
                >
                  <RotateCcw size={20} />
                </button>
                <div className="w-px h-6 bg-white/10 mx-2" />
                <div className="flex items-center gap-3">
                  <Settings size={16} className="text-white/40" />
                  <input 
                    type="range" 
                    min="200" 
                    max="2000" 
                    step="100"
                    value={speed}
                    onChange={(e) => setSpeed(parseInt(e.target.value))}
                    className="w-24 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="lg:col-span-5 space-y-6">
            <section className="p-8 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <Info size={18} className="text-blue-400" />
                Definition
              </h3>
              <p className="text-white/60 leading-relaxed mb-6">
                {moveInfo.description}. In Rubik's Cube notation, 
                {moveInfo.type === 'clockwise' ? ' a single letter indicates a 90-degree clockwise rotation.' : 
                 moveInfo.type === 'counter-clockwise' ? ' a letter followed by an apostrophe (\') indicates a 90-degree counter-clockwise rotation.' :
                 ' a letter followed by a 2 indicates a 180-degree rotation.'}
              </p>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest">Step-by-Step</h4>
                {moveInfo.steps.map((step, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400">
                      {i + 1}
                    </div>
                    <p className="text-sm text-white/80 pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="p-8 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <GraduationCap size={18} className="text-orange-400" />
                  Practice Mode
                </h3>
                <button 
                  onClick={() => {
                    setPracticeMode(!practiceMode);
                    setShowAnswer(false);
                    setIsPlaying(false);
                  }}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                    practiceMode ? "bg-blue-600" : "bg-white/10"
                  )}
                >
                  <span className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    practiceMode ? "translate-x-6" : "translate-x-1"
                  )} />
                </button>
              </div>
              <p className="text-sm text-white/40 leading-relaxed">
                Enable practice mode to hide the animation. Try to visualize the rotation in your mind before clicking "Show Answer". This is the best way to build muscle memory and spatial awareness.
              </p>
            </section>

            <div className="flex gap-4">
              <button 
                onClick={() => {
                  const currentIndex = MOVES_DATA.findIndex(m => m.move === decodedMove);
                  const prevIndex = (currentIndex - 1 + MOVES_DATA.length) % MOVES_DATA.length;
                  navigate(`/practice/${encodeURIComponent(MOVES_DATA[prevIndex].move)}`);
                }}
                className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold text-sm"
              >
                Previous Move
              </button>
              <button 
                onClick={() => {
                  const currentIndex = MOVES_DATA.findIndex(m => m.move === decodedMove);
                  const nextIndex = (currentIndex + 1) % MOVES_DATA.length;
                  navigate(`/practice/${encodeURIComponent(MOVES_DATA[nextIndex].move)}`);
                }}
                className="flex-1 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 transition-all font-bold text-sm"
              >
                Next Move
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Re-using the GraduationCap icon since I can't import it from lucide easily if it's missing in my previous thought
const GraduationCap = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

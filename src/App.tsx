import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Link, useNavigate } from 'react-router-dom';
import { Cube2D } from './components/Cube2D';
import { Cube3D } from './components/Cube3D';
import { Controls } from './components/Controls';
import { ColorPicker } from './components/ColorPicker';
import { StepsPanel } from './components/StepsPanel';
import { CubeState, Color, FaceName, INITIAL_CUBE_STATE } from './types';
import { solveCube, validateCube, shuffleCube, applyMove, getInverseMove } from './lib/cubeLogic';
import { cn } from './lib/utils';
import { AlertCircle, CheckCircle2, Info, GraduationCap, ArrowLeft } from 'lucide-react';

export default function App() {
  const navigate = useNavigate();
  const [cubeState, setCubeState] = useState<CubeState>(INITIAL_CUBE_STATE);
  const [initialScrambleState, setInitialScrambleState] = useState<CubeState | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color>('white');
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('3D');
  const [solutionSteps, setSolutionSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [isSolving, setIsSolving] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(800);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [copied, setCopied] = useState(false);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const handleSquareClick = (face: FaceName, index: number) => {
    if (isSolving || isPlaying) return;
    
    setCubeState(prev => ({
      ...prev,
      [face]: prev[face].map((c, i) => i === index ? selectedColor : c)
    }));
    
    // Clear solution if state changes
    setSolutionSteps([]);
    setCurrentStep(-1);
    setInitialScrambleState(null);
  };

  const handleSolve = async () => {
    const validation = validateCube(cubeState);
    if (!validation.isValid) {
      showToast(validation.error || "Invalid cube state", 'error');
      return;
    }

    setIsSolving(true);
    try {
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      const steps = solveCube(cubeState);
      if (steps.length === 0) {
        showToast("Cube is already solved!", 'success');
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFFFFF', '#FFFF00', '#FF0000', '#FFA500', '#0000FF', '#008000']
        });
      } else {
        setSolutionSteps(steps);
        setCurrentStep(0);
        setInitialScrambleState(cubeState);
        showToast(`Found solution in ${steps.length} moves!`, 'success');
      }
    } catch (error) {
      showToast("Could not find a solution. Please check your cube input.", 'error');
    } finally {
      setIsSolving(false);
    }
  };

  const handleReset = () => {
    setCubeState(INITIAL_CUBE_STATE);
    setSolutionSteps([]);
    setCurrentStep(-1);
    setIsPlaying(false);
    setInitialScrambleState(null);
    showToast("Cube reset to solved state", 'info');
  };

  const handleShuffle = () => {
    const moves = shuffleCube();
    let newState = INITIAL_CUBE_STATE;
    moves.forEach(move => {
      newState = applyMove(newState, move);
    });
    setCubeState(newState);
    setSolutionSteps([]);
    setCurrentStep(-1);
    setIsPlaying(false);
    setInitialScrambleState(null);
    showToast("Cube shuffled!", 'info');
  };

  const handleNext = useCallback(() => {
    if (currentStep >= 0 && currentStep < solutionSteps.length) {
      const move = solutionSteps[currentStep];
      setCubeState(prev => applyMove(prev, move));
      setCurrentStep(prev => prev + 1);
      
      if (currentStep === solutionSteps.length - 1) {
        setIsPlaying(false);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        showToast("Cube solved!", 'success');
      }
    }
  }, [currentStep, solutionSteps, showToast]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      const move = solutionSteps[currentStep - 1];
      const inverseMove = getInverseMove(move);
      setCubeState(prev => applyMove(prev, inverseMove));
      setCurrentStep(prev => prev - 1);
      setIsPlaying(false);
    }
  }, [currentStep, solutionSteps]);

  const handleRestart = useCallback(() => {
    if (initialScrambleState) {
      setCubeState(initialScrambleState);
      setCurrentStep(0);
      setIsPlaying(false);
      showToast("Solution restarted", 'info');
    }
  }, [initialScrambleState, showToast]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && currentStep < solutionSteps.length) {
      timer = setTimeout(handleNext, animationSpeed);
    } else if (currentStep >= solutionSteps.length) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, solutionSteps, animationSpeed, handleNext]);

  const handlePlayAnimation = () => {
    if (solutionSteps.length === 0) return;
    if (currentStep >= solutionSteps.length) {
      handleRestart();
    }
    setIsPlaying(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(solutionSteps.join(' '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast("Moves copied to clipboard", 'success');
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (solutionSteps.length === 0 || isSolving) return;
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          setIsPlaying(prev => !prev);
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'KeyR':
          handleRestart();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [solutionSteps, isSolving, handleNext, handlePrevious, handleRestart]);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-12 relative">
          <div className="absolute left-0 top-0">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-bold text-white/60"
            >
              <ArrowLeft size={18} />
              Back
            </button>
          </div>
          <div className="absolute right-0 top-0">
            <Link 
              to="/practice"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-bold text-blue-400"
            >
              <GraduationCap size={18} />
              Practice
            </Link>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 mb-2"
          >
            RUBIX MASTER
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 uppercase tracking-[0.3em] text-xs font-bold"
          >
            Advanced Cube Solver Engine
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cube Visualization */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <motion.div 
              layout
              className="relative bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-6 left-6 z-20">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
                  <div className={cn("w-2 h-2 rounded-full animate-pulse", isPlaying ? "bg-green-500" : "bg-blue-500")} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                    {viewMode} Mode {isPlaying && "• Playing"}
                  </span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {viewMode === '3D' ? (
                  <motion.div
                    key="3d"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Cube3D state={cubeState} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="2d"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Cube2D state={cubeState} onSquareClick={handleSquareClick} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <StepsPanel 
              steps={solutionSteps}
              currentStep={currentStep}
              onPlay={handlePlayAnimation}
              onPause={() => setIsPlaying(false)}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onRestart={handleRestart}
              isPlaying={isPlaying}
              onCopy={handleCopy}
              copied={copied}
            />
          </div>

          {/* Right Column: Controls */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <ColorPicker selectedColor={selectedColor} onSelect={setSelectedColor} />
            <Controls 
              onSolve={handleSolve}
              onReset={handleReset}
              onShuffle={handleShuffle}
              isSolving={isSolving}
              viewMode={viewMode}
              onToggleView={() => setViewMode(prev => prev === '2D' ? '3D' : '2D')}
              speed={animationSpeed}
              onSpeedChange={setAnimationSpeed}
            />
            
            {/* Info Card */}
            <div className="p-6 bg-blue-500/5 rounded-3xl border border-blue-500/10">
              <h4 className="flex items-center gap-2 text-blue-400 font-bold mb-2">
                <Info size={18} />
                Quick Guide
              </h4>
              <ul className="text-sm text-white/40 space-y-2 list-disc list-inside">
                <li>Switch to <span className="text-white/60">2D View</span> to input your cube's colors.</li>
                <li>Each color must appear exactly 9 times for a valid solve.</li>
                <li>Click <span className="text-white/60">Solve</span> to generate the shortest path.</li>
                <li>Use <span className="text-white/60">Play Animation</span> to see the moves in 3D.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-50 min-w-[300px]"
          >
            <div className={cn(
              "flex items-center gap-3 px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl",
              toast.type === 'success' ? "bg-green-500/10 border-green-500/20 text-green-400" :
              toast.type === 'error' ? "bg-red-500/10 border-red-500/20 text-red-400" :
              "bg-blue-500/10 border-blue-500/20 text-blue-400"
            )}>
              {toast.type === 'success' ? <CheckCircle2 size={20} /> : 
               toast.type === 'error' ? <AlertCircle size={20} /> : <Info size={20} />}
              <span className="font-medium">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-white/5 text-center">
        <p className="text-white/20 text-xs font-bold tracking-widest uppercase">
          Powered by CubeJS Engine & Three.js
        </p>
      </footer>
    </div>
  );
}

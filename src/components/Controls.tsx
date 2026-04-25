import React from 'react';
import { Play, RotateCcw, Shuffle as ShuffleIcon, Cpu, Eye, EyeOff, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

interface ControlsProps {
  onSolve: () => void;
  onReset: () => void;
  onShuffle: () => void;
  isSolving: boolean;
  viewMode: '2D' | '3D';
  onToggleView: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  onSolve,
  onReset,
  onShuffle,
  isSolving,
  viewMode,
  onToggleView,
  speed,
  onSpeedChange,
}) => {
  return (
    <div className="flex flex-col gap-6 p-6 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={onSolve}
          disabled={isSolving}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300",
            "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20",
            "hover:scale-105 hover:shadow-blue-500/40 active:scale-95 disabled:opacity-50 disabled:scale-100"
          )}
        >
          {isSolving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Cpu size={20} />}
          Solve Cube
        </button>

        <button
          onClick={onShuffle}
          disabled={isSolving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-white/10 text-white border border-white/10 hover:bg-white/20 transition-all duration-300 active:scale-95"
        >
          <ShuffleIcon size={20} />
          Shuffle
        </button>

        <button
          onClick={onReset}
          disabled={isSolving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all duration-300 active:scale-95"
        >
          <RotateCcw size={20} />
          Reset
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <span className="text-sm font-medium text-white/60 uppercase tracking-wider flex items-center gap-2">
            <Settings size={14} />
            Animation Speed
          </span>
          <span className="text-sm font-mono text-blue-400">
            {speed <= 400 ? 'Fast' : speed <= 1000 ? 'Medium' : 'Slow'}
          </span>
        </div>
        <input
          type="range"
          min="200"
          max="1500"
          step="100"
          value={speed}
          onChange={(e) => onSpeedChange(parseInt(e.target.value))}
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between px-1 text-[10px] font-bold text-white/20 uppercase tracking-tighter">
          <span>Slow</span>
          <span>Medium</span>
          <span>Fast</span>
        </div>
      </div>

      <button
        onClick={onToggleView}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 transition-all duration-300"
      >
        {viewMode === '2D' ? <Eye size={20} /> : <EyeOff size={20} />}
        Switch to {viewMode === '2D' ? '3D' : '2D'} View
      </button>
    </div>
  );
};

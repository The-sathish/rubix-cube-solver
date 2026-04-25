import React from 'react';
import { CubeState, FaceName, Color, COLOR_MAP } from '../types';
import { cn } from '../lib/utils';

interface Cube2DProps {
  state: CubeState;
  onSquareClick: (face: FaceName, index: number) => void;
}

const Face: React.FC<{ 
  name: FaceName; 
  squares: Color[]; 
  onClick: (index: number) => void;
  className?: string;
}> = ({ name, squares, onClick, className }) => (
  <div className={cn("grid grid-cols-3 gap-1 p-1 bg-black/20 rounded-lg border border-white/5", className)}>
    {squares.map((color, i) => (
      <button
        key={i}
        onClick={() => onClick(i)}
        className="w-8 h-8 sm:w-10 sm:h-10 rounded-sm transition-colors duration-200 hover:opacity-80"
        style={{ backgroundColor: COLOR_MAP[color] }}
      />
    ))}
    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
      {name}
    </div>
  </div>
);

export const Cube2D: React.FC<Cube2DProps> = ({ state, onSquareClick }) => {
  return (
    <div className="flex flex-col items-center gap-4 p-8 overflow-x-auto">
      <div className="grid grid-cols-4 gap-4 min-w-max">
        {/* Top row: empty, U, empty, empty */}
        <div />
        <div className="relative">
          <Face name="U" squares={state.U} onClick={(i) => onSquareClick('U', i)} />
        </div>
        <div />
        <div />

        {/* Middle row: L, F, R, B */}
        <div className="relative">
          <Face name="L" squares={state.L} onClick={(i) => onSquareClick('L', i)} />
        </div>
        <div className="relative">
          <Face name="F" squares={state.F} onClick={(i) => onSquareClick('F', i)} />
        </div>
        <div className="relative">
          <Face name="R" squares={state.R} onClick={(i) => onSquareClick('R', i)} />
        </div>
        <div className="relative">
          <Face name="B" squares={state.B} onClick={(i) => onSquareClick('B', i)} />
        </div>

        {/* Bottom row: empty, D, empty, empty */}
        <div />
        <div className="relative">
          <Face name="D" squares={state.D} onClick={(i) => onSquareClick('D', i)} />
        </div>
        <div />
        <div />
      </div>
    </div>
  );
};

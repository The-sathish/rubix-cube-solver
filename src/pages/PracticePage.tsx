import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MOVES_DATA } from '../lib/movesData';
import { MoveCube3D } from '../components/MoveCube3D';
import { ChevronRight, GraduationCap, ArrowLeft } from 'lucide-react';

export const PracticePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <Link to="/" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-4">
              <ArrowLeft size={16} />
              Back to Solver
            </Link>
            <h1 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
              PRACTICE HUB
            </h1>
            <p className="text-white/40 uppercase tracking-[0.3em] text-xs font-bold mt-2">
              Master every move with interactive guides
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
            <GraduationCap className="text-blue-400" />
            <span className="text-sm font-bold text-white/60">Learning Mode Active</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOVES_DATA.map((moveInfo, index) => (
            <motion.div
              key={moveInfo.move}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={`/practice/${encodeURIComponent(moveInfo.move)}`}
                className="group block bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]"
              >
                <div className="h-48 bg-black/40 relative">
                  <MoveCube3D 
                    move={moveInfo.move} 
                    isPlaying={false} 
                    speed={1000} 
                    highlightFace={moveInfo.face}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-60" />
                </div>
                
                <div className="p-6 relative">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-black font-mono text-blue-400 group-hover:text-blue-300 transition-colors">
                      {moveInfo.move}
                    </h2>
                    <span className={clsx(
                      "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border",
                      moveInfo.type === 'clockwise' ? "text-green-400 border-green-500/20 bg-green-500/5" :
                      moveInfo.type === 'counter-clockwise' ? "text-orange-400 border-orange-500/20 bg-orange-500/5" :
                      "text-purple-400 border-purple-500/20 bg-purple-500/5"
                    )}>
                      {moveInfo.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white/80 mb-2">{moveInfo.name}</h3>
                  <p className="text-sm text-white/40 line-clamp-2 mb-4">
                    {moveInfo.description}
                  </p>
                  <div className="flex items-center text-xs font-bold text-blue-400 uppercase tracking-widest group-hover:gap-2 transition-all">
                    Learn More <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper for conditional classes since I can't import cn easily here without lib/utils
function clsx(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

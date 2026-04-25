import React from 'react';
import { Color, COLOR_MAP } from '../types';
import { cn } from '../lib/utils';

interface ColorPickerProps {
  selectedColor: Color;
  onSelect: (color: Color) => void;
}

const colors: Color[] = ['white', 'yellow', 'red', 'orange', 'blue', 'green'];

export const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onSelect }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl">
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => onSelect(color)}
          className={cn(
            "w-10 h-10 rounded-lg transition-all duration-300 transform hover:scale-110 active:scale-95 border-2",
            selectedColor === color ? "border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.5)]" : "border-transparent"
          )}
          style={{ backgroundColor: COLOR_MAP[color] }}
          title={color.charAt(0).toUpperCase() + color.slice(1)}
        />
      ))}
    </div>
  );
};

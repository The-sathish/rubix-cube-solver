
export type FaceName = 'U' | 'D' | 'L' | 'R' | 'F' | 'B';
export type Color = 'white' | 'yellow' | 'red' | 'orange' | 'blue' | 'green';

export interface CubeState {
  U: Color[];
  D: Color[];
  L: Color[];
  R: Color[];
  F: Color[];
  B: Color[];
}

export const FACE_ORDER: FaceName[] = ['U', 'R', 'F', 'D', 'L', 'B'];

export const COLOR_MAP: Record<Color, string> = {
  white: '#FFFFFF',
  yellow: '#FFFF00',
  red: '#FF0000',
  orange: '#FFA500',
  blue: '#0000FF',
  green: '#008000',
};

export const FACE_TO_COLOR: Record<FaceName, Color> = {
  U: 'white',
  D: 'yellow',
  L: 'orange',
  R: 'red',
  F: 'green',
  B: 'blue',
};

export const INITIAL_CUBE_STATE: CubeState = {
  U: Array(9).fill('white'),
  D: Array(9).fill('yellow'),
  L: Array(9).fill('orange'),
  R: Array(9).fill('red'),
  F: Array(9).fill('green'),
  B: Array(9).fill('blue'),
};

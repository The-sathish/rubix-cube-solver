import Cube from 'cubejs';
import { CubeState, FaceName, Color, FACE_ORDER, INITIAL_CUBE_STATE } from '../types';

// Initialize the solver (this can be slow, so we do it once)
let solverInitialized = false;

export const initializeSolver = () => {
  if (!solverInitialized) {
    Cube.initSolver();
    solverInitialized = true;
  }
};

const COLOR_TO_FACE_CHAR: Record<Color, string> = {
  white: 'U',
  yellow: 'D',
  orange: 'L',
  red: 'R',
  green: 'F',
  blue: 'B',
};

/**
 * Converts the current CubeState to a string format that cubejs understands.
 * The format is 54 characters: UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB
 */
export const cubeStateToString = (state: CubeState): string => {
  let result = '';
  // Order: U, R, F, D, L, B
  for (const face of FACE_ORDER) {
    for (const color of state[face]) {
      result += COLOR_TO_FACE_CHAR[color];
    }
  }
  return result;
};

export const solveCube = (state: CubeState): string[] => {
  initializeSolver();
  const cubeString = cubeStateToString(state);
  const cube = Cube.fromString(cubeString);
  const solution = cube.solve();
  return solution ? solution.split(' ').filter(move => move.length > 0) : [];
};

export const validateCube = (state: CubeState): { isValid: boolean; error?: string } => {
  const counts: Record<Color, number> = {
    white: 0,
    yellow: 0,
    red: 0,
    orange: 0,
    blue: 0,
    green: 0,
  };

  for (const face of Object.values(state) as Color[][]) {
    for (const color of face) {
      counts[color]++;
    }
  }

  for (const [color, count] of Object.entries(counts)) {
    if (count !== 9) {
      return { isValid: false, error: `Each color must appear exactly 9 times. ${color} appears ${count} times.` };
    }
  }

  try {
    const cubeString = cubeStateToString(state);
    Cube.fromString(cubeString);
  } catch (e) {
    return { isValid: false, error: "Invalid cube configuration. Check if the pieces are in physically possible positions." };
  }

  return { isValid: true };
};

export const applyMove = (state: CubeState, move: string): CubeState => {
  const cubeString = cubeStateToString(state);
  const cube = Cube.fromString(cubeString);
  cube.move(move);
  const newStateString = cube.asString();
  
  // Convert back to CubeState
  const newState: CubeState = { ...INITIAL_CUBE_STATE };
  let cursor = 0;
  
  const CHAR_TO_COLOR: Record<string, Color> = {
    'U': 'white',
    'D': 'yellow',
    'L': 'orange',
    'R': 'red',
    'F': 'green',
    'B': 'blue',
  };

  for (const face of FACE_ORDER) {
    const faceColors: Color[] = [];
    for (let i = 0; i < 9; i++) {
      faceColors.push(CHAR_TO_COLOR[newStateString[cursor++]]);
    }
    newState[face] = faceColors;
  }
  
  return newState;
};

export const getInverseMove = (move: string): string => {
  if (move.endsWith('2')) return move; // Double moves are their own inverse
  if (move.endsWith("'")) return move.slice(0, -1);
  return move + "'";
};

export const shuffleCube = (): string[] => {
  const cube = new Cube();
  // Generate a random scramble
  // cubejs doesn't have a direct "scramble" that returns moves, 
  // but we can generate a random state and solve it, or just random moves.
  const moves = ['U', 'D', 'L', 'R', 'F', 'B', "U'", "D'", "L'", "R'", "F'", "B'", 'U2', 'D2', 'L2', 'R2', 'F2', 'B2'];
  const scramble: string[] = [];
  for (let i = 0; i < 20; i++) {
    scramble.push(moves[Math.floor(Math.random() * moves.length)]);
  }
  return scramble;
};

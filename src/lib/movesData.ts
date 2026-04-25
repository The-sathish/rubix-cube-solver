
export interface MoveInfo {
  move: string;
  name: string;
  description: string;
  type: 'clockwise' | 'counter-clockwise' | 'double';
  face: 'U' | 'D' | 'L' | 'R' | 'F' | 'B';
  steps: string[];
}

export const MOVES_DATA: MoveInfo[] = [
  // Clockwise
  {
    move: 'U',
    name: 'Up',
    description: 'Rotate the top face clockwise',
    type: 'clockwise',
    face: 'U',
    steps: ['Place your fingers on the top layer', 'Rotate the top layer 90 degrees to the left'],
  },
  {
    move: 'D',
    name: 'Down',
    description: 'Rotate the bottom face clockwise',
    type: 'clockwise',
    face: 'D',
    steps: ['Place your fingers on the bottom layer', 'Rotate the bottom layer 90 degrees to the right'],
  },
  {
    move: 'L',
    name: 'Left',
    description: 'Rotate the left face clockwise',
    type: 'clockwise',
    face: 'L',
    steps: ['Place your fingers on the left layer', 'Rotate the left layer 90 degrees downwards'],
  },
  {
    move: 'R',
    name: 'Right',
    description: 'Rotate the right face clockwise',
    type: 'clockwise',
    face: 'R',
    steps: ['Place your fingers on the right layer', 'Rotate the right layer 90 degrees upwards'],
  },
  {
    move: 'F',
    name: 'Front',
    description: 'Rotate the front face clockwise',
    type: 'clockwise',
    face: 'F',
    steps: ['Place your fingers on the front layer', 'Rotate the front layer 90 degrees clockwise'],
  },
  {
    move: 'B',
    name: 'Back',
    description: 'Rotate the back face clockwise',
    type: 'clockwise',
    face: 'B',
    steps: ['Place your fingers on the back layer', 'Rotate the back layer 90 degrees counter-clockwise (from your perspective)'],
  },
  // Counter-clockwise
  {
    move: "U'",
    name: "Up Prime",
    description: 'Rotate the top face counter-clockwise',
    type: 'counter-clockwise',
    face: 'U',
    steps: ['Place your fingers on the top layer', 'Rotate the top layer 90 degrees to the right'],
  },
  {
    move: "D'",
    name: "Down Prime",
    description: 'Rotate the bottom face counter-clockwise',
    type: 'counter-clockwise',
    face: 'D',
    steps: ['Place your fingers on the bottom layer', 'Rotate the bottom layer 90 degrees to the left'],
  },
  {
    move: "L'",
    name: "Left Prime",
    description: 'Rotate the left face counter-clockwise',
    type: 'counter-clockwise',
    face: 'L',
    steps: ['Place your fingers on the left layer', 'Rotate the left layer 90 degrees upwards'],
  },
  {
    move: "R'",
    name: "Right Prime",
    description: 'Rotate the right face counter-clockwise',
    type: 'counter-clockwise',
    face: 'R',
    steps: ['Place your fingers on the right layer', 'Rotate the right layer 90 degrees downwards'],
  },
  {
    move: "F'",
    name: "Front Prime",
    description: 'Rotate the front face counter-clockwise',
    type: 'counter-clockwise',
    face: 'F',
    steps: ['Place your fingers on the front layer', 'Rotate the front layer 90 degrees counter-clockwise'],
  },
  {
    move: "B'",
    name: "Back Prime",
    description: 'Rotate the back face counter-clockwise',
    type: 'counter-clockwise',
    face: 'B',
    steps: ['Place your fingers on the back layer', 'Rotate the back layer 90 degrees clockwise (from your perspective)'],
  },
  // Double
  {
    move: 'U2',
    name: 'Up Double',
    description: 'Rotate the top face 180 degrees',
    type: 'double',
    face: 'U',
    steps: ['Place your fingers on the top layer', 'Rotate the top layer 180 degrees'],
  },
  {
    move: 'R2',
    name: 'Right Double',
    description: 'Rotate the right face 180 degrees',
    type: 'double',
    face: 'R',
    steps: ['Place your fingers on the right layer', 'Rotate the right layer 180 degrees'],
  },
  {
    move: 'F2',
    name: 'Front Double',
    description: 'Rotate the front face 180 degrees',
    type: 'double',
    face: 'F',
    steps: ['Place your fingers on the front layer', 'Rotate the front layer 180 degrees'],
  },
];

import { Cube, Face, Color } from './cube.js';
import * as Solver from './solve.ts';

export function solve(cube: Cube) {
    solveWhiteCross(cube);
    solveWhiteCorners(cube);
    solveMiddleEdges(cube);
    solveYellowCross(cube);
    solveYellowFace(cube);
    solveTopRow(cube);
}

import * as tf from '@tensorflow/tfjs';

import { getRandomInteger } from './utils';
import { Cube } from '../cube.js';

export const UNSOLVED_REWARD = -0.1;
export const SOLVE_FACE_REWARD = 2;
export const FAIL_REWARD = -100;
export const WIN_REWARD = 150;

export const ACTION_F = 0;
export const ACTION_COUNTER_F = 1;
export const ACTION_L = 2;
export const ACTION_COUNTER_L = 3;
export const ACTION_R = 4;
export const ACTION_COUNTER_R = 5;
export const ACTION_B = 6;
export const ACTION_COUNTER_B = 7;
export const ACTION_U = 8;
export const ACTION_COUNTER_U = 9;
export const ACTION_D = 10;
export const ACTION_COUNTER_D = 11;
export const ALL_ACTIONS = [
    ACTION_F, ACTION_COUNTER_F,
    ACTION_L, ACTION_COUNTER_L,
    ACTION_R, ACTION_COUNTER_R,
    ACTION_B, ACTION_COUNTER_B,
    ACTION_U, ACTION_COUNTER_U,
    ACTION_D, ACTION_COUNTER_D,
];
export const NUM_ACTIONS = ALL_ACTIONS.length;

export function getRandomAction(): number {
    return getRandomInteger(0, NUM_ACTIONS);
}

export interface GameArgs {
    difficulty: number;
    gameType: 'randomLevels' | 'provided';
    maxMoves?: number;
}

interface GameState {
    f: string[],
    l: string[],
    r: string[],
    b: string[],
    u: string[],
    d: string[]
}

interface Step {
    reward: number;
    state?: GameState;
    done: boolean;
}

function isFaceSolved(face: string[]): boolean {
    return face.every(color => color === face[0]);
}

interface SolvedFaceTracker {
    [index: string]: boolean;
    u: boolean;
    l: boolean;
    f: boolean;
    r: boolean;
    b: boolean;
    d: boolean;
}

export class CubeGame {
    maxMoves: number;
    cube: Cube;
    difficulty: number;
    currentMove: number;
    solved: SolvedFaceTracker;
    constructor(difficulty?: number) {
        this.cube = new Cube();
        if (difficulty) {
            this.difficulty = difficulty;
        }
        else {
            this.difficulty = 1;
        }
        this.maxMoves = Math.max(75 - this.difficulty, 25);
        this.currentMove = 0;
        this.solved = {
            u: true,
            l: true,
            f: true,
            r: true,
            b: true,
            d: true,
        }
    }
    reset() {
        this.initialize();
        return this.getState();
    }
    step(action: number): Step {
        this.currentMove += 1;
        const previousState = this.cube.toString().split('/');
        if (action === ACTION_F) {
            this.cube.f();
        }
        else if (action === ACTION_COUNTER_F) {
            this.cube.counter_f();
        }
        if (action === ACTION_L) {
            this.cube.l();
        }
        else if (action === ACTION_COUNTER_L) {
            this.cube.counter_l();
        }
        if (action === ACTION_R) {
            this.cube.r();
        }
        else if (action === ACTION_COUNTER_R) {
            this.cube.counter_r();
        }
        if (action === ACTION_B) {
            this.cube.b();
        }
        else if (action === ACTION_COUNTER_B) {
            this.cube.counter_b();
        }
        if (action === ACTION_U) {
            this.cube.u();
        }
        else if (action === ACTION_COUNTER_U) {
            this.cube.counter_u();
        }
        if (action === ACTION_D) {
            this.cube.d();
        }
        else if (action === ACTION_COUNTER_D) {
            this.cube.counter_d();
        }
        let done = false;
        // Check if cube is solved or if at max moves
        if (this.cube.isSolved()) {
            done = true;
            return {reward: WIN_REWARD, done};
        }
        else if (this.currentMove === this.maxMoves) {
            done = true;
            return {reward: FAIL_REWARD, done};
        }
        const currentState = this.cube.toString().split('/');
        let reward = UNSOLVED_REWARD;
        let solvedFaces = 0;
        let unsolvedFaces = 0;
        // Check if current move solved a face or destroyed a face
        for (let i = 0; i < currentState.length; i++) {
            const currentFace = currentState[i];
            const isCurrentSolved = isFaceSolved(currentFace.split(''));
            const previousFace = previousState[i];
            const isPreviousSolved = isFaceSolved(previousFace.split(''));
            if (isPreviousSolved && isCurrentSolved) {
                reward += 0;
            }
            else if (isPreviousSolved && !isCurrentSolved) {
                unsolvedFaces += 1;
                reward -= UNSOLVED_REWARD * unsolvedFaces;
            }
            else if (!isPreviousSolved && isCurrentSolved) {
                solvedFaces += 1;
                reward += SOLVE_FACE_REWARD * solvedFaces;
            }
        }
        const state = this.getState();
        return { reward, state, done };
    }
    private initialize() {
        this.cube = Cube.scrambled(this.difficulty);
        for (const key of Object.keys(this.solved)) {
            this.solved[key] = isFaceSolved(this.cube.cube[key]);
        }
    }
    getState(): GameState {
        return { ...this.cube.cube };
    }
}

function translateColor(color: string): number {
    if (color === 'o') {
        return 0;
    }
    else if (color === 'g') {
        return 1;
    }
    else if (color === 'b') {
        return 2;
    }
    else if (color === 'r') {
        return 3;
    }
    else if (color === 'y') {
        return 4;
    }
    else {
        return 5;
    }
}

function translateFace(face: string): number {
    if (face === 'u') {
        return 0;
    }
    else if (face === 'l') {
        return 1;
    }
    else if (face === 'f') {
        return 2;
    }
    else if (face === 'r') {
        return 3;
    }
    else if (face === 'b') {
        return 4;
    }
    else {
        return 5;
    }
}

export function getStateTensor(state: GameState | GameState[]): tf.Tensor<tf.Rank> {
    if (!Array.isArray(state)) {
        state = [state];
    }
    const numExamples = state.length;
    const buffer = tf.buffer([numExamples, 6, 9]);
    for (let n = 0; n < numExamples; n++) {
        if (!state[n]) {
            continue;
        }
        const faces = Object.keys(state[n]);
        for (const face of faces) {
            const faceValue = translateFace(face);
            let i = 0;
            for (const color of face.split('')) {
                const colorValue = translateColor(color);
                buffer.set(colorValue, n, faceValue, i);
                i += 1;
            }
        }
    }
    return buffer.toTensor();
}

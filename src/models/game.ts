import * as tf from '@tensorflow/tfjs';

import { assertPositiveInteger, getRandomInteger } from './utils';
import { Cube } from '../cube.js';

export const UNSOLVED_REWARD = -0.1;
export const SOLVE_FACE_REWARD = 2;
export const FAIL_REWARD = -100;
export const WIN_REWARD = 1000;

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

interface GameArgs {
    difficulty: number;
    gameType: 'randomLevels' | 'provided';
    maxMoves?: number;
}

interface GameState {}

interface Step {
    reward: number;
    state?: GameState;
    done: boolean;
}

export class CubeGame {
    maxMoves: number;
    cube: Cube;
    difficulty: number;
    gameType: string;
    currentMove: number;
    constructor(args: GameArgs) {
        this.cube = new Cube();
        this.difficulty = args.difficulty;
        this.gameType = args.gameType;
        if (args.maxMoves) {
            this.maxMoves = args.maxMoves;
        }
        else {
            this.maxMoves = Math.max(75 - this.difficulty, 25);
        }
        this.currentMove = 0;
    }
    reset() {
        this.initialize();
        return this.getState();
    }
    step(action: number): Step {
        const previousState = this.cube.toString();
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
        const currentState = this.cube.toString();
        let reward = UNSOLVED_REWARD;
        // Check if current move solved a face
    }
    private initialize() {
        this.cube = Cube.scrambled(this.difficulty);
    }
    getState() {}
}

export function getStateTensor(state: object | object[]) {}

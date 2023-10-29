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
}

export class CubeGame {
    cube: Cube;
    difficulty: number;
    gameType: string;
    constructor(args: GameArgs) {
        this.cube = new Cube();
        this.difficulty = args.difficulty;
        this.gameType = args.gameType;
    }
    reset() {
        this.initialize();
    }
    step() {
        this.update();
    }
    private update() {}
    private initialize() {
        this.cube = Cube.scrambled();
    }
    getState() {}
}

export function getStateTensor(state: object | object[]) {}

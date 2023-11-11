import * as tf from '@tensorflow/tfjs';

import { createDQN } from './dqn.js';
import { getRandomAction, CubeGame, NUM_ACTIONS, ALL_ACTIONS, getStateTensor } from '../game.js';
import { ReplayMemory } from '../memory.js';

export interface AgentConfig {
    replayBufferSize: number;
    learningRate: number;
    epsilonInit: number;
    epsilonFinal: number;
    epsilonDecayFrames: number;
}

export class CubeAgent {
    game: CubeGame;
    replayBufferSize: number = 1e4;
    replayMemory: ReplayMemory;
    onlineNetwork: tf.Sequential;
    targetNetwork: tf.Sequential;
    optimizer: tf.Optimizer;
    frameCount: number;
    epsilonInit: number = 0.5;
    epsilonFinal: number = 0.01;
    epsilonDecayFrames: number = 1e5;
    epsilon: number;

    private cumulativeReward: number;
    private readonly epsilonIncrement: number;


    constructor(game?: CubeGame,
                replayBufferSize?: number,
                learningRate?: number,
                epsilonInit?: number,
                epsilonFinal?: number,
                epsilonDecayFrames?: number) {
        if (game) {
            this.game = game;
        }
        else {
            this.game = new CubeGame();
        }
        this.onlineNetwork = createDQN(6, 9, NUM_ACTIONS);
        this.targetNetwork = createDQN(6, 9, NUM_ACTIONS);
        this.targetNetwork.trainable = false;
        if (learningRate) {
            this.optimizer = tf.train.adam(learningRate);
        }
        else {
            this.optimizer = tf.train.adam(1e-3);
        }
        if (replayBufferSize) {
            this.replayBufferSize = replayBufferSize;
        }
        if (epsilonInit) {
            this.epsilonInit = epsilonInit;
        }
        if (epsilonFinal) {
            this.epsilonFinal = epsilonFinal;
        }
        if (epsilonDecayFrames) {
            this.epsilonDecayFrames = epsilonDecayFrames;
        }
        this.epsilonIncrement = (this.epsilonFinal - this.epsilonInit) / this.epsilonDecayFrames;
        this.replayMemory = new ReplayMemory(this.replayBufferSize);
        this.frameCount = 0;
        this.cumulativeReward = 0;
        this.epsilon = 0;
        this.reset();
    }

    reset() {
        this.cumulativeReward = 0;
        this.game.reset();
    }
    playStep() {
        if (this.frameCount >= this.epsilonDecayFrames) {
            this.epsilon = this.epsilonFinal;
        }
        else {
            this.epsilon = this.epsilonInit + this.epsilonIncrement * this.frameCount;
        }
        this.frameCount += 1;
        let action = 0;
        const state = this.game.getState();
        if (Math.random() < this.epsilon) {
            action = getRandomAction();
        }
        else {
            tf.tidy(() => {
                const stateTensor = getStateTensor(state);
                const prediction = this.onlineNetwork.predict(stateTensor);
                if (Array.isArray(prediction)) {
                    const value = prediction[0].argMax(-1).dataSync()[0];
                    action = ALL_ACTIONS[value];
                }
                else {
                    const value = prediction.argMax(-1).dataSync()[0];
                    action = ALL_ACTIONS[value];
                }
            });
        }
        const {state: nextState, reward, done} = this.game.step(action);
        this.replayMemory.append([state, action, reward, done, nextState]);
        this.cumulativeReward += reward;
        const output = {
            action,
            cumulativeReward: this.cumulativeReward,
            done,
        }
        if (done) {
            this.reset();
        }
        return output;
    }
    trainOnReplayBatch(batchSize: number, gamma: number, optimizer: tf.Optimizer) {
        const batch = this.replayMemory.sample(batchSize);
        const lossFunction = () => tf.tidy(() => {
            const stateTensor = getStateTensor(
                batch.map(example => example[0]));
            const actionTensor = tf.tensor1d(
                batch.map(example => example[1]), 'int32');
            const qs = this.onlineNetwork.apply(stateTensor, {training: true})
                // @ts-ignore
                .mul(tf.oneHot(actionTensor, NUM_ACTIONS)).sum(-1);
            const rewardTensor = tf.tensor1d(batch.map(example => example[2]));
            const nextStateTensor = getStateTensor(
                batch.map(example => example[4]));
            // @ts-ignore
            const nextMaxQTensor = this.targetNetwork.predict(nextStateTensor).max(-1);
            const doneMask = tf.scalar(1).sub(
                tf.tensor1d(batch.map(example => example[3])).asType('float32'));
            const targetQs = rewardTensor.add(nextMaxQTensor.mul(doneMask).mul(gamma));
            return tf.losses.meanSquaredError(targetQs, qs);
        });
        // @ts-ignore
        const grads = tf.variableGrads(lossFunction);
        optimizer.applyGradients(grads.grads);
        tf.dispose(grads);
    }
    get currentReward() {
        return this.cumulativeReward;
    }
}

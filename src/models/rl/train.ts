import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

import { CubeAgent } from './agent.js';
import { copyWeights } from './dqn.js';


class MovingAverager {
    buffer: any[];

    constructor(bufferLength: number) {
        this.buffer = [];
        for (let i = 0; i < bufferLength; i++) {
            this.buffer.push(null);
        }
    }
    append(x: any) {
        this.buffer.shift();
        this.buffer.push(x);
    }
    average() {
        return this.buffer.reduce((x, prev) => x + prev) / this.buffer.length;
    }
}

export interface TrainingParams {
    batchSize: number;
    gamma: number;
    learningRate: number;
    cumulativeRewardThreshold: number;
    maxNumFrames: number;
    syncEveryFrames: number;
}

export class Trainer {
    agent: CubeAgent;
    batchSize: number = 64;
    gamma: number = 0.99;
    learningRate: number = 1e-3;
    cumulativeRewardThreshold: number = 100;
    maxNumFrames: number = 1e6;
    syncEveryFrames: number = 1e3;
    currentReward: number;
    bestReward: number;
    currentIteration: number;

    constructor(agent?: CubeAgent,
                batchSize?: number,
                gamma?: number,
                learningRate?: number,
                cumulativeRewardThreshold?: number,
                maxNumFrames?: number,
                syncEveryFrames?: number) {
        if (learningRate) {
            this.learningRate = learningRate;
        }
        if (agent) {
            this.agent = agent;
        }
        else {
            this.agent = new CubeAgent(undefined, undefined, this.learningRate);
        }
        if (batchSize) {
            this.batchSize = batchSize;
        }
        if (gamma) {
            this.gamma = gamma;
        }
        if (cumulativeRewardThreshold) {
            this.cumulativeRewardThreshold = cumulativeRewardThreshold;
        }
        if (maxNumFrames) {
            this.maxNumFrames = maxNumFrames;
        }
        if (syncEveryFrames) {
            this.syncEveryFrames = syncEveryFrames;
        }
        this.currentReward = 0;
        this.bestReward = 0;
        this.currentIteration = 0;
    }

    train() {
        for (let i = 0; i < this.agent.replayBufferSize; i++) {
            this.agent.playStep();
            this.currentReward = this.agent.currentReward;
        }
        const rewardAverager100 = new MovingAverager(100);
        const optimizer = tf.train.adam(this.learningRate);
        let tPrev = new Date().getTime();
        let frameCountPrev = this.agent.frameCount;
        let averageReward100Best = -Infinity;
        while (true) {
            this.agent.trainOnReplayBatch(this.batchSize, this.gamma, optimizer);
            const { cumulativeReward, done } = this.agent.playStep();
            if (done) {
                const t = new Date().getTime();
                const framesPerSecond = (this.agent.frameCount - frameCountPrev) / (t - tPrev) * 1e3;
                tPrev = t;
                frameCountPrev = this.agent.frameCount;
                rewardAverager100.append(cumulativeReward);
                const averageReward100 = rewardAverager100.average();

                console.log(
                    `Frame #${this.agent.frameCount}: ` +
                    `cumulativeReward100=${averageReward100.toFixed(1)}; ` +
                    `(epsilon=${this.agent.epsilon.toFixed(3)}) ` +
                    `(${framesPerSecond.toFixed(1)} frames/s)`);
                if (averageReward100 >= this.cumulativeRewardThreshold || this.agent.frameCount >= this.maxNumFrames) {
                    break;
                }
                if (averageReward100 > averageReward100Best) {
                    averageReward100Best = averageReward100;
                }
            }
            if (this.agent.frameCount % this.syncEveryFrames === 0) {
                copyWeights(this.agent.targetNetwork, this.agent.onlineNetwork);
                console.log('Synced weights from online network to target network');
            }
        }
    }
}

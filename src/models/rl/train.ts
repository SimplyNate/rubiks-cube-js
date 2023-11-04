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

export async function train(
    agent: CubeAgent,
    batchSize: number,
    gamma: number,
    learningRate: number,
    cumulativeRewardThreshold: number,
    maxNumFrames: number,
    syncEveryFrames: number) {
    for (let i = 0; i < agent.replayBufferSize; i++) {
        agent.playStep();
    }
    const rewardAverager100 = new MovingAverager(100);
    const optimizer = tf.train.adam(learningRate);
    let tPrev = new Date().getTime();
    let frameCountPrev = agent.frameCount;
    let averageReward100Best = -Infinity;
    while (true) {
        agent.trainOnReplayBatch(batchSize, gamma, optimizer);
        const { cumulativeReward, done } = agent.playStep();
        if (done) {
            const t = new Date().getTime();
            const framesPerSecond = (agent.frameCount - frameCountPrev) / (t - tPrev) * 1e3;
            tPrev = t;
            frameCountPrev = agent.frameCount;
            rewardAverager100.append(cumulativeReward);
            const averageReward100 = rewardAverager100.average();

            console.log(
                `Frame #${agent.frameCount}: ` +
                `cumulativeReward100=${averageReward100.toFixed(1)}; ` +
                `(epsilon=${agent.epsilon.toFixed(3)}) ` +
                `(${framesPerSecond.toFixed(1)} frames/s)`);
            if (averageReward100 >= cumulativeRewardThreshold || agent.frameCount >= maxNumFrames) {
                break;
            }
            if (averageReward100 > averageReward100Best) {
                averageReward100Best = averageReward100;
            }
        }
        if (agent.frameCount % syncEveryFrames === 0) {
            copyWeights(agent.targetNetwork, agent.onlineNetwork);
            console.log('Synced weights from online network to target network');
        }
    }
}

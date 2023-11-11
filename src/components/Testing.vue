<script setup lang="ts">
import * as tf from '@tensorflow/tfjs';
import { createDQN } from '../models/rl/dqn.js';
import { NUM_ACTIONS, CubeGame, getStateTensor } from '../models/game.js';
import { CubeAgent } from '../models/rl/agent.js';
import { Trainer } from '../models/rl/train.js';

/*
const dqn = createDQN(6, 9, NUM_ACTIONS);
const tensor = tf.tensor([[
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 2],
    [3, 3, 3, 3, 3, 3, 3, 3, 3],
    [4, 4, 4, 4, 4, 4, 4, 4, 4],
    [5, 5, 5, 5, 5, 5, 5, 5, 5],
]]);
// @ts-ignore
const output: tf.Tensor<tf.Rank> = dqn.predict(tensor);
const value = output.argMax(-1).dataSync()[0];
console.log(value);

const game = new CubeGame();
const state = game.getState();
const stateTensor = getStateTensor(state);
stateTensor.print();
// @ts-ignore
const output2: tf.Tensor<tf.Rank> = dqn.predict(stateTensor);
const value2 = output2.argMax(-1).dataSync()[0];
console.log(value2);
 */
const agent = new CubeAgent();
console.log('Playing Steps');
for (let i = 0; i < 128; i++) {
    agent.playStep();
}
console.log('Training on Replay');
agent.trainOnReplayBatch(64, 0.99, tf.train.adam(1e-3));
console.log('Done');

</script>

<template>
    <div></div>
</template>

<style scoped>

</style>
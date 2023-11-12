<script setup lang="ts">
import { ref } from 'vue';
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

const state = game.getState();
const stateTensor = getStateTensor(state);
stateTensor.print();
// @ts-ignore
const output2: tf.Tensor<tf.Rank> = dqn.predict(stateTensor);
const value2 = output2.argMax(-1).dataSync()[0];
console.log(value2);

const trainer = new Trainer();
trainer.train();
 */
const game = new CubeGame();
const state = ref(game.reset());

console.log(state);
console.log(game.cube.toString());

</script>

<template>
    <div>
    </div>
</template>

<style scoped>

</style>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import * as tf from '@tensorflow/tfjs';
import { createDQN } from '../models/rl/dqn.js';
import { NUM_ACTIONS, CubeGame, getStateTensor } from '../models/game.js';
import { CubeAgent } from '../models/rl/agent.js';
import { Trainer } from '../models/rl/train.js';
import { Cube } from "../cube.js";

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

const cube = new Cube();
console.log(cube.isSolved());
cube.f();
console.log(cube.isSolved());
cube.counter_f();
console.log(cube.isSolved());
worker.onmessage = (event) => {
    console.log('Received message');
    totalFrames.value = event.data.totalFrames;
    averageReward100.value = event.data.averageReward100;
    bestReward100.value = event.data.bestReward100;
    epsilon.value = event.data.epsilon;
    fps.value = event.data.fps;
};
 */
const trainer = new Trainer();
const totalFrames = ref(0);
const averageReward100 = ref(0);
const bestReward100 = ref(-Infinity);
const epsilon = ref(0);
const fps = ref(0);
function startTraining() {
    console.log('Starting worker');
    trainer.train();
}

function endTraining() {
}

</script>

<template>
    <div>
        <div>
            <button @click="startTraining">Start</button>
            <button @click="endTraining">End</button>
        </div>
        <div>
            <div>Frame: {{ totalFrames }}</div>
            <div>Average Reward 100: {{ averageReward100 }}</div>
            <div>Best Reward 100: {{ bestReward100 }}</div>
            <div>Epsilon: {{ epsilon }}</div>
            <div>Steps per second: {{ fps }}</div>
        </div>
    </div>
</template>

<style scoped>

</style>
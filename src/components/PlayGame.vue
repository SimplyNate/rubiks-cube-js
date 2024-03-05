<script setup lang="ts">
import {
    CubeGame,
    ACTION_F,
    ACTION_COUNTER_F,
    ACTION_B,
    ACTION_COUNTER_B,
    ACTION_D,
    ACTION_COUNTER_D,
    ACTION_COUNTER_L,
    ACTION_L,
    ACTION_R,
    ACTION_U,
    ACTION_COUNTER_R,
    ACTION_COUNTER_U
} from '../models/game.js';
import { solve } from '../solve.js';
import { ref, onMounted, reactive, nextTick } from 'vue';
import {Color, Cube, Face} from "../cube.js";

const game = reactive<CubeGame>(new CubeGame(20));
const reward = ref(0);
const lastReward = ref(0);

function reset() {
    game.reset();
    reward.value = 0;
    lastReward.value = 0;
}

async function keyListener(evt: KeyboardEvent) {
    const { key } = evt;
    let result;
    if (key === 'u') {
        result = game.step(ACTION_U);
    }
    else if (key === 'U') {
        result = game.step(ACTION_COUNTER_U);
    }
    if (key === 'l') {
        result = game.step(ACTION_L);
    }
    else if (key === 'L') {
        result = game.step(ACTION_COUNTER_L);
    }
    if (key === 'f') {
        result = game.step(ACTION_F);
    }
    else if (key === 'F') {
        result = game.step(ACTION_COUNTER_F);
    }
    if (key === 'r') {
        result = game.step(ACTION_R);
    }
    else if (key === 'R') {
        result = game.step(ACTION_COUNTER_R);
    }
    if (key === 'b') {
        result = game.step(ACTION_B);
    }
    else if (key === 'B') {
        result = game.step(ACTION_COUNTER_B);
    }
    if (key === 'd') {
        result = game.step(ACTION_D);
    }
    else if (key === 'D') {
        result = game.step(ACTION_COUNTER_D);
    }
    if (result) {
        reward.value += result.reward;
        lastReward.value = result.reward;
    }
}

function solveCube() {
    const targetCube = Cube.fromString(game.cube.toString());
    const trackingCube = Cube.fromString(game.cube.toString());
    solve(targetCube);
    // @ts-ignore
    const interval = setInterval(() => {
        console.log('Interval');
        const move = targetCube.history.shift();
        if (move) {
            if (move.includes('reorient')) {
                const reorientValue = move.split(' ')[1];
                const [u, f] = reorientValue.split('');
                trackingCube.perform_reorientation(u as Color, f as Color);
            }
            else {
                if (move.includes('counter')) {
                    trackingCube.performRotation(move.split('_')[1] as Face, true);
                }
                else {
                    trackingCube.performRotation(move as Face, false);
                }
            }
            game.cube.cube = trackingCube.cube;
            nextTick();
        }
        else {
            console.log(trackingCube.isSolved());
            console.log(game.cube.isSolved());
            clearInterval(interval);
        }
    }, 1000);
}

function scrambleCube() {
    game.cube.scramble();
}

onMounted(() => {
    window.addEventListener('keydown', keyListener);
});

</script>

<template>
    <div style="display: flex;">
        <div style="margin-right: 1em; visibility: hidden;">
            <div>
                <div class="cube"></div>
                <div class="cube"></div>
                <div class="cube"></div>
            </div>
            <div>
                <div class="cube"></div>
                <div class="cube"></div>
                <div class="cube"></div>
            </div>
            <div>
                <div class="cube"></div>
                <div class="cube"></div>
                <div class="cube"></div>
            </div>
        </div>
        <div style="margin-right: 1em;">
            <div>
                <div :class="`cube ${game.cube.cube.u[0]}`"></div>
                <div :class="`cube ${game.cube.cube.u[1]}`"></div>
                <div :class="`cube ${game.cube.cube.u[2]}`"></div>
            </div>
            <div>
                <div :class="`cube ${game.cube.cube.u[3]}`"></div>
                <div :class="`cube ${game.cube.cube.u[4]}`"></div>
                <div :class="`cube ${game.cube.cube.u[5]}`"></div>
            </div>
            <div>
                <div :class="`cube ${game.cube.cube.u[6]}`"></div>
                <div :class="`cube ${game.cube.cube.u[7]}`"></div>
                <div :class="`cube ${game.cube.cube.u[8]}`"></div>
            </div>
        </div>
    </div>
    <div style="display: flex; margin-top: 0.5em; margin-bottom: 0.5em;">
        <div style="margin-right: 1em;">
            <div>
                <div :class="`cube ${game.cube.cube.l[0]}`"></div>
                <div :class="`cube ${game.cube.cube.l[1]}`"></div>
                <div :class="`cube ${game.cube.cube.l[2]}`"></div>
            </div>
            <div>
                <div :class="`cube ${game.cube.cube.l[3]}`"></div>
                <div :class="`cube ${game.cube.cube.l[4]}`"></div>
                <div :class="`cube ${game.cube.cube.l[5]}`"></div>
            </div>
            <div>
                <div :class="`cube ${game.cube.cube.l[6]}`"></div>
                <div :class="`cube ${game.cube.cube.l[7]}`"></div>
                <div :class="`cube ${game.cube.cube.l[8]}`"></div>
            </div>
        </div>
        <div style="margin-right: 1em;">
            <div>
                <div :class="`cube ${game.cube.cube.f[0]}`"></div>
                <div :class="`cube ${game.cube.cube.f[1]}`"></div>
                <div :class="`cube ${game.cube.cube.f[2]}`"></div>
            </div>
            <div>
                <div :class="`cube ${game.cube.cube.f[3]}`"></div>
                <div :class="`cube ${game.cube.cube.f[4]}`"></div>
                <div :class="`cube ${game.cube.cube.f[5]}`"></div>
            </div>
            <div>
                <div :class="`cube ${game.cube.cube.f[6]}`"></div>
                <div :class="`cube ${game.cube.cube.f[7]}`"></div>
                <div :class="`cube ${game.cube.cube.f[8]}`"></div>
            </div>
        </div>
        <div style="margin-right: 1em;">
            <div>
                <div :class="`cube ${game.cube.cube.r[0]}`"></div>
                <div :class="`cube ${game.cube.cube.r[1]}`"></div>
                <div :class="`cube ${game.cube.cube.r[2]}`"></div>
            </div>
            <div>
                <div :class="`cube ${game.cube.cube.r[3]}`"></div>
                <div :class="`cube ${game.cube.cube.r[4]}`"></div>
                <div :class="`cube ${game.cube.cube.r[5]}`"></div>
            </div>
            <div>
                <div :class="`cube ${game.cube.cube.r[6]}`"></div>
                <div :class="`cube ${game.cube.cube.r[7]}`"></div>
                <div :class="`cube ${game.cube.cube.r[8]}`"></div>
            </div>
        </div>
        <div style="margin-right: 1em;">
            <div>
                <div :class="`cube ${game.cube.cube.b[0]}`"></div>
                <div :class="`cube ${game.cube.cube.b[1]}`"></div>
                <div :class="`cube ${game.cube.cube.b[2]}`"></div>
            </div>
            <div>
                <div :class="`cube ${game.cube.cube.b[3]}`"></div>
                <div :class="`cube ${game.cube.cube.b[4]}`"></div>
                <div :class="`cube ${game.cube.cube.b[5]}`"></div>
            </div>
            <div>
                <div :class="`cube ${game.cube.cube.b[6]}`"></div>
                <div :class="`cube ${game.cube.cube.b[7]}`"></div>
                <div :class="`cube ${game.cube.cube.b[8]}`"></div>
            </div>
        </div>
    </div>
    <div style="display: flex;">
        <div style="margin-right: 1em; visibility: hidden;">
            <div>
                <div class="cube"></div>
                <div class="cube"></div>
                <div class="cube"></div>
            </div>
            <div>
                <div class="cube"></div>
                <div class="cube"></div>
                <div class="cube"></div>
            </div>
            <div>
                <div class="cube"></div>
                <div class="cube"></div>
                <div class="cube"></div>
            </div>
        </div>
        <div style="margin-right: 1em;">
            <div>
                <div :class="`cube ${game.cube.cube.d[0]}`"></div>
                <div :class="`cube ${game.cube.cube.d[1]}`"></div>
                <div :class="`cube ${game.cube.cube.d[2]}`"></div>
            </div>
            <div>
                <div :class="`cube ${game.cube.cube.d[3]}`"></div>
                <div :class="`cube ${game.cube.cube.d[4]}`"></div>
                <div :class="`cube ${game.cube.cube.d[5]}`"></div>
            </div>
            <div>
                <div :class="`cube ${game.cube.cube.d[6]}`"></div>
                <div :class="`cube ${game.cube.cube.d[7]}`"></div>
                <div :class="`cube ${game.cube.cube.d[8]}`"></div>
            </div>
        </div>
    </div>
    <div style="margin-top: 2em;">
        <div>
            <button @click="reset">Reset</button>
            <button @click="scrambleCube">Scramble</button>
            <button @click="solveCube">Solve</button>
        </div>
        <div>Entropy: {{ game.cube.entropy }}</div>
        <div>Moves: {{ game.currentMove }} / {{ game.maxMoves }}</div>
        <div>Difficulty: {{ game.difficulty }}</div>
        <div>Reward: {{ reward }}</div>
        <div>Last reward: {{ lastReward }}</div>
    </div>
</template>

<style scoped>
.cube {
    width: 50px;
    height: 50px;
    background-color: rgb(128, 128, 128);
    border: 2px solid black;
    display: inline-block;
}
.w {
    background-color: white;
}
.b {
    background-color: blue;
}
.o {
    background-color: orange;
}
.r {
    background-color: red;
}
.g {
    background-color: green;
}
.y {
    background-color: yellow;
}
</style>
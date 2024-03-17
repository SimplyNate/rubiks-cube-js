<script setup lang="ts">
import {Color, Cube, Face} from '../cube.js';
import {onMounted, ref} from "vue";
import {solve, translateMove} from "../solve.ts";

const cube = new Cube();
let translatedCube = new Cube();

const moveNumber = ref(0);

const deviation = ref(false);

function scramble() {
    cube.scramble();
    translatedCube = Cube.fromString(cube.toString());
    setColors();
    clearMoveList();
    moveNumber.value = 0;
}

function setColors() {
    for (const face in cube.cube) {
        for (let i = 0; i < cube.cube[face].length; i++) {
            const color = cube.cube[face][i];
            const elem = <Element>document.querySelector(`#${face}${i}`);
            elem.setAttribute('class', `cube ${color}`);
            
            const translatedColor = translatedCube.cube[face][i];
            const tElem = <Element>document.querySelector(`#t${face}${i}`);
            tElem.setAttribute('class', `cube ${translatedColor}`);
        }
    }
}

function addMoveList(moveString: string) {
    const elem = <Element>document.querySelector('#moveList');
    const move = document.createElement('div');
    move.innerText = moveString;
    elem.appendChild(move);
    const moveContainer = <Element>document.querySelector('#moveContainer');
    moveContainer.scrollTo(0, moveContainer.scrollHeight);
}

function tAddMoveList(moveString: string) {
    const elem = <Element>document.querySelector('#tmoveList');
    const move = document.createElement('div');
    move.innerText = moveString;
    elem.appendChild(move);
    const moveContainer = <Element>document.querySelector('#tmoveContainer');
    moveContainer.scrollTo(0, moveContainer.scrollHeight);
}

function clearMoveList() {
    const elem = <Element>document.querySelector('#moveList');
    elem.innerHTML = '';
    const tElem = <Element>document.querySelector('#tmoveList');
    tElem.innerHTML = '';
}

let stepMoves: string[] = [];
let translatedMoves: string[] = [];

function solveStep() {
    const targetCube = Cube.fromString(cube.toString());
    const originalOrientation = `${targetCube.colorOf('u')}${targetCube.colorOf('f')}`;
    solve(targetCube);
    // translate all solve moves
    const translated: string[] = [];
    let currentOrientation = originalOrientation;
    for (const move of targetCube.history) {
        if (move.includes('reorient')) {
            currentOrientation = move.split(' ')[1];
            // for compatibility with synchronizing with reorienting cube
            translated.push(`reorient ${originalOrientation}`);
        }
        else {
            const isCounterClockwise = move.includes('counter');
            const parsedMove = isCounterClockwise ? move.split('_')[1] : move;
            let translatedMove: string | Face = translateMove(currentOrientation, originalOrientation, parsedMove as Face);
            if (isCounterClockwise) {
                translatedMove = `counter_${translatedMove}`;
            }
            translated.push(translatedMove);
        }
    }
    translatedMoves = translated;
    stepMoves = [...targetCube.history];
}

function step() {
    const move = stepMoves.shift();
    const tMove = translatedMoves.shift();
    if (move && tMove) {
        moveNumber.value += 1;
        addMoveList(move);
        tAddMoveList(tMove);
        if (move.includes('reorient')) {
            const reorientValue = move.split(' ')[1];
            const [u, f] = reorientValue.split('');
            cube.perform_reorientation(u as Color, f as Color);
        }
        else {
            if (move.includes('counter')) {
                cube.performRotation(move.split('_')[1] as Face, true);
                translatedCube.performRotation(tMove.split('_')[1] as Face, true);
            }
            else {
                cube.performRotation(move as Face, false);
                translatedCube.performRotation(tMove as Face, false);
            }
        }
        setColors();
    }
    const compareCube = Cube.fromString(cube.toString());
    compareCube.perform_reorientation('y', 'o');
    deviation.value = compareCube.toString() !== translatedCube.toString();
}

function solveCube() {
    const targetCube = Cube.fromString(cube.toString());
    const originalOrientation = `${targetCube.colorOf('u')}${targetCube.colorOf('f')}`;
    solve(targetCube);
    // translate all solve moves
    const translated: string[] = [];
    let currentOrientation = originalOrientation;
    for (const move of targetCube.history) {
        if (move.includes('reorient')) {
            currentOrientation = move.split(' ')[1];
            // for compatibility with synchronizing with reorienting cube
            translated.push(`reorient ${originalOrientation}`);
        }
        else {
            const isCounterClockwise = move.includes('counter');
            const parsedMove = isCounterClockwise ? move.split('_')[1] : move;
            let translatedMove: string | Face = translateMove(currentOrientation, originalOrientation, parsedMove as Face);
            if (isCounterClockwise) {
                translatedMove = `counter_${translatedMove}`;
            }
            translated.push(translatedMove);
        }
    }
    const interval = setInterval(() => {
        const move = targetCube.history.shift();
        const tMove = translated.shift();
        if (move && tMove) {
            moveNumber.value += 1;
            addMoveList(move);
            tAddMoveList(tMove);
            if (move.includes('reorient')) {
                const reorientValue = move.split(' ')[1];
                const [u, f] = reorientValue.split('');
                cube.perform_reorientation(u as Color, f as Color);
            }
            else {
                if (move.includes('counter')) {
                    cube.performRotation(move.split('_')[1] as Face, true);
                    translatedCube.performRotation(tMove.split('_')[1] as Face, true);
                }
                else {
                    cube.performRotation(move as Face, false);
                    translatedCube.performRotation(tMove as Face, false);
                }
            }
            setColors();
        }
        else {
            clearInterval(interval);
        }
    }, 50);
}

onMounted(() => {
    setColors();
});

</script>

<template>
    <div style="display: flex;">
        <div>
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
                        <div class="cube" id="u0"></div>
                        <div class="cube" id="u1"></div>
                        <div class="cube" id="u2"></div>
                    </div>
                    <div>
                        <div class="cube" id="u3"></div>
                        <div class="cube" id="u4"></div>
                        <div class="cube" id="u5"></div>
                    </div>
                    <div>
                        <div class="cube" id="u6"></div>
                        <div class="cube" id="u7"></div>
                        <div class="cube" id="u8"></div>
                    </div>
                </div>
            </div>
            <div style="display: flex; margin-top: 0.5em; margin-bottom: 0.5em;">
                <div style="margin-right: 1em;">
                    <div>
                        <div class="cube" id="l0"></div>
                        <div class="cube" id="l1"></div>
                        <div class="cube" id="l2"></div>
                    </div>
                    <div>
                        <div class="cube" id="l3"></div>
                        <div class="cube" id="l4"></div>
                        <div class="cube" id="l5"></div>
                    </div>
                    <div>
                        <div class="cube" id="l6"></div>
                        <div class="cube" id="l7"></div>
                        <div class="cube" id="l8"></div>
                    </div>
                </div>
                <div style="margin-right: 1em;">
                    <div>
                        <div class="cube" id="f0"></div>
                        <div class="cube" id="f1"></div>
                        <div class="cube" id="f2"></div>
                    </div>
                    <div>
                        <div class="cube" id="f3"></div>
                        <div class="cube" id="f4"></div>
                        <div class="cube" id="f5"></div>
                    </div>
                    <div>
                        <div class="cube" id="f6"></div>
                        <div class="cube" id="f7"></div>
                        <div class="cube" id="f8"></div>
                    </div>
                </div>
                <div style="margin-right: 1em;">
                    <div>
                        <div class="cube" id="r0"></div>
                        <div class="cube" id="r1"></div>
                        <div class="cube" id="r2"></div>
                    </div>
                    <div>
                        <div class="cube" id="r3"></div>
                        <div class="cube" id="r4"></div>
                        <div class="cube" id="r5"></div>
                    </div>
                    <div>
                        <div class="cube" id="r6"></div>
                        <div class="cube" id="r7"></div>
                        <div class="cube" id="r8"></div>
                    </div>
                </div>
                <div style="margin-right: 1em;">
                    <div>
                        <div class="cube" id="b0"></div>
                        <div class="cube" id="b1"></div>
                        <div class="cube" id="b2"></div>
                    </div>
                    <div>
                        <div class="cube" id="b3"></div>
                        <div class="cube" id="b4"></div>
                        <div class="cube" id="b5"></div>
                    </div>
                    <div>
                        <div class="cube" id="b6"></div>
                        <div class="cube" id="b7"></div>
                        <div class="cube" id="b8"></div>
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
                        <div class="cube" id="d0"></div>
                        <div class="cube" id="d1"></div>
                        <div class="cube" id="d2"></div>
                    </div>
                    <div>
                        <div class="cube" id="d3"></div>
                        <div class="cube" id="d4"></div>
                        <div class="cube" id="d5"></div>
                    </div>
                    <div>
                        <div class="cube" id="d6"></div>
                        <div class="cube" id="d7"></div>
                        <div class="cube" id="d8"></div>
                    </div>
                </div>
            </div>
        </div>
        <div style="margin-left: 50px; height: 400px; width: 100px; overflow: auto;" id="moveContainer">
            <div>Move List</div>
            <div id="moveList"></div>
        </div>
        <div>Moves to solve: <span id="moveNumberTracker">{{ moveNumber }}</span></div>
    </div>

    <div style="display: flex;">
        <div>
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
                        <div class="cube" id="tu0"></div>
                        <div class="cube" id="tu1"></div>
                        <div class="cube" id="tu2"></div>
                    </div>
                    <div>
                        <div class="cube" id="tu3"></div>
                        <div class="cube" id="tu4"></div>
                        <div class="cube" id="tu5"></div>
                    </div>
                    <div>
                        <div class="cube" id="tu6"></div>
                        <div class="cube" id="tu7"></div>
                        <div class="cube" id="tu8"></div>
                    </div>
                </div>
            </div>
            <div style="display: flex; margin-top: 0.5em; margin-bottom: 0.5em;">
                <div style="margin-right: 1em;">
                    <div>
                        <div class="cube" id="tl0"></div>
                        <div class="cube" id="tl1"></div>
                        <div class="cube" id="tl2"></div>
                    </div>
                    <div>
                        <div class="cube" id="tl3"></div>
                        <div class="cube" id="tl4"></div>
                        <div class="cube" id="tl5"></div>
                    </div>
                    <div>
                        <div class="cube" id="tl6"></div>
                        <div class="cube" id="tl7"></div>
                        <div class="cube" id="tl8"></div>
                    </div>
                </div>
                <div style="margin-right: 1em;">
                    <div>
                        <div class="cube" id="tf0"></div>
                        <div class="cube" id="tf1"></div>
                        <div class="cube" id="tf2"></div>
                    </div>
                    <div>
                        <div class="cube" id="tf3"></div>
                        <div class="cube" id="tf4"></div>
                        <div class="cube" id="tf5"></div>
                    </div>
                    <div>
                        <div class="cube" id="tf6"></div>
                        <div class="cube" id="tf7"></div>
                        <div class="cube" id="tf8"></div>
                    </div>
                </div>
                <div style="margin-right: 1em;">
                    <div>
                        <div class="cube" id="tr0"></div>
                        <div class="cube" id="tr1"></div>
                        <div class="cube" id="tr2"></div>
                    </div>
                    <div>
                        <div class="cube" id="tr3"></div>
                        <div class="cube" id="tr4"></div>
                        <div class="cube" id="tr5"></div>
                    </div>
                    <div>
                        <div class="cube" id="tr6"></div>
                        <div class="cube" id="tr7"></div>
                        <div class="cube" id="tr8"></div>
                    </div>
                </div>
                <div style="margin-right: 1em;">
                    <div>
                        <div class="cube" id="tb0"></div>
                        <div class="cube" id="tb1"></div>
                        <div class="cube" id="tb2"></div>
                    </div>
                    <div>
                        <div class="cube" id="tb3"></div>
                        <div class="cube" id="tb4"></div>
                        <div class="cube" id="tb5"></div>
                    </div>
                    <div>
                        <div class="cube" id="tb6"></div>
                        <div class="cube" id="tb7"></div>
                        <div class="cube" id="tb8"></div>
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
                        <div class="cube" id="td0"></div>
                        <div class="cube" id="td1"></div>
                        <div class="cube" id="td2"></div>
                    </div>
                    <div>
                        <div class="cube" id="td3"></div>
                        <div class="cube" id="td4"></div>
                        <div class="cube" id="td5"></div>
                    </div>
                    <div>
                        <div class="cube" id="td6"></div>
                        <div class="cube" id="td7"></div>
                        <div class="cube" id="td8"></div>
                    </div>
                </div>
            </div>
        </div>
        <div style="margin-left: 50px; height: 400px; width: 100px; overflow: auto;" id="tmoveContainer">
            <div>Move List</div>
            <div id="tmoveList"></div>
        </div>
        <div>Moves to solve: <span id="tmoveNumberTracker">{{ moveNumber }}</span></div>
    </div>

    <div>
        <button @click="scramble">Scramble</button>
        <button @click="solveCube">Solve</button>
        <button @click="solveStep">Solve Step</button>
        <button @click="step">Step</button>
    </div>

    <div v-if="deviation">
        <h1>Deviation detected</h1>
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
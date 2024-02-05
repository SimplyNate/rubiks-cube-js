import { expect, test } from 'vitest';
import { Cube } from '../src/cube';
import {
    type Edge,
    type Corner,
    findEdges,
    findCorners,
    isEdgeInCorrectPosition,
    isCornerInCorrectPosition,
    areOppositeColors,
    areOppositeFaces,
    targetFaceIsClockwise,
    targetFaceIsCounterClockwise,
    solveInTopLayerCorrectFace,
    solveInTopLayerIncorrectFace,
    solveInBottomLayerDown,
    solveInBottomLayerMiddle,
    solveInMiddleLayer,
    solveWhiteCross
} from '../src/solve';

function countCorrect(edges: Edge[] | Corner[]): number {
    let solvedCount = 0;
    for (const edge of edges) {
        if (edge.correct) {
            solvedCount += 1;
        }
    }
    return solvedCount;
}

test('Finds edges', () => {
    const cube = new Cube();
    const edges = findEdges(cube, 'w');
    expect(edges).toHaveLength(4);
    expect(edges[0].face).toBe('d');
    expect(edges[0].index).toBe(1);
    expect(edges[1].face).toBe('d');
    expect(edges[1].index).toBe(3);
    expect(edges[2].face).toBe('d');
    expect(edges[2].index).toBe(5);
    expect(edges[3].face).toBe('d');
    expect(edges[3].index).toBe(7);
    const scrambled = Cube.scrambled();
    scrambled.perform_reorientation('w', 'o');
    const sEdges = findEdges(scrambled, 'w');
    expect(sEdges).toHaveLength(4);
});

test('solveInTopLayerCorrectFace', () => {
    let cube = new Cube();
    cube.perform_reorientation('w', 'o');
    cube.u();
    let whiteEdges = findEdges(cube, 'w');
    solveInTopLayerCorrectFace(cube, whiteEdges[0]);
    let isSolved = isEdgeInCorrectPosition(cube, { face: 'u', index: 3, adjacentIndex: 1, adjacentFace: 'l', correct: false });
    expect(isSolved).toBeTruthy();
    cube = new Cube();
    cube.perform_reorientation('w', 'o');
    cube.u();
    whiteEdges = findEdges(cube, 'w');
    solveInTopLayerCorrectFace(cube, whiteEdges[1]);
    isSolved = isEdgeInCorrectPosition(cube, { face: 'u', index: 7, adjacentIndex: 1, adjacentFace: 'f', correct: false });
    expect(isSolved).toBeTruthy();
    cube = new Cube();
    cube.perform_reorientation('w', 'o');
    cube.u();
    whiteEdges = findEdges(cube, 'w');
    solveInTopLayerCorrectFace(cube, whiteEdges[2]);
    isSolved = isEdgeInCorrectPosition(cube, { face: 'u', index: 1, adjacentIndex: 1, adjacentFace: 'b', correct: false });
    expect(isSolved).toBeTruthy();
    cube = new Cube();
    cube.perform_reorientation('w', 'o');
    cube.u();
    whiteEdges = findEdges(cube, 'w');
    solveInTopLayerCorrectFace(cube, whiteEdges[3]);
    isSolved = isEdgeInCorrectPosition(cube, { face: 'u', index: 5, adjacentIndex: 1, adjacentFace: 'r', correct: false });
    expect(isSolved).toBeTruthy();
});
test('solveInTopLayerIncorrectFace', () => {
    let cube = new Cube();
    cube.perform_reorientation('w', 'o');
    cube.l().f();
    let whiteEdges = findEdges(cube, 'w');
    expect(countCorrect(whiteEdges)).toEqual(2);
    solveInTopLayerIncorrectFace(cube, whiteEdges[0]);
    let resultEdges = findEdges(cube, 'w');
    expect(countCorrect(resultEdges)).toEqual(3);

    cube = new Cube();
    cube.perform_reorientation('w', 'o');
    cube.f().r();
    whiteEdges = findEdges(cube, 'w');
    expect(countCorrect(whiteEdges)).toEqual(2);
    solveInTopLayerIncorrectFace(cube, whiteEdges[0]);
    resultEdges = findEdges(cube, 'w');
    expect(countCorrect(resultEdges)).toEqual(3);

    cube = new Cube();
    cube.perform_reorientation('w', 'o');
    cube.r().b();
    whiteEdges = findEdges(cube, 'w');
    expect(countCorrect(whiteEdges)).toEqual(2);
    solveInTopLayerIncorrectFace(cube, whiteEdges[1]);
    resultEdges = findEdges(cube, 'w');
    expect(countCorrect(resultEdges)).toEqual(3);

    cube = new Cube();
    cube.perform_reorientation('w', 'o');
    cube.b().l();
    whiteEdges = findEdges(cube, 'w');
    expect(countCorrect(whiteEdges)).toEqual(2);
    solveInTopLayerIncorrectFace(cube, whiteEdges[1]);
    resultEdges = findEdges(cube, 'w');
    expect(countCorrect(resultEdges)).toEqual(3);
});
test('solveInBottomLayerDown', () => {
    let cube = new Cube();
    cube.perform_reorientation('w', 'o');
    cube.l().l();
    let whiteEdges = findEdges(cube, 'w');
    expect(countCorrect(whiteEdges)).toEqual(3);
    solveInBottomLayerDown(cube, whiteEdges[3]);
    let resultEdges = findEdges(cube, 'w');
    expect(countCorrect(resultEdges)).toEqual(4);

    cube = new Cube();
    cube.perform_reorientation('w', 'o');
    cube.l().l().d();
    whiteEdges = findEdges(cube, 'w');
    expect(countCorrect(whiteEdges)).toEqual(3);
    solveInBottomLayerDown(cube, whiteEdges[3]);
    resultEdges = findEdges(cube, 'w');
    expect(countCorrect(resultEdges)).toEqual(4);

    cube = new Cube();
    cube.perform_reorientation('w', 'o');
    cube.l().l().d().d();
    whiteEdges = findEdges(cube, 'w');
    expect(countCorrect(whiteEdges)).toEqual(3);
    solveInBottomLayerDown(cube, whiteEdges[3]);
    resultEdges = findEdges(cube, 'w');
    expect(countCorrect(resultEdges)).toEqual(4);

    cube = new Cube();
    cube.perform_reorientation('w', 'o');
    cube.l().l().counter_d();
    whiteEdges = findEdges(cube, 'w');
    expect(countCorrect(whiteEdges)).toEqual(3);
    solveInBottomLayerDown(cube, whiteEdges[3]);
    resultEdges = findEdges(cube, 'w');
    expect(countCorrect(resultEdges)).toEqual(4);
});
test('solveInBottomLayerMiddle', () => {
    let cube = new Cube();
    cube.perform_reorientation('w', 'o');
    cube.l().counter_f();
    let whiteEdges = findEdges(cube, 'w');
    expect(countCorrect(whiteEdges)).toEqual(2);
    solveInBottomLayerMiddle(cube, whiteEdges[0]);
    let resultEdges = findEdges(cube, 'w');
    expect(countCorrect(resultEdges)).toEqual(3);

    cube = new Cube();
    cube.perform_reorientation('w', 'o');
    cube.l().counter_f().counter_d();
    whiteEdges = findEdges(cube, 'w');
    expect(countCorrect(whiteEdges)).toEqual(2);
    solveInBottomLayerMiddle(cube, whiteEdges[1]);
    resultEdges = findEdges(cube, 'w');
    expect(countCorrect(resultEdges)).toEqual(3);

    cube = new Cube();
    cube.perform_reorientation('w', 'o');
    cube.l().counter_f().counter_d().counter_d();
    whiteEdges = findEdges(cube, 'w');
    expect(countCorrect(whiteEdges)).toEqual(2);
    solveInBottomLayerMiddle(cube, whiteEdges[1]);
    resultEdges = findEdges(cube, 'w');
    expect(countCorrect(resultEdges)).toEqual(3);

    cube = new Cube();
    cube.perform_reorientation('w', 'o');
    cube.l().counter_f().d();
    whiteEdges = findEdges(cube, 'w');
    expect(countCorrect(whiteEdges)).toEqual(2);
    solveInBottomLayerMiddle(cube, whiteEdges[1]);
    resultEdges = findEdges(cube, 'w');
    expect(countCorrect(resultEdges)).toEqual(3);
});
test('solveInMiddleLayer', () => {
    let cube = new Cube();
    cube.perform_reorientation('w', 'o');
    cube.l();
    let whiteEdges = findEdges(cube, 'w');
    expect(countCorrect(whiteEdges)).toEqual(3);
    solveInMiddleLayer(cube, whiteEdges[0]);
    let resultEdges = findEdges(cube, 'w');
    expect(countCorrect(resultEdges)).toEqual(4);

    cube = new Cube();
    cube.perform_reorientation('w', 'o');
    cube.l().f().f();
    whiteEdges = findEdges(cube, 'w');
    expect(countCorrect(whiteEdges)).toEqual(2);
    solveInMiddleLayer(cube, whiteEdges[0]);
    resultEdges = findEdges(cube, 'w');
    expect(countCorrect(resultEdges)).toEqual(3);

    cube = new Cube();
    cube.perform_reorientation('w', 'o');
    cube.counter_l();
    whiteEdges = findEdges(cube, 'w');
    expect(countCorrect(whiteEdges)).toEqual(3);
    solveInMiddleLayer(cube, whiteEdges[0]);
    resultEdges = findEdges(cube, 'w');
    expect(countCorrect(resultEdges)).toEqual(4);

    cube = new Cube();
    cube.perform_reorientation('w', 'o');
    cube.counter_l().b().b();
    whiteEdges = findEdges(cube, 'w');
    expect(countCorrect(whiteEdges)).toEqual(2);
    solveInMiddleLayer(cube, whiteEdges[0]);
    resultEdges = findEdges(cube, 'w');
    expect(countCorrect(resultEdges)).toEqual(3);

    cube = new Cube();
    cube.perform_reorientation('w', 'o');
    cube.l().counter_f().d().r();
    whiteEdges = findEdges(cube, 'w');
    expect(countCorrect(whiteEdges)).toEqual(1);
    solveInMiddleLayer(cube, whiteEdges[1]);
    resultEdges = findEdges(cube, 'w');
    expect(countCorrect(resultEdges)).toEqual(2);

    cube = new Cube();
    cube.perform_reorientation('w', 'o');
    cube.l().counter_f().d().counter_r();
    whiteEdges = findEdges(cube, 'w');
    expect(countCorrect(whiteEdges)).toEqual(1);
    solveInMiddleLayer(cube, whiteEdges[2]);
    resultEdges = findEdges(cube, 'w');
    expect(countCorrect(resultEdges)).toEqual(2);
});

test('Solves White Cross from Scrambled', () => {
    const cube = new Cube();
    cube
        .r().r().d()
        .counter_l().counter_b().counter_r()
        .b().counter_d().u()
        .r().l().d()
        .d().f().d()
        .r().u().counter_d()
        .r().counter_u();
    solveWhiteCross(cube);
    const resultEdges = findEdges(cube, 'w');
    console.log(cube.scrambleHistory);
    console.log(cube.history);
    expect(countCorrect(resultEdges)).toEqual(4);
});

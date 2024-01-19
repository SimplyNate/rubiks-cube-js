import { expect, test } from 'vitest';
import { Cube } from '../src/cube';
import {
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
    scrambled.reorient('w', 'o');
    const sEdges = findEdges(scrambled, 'w');
    expect(sEdges).toHaveLength(4);
});

test('solveInTopLayerCorrectFace', () => {
    let cube = new Cube();
    cube.reorient('w', 'o');
    cube.u();
    let whiteEdges = findEdges(cube, 'w');
    solveInTopLayerCorrectFace(cube, whiteEdges[0]);
    let isSolved = isEdgeInCorrectPosition(cube, { face: 'u', index: 3, adjacentIndex: 1, adjacentFace: 'l'});
    expect(isSolved).toBeTruthy();
    cube = new Cube();
    cube.reorient('w', 'o');
    cube.u();
    whiteEdges = findEdges(cube, 'w');
    solveInTopLayerCorrectFace(cube, whiteEdges[1]);
    isSolved = isEdgeInCorrectPosition(cube, { face: 'u', index: 7, adjacentIndex: 1, adjacentFace: 'f'});
    expect(isSolved).toBeTruthy();
    cube = new Cube();
    cube.reorient('w', 'o');
    cube.u();
    whiteEdges = findEdges(cube, 'w');
    solveInTopLayerCorrectFace(cube, whiteEdges[2]);
    isSolved = isEdgeInCorrectPosition(cube, { face: 'u', index: 1, adjacentIndex: 1, adjacentFace: 'b'});
    expect(isSolved).toBeTruthy();
    cube = new Cube();
    cube.reorient('w', 'o');
    cube.u();
    whiteEdges = findEdges(cube, 'w');
    solveInTopLayerCorrectFace(cube, whiteEdges[3]);
    isSolved = isEdgeInCorrectPosition(cube, { face: 'u', index: 5, adjacentIndex: 1, adjacentFace: 'r'});
    expect(isSolved).toBeTruthy();
});
test('solveInTopLayerIncorrectFace', () => {
    const cube = new Cube();
    cube.reorient('w', 'o');

    const whiteEdges = findEdges(cube, 'w');
});
test('solveInBottomLayerDown', () => {
    const cube = new Cube();
    cube.reorient('w', 'o');

    const whiteEdges = findEdges(cube, 'w');
});
test('solveinBottomLayerMiddle', () => {
    const cube = new Cube();
    cube.reorient('w', 'o');

    const whiteEdges = findEdges(cube, 'w');
});
test('solveInMiddleLayer', () => {
    const cube = new Cube();
    cube.reorient('w', 'o');

    const whiteEdges = findEdges(cube, 'w');
});

test('Solves White Cross from Scrambled', () => {
    const cube = Cube.scrambled();
    solveWhiteCross(cube);
    expect(cube.cube.u[1]).toBe('w');
    expect(cube.cube.u[3]).toBe('w');
    expect(cube.cube.u[5]).toBe('w');
    expect(cube.cube.u[7]).toBe('w');
    expect(cube.cube.f[1]).toBe('o');
    expect(cube.cube.l[1]).toBe('b');
    expect(cube.cube.r[1]).toBe('g');
    expect(cube.cube.b[1]).toBe('r');
});

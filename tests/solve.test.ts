import { expect, test, describe } from 'vitest';
import { Cube, type Color, type Face } from '../src/cube';
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
    solveWhiteCross,
    solveWhiteCorners,
    corner_solveInUpLayer,
    corner_solveInDownLayer,
    corner_solveInBottomLayer,
    corner_solveInTopLayer,
    solveMiddleEdges,
    solveYellowCross,
    solveYellowFace, solveTopRow, solve, translateMove,
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
    function testCube(edgeIndex: number) {
        const cube = new Cube();
        cube.perform_reorientation('w', 'o');
        cube.u();
        const whiteEdges = findEdges(cube, 'w');
        solveInTopLayerCorrectFace(cube, whiteEdges[edgeIndex]);
        const resultEdges = findEdges(cube, 'w');
        expect(countCorrect(resultEdges)).toBeGreaterThan(countCorrect(whiteEdges));
    }
    testCube(0);
    testCube(1);
    testCube(2);
    testCube(3);
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
    expect(countCorrect(resultEdges)).toEqual(4);
    // if it can solve 100 random scrambles, we can reasonably assume the function works as intended
    for (let i = 0; i < 1000; i++) {
        const scrambled = Cube.scrambled();
        solveWhiteCross(scrambled);
        const scrambledEdges = findEdges(scrambled, 'w');
        expect(countCorrect(scrambledEdges)).toEqual(4);
    }
});

describe('corner algorithms', () => {
    test('corner_solveInUpLayer', () => {
        const cube = new Cube();
        cube.perform_reorientation('w', 'o');
        cube.u();
        const corners = findCorners(cube, 'w');
        corner_solveInUpLayer(cube, corners[0]);
        const results = findCorners(cube, 'w');
        expect(results[2].correct).toBeTruthy();
    });
    test('corner_solveInDownLayer', () => {
        function downLayerScramble() {
            const cube = new Cube();
            cube.perform_reorientation('w', 'o');
            // set known scramble for single incorrect corner
            cube.l().counter_d().counter_l().counter_f().d().f();
            return cube;
        }
        function testCube(testCube: Cube) {
            const corners = findCorners(testCube, 'w');
            const targetCorner = corners.find(c => !c.correct);
            expect(targetCorner).toBeDefined();
            corner_solveInDownLayer(testCube, targetCorner);
            const solvedCorners = findCorners(testCube, 'w');
            expect(countCorrect(solvedCorners)).toEqual(4);
        }
        const down8 = downLayerScramble();
        testCube(down8);
        const down6 = downLayerScramble();
        down6.d();
        testCube(down6);
        const down0 = downLayerScramble();
        down0.d().d();
        testCube(down0);
        const down2 = downLayerScramble();
        down2.counter_d();
        testCube(down2);

    });
    test('corner_solveInTopLayer', () => {
        function topLayerScramble() {
            const cube = new Cube();
            cube.perform_reorientation('w', 'o');
            cube.l().counter_d().counter_l().counter_f().counter_d().f();
            return cube;
        }
        function topLayerScramble2() {
            const cube = new Cube();
            cube.perform_reorientation('w', 'o');
            cube.l().d().counter_l().counter_d().l().d().counter_l();
            return cube;
        }
        function testCube(testCube: Cube, expectedSolve = 4) {
            const corners = findCorners(testCube, 'w');
            const targetCorner = corners.find(c => !c.correct && c.face !== 'u');
            expect(targetCorner).toBeDefined();
            corner_solveInTopLayer(testCube, targetCorner);
            const solvedCorners = findCorners(testCube, 'w');
            expect(countCorrect(solvedCorners)).toEqual(expectedSolve);
        }
        const case0 = topLayerScramble();
        testCube(case0);
        const case1 = topLayerScramble();
        case1.u();
        testCube(case1, 1);
        const case2 = topLayerScramble();
        case2.u().u();
        testCube(case2, 1);
        const case3 = topLayerScramble();
        case3.counter_u();
        testCube(case3, 1);

        const case4 = topLayerScramble2();
        testCube(case4);
        const case5 = topLayerScramble2();
        case5.u();
        testCube(case5, 1);
        const case6 = topLayerScramble2();
        case6.u().u();
        testCube(case6, 1);
        const case7 = topLayerScramble2();
        case7.counter_u();
        testCube(case7, 1);

    });
    test('corner_solveInBottomLayer', () => {
        function bottomLayerScramble() {
            const cube = new Cube();
            cube.perform_reorientation('w', 'o');
            cube.l().counter_d().counter_l();
            return cube;
        }
        function bottomLayerScramble2() {
            const cube = new Cube();
            cube.perform_reorientation('w', 'o');
            cube.l().d().counter_l().counter_d();
            return cube;
        }
        function testCube(testCube: Cube) {
            const corners = findCorners(testCube, 'w');
            const targetCorner = corners.find(c => !c.correct);
            expect(targetCorner).toBeDefined();
            corner_solveInBottomLayer(testCube, targetCorner);
            const solvedCorners = findCorners(testCube, 'w');
            expect(countCorrect(solvedCorners)).toEqual(4);
        }
        const case0 = bottomLayerScramble();
        testCube(case0);
        const case1 = bottomLayerScramble();
        case1.d();
        testCube(case1);
        const case2 = bottomLayerScramble();
        case2.d().d();
        testCube(case2);
        const case3 = bottomLayerScramble();
        case3.counter_d();
        testCube(case3);

        const case4 = bottomLayerScramble2();
        testCube(case4);
        const case5 = bottomLayerScramble2();
        case5.d();
        testCube(case5);
        const case6 = bottomLayerScramble2();
        case6.d().d();
        testCube(case6);
        const case7 = bottomLayerScramble2();
        case7.counter_d();
        testCube(case7);
    });

    test('Solve White Corners from WhiteCross', () => {
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
        expect(countCorrect(resultEdges)).toEqual(4);
        solveWhiteCorners(cube);
        const resultCorners = findCorners(cube, 'w');
        expect(countCorrect(resultCorners)).toEqual(4);
    });

    test('Specific White Corner Test', () => {
        const cube = Cube.fromString('rowrybwro/ywrygbwor/bgbwowbyg/yrggbyogg/rbgrroyyb/ybwwwoogo');
        const before = findCorners(cube, 'w');
        expect(countCorrect(before)).toEqual(0);
        solveWhiteCorners(cube);
        const after = findCorners(cube, 'w');
        expect(countCorrect(after)).toEqual(4);
    });

    test('White Corners Randomized Test', () => {
        for (let i = 0; i < 10000; i++) {
            const c = Cube.scrambled();
            solveWhiteCorners(c);
            const corners = findCorners(c, 'w');
            expect(countCorrect(corners)).toEqual(4);
        }
    });

    test('White Corners and Cross Integration Test', () => {
        for (let i = 0; i < 10000; i++) {
            const c = Cube.scrambled();
            solveWhiteCross(c);
            solveWhiteCorners(c);
            const edges = findEdges(c, 'w');
            const corners = findCorners(c, 'w');
            expect(countCorrect(edges)).toEqual(4);
            expect(countCorrect(corners)).toEqual(4);
        }
    });
});

describe('middle algorithms', () => {
    test('Solves Middle Edges', () => {
        for (let i = 0; i < 10000; i++) {
            const c = Cube.scrambled();
            solveWhiteCross(c);
            solveWhiteCorners(c);
            solveMiddleEdges(c);
            const whiteEdges = findEdges(c, 'w');
            const whiteCorners = findCorners(c, 'w');
            expect(countCorrect(whiteEdges)).toEqual(4);
            expect(countCorrect(whiteCorners)).toEqual(4);
            for (const color of ['o', 'g', 'b', 'r'] as Color[]) {
                const edges = findEdges(c, color);
                const corners = findCorners(c, color);
                expect(countCorrect(edges)).toBeGreaterThanOrEqual(3);
                expect(countCorrect(corners)).toBeGreaterThanOrEqual(2);
            }
        }
    });
});

describe('yellow cross', () => {
    test('Solves Yellow Cross', () => {
        for (let i = 0; i < 10000; i++) {
            const c = Cube.scrambled();
            solveWhiteCross(c);
            solveWhiteCorners(c);
            solveMiddleEdges(c);
            solveYellowCross(c);
            const whiteEdges = findEdges(c, 'w');
            const whiteCorners = findCorners(c, 'w');
            expect(countCorrect(whiteEdges)).toEqual(4);
            expect(countCorrect(whiteCorners)).toEqual(4);
            for (const color of ['o', 'g', 'b', 'r'] as Color[]) {
                const edges = findEdges(c, color);
                const corners = findCorners(c, color);
                expect(countCorrect(edges)).toBeGreaterThanOrEqual(3);
                expect(countCorrect(corners)).toBeGreaterThanOrEqual(2);
            }
            expect(c.cube.u[1]).toBe('y');
            expect(c.cube.u[3]).toBe('y');
            expect(c.cube.u[5]).toBe('y');
            expect(c.cube.u[7]).toBe('y');
        }
    });
});

describe('yellow face', () => {
    test('Solves Yellow Face', () => {
        for (let i = 0; i < 10000; i++) {
            const c = Cube.scrambled();
            solveWhiteCross(c);
            solveWhiteCorners(c);
            solveMiddleEdges(c);
            solveYellowCross(c);
            solveYellowFace(c);
            const whiteEdges = findEdges(c, 'w');
            const whiteCorners = findCorners(c, 'w');
            expect(countCorrect(whiteEdges)).toEqual(4);
            expect(countCorrect(whiteCorners)).toEqual(4);
            for (const color of ['o', 'g', 'b', 'r'] as Color[]) {
                const edges = findEdges(c, color);
                const corners = findCorners(c, color);
                expect(countCorrect(edges)).toBeGreaterThanOrEqual(3);
                expect(countCorrect(corners)).toBeGreaterThanOrEqual(2);
            }
            expect(c.cube.u[0]).toBe('y');
            expect(c.cube.u[1]).toBe('y');
            expect(c.cube.u[2]).toBe('y');
            expect(c.cube.u[3]).toBe('y');
            expect(c.cube.u[4]).toBe('y');
            expect(c.cube.u[5]).toBe('y');
            expect(c.cube.u[6]).toBe('y');
            expect(c.cube.u[7]).toBe('y');
            expect(c.cube.u[8]).toBe('y');
        }
    });
})

describe('solve cube', () => {
    test('Solves Entire Cube', () => {
        for (let i = 0; i < 10000; i++) {
            const c = Cube.scrambled();
            solveWhiteCross(c);
            solveWhiteCorners(c);
            solveMiddleEdges(c);
            solveYellowCross(c);
            solveYellowFace(c);
            solveTopRow(c);
            expect(c.isSolved()).toBe(true);
        }
    });
    test('Solve Integration Function', () => {
        for (let i = 0; i < 10000; i++) {
            const c = Cube.scrambled();
            solve(c);
            expect(c.isSolved()).toBe(true);
        }
    });
});

describe('translateMove', () => {
    const originalOrientation = 'yo';
    function testMoveUnchanged(newOrientation: string, move: Face) {
        const result = translateMove(newOrientation, originalOrientation, move);
        expect(result).toEqual(move);
    }
    function testMoveBecomes(newOrientation: string, move: Face, becomes: Face) {
        const result = translateMove(newOrientation, originalOrientation, move);
        expect(result).toEqual(becomes);
    }
    test('backward and forward', () => {
        for (const orientation of ['yo', 'ow', 'wr', 'ry']) {
            for (const move of ['l', 'r'] as Face[]) {
                testMoveUnchanged(orientation, move);
            }
        }
        testMoveBecomes('ry', 'f', 'u');
        testMoveBecomes('ry', 'u', 'b');
        testMoveBecomes('ry', 'b', 'd');
        testMoveBecomes('ry', 'd', 'f');

        testMoveBecomes('wr', 'f', 'b');
        testMoveBecomes('wr', 'u', 'd');
        testMoveBecomes('wr', 'b', 'f');
        testMoveBecomes('wr', 'd', 'u');

        testMoveBecomes('ow', 'f', 'd');
        testMoveBecomes('ow', 'd', 'b');
        testMoveBecomes('ow', 'b', 'u');
        testMoveBecomes('ow', 'u', 'f');
    });
    test('roll left and right', () => {
        for (const orientation of ['go', 'wo', 'bo']) {
            for (const move of ['f', 'b'] as Face[]) {
                testMoveUnchanged(orientation, move);
            }
        }
        testMoveBecomes('go', 'u', 'l');
        testMoveBecomes('go', 'r', 'u');
        testMoveBecomes('go', 'd', 'r');
        testMoveBecomes('go', 'l', 'd');

        testMoveBecomes('wo', 'u', 'd');
        testMoveBecomes('wo', 'r', 'l');
        testMoveBecomes('wo', 'd', 'u');
        testMoveBecomes('wo', 'l', 'r');

        testMoveBecomes('bo', 'u', 'r');
        testMoveBecomes('bo', 'r', 'd');
        testMoveBecomes('bo', 'd', 'l');
        testMoveBecomes('bo', 'l', 'u');
    });
    test('clockwise and counter clockwise', () => {
        for (const orientation of ['yb', 'yr', 'yg']) {
            for (const move of ['u', 'd'] as Face[]) {
                testMoveUnchanged(orientation, move);
            }
        }
        testMoveBecomes('yg', 'f', 'l');
        testMoveBecomes('yg', 'l', 'b');
        testMoveBecomes('yg', 'b', 'r');
        testMoveBecomes('yg', 'r', 'f');

        testMoveBecomes('yr', 'f', 'b');
        testMoveBecomes('yr', 'l', 'r');
        testMoveBecomes('yr', 'b', 'f');
        testMoveBecomes('yr', 'r', 'l');

        testMoveBecomes('yb', 'f', 'r');
        testMoveBecomes('yb', 'r', 'b');
        testMoveBecomes('yb', 'b', 'l');
        testMoveBecomes('yb', 'l', 'f');
    });

    test('composite translations', () => {
        testMoveBecomes('wb', 'u', 'd');
        testMoveBecomes('wb', 'l', 'b');
        testMoveBecomes('wb', 'f', 'r');
        testMoveBecomes('wb', 'r', 'f');
        testMoveBecomes('wb', 'b', 'l');
        testMoveBecomes('wb', 'd', 'u');

        testMoveBecomes('wg', 'u', 'd');
        testMoveBecomes('wg', 'l', 'f');
        testMoveBecomes('wg', 'f', 'l');
        testMoveBecomes('wg', 'r', 'b');
        testMoveBecomes('wg', 'b', 'r');
        testMoveBecomes('wg', 'd', 'u');

        testMoveBecomes('bw', 'u', 'r');
        testMoveBecomes('bw', 'l', 'f');
        testMoveBecomes('bw', 'f', 'd');
        testMoveBecomes('bw', 'r', 'b');
        testMoveBecomes('bw', 'b', 'u');
        testMoveBecomes('bw', 'd', 'l');

        testMoveBecomes('by', 'u', 'r');
        testMoveBecomes('by', 'l', 'b');
        testMoveBecomes('by', 'f', 'u');
        testMoveBecomes('by', 'r', 'f');
        testMoveBecomes('by', 'b', 'd');
        testMoveBecomes('by', 'd', 'l');

        testMoveBecomes('br', 'u', 'r');
        testMoveBecomes('br', 'l', 'd');
        testMoveBecomes('br', 'f', 'b');
        testMoveBecomes('br', 'r', 'u');
        testMoveBecomes('br', 'b', 'f');
        testMoveBecomes('br', 'd', 'l');

        testMoveBecomes('og', 'u', 'f');
        testMoveBecomes('og', 'l', 'u');
        testMoveBecomes('og', 'f', 'l');
        testMoveBecomes('og', 'r', 'd');
        testMoveBecomes('og', 'b', 'r');
        testMoveBecomes('og', 'd', 'b');

        testMoveBecomes('oy', 'u', 'f');
        testMoveBecomes('oy', 'l', 'r');
        testMoveBecomes('oy', 'f', 'u');
        testMoveBecomes('oy', 'r', 'l');
        testMoveBecomes('oy', 'b', 'd');
        testMoveBecomes('oy', 'd', 'b');

        testMoveBecomes('ob', 'u', 'f');
        testMoveBecomes('ob', 'l', 'd');
        testMoveBecomes('ob', 'f', 'r');
        testMoveBecomes('ob', 'r', 'u');
        testMoveBecomes('ob', 'b', 'l');
        testMoveBecomes('ob', 'd', 'b');

        testMoveBecomes('gw', 'u', 'l');
        testMoveBecomes('gw', 'l', 'b');
        testMoveBecomes('gw', 'f', 'd');
        testMoveBecomes('gw', 'r', 'f');
        testMoveBecomes('gw', 'b', 'u');
        testMoveBecomes('gw', 'd', 'r');

        testMoveBecomes('gy', 'u', 'l');
        testMoveBecomes('gy', 'l', 'f');
        testMoveBecomes('gy', 'f', 'u');
        testMoveBecomes('gy', 'r', 'b');
        testMoveBecomes('gy', 'b', 'd');
        testMoveBecomes('gy', 'd', 'r');

        testMoveBecomes('gr', 'u', 'l');
        testMoveBecomes('gr', 'l', 'u');
        testMoveBecomes('gr', 'f', 'b');
        testMoveBecomes('gr', 'r', 'd');
        testMoveBecomes('gr', 'b', 'f');
        testMoveBecomes('gr', 'd', 'r');

        testMoveBecomes('rw', 'u', 'b');
        testMoveBecomes('rw', 'l', 'r');
        testMoveBecomes('rw', 'f', 'd');
        testMoveBecomes('rw', 'r', 'l');
        testMoveBecomes('rw', 'b', 'u');
        testMoveBecomes('rw', 'd', 'f');

        testMoveBecomes('rb', 'u', 'b');
        testMoveBecomes('rb', 'l', 'u');
        testMoveBecomes('rb', 'f', 'r');
        testMoveBecomes('rb', 'r', 'd');
        testMoveBecomes('rb', 'b', 'l');
        testMoveBecomes('rb', 'd', 'f');

        testMoveBecomes('rg', 'u', 'b');
        testMoveBecomes('rg', 'l', 'd');
        testMoveBecomes('rg', 'f', 'l');
        testMoveBecomes('rg', 'r', 'u');
        testMoveBecomes('rg', 'b', 'r');
        testMoveBecomes('rg', 'd', 'f');
    });
    test('simple integration test', () => {
        const cube = new Cube();
        cube.perform_reorientation('w', 'o');
        cube.l().counter_f().counter_d();
        const testCube = new Cube();
        const moves = ['l', 'counter_f', 'counter_d'];
        for (const move of moves) {
            const isCounterClockwise = move.includes('counter');
            const parsed = isCounterClockwise ? move.split('_')[1] : move;
            const translated = translateMove('wo', 'yo', parsed as Face);
            testCube.performRotation(translated, isCounterClockwise);
        }
        testCube.perform_reorientation('w', 'o');
        const cubeString = cube.toString();
        const testString = testCube.toString();
        expect(testString).toEqual(cubeString);
    });
    test('Deep scramble integration test', () => {
        const cube = new Cube();
        cube
            .r().r().d()
            .counter_l().counter_b().counter_r()
            .b().counter_d().u()
            .r().l().d()
            .d().f().d()
            .r().u().counter_d()
            .r().counter_u();
        cube.scrambleHistory = [...cube.history];
        cube.history = [];
        const tester = Cube.fromString(cube.toString());
        expect(tester.toString()).toEqual(cube.toString());
        expect(JSON.stringify(tester.cube)).toEqual(JSON.stringify(cube.cube));
        solve(cube);
        expect(cube.isSolved()).toBe(true);
        let fromOrientation = `${tester.colorOf('u')}${tester.colorOf('f')}`;
        for (const move of cube.history) {
            if (move.includes('reorient')) {
                fromOrientation = move.split(' ')[1];
                tester.perform_reorientation(fromOrientation[0] as Color, fromOrientation[1] as Color);
            }
            else {
                const isCounterClockwise = move.includes('counter');
                const parsed = isCounterClockwise ? move.split('_')[1] : move;
                const translatedMove: Face = translateMove(fromOrientation, toOrientation, parsed as Face);
                tester.performRotation(translatedMove, isCounterClockwise);
            }
        }
    });
    test('real example test', () => {
        let pass = 0;
        let fail = 0;
        let tracker = 0;
        for (let i = 0; i < 10000; i++) {
            const normal = Cube.scrambled();
            const tester = Cube.fromString(normal.toString());
            const trackingCube = Cube.fromString(normal.toString());
            let fromOrientation = `${tester.colorOf('u')}${tester.colorOf('f')}`
            let toOrientation = `${tester.colorOf('u')}${tester.colorOf('f')}`;
            solve(normal);
            expect(normal.isSolved()).toBeTruthy();
            for (const move of normal.history) {
                if (move.includes('reorient')) {
                    fromOrientation = move.split(' ')[1];
                    trackingCube.perform_reorientation(fromOrientation[0] as Color, fromOrientation[1] as Color);
                }
                else {
                    const isCounterClockwise = move.includes('counter');
                    const parsed = isCounterClockwise ? move.split('_')[1] : move;
                    const translatedMove: Face = translateMove(fromOrientation, toOrientation, parsed as Face);
                    tester.performRotation(translatedMove, isCounterClockwise);
                    trackingCube.performRotation(parsed as Face, isCounterClockwise);
                }
            }
            if (tester.isSolved()) {
                pass += 1;
            }
            else {
                fail += 1;
            }
            if (trackingCube.isSolved()) {
                tracker += 1;
            }
            // expect(tester.isSolved()).toBeTruthy();
        }
        console.log(`Pass: ${pass}, Fail: ${fail}`);
        console.log(tracker);
    });
});

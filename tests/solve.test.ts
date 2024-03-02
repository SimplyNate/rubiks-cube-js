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
    solveMiddleEdges, solveYellowCross
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

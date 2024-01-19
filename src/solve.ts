import { Cube } from './cube.js';

export function flip_edge(cube: Cube) {
    cube
        .f()
        .counter_r()
        .counter_d()
        .r()
        .f()
        .f();
    return cube;
}

export function flip_adjacent_edges_rb(cube: Cube) {
    cube
        .counter_r()
        .u()
        .r()
        .counter_u()
        .counter_r();
    return cube;
}

export function flip_opposite_edges_fb(cube: Cube) {
    cube
        .r()
        .r()
        .l()
        .l()
        .u()
        .u()
        .r()
        .r()
        .l()
        .l();
    return cube;
}

export function flip_corners_ftr_fbr(cube: Cube) {
    cube
        .counter_r()
        .counter_d()
        .r()
        .d();
    return cube;
}

export function move_edge_ft_fl(cube: Cube) {
    cube
        .counter_u()
        .counter_l()
        .u()
        .l()
        .u()
        .f()
        .counter_u()
        .counter_f();
    return cube;
}

export function move_edge_ft_fr(cube: Cube) {
    cube
        .u()
        .r()
        .counter_u()
        .counter_r()
        .counter_u()
        .counter_f()
        .u()
        .f();
    return cube;
}

export function permute_up_dot_to_l_shape(cube: Cube) {
    cube
        .f()
        .r()
        .u()
        .counter_r()
        .counter_u()
        .counter_f();
    return cube;
}

export function permute_up_dot_to_l_shape_fast(cube: Cube) {
    cube
        .f()
        .u()
        .r()
        .counter_u()
        .counter_r()
        .counter_f();
    return cube;
}

export function sune(cube: Cube) {
    cube
        .r()
        .u()
        .counter_r()
        .u()
        .r()
        .u()
        .u()
        .counter_r();
    return cube;
}

export function antisune(cube: Cube) {
    cube
        .u()
        .u()
        .r()
        .u()
        .u()
        .counter_r()
        .counter_u()
        .r()
        .counter_u()
        .counter_r();
    return cube;
}

export function permute_headlights(cube: Cube) {
    cube
        .counter_r()
        .f()
        .counter_r()
        .b()
        .b()
        .r()
        .counter_f()
        .counter_r()
        .b()
        .b()
        .r()
        .r();
    return cube;
}

export function permute_u(cube: Cube) {
    cube
        .r()
        .counter_u()
        .r()
        .u()
        .r()
        .u()
        .r()
        .counter_u()
        .counter_r()
        .counter_u()
        .r()
        .r();
    return cube;
}

interface AdjacencyMap {
    [index: string]: string;
}

const adjacencies: AdjacencyMap = {
    u1: 'b1',
    u3: 'l1',
    u5: 'r1',
    u7: 'f1',
    l1: 'u3',
    l3: 'b5',
    l5: 'f3',
    l7: 'd3',
    f1: 'u7',
    f3: 'l5',
    f5: 'r3',
    f7: 'd1',
    r1: 'u5',
    r3: 'f5',
    r5: 'b3',
    r7: 'd5',
    b1: 'u1',
    b3: 'r5',
    b5: 'l3',
    b7: 'd7',
    d1: 'f7',
    d3: 'l7',
    d5: 'r7',
    d7: 'b7',
}

interface Edge {
    face: string;
    index: number;
    adjacentFace: string;
    adjacentIndex: number;
    correct: boolean;
}

interface Corner extends Edge {
    adjacentFace2: string;
    adjacentIndex2: number;
}

export function findEdges(cube: Cube, color: string): Edge[] {
    const edges: Edge[] = [];
    for (const face of Object.keys(cube.cube)) {
        for (const index of [1, 3, 5, 7]) {
            const square = cube.cube[face][index];
            if (square === color) {
                const adjacency = adjacencies[`${face}${index}`];
                edges.push({
                    face,
                    index,
                    adjacentFace: adjacency[0],
                    adjacentIndex: Number(adjacency[1]),
                    correct: false,
                });
                edges[edges.length - 1].correct = isEdgeInCorrectPosition(cube, edges[edges.length - 1]);
            }
        }
    }
    return edges;
}

const cornerAdjacencies: AdjacencyMap = {
    u0: 'l0b2',
    u2: 'r2b0',
    u6: 'l2f0',
    u8: 'f2r0',
    l0: 'u0b2',
    l2: 'u6f0',
    l6: 'b8d6',
    l8: 'f6d0',
    f0: 'u6l2',
    f2: 'u8r0',
    f6: 'l8d0',
    f8: 'r6d2',
    r0: 'u8f2',
    r2: 'u2b0',
    r6: 'f8d2',
    r8: 'b6d8',
    b0: 'u2r2',
    b2: 'u0f0',
    b6: 'r8d8',
    b8: 'l6d6',
    d0: 'l8f6',
    d2: 'f8r6',
    d6: 'b8l6',
    d8: 'r8b6',
};

export function findCorners(cube: Cube, color: string): Corner[] {
    const corners: Corner[] = [];
    for (const face of Object.keys(cube.cube)) {
        for (const index of [0, 2, 6, 8]) {
            const square = cube.cube[face][index];
            if (square === color) {
                const adjacency = cornerAdjacencies[`${face}${index}`];
                corners.push({
                    face,
                    index,
                    adjacentFace: adjacency[0],
                    adjacentIndex: Number(adjacency[1]),
                    adjacentFace2: adjacency[2],
                    adjacentIndex2: Number(adjacency[3]),
                    correct: false,
                });
                corners[corners.length - 1].correct = isCornerInCorrectPosition(cube, corners[corners.length - 1]);
            }
        }
    }
    return corners;
}

export function isEdgeInCorrectPosition(cube: Cube, edge: Edge): boolean {
    const color = cube.cube[edge.face][edge.index];
    const faceColor = cube.colorOf(edge.face);
    const adjacentColor = cube.cube[edge.adjacentFace][edge.adjacentIndex];
    const adjacentFaceColor = cube.colorOf(edge.adjacentFace);
    return color === faceColor && adjacentColor === adjacentFaceColor;
}

export function isCornerInCorrectPosition(cube: Cube, corner: Corner): boolean {
    const adjacentColor2 = cube.cube[corner.adjacentFace2][corner.adjacentIndex2];
    const adjacentFaceColor2 = cube.colorOf(corner.adjacentFace2);
    return isEdgeInCorrectPosition(cube, corner) && adjacentColor2 === adjacentFaceColor2;
}

const oppositeColors = {
    b: 'g',
    g: 'b',
    o: 'r',
    r: 'o',
    w: 'y',
    y: 'w',
} as {[index: string]: string};

export function areOppositeColors(color1: string, color2: string): boolean {
    return oppositeColors[color1] === color2;
}

const oppositeFaces = {
    u: 'd',
    d: 'u',
    l: 'r',
    r: 'l',
    f: 'b',
    b: 'f',
} as {[index: string]: string};

export function areOppositeFaces(face1: string, face2: string): boolean {
    return oppositeFaces[face1] === face2;
}

const clockwiseFaces = {
    f: 'l',
    l: 'b',
    b: 'r',
    r: 'f',
} as {[index: string]: string};

const counterClockwiseFaces = {
    f: 'r',
    r: 'b',
    b: 'l',
    l: 'f',
} as {[index: string]: string};

export function targetFaceIsClockwise(sourceFace: string, targetFace: string): boolean {
    return clockwiseFaces[sourceFace] === targetFace;
}

export function targetFaceIsCounterClockwise(sourceFace: string, targetFace: string): boolean {
    return counterClockwiseFaces[sourceFace] === targetFace;
}

export function solveInTopLayerCorrectFace(cube: Cube, edge: Edge) {
    const currentAdjacentFace = edge.adjacentFace;
    cube
        .performRotation(currentAdjacentFace)
        .performRotation(currentAdjacentFace);
    edge.face = 'd';
    edge.adjacentIndex = 7;
    if (edge.index === 1) {
        edge.index = 7;
    }
    else if (edge.index === 7) {
        edge.index = 1;
    }
    solveInBottomLayerDown(cube, edge);
}

export function solveInTopLayerIncorrectFace(cube: Cube, edge: Edge) {
    cube.performRotation(edge.face);
    edge.index = 5;
    edge.adjacentIndex = 3;
    if (edge.face === 'r') {
        edge.adjacentFace = 'b';
    }
    else if (edge.face === 'f') {
        edge.adjacentFace = 'r';
    }
    else if (edge.face === 'l') {
        edge.adjacentFace = 'f';
    }
    else {
        edge.adjacentFace = 'l';
    }
    solveInMiddleLayer(cube, edge);
}

export function solveInBottomLayerDown(cube: Cube, edge: Edge) {
    const adjacentFace = edge.adjacentFace;
    const adjacentColor = cube.cube[adjacentFace][edge.adjacentIndex];
    const targetFace = <string>cube.findColor(adjacentColor);
    if (areOppositeFaces(adjacentFace, targetFace)) {
        cube.d().d();
    }
    else if (targetFaceIsClockwise(adjacentFace, targetFace)) {
        cube.counter_d();
    }
    else if (targetFaceIsCounterClockwise(adjacentFace, targetFace)) {
        cube.d();
    }
    cube
        .performRotation(targetFace)
        .performRotation(targetFace);
}
export function solveInBottomLayerMiddle(cube: Cube, edge: Edge) {
    const currentFace = edge.face;
    const adjacentColor = cube.cube[edge.adjacentFace][edge.adjacentIndex];
    const targetFace = <string>cube.findColor(adjacentColor);
    if (areOppositeFaces(currentFace, targetFace)) {
        cube.d().d();
    }
    else if (targetFaceIsClockwise(currentFace, targetFace)) {
        cube.counter_d();
    }
    else if (targetFaceIsCounterClockwise(currentFace, targetFace)) {
        cube.d();
    }
    cube.performRotation(targetFace, true)
        .counter_u()
        .performRotation(counterClockwiseFaces[targetFace], false)
        .u();
}

export function solveInMiddleLayer(cube: Cube, edge: Edge) {
    // If adjacent face is correct, perform targetFace rotation
    const adjacentFace = edge.adjacentFace;
    const adjacentColor = cube.cube[adjacentFace][edge.adjacentIndex];
    const targetFace = <string>cube.findColor(adjacentColor);
    const counterClockwise = edge.index === 3;
    if (areOppositeFaces(adjacentFace, targetFace)) {
        cube
            .u().u()
            .performRotation(adjacentFace, counterClockwise)
            .u().u();
    }
    else if (targetFaceIsClockwise(adjacentFace, targetFace)) {
        cube.counter_u()
            .performRotation(adjacentFace, counterClockwise)
            .u();
    }
    else if (targetFaceIsCounterClockwise(adjacentFace, targetFace)) {
        cube.u()
            .performRotation(adjacentFace, counterClockwise)
            .counter_u();
    }
    else {
        cube.performRotation(adjacentFace, counterClockwise)
    }
}

export function solveWhiteCross(cube: Cube) {
    // step 1: Find 4 white edge positions
    cube.reorient('w', 'o');
    const whiteEdges = findEdges(cube, 'w');
    // filter out correct positions
    let solved = 0;
    for (const edge of whiteEdges) {
        if (!isEdgeInCorrectPosition(cube, edge)) {
            if (edge.face === cube.findColor('w')) {
                solveInTopLayerCorrectFace(cube, edge);
            }
            else if (edge.face === cube.findColor('y')) {
                solveInBottomLayerDown(cube, edge);
            }
            // if the edge is in the bottom row but not on down face
            else if (edge.index === 7) {
                solveInBottomLayerMiddle(cube, edge);
            }
            else if (edge.index === 1) {
                solveInTopLayerIncorrectFace(cube, edge);
            }
            else {
                solveInMiddleLayer(cube, edge);
            }
            break;
        }
        else {
            solved += 1;
        }
    }
    if (solved !== 4) {
        solveWhiteCross(cube);
    }
}

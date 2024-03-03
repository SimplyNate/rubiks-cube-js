import { Cube, Face, Color } from './cube.js';

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

const adjacencies: Record<string, [Face, number]> = {
    u1: ['b', 1],
    u3: ['l', 1],
    u5: ['r', 1],
    u7: ['f', 1],
    l1: ['u', 3],
    l3: ['b', 5],
    l5: ['f', 3],
    l7: ['d', 3],
    f1: ['u', 7],
    f3: ['l', 5],
    f5: ['r', 3],
    f7: ['d', 1],
    r1: ['u', 5],
    r3: ['f', 5],
    r5: ['b', 3],
    r7: ['d', 5],
    b1: ['u', 1],
    b3: ['r', 5],
    b5: ['l', 3],
    b7: ['d', 7],
    d1: ['f', 7],
    d3: ['l', 7],
    d5: ['r', 7],
    d7: ['b', 7],
}

export interface Edge {
    face: Face;
    index: number;
    color: Color;
    adjacentFace: Face;
    adjacentIndex: number;
    adjacentColor: Color;
    correct: boolean;
}

export interface Corner extends Edge {
    adjacentFace2: Face;
    adjacentIndex2: number;
    adjacentColor2: Color;
}

export function findEdges(cube: Cube, color: Color): Edge[] {
    const edges: Edge[] = [];
    for (const face of cube.faces()) {
        for (const index of [1, 3, 5, 7]) {
            const square = cube.cube[face][index];
            if (square === color) {
                const adjacency = adjacencies[`${face}${index}`];
                edges.push({
                    face,
                    index,
                    color,
                    adjacentFace: adjacency[0],
                    adjacentIndex: Number(adjacency[1]),
                    adjacentColor: cube.cube[adjacency[0]][Number(adjacency[1])],
                    correct: false,
                });
                edges[edges.length - 1].correct = isEdgeInCorrectPosition(cube, edges[edges.length - 1]);
            }
        }
    }
    return edges;
}

const cornerAdjacencies: Record<string, [Face, number, Face, number]> = {
    u0: ['l', 0, 'b', 2],
    u2: ['r', 2, 'b', 0],
    u6: ['l', 2, 'f', 0],
    u8: ['f', 2, 'r', 0],
    l0: ['u', 0, 'b', 2],
    l2: ['u', 6, 'f', 0],
    l6: ['b', 8, 'd', 6],
    l8: ['f', 6, 'd', 0],
    f0: ['u', 6, 'l', 2],
    f2: ['u', 8, 'r', 0],
    f6: ['l', 8, 'd', 0],
    f8: ['r', 6, 'd', 2],
    r0: ['u', 8, 'f', 2],
    r2: ['u', 2, 'b', 0],
    r6: ['f', 8, 'd', 2],
    r8: ['b', 6, 'd', 8],
    b0: ['u', 2, 'r', 2],
    b2: ['u', 0, 'l', 0],
    b6: ['r', 8, 'd', 8],
    b8: ['l', 6, 'd', 6],
    d0: ['l', 8, 'f', 6],
    d2: ['f', 8, 'r', 6],
    d6: ['b', 8, 'l', 6],
    d8: ['r', 8, 'b', 6],
};

export function findCorners(cube: Cube, color: Color): Corner[] {
    const corners: Corner[] = [];
    for (const face of cube.faces()) {
        for (const index of [0, 2, 6, 8]) {
            const square = cube.cube[face][index];
            if (square === color) {
                const adjacency = cornerAdjacencies[`${face}${index}`];
                corners.push({
                    face,
                    index,
                    color,
                    adjacentFace: adjacency[0],
                    adjacentIndex: Number(adjacency[1]),
                    adjacentColor: cube.cube[adjacency[0]][Number(adjacency[1])],
                    adjacentFace2: adjacency[2],
                    adjacentIndex2: Number(adjacency[3]),
                    adjacentColor2: cube.cube[adjacency[2]][Number(adjacency[3])],
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

const oppositeColors: Record<Color, Color> = {
    b: 'g',
    g: 'b',
    o: 'r',
    r: 'o',
    w: 'y',
    y: 'w',
};

export function areOppositeColors(color1: Color, color2: Color): boolean {
    return oppositeColors[color1] === color2;
}

export const oppositeFaces: Record<Face, Face> = {
    u: 'd',
    d: 'u',
    l: 'r',
    r: 'l',
    f: 'b',
    b: 'f',
};

export function areOppositeFaces(face1: Face, face2: Face): boolean {
    return oppositeFaces[face1] === face2;
}

export const clockwiseFaces: Record<string, Face> = {
    f: 'l',
    l: 'b',
    b: 'r',
    r: 'f',
};

export const counterClockwiseFaces: Record<string, Face> = {
    f: 'r',
    r: 'b',
    b: 'l',
    l: 'f',
};

export function targetFaceIsClockwise(sourceFace: Face, targetFace: Face): boolean {
    return clockwiseFaces[sourceFace] === targetFace;
}

export function targetFaceIsCounterClockwise(sourceFace: Face, targetFace: Face): boolean {
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
    const targetFace = <Face>cube.findColor(adjacentColor);
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
    const targetFace = <Face>cube.findColor(adjacentColor);
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
    const targetFace = <Face>cube.findColor(adjacentColor);
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
    cube.perform_reorientation('w', 'o');
    // should only need to run algorithm 4 times
    for (let i = 0; i < 4; i++) {
        const whiteEdges = findEdges(cube, 'w');
        const edge = whiteEdges.find(e => !e.correct);
        if (edge) {
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
        }
        else {
            break;
        }
    }
}

export function corner_solveInUpLayer(cube: Cube, corner: Corner) {
    // this means in correct face but wrong index
    /*
    reorient such that the w is in index 8
    r' d r
    update corner to new position
    corner_solveInBottomLayer(cube, updatedCorner);
     */
    const currentU = cube.colorOf('u');
    const currentF = cube.colorOf('f');
    if (corner.index === 0) {
        cube.reorient_clockwise();
        cube.reorient_clockwise();
    }
    else if (corner.index === 2) {
        cube.reorient_clockwise();
    }
    else if (corner.index === 6) {
        cube.reorient_counter_clockwise();
    }
    cube.counter_r()
        .d()
        .r();
    const corners = findCorners(cube, 'w');
    const updatedCorner = corners.find(c => c.face === 'r' && c.index === 6);
    if (updatedCorner) {
        corner_solveInBottomLayer(cube, updatedCorner);
    }
    else {
        throw new Error('Unable to find expected corner.');
    }
    cube.perform_reorientation(currentU, currentF);
}
export function corner_solveInDownLayer(cube: Cube, corner: Corner) {
    /*
    make d moves such that the corner is in the correct column
      the correct column is where either:
        adjacentFace is counterclockwise to targetFace AND
        adjacentFace2 is clockwise to targetFace
        OR
        adjacentFace2 is counterClockwise to targetFace AND
        adjacentFace is clockwise to targetFace
    r' d d r d r' d' r
     */
    let currentCorner = corner;
    const targetAdjacent = <Face>cube.findColor(currentCorner.adjacentColor);
    const targetAdjacent2 = <Face>cube.findColor(currentCorner.adjacentColor2);
    let targetDownIndex;
    if ((targetAdjacent === 'f' && targetAdjacent2 === 'l') || targetAdjacent === 'l' && targetAdjacent2 === 'f') {
        targetDownIndex = 0;
    }
    else if ((targetAdjacent === 'f' && targetAdjacent2 === 'r') || (targetAdjacent === 'r' && targetAdjacent2 === 'f')) {
        targetDownIndex = 2;
    }
    else if ((targetAdjacent === 'r' && targetAdjacent2 === 'b') || (targetAdjacent === 'b' && targetAdjacent2 === 'r')) {
        targetDownIndex = 8;
    }
    else {
        targetDownIndex = 6;
    }
    for (let i = 0; i < 3; i++ ) {
        if (targetDownIndex === currentCorner.index) {
            break;
        }
        else {
            cube.d();
            const corners = findCorners(cube, 'w');
            currentCorner = <Corner>corners.find(c =>
                c.color === corner.color &&
                c.adjacentColor === corner.adjacentColor &&
                c.adjacentColor2 === corner.adjacentColor2
            );
        }
    }
    if (currentCorner.index === 0) {
        cube.reorient_counter_clockwise();
    }
    else if (currentCorner.index === 6) {
        cube.reorient_counter_clockwise();
        cube.reorient_counter_clockwise();
    }
    else if (currentCorner.index === 8) {
        cube.reorient_clockwise();
    }
    cube.counter_r().d().d().r().d().counter_r().counter_d().r();
}
export function corner_solveInTopLayer(cube: Cube, corner: Corner) {
    /*
    if corner is in correct position but rotated incorrectly,
        reorient to where w is now front
        if w is in position 2
            r' d r d' r' d r
        else w is in position 0
            l d' l' d l d' l'
    else
        reorient such that the white square is now Front
        if index is 2:
            r' d r
        else:
            l d' l'
        corner_solveInBottomLayer

     */
    let nonUpAdjacentColor;
    if (corner.adjacentFace === 'u') {
        nonUpAdjacentColor = corner.adjacentColor2;
    }
    else {
        nonUpAdjacentColor = corner.adjacentColor;
    }
    cube.perform_reorientation(cube.colorOf('u'), cube.colorOf(corner.face));
    if (cube.colorOf('f') === nonUpAdjacentColor) {
        if (corner.index === 2) {
            cube.counter_r().d().r().counter_d().counter_r().d().r();
        }
        else {
            cube.l().counter_d().counter_l().d().l().counter_d().counter_l();
        }
    }
    else {
        if (corner.index === 2) {
            cube.counter_r().d().r();
        }
        else {
            cube.l().counter_d().counter_l();
        }
        const corners = findCorners(cube, 'w');
        const targetIndex = corner.index === 0 ? 6 : 8;
        // Corner face now must be front due to reorientation performed
        const targetCorner = <Corner>corners.find(c => c.face === 'f' && c.index === targetIndex);
        corner_solveInBottomLayer(cube, targetCorner);
    }
}
export function corner_solveInBottomLayer(cube: Cube, corner: Corner) {
    /*
    make d moves such that corner is in correct column
    reorient such that the w piece is f
    if w index === 8
        f d f'
    else
        f' d' f
     */
    const adjacentFace = corner.adjacentFace;
    const adjacentFace2 = corner.adjacentFace2;
    let adjacentFaceFocus;
    let adjacentFaceColorFocus;
    let downColor: Color;
    if (adjacentFace === 'd') {
        adjacentFaceFocus = adjacentFace2;
        adjacentFaceColorFocus = corner.adjacentColor2;
        downColor = corner.adjacentColor;
    }
    else {
        adjacentFaceFocus = adjacentFace;
        adjacentFaceColorFocus = corner.adjacentColor;
        downColor = corner.adjacentColor2;
    }
    const targetFace = <Face>cube.findColor(adjacentFaceColorFocus);
    if (areOppositeFaces(targetFace, adjacentFaceFocus)) {
        cube.d().d();
    }
    else if (targetFaceIsCounterClockwise(adjacentFaceFocus, targetFace)) {
        cube.d();
    }
    else if (targetFaceIsClockwise(adjacentFaceFocus, targetFace)) {
        cube.counter_d();
    }
    // The white piece will always be on the face of the down color
    cube.perform_reorientation(cube.colorOf('u'), downColor);
    // D moves does not affect the corner's index, so we can assume it's in the same index now in face F
    if (corner.index === 8) {
        cube.f().d().counter_f();
    }
    else {
        cube.counter_f().counter_d().f();
    }
}

export function solveWhiteCorners(cube: Cube) {
    cube.perform_reorientation('w', 'o');
    for (let i = 0; i < 4; i++) {
        const whiteCorners = findCorners(cube, 'w');
        const corner = whiteCorners.find(c => !c.correct);
        if (corner) {
            // if corner in up layer
            if (corner.face === cube.findColor('w')) {
                corner_solveInUpLayer(cube, corner);
            }
            // else if corner in down layer
            else if (corner.face === cube.findColor('y')) {
                corner_solveInDownLayer(cube, corner);
            }
            // else if corner in top layer
            else if (corner.index === 0 || corner.index === 2) {
                corner_solveInTopLayer(cube, corner);
            }
            // else if corner in bottom layer
            else if (corner.index === 6 || corner.index === 8) {
                corner_solveInBottomLayer(cube, corner);
            }
        }
        else {
            break;
        }
    }
}

export function middle_solveInTopLayer(cube: Cube, edge: Edge) {
    let nonUColor: Color;
    let nonUFace: Face;
    let uColor: Color;
    if (edge.face === 'u') {
        nonUColor = edge.adjacentColor;
        nonUFace = edge.adjacentFace;
        uColor = edge.color;
    }
    else {
        nonUColor = edge.color;
        nonUFace = edge.face;
        uColor = edge.adjacentColor;
    }
    const targetFace = <Face>cube.findColor(nonUColor);
    if (targetFace !== nonUFace) {
        // perform corresponding u or counter_u rotations
        if (areOppositeFaces(nonUFace, targetFace)) {
            cube.u().u();
        }
        else if (targetFaceIsClockwise(nonUFace, targetFace)) {
            cube.u();
        }
        else if (targetFaceIsCounterClockwise(nonUFace, targetFace)) {
            cube.counter_u();
        }
    }
    cube.perform_reorientation(cube.colorOf('u'), nonUColor);
    const uColorTargetFace = <Face>cube.findColor(uColor);
    if (targetFaceIsClockwise('f', uColorTargetFace)) {
        move_edge_ft_fl(cube);
    }
    else {
        move_edge_ft_fr(cube);
    }
}

export function middle_solveInMiddleLayer(cube: Cube, edge: Edge) {
    let moveColor;
    if (edge.color === 'y') {
        moveColor = cube.colorOf(edge.adjacentFace);
    }
    else {
        moveColor = cube.colorOf(edge.face);
    }
    cube.perform_reorientation(cube.colorOf('u'), moveColor);
    if (edge.index === 3) {
        move_edge_ft_fl(cube);
    }
    else {
        move_edge_ft_fr(cube);
    }
    const newEdges = findEdges(cube, edge.color);
    const newTargetEdge = <Edge>newEdges.find(e => e.color === edge.color && e.adjacentColor === edge.adjacentColor);
    middle_solveInTopLayer(cube, newTargetEdge);
}

export function solveMiddleEdges(cube: Cube) {
    cube.perform_reorientation('y', 'o');
    const colorsToCheck: Color[] = ['g', 'o', 'b', 'r'];
    for (const color of colorsToCheck) {
        for (let i = 0; i < 2; i++) {
            const edges = findEdges(cube, color);
            const targetEdge = edges.find(e => e.adjacentColor !== 'y' && e.adjacentColor !== 'w' && !e.correct);
            if (targetEdge) {
                if (targetEdge.adjacentFace === 'u' || targetEdge.face === 'u') {
                    middle_solveInTopLayer(cube, targetEdge);
                }
                else {
                    middle_solveInMiddleLayer(cube, targetEdge);
                }
            }
            else {
                break;
            }
        }
    }
}

export function determineYellowCrossStatus(cube: Cube): string {
    const i1 = cube.cube.u[1] === 'y';
    const i3 = cube.cube.u[3] === 'y';
    const i5 = cube.cube.u[5] === 'y';
    const i7 = cube.cube.u[7] === 'y';
    if (i1 && i3 && i5 && i7) {
        return 'cross';
    }
    else if (i1 && i7) {
        return 'vertical line';
    }
    else if (i3 && i5) {
        return 'horizontal line'
    }
    else if (i1 && i3) {
        return 'left l';
    }
    else if (i1 && i5) {
        return 'right l';
    }
    else if (i7 && i3) {
        return 'bottom left l';
    }
    else if (i7 && i5) {
        return 'bottom right l';
    }
    else {
        return 'dot';
    }
}

function permute_l_shape(cube: Cube) {
    cube.f().u().r().counter_u().counter_r().counter_f();
}

export function solveYellowCross(cube: Cube) {
    cube.perform_reorientation('y', 'o');
    let crossStatus = determineYellowCrossStatus(cube);
    while (crossStatus !== 'cross') {
        if (crossStatus === 'dot' || crossStatus === 'horizontal line') {
            permute_up_dot_to_l_shape(cube);
        }
        else if (crossStatus === 'left l') {
            permute_l_shape(cube);
        }
        else if (crossStatus === 'right l') {
            cube.counter_u();
            permute_l_shape(cube);
        }
        else if (crossStatus === 'bottom left l') {
            cube.u();
            permute_l_shape(cube);
        }
        else if (crossStatus === 'bottom right l') {
            cube.u().u();
            permute_l_shape(cube);
        }
        else if (crossStatus === 'vertical line') {
            cube.u();
            permute_up_dot_to_l_shape(cube);
        }
        crossStatus = determineYellowCrossStatus(cube);
    }
}

function yellowFaceIsComplete(cube: Cube): boolean {
    for (const color of cube.cube.u) {
        if (color !== 'y') {
            return false;
        }
    }
    return true;
}

function oneYellowCorner(cube: Cube): number | undefined {
    if (cube.cube.u[0] === 'y' && cube.cube.u[2] !== 'y' && cube.cube.u[6] !== 'y' && cube.cube.u[8] !== 'y') {
        return 0;
    }
    else if (cube.cube.u[2] === 'y' && cube.cube.u[0] !== 'y' && cube.cube.u[6] !== 'y' && cube.cube.u[8] !== 'y') {
        return 2;
    }
    else if (cube.cube.u[6] === 'y' && cube.cube.u[2] !== 'y' && cube.cube.u[0] !== 'y' && cube.cube.u[8] !== 'y') {
        return 6;
    }
    else if (cube.cube.u[8] === 'y' && cube.cube.u[2] !== 'y' && cube.cube.u[6] !== 'y' && cube.cube.u[0] !== 'y') {
        return 8;
    }
}

function suneOrAntisune(cube: Cube) {
    if (cube.cube.f[2] === 'y') {
        sune(cube);
    }
    else {
        antisune(cube);
    }
}

export function solveYellowFace(cube: Cube) {
    cube.perform_reorientation('y', 'o');
    while (!yellowFaceIsComplete(cube)) {
        const numFaces = oneYellowCorner(cube);
        if (numFaces === 0) {
            cube.counter_u();
            suneOrAntisune(cube);
        }
        else if (numFaces === 2) {
            cube.u().u();
            suneOrAntisune(cube);
        }
        else if (numFaces === 6) {
            suneOrAntisune(cube);
        }
        else if (numFaces === 8) {
            cube.u();
            suneOrAntisune(cube);
        }
        else {
            // Simply changing this from always doing sune to sometimes also doing antisune breaks this out of endless loop
            suneOrAntisune(cube);
        }
    }
    /*
    if yellow face is not complete:
        while cube is not in permutation such that only one yellow corner is in position:
            sune
        if cube in sune position:
            sune
        else:
            antisune
     */
}

interface Headlight {
    face: Face,
    headlight: Color,
    middle: Color,
}

export function findHeadlights(cube: Cube): Headlight[] {
    const headlights: Headlight[] = [];
    for (const face of ['l', 'f', 'r', 'b'] as Face[]) {
        if (cube.cube[face][0] === cube.cube[face][2]) {
            headlights.push({
                face,
                headlight: cube.cube[face][0],
                middle: cube.cube[face][1],
            });
        }
    }
    return headlights;
}

export function orientHeadlights(cube: Cube, headlights: Headlight[]) {
    const completeRow = headlights.find(h => h.headlight === h.middle);
    let headlight;
    if (completeRow) {
        headlight = completeRow;
    }
    else {
        headlight = headlights[0];
    }
    const headlightColorFace = <Face>cube.findColor(headlight.headlight);
    const targetColorFace = headlight.face;
    if (areOppositeFaces(targetColorFace, headlightColorFace)) {
        cube.u().u();
    }
    else if (targetFaceIsClockwise(targetColorFace, headlightColorFace)) {
        cube.u();
    }
    else if (targetFaceIsCounterClockwise(targetColorFace, headlightColorFace)) {
        cube.counter_u();
    }
    const oppositeColor = oppositeColors[headlight.headlight];
    cube.perform_reorientation(cube.colorOf('u'), oppositeColor);
}

export function solveTopRow(cube: Cube) {
    cube.perform_reorientation('y', 'o');
    while (!cube.isSolved()) {
        const headlights = findHeadlights(cube);
        if (headlights.length === 4) {
            orientHeadlights(cube, headlights);
            permute_u(cube);
        }
        else {
            if (headlights.length > 0) {
                orientHeadlights(cube, headlights);
            }
            permute_headlights(cube);
            const resultHl = findHeadlights(cube);
            orientHeadlights(cube, resultHl);
        }
    }
    /*
    if all sides have headlights:
        permute_u
    else:
        find a headlight pair
        if headlights:
            make u moves such that headlights is in the back
        permute_headlights
     */
}

export function solve(cube: Cube) {
    solveWhiteCross(cube);
    solveWhiteCorners(cube);
    solveMiddleEdges(cube);
    solveYellowCross(cube);
    solveYellowFace(cube);
    solveTopRow(cube);
}

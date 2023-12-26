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
    'u1': 'b1',
    'u3': 'l1',
    'u5': 'r1',
    'u7': 'f1',
    'l1': 'u3',
    'l3': 'b5',
    'l5': 'f3',
    'l7': 'd3',
    'f1': 'u7',
    'f3': 'l5',
    'f5': 'r3',
    'f7': 'd1',
    'r1': 'u5',
    'r3': 'f5',
    'r5': 'b3',
    'r7': 'd5',
    'b1': 'u1',
    'b3': 'r5',
    'b5': 'l3',
    'b7': 'd7',
    'd1': 'f7',
    'd3': 'l7',
    'd5': 'r7',
    'd7': 'b7',
}

function findEdges(cube: Cube, color: string) {
    const edges = [];
    for (const face of Object.keys(cube.cube)) {
        for (const index of [1, 3, 5, 7]) {
            const square = cube.cube[face][index];
            if (square === color) {
                const adjacency = adjacencies[`${face}${index}`];
                edges.push({
                    face,
                    index,
                    adjacentFace: adjacency[0],
                    adjacentIndex: adjacency[1],
                });
            }
        }
    }
    return edges;
}

export function solveWhiteCross(cube: Cube) {
    // step 1: Find 4 white edge positions
    cube.reorient('w', 'o');
    const whiteEdges = findEdges(cube, 'w');
    // if edge is in correct position, continue
    // if edge is in up face but in incorrect position, perform correction algorithm
    // if edge is in top layer, reorient so white is in front and perform algorithm
    // if edge is in middle layer, reorient so white is in front and perform
    // -- if in index 3 (left), do algorithm a
    // -- else, do algorithm b
    // if edge is in bottom layer, reorient so white is in front and perform algorithm
    // if edge is in d, reorient so adjacent square is facing front and perform algorithm
}

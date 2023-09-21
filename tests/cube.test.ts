import { expect, test } from 'vitest';

import { Cube } from '../src/cube';

function setKnownScramble(cube: Cube) {
    cube.cube = {
        // front
        f: ['b', 'w', 'w',
            'o', 'o', 'r',
            'y', 'w', 'o'],
        // left
        l: ['b', 'y', 'o',
            'r', 'g', 'b',
            'y', 'w', 'g'],
        // right
        r: ['g', 'g', 'b',
            'b', 'b', 'y',
            'w', 'o', 'y'],
        // back
        b: ['w', 'g', 'w',
            'o', 'r', 'y',
            'g', 'o', 'b'],
        // up
        u: ['o', 'r', 'r',
            'b', 'y', 'y',
            'y', 'r', 'r'],
        // down
        d: ['o', 'b', 'g',
            'g', 'w', 'w',
            'r', 'g', 'r'],
    };
}

test('L rotates correctly', () => {
    const cube = new Cube();
    cube.L().L().L();
    expect(cube.cube.f[0]).toBe('w');
    expect(cube.cube.f[3]).toBe('w');
    expect(cube.cube.f[6]).toBe('w');
    expect(cube.cube.u[0]).toBe('o');
    expect(cube.cube.u[3]).toBe('o');
    expect(cube.cube.u[6]).toBe('o');
    expect(cube.cube.d[0]).toBe('r');
    expect(cube.cube.d[3]).toBe('r');
    expect(cube.cube.d[6]).toBe('r');
    expect(cube.cube.b[2]).toBe('y');
    expect(cube.cube.b[5]).toBe('y');
    expect(cube.cube.b[8]).toBe('y');
});

test('l rotates correctly', () => {

});

test('R rotates correctly', () => {

});

test('r rotates correctly', () => {

});

test('U rotates correctly', () => {

});

test('u rotates correctly', () => {

});

test('D rotates correctly', () => {

});

test('d rotates correctly', () => {

});

test('F rotates correctly', () => {

});

test('f rotates correctly', () => {

});

test('B rotates correctly', () => {

});

test('b rotates correctly', () => {

});

test('toString', () => {});

test('Cube prints correctly', () => {
    const cube = new Cube();
    console.log('Validate the output below');
    cube.print();
});

test('scrambles randomly', () => {
    const cube = new Cube();
    const neExpectation = cube.toString();
    cube.scramble();
    const computed = cube.toString();
    expect(computed !== neExpectation).toBeTruthy();
});

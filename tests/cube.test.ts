import { expect, test } from 'vitest';

import { Cube } from '../src/cube';

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

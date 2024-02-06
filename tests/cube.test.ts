import { expect, test, describe } from 'vitest';

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
    cube.l().l().l();
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

test('toString', () => {
    const cube = new Cube();
    const string = cube.toString();
    const expectation = 'yyyyyyyyy/ggggggggg/ooooooooo/bbbbbbbbb/rrrrrrrrr/wwwwwwwww';
    expect(string).toEqual(expectation);
});

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


describe('reorient', () => {
    function knownCube() {
        const cube = new Cube();
        cube.l().counter_d().r().u();
        expect(cube.toString()).toBe('rrryyyboo/yowgggyoo/rbbyowbbo/yrwrbbwbb/gggyrwygg/wwgwwroor');
        return cube;
    }
    test('reorient_clockwise', () => {
        const cube = new Cube();
        cube.reorient_clockwise();
        const computed = cube.toString();
        expect(computed).toBe('yyyyyyyyy/ooooooooo/bbbbbbbbb/rrrrrrrrr/ggggggggg/wwwwwwwww');

        const known = new Cube();
        known.l().counter_d().r().u();
        known.reorient_clockwise();
        const knownComputed = known.toString();
        expect(knownComputed).toBe('byroyroyr/rbbyowbbo/yrwrbbwbb/gggyrwygg/yowgggyoo/grrwwowwo');
    });
    test('reorient_counter_clockwise', () => {
        const known = knownCube();
        known.reorient_counter_clockwise();
        const knownComputed = known.toString();
        expect(knownComputed).toBe('ryoryoryb/gggyrwygg/yowgggyoo/rbbyowbbo/yrwrbbwbb/owwowwrrg');
    });
    test('reorient_forward', () => {
        const known = knownCube();
        known.reorient_forward();
        const knownComputed = known.toString();
        expect(knownComputed).toBe('rbbyowbbo/wgoogoygy/wwgwwroor/wrybbrbbw/oobyyyrrr/ggywryggg');
    });
    test('reorient_backward', () => {
        const known = knownCube();
        known.reorient_backward();
        const knownComputed = known.toString();
        expect(knownComputed).toBe('ggywryggg/ygyogoogw/rrryyyboo/wbbrbbyrw/roorwwgww/rbbyowbbo');
    });
    test('reorient_roll_left', () => {
        const known = knownCube();
        known.reorient_roll_left();
        const knownComputed = known.toString();
        expect(knownComputed).toBe('wbbrbbyrw/ryoryoryb/bwobobryb/grrwwowwo/yyggrggwg/wgoogoygy');
    });
    test('reorient_roll_right', () => {
        const known = knownCube();
        known.reorient_roll_right();
        const knownComputed = known.toString();
        expect(knownComputed).toBe('ygyogoogw/owwowwrrg/byrbobowb/byroyroyr/gwggrggyy/wrybbrbbw');
    });
});

describe('perform_reorientation', () => {
    test('Performs reorientation correctly', () => {

    });
});

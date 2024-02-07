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

function knownCube() {
    const cube = new Cube();
    cube.l().counter_d().r().u();
    expect(cube.toString()).toBe('rrryyyboo/yowgggyoo/rbbyowbbo/yrwrbbwbb/gggyrwygg/wwgwwroor');
    return cube;
}

describe('reorient', () => {
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
        const correctCube = new Cube();
        correctCube.reorient_roll_right();
        correctCube.reorient_roll_right();
        const cube = new Cube();
        cube.perform_reorientation('w', 'o');
        expect(cube.toString()).toBe(correctCube.toString());
    });
    test('yo to yb', () => {
        const known = knownCube();
        known.reorient_clockwise();
        const evalCube = knownCube();
        evalCube.perform_reorientation('y', 'b');
        expect(evalCube.toString()).toBe(known.toString());
    });
    test('yo to yr', () => {
        const known = knownCube();
        known.reorient_clockwise();
        known.reorient_clockwise();
        const evalCube = knownCube();
        evalCube.perform_reorientation('y', 'r');
        expect(evalCube.toString()).toBe(known.toString());
    });
    test('yo to yg', () => {
        const known = knownCube();
        known.reorient_counter_clockwise();
        const evalCube = knownCube();
        evalCube.perform_reorientation('y', 'g');
        expect(evalCube.toString()).toBe(known.toString());
    });
    test('yo to yo', () => {
        const known = knownCube();
        const evalCube = knownCube();
        evalCube.perform_reorientation('y', 'o');
        expect(evalCube.toString()).toBe(known.toString());
    });
    test('yo to go', () => {
        const known = knownCube();
        known.reorient_roll_right();
        const evalCube = knownCube();
        evalCube.perform_reorientation('g', 'o');
        expect(evalCube.toString()).toBe(known.toString());
    });
    test('yo to gy', () => {
        const known = knownCube();
        known.reorient_roll_right();
        known.reorient_clockwise();
        const evalCube = knownCube();
        evalCube.perform_reorientation('g', 'y');
        expect(evalCube.toString()).toBe(known.toString());
    });
    test('yo to gr', () => {
        const known = knownCube();
        known.reorient_roll_right();
        known.reorient_clockwise();
        known.reorient_clockwise();
        const evalCube = knownCube();
        evalCube.perform_reorientation('g', 'r');
        expect(evalCube.toString()).toBe(known.toString());
    });
    test('yo to gw', () => {
        const known = knownCube();
        known.reorient_roll_right();
        known.reorient_counter_clockwise();
        const evalCube = knownCube();
        evalCube.perform_reorientation('g', 'w');
        expect(evalCube.toString()).toBe(known.toString());
    });
    test('yo to ow', () => {
        const known = knownCube();
        known.reorient_forward();
        const evalCube = knownCube();
        evalCube.perform_reorientation('o', 'w');
        expect(evalCube.toString()).toBe(known.toString());
    });
    test('yo to og', () => {
        const known = knownCube();
        known.reorient_forward();
        known.reorient_counter_clockwise();
        const evalCube = knownCube();
        evalCube.perform_reorientation('o', 'g');
        expect(evalCube.toString()).toBe(known.toString());
    });
    test('yo to ob', () => {
        const known = knownCube();
        known.reorient_forward();
        known.reorient_clockwise();
        const evalCube = knownCube();
        evalCube.perform_reorientation('o', 'b');
        expect(evalCube.toString()).toBe(known.toString());
    });
    test('yo to oy', () => {
        const known = knownCube();
        known.reorient_forward();
        known.reorient_counter_clockwise();
        known.reorient_counter_clockwise();
        const evalCube = knownCube();
        evalCube.perform_reorientation('o', 'y');
        expect(evalCube.toString()).toBe(known.toString());
    });
    test('yo to bo', () => {
        const known = knownCube();
        known.reorient_roll_left();
        const evalCube = knownCube();
        evalCube.perform_reorientation('b', 'o');
        expect(evalCube.toString()).toBe(known.toString());
    });
    test('yo to by', () => {
        const known = knownCube();
        known.reorient_roll_left();
        known.reorient_counter_clockwise();
        const evalCube = knownCube();
        evalCube.perform_reorientation('b', 'y');
        expect(evalCube.toString()).toBe(known.toString());
    });
    test('yo to bw', () => {
        const known = knownCube();
        known.reorient_roll_left();
        known.reorient_clockwise();
        const evalCube = knownCube();
        evalCube.perform_reorientation('b', 'w');
        expect(evalCube.toString()).toBe(known.toString());
    });
    test('yo to br', () => {
        const known = knownCube();
        known.reorient_roll_left();
        known.reorient_counter_clockwise();
        known.reorient_counter_clockwise();
        const evalCube = knownCube();
        evalCube.perform_reorientation('b', 'r');
        expect(evalCube.toString()).toBe(known.toString());
    });
    test('yo to ry', () => {
        const known = knownCube();
        known.reorient_backward();
        const evalCube = knownCube();
        evalCube.perform_reorientation('r', 'y');
        expect(evalCube.toString()).toBe(known.toString());
    });
    test('yo to rg', () => {
        const known = knownCube();
        known.reorient_backward();
        known.reorient_counter_clockwise();
        const evalCube = knownCube();
        evalCube.perform_reorientation('r', 'g');
        expect(evalCube.toString()).toBe(known.toString());
    });
    test('yo to rb', () => {
        const known = knownCube();
        known.reorient_backward();
        known.reorient_clockwise();
        const evalCube = knownCube();
        evalCube.perform_reorientation('r', 'b');
        expect(evalCube.toString()).toBe(known.toString());
    });
    test('yo to rw', () => {
        const known = knownCube();
        known.reorient_backward();
        known.reorient_clockwise();
        known.reorient_clockwise();
        const evalCube = knownCube();
        evalCube.perform_reorientation('r', 'w');
        expect(evalCube.toString()).toBe(known.toString());
    });
    test('yo to wo', () => {
        const known = knownCube();
        known.reorient_roll_right();
        known.reorient_roll_right();
        const evalCube = knownCube();
        evalCube.perform_reorientation('w', 'o');
        expect(evalCube.toString()).toBe(known.toString());
    });
    test('yo to wg', () => {
        const known = knownCube();
        known.reorient_roll_right();
        known.reorient_roll_right();
        known.reorient_clockwise();
        const evalCube = knownCube();
        evalCube.perform_reorientation('w', 'g');
        expect(evalCube.toString()).toBe(known.toString());
    });
    test('yo to wr', () => {
        const known = knownCube();
        known.reorient_roll_right();
        known.reorient_roll_right();
        known.reorient_clockwise();
        known.reorient_clockwise();
        const evalCube = knownCube();
        evalCube.perform_reorientation('w', 'r');
        expect(evalCube.toString()).toBe(known.toString());
    });
    test('yo to wb', () => {
        const known = knownCube();
        known.reorient_roll_right();
        known.reorient_roll_right();
        known.reorient_counter_clockwise();
        const evalCube = knownCube();
        evalCube.perform_reorientation('w', 'b');
        expect(evalCube.toString()).toBe(known.toString());
    });
});

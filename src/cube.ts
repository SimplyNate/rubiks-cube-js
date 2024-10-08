// https://ruwix.com/online-rubiks-cube-solver-program/

export interface CubePositions {
    [index: string]: Color[];
    f: Color[];
    l: Color[];
    r: Color[];
    b: Color[];
    u: Color[];
    d: Color[];
}

export type Face = 'u' | 'l' | 'f' | 'r' | 'b' | 'd';
export type Color = 'w' | 'r' | 'b' | 'o' | 'g' | 'y';

// min is inclusive, max is exclusive
function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}

const disallowedRandom = [
    1,
    0,
    3,
    2,
    5,
    4,
    7,
    6,
    9,
    8,
    11,
    10
];
/*
Orientation is defined as:
Key: UpFront
Value: [Up, Left, Front, Right, Back, Down]
 */
export const cubeOrientations: Record<string, Color[]> = {
    wo: ['w', 'b', 'o', 'g', 'r', 'y'],
    wb: ['w', 'r', 'b', 'o', 'g', 'y'],
    wr: ['w', 'g', 'r', 'b', 'o', 'y'],
    wg: ['w', 'o', 'g', 'r', 'b', 'y'],
    bw: ['b', 'o', 'w', 'r', 'y', 'g'],
    bo: ['b', 'y', 'o', 'w', 'r', 'g'],
    by: ['b', 'r', 'y', 'o', 'w', 'g'],
    br: ['b', 'w', 'r', 'y', 'o', 'g'],
    ow: ['o', 'g', 'w', 'b', 'y', 'r'],
    og: ['o', 'y', 'g', 'w', 'b', 'r'],
    oy: ['o', 'b', 'y', 'g', 'w', 'r'],
    ob: ['o', 'w', 'b', 'y', 'g', 'r'],
    gw: ['g', 'r', 'w', 'o', 'y', 'b'],
    gr: ['g', 'y', 'r', 'w', 'o', 'b'],
    gy: ['g', 'o', 'y', 'r', 'w', 'b'],
    go: ['g', 'w', 'o', 'y', 'r', 'b'],
    rw: ['r', 'b', 'w', 'g', 'y', 'o'],
    rb: ['r', 'y', 'b', 'w', 'g', 'o'],
    ry: ['r', 'g', 'y', 'b', 'w', 'o'],
    rg: ['r', 'w', 'g', 'y', 'b', 'o'],
    yo: ['y', 'g', 'o', 'b', 'r', 'w'],
    yg: ['y', 'r', 'g', 'o', 'b', 'w'],
    yr: ['y', 'b', 'r', 'g', 'o', 'w'],
    yb: ['y', 'o', 'b', 'r', 'g', 'w'],
}

// TODO: Create cube as 20 enumerated and unique colored pieces of the cube
// TODO: Calculate entropy of cube as distance from starting point each 20 cube pieces are
export class Cube {
    [index: string]: any;
    cube: CubePositions;
    history: string[];
    scrambleHistory: string[];
    positionHistory: string[];

    constructor() {
        this.cube = {
            // front
            f: ['o', 'o', 'o',
                'o', 'o', 'o',
                'o', 'o', 'o'],
            // left
            l: ['g', 'g', 'g',
                'g', 'g', 'g',
                'g', 'g', 'g'],
            // right
            r: ['b', 'b', 'b',
                'b', 'b', 'b',
                'b', 'b', 'b'],
            // back
            b: ['r', 'r', 'r',
                'r', 'r', 'r',
                'r', 'r', 'r'],
            // up
            u: ['y', 'y', 'y',
                'y', 'y', 'y',
                'y', 'y', 'y'],
            // down
            d: ['w', 'w', 'w',
                'w', 'w', 'w',
                'w', 'w', 'w'],
        };
        this.history = [];
        this.scrambleHistory = [];
        this.positionHistory = [this.toString()];
    }
    static fromString(str: string): Cube {
        const faceOrder: Face[] = ['u', 'l', 'f', 'r', 'b', 'd'];
        const split = str.split('/');
        if (split.length !== 6) {
            throw new Error(`Invalid Cube string. Got ${str}`);
        }
        const cube = new Cube();
        for (let i = 0; i < split.length; i++) {
            const face = split[i];
            if (face.length !== 9) {
                throw new Error(`Invalid face string. Got ${face}`);
            }
            cube.cube[faceOrder[i]] = <Color[]>face.split('');
        }
        cube.positionHistory = [cube.toString()];
        return cube;
    }
    static scrambled(steps: number = 20): Cube {
        const cube = new Cube();
        cube.scramble(steps);
        return cube;
    }
    scramble(steps: number = 20) {
        // Reset history when scrambling
        this.history = [];
        let i = 0;
        let last;
        while (i < steps) {
            const num = getRandomInt(0, 12);
            if (last && num === disallowedRandom[last]) {
                continue;
            }
            if (num === 0) {
                this.f();
            }
            else if (num === 1) {
                this.counter_f();
            }
            else if (num === 2) {
                this.l();
            }
            else if (num === 3) {
                this.counter_l();
            }
            else if (num === 4) {
                this.r();
            }
            else if (num === 5) {
                this.counter_r();
            }
            else if (num === 6) {
                this.b();
            }
            else if (num === 7) {
                this.counter_b();
            }
            else if (num === 8) {
                this.u();
            }
            else if (num === 9) {
                this.counter_u();
            }
            else if (num === 10) {
                this.d();
            }
            else {
                this.counter_d();
            }
            last = num;
            i++;
        }
        this.scrambleHistory = this.history;
        this.history = [];
        this.positionHistory = [this.toString()];
        return this;
    }
    private clockwiseRotation(face: Face) {
        this.cube[face] = [
            this.cube[face][6],
            this.cube[face][3],
            this.cube[face][0],
            this.cube[face][7],
            this.cube[face][4],
            this.cube[face][1],
            this.cube[face][8],
            this.cube[face][5],
            this.cube[face][2],
        ];
    }
    private counterClockwiseRotation(face: Face) {
        this.cube[face] = [
            this.cube[face][2],
            this.cube[face][5],
            this.cube[face][8],
            this.cube[face][1],
            this.cube[face][4],
            this.cube[face][7],
            this.cube[face][0],
            this.cube[face][3],
            this.cube[face][6],
        ];
    }
    l() {
        this.history.push('l');
        const firstCopy = [...this.cube.f];
        this.cube.f[0] = this.cube.u[0];
        this.cube.f[3] = this.cube.u[3];
        this.cube.f[6] = this.cube.u[6];
        this.cube.u[0] = this.cube.b[8];
        this.cube.u[3] = this.cube.b[5];
        this.cube.u[6] = this.cube.b[2];
        this.cube.b[8] = this.cube.d[0];
        this.cube.b[5] = this.cube.d[3];
        this.cube.b[2] = this.cube.d[6];
        this.cube.d[0] = firstCopy[0];
        this.cube.d[3] = firstCopy[3];
        this.cube.d[6] = firstCopy[6];
        this.clockwiseRotation('l');
        this.positionHistory.push(this.toString());
        return this;
    }
    counter_l() {
        this.history.push('counter_l');
        const firstCopy = [...this.cube.f];
        this.cube.f[0] = this.cube.d[0];
        this.cube.f[3] = this.cube.d[3];
        this.cube.f[6] = this.cube.d[6];
        this.cube.d[0] = this.cube.b[8];
        this.cube.d[3] = this.cube.b[5];
        this.cube.d[6] = this.cube.b[2];
        this.cube.b[8] = this.cube.u[0];
        this.cube.b[5] = this.cube.u[3];
        this.cube.b[2] = this.cube.u[6];
        this.cube.u[0] = firstCopy[0];
        this.cube.u[3] = firstCopy[3];
        this.cube.u[6] = firstCopy[6];
        this.counterClockwiseRotation('l');
        this.positionHistory.push(this.toString());
        return this;
    }
    r() {
        this.history.push('r');
        const firstCopy = [...this.cube.f];
        this.cube.f[2] = this.cube.d[2];
        this.cube.f[5] = this.cube.d[5];
        this.cube.f[8] = this.cube.d[8];
        this.cube.d[2] = this.cube.b[6];
        this.cube.d[5] = this.cube.b[3];
        this.cube.d[8] = this.cube.b[0];
        this.cube.b[6] = this.cube.u[2];
        this.cube.b[3] = this.cube.u[5];
        this.cube.b[0] = this.cube.u[8];
        this.cube.u[2] = firstCopy[2];
        this.cube.u[5] = firstCopy[5];
        this.cube.u[8] = firstCopy[8];
        this.clockwiseRotation('r');
        this.positionHistory.push(this.toString());
        return this;
    }
    counter_r() {
        this.history.push('counter_r');
        const firstCopy = [...this.cube.f];
        this.cube.f[2] = this.cube.u[2];
        this.cube.f[5] = this.cube.u[5];
        this.cube.f[8] = this.cube.u[8];
        this.cube.u[2] = this.cube.b[6];
        this.cube.u[5] = this.cube.b[3];
        this.cube.u[8] = this.cube.b[0];
        this.cube.b[6] = this.cube.d[2];
        this.cube.b[3] = this.cube.d[5];
        this.cube.b[0] = this.cube.d[8];
        this.cube.d[2] = firstCopy[2];
        this.cube.d[5] = firstCopy[5];
        this.cube.d[8] = firstCopy[8];
        this.counterClockwiseRotation('r');
        this.positionHistory.push(this.toString());
        return this;
    }
    u() {
        this.history.push('u');
        const firstCopy = [...this.cube.f];
        this.cube.f[0] = this.cube.r[0];
        this.cube.f[1] = this.cube.r[1];
        this.cube.f[2] = this.cube.r[2];
        this.cube.r[0] = this.cube.b[0];
        this.cube.r[1] = this.cube.b[1];
        this.cube.r[2] = this.cube.b[2];
        this.cube.b[0] = this.cube.l[0];
        this.cube.b[1] = this.cube.l[1];
        this.cube.b[2] = this.cube.l[2];
        this.cube.l[0] = firstCopy[0];
        this.cube.l[1] = firstCopy[1];
        this.cube.l[2] = firstCopy[2];
        this.clockwiseRotation('u');
        this.positionHistory.push(this.toString());
        return this;
    }
    counter_u() {
        this.history.push('counter_u');
        const firstCopy = [...this.cube.f];
        this.cube.f[0] = this.cube.l[0];
        this.cube.f[1] = this.cube.l[1];
        this.cube.f[2] = this.cube.l[2];
        this.cube.l[0] = this.cube.b[0];
        this.cube.l[1] = this.cube.b[1];
        this.cube.l[2] = this.cube.b[2];
        this.cube.b[0] = this.cube.r[0];
        this.cube.b[1] = this.cube.r[1];
        this.cube.b[2] = this.cube.r[2];
        this.cube.r[0] = firstCopy[0];
        this.cube.r[1] = firstCopy[1];
        this.cube.r[2] = firstCopy[2];
        this.counterClockwiseRotation('u');
        this.positionHistory.push(this.toString());
        return this;
    }
    d() {
        this.history.push('d');
        const firstCopy = [...this.cube.f];
        this.cube.f[6] = this.cube.l[6];
        this.cube.f[7] = this.cube.l[7];
        this.cube.f[8] = this.cube.l[8];
        this.cube.l[6] = this.cube.b[6];
        this.cube.l[7] = this.cube.b[7];
        this.cube.l[8] = this.cube.b[8];
        this.cube.b[6] = this.cube.r[6];
        this.cube.b[7] = this.cube.r[7];
        this.cube.b[8] = this.cube.r[8];
        this.cube.r[6] = firstCopy[6];
        this.cube.r[7] = firstCopy[7];
        this.cube.r[8] = firstCopy[8];
        this.clockwiseRotation('d');
        this.positionHistory.push(this.toString());
        return this;
    }
    counter_d() {
        this.history.push('counter_d');
        const firstCopy = [...this.cube.f];
        this.cube.f[6] = this.cube.r[6];
        this.cube.f[7] = this.cube.r[7];
        this.cube.f[8] = this.cube.r[8];
        this.cube.r[6] = this.cube.b[6];
        this.cube.r[7] = this.cube.b[7];
        this.cube.r[8] = this.cube.b[8];
        this.cube.b[6] = this.cube.l[6];
        this.cube.b[7] = this.cube.l[7];
        this.cube.b[8] = this.cube.l[8];
        this.cube.l[6] = firstCopy[6];
        this.cube.l[7] = firstCopy[7];
        this.cube.l[8] = firstCopy[8];
        this.counterClockwiseRotation('d');
        this.positionHistory.push(this.toString());
        return this;
    }
    f() {
        this.history.push('f');
        const copy = [...this.cube.u];
        this.cube.u[6] = this.cube.l[8];
        this.cube.u[7] = this.cube.l[5];
        this.cube.u[8] = this.cube.l[2];
        this.cube.l[2] = this.cube.d[0];
        this.cube.l[5] = this.cube.d[1];
        this.cube.l[8] = this.cube.d[2];
        this.cube.d[0] = this.cube.r[6];
        this.cube.d[1] = this.cube.r[3];
        this.cube.d[2] = this.cube.r[0];
        this.cube.r[0] = copy[6];
        this.cube.r[3] = copy[7];
        this.cube.r[6] = copy[8];
        this.clockwiseRotation('f');
        this.positionHistory.push(this.toString());
        return this;
    }
    counter_f() {
        this.history.push('counter_f');
        const copy = [...this.cube.u];
        this.cube.u[6] = this.cube.r[0];
        this.cube.u[7] = this.cube.r[3];
        this.cube.u[8] = this.cube.r[6];
        this.cube.r[6] = this.cube.d[0];
        this.cube.r[3] = this.cube.d[1];
        this.cube.r[0] = this.cube.d[2];
        this.cube.d[0] = this.cube.l[2];
        this.cube.d[1] = this.cube.l[5];
        this.cube.d[2] = this.cube.l[8];
        this.cube.l[8] = copy[6];
        this.cube.l[5] = copy[7];
        this.cube.l[2] = copy[8];
        this.counterClockwiseRotation('f');
        this.positionHistory.push(this.toString());
        return this;
    }
    b() {
        this.history.push('b');
        const copy = [...this.cube.r];
        this.cube.r[2] = this.cube.d[8];
        this.cube.r[5] = this.cube.d[7];
        this.cube.r[8] = this.cube.d[6];
        this.cube.d[6] = this.cube.l[0];
        this.cube.d[7] = this.cube.l[3];
        this.cube.d[8] = this.cube.l[6];
        this.cube.l[0] = this.cube.u[2];
        this.cube.l[3] = this.cube.u[1];
        this.cube.l[6] = this.cube.u[0];
        this.cube.u[0] = copy[2];
        this.cube.u[1] = copy[5];
        this.cube.u[2] = copy[8];
        this.clockwiseRotation('b');
        this.positionHistory.push(this.toString());
        return this;
    }
    counter_b() {
        this.history.push('counter_b');
        const copy = [...this.cube.r];
        this.cube.r[2] = this.cube.u[0];
        this.cube.r[5] = this.cube.u[1];
        this.cube.r[8] = this.cube.u[2];
        this.cube.u[0] = this.cube.l[6];
        this.cube.u[1] = this.cube.l[3];
        this.cube.u[2] = this.cube.l[0];
        this.cube.l[0] = this.cube.d[6];
        this.cube.l[3] = this.cube.d[7];
        this.cube.l[6] = this.cube.d[8];
        this.cube.d[6] = copy[8];
        this.cube.d[7] = copy[5];
        this.cube.d[8] = copy[2];
        this.counterClockwiseRotation('b');
        this.positionHistory.push(this.toString());
        return this;
    }
    performRotation(face: Face, counter_clockwise: boolean = false) {
        if (this.cube[face]) {
            return (<() => this>this[`${counter_clockwise ? 'counter_' : ''}${face}`])();
        }
        return this;
    }
    toString() {
        return this.cube.u.join('') + '/' +
               this.cube.l.join('') + '/' +
               this.cube.f.join('') + '/' +
               this.cube.r.join('') + '/' +
               this.cube.b.join('') + '/' +
               this.cube.d.join('');
    }
    print() {
        console.log(
            `${' '} ${' '} ${' '} ${this.cube.u[0]} ${this.cube.u[1]} ${this.cube.u[2]} ${' '} ${' '} ${' '} ${' '} ${' '} ${' '}\n` +
            `${' '} ${' '} ${' '} ${this.cube.u[3]} ${this.cube.u[4]} ${this.cube.u[5]} ${' '} ${' '} ${' '} ${' '} ${' '} ${' '}\n` +
            `${' '} ${' '} ${' '} ${this.cube.u[6]} ${this.cube.u[7]} ${this.cube.u[8]} ${' '} ${' '} ${' '} ${' '} ${' '} ${' '}\n` +
            `${this.cube.l[0]} ${this.cube.l[1]} ${this.cube.l[2]} ${this.cube.f[0]} ${this.cube.f[1]} ${this.cube.f[2]} ${this.cube.r[0]} ${this.cube.r[1]} ${this.cube.r[2]} ${this.cube.b[0]} ${this.cube.b[1]} ${this.cube.b[2]}\n` +
            `${this.cube.l[3]} ${this.cube.l[4]} ${this.cube.l[5]} ${this.cube.f[3]} ${this.cube.f[4]} ${this.cube.f[5]} ${this.cube.r[3]} ${this.cube.r[4]} ${this.cube.r[5]} ${this.cube.b[3]} ${this.cube.b[4]} ${this.cube.b[5]}\n` +
            `${this.cube.l[6]} ${this.cube.l[7]} ${this.cube.l[8]} ${this.cube.f[6]} ${this.cube.f[7]} ${this.cube.f[8]} ${this.cube.r[6]} ${this.cube.r[7]} ${this.cube.r[8]} ${this.cube.b[6]} ${this.cube.b[7]} ${this.cube.b[8]}\n` +
            `${' '} ${' '} ${' '} ${this.cube.d[0]} ${this.cube.d[1]} ${this.cube.d[2]} ${' '} ${' '} ${' '} ${' '} ${' '} ${' '}\n` +
            `${' '} ${' '} ${' '} ${this.cube.d[3]} ${this.cube.d[4]} ${this.cube.d[5]} ${' '} ${' '} ${' '} ${' '} ${' '} ${' '}\n` +
            `${' '} ${' '} ${' '} ${this.cube.d[6]} ${this.cube.d[7]} ${this.cube.d[8]} ${' '} ${' '} ${' '} ${' '} ${' '} ${' '}\n`
        );
    }
    isSolved(): boolean {
        for (const face of this.faces()) {
            for (const color of this.cube[face]) {
                if (color !== this.cube[face][4]) {
                    return false;
                }
            }
        }
        return true;
    }
    perform_reorientation(up: Color, front: Color) {
        this.history.push(`reorient ${up}${front}`)
        const currentOrientation = cubeOrientations[`${this.colorOf('u')}${this.colorOf('f')}`];
        const [_cU, cL, cF, cR, cB, cD] = currentOrientation;
        const targetOrientation = cubeOrientations[`${up}${front}`];
        const [tU, _tL, tF, _tR, _tB, _tD] = targetOrientation;
        /*
        Discover where up went first.
        if new up is same as current up, do nothing
        else if new up is equal to current bottom
            reorient_forward()
            reorient_forward()
        else if old up is front
            reorient_backward()
        else if old up is left
            reorient_roll_left
        else if old up is right
            reorient_roll_right
        else if old up is back
            reorient_forward

        Assuming old up is in the correct position, determine where current_front is in relation to where desired_front is
        if current_front is equivalent to desired_front, do nothing
        else if current_front needs to be left
            reorient_clockwise
        else if current_front needs to be right
            reorient_counter_clockwise
        else if current_front needs to be back
            if old_up is left or right
                reorient_forward
                reorient_forward
            else
                reorient_clockwise
                reorient_clockwise
        else if current_front needs to be up
            reorient_forward
        else if current_front needs to be down
            reorient_backward
         */
        if (tU === cD) {
            this.reorient_forward();
            this.reorient_forward();
        }
        else if (tU === cF) {
            this.reorient_forward();
        }
        else if (tU === cL) {
            this.reorient_roll_right();
        }
        else if (tU === cR) {
            this.reorient_roll_left();
        }
        else if (tU === cB) {
            this.reorient_backward();
        }
        const interimOrientation = cubeOrientations[`${this.colorOf('u')}${this.colorOf('f')}`];
        const [_iU, iL, _iF, iR, iB, _iD] = interimOrientation;
        if (tF === iL) {
            this.reorient_counter_clockwise();
        }
        else if (tF === iR) {
            this.reorient_clockwise();
        }
        else if (tF === iB) {
            this.reorient_clockwise();
            this.reorient_clockwise();
        }
        this.positionHistory.push(this.toString());
    }
    private reorient(up: Color, front: Color) {
        let [u, l, f, r, b, d] = cubeOrientations[`${up}${front}`];
        const newU = this.copyByColor(u);
        const newL = this.copyByColor(l);
        const newF = this.copyByColor(f);
        const newR = this.copyByColor(r);
        const newB = this.copyByColor(b);
        const newD = this.copyByColor(d);
        if (newU && newL && newF && newR && newB && newD) {
            this.cube.u = newU;
            this.cube.l = newL;
            this.cube.f = newF;
            this.cube.r = newR;
            this.cube.b = newB;
            this.cube.d = newD;
        }
    }
    reorient_clockwise() {
        this.reorient(this.colorOf('u'), this.colorOf('r'));
        this.counterClockwiseRotation('d');
        this.clockwiseRotation('u');
    }
    reorient_counter_clockwise() {
        this.reorient(this.colorOf('u'), this.colorOf('l'));
        this.clockwiseRotation('d');
        this.counterClockwiseRotation('u');
    }
    reorient_forward() {
        this.reorient(this.colorOf('f'), this.colorOf('d'));
        this.clockwiseRotation('r');
        this.counterClockwiseRotation('l');
        this.clockwiseRotation('b');
        this.clockwiseRotation('b');
        this.clockwiseRotation('d');
        this.clockwiseRotation('d');
    }
    reorient_backward() {
        this.reorient(this.colorOf('b'), this.colorOf('u'));
        this.counterClockwiseRotation('r');
        this.clockwiseRotation('l');
        this.clockwiseRotation('b');
        this.clockwiseRotation('b');
        this.clockwiseRotation('u');
        this.clockwiseRotation('u');
    }
    reorient_roll_left() {
        this.reorient(this.colorOf('r'), this.colorOf('f'));
        this.counterClockwiseRotation('l');
        this.counterClockwiseRotation('u');
        this.counterClockwiseRotation('r');
        this.counterClockwiseRotation('d');
        this.counterClockwiseRotation('f');
        this.clockwiseRotation('b');
    }
    reorient_roll_right() {
        this.reorient(this.colorOf('l'), this.colorOf('f'));
        this.clockwiseRotation('l');
        this.clockwiseRotation('u');
        this.clockwiseRotation('r');
        this.clockwiseRotation('d');
        this.counterClockwiseRotation('b');
        this.clockwiseRotation('f');
    }
    get entropy(): number {
        /*
        Better entropy calculation:
        let entropy = 0;
        for (const face of cube) {
            for (const square of face) {
                if (square !== cube.colorOf(face)) {
                    // logic for calculating distance from natural position
                    // Basic logic:
                    //     if square is in adjacent face,
                    //         entropy += 1
                    //     else if square is in opposite face,
                    //         entropy += 2
                }
            }
        }
         */
        let entropy = 0;
        const index = 4;
        const keys = this.faces();
        for (const key of keys) {
            let total = 0;
            for (let i = 0; i < this.cube[key].length; i++) {
                total += this.cube[key][i].charCodeAt(0);
            }
            total /= this.cube[key].length;
            entropy += Math.abs(total - this.cube[key][index].charCodeAt(0));
        }
        return entropy;
    }
    get up(): Color {
        return <"w" | "r" | "b" | "o" | "g" | "y">this.cube.u[4];
    }
    get left(): Color {
        return <"w" | "r" | "b" | "o" | "g" | "y">this.cube.l[4];
    }
    get front(): Color {
        return <"w" | "r" | "b" | "o" | "g" | "y">this.cube.f[4];
    }
    get right(): Color {
        return <"w" | "r" | "b" | "o" | "g" | "y">this.cube.r[4];
    }
    get back(): Color {
        return <"w" | "r" | "b" | "o" | "g" | "y">this.cube.b[4];
    }
    get down(): Color {
        return <"w" | "r" | "b" | "o" | "g" | "y">this.cube.d[4];
    }
    colorOf(face: Face): Color {
        return <Color>this.cube[face][4];
    }
    findColor(color: Color): Face | undefined {
        for (const key of this.faces()) {
            if (color === this.cube[key][4]) {
                return <Face>key;
            }
        }
    }
    copyByColor(color: Color): Color[] | undefined {
        const key = this.findColor(color);
        if (key) {
            return <Color[]>[...this.cube[key]];
        }
    }
    faces(): Face[] {
        return <Face[]>Object.keys(this.cube);
    }
    copy(): Cube {
        const cube = new Cube();
        cube.cube = JSON.parse(JSON.stringify(this.cube));
        cube.history = JSON.parse(JSON.stringify(this.history));
        cube.scrambleHistory = JSON.parse(JSON.stringify(this.scrambleHistory));
        cube.positionHistory = JSON.parse(JSON.stringify(this.positionHistory));
        return cube;
    }
}

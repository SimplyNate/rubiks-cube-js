// https://ruwix.com/online-rubiks-cube-solver-program/

interface CubePositions {
    [index: string]: string[];
    f: string[];
    l: string[];
    r: string[];
    b: string[];
    u: string[];
    d: string[];
}

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
const solvedCube = 'yyyyyyyyy/ggggggggg/ooooooooo/bbbbbbbbb/rrrrrrrrr/wwwwwwwww';
/*
Orientation is defined as:
Key: UpFront
Value: [Up, Left, Front, Right, Back, Down]
 */
interface CubeOrientations {
    [index: string]: string;
}
const cubeOrientations: CubeOrientations = {
    wo: 'wbogry',
    wb: 'wrbogy',
    wr: 'wrbogy',
    wg: 'wogrby',
    bw: 'bowryg',
    bo: 'byowrg',
    by: 'bryowg',
    br: 'bwryog',
    ow: 'ogwbyr',
    og: 'oygwbr',
    oy: 'obygwr',
    ob: 'owbygr',
    gw: 'grwoyb',
    gr: 'gyrwob',
    gy: 'goyrwb',
    go: 'gwoyrb',
    rw: 'rbwgyo',
    rb: 'rybwgo',
    ry: 'rgybwo',
    rg: 'rwgybo',
    yo: 'ygobrw',
    yg: 'yrgobw',
    yr: 'ybrgow',
    yb: 'yobrgw',
}

// TODO: Create cube as 20 enumerated and unique colored pieces of the cube
// TODO: Calculate entropy of cube as distance from starting point each 20 cube pieces are
export class Cube {
    [index: string]: any;
    cube: CubePositions;
    history: string[];

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
    }
    static fromString(str: string): Cube {
        const faceOrder = ['u', 'l', 'f', 'r', 'b', 'd'];
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
            cube.cube[faceOrder[i]] = face.split('');
        }
        return cube;
    }
    static scrambled(steps: number = 20): Cube {
        const cube = new Cube();
        cube.scramble(steps);
        return cube;
    }
    scramble(steps: number = 20) {
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
        this.history = [];
        return this;
    }
    private clockwiseRotation(face: string) {
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
    private counterClockwiseRotation(face: string) {
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
        return this;
    }
    performRotation(face: string, counter_clockwise: boolean = false) {
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
        return this.toString() === solvedCube;
    }
    reorient(up: string, front: string) {
        let [u, l, f, r, b, d] = cubeOrientations[`${up}${front}`].split('');
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
    get entropy(): number {
        let entropy = 0;
        const index = 4;
        const keys = Object.keys(this.cube)
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
    get up(): string {
        return this.cube.u[4];
    }
    get left(): string {
        return this.cube.l[4];
    }
    get front(): string {
        return this.cube.f[4];
    }
    get right(): string {
        return this.cube.r[4];
    }
    get back(): string {
        return this.cube.b[4];
    }
    get down(): string {
        return this.cube.d[4];
    }
    colorOf(face: string) {
        return this.cube[face][4];
    }
    findColor(color: string) {
        for (const key of Object.keys(this.cube)) {
            if (color === this.cube[key][4]) {
                return key;
            }
        }
    }
    copyByColor(color: string) {
        const key = this.findColor(color);
        if (key) {
            return [...this.cube[key]];
        }
    }
}

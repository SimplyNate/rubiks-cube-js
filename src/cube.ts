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

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}

export class Cube {
    cube: CubePositions;
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
    }

    scramble() {
        const steps = 20;
        const options = [
            this.L,
            this.l,
            this.R,
            this.r,
            this.U,
            this.u,
            this.D,
            this.d,
            this.F,
            this.f,
            this.B,
            this.b,
        ];
        for (let i = 0; i < steps; i++) {
            options[getRandomInt(0, options.length)]();
        }
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
            this.cube[face][2],
            this.cube[face][4],
            this.cube[face][7],
            this.cube[face][0],
            this.cube[face][3],
            this.cube[face][6],
        ];
    }

    L() {
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
    l() {
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

    R() {
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
    r() {
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

    U() {
        const firstCopy = [...this.cube.f];
        this.cube.f[0] = this.cube.r[0];
        this.cube.f[1] = this.cube.r[1];
        this.cube.f[2] = this.cube.r[2];
        this.cube.l[0] = firstCopy[0];
        this.cube.l[1] = firstCopy[1];
        this.cube.l[2] = firstCopy[2];
        this.cube.b[0] = this.cube.l[0];
        this.cube.b[1] = this.cube.l[1];
        this.cube.b[2] = this.cube.l[2];
        this.cube.r[0] = this.cube.b[0];
        this.cube.r[1] = this.cube.b[1];
        this.cube.r[2] = this.cube.b[2];
        this.clockwiseRotation('u');
    }
    u() {
        const firstCopy = [...this.cube.f];
        this.cube.f[0] = this.cube.l[0];
        this.cube.f[1] = this.cube.l[1];
        this.cube.f[2] = this.cube.l[2];
        this.cube.r[0] = firstCopy[0];
        this.cube.r[1] = firstCopy[1];
        this.cube.r[2] = firstCopy[2];
        this.cube.b[0] = this.cube.r[0];
        this.cube.b[1] = this.cube.r[1];
        this.cube.b[2] = this.cube.r[2];
        this.cube.l[0] = this.cube.b[0];
        this.cube.l[1] = this.cube.b[1];
        this.cube.l[2] = this.cube.b[2];
        this.counterClockwiseRotation('u');
    }

    D() {
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
    }
    d() {
        const firstCopy = [...this.cube.f];
        this.cube.f[6] = this.cube.r[6];
        this.cube.f[7] = this.cube.r[7];
        this.cube.f[8] = this.cube.r[8];
        this.cube.l[6] = firstCopy[6];
        this.cube.l[7] = firstCopy[7];
        this.cube.l[8] = firstCopy[8];
        this.cube.b[6] = this.cube.l[6];
        this.cube.b[7] = this.cube.l[7];
        this.cube.b[8] = this.cube.l[8];
        this.cube.r[6] = this.cube.b[6];
        this.cube.r[7] = this.cube.b[7];
        this.cube.r[8] = this.cube.b[8];
        this.counterClockwiseRotation('d');
    }

    F() {}
    f() {}

    B() {}
    b() {}
}

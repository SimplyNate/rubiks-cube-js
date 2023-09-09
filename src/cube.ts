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
        /* old algorithm
        const beforeRotation = [...this.cube[face]];
        this.cube[face][0] = beforeRotation[6];
        this.cube[face][1] = beforeRotation[3];
        this.cube[face][2] = beforeRotation[0];
        this.cube[face][3] = beforeRotation[7];
        this.cube[face][4] = beforeRotation[4];
        this.cube[face][5] = beforeRotation[1];
        this.cube[face][6] = beforeRotation[8];
        this.cube[face][7] = beforeRotation[5];
        this.cube[face][8] = beforeRotation[2];
         */
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
        /*
        const beforeRotation = [...this.cube[face]];
        this.cube[face][0] = beforeRotation[2];
        this.cube[face][1] = beforeRotation[5];
        this.cube[face][2] = beforeRotation[8];
        this.cube[face][3] = beforeRotation[2];
        this.cube[face][4] = beforeRotation[4];
        this.cube[face][5] = beforeRotation[7];
        this.cube[face][6] = beforeRotation[0];
        this.cube[face][7] = beforeRotation[3];
        this.cube[face][8] = beforeRotation[6];
         */
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

        const lBeforeRotation = [...this.cube.r];
        this.cube.r[0] = lBeforeRotation[6];
        this.cube.r[1] = lBeforeRotation[3];
        this.cube.r[2] = lBeforeRotation[0];
        this.cube.r[3] = lBeforeRotation[7];
        this.cube.r[4] = lBeforeRotation[4];
        this.cube.r[5] = lBeforeRotation[1];
        this.cube.r[6] = lBeforeRotation[8];
        this.cube.r[7] = lBeforeRotation[5];
        this.cube.r[8] = lBeforeRotation[2];
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

        const lBeforeRotation = [...this.cube.r];
        this.cube.r[0] = lBeforeRotation[2];
        this.cube.r[1] = lBeforeRotation[5];
        this.cube.r[2] = lBeforeRotation[8];
        this.cube.r[3] = lBeforeRotation[2];
        this.cube.r[4] = lBeforeRotation[4];
        this.cube.r[5] = lBeforeRotation[7];
        this.cube.r[6] = lBeforeRotation[0];
        this.cube.r[7] = lBeforeRotation[3];
        this.cube.r[8] = lBeforeRotation[6];
        return this;
    }

    U() {}
    u() {}

    D() {}
    d() {}

    F() {}
    f() {}

    B() {}
    b() {}
}

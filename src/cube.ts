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

        const lBeforeRotation = [...this.cube.l];
        this.cube.l[0] = lBeforeRotation[6];
        this.cube.l[1] = lBeforeRotation[3];
        this.cube.l[2] = lBeforeRotation[0];
        this.cube.l[3] = lBeforeRotation[7];
        this.cube.l[4] = lBeforeRotation[4];
        this.cube.l[5] = lBeforeRotation[1];
        this.cube.l[6] = lBeforeRotation[8];
        this.cube.l[7] = lBeforeRotation[5];
        this.cube.l[8] = lBeforeRotation[2];
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

        const lBeforeRotation = [...this.cube.l];
        this.cube.l[0] = lBeforeRotation[2];
        this.cube.l[1] = lBeforeRotation[5];
        this.cube.l[2] = lBeforeRotation[8];
        this.cube.l[3] = lBeforeRotation[2];
        this.cube.l[4] = lBeforeRotation[4];
        this.cube.l[5] = lBeforeRotation[7];
        this.cube.l[6] = lBeforeRotation[0];
        this.cube.l[7] = lBeforeRotation[3];
        this.cube.l[8] = lBeforeRotation[6];
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

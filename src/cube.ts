// https://ruwix.com/online-rubiks-cube-solver-program/

interface CubePositions {
    [index: string]: number[];
    f: number[];
    l: number[];
    r: number[];
    b: number[];
    u: number[];
    d: number[];
}

class Cube {
    cube: CubePositions;
    constructor() {
        this.cube = {
            // front
            f: [0, 0, 0,
                0, 0, 0,
                0, 0, 0],
            // left
            l: [1, 1, 1,
                1, 1, 1,
                1, 1, 1],
            // right
            r: [2, 2, 2,
                2, 2, 2,
                2, 2, 2],
            // back
            b: [3, 3, 3,
                3, 3, 3,
                3, 3, 3],
            // up
            u: [4, 4, 4,
                4, 4, 4,
                4, 4, 4],
            // down
            d: [5, 5, 5,
                5, 5, 5,
                5, 5, 5],
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
    l() {}

    R() {}
    r() {}

    U() {}
    u() {}

    D() {}
    d() {}

    F() {}
    f() {}

    B() {}
    b() {}
}

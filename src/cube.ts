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
            f: [0, 0, 0,
                0, 0, 0,
                0, 0, 0],
            l: [1, 1, 1,
                1, 1, 1,
                1, 1, 1],
            r: [2, 2, 2,
                2, 2, 2,
                2, 2, 2],
            b: [3, 3, 3,
                3, 3, 3,
                3, 3, 3],
            u: [4, 4, 4,
                4, 4, 4,
                4, 4, 4],
            d: [5, 5, 5,
                5, 5, 5,
                5, 5, 5],
        };
    }

    L() {}
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

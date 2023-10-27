export function getRandomInteger(min: number, max: number): number {
    return Math.floor((max - min) * Math.random()) + min;
}

export function getRandomIntegers(min: number, max: number, num: number): number[] {
    const output: number[] = [];
    for (let i = 0; i < num; i++) {
        output.push(Math.floor((max - min) * Math.random()) + min);
    }
    return output;
}

export function assertPositiveInteger(x: number, name: string) {
    if (!Number.isInteger(x)) {
        throw new Error(`Expected ${name} to be an integer. Got ${x}`);
    }
    if (!(x > 0)) {
        throw new Error(`Expected ${name} to be a positive integer. Got ${x}`);
    }
}
import * as tf from '@tensorflow/tfjs';

export class ReplayMemory {
    maxLen: number;
    buffer: any[];
    index: number;
    length: number;
    private bufferIndices: number[];

    constructor(maxLen: number) {
        this.maxLen = maxLen;
        this.buffer = [];
        this.index = 0;
        this.length = 0;
        this.bufferIndices = [];
    }
    append(item: any): void {
        if (this.index === this.buffer.length && this.index < this.maxLen) {
            this.bufferIndices.push(this.index);
            this.buffer.push(item);
        }
        else {
            this.buffer[this.index] = item;
        }
        this.length = this.buffer.length;
        if (this.index === this.maxLen) {
            this.index = 0;
        }
        else {
            this.index += 1;
        }
    }
    sample(batchSize: number): any[] {
        if (batchSize > this.maxLen) {
            throw new Error(`batchSize ${batchSize} exceeds buffer length ${this.maxLen}`);
        }
        tf.util.shuffle(this.bufferIndices);
        const out = [];
        for (let i = 0; i < batchSize; i++) {
            out.push(this.buffer[this.bufferIndices[i]]);
        }
        return out;
    }
}
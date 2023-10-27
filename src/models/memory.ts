import * as tf from '@tensorflow/tfjs';

export class ReplayMemory {
    maxLen: number;
    buffer: any[];
    index: number;
    length: number;
    bufferIndices_: number[];

    constructor(maxLen: number) {
        this.maxLen = maxLen;
        this.buffer = [];
        for (let i = 0; i < maxLen; i++) {
            this.buffer.push(null);
        }
        this.index = 0;
        this.length = 0;
        this.bufferIndices_ = [];
        for (let i = 0; i < maxLen; i++) {
            this.bufferIndices_.push(i);
        }
    }
    append(item: any): void {
        this.buffer[this.index] = item;
        this.length = Math.min(this.length + 1, this.maxLen);
        this.index = (this.index + 1) % this.maxLen;
    }
    sample(batchSize: number): any[] {
        if (batchSize > this.maxLen) {
            throw new Error(`batchSize ${batchSize} exceeds buffer length ${this.maxLen}`);
        }
        tf.util.shuffle(this.bufferIndices_);
        const out = [];
        for (let i = 0; i < batchSize; i++) {
            out.push(this.buffer[this.bufferIndices_[i]]);
        }
        return out;
    }
}
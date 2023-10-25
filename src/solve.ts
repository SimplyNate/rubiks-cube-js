import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

export function model() {
    const m = tf.sequential();
    m.add(tf.layers.dense({units: 1, inputShape: [1]}));
    m.compile({loss: 'meanSquaredError', optimizer: 'sgd'});
}
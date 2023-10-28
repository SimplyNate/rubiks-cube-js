import * as tf from '@tensorflow/tfjs';

export function createDQN(h: number, w: number, numActions: number): tf.Sequential {
    if (!(Number.isInteger(h) && h > 0)) {
        throw new Error(`Expected height to be a positive integer. Got ${h}`);
    }
    if (!(Number.isInteger(w) && w > 0)) {
        throw new Error(`Expected width to be a positive integer. Got ${w}`);
    }
    if (!(Number.isInteger(numActions) && numActions > 1)) {
        throw new Error(`Expected numActions to be positive integer > 1. Got ${numActions}`);
    }
    const model = tf.sequential();
    model.add(tf.layers.conv2d({
        filters: 128,
        kernelSize: 3,
        strides: 1,
        activation: 'relu',
        inputShape: [h, w, 2],
    }));
    model.add(tf.layers.batchNormalization());
    model.add(tf.layers.conv2d({
        filters: 256,
        kernelSize: 3,
        strides: 1,
        activation: 'relu',
    }));
    model.add(tf.layers.batchNormalization());
    model.add(tf.layers.conv2d({
        filters: 256,
        kernelSize: 3,
        strides: 1,
        activation: 'relu',
    }));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({units: 100, activation: 'relu'}))
    model.add(tf.layers.dropout({rate: 0.25}));
    model.add(tf.layers.dense({units: numActions}));
    return model;
}

export function copyWeights(destNetwork: tf.LayersModel, srcNetwork: tf.LayersModel) {
    let originalDestNetworkTrainable: boolean | null = null;
    if (destNetwork.trainable !== srcNetwork.trainable) {
        originalDestNetworkTrainable = destNetwork.trainable;
        destNetwork.trainable = srcNetwork.trainable;
    }
    destNetwork.setWeights(srcNetwork.getWeights());
    if (originalDestNetworkTrainable != null) {
        destNetwork.trainable = originalDestNetworkTrainable;
    }
}
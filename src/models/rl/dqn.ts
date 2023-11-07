import * as tf from '@tensorflow/tfjs';

export function createDQN(faces: number, area: number, numActions: number): tf.Sequential {
    if (!(Number.isInteger(faces) && faces > 0)) {
        throw new Error(`Expected faces to be a positive integer. Got ${faces}`);
    }
    if (!(Number.isInteger(area) && area > 0)) {
        throw new Error(`Expected area to be a positive integer. Got ${area}`);
    }
    if (!(Number.isInteger(numActions) && numActions > 1)) {
        throw new Error(`Expected numActions to be positive integer > 1. Got ${numActions}`);
    }
    const model = tf.sequential();
    model.add(tf.layers.dense({
        units: 54,
        inputShape: [faces, area],
    }));
    model.add(tf.layers.batchNormalization());
    model.add(tf.layers.dense({
        units: 216,
        activation: 'relu',
    }));
    model.add(tf.layers.batchNormalization());
    model.add(tf.layers.dense({
        units: 216,
        activation: 'relu'
    }));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({units: 108, activation: 'relu'}))
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
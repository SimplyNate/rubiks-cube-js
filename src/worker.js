import { Trainer } from './models/rl/train.js';

onmessage = function(e) {
    console.log('Starting Trainer');
    const trainer = new Trainer(e.data);
    const promise = trainer.train();
    const interval = setInterval(() => {
        postMessage({
            totalFrames: trainer.totalFrames,
            averageReward100: trainer.averageReward100,
            bestReward100: trainer.bestReward100,
            epsilon: trainer.agent.epsilon,
            fps: trainer.fps,
        });
    }, 1000);
    promise.finally(() => {
        clearInterval(interval);
    });
}
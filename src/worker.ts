import { Trainer } from './models/rl/train.js';

onmessage = function(e) {
    console.log('Starting Trainer');
    const trainer = new Trainer(e.data);
    const promise = trainer.train();
    const interval = setInterval(() => {
        postMessage({currentReward: trainer.currentReward, bestReward: trainer.bestReward});
    }, 100);
}
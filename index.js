import { FifoQueue } from './fifo.js';

const fifo = new FifoQueue('mojakolejka');
await fifo.init();
// const newElement = fifo.createQueueElement();

// fifo.push_head();
console.log(await fifo.getElements());
await fifo.remove(); //clearing fifo for dev purposes

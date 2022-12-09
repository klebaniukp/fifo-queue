import { FifoQueue } from './fifo.js';

const fifo = new FifoQueue('Mark');
await fifo.init();
// const newElement = fifo.createQueueElement();

await fifo.push_head('Siemano');
console.log(await fifo.getElements());
await fifo.remove(); //clearing fifo for dev purposes

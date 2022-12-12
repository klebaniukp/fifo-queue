import { FifoQueue } from './fifo.js';

const fifo = new FifoQueue('Mark');

await fifo.push_head('1 element');
await fifo.push_head('2 element');
await fifo.push_head('3 element');
await fifo.push_head('4 element');

import { FifoQueue } from './fifo.js';

const queue = new FifoQueue('Mark');
const button = document.querySelector('#get-data');

button.addEventListener('click', async () => {
    console.log(await queue.getAllValuesForElement(2));
});

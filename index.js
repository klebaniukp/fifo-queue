import { FifoQueue } from './fifo.js';

const queue = new FifoQueue('Mark');

const idInput = document.querySelector('#elementid');
let id = 0;

// GET ELEMENT FROM LOCALFORAGE BY ID
idInput.addEventListener('focusout', () => {
    id = idInput.value;
});

document.querySelector('#get-element').addEventListener('click', async () => {
    const value = await queue.getAllValuesForElement(id);
    document.querySelector(
        '#get-element-output',
    ).innerHTML = `Output: ${JSON.stringify(value)}`;
});

const push_headInput = document.querySelector('#element-value');
let pushValue = push_headInput.value;

push_headInput.addEventListener('focusout', () => {
    console.log(push_headInput.value);
    pushValue = push_headInput.value;
});

document.querySelector('#push_head').addEventListener('click', async () => {
    console.log(pushValue);
    await queue.push_head(pushValue);
});

document.querySelector('#pop_tail').addEventListener('click', async () => {
    document.querySelector(
        '#pop_tail-output',
    ).innerHTML = `Output: ${await queue.pop_tail()}`;
});

document.querySelector('#tail').addEventListener('click', async () => {
    document.querySelector(
        '#tail-output',
    ).innerHTML = `Output: ${await queue.tail()}`;
});

document.querySelector('#head').addEventListener('click', async () => {
    document.querySelector(
        '#head-output',
    ).innerHTML = `Output: ${await queue.head()}`;
});

document.querySelector('#clear').addEventListener('click', async () => {
    console.log('clearing');
    await queue.clear();
});

export class FifoQueue {
    constructor(queueName) {
        this.queueName = queueName;
        this.head = null;
        this.tail = null;
    }

    async init() {
        if (!(await this.isQueueAlreadyCreated())) {
            localforage.setItem(this.queueName, {});
        }
        await this.setHeadAndTail();
    }

    async setHeadAndTail() {
        this.head = await this.getValueFromStorage('Head');
        this.tail = await this.getValueFromStorage('Tail');
    }

    async setKeyInStorage(keyElement = '', value) {
        const fullKey = this.queueName + keyElement;

        await localforage.setItem(fullKey, value);
    }

    async getValueFromStorage(keyElement = '') {
        const fullKey = this.queueName + keyElement;
        const response = await localforage.getItem(fullKey);

        if (response != null) {
            return response;
        } else {
            return null;
        }
    }

    async isQueueAlreadyCreated() {
        return (await localforage.getItem(this.queueName)) != null;
    }

    async push_head(value = '') {
        const id = await this.generateId();

        await this.setKeyInStorage(`Element-${id}-Next`, this.head);
        await this.setKeyInStorage(`Element-${id}-Prev`, '');
        await this.setKeyInStorage(`Element-${id}-Value`, value);

        await this.setKeyInStorage(
            `Element-${this.head}-Prev`,
            `${this.queueName}Element-${id}`,
        );

        if (this.tail === null) {
            await this.setKeyInStorage(
                'Tail',
                `${this.queueName}Element-${id}`,
            );
            await this.setHeadAndTail();
        }

        await this.setKeyInStorage('Head', `${this.queueName}Element-${id}`);
    }

    async getElements() {
        const head = await localforage.getItem(this.queueName + 'Head');
        const tail = await localforage.getItem(this.queueName + 'Tail');
        const lastIndex = await localforage.getItem(
            this.queueName + 'LastIndex',
        );

        return {
            head,
            tail,
            lastIndex,
        };
    }

    async generateId() {
        const lastIndexKeyName = this.queueName + 'LastIndex';

        const lastIndex = await localforage.getItem(lastIndexKeyName);
        if (lastIndex != null) {
            await this.setNewLastIndex(lastIndex);
            return lastIndex + 1;
        } else {
            await this.setNewLastIndex();
            return 1;
        }
    }

    async setNewLastIndex(lastIndex = 0) {
        await localforage.setItem(this.queueName + 'LastIndex', lastIndex + 1);
    }

    async remove() {
        await localforage.removeItem(this.queueName);
    }
}
// element:
// {
// "Name-x-value='some value'"
// "Name-x-next='id of next node'" //node id if exists
// "Name-x-prev='id of previous node'" //node id if exists
// }

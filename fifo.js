export class FifoQueue {
    constructor(queueName) {
        this.queueName = queueName;
        this.head = {};
        this.tail = {};
    }

    async init() {
        if (!(await this.isQueueAlreadyCreated())) {
            localforage.setItem(this.queueName, {});
        }
        this.head = await this.getValueFromStorage('Head');
        this.tail = await this.getValueFromStorage('Tail');
    }

    async getValueFromStorage(keyElement) {
        const fullKey = this.queueName + keyElement;
        const response = await localforage.getItem(fullKey);

        if (response != null) {
            return response;
        } else {
            return {};
        }
    }

    async isQueueAlreadyCreated() {
        return (await localforage.getItem(this.queueName)) != null;
    }

    // async push_head(value) {
    //     const coreName = this.queueName + '-' + (await this.generateId());
    //     const prev = '';
    //     // const  = await localforage.getItem(this.queueName);
    //     //edit current head to make his prev not empty
    // }

    async getElements() {
        return await localforage.getItem(this.queueName);
    }

    async generateId() {
        const lastIndexKeyName = this.queueName + this.tail;

        const lastIndex = await localforage.getItem(lastIndexKeyName);
        if (lastIndex != null) {
            return lastIndex;
        } else {
            return 1;
        }
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

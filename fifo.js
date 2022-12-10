export class FifoQueue {
    constructor(queueName) {
        this.queueName = queueName;
        this.head = null;
        this.tail = null;
        this.isInitialized = false;
        this.numberOfInitializeChecks = 0;
        this.init();
    }

    init() {
        Promise.resolve().then(async () => {
            await this.setQueue();
        });
    }

    async setQueue() {
        if (!(await this.isQueueAlreadyCreated())) {
            await localforage.setItem(this.queueName, 'Initialized');
        }
        this.isInitialized = true;
        await this.setHeadAndTail();
    }

    async isQueueAlreadyCreated() {
        return (await localforage.getItem(this.queueName)) != null;
    }

    async setHeadAndTail() {
        this.head = await this.getValueFromStorage('Head');
        console.log(this.head);
        this.tail = await this.getValueFromStorage('Tail');
    }

    checkInitializeState() {
        if (this.isInitialized === true) {
            this.numberOfInitializeChecks = 0;
            return true;
        } else {
            if (this.numberOfInitializeChecks >= 2) {
                throw new Error('The queue has not been initialized yet');
            }
            setTimeout(() => {
                this.numberOfInitializeChecks =
                    this.numberOfInitializeChecks + 1;
            }, 10);
        }
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

    async push_head(value = '') {
        try {
            this.checkInitializeState();
            const id = await this.generateId();

            await this.setKeyInStorage(
                `Element-${id}-Next`,
                this.head === null ? '' : this.head,
            );
            await this.setKeyInStorage(`Element-${id}-Prev`, '');
            await this.setKeyInStorage(`Element-${id}-Value`, value);

            await this.setKeyInStorage(
                `Element-${this.head}-Prev`,
                `${this.queueName}Element-${id}`,
            );

            console.log('Id', id);
            console.log('Next', this.head === null ? '' : this.head);
            console.log('Prev', ``);

            console.log(
                'Prev for another element',
                `${this.queueName}Element-${id}`,
            );

            if (this.tail === null) {
                await this.setKeyInStorage(
                    'Tail',
                    `${this.queueName}Element-${id}`,
                );
            }

            await this.setHeadAndTail();
            await this.setKeyInStorage(
                'Head',
                `${this.queueName}Element-${id}`,
            );
        } catch (error) {
            console.error(error);
        }
    }

    async getElements() {
        try {
            this.checkInitializeState();
            const head = await localforage.getItem(this.queueName + 'Head');
            const tail = await localforage.getItem(this.queueName + 'Tail');
            const lastIndex = await localforage.getItem(
                this.queueName + 'LastIndex',
            );
            await this.listAllElements(head);

            return {
                head,
                tail,
                lastIndex,
            };
        } catch (error) {
            console.error(error);
        }
    }

    // listing all elements head - tail
    async listAllElements(identifier = `${this.queueName}Element-1`) {
        try {
            this.checkInitializeState();
            const item = await localforage.getItem(`${identifier}-Value`);
            const nextItemId = await localforage.getItem(`${identifier}-Next`);
            console.log(nextItemId);
            console.log(`Id: ${identifier}, Value: ${item}`);
            if (nextItemId === '') {
                return 0;
            }
            await this.listAllElements(nextItemId);
        } catch (error) {
            console.error(error);
        }
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

    async clear() {
        await localforage.clear();
    }
}
// element:
// {
// "Name-x-value='some value'"
// "Name-x-next='id of next node'" //node id if exists
// "Name-x-prev='id of previous node'" //node id if exists
// }

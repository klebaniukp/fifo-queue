export class FifoQueue {
    constructor(queueName) {
        // Name for queue
        this.queueName = queueName;

        // keys for head and tail
        this.headPointer = null;
        this.tailPointer = null;

        // field for checking if queue is initialized bcs constructor had to use asynchronous method
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
        await this.setHeadAndTail();
        this.isInitialized = true;
    }

    async setHeadAndTail() {
        this.headPointer = await this.getValueFromStorage('Head');
        this.tailPointer = await this.getValueFromStorage('Tail');
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
                this.headPointer === null ? '' : this.headPointer,
            );
            await this.setKeyInStorage(`Element-${id}-Prev`, '');
            await this.setKeyInStorage(`Element-${id}-Value`, value);

            if (this.tailPointer === null) {
                await this.setKeyInStorage(
                    'Tail',
                    `${this.queueName}Element-${id}`,
                );
            }

            await this.setKeyInStorage(
                'Head',
                `${this.queueName}Element-${id}`,
            );
            await this.setHeadAndTail();
        } catch (error) {
            console.error(error);
        }
    }

    async pop_tail() {
        try {
            this.checkInitializeState();

            const tailElement = await this.getValueFromStorage('Tail');
            const tailElementPrev = await localforage.getItem(
                `${tailElement}-Prev`,
            );

            await localforage.setItem(`${tailElementPrev}-Next`, '');

            if (this.headPointer === this.tailPointer) {
                await localforage.removeItem(`${this.queueName}Head`);
                await localforage.removeItem(`${this.queueName}Tail`);
            }

            await localforage.removeItem(tailElement);
            await this.setKeyInStorage('Tail', tailElementPrev);
            await this.setHeadAndTail();

            return tailElement;
        } catch (error) {
            console.error(error);
        }
    }

    async head() {
        try {
            this.checkInitializeState();
            return await localforage.getItem(this.queueName + 'Head');
        } catch (error) {
            console.error(error);
        }
    }

    async tail() {
        try {
            this.checkInitializeState();
            return await localforage.getItem(this.queueName + 'Tail');
        } catch (error) {
            console.error(error);
        }
    }

    async getAllValuesForElement(id) {
        const prev = await this.getValueFromStorage(`Element-${id}-Prev`);
        const next = await this.getValueFromStorage(`Element-${id}-Next`);
        const value = await this.getValueFromStorage(`Element-${id}-Value`);

        return {
            id,
            keyName: `${this.queueName}Element-${id}`,
            prev,
            next,
            value,
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

    async clear() {
        await localforage.clear();
    }
}

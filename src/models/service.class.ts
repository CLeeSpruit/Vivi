import { ApplicationListener, Listener } from '../events';

export abstract class Service {
    listeners: Array<Listener | ApplicationListener> = new Array<Listener | ApplicationListener>();

    constructor() {
        //
    }

    load() {
        // Placeholder
    }

    destroy() {
        this.listeners.forEach(listener => {
            listener.remove();
        });
    }
}
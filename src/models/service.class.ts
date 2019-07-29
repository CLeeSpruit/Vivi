import { ApplicationListener } from '@events/application-listener.class';
import { Listener } from '@events/listener.class';

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
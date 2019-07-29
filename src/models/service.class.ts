import { Listener } from '@system/events/listener.class';
import { ApplicationListener } from '@system/events/application-listener.class';

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
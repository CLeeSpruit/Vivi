import * as uuid from 'uuid';
import { ApplicationListener, Listener } from '../events';

export abstract class Service {
    id: string;
    listeners: Array<Listener | ApplicationListener> = new Array<Listener | ApplicationListener>();

    constructor() {
        this.id = uuid();
    }

    destroy() {
        this.listeners.forEach(listener => {
            listener.remove();
        });
    }
}
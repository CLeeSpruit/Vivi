import { ApplicationListener, Listener } from '../events';

export abstract class Service {
    id: string;
    listeners: Array<Listener | ApplicationListener> = new Array<Listener | ApplicationListener>();

    setData(id: number) {
        this.id = `${this.constructor.name}-${id}`;
    }

    destroy() {
        this.listeners.forEach(listener => {
            listener.remove();
        });
    }
}
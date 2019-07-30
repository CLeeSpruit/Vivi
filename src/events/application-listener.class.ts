import { Observable, Subscription } from 'rxjs';
import { ApplicationEvent } from './';

export class ApplicationListener {
    private subscription: Subscription;

    constructor(
        private eventName: string,
        callback: (event: ApplicationEvent) => any,
        obs: Observable<ApplicationEvent>,
        options?: { emitEvent: boolean }
    ) {
        const cb = (event: ApplicationEvent) => {
            if (event.closeOnComplete) {
                this.close();
            }

            if (options && options.emitEvent) {
                callback(event);
            } else {
                callback(event.data);
            }
        };

        this.subscription = obs.subscribe(cb);
    }

    // Alias for close to make it work better with the Listener class
    remove() {
        this.close();
    }

    close() {
        this.subscription.unsubscribe();
    }
}
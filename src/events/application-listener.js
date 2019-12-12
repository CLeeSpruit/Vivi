class ApplicationListener {
    subscription;

    constructor(
        eventName,
        callback,
        obs,
        options
    ) {
        const cb = (event) => {
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

    remove() {
        this.close();
    }

    close() {
        this.subscription.unsubscribe();
    }
}
exports.default = ApplicationListener;
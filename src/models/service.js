export class Service {
    id;
    listeners = new Array();

    setData(id) {
        this.id = `${this.constructor.name}-${id}`;
    }

    destroy() {
        this.listeners.forEach(listener => {
            listener.remove();
        });
    }
}
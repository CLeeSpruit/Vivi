export class Service {
	constructor() {
		this.listeners = [];
	}

	setData(id) {
		this.id = `${this.constructor.name}-${id}`;
	}

	destroy() {
		this.listeners.forEach(listener => {
			listener.remove();
		});
	}
}

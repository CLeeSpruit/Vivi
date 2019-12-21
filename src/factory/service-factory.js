export class ServiceFactory {
	constructor(constructor, prerequisitesArr) {
		this.prerequisites = new Map();
		this.instances = new Map();
		this.counter = 1;
		this.serviceConstructor = constructor;
		if (prerequisitesArr) {
			prerequisitesArr.forEach(prereq => {
				this.prerequisites.set(prereq.constructor.name, prereq);
			});
		}

		this.create();
	}

	create() {
		const service = new this.serviceConstructor(...[...this.prerequisites.values()].map(pre => pre.get())); // eslint-disable-line new-cap
		service.setData(this.counter);
		this.counter++;
		this.instances.set(service.id, service);

		return service;
	}

	get(id) {
		if (id) {
			return this.instances.get(id);
		}

		return [...this.instances.values()][this.instances.size - 1] || null;
	}

	destroy(id) {
		const service = this.get(id);
		// Run cleanup
		service.destroy();

		// Remove from the map
		this.instances.delete(id);
	}

	destroyAll() {
		this.instances.forEach(service => this.destroy(service.id));
	}
}

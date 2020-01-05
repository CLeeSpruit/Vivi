export class Factory {
	/**
     *Creates an instance of Factory.
     * @param {Function} constructorFn - Constructor to be called on create
	 * @param {FactoryService} factoryService - FactoryService to be injected in instances
	 * @param {Array<string>} [prerequisites] - Prerequisites to be injected in instances
     * @memberof Factory
     */
	constructor(constructorFn, factoryService, prerequisites) {
		this.counter = 1;
		this.construct = constructorFn;
		this.instances = new Map();
		this.factoryService = factoryService;
		this.prerequisites = prerequisites || [];
	}

	create(data) {
		const instance = new this.construct(this.factoryService); // eslint-disable-line new-cap
		instance.setData(this.counter, data, this.prerequisites);
		this.counter++;
		this.instances.set(instance.id, instance);

		return instance;
	}

	/**
     *Returns an instance from the Factory
     *
     * @param {string} [id] - Optional
     * @returns Instance from the Factory that matches the id or latest created if no id is provided
     * @memberof Factory
     */
	get(id) {
		if (id) {
			const instance = this.instances.get(id);
			if (instance) {
				return instance;
			}

			console.error(`${this.construct.name}: No instance found with id: ${id}`);
			return;
		}

		return [...this.instances.values()][this.instances.size - 1] || null;
	}

	/**
     *Removes the instance from the Map and runs the destroy hook for that instance
     *
     * @param {string} id
     * @memberof Factory
     */
	destroy(id) {
		const instance = this.get(id);
		if (!instance) {
			return;
		}

		// Run cleanup
		instance.destroy();

		// Remove from the map
		this.instances.delete(id);
	}

	/**
     *Runs destroy for all instances
     *
     * @memberof Factory
     */
	destroyAll() {
		this.instances.forEach(instance => this.destroy(instance.id));
	}
}
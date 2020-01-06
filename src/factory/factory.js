import {Service} from '../models/service';
import {Component} from '../models/component';
import {Instance} from '../models/instance';
import {FactoryService} from '../services/factory.service';

/**
 * Parent class for ServiceFactory and ComponentFactory. Can create generic instances.
 *
 * @export
 * @class Factory
 */
export class Factory {
	/**
	 * Creates an instance of Factory.
	 *
	 * @param {Function} constructorFn - Constructor to be called on create
	 * @param {FactoryService} factoryService - FactoryService to be injected in instances
	 * @memberof Factory
	 */
	constructor(constructorFn, factoryService) {
		this.counter = 1;
		this.construct = constructorFn;
		this.instances = new Map();
		this.factoryService = factoryService;
	}

	/**
	 * Creates an instance of the instance/component/service
	 *
	 * @param {*} [data] - Data to be passed to instance
	 * @returns {Component|Service|Instance} - Returns resulting instance
	 * @memberof Factory
	 */
	create(data) {
		const instance = new this.construct(this.factoryService); // eslint-disable-line new-cap
		instance.setData(this.counter, data);
		this.counter++;
		this.instances.set(instance.id, instance);

		return instance;
	}

	/**
	 *Returns an instance from the Factory
	 *
	 * @param {string} [id] - Optional
	 * @returns {Component|Service|Instance} - Instance from the Factory that matches the id or latest created if no id is provided
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
	 * @param {string} id - Id of componet to be destroyed
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

import {FactoryService} from '../services/factory.service';

/**
 * Generic instance of code. Base class for services and components.
 *
 * @class Instance
 */
export class Instance {
	/**
	 * Creates an instance of Instance.
	 *
	 * @param {FactoryService} factoryService - FactoryService to be injected into the instance
	 * @memberof Instance
	 */
	constructor(factoryService) {
		this.factoryService = factoryService;
	}

	/**
	 * Assigns id, data, and sets any prereqs that are needed before loading
	 *
	 * @param {number} id - Id # of instance
	 * @param {*} [data] - Data to be passed to instance
	 * @memberof Instance
	 */
	setData(id, data) {
		this.data = data || {};
		this.id = `${this.constructor.name}-${id}`;
	}

	/**
	 *Placeholder for load hook function. If a component, will run after DOM loads. If service, will run after constructor.
	 *
	 * @memberof Instance
	 */
	load() {}
}

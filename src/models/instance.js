import {FactoryService} from '../services/factory.service';
import {Service} from './models';

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
	 * @param {Array<string | Service>} [prereqs] - Services to be injected before load
	 * @memberof Instance
	 */
	setData(id, data, prereqs) {
		this.data = data || {};
		this.id = `${this.constructor.name}-${id}`;
		if (prereqs) {
			prereqs.forEach(req => {
				let propName = typeof req === 'string' ? req : req.name;
				propName = propName[0].toLowerCase + propName.slice(1);
				this[propName] = this.factoryService.getFactory(req);
			});
		}
	}

	/**
	 *Placeholder for load hook function. If a component, will run after DOM loads. If service, will run after constructor.
	 *
	 * @memberof Instance
	 */
	load() {}
}

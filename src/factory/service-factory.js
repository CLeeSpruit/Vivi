import {Factory} from './factory';

export class ServiceFactory extends Factory {
	/**
	 *Creates an instance of ServiceFactory.
	 * @param {Function} constructorFn
	 * @param {FactoryService} factoryService
	 * @param {Array<Service>} prerequisitesArr
	 * @memberof ServiceFactory
	 */
	constructor(constructorFn, factoryService, prerequisitesArr) {
		super(constructorFn, factoryService, prerequisitesArr);
		this.create();
	}
}

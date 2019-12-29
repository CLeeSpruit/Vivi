import {Factory} from './factory';

export class ServiceFactory extends Factory {
	/**
	 *Creates an instance of ServiceFactory.
	 * @param {Function} constructorFn
	 * @param {Array<Service>} prerequisitesArr
	 * @memberof ServiceFactory
	 */
	constructor(constructorFn, prerequisitesArr) {
		super(constructorFn, prerequisitesArr);
		this.create();
	}
}

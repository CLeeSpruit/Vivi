import {Service} from '../models/service';
import {FactoryService} from '../services/factory.service';
import {Factory} from './factory';

export class ServiceFactory extends Factory {
	/**
	 *Creates an instance of ServiceFactory.
	 *
	 * @param {Service} constructorFn - Service to be created on create Fn
	 * @param {FactoryService} factoryService - FactoryService to be injected in service
	 * @param {Array<Service>} [prerequisitesArr] - Prereqs for service to load
	 * @memberof ServiceFactory
	 */
	constructor(constructorFn, factoryService, prerequisitesArr) {
		super(constructorFn, factoryService, prerequisitesArr);
		this.create();
	}
}

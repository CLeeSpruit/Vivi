import {Service} from '../models/service';
import {FactoryService} from '../services/factory.service';
import {Factory} from './factory';

export class ServiceFactory extends Factory {
	/**
	 *Creates an instance of ServiceFactory.
	 *
	 * @param {Service} constructorFn - Service to be created on create Fn
	 * @param {FactoryService} factoryService - FactoryService to be injected in service
	 * @memberof ServiceFactory
	 */
	constructor(constructorFn, factoryService) {
		super(constructorFn, factoryService);
		this.create();
	}
}

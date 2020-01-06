import {Factory} from '../factory/factory';
import {ServiceFactory} from '../factory/service-factory';
import {ComponentFactory} from '../factory/component-factory';
import {ModuleFactory} from '../factory/module-factory';
import {Component, Service, Instance} from '../models';

// FactoryService is special and cannot inherit Service, despite the name.
export class FactoryService {
	/**
	 * Creates an instance of FactoryService.
	 *
	 * @param {ModuleFactory} module - Required instance of ModuleFactory
	 * @memberof FactoryService
	 */
	constructor(module) {
		if (!module) {
			throw new Error('Module is Required');
		}

		this.module = module;
	}

	/**
	 * Returns component, service, or instance. Id is optional.
	 * Wrapper around ModuleFactory.get() Fn
	 *
	 * @param {Component|Service|Instance|string} con - Instance to be fetched
	 * @param {string} [id] - Id of instance to be fetched
	 * @returns {Component|Service|Instance} - Instance, if found. Will grab last created if no id is provided.
	 * @memberof FactoryService
	 */
	get(con, id) {
		return this.module.get(con, id);
	}

	/**
	 * Returns componentFactory, serviceFactory, or factory.
	 * Wrapper around ModuleFactory.get() Fn
	 *
	 * @param {Component|Service|Instance|string} con - Instance to fetch the factory for
	 * @returns {ComponentFactory|ServiceFactory|Factory} - Factory of instance, if found
	 * @memberof FactoryService
	 */
	getFactory(con) {
		return this.module.getFactory(con);
	}
}

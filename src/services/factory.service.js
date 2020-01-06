/**
 * Interface for ModuleFactory. Provides an easy way for components and services to grab other components and services.
 * Note: FactoryService is special and cannot inherit Service, despite the name.
 *
 * @class FactoryService
 * @todo Move to factory folder and rename to something other than "FactoryService" as the name is confusing with other services.
 * @body Optional this service might be superfluous and the module itself can be injected into the instances
 */
export class FactoryService {
	/**
	 * Creates an instance of FactoryService.
	 *
	 * @param {*} module - Required instance of ModuleFactory
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
	 * @param {string} con - Instance to be fetched
	 * @param {string} [id] - Id of instance to be fetched
	 * @returns {*} - Instance, if found. Will grab last created if no id is provided.
	 * @memberof FactoryService
	 */
	get(con, id) {
		return this.module.get(con, id);
	}

	/**
	 * Returns componentFactory, serviceFactory, or factory.
	 * Wrapper around ModuleFactory.get() Fn
	 *
	 * @param {string} con - Instance to fetch the factory for
	 * @returns {*} - Factory of instance, if found
	 * @memberof FactoryService
	 */
	getFactory(con) {
		return this.module.getFactory(con);
	}
}

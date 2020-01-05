// FactoryService is special and cannot inherit Service, despite the name.
export class FactoryService {
	/**
	 *Creates an instance of FactoryService.
	 * @param {ModuleFactory} module
	 * @memberof FactoryService
	 */
	constructor(module) {
		this.module = module;
	}

	/**
	 *Returns component, service, or instance. Id is optional.
	 *
	 * @param {Component|Service|Instance} con
	 * @param {string} [id]
	 * @returns {Component|Service|Instance}
	 * @memberof FactoryService
	 */
	get(con, id) {
		return this.module.get(con, id);
	}

	/**
	 *Returns component, service, or instance searched by name string. Id is optional.
	 *
	 * @param {string} name
	 * @param {string} [id]
	 * @returns {Component|Service|Instance}
	 * @memberof FactoryService
	 */
	getByString(name, id) {
		return this.module.getFactoryByString(name).get(id);
	}

	/**
	 *Returns componentFactory, serviceFactory, or factory.
	 *
	 * @param {Component|Service|Instance} con
	 * @param {string} [id]
	 * @returns {ComponentFactory|ServiceFactory|Factory}
	 * @memberof FactoryService
	 */
	getFactory(con) {
		return this.module.getFactory(con);
	}

	/**
	 *Returns componentFactory, serviceFactory, or factory.
	 *
	 * @param {string} name
	 * @param {string} [id]
	 * @returns {ComponentFactory|ServiceFactory|Factory}
	 * @memberof FactoryService
	 */
	getFactoryByString(name) {
		return this.module.getFactoryByString(name);
	}
}

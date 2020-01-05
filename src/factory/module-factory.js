import {mapFilter, mapToArray} from '../helpers/array-like-map';
import {loadViviServices} from '../services/load-services.static';
import {NodeTreeService} from '../services/node-tree.service';
import {ServiceFactory} from './service-factory';
import {ComponentFactory} from './component-factory';
import {Factory} from './factory';

/**
 * Module Factory - Initial Constructor for the Vivi Framework
 *
 * @export
 * @class ModuleFactory
 */
export class ModuleFactory {
	/**
	 * Creates an instance of ModuleFactory.
	 *
	 * @param {{componentConstructors: Array<Component>, serviceConstructors: Array<Service>, rootComponent: Component}} module
	 * @memberof ModuleFactory
	 */
	constructor(module) {
		this.instances = new Map();
		// @todo Replace instances of window.vivi with an injected version
		window.vivi = this;

		// Append Vivi services - these should be before any custom services
		if (module.serviceConstructors) {
			module.serviceConstructors = [...loadViviServices(), ...module.serviceConstructors];
		} else {
			module.serviceConstructors = loadViviServices();
		}

		// Init Services
		// @todo: Automatically load services in the services folder
		module.serviceConstructors.forEach(serviceConstructor => {
			let prereqArr = [];
			if (serviceConstructor.prereqArr) {
				prereqArr = serviceConstructor.prereqArr.map(prereq => {
					// @todo: Services - Throw a specific warning to the user telling them about a missing service
					return this.instances.get(prereq.name);
				});
			}

			this.services.set(serviceConstructor.constructor.name, new ServiceFactory(serviceConstructor.constructor, prereqArr));
		});

		// NodeTree is needed to inject into Factory
		const nodeTree = this.get(NodeTreeService);

		// Init Components
		// @todo: Automatically load components in the components folder
		module.componentConstructors.forEach(constructor => {
			let serviceArr = [];
			if (constructor.services) {
				serviceArr = constructor.services.map(service => {
					// @todo: Components - Throw a specific warning to the user telling them about a missing service
					return this.instances.get(service.name);
				});
			}

			this.instances.set(constructor.constructor.name, new ComponentFactory(constructor.constructor, serviceArr, nodeTree));
		});

		// Mount root component
		const rootFactory = this.getFactory(module.rootComponent);
		// @todo Add ability to make root component append to a user-specified node
		rootFactory.createRoot(nodeTree);

		// Initialize
		this.start();
	}

	/**
	 *Creates a Component or Service factory
	 *
	 * @param {Service|Component} constructor
	 * @returns {ServiceFactory|ComponentFactory|Factory}
	 * @memberof ModuleFactory
	 */
	createFactory(constructor) {
		let factory;
		const matches = name.match(/(.*)(Component|Service)$/);
		if (matches && matches[2] && matches[2] === 'Service') {
			factory = new ServiceFactory(constructor);
		} else if (matches && matches[2] && matches[2] === 'Component') {
			factory = new ComponentFactory(constructor, this.get(NodeTreeService));
		} else {
			factory = new Factory();
		}

		this.instances.set(constructor.name, factory);

		return factory;
	}

	/**
	 * Fetches a service or component from the constructor. If an id is not specified, it'll grab the last instance of that service or component.
	 *
	 * @param {Service | Component} constructor
	 * @returns If an id is specified, that component/service instance. Otherwise the last created instance of that service/component
	 * @memberof ModuleFactory
	 */
	get(constructor, id) {
		return this.getFactory(constructor).get(id);
	}

	/**
	 * Fetches a service factory or component factory from the service or component constructor
	 *
	 * @param {Service | Component} constructor
	 * @returns If found, ServiceFactory or ComponentFactory of component/service
	 * @memberof ModuleFactory
	 */
	getFactory(constructor) {
		const name = constructor;
		return this.getFactoryByString(name);
	}

	/**
	 * Fetches a service factory or component factory from a string
	 *
	 * @param {string} name - Name of the component. Ex: 'MyCoolComponent'
	 * @returns If found, ServiceFactory or ComponentFactory of component/service
	 * @memberof ModuleFactory
	 */
	getFactoryByString(name) {
		const instance = this.instances.get(name);
		if (instance) {
			return instance;
		}

		console.error('No service factory or component factory found for ' + name);
		console.trace();
	}

	/**
	 * Returns all component names registered in an array
	 *
	 * @returns {Array<string>}
	 * @memberof ModuleFactory
	 */
	getComponentRegistry() {
		return mapToArray(mapFilter(this.instances, value => value instanceof ComponentFactory));
	}

	/**
	 * Placeholder event loop for any code to be run immediately after Vivi has finished initalizing
	 *
	 * @memberof ModuleFactory
	 */
	start() {}
}

import {NodeTreeService} from '../services';
import {Factory} from './factory';

export class ComponentFactory extends Factory {
	/**
	 *Creates an instance of ComponentFactory.
	 * @param {Function} constructorFn
	 * @param {NodeTreeService} factoryService
	 * @param {Array<Service>} services
	 * @memberof ComponentFactory
	 */
	constructor(
		constructorFn,
		factoryService,
		services
	) {
		super(constructorFn, factoryService, services);
		this.nodeTreeService = this.factoryService.get(NodeTreeService);
	}

	/**
	 *Sets the root component
	 *
	 * @param {NodeTreeService} nodeTreeService
	 * @memberof ComponentFactory
	 */
	createRoot(nodeTreeService) {
		this.nodeTreeService = nodeTreeService;
		const comp = this.create(null, null, {parentEl: document.body, doNotLoad: true, isRoot: true});
		this.nodeTreeService.setRoot(comp);
		this.nodeTreeService.applicationTree.load();
	}

	/**
	 *Creates a component
	 *
	 * @param {Component} parent
	 * @param {*} data
	 * @param {*} options
	 * @returns Component
	 * @memberof ComponentFactory
	 */
	create(parent, data, options) {
		const component = super.create(data);

		// Set nodes
		let node;
		if (!options || !options.isRoot) {
			node = this.nodeTreeService.addComponent(parent, component);
		}

		if (options && options.parentEl) {
			component.append(options.parentEl, options.replaceEl);

			if (!options.doNotLoad) {
				node.load();
			}
		}

		return component;
	}

	/**
	 *Detaches component from the node tree
	 *
	 * @param {*} id
	 * @returns
	 * @memberof ComponentFactory
	 */
	detach(id) {
		const comp = this.get(id);
		if (!comp) {
			return;
		}

		// Remove from tree and return resulting node to re-attach later
		return this.nodeTreeService.detachComponent(comp);
	}

	/**
	 *Destroys and removes the component
	 *
	 * @param {*} id
	 * @returns
	 * @memberof ComponentFactory
	 */
	destroy(id) {
		const component = this.get(id);
		if (!component) {
			return;
		}

		// Make sure this isn't the root component
		if (id === this.nodeTreeService.applicationTree.component.id) {
			// Console.info(`Destroy called on Root Component ${id}. The component was not destroyed.`);
			return;
		}

		// Remove from tree and DOM
		this.nodeTreeService.removeComponent(component);

		super.destroy(id);
	}
}

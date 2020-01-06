import {NodeTreeService} from '../services/node-tree.service';
import {Component} from '../models/component';
import {FactoryService} from '../services/factory.service';
import {NodeTree} from '../models/node-tree';
import {Factory} from './factory';

/**
 * Generates and manages components
 *
 * @export
 * @class ComponentFactory
 * @extends {Factory}
 */
export class ComponentFactory extends Factory {
	/**
	 *Creates an instance of ComponentFactory.
	 *
	 * @param {Component} constructorFn - Component to be created in this factory
	 * @param {FactoryService} factoryService - Factory Service created from Module Factory
	 * @memberof ComponentFactory
	 */
	constructor(constructorFn, factoryService) {
		super(constructorFn, factoryService);
		this.nodeTreeService = this.factoryService.get(NodeTreeService);
	}

	/**
	 *Sets the root component
	 *
	 * @memberof ComponentFactory
	 */
	createRoot() {
		const comp = this.create(null, null, {parentEl: document.body, doNotLoad: true, isRoot: true});
		this.nodeTreeService.setRoot(comp);
		this.nodeTreeService.applicationTree.load();
	}

	/**
	 *Creates a component
	 *
	 * @param {Component} [parent] - Parent component to append to
	 * @param {*} [data] - Data to be passed to the component
	 * @param {{parentEl: HTMLElement, replaceEl: HTMLElement}} [options] - ParentEl: Must be provided to append. ReplaceEl: Element to replace on append
	 * @returns {Component} - Component created
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
	 * @param {string} id - Id of component to be detached
	 * @returns {NodeTree} - Returns node of component, if found
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
	 * @param {string} id - Id of component to be destroyed
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

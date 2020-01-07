import {NodeTreeService} from '../services/node-tree.service';
import {Component} from '../models/component';
import {NodeTree} from '../models/node-tree';
import {Factory} from './factory';

/**
 * Generates and manages components
 *
 * @class ComponentFactory
 * @augments {Factory}
 */
export class ComponentFactory extends Factory {
	constructor(constructorFn, vivi) {
		super(constructorFn, vivi);
		this.nodeTreeService = this.vivi.get(NodeTreeService);
	}

	/**
	 * Creats and sets the root component
	 *
	 * @memberof ComponentFactory
	 */
	createRoot() {
		const comp = super.create();
		comp.append(document.body);

		this.nodeTreeService.setRoot(comp);
		this.nodeTreeService.applicationTree.load();
	}

	/**
	 *Creates a component
	 *
	 * @param {Component} [parent] - Parent component to append to
	 * @param {*} [data] - Data to be passed to the component
	 * @param {{parentEl: HTMLElement, replaceEl: HTMLElement, doNotLoad}} [options]
	 * - parentEl: Element to anchor component to. Must be provided to append and load component.
	 * - replaceEl: Element to replace on append
	 * - doNotLoad: Do not fire load after creating. Often used for children components
	 * @returns {Component} - Component created
	 * @memberof ComponentFactory
	 */
	create(parent, data, options) {
		const component = super.create(data);

		// Create nodeTree for component
		const node = this.nodeTreeService.addComponent(parent, component);

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
			this.vivi.get('LoggerService').log(`Destroy called on Root Component ${id}. The component was not destroyed.`);
			return;
		}

		// Remove from tree and DOM
		this.nodeTreeService.removeComponent(component);

		super.destroy(id);
	}
}

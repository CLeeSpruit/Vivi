import {NodeTree} from '../models';
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
		this.nodes = this.vivi.get('Nodes');
	}

	/**
	 * Creats and sets the root component
	 *
	 * @returns {*} - Returns root component created
	 * @memberof ComponentFactory
	 */
	createRoot() {
		const comp = super.create();
		const node = new NodeTree(comp);
		this.nodes.setRoot(node);
		comp.append(document.body);
		node.load();
		return comp;
	}

	/**
	 *Creates a component
	 *
	 * @param {*} parent - Parent component to append to
	 * @param {*} [data] - Data to be passed to the component
	 * @param {{parentEl: HTMLElement, replaceEl: HTMLElement, doNotLoad: boolean}} [options]
	 * - parentEl: Element to anchor component to. Must be provided to append and load component.
	 * - replaceEl: Element to replace on append
	 * - doNotLoad: Do not fire load after creating. Often used for children components
	 * @todo Check: If a parentComp is provided, but a parentEl is not, should it just append to parentComp.element by default?
	 * @todo Check: ParentEl seems to be common. Should it be normal param rather than in options?
	 * @returns {*} - Component created
	 * @memberof ComponentFactory
	 */
	create(parent, data, options) {
		if (!parent) {
			this.vivi.get('Logger').error('Create: No parent given. Component has not been created. To create a root component, use createRoot().', [
				{key: 'Parent', value: parent}
			]);
			return;
		}

		const component = super.create(data);

		// Setup node tree
		const node = new NodeTree(component);
		this.nodes.addNodeToComponent(parent.id, node);

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
	 * @todo Revist: Detach vs Destroy behavior. Is it needed?
	 * @todo Consider: should this only be called from the nodes service?
	 * @deprecated - Use nodes.detachComponent instead
	 */
	detach(id) {
		// Remove from tree and return resulting node to re-attach later
		return this.nodes.detachComponent(id);
	}

	/**
	 *Destroys and removes the component
	 *
	 * @param {string} id - Id of component to be destroyed
	 * @memberof ComponentFactory
	 * @todo Revist: Detach vs Destroy behavior. Is it needed?
	 */
	destroy(id) {
		// Remove from tree and DOM
		this.nodes.removeComponent(id);

		super.destroy(id);
	}
}

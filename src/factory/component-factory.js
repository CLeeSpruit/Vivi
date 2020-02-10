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
	 * - parentEl: Element to anchor component to. Defaults to parent.element if not provided.
	 * - replaceEl: Element to replace on append
	 * - doNotLoad: Do not fire load after creating. Often used for children components
	 * @todo Check: ParentEl seems to be common. Should it be normal param rather than in options?
	 * @returns {*} - Component created
	 * @memberof ComponentFactory
	 */
	create(parent, data, options) {
		options = options || {};
		if (!parent) {
			this.vivi.get('Logger').error('Create: No parent given. Component has not been created. To create a root component, use createRoot().', [
				{key: 'Parent', value: parent}
			]);
			return;
		}

		const component = super.create(data);

		// Create nodeTree for component
		const node = new NodeTree(component);
		const parentNode = this.nodes.getNode(parent.id);
		parentNode.addChild(node);

		const anchorPoint = options.parentEl || parent.element;
		if (anchorPoint) {
			component.append(anchorPoint, options.replaceEl);

			if (!options.doNotLoad) {
				node.load();
			}
		}

		return component;
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
			this.vivi.get('Logger').warn(`Destroy: Component ${id} was not found.`);
			return;
		}

		// Make sure this isn't the root component (also double check if a root has even been attached)
		if (this.nodes.applicationTree && id === this.nodes.applicationTree.component.id) {
			this.vivi.get('Logger').info(`Destroy called on Root Component ${id}. The component was not destroyed.`);
			return;
		}

		// Remove from tree and DOM
		this.nodes.removeComponent(component);
	}
}

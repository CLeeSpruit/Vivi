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
		comp.append(document.body);

		this.nodes.setRoot(comp);
		this.nodes.applicationTree.load();
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

		// Create nodeTree for component
		const node = this.nodes.addComponent(parent, component);

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
	 * @returns {*} - Returns node of component, if found
	 * @memberof ComponentFactory
	 * @todo Revist: Detach vs Destroy behavior. Is it needed?
	 */
	detach(id) {
		const comp = this.get(id);
		if (!comp) {
			this.vivi.get('Logger').warn(`Detach: Component ${id} was not found.`);
			return;
		}

		// Remove from tree and return resulting node to re-attach later
		return this.nodes.detachComponent(comp);
	}

	/**
	 *Destroys and removes the component
	 *
	 * @param {string} id - Id of component to be destroyed
	 * @memberof ComponentFactory
	 * @todo Revist: Detach vs Destroy behavior. Is it needed?
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

		super.destroy(id);
	}
}

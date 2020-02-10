import {Service} from '../models/service';

/**
 * Service that handles NodeTrees
 *
 * @class Nodes
 * @augments {Service}
 */
export class Nodes extends Service {
	/**
	 * Sets the root component of the application
	 *
	 * @param {*} rootNode - Component to set the root to
	 * @memberof Nodes
	 */
	setRoot(rootNode) {
		this.applicationTree = rootNode;
	}

	/**
	 * Returns NodeTree of component.
	 * Note: Root needs to be set before getting a node
	 *
	 * @param {string} id - componentId to return the nodeTree for
	 * @returns {NodeTree} - Resulting NodeTree, if found
	 * @memberof Nodes
	 */
	getNode(id) {
		if (!this.applicationTree) {
			this.vivi.get('Logger').warn(
				'Error trying to get Node: No application tree set',
				[{key: 'Nodes', value: this}, {key: 'ComponentId', value: id}]
			);
			return;
		}

		if (id === this.applicationTree.component.id) {
			return this.applicationTree;
		}

		return this.applicationTree.findChild(id, true);
	}

	/**
	 * Triggers node destroy
	 *
	 * @param {id} id - Component to be destroyed
	 * @memberof Nodes
	 */
	removeComponent(id) {
		const node = this.getNode(id);

		if (!node) {
			return;
		}

		node.destroy();
	}

	/**
	 * Detaches the component from the DOM
	 *
	 * @param {*} comp - Component to be detached
	 * @returns {*} - Detached node
	 * @memberof Nodes
	 */
	detachComponent(comp) {
		const parent = this.applicationTree.findParentOf(comp.id);
		if (!parent) {
			this.vivi.get('Logger').warn(`Error detaching node: ${comp.id}. Node not found in tree`);
			return;
		}

		comp.detach();

		return parent.removeChild(comp);
	}
}

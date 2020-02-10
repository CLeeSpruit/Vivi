import {mapFind} from '@cspruit/array-like-map';

/**
 * Wraps components in a recursive tree that has other nodes for children
 *
 * @class NodeTree
 */
export class NodeTree {
	constructor(comp) {
		this.children = new Map();
		this.component = comp;
	}

	/**
	 * Adds component, converts it to a NodeTree, and adds it as a child
	 *
	 * @param {NodeTree} node - Node to add as a child
	 * @memberof NodeTree
	 */
	addChild(node) {
		this.children.set(node.component.id, node);
	}

	/**
	 * Removes node tree from children and returns the node, if found
	 *
	 * @param {string} id - ComponentId in children to be removed
	 * @returns {NodeTree} - Component's node removed, if found
	 * @memberof NodeTree
	 */
	removeChild(id) {
		const child = this.children.get(id);
		this.children.delete(id);
		return child;
	}

	/**
	 * Returns child node tree or component if found
	 *
	 * @param {string} id - Component Id
	 * @param {boolean} [deepSearch] - If true, search down the tree in addition to direct children
	 * @returns {NodeTree} - If found, will return the nodeTree or Component
	 * @memberof NodeTree
	 */
	findChild(id, deepSearch) {
		let foundChild = this.children.get(id);

		if (!foundChild && deepSearch) {
			foundChild = mapFind(this.children, value => value.findChild(id, true));
		}

		return foundChild;
	}

	/**
	 * Returns parent Node of component
	 *
	 * @param {string} id - Component Id
	 * @returns {NodeTree} - If found, returns node that is the parent of the component
	 * @memberof NodeTree
	 */
	findParentOf(id) {
		if (this.hasChild(id)) {
			return this;
		}

		return mapFind(this.children, child => Boolean(child.findParentOf(id)));
	}

	/**
	 * Returns if component is found in children
	 *
	 * @param {string} id - Component Id
	 * @returns {boolean} - Returns true if found
	 * @memberof NodeTree
	 */
	hasChild(id) {
		return Boolean(this.children.get(id));
	}

	/**
	 * Runs load hook of component and chilren
	 * Called By: Factory.create
	 *
	 * @memberof NodeTree
	 */
	load() {
		this.component.startLoad();
		this.children.forEach(child => child.load());
	}

	/**
	 * Runs destroy hook of component and children
	 *
	 * @memberof NodeTree
	 */
	destroy() {
		this.children.forEach(child => child.destroy());
		this.children.clear();
		this.component.destroy();
	}
}

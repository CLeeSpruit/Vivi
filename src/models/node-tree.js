import {Component} from './component';

/**
 * Wraps components in a recursive tree that has other nodes for children
 *
 * @class NodeTree
 */
export class NodeTree {
	constructor(comp) {
		this.children = [];
		this.component = comp;
	}

	/**
	 * Adds component, converts it to a NodeTree, and adds it as a child
	 *
	 * @param {Component} comp - Component to add as a child
	 * @returns {NodeTree} - Resulting node from component added
	 * @memberof NodeTree
	 */
	addChild(comp) {
		const node = new NodeTree(comp);
		this.children.push(node);

		return node;
	}

	/**
	 * Removes node tree from children
	 *
	 * @param {Component} comp - Component in children to be removed
	 * @returns {Component} - Component removed, if found
	 * @memberof NodeTree
	 */
	removeChild(comp) {
		const foundIndex = this.children.findIndex(child => child.component.id === comp.id);
		if (foundIndex === -1) {
			return;
		}

		return this.children.splice(foundIndex, 1)[0];
	}

	/**
	 * Returns child node tree or component if found
	 *
	 * @param {string} id - Component Id
	 * @param {boolean} [deepSearch] - If true, search down the tree in addition to direct children
	 * @param {boolean} [returnNode] - Returns NodeTree instead of component
	 * @returns {NodeTree | Component} - If found, will return the nodeTree or Component
	 * @memberof NodeTree
	 */
	findChild(id, deepSearch, returnNode) {
		const child = this.children.find(child => {
			return deepSearch ?
				child.component.id === id || Boolean(child.findChild(id, true)) :
				child.component.id === id;
		});
		if (returnNode) {
			return child;
		}

		return child ? child.component : null;
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

		return this.children.find(child => Boolean(child.findParentOf(id)));
	}

	/**
	 * Returns if component is found in children
	 *
	 * @param {string} id - Component Id
	 * @returns {boolean} - Returns true if found
	 * @memberof NodeTree
	 */
	hasChild(id) {
		return Boolean(this.children.find(child => child.component.id === id));
	}

	/**
	 * Runs load hook of component and chilren
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
		this.children = [];
		this.component.destroy();
	}
}

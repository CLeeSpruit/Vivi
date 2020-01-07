import {NodeTree} from '../models/node-tree';
import {Service} from '../models/service';
import {Component} from '../models/component';

/**
 * Service that handles and creates NodeTrees
 *
 * @class NodeTreeService
 * @augments {Service}
 */
export class NodeTreeService extends Service {
	/**
	 * Sets the root component of the application
	 *
	 * @param {Component} rootComponent - Component to set the root to
	 * @memberof NodeTreeService
	 */
	setRoot(rootComponent) {
		this.applicationTree = new NodeTree(rootComponent);
	}

	/**
	 * Returns NodeTree of component
	 *
	 * @param {Component} comp - component to return the nodeTree for
	 * @returns {NodeTree} - Resulting NodeTree, if found
	 * @memberof NodeTreeService
	 */
	getNode(comp) {
		if (!this.applicationTree) {
			return;
		}

		if (comp.id === this.applicationTree.component.id) {
			return this.applicationTree;
		}

		return this.applicationTree.findChild(comp.id, true, true);
	}

	/**
	 * Adds NodeTree to a Component
	 *
	 * @param {Component} parentComp - Parent component to add the child to. Must be already added to the tree.
	 * @param {NodeTree} childNode - Child node that is added
	 * @returns {void}
	 * @memberof NodeTreeService
	 */
	addNodeToComponent(parentComp, childNode) {
		const parentNode = this.getNode(parentComp);
		if (!parentNode) {
			this.vivi.get(
				'LoggerService').logError(`Adding child node:${childNode.component.componentName} to parent node:${parentComp.componentName} failed. Parent node not found in tree.`,
				[{key: 'parent component', parentComp}, {key: 'child node', childNode}]
			);
			return;
		}

		parentNode.children.push(childNode);
	}

	/**
	 * Runs the load hook for node and it's chilren. Will not load the component if it has not been added to the tree.
	 *
	 * @param {Component} comp - Component that has already been added to the tree
	 * @returns {void}
	 * @memberof NodeTreeService
	 */
	loadComponent(comp) {
		const node = this.getNode(comp);
		if (!node) {
			this.vivi.get('LoggerService').logError(`Error loading node: ${comp.componentName}. Could not find node in tree.`, [{key: 'component being loaded', value: comp}]);
			return;
		}

		node.load();
	}

	/**
	 * Add component to parent component. If no parentNode is declared, child is added to application tree.
	 *
	 * @param {Component} [parentComp] - Component to be appended to
	 * @param {Component} childComp - Component to be appended
	 * @returns {NodeTree} - Resulting nodeTree of the child
	 * @memberof NodeTreeService
	 * @todo Swap parentComp and child comp since parentComp is optional
	 */
	addComponent(parentComp, childComp) {
		if (!this.applicationTree && parentComp) {
			this.vivi.get('LoggerService').logError(
				`Error adding child node: ${childComp.componentName}. No root component has been set yet.`,
				[{key: 'Parent Component', value: parentComp}, {key: 'Child Component', value: childComp}]
			);
			return;
		}

		let parentNode;
		if (parentComp) {
			parentNode = this.getNode(parentComp);
			if (!parentNode) {
				this.vivi.get(
					'LoggerService').logError(`Adding child node:${childComp.componentName} to parent node:${parentComp.componentName} failed. Parent node not found in tree.`,
					[{key: 'Parent Component', value: parentNode}, {key: 'Child Component', value: childComp}]
				);
				return;
			}
		} else {
			parentNode = this.applicationTree;
			this.vivi.get('LoggerService').log(`No parent provided for ${childComp.componentName}. Appending to root.`);
		}

		return parentNode.addChild(childComp);
	}

	/**
	 * Triggers node destroy
	 *
	 * @param {Component} comp - Component to be destroyed
	 * @returns {void}
	 * @memberof NodeTreeService
	 */
	removeComponent(comp) {
		const node = this.getNode(comp);

		if (!node) {
			return;
		}

		node.destroy();
	}

	/**
	 * Detaches the component from the DOM
	 *
	 * @param {Component} comp - Component to be detached
	 * @returns {NodeTree} - Detached node
	 * @memberof NodeTreeService
	 */
	detachComponent(comp) {
		const parent = this.applicationTree.findParentOf(comp.id);
		if (!parent) {
			this.vivi.get('LoggerService').logWarning(`Error detaching node: ${comp.id}. Node not found in tree`);
			return;
		}

		comp.detach();

		return parent.removeChild(comp);
	}
}

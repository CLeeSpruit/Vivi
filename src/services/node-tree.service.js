import {NodeTree} from '../models/node-tree';
import {Service} from '../models/service';

export class NodeTreeService extends Service {
	/**
	 *Sets the root component of the application
	 *
	 * @param {Component} rootComponent
	 * @memberof NodeTreeService
	 */
	setRoot(rootComponent) {
		this.applicationTree = new NodeTree(rootComponent);
	}

	/**
	 *Returns NodeTree of component
	 *
	 * @param {Component} comp
	 * @returns {NodeTree}
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
	 *Adds NodeTree to a Component
	 *
	 * @param {Component} parentComp
	 * @param {NodeTree} childNode
	 * @returns
	 * @memberof NodeTreeService
	 */
	addNodeToComponent(parentComp, childNode) {
		const parentNode = this.getNode(parentComp);
		if (!parentNode) {
			console.error(`Adding child node:${childNode.component.componentName} to parent node:${parentComp.componentName} failed. Parent node not found in tree.`);
			return;
		}

		parentNode.children.push(childNode);
	}

	/**
	 *Runs the load hook for node and it's chilren
	 *
	 * @param {Component} comp
	 * @returns
	 * @memberof NodeTreeService
	 */
	loadComponent(comp) {
		const node = this.getNode(comp);
		if (!node) {
			console.error(`Error loading node: ${comp.componentName}. Could not find node in tree.`);
			return;
		}

		node.load();
	}

	/**
	 *Add component to parent component. If no parentNode is declared, child is added to application tree.
	 *
	 * @param {Component} parentComp
	 * @param {Component} childComp
	 * @returns {NodeTree}
	 * @memberof NodeTreeService
	 */
	addComponent(parentComp, childComp) {
		if (!this.applicationTree && parentComp) {
			console.error(`Error adding child node: ${childComp.componentName}. No root component has been set yet.`);
			return;
		}

		let parentNode;
		if (parentComp) {
			parentNode = this.getNode(parentComp);
			if (!parentNode) {
				console.error(`Adding child node:${childComp.componentName} to parent node:${parentComp.componentName} failed. Parent node not found in tree.`);
				return;
			}
		} else {
			parentNode = this.applicationTree;
			// @todo Make Errors, Warnings, Info configurable
			// console.info(`No parent provided for ${childComp.componentName}. Appending to root.`);
		}

		return parentNode.addChild(childComp);
	}

	/**
	 *Triggers node destroy
	 *
	 * @param {Component} comp
	 * @returns
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
	 *Detaches the component from the DOM
	 *
	 * @param {*} comp
	 * @returns {NodeTree}
	 * @memberof NodeTreeService
	 */
	detachComponent(comp) {
		const parent = this.applicationTree.findParentOf(comp.id);
		if (!parent) {
			console.error(`Error detaching node: ${comp.id}. Node not found in tree`);
			return;
		}

		comp.detach();

		return parent.removeChild(comp);
	}
}

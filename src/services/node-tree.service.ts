import { Service } from '../models/service.class';
import { Component } from '../models/component.class';
import { NodeTree } from '../models/node-tree';

export class NodeTreeService extends Service {
    applicationTree: NodeTree;

    setRoot(rootComponent: Component) {
        this.applicationTree = new NodeTree(rootComponent);
    }

    getNode(comp: Component): NodeTree {
        if (!this.applicationTree) { return; }
        if (comp.id === this.applicationTree.component.id) {
            return this.applicationTree;
        }
        return this.applicationTree.findChild(comp.id, true, true) as NodeTree;
    }

    addNodeToComponent(parentComp: Component, childNode: NodeTree) {
        const parentNode = this.getNode(parentComp);
        if (!parentNode) {
            console.error(`Adding child node:${childNode.component.componentName} to parent node:${parentComp.componentName} failed. Parent node not found in tree.`);
            return;
        }

        parentNode.children.push(childNode);
    }

    loadComponent(comp: Component): void {
        const node = this.getNode(comp);
        if (!node) {
            console.error(`Error loading node: ${comp.componentName}. Could not find node in tree.`);
            return;
        }
        node.load();
    }

    addComponent(parentComp: Component, childComp: Component): NodeTree {
        if (!this.applicationTree && parentComp) {
            console.error(`Error adding child node: ${childComp.componentName}. No root component has been set yet.`);
            return;
        }

        let parentNode: NodeTree;
        if (!parentComp) {
            parentNode = this.applicationTree;
            // @todo Make Errors, Warnings, Info configurable
            // console.info(`No parent provided for ${childComp.componentName}. Appending to root.`);
        } else {
            parentNode = this.getNode(parentComp);
            if (!parentNode) {
                console.error(`Adding child node:${childComp.componentName} to parent node:${parentComp.componentName} failed. Parent node not found in tree.`);
                return;
            }
        }

        return parentNode.addChild(childComp);
    }

    removeComponent(comp: Component) {
        const node = this.getNode(comp);

        if (!node) return;
        node.destroy();
    }

    detachComponent(comp: Component): NodeTree {
        const parent = this.applicationTree.findParentOf(comp.id);
        if (!parent) {
            console.error(`Error detaching node: ${comp.id}. Node not found in tree`);
            return;
        }
        comp.detach();

        return parent.removeChild(comp);
    } 
}
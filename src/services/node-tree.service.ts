import { Service } from '../models/service.class';
import { Component } from '../models/component.class';
import { NodeTree } from '../models/node-tree';

export class NodeTreeService extends Service {
    private applicationTree: NodeTree;

    setRoot(rootComponent) {
        this.applicationTree = new NodeTree(rootComponent);
    }

    addComponent(parent: Component, child: Component) {
        const parentNode = this.applicationTree.findChild(parent.id, true, true) as NodeTree;
        if (!parentNode) {
            console.warn(`Adding child node:${child.componentName} to parent node:${parent.componentName} failed. Parent node not found in tree.`);
            return;
        }

        parentNode.addChild(child);
    }

    removeComponent(comp: Component) {
        const node = this.applicationTree.findChild(comp.id, true, true);
        if (!node) {
            console.warn(`Removing node:${comp.componentName} failed. Node not found in tree.`);
            return;
        }
        node.destroy();
    }
}
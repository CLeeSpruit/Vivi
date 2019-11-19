import { Component } from './component.class';

export class NodeTree {
    component: Component;
    children = new Array<NodeTree>();

    constructor(comp: Component) {
        this.component = comp;
    }

    addChild(comp: Component): NodeTree {
        const node = new NodeTree(comp);
        this.children.push(node);

        return node;
    }

    findChild(id: string, deepSearch?: boolean, returnNode?: boolean): Component | NodeTree {
        const child = this.children.find(child => {
            return deepSearch ? 
                child.component.id === id || child.findChild(id, true) :
                child.component.id === id
        });
        if (returnNode) return child;
        return child ? child.component : null;
    }

    destroy() {
        this.children.forEach(child => child.destroy());
    }
}
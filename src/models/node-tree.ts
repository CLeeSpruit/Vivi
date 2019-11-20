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

    removeChild(comp: Component): NodeTree {
        const foundIndex = this.children.findIndex(child => child.component.id === comp.id);
        if (foundIndex === -1) return;
        return this.children.splice(foundIndex, 1)[0];
    }

    findChild(id: string, deepSearch?: boolean, returnNode?: boolean): Component | NodeTree {
        const child = this.children.find(child => {
            return deepSearch ? 
                child.component.id === id || !!child.findChild(id, true) :
                child.component.id === id
        });
        if (returnNode) return child;
        return child ? child.component : null;
    }

    findParentOf(id: string): NodeTree {
        if (this.hasChild(id)) return this;
        return this.children.find(child => !!child.findParentOf(id));
    }

    hasChild(id: string): boolean {
        return !!this.children.find(child => child.component.id === id);
    }

    load() {
        this.component.startLoad();
        this.children.forEach(child => child.load());
    }

    destroy() {
        this.children.forEach(child => child.destroy());
        this.children = [];
        this.component.destroy();
    }
}
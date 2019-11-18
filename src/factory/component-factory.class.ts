import { ViviServiceFactory } from './';
import { Component, Service } from '../models';
import { NodeTreeService } from '../services';

// @todo Rename to ServiceFactory
// @todo Use generic T for Typings or remove
export class ViviComponentFactory<T> {
    private components: Map<string, Component> = new Map<string, Component>();
    private counter = 1;

    constructor(
        private constructor: new (...args) => Component,
        private services: Array<ViviServiceFactory<Service>> = new Array<ViviServiceFactory<Service>>(),
        private nodeTreeService?: NodeTreeService
    ) {
        //
    }

    createRoot(nodeTreeService: NodeTreeService): Component {
        this.nodeTreeService = nodeTreeService;
        const comp = this.create(null, null, true);
        this.nodeTreeService.setRoot(comp);
        return comp;
    }

    create(parent: Component, data?: Object, isRoot?: boolean): Component {
        // Create
        const component = new this.constructor(...this.services.map(service => service.get()));
        component.setData(this.counter, data);
        this.counter++;

        // Record in map and tree
        this.components.set(component.id, component);

        if (!isRoot) {
            this.nodeTreeService.addComponent(parent, component);
        }

        return component;
    }

    destroy(id: string) {
        const component = this.get(id);

        if (!component) {
            console.error(`${this.constructor.name}: No component found with id: ${id}`);
            return;
        }

        // Run cleanup
        component.destroy();

        // Remove from the DOM
        const node = document.getElementById(id);
        if (node) {
            node.remove();
        }

        // Remove from the map
        this.components.delete(id);

        // Remove from tree
        this.nodeTreeService.removeComponent(component);
    }

    destroyAll() {
        this.components.forEach(comp => this.destroy(comp.id));
    }

    get(id?: string): Component {
        if (id) {
            // @todo: ComponentFactory - Throw error if id doesn't exist
            return this.components.get(id);
        } else {
            // @todo: ComponentFactory - throw error (or warning) if this.components.length is 0
            // @todo: ComponentFactory - Grab the last component created
            return Array.from(this.components.values())[0] || null;
        }
    }

    setTree(nodeTree: NodeTreeService) {
        
    }
}
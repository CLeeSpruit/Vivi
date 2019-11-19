import { ServiceFactory } from './service-factory.class';
import { Component, Service } from '../models';
import { NodeTreeService } from '../services';

export class ComponentFactory<T extends Component = Component> {
    private components: Map<string, T> = new Map<string, T>();
    private counter = 1;

    constructor(
        private constructor: new (...args) => T,
        private services: Array<ServiceFactory> = new Array<ServiceFactory>(),
        private nodeTreeService?: NodeTreeService
    ) {
        //
    }

    createRoot(nodeTreeService: NodeTreeService): T {
        this.nodeTreeService = nodeTreeService;
        const comp = this.create(null, null, true);
        this.nodeTreeService.setRoot(comp);
        return comp;
    }

    create(parent: Component, data?: Object, isRoot?: boolean): T {
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

    get(id?: string): T {
        if (id) {
            // @todo: ComponentFactory - Throw error if id doesn't exist
            return this.components.get(id);
        } else {
            // @todo: ComponentFactory - throw error (or warning) if this.components.length is 0
            // @todo: ComponentFactory - Grab the last component created
            return Array.from(this.components.values())[0] || null;
        }
    }
}
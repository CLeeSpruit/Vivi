export class ComponentFactory {
    components = new Map();
    counter = 1;
    componentConstructor;
    services;
    nodeTreeService;

    constructor(
        constructor,
        services,
        nodeTreeService
    ) {
        this.componentConstructor = constructor;
        this.services = services || new Array();
        this.nodeTreeService = nodeTreeService;
    }

    createRoot(nodeTreeService) {
        this.nodeTreeService = nodeTreeService;
        const comp = this.create(null, null, { parentEl: document.body, doNotLoad: true, isRoot: true });
        this.nodeTreeService.setRoot(comp);
        this.nodeTreeService.applicationTree.load();
    }

    create(parent, data, options) {
        // Create
        const component = new this.componentConstructor(...this.services.map(service => service.get()));
        component.setData(this.counter, data);
        this.counter++;

        // Record in map and tree
        this.components.set(component.id, component);

        let node;
        if (!options || !options.isRoot) {
            node = this.nodeTreeService.addComponent(parent, component);
        }

        if (options && options.parentEl) {
            component.append(options.parentEl, options.replaceEl);

            if (!options.doNotLoad) {
                node.load();
            }
        }

        return component;
    }
    
    detach(id) {
        const comp = this.get(id);
        if (!comp) return;

        // Remove from tree and return resulting node to re-attach later
        return this.nodeTreeService.detachComponent(comp);
    }

    destroy(id) {
        const component = this.get(id);
        if (!component) return;

        // Make sure this isn't the root component
        if (id === this.nodeTreeService.applicationTree.component.id) {
            // console.info(`Destroy called on Root Component ${id}. The component was not destroyed.`);
            return;
        }

        // Remove from tree and DOM
        this.nodeTreeService.removeComponent(component);

        // Remove from the map
        this.components.delete(id);
    }

    destroyAll() {
        this.components.forEach(comp => this.destroy(comp.id));
    }

    get(id) {
        if (id) {
            const comp = this.components.get(id);
            if (!comp) {
                console.error(`${this.constructor.name}: No component found with id: ${id}`);
                return;
            }
            return comp;
        } else {
            // @todo: ComponentFactory - throw error (or warning) if this.components.length is 0
            return Array.from(this.components.values())[this.components.size - 1] || null;
        }
    }
}
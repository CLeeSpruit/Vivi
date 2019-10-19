import { ViviServiceFactory, ViviComponentFactory } from './';
import { Component, ViviComponentConstructor, ViviServiceConstructor, Service } from '../models';
import { loadViviServices } from '../services/load-services.static';

export interface ViviFactoryConstructor {
    serviceConstructors?: Array<ViviServiceConstructor<Service>>,
    componentConstructors?: Array<ViviComponentConstructor<Component>>,
    rootComponent?: new (...args) => Component
}

export class ModuleFactory {
    services: Map<string, ViviServiceFactory<Service>> = new Map<string, ViviServiceFactory<Service>>();
    components: Map<string, ViviComponentFactory<Component>> = new Map<string, ViviComponentFactory<Component>>();

    constructor(
        module: ViviFactoryConstructor
    ) {
        window.vivi = this;

        // Append Vivi services - these should be before any custom services
        if (!module.serviceConstructors) {
            module.serviceConstructors = loadViviServices;
        } else {
            module.serviceConstructors.unshift(...loadViviServices);
        }

        // Init Services
        module.serviceConstructors.forEach(serviceConstructor => {
            let prereqArr = [];
            if (serviceConstructor.prereqArr) {
                prereqArr = serviceConstructor.prereqArr.map(prereq => {
                    return this.services.get(prereq.name);
                });
            }
            this.services.set(serviceConstructor.constructor.name, new ViviServiceFactory(serviceConstructor.constructor, prereqArr));
        });

        // Init Components
        if (module.componentConstructors) {
            module.componentConstructors.forEach(constructor => {
                let serviceArr = [];
                if (constructor.services) {
                    serviceArr = constructor.services.map(service => {
                        return this.services.get(service.name);
                    });
                }
                this.components.set(constructor.constructor.name, new ViviComponentFactory(constructor.constructor, serviceArr));
            });
        }

        // Mount root component
        if (module.rootComponent) {
            const root = this.getFactory(module.rootComponent).create() as Component;
            root.append();
        }

        // Initialize
        this.start();
    }

    get(constuctor: new (...args) => (Component | Service), id?: string): Component | Service {
        const name = constuctor.name;
        return this.getByString(name, id);
    }

    // Exposed for Debugging only
    getByString(name: string, id?: string): Component | Service {
        const matches = name.match(/(.*)(Component|Service)$/);
        if (matches && matches[2] && matches[2] === 'Service') {
            return this.services.get(name).get(id);
        }
        if (matches && matches[2] && matches[2] === 'Component') {
            return this.components.get(name).get(id);
        }
        throw 'No service or component for ' + name;
    }

    getFactory(constuctor: new (...args) => (Component | Service)): ViviComponentFactory<Component> | ViviServiceFactory<Service> {
        const name = constuctor ? constuctor.name : '(not found)';
        return this.getFactoryByString(name);
    }

    getFactoryByString(name: string): ViviComponentFactory<Component> | ViviServiceFactory<Service> {
        const matches = name.match(/(.*)(Component|Service)$/);
        if (matches && matches[2] && matches[2] === 'Service') {
            return this.services.get(name);
        }
        if (matches && matches[2] && matches[2] === 'Component') {
            return this.components.get(name);
        }
        throw 'No service or component for ' + name;
    }

    getComponentRegistry(): Array<string> {
        return Array.from(this.components.keys());
    }

    start() {
        // Placeholder
    }
}
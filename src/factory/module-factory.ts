import { ViviServiceFactory, ViviComponentFactory } from './';
import { Component, ViviComponentConstructor, ViviServiceConstructor, Service } from '../models';
import { SystemService } from '../services/system.service';
import { loadViviServices } from '../services/load-services.static';

export interface ViviFactoryConstructor {
    serviceConstructors?: Array<ViviServiceConstructor<Service>>,
    componentConstructors?: Array<ViviComponentConstructor<Component>>,
    rootComponent?: new (...args) => Component,
    // TODO: Find a more graceful solution to finding related files
    baseDirectory?: string
}

export class ModuleFactory {
    services: Map<string, ViviServiceFactory<Service>> = new Map<string, ViviServiceFactory<Service>>();
    components: Map<string, ViviComponentFactory<Component>> = new Map<string, ViviComponentFactory<Component>>();
    system: SystemService;

    constructor(
        module: ViviFactoryConstructor
    ) {
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
                let childrenArr = [];
                if (constructor.children) {
                    childrenArr = constructor.children.map(child => {
                        return this.components.get(child.name);
                    });
                }

                let serviceArr = [];
                if (constructor.services) {
                    serviceArr = constructor.services.map(service => {
                        return this.services.get(service.name);
                    });
                }
                this.components.set(constructor.constructor.name, new ViviComponentFactory(constructor.constructor, serviceArr, childrenArr));
            });
        }

        // Mount root component
        if (module.rootComponent) {
            this.getFactory(module.rootComponent).create({ append: true });
        }

        // Initialize
        this.start();
    }

    get(constuctor: new (...args) => any, id?: string): Component | any {
        const name = constuctor.name;
        return this.getByString(name, id);
    }

    // Exposed for Debugging only
    getByString(name: string, id?: string): Component | any {
        const matches = name.match(/(.*)(Component|Service)$/);
        if (matches && matches[2] && matches[2] === 'Service') {
            return this.services.get(name).get(id);
        }
        if (matches && matches[2] && matches[2] === 'Component') {
            return this.components.get(name).get(id);
        }
        throw 'No service or component for ' + name;
    }

    getFactory(constuctor: new (...args) => any, id?: string): ViviComponentFactory<Component> | ViviServiceFactory<Service> {
        const name = constuctor ? constuctor.name : '(not found)';
        const matches = name.match(/(.*)(Component|Service)$/);
        if (matches && matches[2] && matches[2] === 'Service') {
            return this.services.get(name);
        }
        if (matches && matches[2] && matches[2] === 'Component') {
            return this.components.get(name);
        }
        throw 'No service or component for ' + name;
    }

    start() {
        window.vivi = this;
    }
}
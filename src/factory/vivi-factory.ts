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

// TODO: Rename ViviFactory to ModuleFactory
export class ViviFactory {
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
        // Init and fetch system since it's needed for the next step
        // TODO: Mesh the create and get functionality
        const system = this.getFactory(SystemService);
        this.system = system.create({ returnService: true });

        if (module.componentConstructors) {
            module.componentConstructors.forEach(constructor => {
                // TODO: Make each component read async
                // Turns a name like "SearchBarComponent" to look for "search-bar.component.xyz"
                const dirname = constructor.constructor.name.replace('Component', '').replace(/\B(?=[A-Z])/, '-').toLowerCase();
                const styleFile = this.system.path.join(module.baseDirectory, dirname, dirname + '.component.scss');
                const templateFile = this.system.path.join(module.baseDirectory, dirname, dirname + '.component.html');
                // TODO: Make this file read fail more gracefully
                const style = this.system.fs.existsSync(styleFile) ? this.system.fs.readFileSync(styleFile, { encoding: 'utf-8' }) : '';
                const template = this.system.fs.existsSync(templateFile) ? this.system.fs.readFileSync(templateFile, { encoding: 'utf-8' }) : '';

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
                this.components.set(constructor.constructor.name, new ViviComponentFactory(constructor.constructor, template, style, serviceArr, childrenArr));
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